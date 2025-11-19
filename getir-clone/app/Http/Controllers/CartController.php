<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = $request->session()->get('cart', []);
        $cartItems = [];
        $total = 0;

        foreach ($cart as $productId => $quantity) {
            $product = Product::with('category')->find($productId);
            if ($product && $product->is_available) {
                $cartItems[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'subtotal' => $product->price * $quantity,
                ];
                $total += $product->price * $quantity;
            }
        }

        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems,
            'total' => $total,
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);
        
        if (!$product->is_available) {
            return back()->with('error', 'المنتج غير متوفر حالياً');
        }

        $cart = $request->session()->get('cart', []);
        $currentQuantity = $cart[$product->id] ?? 0;
        $newQuantity = $currentQuantity + $request->quantity;

        if ($newQuantity > $product->stock_quantity) {
            return back()->with('error', 'الكمية المطلوبة غير متوفرة في المخزون');
        }

        $cart[$product->id] = $newQuantity;
        $request->session()->put('cart', $cart);

        return back()->with('success', 'تم إضافة المنتج إلى السلة بنجاح');
    }

    public function update(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:0',
        ]);

        $product = Product::findOrFail($request->product_id);
        $cart = $request->session()->get('cart', []);

        if ($request->quantity == 0) {
            unset($cart[$product->id]);
        } else {
            if ($request->quantity > $product->stock_quantity) {
                return back()->with('error', 'الكمية المطلوبة غير متوفرة في المخزون');
            }
            $cart[$product->id] = $request->quantity;
        }

        $request->session()->put('cart', $cart);

        return back()->with('success', 'تم تحديث السلة بنجاح');
    }

    public function remove(Request $request, $productId)
    {
        $cart = $request->session()->get('cart', []);
        unset($cart[$productId]);
        $request->session()->put('cart', $cart);

        return back()->with('success', 'تم حذف المنتج من السلة');
    }

    public function clear(Request $request)
    {
        $request->session()->forget('cart');
        return back()->with('success', 'تم مسح السلة بنجاح');
    }
}
