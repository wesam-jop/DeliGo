<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class FinancialReportController extends Controller
{
    public function financial(Request $request)
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

        // Overall Financial Stats
        $stats = [
            'total_revenue' => Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->sum('total_amount'),
            'total_subtotal' => Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->sum('subtotal'),
            'total_delivery_fees' => Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->sum('delivery_fee'),
            'total_tax' => Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->sum('tax_amount'),
            'total_discounts' => Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->sum('discount_amount'),
            'net_profit' => Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->sum(DB::raw('total_amount - (subtotal * 0.7) - delivery_fee')),
            'total_orders' => Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->count(),
        ];

        // Daily Revenue
        if ($isSqlite) {
            $dailyRevenue = Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->select(
                    DB::raw('strftime("%Y-%m-%d", created_at) as date'),
                    DB::raw('COUNT(*) as orders_count'),
                    DB::raw('SUM(total_amount) as revenue'),
                    DB::raw('SUM(subtotal) as subtotal'),
                    DB::raw('SUM(delivery_fee) as delivery_fees'),
                    DB::raw('SUM(tax_amount) as tax'),
                    DB::raw('SUM(discount_amount) as discounts')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        } else {
            $dailyRevenue = Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('COUNT(*) as orders_count'),
                    DB::raw('SUM(total_amount) as revenue'),
                    DB::raw('SUM(subtotal) as subtotal'),
                    DB::raw('SUM(delivery_fee) as delivery_fees'),
                    DB::raw('SUM(tax_amount) as tax'),
                    DB::raw('SUM(discount_amount) as discounts')
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
                    DB::raw('SUM(total_amount) as revenue'),
                    DB::raw('SUM(subtotal) as subtotal'),
                    DB::raw('SUM(delivery_fee) as delivery_fees'),
                    DB::raw('SUM(tax_amount) as tax'),
                    DB::raw('SUM(discount_amount) as discounts')
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
                    DB::raw('SUM(total_amount) as revenue'),
                    DB::raw('SUM(subtotal) as subtotal'),
                    DB::raw('SUM(delivery_fee) as delivery_fees'),
                    DB::raw('SUM(tax_amount) as tax'),
                    DB::raw('SUM(discount_amount) as discounts')
                )
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get();
        }

        // Revenue by Payment Method
        $revenueByPaymentMethod = Order::where('status', 'delivered')
            ->where('created_at', '>=', $startDate)
            ->select(
                'payment_method',
                DB::raw('COUNT(*) as orders_count'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->groupBy('payment_method')
            ->get();

        // Revenue by Payment Status
        $revenueByPaymentStatus = Order::where('status', 'delivered')
            ->where('created_at', '>=', $startDate)
            ->select(
                'payment_status',
                DB::raw('COUNT(*) as orders_count'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->groupBy('payment_status')
            ->get();

        // Top Revenue Days
        if ($isSqlite) {
            $topRevenueDays = Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->select(
                    DB::raw('strftime("%Y-%m-%d", created_at) as date'),
                    DB::raw('COUNT(*) as orders_count'),
                    DB::raw('SUM(total_amount) as revenue')
                )
                ->groupBy('date')
                ->orderBy('revenue', 'desc')
                ->limit(10)
                ->get();
        } else {
            $topRevenueDays = Order::where('status', 'delivered')
                ->where('created_at', '>=', $startDate)
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('COUNT(*) as orders_count'),
                    DB::raw('SUM(total_amount) as revenue')
                )
                ->groupBy('date')
                ->orderBy('revenue', 'desc')
                ->limit(10)
                ->get();
        }

        // Recent Financial Transactions
        $recentTransactions = Order::where('status', 'delivered')
            ->with(['user', 'store'])
            ->where('created_at', '>=', $startDate)
            ->latest()
            ->limit(20)
            ->get();

        // Refunded Orders
        $refundedOrders = Order::where('payment_status', 'refunded')
            ->where('created_at', '>=', $startDate)
            ->with(['user', 'store'])
            ->latest()
            ->limit(10)
            ->get();

        $refundedAmount = Order::where('payment_status', 'refunded')
            ->where('created_at', '>=', $startDate)
            ->sum('total_amount');

        return Inertia::render('Admin/Reports/Financial', [
            'stats' => $stats,
            'dailyRevenue' => $dailyRevenue,
            'monthlyRevenue' => $monthlyRevenue,
            'revenueByPaymentMethod' => $revenueByPaymentMethod,
            'revenueByPaymentStatus' => $revenueByPaymentStatus,
            'topRevenueDays' => $topRevenueDays,
            'recentTransactions' => $recentTransactions,
            'refundedOrders' => $refundedOrders,
            'refundedAmount' => $refundedAmount,
            'timeRange' => $timeRange,
        ]);
    }
}

