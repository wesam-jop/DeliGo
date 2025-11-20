<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::where('user_type', 'customer')
            ->with('deliveryLocations')
            ->take(5)
            ->get();

        if ($customers->isEmpty()) {
            return;
        }

        $drivers = User::where('user_type', 'driver')->get();

        $stores = Store::with('products')->get();
        if ($stores->isEmpty()) {
            $this->call(StoreSeeder::class);
            $stores = Store::with('products')->get();
        }

        $defaultEta = (int) Setting::get('default_estimated_delivery_time', 15);
        $possibleStatuses = [
            'pending',
            'confirmed',
            'preparing',
            'ready',
            'ready',
            'out_for_delivery',
            'delivered',
        ];

        foreach ($customers as $customer) {
            for ($i = 0; $i < rand(1, 3); $i++) {
                $status = $possibleStatuses[array_rand($possibleStatuses)];
                $this->createOrderWithItems($customer, $stores->random(), $status, $drivers, $defaultEta);
            }
        }

        // Ensure driver queue demo orders exist (ready, on delivery, delivered)
        if ($customers->isNotEmpty()) {
            $sampleCustomer = $customers->random();
            $this->createOrderWithItems($sampleCustomer, $stores->random(), 'ready', $drivers, $defaultEta);
            $this->createOrderWithItems($sampleCustomer, $stores->random(), 'out_for_delivery', $drivers, $defaultEta);
            $this->createOrderWithItems($sampleCustomer, $stores->random(), 'delivered', $drivers, $defaultEta);
        }
    }

    private function createOrderWithItems($customer, $store, string $status, $drivers, int $defaultEta): ?Order
    {
        $products = $store->products()->inRandomOrder()->take(rand(2, 4))->get();
        if ($products->isEmpty()) {
            return null;
        }

        $location = $customer->deliveryLocations->random() ?? null;

        $driverId = null;
        $deliveredAt = null;

        if (in_array($status, ['out_for_delivery', 'delivered']) && $drivers->isNotEmpty()) {
            $driver = $drivers->random();
            $driverId = $driver->id;
            if ($status === 'delivered') {
                $deliveredAt = now()->subMinutes(rand(30, 240));
            }
        }

        $order = Order::create([
            'order_number' => 'ORD-' . Str::upper(Str::random(8)),
            'user_id' => $customer->id,
            'store_id' => $store->id,
            'status' => $status,
            'subtotal' => 0,
            'delivery_fee' => $store->delivery_fee,
            'tax_amount' => 0,
            'discount_amount' => 0,
            'total_amount' => 0,
            'payment_status' => $status === 'delivered' ? 'paid' : 'pending',
            'payment_method' => 'cash',
            'delivery_address' => $location->address ?? 'دمشق، عنوان افتراضي للاختبار',
            'delivery_latitude' => $location->latitude ?? 33.5138 + rand(-50, 50) / 1000,
            'delivery_longitude' => $location->longitude ?? 36.2765 + rand(-50, 50) / 1000,
            'customer_phone' => $customer->phone ?? '963111111111',
            'notes' => $location?->notes ?? null,
            'estimated_delivery_time' => $store->estimated_delivery_time ?? $defaultEta,
            'delivery_driver_id' => $driverId,
            'delivered_at' => $deliveredAt,
        ]);

        $subtotal = 0;

        foreach ($products as $product) {
            $quantity = rand(1, 3);
            $lineTotal = $product->price * $quantity;
            $subtotal += $lineTotal;

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_price' => $product->price,
                'quantity' => $quantity,
                'total_price' => $lineTotal,
            ]);

            $product->increment('sales_count', $quantity);
        }

        $order->update([
            'subtotal' => $subtotal,
            'total_amount' => $subtotal + $order->delivery_fee,
        ]);

        return $order;
    }
}

