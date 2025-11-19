<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Store;
use App\Models\User;

class StoreController extends Controller
{
    public function index(Request $request)
    {
        $stores = Store::with(['owner', 'products'])
            ->withCount(['orders', 'products'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate stats
        $stats = [
            'total' => Store::count(),
            'active' => Store::where('is_active', true)->count(),
            'inactive' => Store::where('is_active', false)->count(),
            'total_orders' => Store::withCount('orders')->get()->sum('orders_count'),
            'total_products' => Store::withCount('products')->get()->sum('products_count'),
            'total_revenue' => \App\Models\Order::whereHas('store')
                ->where('status', 'delivered')
                ->sum('total_amount'),
        ];

        return Inertia::render('Admin/Stores/Index', [
            'stores' => $stores,
            'stats' => $stats,
        ]);
    }

    public function show(Store $store)
    {
        $store->load(['owner', 'products.category', 'orders' => function($query) {
            $query->latest()->limit(10);
        }]);
        
        return Inertia::render('Admin/Stores/Show', [
            'store' => $store,
        ]);
    }

    public function toggleActive(Store $store)
    {
        $store->update([
            'is_active' => !$store->is_active,
        ]);

        return redirect()->back()->with('success', 'Store status updated successfully');
    }
}

