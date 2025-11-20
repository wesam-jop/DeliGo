<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Models\Store;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function overview(Request $request)
    {
        // Overall Stats
        $stats = [
            'total_users' => User::count(),
            'total_customers' => User::where('user_type', 'customer')->count(),
            'total_store_owners' => User::where('user_type', 'store_owner')->count(),
            'total_drivers' => User::where('user_type', 'driver')->count(),
            'total_stores' => Store::count(),
            'active_stores' => Store::where('is_active', true)->count(),
            'total_products' => Product::count(),
            'total_categories' => Category::count(),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'delivered_orders' => Order::where('status', 'delivered')->count(),
            'total_revenue' => Order::where('status', 'delivered')->sum('total_amount'),
            'average_order_value' => Order::where('status', 'delivered')->avg('total_amount'),
        ];

        // Daily Orders (Last 30 days)
        $isSqlite = DB::connection()->getDriverName() === 'sqlite';
        
        if ($isSqlite) {
            $dailyOrders = Order::where('created_at', '>=', now()->subDays(30))
                ->select(
                    DB::raw('strftime("%Y-%m-%d", created_at) as date'),
                    DB::raw('COUNT(*) as count'),
                    DB::raw('SUM(CASE WHEN status = "delivered" THEN total_amount ELSE 0 END) as revenue')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        } else {
            $dailyOrders = Order::where('created_at', '>=', now()->subDays(30))
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('COUNT(*) as count'),
                    DB::raw('SUM(CASE WHEN status = "delivered" THEN total_amount ELSE 0 END) as revenue')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        }

        // Monthly Revenue (Last 12 months)
        if ($isSqlite) {
            $monthlyRevenue = Order::where('status', 'delivered')
                ->where('created_at', '>=', now()->subMonths(12))
                ->select(
                    DB::raw('CAST(strftime("%Y", created_at) AS INTEGER) as year'),
                    DB::raw('CAST(strftime("%m", created_at) AS INTEGER) as month'),
                    DB::raw('COUNT(*) as orders_count'),
                    DB::raw('SUM(total_amount) as revenue')
                )
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get();
        } else {
            $monthlyRevenue = Order::where('status', 'delivered')
                ->where('created_at', '>=', now()->subMonths(12))
                ->select(
                    DB::raw('YEAR(created_at) as year'),
                    DB::raw('MONTH(created_at) as month'),
                    DB::raw('COUNT(*) as orders_count'),
                    DB::raw('SUM(total_amount) as revenue')
                )
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get();
        }

        // Orders by Status
        $ordersByStatus = Order::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get();

        // Top Products by Sales
        $topProducts = Product::with('category')
            ->orderBy('sales_count', 'desc')
            ->limit(10)
            ->get();

        // Top Stores by Revenue
        $topStores = Store::with('owner')
            ->withCount(['orders as delivered_orders_count' => function($query) {
                $query->where('status', 'delivered');
            }])
            ->withSum(['orders as total_revenue' => function($query) {
                $query->where('status', 'delivered');
            }], 'total_amount')
            ->orderBy('total_revenue', 'desc')
            ->limit(10)
            ->get();

        // User Growth (Last 30 days)
        if ($isSqlite) {
            $userGrowth = User::where('created_at', '>=', now()->subDays(30))
                ->select(
                    DB::raw('strftime("%Y-%m-%d", created_at) as date'),
                    DB::raw('COUNT(*) as count')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        } else {
            $userGrowth = User::where('created_at', '>=', now()->subDays(30))
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('COUNT(*) as count')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        }

        // Recent Activity
        $recentOrders = Order::with(['user', 'store'])
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Analytics/Overview', [
            'stats' => $stats,
            'dailyOrders' => $dailyOrders,
            'monthlyRevenue' => $monthlyRevenue,
            'ordersByStatus' => $ordersByStatus,
            'topProducts' => $topProducts,
            'topStores' => $topStores,
            'userGrowth' => $userGrowth,
            'recentOrders' => $recentOrders,
        ]);
    }

    public function sales(Request $request)
    {
        $isSqlite = DB::connection()->getDriverName() === 'sqlite';
        $timeRange = $request->get('range', '30d');
        
        // Calculate date range
        $startDate = match($timeRange) {
            '7d' => now()->subDays(7),
            '30d' => now()->subDays(30),
            '90d' => now()->subDays(90),
            '12m' => now()->subMonths(12),
            default => now()->subDays(30),
        };

        // Overall Sales Stats
        $stats = [
            'total_revenue' => Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->sum('total_amount'),
            'total_orders' => Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->count(),
            'average_order_value' => Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->avg('total_amount'),
            'total_delivery_fees' => Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->sum('delivery_fee'),
            'total_discounts' => Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->sum('discount_amount'),
            'total_tax' => Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->sum('tax_amount'),
        ];

        // Daily Sales (Revenue and Orders)
        if ($isSqlite) {
            $dailySales = Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->select(
                    DB::raw('strftime("%Y-%m-%d", created_at) as date'),
                    DB::raw('COUNT(*) as orders_count'),
                    DB::raw('SUM(total_amount) as revenue'),
                    DB::raw('SUM(delivery_fee) as delivery_fees'),
                    DB::raw('SUM(discount_amount) as discounts')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        } else {
            $dailySales = Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('COUNT(*) as orders_count'),
                    DB::raw('SUM(total_amount) as revenue'),
                    DB::raw('SUM(delivery_fee) as delivery_fees'),
                    DB::raw('SUM(discount_amount) as discounts')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        }

        // Monthly Sales (Last 12 months)
        if ($isSqlite) {
            $monthlySales = Order::where('status', 'delivered')
                ->where('created_at', '>=', now()->subMonths(12))
                ->select(
                    DB::raw('CAST(strftime("%Y", created_at) AS INTEGER) as year'),
                    DB::raw('CAST(strftime("%m", created_at) AS INTEGER) as month'),
                    DB::raw('COUNT(*) as orders_count'),
                    DB::raw('SUM(total_amount) as revenue'),
                    DB::raw('AVG(total_amount) as avg_order_value')
                )
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get();
        } else {
            $monthlySales = Order::where('status', 'delivered')
                ->where('created_at', '>=', now()->subMonths(12))
                ->select(
                    DB::raw('YEAR(created_at) as year'),
                    DB::raw('MONTH(created_at) as month'),
                    DB::raw('COUNT(*) as orders_count'),
                    DB::raw('SUM(total_amount) as revenue'),
                    DB::raw('AVG(total_amount) as avg_order_value')
                )
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get();
        }

        // Sales by Store
        $salesByStore = Store::with('owner')
            ->withCount(['orders as delivered_orders_count' => function($query) use ($startDate) {
                $query->where('status', 'delivered')
                    ->where('created_at', '>=', $startDate);
            }])
            ->withSum(['orders as total_revenue' => function($query) use ($startDate) {
                $query->where('status', 'delivered')
                    ->where('created_at', '>=', $startDate);
            }], 'total_amount')
            ->withSum(['orders as total_delivery_fees' => function($query) use ($startDate) {
                $query->where('status', 'delivered')
                    ->where('created_at', '>=', $startDate);
            }], 'delivery_fee')
            ->orderBy('total_revenue', 'desc')
            ->get();

        // Sales by Product Category
        $salesByCategory = Category::withCount('products')
            ->get()
            ->map(function($category) {
                $category->total_sales = $category->products()->sum('sales_count');
                return $category;
            })
            ->sortByDesc('total_sales')
            ->values();

        // Top Selling Products
        $topSellingProducts = Product::with(['category', 'store'])
            ->where('sales_count', '>', 0)
            ->orderBy('sales_count', 'desc')
            ->limit(20)
            ->get();

        // Recent Sales
        $recentSales = Order::where('status', 'delivered')
            ->with(['user', 'store'])
            ->latest()
            ->limit(20)
            ->get();

        return Inertia::render('Admin/Analytics/Sales', [
            'stats' => $stats,
            'dailySales' => $dailySales,
            'monthlySales' => $monthlySales,
            'salesByStore' => $salesByStore,
            'salesByCategory' => $salesByCategory,
            'topSellingProducts' => $topSellingProducts,
            'recentSales' => $recentSales,
            'timeRange' => $timeRange,
        ]);
    }

    public function customers(Request $request)
    {
        $isSqlite = DB::connection()->getDriverName() === 'sqlite';
        $timeRange = $request->get('range', '30d');
        
        // Calculate date range
        $startDate = match($timeRange) {
            '7d' => now()->subDays(7),
            '30d' => now()->subDays(30),
            '90d' => now()->subDays(90),
            '12m' => now()->subMonths(12),
            default => now()->subDays(30),
        };

        // Overall Customer Stats
        $stats = [
            'total_customers' => User::where('user_type', 'customer')->count(),
            'new_customers' => User::where('user_type', 'customer')
                ->where('created_at', '>=', $startDate)
                ->count(),
            'active_customers' => User::where('user_type', 'customer')
                ->whereHas('orders', function($query) use ($startDate) {
                    $query->where('created_at', '>=', $startDate);
                })
                ->count(),
            'vip_customers' => User::where('user_type', 'customer')
                ->whereHas('orders', function($query) {
                    $query->where('status', 'delivered');
                })
                ->withCount(['orders as delivered_orders_count' => function($query) {
                    $query->where('status', 'delivered');
                }])
                ->withSum(['orders as total_spent' => function($query) {
                    $query->where('status', 'delivered');
                }], 'total_amount')
                ->get()
                ->filter(function($user) {
                    return ($user->delivered_orders_count >= 10) || ($user->total_spent >= 1000);
                })
                ->count(),
            'total_customer_revenue' => Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->sum('total_amount'),
            'average_customer_value' => User::where('user_type', 'customer')
                ->whereHas('orders', function($query) use ($startDate) {
                    $query->where('status', 'delivered')
                        ->where('created_at', '>=', $startDate);
                })
                ->withSum(['orders as total_spent' => function($query) use ($startDate) {
                    $query->where('status', 'delivered')
                        ->where('created_at', '>=', $startDate);
                }], 'total_amount')
                ->get()
                ->avg('total_spent'),
        ];

        // Customer Growth (Daily)
        if ($isSqlite) {
            $dailyCustomerGrowth = User::where('user_type', 'customer')
                ->where('created_at', '>=', $startDate)
                ->select(
                    DB::raw('strftime("%Y-%m-%d", created_at) as date'),
                    DB::raw('COUNT(*) as count')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        } else {
            $dailyCustomerGrowth = User::where('user_type', 'customer')
                ->where('created_at', '>=', $startDate)
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('COUNT(*) as count')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        }

        // Customer Growth (Monthly - Last 12 months)
        if ($isSqlite) {
            $monthlyCustomerGrowth = User::where('user_type', 'customer')
                ->where('created_at', '>=', now()->subMonths(12))
                ->select(
                    DB::raw('CAST(strftime("%Y", created_at) AS INTEGER) as year'),
                    DB::raw('CAST(strftime("%m", created_at) AS INTEGER) as month'),
                    DB::raw('COUNT(*) as count')
                )
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get();
        } else {
            $monthlyCustomerGrowth = User::where('user_type', 'customer')
                ->where('created_at', '>=', now()->subMonths(12))
                ->select(
                    DB::raw('YEAR(created_at) as year'),
                    DB::raw('MONTH(created_at) as month'),
                    DB::raw('COUNT(*) as count')
                )
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get();
        }

        // Top Customers by Orders
        $topCustomersByOrders = User::where('user_type', 'customer')
            ->withCount(['orders as total_orders' => function($query) use ($startDate) {
                $query->where('created_at', '>=', $startDate);
            }])
            ->withCount(['orders as delivered_orders' => function($query) use ($startDate) {
                $query->where('status', 'delivered')
                    ->where('created_at', '>=', $startDate);
            }])
            ->withSum(['orders as total_spent' => function($query) use ($startDate) {
                $query->where('status', 'delivered')
                    ->where('created_at', '>=', $startDate);
            }], 'total_amount')
            ->get()
            ->filter(function($user) {
                return ($user->total_orders || 0) > 0;
            })
            ->sortByDesc('total_orders')
            ->take(20)
            ->values();

        // Top Customers by Revenue
        $topCustomersByRevenue = User::where('user_type', 'customer')
            ->withCount(['orders as total_orders' => function($query) use ($startDate) {
                $query->where('created_at', '>=', $startDate);
            }])
            ->withSum(['orders as total_spent' => function($query) use ($startDate) {
                $query->where('status', 'delivered')
                    ->where('created_at', '>=', $startDate);
            }], 'total_amount')
            ->get()
            ->filter(function($user) {
                return ($user->total_spent || 0) > 0;
            })
            ->sortByDesc('total_spent')
            ->take(20)
            ->values();

        // Customer Distribution by Order Count
        $allCustomers = User::where('user_type', 'customer')
            ->withCount('orders')
            ->get();
        
        $customerDistribution = [
            'no_orders' => $allCustomers->filter(function($user) {
                return $user->orders_count == 0;
            })->count(),
            'one_to_five_orders' => $allCustomers->filter(function($user) {
                return $user->orders_count >= 1 && $user->orders_count <= 5;
            })->count(),
            'six_to_ten_orders' => $allCustomers->filter(function($user) {
                return $user->orders_count >= 6 && $user->orders_count <= 10;
            })->count(),
            'eleven_to_twenty_orders' => $allCustomers->filter(function($user) {
                return $user->orders_count >= 11 && $user->orders_count <= 20;
            })->count(),
            'more_than_twenty_orders' => $allCustomers->filter(function($user) {
                return $user->orders_count > 20;
            })->count(),
        ];

        // New Customers (Last 30 days)
        $newCustomers = User::where('user_type', 'customer')
            ->where('created_at', '>=', now()->subDays(30))
            ->withCount('orders')
            ->withSum(['orders as total_spent' => function($query) {
                $query->where('status', 'delivered');
            }], 'total_amount')
            ->latest()
            ->limit(20)
            ->get();

        // Active Customers (Last 30 days)
        $activeCustomers = User::where('user_type', 'customer')
            ->whereHas('orders', function($query) {
                $query->where('created_at', '>=', now()->subDays(30));
            })
            ->withCount(['orders as recent_orders' => function($query) {
                $query->where('created_at', '>=', now()->subDays(30));
            }])
            ->withSum(['orders as recent_spent' => function($query) {
                $query->where('status', 'delivered')
                    ->where('created_at', '>=', now()->subDays(30));
            }], 'total_amount')
            ->orderBy('recent_orders', 'desc')
            ->limit(20)
            ->get();

        return Inertia::render('Admin/Analytics/Customers', [
            'stats' => $stats,
            'dailyCustomerGrowth' => $dailyCustomerGrowth,
            'monthlyCustomerGrowth' => $monthlyCustomerGrowth,
            'topCustomersByOrders' => $topCustomersByOrders,
            'topCustomersByRevenue' => $topCustomersByRevenue,
            'customerDistribution' => $customerDistribution,
            'newCustomers' => $newCustomers,
            'activeCustomers' => $activeCustomers,
            'timeRange' => $timeRange,
        ]);
    }

    public function delivery(Request $request)
    {
        $isSqlite = DB::connection()->getDriverName() === 'sqlite';
        $timeRange = $request->get('range', '30d');
        
        // Calculate date range
        $startDate = match($timeRange) {
            '7d' => now()->subDays(7),
            '30d' => now()->subDays(30),
            '90d' => now()->subDays(90),
            '12m' => now()->subMonths(12),
            default => now()->subDays(30),
        };

        // Overall Delivery Stats
        $stats = [
            'total_deliveries' => Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->count(),
            'pending_deliveries' => Order::where('status', 'out_for_delivery')
                ->where('created_at', '>=', $startDate)
                ->count(),
            'average_delivery_time' => Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->whereNotNull('delivered_at')
                ->get()
                ->map(function($order) {
                    if ($order->delivered_at && $order->created_at) {
                        return $order->created_at->diffInMinutes($order->delivered_at);
                    }
                    return null;
                })
                ->filter()
                ->avg(),
            'total_delivery_fees' => Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->sum('delivery_fee'),
            'active_drivers' => \App\Models\DeliveryDriver::where('is_active', true)
                ->where('status', '!=', 'offline')
                ->count(),
            'total_drivers' => \App\Models\DeliveryDriver::count(),
        ];

        // Daily Deliveries
        if ($isSqlite) {
            $dailyDeliveries = Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->select(
                    DB::raw('strftime("%Y-%m-%d", created_at) as date'),
                    DB::raw('COUNT(*) as deliveries_count'),
                    DB::raw('SUM(delivery_fee) as delivery_fees')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        } else {
            $dailyDeliveries = Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('COUNT(*) as deliveries_count'),
                    DB::raw('SUM(delivery_fee) as delivery_fees')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        }

        // Monthly Deliveries (Last 12 months)
        if ($isSqlite) {
            $monthlyDeliveries = Order::where('status', 'delivered')
                ->where('created_at', '>=', now()->subMonths(12))
                ->select(
                    DB::raw('CAST(strftime("%Y", created_at) AS INTEGER) as year'),
                    DB::raw('CAST(strftime("%m", created_at) AS INTEGER) as month'),
                    DB::raw('COUNT(*) as deliveries_count'),
                    DB::raw('SUM(delivery_fee) as delivery_fees'),
                    DB::raw('AVG(CASE WHEN delivered_at IS NOT NULL THEN (julianday(delivered_at) - julianday(created_at)) * 24 * 60 ELSE NULL END) as avg_delivery_time')
                )
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get();
        } else {
            $monthlyDeliveries = Order::where('status', 'delivered')
                ->where('created_at', '>=', now()->subMonths(12))
                ->select(
                    DB::raw('YEAR(created_at) as year'),
                    DB::raw('MONTH(created_at) as month'),
                    DB::raw('COUNT(*) as deliveries_count'),
                    DB::raw('SUM(delivery_fee) as delivery_fees'),
                    DB::raw('AVG(TIMESTAMPDIFF(MINUTE, created_at, delivered_at)) as avg_delivery_time')
                )
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get();
        }

        // Top Drivers by Deliveries
        $topDriversByDeliveries = \App\Models\DeliveryDriver::withCount(['orders as delivered_count' => function($query) use ($startDate) {
                $query->where('status', 'delivered')
                    ->where('created_at', '>=', $startDate);
            }])
            ->withSum(['orders as total_delivery_fees' => function($query) use ($startDate) {
                $query->where('status', 'delivered')
                    ->where('created_at', '>=', $startDate);
            }], 'delivery_fee')
            ->get()
            ->filter(function($driver) {
                return ($driver->delivered_count || 0) > 0;
            })
            ->sortByDesc('delivered_count')
            ->take(20)
            ->values();

        // Delivery Performance by Status
        $deliveriesByStatus = Order::whereIn('status', ['out_for_delivery', 'delivered', 'cancelled'])
            ->where('created_at', '>=', $startDate)
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get();

        // Delivery Time Distribution
        $deliveryTimeStats = Order::where('status', 'delivered')
            ->where('created_at', '>=', $startDate)
            ->whereNotNull('delivered_at')
            ->get()
            ->map(function($order) {
                if ($order->delivered_at && $order->created_at) {
                    return $order->created_at->diffInMinutes($order->delivered_at);
                }
                return null;
            })
            ->filter();

        $deliveryTimeDistribution = [
            'under_30_min' => $deliveryTimeStats->filter(fn($time) => $time < 30)->count(),
            '30_to_60_min' => $deliveryTimeStats->filter(fn($time) => $time >= 30 && $time < 60)->count(),
            '60_to_90_min' => $deliveryTimeStats->filter(fn($time) => $time >= 60 && $time < 90)->count(),
            'over_90_min' => $deliveryTimeStats->filter(fn($time) => $time >= 90)->count(),
        ];

        // Recent Deliveries
        $recentDeliveries = Order::where('status', 'delivered')
            ->with(['user', 'store', 'deliveryDriver'])
            ->where('created_at', '>=', $startDate)
            ->latest()
            ->limit(20)
            ->get();

        // Driver Status Distribution
        $driverStatusDistribution = [
            'available' => \App\Models\DeliveryDriver::where('status', 'available')->where('is_active', true)->count(),
            'busy' => \App\Models\DeliveryDriver::where('status', 'busy')->where('is_active', true)->count(),
            'offline' => \App\Models\DeliveryDriver::where('status', 'offline')->orWhere('is_active', false)->count(),
        ];

        return Inertia::render('Admin/Analytics/Delivery', [
            'stats' => $stats,
            'dailyDeliveries' => $dailyDeliveries,
            'monthlyDeliveries' => $monthlyDeliveries,
            'topDriversByDeliveries' => $topDriversByDeliveries,
            'deliveriesByStatus' => $deliveriesByStatus,
            'deliveryTimeDistribution' => $deliveryTimeDistribution,
            'recentDeliveries' => $recentDeliveries,
            'driverStatusDistribution' => $driverStatusDistribution,
            'timeRange' => $timeRange,
        ]);
    }
}

