<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Models\Store;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{

    public function customer()
    {
        $user = Auth::user();
        
        if (!$user->isCustomer()) {
            abort(403);
        }

        // إحصائيات العميل
        $stats = [
            'total_orders' => $user->orders()->count(),
            'pending_orders' => $user->orders()->where('status', 'pending')->count(),
            'delivered_orders' => $user->orders()->where('status', 'delivered')->count(),
            'total_spent' => $user->orders()->where('status', 'delivered')->sum('total_amount'),
        ];

        // الطلبات الأخيرة
        $recentOrders = $user->orders()
            ->with(['store', 'orderItems.product'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // المنتجات المفضلة (بناءً على الطلبات السابقة)
        $favoriteProducts = Product::whereHas('orderItems.order', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with('category')
        ->withCount(['orderItems as order_count' => function ($query) use ($user) {
            $query->whereHas('order', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }])
        ->orderBy('order_count', 'desc')
        ->limit(6)
        ->get();

        return Inertia::render('Dashboard/Customer', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'favoriteProducts' => $favoriteProducts,
        ]);
    }

    public function store()
    {
        $user = Auth::user();
        
        if (!$user->isStoreOwner()) {
            abort(403);
        }

        $store = $user->stores()->first();
        
        if (!$store) {
            return Inertia::render('Dashboard/Store/NoStore');
        }

        // إحصائيات المتجر
        $stats = [
            'total_orders' => $store->orders()->count(),
            'pending_orders' => $store->orders()->where('status', 'pending')->count(),
            'preparing_orders' => $store->orders()->where('status', 'preparing')->count(),
            'delivered_orders' => $store->orders()->where('status', 'delivered')->count(),
            'total_revenue' => $store->orders()->where('status', 'delivered')->sum('total_amount'),
            'total_products' => Product::whereHas('category', function ($query) use ($store) {
                // يمكن إضافة منطق لربط المنتجات بالمتجر
            })->count(),
        ];

        // الطلبات الأخيرة
        $recentOrders = $store->orders()
            ->with(['user', 'orderItems.product'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // المنتجات الأكثر طلباً
        $topProducts = Product::whereHas('orderItems.order', function ($query) use ($store) {
            $query->where('store_id', $store->id);
        })
        ->with('category')
        ->withCount(['orderItems as order_count' => function ($query) use ($store) {
            $query->whereHas('order', function ($q) use ($store) {
                $q->where('store_id', $store->id);
            });
        }])
        ->orderBy('order_count', 'desc')
        ->limit(10)
        ->get();

        // إحصائيات المبيعات اليومية (آخر 7 أيام)
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
            ->get();

        $recentProducts = $store->products()
            ->with('category')
            ->orderByDesc('created_at')
            ->limit(8)
            ->get();

        return Inertia::render('Dashboard/Store', [
            'store' => $store,
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
            'dailySales' => $dailySales,
            'productCategories' => Category::active()->orderBy('name')->get(['id', 'name']),
            'storeProducts' => $recentProducts,
        ]);
    }

    public function admin()
    {
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            abort(403);
        }

        // إحصائيات عامة
        $stats = [
            'total_users' => User::count(),
            'total_customers' => User::customers()->count(),
            'total_store_owners' => User::storeOwners()->count(),
            'total_stores' => Store::count(),
            'active_stores' => Store::active()->count(),
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'total_revenue' => Order::where('status', 'delivered')->sum('total_amount'),
        ];

        // الطلبات الأخيرة
        $recentOrders = Order::with(['user', 'store', 'orderItems.product'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // المتاجر الأكثر نشاطاً
        $topStores = Store::withCount(['orders as orders_count'])
            ->withSum(['orders as total_revenue' => function ($query) {
                $query->where('status', 'delivered');
            }], 'total_amount')
            ->orderBy('orders_count', 'desc')
            ->limit(10)
            ->get();

        // إحصائيات المبيعات الشهرية
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
            ->get();

        // إحصائيات المستخدمين الجدد
        $newUsers = User::where('created_at', '>=', now()->subDays(30))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as users_count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('Dashboard/Admin', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'topStores' => $topStores,
            'monthlySales' => $monthlySales,
            'newUsers' => $newUsers,
        ]);
    }

    public function driver()
    {
        $user = Auth::user();
        
        if (!$user->isDriver()) {
            abort(403);
        }

        // إحصائيات السائق
        $stats = [
            'total_deliveries' => $user->orders()->count(),
            'pending_deliveries' => $user->orders()->where('status', 'out_for_delivery')->count(),
            'completed_deliveries' => $user->orders()->where('status', 'delivered')->count(),
            'total_earnings' => $user->orders()->where('status', 'delivered')->sum('delivery_fee'),
        ];

        // الطلبات المخصصة للسائق
        $assignedOrders = Order::where('delivery_driver_id', $user->id)
            ->with(['user', 'store', 'orderItems.product'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // الطلبات المتاحة للتوصيل
        $availableOrders = Order::where('status', 'ready')
            ->whereNull('delivery_driver_id')
            ->with(['user', 'store', 'orderItems.product'])
            ->orderBy('created_at', 'asc')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard/Driver', [
            'stats' => $stats,
            'assignedOrders' => $assignedOrders,
            'availableOrders' => $availableOrders,
        ]);
    }
}
