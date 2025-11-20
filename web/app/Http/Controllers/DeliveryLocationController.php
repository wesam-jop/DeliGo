<?php

namespace App\Http\Controllers;

use App\Models\DeliveryLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeliveryLocationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->isCustomer()) {
            if ($user->isStoreOwner()) {
                return redirect()->route('dashboard.store.locations');
            }
            abort(403);
        }

        return Inertia::render('Dashboard/CustomerLocations', [
            'locations' => $this->getLocationsFor($user),
        ]);
    }

    public function storeIndex(Request $request)
    {
        $user = $request->user();

        if (!$user->isStoreOwner()) {
            abort(403);
        }

        return Inertia::render('Dashboard/StoreLocations', [
            'locations' => $this->getLocationsFor($user),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeRequest($request);

        $data = $this->validateData($request);

        $location = $request->user()->deliveryLocations()->create($data);

        if ($data['is_default'] || !$request->user()->deliveryLocations()->where('is_default', true)->where('id', '!=', $location->id)->exists()) {
            $this->setDefaultForUser($request->user(), $location);
        }

        return back()->with('success', __('delivery_location_saved'));
    }

    public function update(Request $request, DeliveryLocation $deliveryLocation)
    {
        $this->authorizeRequest($request, $deliveryLocation);

        $data = $this->validateData($request, $deliveryLocation->id);

        $deliveryLocation->update($data);

        if ($data['is_default']) {
            $this->setDefaultForUser($request->user(), $deliveryLocation);
        }

        return back()->with('success', __('delivery_location_updated'));
    }

    public function destroy(Request $request, DeliveryLocation $deliveryLocation)
    {
        $this->authorizeRequest($request, $deliveryLocation);

        $wasDefault = $deliveryLocation->is_default;
        $deliveryLocation->delete();

        if ($wasDefault) {
            $request->user()
                ->deliveryLocations()
                ->orderByDesc('created_at')
                ->first()
                ?->update(['is_default' => true]);
        }

        return back()->with('success', __('delivery_location_deleted'));
    }

    public function setDefault(Request $request, DeliveryLocation $deliveryLocation)
    {
        $this->authorizeRequest($request, $deliveryLocation);

        $this->setDefaultForUser($request->user(), $deliveryLocation);

        return back()->with('success', __('delivery_location_default_updated'));
    }

    private function authorizeRequest(Request $request, ?DeliveryLocation $deliveryLocation = null): void
    {
        if (!$request->user()) {
            abort(403);
        }

        if ($deliveryLocation && $deliveryLocation->user_id !== $request->user()->id) {
            abort(403);
        }
    }

    private function validateData(Request $request, ?int $locationId = null): array
    {
        return $request->validate([
            'label' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string', 'max:500'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'notes' => ['nullable', 'string', 'max:255'],
            'is_default' => ['sometimes', 'boolean'],
        ]) + [
            'is_default' => $request->boolean('is_default'),
        ];
    }

    private function setDefaultForUser($user, DeliveryLocation $deliveryLocation): void
    {
        $user->deliveryLocations()
            ->where('id', '!=', $deliveryLocation->id)
            ->update(['is_default' => false]);

        if (!$deliveryLocation->is_default) {
            $deliveryLocation->is_default = true;
            $deliveryLocation->save();
        }
    }

    private function getLocationsFor($user)
    {
        return $user->deliveryLocations()
            ->orderByDesc('is_default')
            ->orderByDesc('created_at')
            ->get();
    }
}

