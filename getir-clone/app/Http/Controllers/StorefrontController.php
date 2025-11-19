<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StorefrontController extends Controller
{
    public function index(Request $request)
    {
        $query = Store::query()
            ->withCount(['orders', 'products'])
            ->where('is_active', true);

        if ($search = $request->get('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', '%' . $search . '%')
                    ->orWhere('address', 'like', '%' . $search . '%');
            });
        }

        if ($type = $request->get('type')) {
            $query->where('store_type', $type);
        }

        $stores = $query
            ->orderByDesc('orders_count')
            ->paginate(12)
            ->withQueryString();

        $storeTypes = Store::query()
            ->select('store_type')
            ->distinct()
            ->pluck('store_type')
            ->filter();

        return Inertia::render('Stores/Index', [
            'stores' => $stores,
            'storeTypes' => $storeTypes,
            'filters' => $request->only(['search', 'type']),
        ]);
    }
}


