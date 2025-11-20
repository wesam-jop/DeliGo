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
use Illuminate\Support\Facades\Storage;

class DashboardController extends Controller
{

    public function customer()
    {
        $user = Auth::user()->load('driverApplication');
        
        if (!$user->isCustomer()) {
            if ($user->isStoreOwner()) {
                return redirect()->route('dashboard.store');
            }
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

        // المنتجات المفضلة التي قام المستخدم بحفظها
        $favoriteProducts = $user->favoriteProducts()
            ->with('category')
            ->orderByDesc('favorite_products.created_at')
            ->limit(6)
            ->get();

        return Inertia::render('Dashboard/Customer', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'favoriteProducts' => $favoriteProducts,
            'driverApplication' => $user->driverApplication ? [
                'status' => $user->driverApplication->status,
                'notes' => $user->driverApplication->notes,
                'submitted_at' => $user->driverApplication->created_at?->toIso8601String(),
                'reviewed_at' => $user->driverApplication->reviewed_at?->toIso8601String(),
            ] : null,
        ]);
    }

    public function customerFavorites()
    {
        $user = Auth::user();

        if (!$user->isCustomer()) {
            if ($user->isStoreOwner()) {
                return redirect()->route('dashboard.store.favorites');
            }
            abort(403);
        }

        $favorites = $user->favoriteProducts()
            ->with(['category', 'store'])
            ->orderByDesc('favorite_products.created_at')
            ->get();

        return Inertia::render('Dashboard/CustomerFavorites', [
            'favorites' => $favorites,
        ]);
    }

    public function editCustomerProfile()
    {
        $user = Auth::user();

        if (!$user->isCustomer()) {
            if ($user->isStoreOwner()) {
                return redirect()->route('dashboard.store.profile');
            }
            abort(403);
        }

        return Inertia::render('Dashboard/CustomerProfile', [
            'customer' => [
                'name' => $user->name,
                'phone' => $user->phone,
                'address' => $user->address,
                'avatar' => $user->avatar,
                'is_verified' => $user->is_verified,
                'created_at_formatted' => $user->created_at ? $user->created_at->translatedFormat('d M Y') : '',
            ],
        ]);
    }

