<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class StoreSetupController extends Controller
{
    public function create(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            abort(401);
        }

        if ($user->stores()->exists()) {
            return redirect()->route('dashboard.store')->with('success', __('store_setup_already_completed'));
        }

        $storeTypes = [
            ['value' => 'grocery', 'label' => __('store_type_grocery')],
            ['value' => 'pharmacy', 'label' => __('store_type_pharmacy')],
            ['value' => 'restaurant', 'label' => __('store_type_restaurant')],
            ['value' => 'pet', 'label' => __('store_type_pet')],
            ['value' => 'electronics', 'label' => __('store_type_electronics')],
        ];

        return Inertia::render('Dashboard/Store/Setup', [
            'storeTypes' => $storeTypes,
            'userPhone' => $user->phone,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            abort(401);
        }

        if ($user->stores()->exists()) {
            return redirect()->route('dashboard.store')->with('success', __('store_setup_already_completed'));
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'store_type' => ['required', 'in:grocery,pharmacy,restaurant,pet,electronics'],
            'address' => ['required', 'string', 'max:500'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'phone' => ['nullable', 'string', 'max:25'],
            'logo' => ['nullable', 'image', 'max:2048'],
        ]);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('store-logos', 'public');
        }

        $store = Store::create([
            'owner_id' => $user->id,
            'name' => $validated['name'],
            'code' => $this->generateStoreCode($validated['name']),
            'store_type' => $validated['store_type'],
            'logo_path' => $logoPath,
            'address' => $validated['address'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'phone' => $validated['phone'] ?? $user->phone,
            'email' => $user->email,
            'opening_time' => '08:00:00',
            'closing_time' => '23:00:00',
            'is_active' => true,
            'delivery_radius' => 5,
            'delivery_fee' => 0,
            'estimated_delivery_time' => 15,
        ]);

        $user->user_type = 'store_owner';
        $user->save();

        return redirect()->route('dashboard.store')->with('success', __('store_setup_success'));
    }

    private function generateStoreCode(string $name): string
    {
        $base = Str::upper(Str::slug(Str::limit($name, 6, ''), ''));
        $base = preg_replace('/[^A-Z0-9]/', '', $base) ?: 'STORE';

        do {
            $code = $base . Str::upper(Str::random(3));
        } while (Store::where('code', $code)->exists());

        return $code;
    }
}


