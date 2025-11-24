<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Store::active()
            ->with(['governorate', 'city', 'storeType'])
            ->withCount(['orders', 'products']);

        // Search by name, address, phone, email, or store type
        if ($request->has('search') && !empty($request->search)) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('address', 'like', '%' . $search . '%')
                  ->orWhere('phone', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('store_type', 'like', '%' . $search . '%')
                  ->orWhereHas('governorate', function ($q) use ($search) {
                      $q->where('name_ar', 'like', '%' . $search . '%')
                        ->orWhere('name_en', 'like', '%' . $search . '%');
                  })
                  ->orWhereHas('city', function ($q) use ($search) {
                      $q->where('name_ar', 'like', '%' . $search . '%')
                        ->orWhere('name_en', 'like', '%' . $search . '%');
                  })
                  ->orWhereHas('storeType', function ($q) use ($search) {
                      $q->where('name_ar', 'like', '%' . $search . '%')
                        ->orWhere('name_en', 'like', '%' . $search . '%');
                  });
            });
        }

        // Filter by category (through products)
        if ($request->has('category_id')) {
            $query->whereHas('products', function ($q) use ($request) {
                $q->where('category_id', $request->category_id);
            });
        }

        // Filter by governorate
        if ($request->has('governorate_id')) {
            $query->where('governorate_id', $request->governorate_id);
        }

        // Filter by city
        if ($request->has('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        // Filter by store type
        if ($request->has('store_type')) {
            $query->where('store_type', $request->store_type);
        }

        // Filter by location (latitude/longitude and radius)
        if ($request->has('latitude') && $request->has('longitude')) {
            $latitude = $request->latitude;
            $longitude = $request->longitude;
            $radius = $request->get('radius', 10); // Default 10km

            // Calculate distance for each store
            $query->get()->filter(function ($store) use ($latitude, $longitude, $radius) {
                return $store->calculateDistance($latitude, $longitude) <= $radius;
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        // Validate sort_by
        $allowedSorts = ['created_at', 'name', 'orders_count', 'products_count'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }
        
        $query->orderBy($sortBy, $sortOrder);

        $perPage = min($request->get('per_page', 20), 100);
        $stores = $query->paginate($perPage);

        // Format response
        $stores->getCollection()->transform(function ($store) {
            return [
                'id' => $store->id,
                'name' => $store->name,
                'code' => $store->code,
                'store_type' => $store->store_type,
                'store_type_label' => $store->store_type_label,
                'logo_path' => $store->logo_path,
                'address' => $store->address,
                'latitude' => $store->latitude ? (float) $store->latitude : null,
                'longitude' => $store->longitude ? (float) $store->longitude : null,
                'phone' => $store->phone,
                'email' => $store->email,
                'opening_time' => $store->opening_time ? $store->opening_time->format('H:i') : null,
                'closing_time' => $store->closing_time ? $store->closing_time->format('H:i') : null,
                'is_active' => $store->is_active,
                'delivery_radius' => $store->delivery_radius ? (float) $store->delivery_radius : null,
                'delivery_fee' => $store->delivery_fee ? (float) $store->delivery_fee : null,
                'estimated_delivery_time' => $store->estimated_delivery_time,
                'governorate_id' => $store->governorate_id,
                'city_id' => $store->city_id,
                'governorate' => $store->governorate ? [
                    'id' => $store->governorate->id,
                    'name' => app()->getLocale() === 'ar' 
                        ? $store->governorate->name_ar 
                        : $store->governorate->name_en,
                ] : null,
                'city' => $store->city ? [
                    'id' => $store->city->id,
                    'name' => app()->getLocale() === 'ar' 
                        ? $store->city->name_ar 
                        : $store->city->name_en,
                ] : null,
                'orders_count' => $store->orders_count,
                'products_count' => $store->products_count,
                'created_at' => $store->created_at->toIso8601String(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $stores
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $store = Store::with(['owner', 'governorate', 'city', 'storeType'])
            ->withCount(['orders', 'products'])
            ->findOrFail($id);

        $formatted = [
            'id' => $store->id,
            'name' => $store->name,
            'code' => $store->code,
            'store_type' => $store->store_type,
            'store_type_label' => $store->store_type_label,
            'logo_path' => $store->logo_path,
            'address' => $store->address,
            'latitude' => $store->latitude ? (float) $store->latitude : null,
            'longitude' => $store->longitude ? (float) $store->longitude : null,
            'phone' => $store->phone,
            'email' => $store->email,
            'opening_time' => $store->opening_time ? $store->opening_time->format('H:i') : null,
            'closing_time' => $store->closing_time ? $store->closing_time->format('H:i') : null,
            'is_active' => $store->is_active,
            'delivery_radius' => $store->delivery_radius ? (float) $store->delivery_radius : null,
            'delivery_fee' => $store->delivery_fee ? (float) $store->delivery_fee : null,
            'estimated_delivery_time' => $store->estimated_delivery_time,
            'governorate_id' => $store->governorate_id,
            'city_id' => $store->city_id,
            'governorate' => $store->governorate ? [
                'id' => $store->governorate->id,
                'name' => app()->getLocale() === 'ar' 
                    ? $store->governorate->name_ar 
                    : $store->governorate->name_en,
            ] : null,
            'city' => $store->city ? [
                'id' => $store->city->id,
                'name' => app()->getLocale() === 'ar' 
                    ? $store->city->name_ar 
                    : $store->city->name_en,
            ] : null,
            'owner' => $store->owner ? [
                'id' => $store->owner->id,
                'name' => $store->owner->name,
                'phone' => $store->owner->phone,
            ] : null,
            'orders_count' => $store->orders_count,
            'products_count' => $store->products_count,
            'created_at' => $store->created_at->toIso8601String(),
        ];

        return response()->json([
            'success' => true,
            'data' => $formatted
        ]);
    }

    /**
     * Get store products
     */
    public function products(Request $request, string $id): JsonResponse
    {
        $store = Store::findOrFail($id);
        
        $query = $store->products()
            ->with('category')
            ->available();

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Search
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $perPage = min($request->get('per_page', 20), 100);
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }
}
