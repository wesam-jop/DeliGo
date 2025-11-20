<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Store;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user->isAdmin() && !$user->isCustomer()) {
            if ($user->isStoreOwner()) {
                return redirect()->route('dashboard.store.orders');
            }
            abort(403);
        }

        $ordersQuery = Order::with(['store', 'orderItems.product'])
            ->orderBy('created_at', 'desc');

        if (!$user->isAdmin()) {
            $ordersQuery->where('user_id', $user->id);
        }

        $orders = $ordersQuery->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'delivery_address' => 'required|string|max:500',
            'delivery_latitude' => 'required|numeric',
            'delivery_longitude' => 'required|numeric',
            'customer_phone' => 'required|string|max:20',
            'notes' => 'nullable|string|max:500',
        ]);

        $cart = $request->session()->get('cart', []);
        
        if (empty($cart)) {
            return back()->with('error', 'السلة فارغة');
        }

        // العثور على أقرب متجر
        $nearestStore = $this->findNearestStore($request->delivery_latitude, $request->delivery_longitude);
        
        if (!$nearestStore) {
            return back()->with('error', 'لا يوجد متجر قريب من موقعك');
        }

        $defaultEta = (int) Setting::get('default_estimated_delivery_time', 15);
        $estimatedDeliveryTime = $nearestStore->estimated_delivery_time ?? $defaultEta;
        if (!$estimatedDeliveryTime) {
            $estimatedDeliveryTime = $defaultEta;
        }

        DB::beginTransaction();
        
        try {
            // إنشاء الطلب
            $order = Order::create([
                'user_id' => Auth::id(),
                'store_id' => $nearestStore->id,
                'status' => 'pending',
                'subtotal' => 0,
                'delivery_fee' => $nearestStore->delivery_fee,
                'tax_amount' => 0,
                'discount_amount' => 0,
                'total_amount' => 0,
                'payment_status' => 'pending',
                'payment_method' => 'cash',
                'delivery_address' => $request->delivery_address,
                'delivery_latitude' => $request->delivery_latitude,
                'delivery_longitude' => $request->delivery_longitude,
                'customer_phone' => $request->customer_phone,
                'notes' => $request->notes,
                'estimated_delivery_time' => $estimatedDeliveryTime,
            ]);

            $subtotal = 0;

            // إضافة عناصر الطلب
            foreach ($cart as $productId => $quantity) {
                $product = Product::find($productId);
                
                if ($product && $product->is_available && $quantity <= $product->stock_quantity) {
                    $itemTotal = $product->price * $quantity;
                    $subtotal += $itemTotal;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_price' => $product->price,
                        'quantity' => $quantity,
                        'total_price' => $itemTotal,
                    ]);

                    // تقليل المخزون
                    $product->decrement('stock_quantity', $quantity);
                }
            }

            // تحديث إجمالي الطلب
            $totalAmount = $subtotal + $nearestStore->delivery_fee;
            $order->update([
                'subtotal' => $subtotal,
                'total_amount' => $totalAmount,
            ]);

            // مسح السلة
            $request->session()->forget('cart');

            DB::commit();

            return redirect()->route('orders.show', $order)
                ->with('success', 'تم إنشاء الطلب بنجاح!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'حدث خطأ أثناء إنشاء الطلب');
        }
    }

    public function show(Order $order)
    {
        $this->ensureAuthorized($order);

        $order->load(['store', 'orderItems.product', 'deliveryDriver']);
        
        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

    public function cancel(Order $order)
    {
        $this->ensureAuthorized($order);

        if (!$order->canBeCancelled()) {
            return back()->with('error', 'لا يمكن إلغاء هذا الطلب');
        }

        DB::beginTransaction();
        
        try {
            // إرجاع المنتجات إلى المخزون
            foreach ($order->orderItems as $item) {
                $product = Product::find($item->product_id);
                if ($product) {
                    $product->increment('stock_quantity', $item->quantity);
                }
            }

            $order->update(['status' => 'cancelled']);
            
            DB::commit();

            return back()->with('success', 'تم إلغاء الطلب بنجاح');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'حدث خطأ أثناء إلغاء الطلب');
        }
    }

    private function findNearestStore($latitude, $longitude)
    {
        return Store::active()
            ->get()
            ->filter(function ($store) use ($latitude, $longitude) {
                return $store->isWithinDeliveryRadius($latitude, $longitude);
            })
            ->sortBy(function ($store) use ($latitude, $longitude) {
                return $store->calculateDistance($latitude, $longitude);
            })
            ->first();
    }

    private function ensureAuthorized(Order $order): void
    {
        $user = Auth::user();

        if (!$user || (!$user->isAdmin() && (int) $order->user_id !== (int) $user->id)) {
            abort(403, 'ليس لديك صلاحية للوصول إلى هذا الطلب');
        }
    }
}
