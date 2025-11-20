<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\StoreType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StorefrontController extends Controller
{
    public function index(Request $request)
    {
        $query = Store::query()
            ->with(['storeType'])
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

        $stores->getCollection()->transform(function ($store) {
            $store->store_type_label = $store->storeType
                ? (app()->getLocale() === 'ar' ? $store->storeType->name_ar : $store->storeType->name_en)
                : $store->store_type;
            return $store;
        });

        $storeTypes = StoreType::active()
            ->orderBy('display_order')
            ->get()
            ->map(fn ($type) => [
                'value' => $type->key,
                'label' => app()->getLocale() === 'ar' ? $type->name_ar : $type->name_en,
            ]);

        return Inertia::render('Stores/Index', [
            'stores' => $stores,
            'storeTypes' => $storeTypes,
            'filters' => $request->only(['search', 'type']),
        ]);
    }
}


