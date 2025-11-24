<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get customer dashboard statistics
     */
    public function customerStats(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isCustomer()) {
            return response()->json([
                'success' => false,
                'message' => 'غير مصرح لك بالوصول'
            ], 403);
        }

        $stats = [
            'total_orders' => $user->orders()->count(),
            'pending_orders' => $user->orders()->where('status', 'pending')->count(),
            'preparing_orders' => $user->orders()->whereIn('status', ['preparing', 'ready'])->count(),
            'delivered_orders' => $user->orders()->where('status', 'delivered')->count(),
            'cancelled_orders' => $user->orders()->where('status', 'cancelled')->count(),
            'total_spent' => (float) $user->orders()->where('status', 'delivered')->sum('total_amount'),
            'favorite_products_count' => $user->favoriteProducts()->count(),
            'delivery_locations_count' => $user->deliveryLocations()->count(),
        ];

        // Recent orders
        $recentOrders = $user->orders()
            ->with(['store', 'orderItems.product'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number ?? '#' . $order->id,
                    'status' => $order->status,
                    'total_amount' => (float) $order->total_amount,
                    'store' => $order->store ? [
                        'id' => $order->store->id,
                        'name' => $order->store->name,
                    ] : null,
                    'items_count' => $order->orderItems->sum('quantity'),
                    'created_at' => $order->created_at->toIso8601String(),
                ];
            });

        // Favorite products
        $favoriteProducts = $user->favoriteProducts()
            ->with('category')
            ->orderByDesc('favorite_products.created_at')
            ->limit(6)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => (float) $product->price,
                    'image' => $product->image,
                    'category' => $product->category ? [
                        'id' => $product->category->id,
                        'name' => $product->category->name,
                    ] : null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'recent_orders' => $recentOrders,
                'favorite_products' => $favoriteProducts,
            ]
        ]);
    }

    /**
     * Get store owner dashboard statistics
     */
    public function storeStats(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isStoreOwner()) {
            return response()->json([
                'success' => false,
                'message' => 'غير مصرح لك بالوصول'
            ], 403);
        }

        $store = $user->stores()->first();

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'لم يتم إنشاء متجر بعد'
            ], 404);
        }

        $stats = [
            'total_orders' => $store->orders()->count(),
            'pending_orders' => $store->orders()->where('status', 'pending')->count(),
            'preparing_orders' => $store->orders()->where('status', 'preparing')->count(),
            'delivered_orders' => $store->orders()->where('status', 'delivered')->count(),
            'cancelled_orders' => $store->orders()->where('status', 'cancelled')->count(),
            'total_revenue' => (float) $store->orders()->where('status', 'delivered')->sum('total_amount'),
            'total_products' => $store->products()->count(),
            'available_products' => $store->products()->where('is_available', true)->count(),
        ];

        // Recent orders
        $recentOrders = $store->orders()
            ->with(['user', 'orderItems.product'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number ?? '#' . $order->id,
                    'status' => $order->status,
                    'total_amount' => (float) $order->total_amount,
                    'customer' => $order->user ? [
                        'id' => $order->user->id,
                        'name' => $order->user->name,
                        'phone' => $order->user->phone,
                    ] : null,
                    'items_count' => $order->orderItems->sum('quantity'),
                    'created_at' => $order->created_at->toIso8601String(),
                ];
            });

        // Top products
        $topProducts = $store->products()
            ->with('category')
            ->withCount(['orderItems as order_count' => function ($query) use ($store) {
                $query->whereHas('order', function ($q) use ($store) {
                    $q->where('store_id', $store->id);
                });
            }])
            ->orderBy('order_count', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => (float) $product->price,
                    'order_count' => $product->order_count,
                    'category' => $product->category ? [
                        'id' => $product->category->id,
                        'name' => $product->category->name,
                    ] : null,
                ];
            });

        // Daily sales (last 7 days)
        $dailySales = $store->orders()
            ->where('status', 'delivered')
            ->where('created_at', '>=', now()->subDays(7))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as orders_count'),
                DB::raw('SUM(total_amount) as total_amount')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'orders_count' => $item->orders_count,
                    'total_amount' => (float) $item->total_amount,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'store' => [
                    'id' => $store->id,
                    'name' => $store->name,
                    'is_active' => $store->is_active,
                ],
                'stats' => $stats,
                'recent_orders' => $recentOrders,
                'top_products' => $topProducts,
                'daily_sales' => $dailySales,
            ]
        ]);
    }

    /**
     * Get admin dashboard statistics
     */
    public function adminStats(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'غير مصرح لك بالوصول'
            ], 403);
        }

        $stats = [
            'total_users' => User::count(),
            'total_customers' => User::customers()->count(),
            'total_store_owners' => User::storeOwners()->count(),
            'total_drivers' => User::where('user_type', 'driver')->count(),
            'total_stores' => Store::count(),
            'active_stores' => Store::active()->count(),
            'total_products' => Product::count(),
            'available_products' => Product::where('is_available', true)->count(),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'delivered_orders' => Order::where('status', 'delivered')->count(),
            'total_revenue' => (float) Order::where('status', 'delivered')->sum('total_amount'),
        ];

        // Recent orders
        $recentOrders = Order::with(['user', 'store', 'orderItems.product'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number ?? '#' . $order->id,
                    'status' => $order->status,
                    'total_amount' => (float) $order->total_amount,
                    'customer' => $order->user ? [
                        'id' => $order->user->id,
                        'name' => $order->user->name,
                    ] : null,
                    'store' => $order->store ? [
                        'id' => $order->store->id,
                        'name' => $order->store->name,
                    ] : null,
                    'created_at' => $order->created_at->toIso8601String(),
                ];
            });

        // Top stores
        $topStores = Store::withCount(['orders as orders_count'])
            ->withSum(['orders as total_revenue' => function ($query) {
                $query->where('status', 'delivered');
            }], 'total_amount')
            ->orderBy('orders_count', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($store) {
                return [
                    'id' => $store->id,
                    'name' => $store->name,
                    'orders_count' => $store->orders_count,
                    'total_revenue' => (float) ($store->total_revenue ?? 0),
                ];
            });

        // Monthly sales (last 12 months)
        $monthlySales = Order::where('status', 'delivered')
            ->where('created_at', '>=', now()->subMonths(12))
            ->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as orders_count'),
                DB::raw('SUM(total_amount) as total_amount')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'year' => $item->year,
                    'month' => $item->month,
                    'orders_count' => $item->orders_count,
                    'total_amount' => (float) $item->total_amount,
                ];
            });

        // New users (last 30 days)
        $newUsers = User::where('created_at', '>=', now()->subDays(30))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as users_count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'users_count' => $item->users_count,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'recent_orders' => $recentOrders,
                'top_stores' => $topStores,
                'monthly_sales' => $monthlySales,
                'new_users' => $newUsers,
            ]
        ]);
    }
}

