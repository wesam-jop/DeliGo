<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DriverOrderController extends Controller
{
    public function index(Request $request)
    {
        $driver = $request->user();

        if (!$driver || !$driver->isDriver()) {
            abort(403);
        }

        $availableOrders = Order::query()
            ->where('status', 'ready')
            ->whereNull('delivery_driver_id')
            ->with(['store:id,name,address', 'user:id,name,phone'])
            ->orderBy('created_at')
            ->get()
            ->map(fn (Order $order) => $this->formatOrder($order));

        $activeOrders = Order::query()
            ->where('delivery_driver_id', $driver->id)
            ->whereIn('status', ['out_for_delivery', 'on_delivery'])
            ->with(['store:id,name,address', 'user:id,name,phone'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Order $order) => $this->formatOrder($order));

        $recentCompleted = Order::query()
            ->where('delivery_driver_id', $driver->id)
            ->where('status', 'delivered')
            ->orderByDesc('delivered_at')
            ->limit(5)
            ->with(['store:id,name,address', 'user:id,name,phone'])
            ->get()
            ->map(fn (Order $order) => $this->formatOrder($order));

        return Inertia::render('Dashboard/DriverOrders', [
            'availableOrders' => $availableOrders,
            'activeOrders' => $activeOrders,
            'recentCompletedOrders' => $recentCompleted,
        ]);
    }

    public function claim(Request $request, Order $order)
    {
        $driver = $request->user();

        if (!$driver || !$driver->isDriver()) {
            abort(403);
        }

        if ($order->status !== 'ready' || $order->delivery_driver_id !== null) {
            return back()->with('error', __('driver_order_unavailable'));
        }

        $order->update([
            'delivery_driver_id' => $driver->id,
            'status' => 'out_for_delivery',
        ]);

        return back()->with('success', __('driver_order_claimed_success'));
    }

    public function complete(Request $request, Order $order)
    {
        $driver = $request->user();

        if (!$driver || !$driver->isDriver()) {
            abort(403);
        }

        if ((int) $order->delivery_driver_id !== (int) $driver->id) {
            return back()->with('error', __('driver_order_not_assigned'));
        }

        if (!in_array($order->status, ['out_for_delivery', 'on_delivery'])) {
            return back()->with('error', __('driver_order_cannot_complete'));
        }

        $order->update([
            'status' => 'delivered',
            'delivered_at' => now(),
        ]);

        return back()->with('success', __('driver_order_completed_success'));
    }

    private function formatOrder(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status,
            'store' => $order->store ? [
                'name' => $order->store->name,
                'address' => $order->store->address,
            ] : null,
            'customer' => $order->user ? [
                'name' => $order->user->name,
                'phone' => $order->user->phone,
            ] : null,
            'delivery_address' => $order->delivery_address,
            'delivery_latitude' => $order->delivery_latitude,
            'delivery_longitude' => $order->delivery_longitude,
            'customer_phone' => $order->customer_phone,
            'total_amount' => $order->total_amount,
            'created_at' => $order->created_at?->toIso8601String(),
            'delivered_at' => $order->delivered_at?->toIso8601String(),
        ];
    }
}

