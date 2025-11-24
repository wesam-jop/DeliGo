<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\StoreType;
use App\Models\Governorate;
use App\Models\City;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StorefrontController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
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

        // فلترة حسب المحافظة - تأخذ من إعدادات المستخدم إذا لم يتم تحديدها
        $governorateId = $request->get('governorate_id');
        if (!$governorateId && $user && $user->governorate_id) {
            $governorateId = $user->governorate_id;
        }
        if ($governorateId) {
            $query->where('governorate_id', $governorateId);
        }

        // فلترة حسب المنطقة - تأخذ من إعدادات المستخدم إذا لم يتم تحديدها
        $cityId = $request->get('city_id');
        if (!$cityId && $user && $user->city_id && !$governorateId) {
            // إذا لم يتم تحديد فلتر المحافظة والمنطقة، استخدم إعدادات المستخدم
            $cityId = $user->city_id;
            $governorateId = $user->governorate_id;
        }
        if ($cityId) {
            $query->where('city_id', $cityId);
        }

        $stores = $query
            ->with(['governorate:id,name_ar,name_en', 'city:id,name_ar,name_en'])
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

        // جلب المحافظات والمناطق للفلترة
        $governorates = Governorate::active()
            ->orderBy('display_order')
            ->get()
            ->map(fn ($gov) => [
                'id' => $gov->id,
                'name' => app()->getLocale() === 'ar' ? $gov->name_ar : $gov->name_en,
            ]);

        $cities = [];
        if ($governorateId = $request->get('governorate_id')) {
            $cities = City::active()
                ->where('governorate_id', $governorateId)
                ->orderBy('display_order')
                ->get()
                ->map(fn ($city) => [
                    'id' => $city->id,
                    'name' => app()->getLocale() === 'ar' ? $city->name_ar : $city->name_en,
                ]);
        }

        // تحديد الفلتر الافتراضي من إعدادات المستخدم
        $defaultGovernorateId = $user && $user->governorate_id ? $user->governorate_id : ($request->get('governorate_id') ?: '');
        $defaultCityId = $user && $user->city_id ? $user->city_id : ($request->get('city_id') ?: '');
        
        // إذا كان المستخدم لديه city_id ولم يتم تحديد governorate_id، جلب المدن للمحافظة التابعة لها
        if (!$governorateId && $defaultCityId && $user) {
            $userCity = City::find($defaultCityId);
            if ($userCity && $userCity->governorate_id) {
                $governorateId = $userCity->governorate_id;
                // جلب جميع المدن لهذه المحافظة
                $cities = City::active()
                    ->where('governorate_id', $governorateId)
                    ->orderBy('display_order')
                    ->get()
                    ->map(fn ($city) => [
                        'id' => $city->id,
                        'name' => app()->getLocale() === 'ar' ? $city->name_ar : $city->name_en,
                    ]);
            }
        }
        
        return Inertia::render('Stores/Index', [
            'stores' => $stores,
            'storeTypes' => $storeTypes,
            'governorates' => $governorates,
            'cities' => $cities,
            'userGovernorateId' => $user ? $user->governorate_id : null,
            'userCityId' => $user ? $user->city_id : null,
            'filters' => array_merge($request->only(['search', 'type', 'governorate_id', 'city_id']), [
                'governorate_id' => $request->get('governorate_id') ?: $defaultGovernorateId,
                'city_id' => $request->get('city_id') ?: $defaultCityId,
            ]),
        ]);
    }

    /**
     * عرض منتجات متجر معين
     */
    public function show(Store $store, Request $request)
    {
        // التأكد من أن المتجر نشط
        if (!$store->is_active) {
            abort(404);
        }

        $query = $store->products()
            ->with(['category', 'store'])
            ->available();

        // البحث
        if ($search = $request->get('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        // التصفية حسب الفئة
        if ($categoryId = $request->get('category')) {
            $query->where('category_id', $categoryId);
        }

        // الترتيب
        $sortBy = $request->get('sort', 'sort_order');
        $sortDirection = $request->get('direction', 'asc');
        
        if ($sortBy === 'price') {
            $query->orderBy('price', $sortDirection);
        } elseif ($sortBy === 'name') {
            $query->orderBy('name', $sortDirection);
        } else {
            $query->orderBy('sort_order', 'asc');
        }

        $products = $query->paginate(20)->withQueryString();

        // جلب الفئات المتاحة في هذا المتجر
        $categories = \App\Models\Category::whereHas('products', function ($query) use ($store) {
            $query->where('store_id', $store->id)->where('is_available', true);
        })
        ->active()
        ->orderBy('sort_order')
        ->get();

        // تحميل معلومات المتجر
        $store->load(['governorate:id,name_ar,name_en', 'city:id,name_ar,name_en', 'storeType']);

        return Inertia::render('Stores/Show', [
            'store' => $store,
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'sort', 'direction']),
        ]);
    }
}