    public function updateCustomerProfile(Request $request)
    {
        $user = Auth::user();

        if (!$user->isCustomer()) {
            if ($user->isStoreOwner()) {
                return redirect()->route('dashboard.store.profile');
            }
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:users,phone,' . $user->id,
            'address' => 'nullable|string|max:500',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = [
            'name' => $request->name,
            'phone' => preg_replace('/\D/', '', $request->phone),
            'address' => $request->address,
        ];

        if ($request->hasFile('avatar')) {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($data);

        return redirect()->back()->with('success', __('Profile updated successfully!'));
    }

    public function editStoreProfile()
    {
        $user = Auth::user();

        if (!$user->isStoreOwner()) {
            abort(403);
        }

        $store = $user->stores()->with('storeType')->first();

        return Inertia::render('Dashboard/StoreProfile', [
            'profile' => [
                'name' => $user->name,
                'phone' => $user->phone,
                'address' => $user->address,
                'avatar' => $user->avatar,
                'is_verified' => $user->is_verified,
                'created_at_formatted' => $user->created_at ? $user->created_at->translatedFormat('d M Y') : '',
                'store' => $store ? [
                    'name' => $store->name,
                    'phone' => $store->phone,
                    'address' => $store->address,
                    'delivery_radius' => $store->delivery_radius,
                    'delivery_fee' => $store->delivery_fee,
                    'logo_path' => $store->logo_path ? asset('storage/' . $store->logo_path) : null,
                    'store_type' => $store->store_type,
                    'store_type_label' => $store->storeType
                        ? (app()->getLocale() === 'ar' ? $store->storeType->name_ar : $store->storeType->name_en)
                        : $store->store_type,
                ] : null,
            ],
        ]);
    }

    public function updateStoreProfile(Request $request)
    {
        $user = Auth::user();

        if (!$user->isStoreOwner()) {
            abort(403);
        }

        $store = $user->stores()->with('storeType')->first();

        if (!$store) {
            return redirect('/dashboard/store/setup')->with('error', __('Please create your store first.'));
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:users,phone,' . $user->id,
            'address' => 'nullable|string|max:500',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'store_name' => 'required|string|max:255',
            'store_phone' => 'nullable|string|max:50',
            'store_address' => 'nullable|string|max:500',
            'delivery_radius' => 'nullable|numeric|min:1|max:50',
            'delivery_fee' => 'nullable|numeric|min:0',
            'store_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $userData = [
            'name' => $request->name,
            'phone' => preg_replace('/\D/', '', $request->phone),
            'address' => $request->address,
        ];

        if ($request->hasFile('avatar')) {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            $userData['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $storeData = [
            'name' => $request->store_name,
            'phone' => $request->store_phone,
            'address' => $request->store_address,
            'delivery_radius' => $request->delivery_radius,
            'delivery_fee' => $request->delivery_fee,
        ];

        if ($request->hasFile('store_logo')) {
            if ($store->logo_path && Storage::disk('public')->exists($store->logo_path)) {
                Storage::disk('public')->delete($store->logo_path);
            }
            $storeData['logo_path'] = $request->file('store_logo')->store('stores', 'public');
        }

        $user->update($userData);
        $store->update($storeData);

        return redirect()->back()->with('success', __('Store profile updated successfully!'));
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
            'store' => $store->append('store_type_label'),
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
            'dailySales' => $dailySales,
            'productCategories' => Category::active()
                ->orderBy('sort_order')
                ->orderBy('name_ar')
                ->get(['id', 'name', 'name_ar', 'name_en'])
                ->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => app()->getLocale() === 'en'
                            ? ($category->name_en ?? $category->name_ar ?? $category->name)
                            : ($category->name_ar ?? $category->name_en ?? $category->name),
                    ];
                }),
            'storeProducts' => $recentProducts,
        ]);
    }

    public function storeProducts()
    {
        $user = Auth::user();

        if (!$user->isStoreOwner()) {
            abort(403);
        }

        $store = $user->stores()->first();

        if (!$store) {
            return redirect('/dashboard/store/setup')->with('error', __('store_setup_needed'));
        }

        $productCategories = Category::active()
            ->orderBy('sort_order')
            ->orderBy('name_ar')
            ->get(['id', 'name', 'name_ar', 'name_en'])
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => app()->getLocale() === 'en'
                        ? ($category->name_en ?? $category->name_ar ?? $category->name)
                        : ($category->name_ar ?? $category->name_en ?? $category->name),
                ];
            });

        $products = $store->products()
            ->with('category')
            ->latest()
            ->paginate(12)
            ->through(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category?->display_name,
                    'price' => $product->price,
                    'stock_quantity' => $product->stock_quantity,
                    'unit' => $product->unit,
                    'is_available' => $product->is_available,
                    'created_at' => $product->created_at,
                ];
            });

        return Inertia::render('Dashboard/StoreProducts', [
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
                'address' => $store->address,
            ],
            'productCategories' => $productCategories,
            'products' => $products,
        ]);
    }

    public function storeOrders(Request $request)
    {
        $user = Auth::user();

        if (!$user->isStoreOwner()) {
            abort(403);
        }

        $store = $user->stores()->first();

        if (!$store) {
            return redirect('/dashboard/store/setup')->with('error', __('store_setup_needed'));
        }

        $status = $request->get('status');

        $ordersQuery = $store->orders()
            ->with(['user'])
            ->latest();

        if ($status && $status !== 'all') {
            $ordersQuery->where('status', $status);
        }

        $orders = $ordersQuery
            ->paginate(12)
            ->through(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number ?? ('#' . $order->id),
                    'customer_name' => $order->user?->name,
                    'status' => $order->status,
                    'total_amount' => $order->total_amount,
                    'created_at' => $order->created_at,
                ];
            });

        $stats = [
            'total' => $store->orders()->count(),
            'pending' => $store->orders()->where('status', 'pending')->count(),
            'preparing' => $store->orders()->where('status', 'preparing')->count(),
            'on_delivery' => $store->orders()->whereIn('status', ['on_delivery', 'out_for_delivery'])->count(),
            'delivered' => $store->orders()->where('status', 'delivered')->count(),
            'cancelled' => $store->orders()->where('status', 'cancelled')->count(),
        ];

        return Inertia::render('Dashboard/StoreOrders', [
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
            ],
            'orders' => $orders,
            'stats' => $stats,
            'filters' => [
                'status' => $status ?? 'all',
            ],
        ]);
    }

    public function storeFavorites()
    {
        $user = Auth::user();

        if (!$user->isStoreOwner()) {
            abort(403);
        }

        $favorites = $user->favoriteProducts()
            ->with(['category', 'store'])
            ->orderByDesc('favorite_products.created_at')
            ->get();

        return Inertia::render('Dashboard/StoreFavorites', [
            'favorites' => $favorites,
        ]);
    }

    public function storeMyOrders(Request $request)
    {
        $user = Auth::user();

        if (!$user->isStoreOwner()) {
            abort(403);
        }

        $status = $request->get('status');

        $ordersQuery = $user->orders()
            ->with(['store'])
            ->orderByDesc('created_at');

        if ($status && $status !== 'all') {
            $ordersQuery->where('status', $status);
        }

        $orders = $ordersQuery
            ->paginate(10)
            ->through(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number ?? ('#' . $order->id),
                    'status' => $order->status,
                    'total_amount' => $order->total_amount,
                    'created_at' => $order->created_at,
                    'store' => $order->store ? [
                        'name' => $order->store->name,
                        'address' => $order->store->address,
                    ] : null,
                    'delivery_address' => $order->delivery_address,
                    'estimated_delivery_time' => $order->estimated_delivery_time,
                    'can_cancel' => $order->status === 'pending',
                ];
            });

        return Inertia::render('Dashboard/StoreMyOrders', [
            'orders' => $orders,
            'filters' => [
                'status' => $status ?? 'all',
            ],
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

    public function editDriverProfile()
    {
        $user = Auth::user();

        if (!$user->isDriver()) {
            abort(403);
        }

        return Inertia::render('Dashboard/DriverProfile', [
            'profile' => [
                'name' => $user->name,
                'phone' => $user->phone,
                'address' => $user->address,
                'avatar' => $user->avatar,
                'created_at_formatted' => $user->created_at ? $user->created_at->translatedFormat('d M Y') : '',
            ],
        ]);
    }

    public function updateDriverProfile(Request $request)
    {
        $user = Auth::user();

        if (!$user->isDriver()) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:users,phone,' . $user->id,
            'address' => 'nullable|string|max:500',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = [
            'name' => $request->name,
            'phone' => preg_replace('/\D/', '', $request->phone),
            'address' => $request->address,
        ];

        if ($request->hasFile('avatar')) {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($data);

        return redirect()->back()->with('success', __('Profile updated successfully!'));
    }
}
