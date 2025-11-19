<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_cart_routes(): void
    {
        $this->get(route('cart.index'))->assertRedirect(route('login'));
        $this->post(route('cart.add'), [])->assertRedirect(route('login'));
        $this->put(route('cart.update'), [])->assertRedirect(route('login'));
        $this->delete(route('cart.clear'))->assertRedirect(route('login'));
    }

    public function test_guest_cannot_access_order_routes(): void
    {
        $this->get(route('orders.index'))->assertRedirect(route('login'));
        $this->post(route('orders.store'), [])->assertRedirect(route('login'));
    }

    public function test_user_cannot_manage_orders_of_other_users(): void
    {
        $user = User::factory()->create();
        $orderOwner = User::factory()->create();
        $storeOwner = User::factory()->create();

        $store = Store::create([
            'owner_id' => $storeOwner->id,
            'name' => 'Main Store',
            'code' => 'STR-001',
            'address' => 'Test Address',
            'latitude' => 33.5138,
            'longitude' => 36.2765,
            'phone' => '0999999999',
            'email' => 'store@example.com',
            'opening_time' => '08:00:00',
            'closing_time' => '23:00:00',
            'is_active' => true,
            'delivery_radius' => 5,
            'delivery_fee' => 5,
            'estimated_delivery_time' => 10,
        ]);

        $order = Order::create([
            'user_id' => $orderOwner->id,
            'store_id' => $store->id,
            'status' => 'pending',
            'subtotal' => 50,
            'delivery_fee' => 5,
            'tax_amount' => 0,
            'discount_amount' => 0,
            'total_amount' => 55,
            'payment_status' => 'pending',
            'payment_method' => 'cash',
            'delivery_address' => 'Some address',
            'delivery_latitude' => 33.5138,
            'delivery_longitude' => 36.2765,
            'customer_phone' => '0999888777',
            'notes' => null,
            'estimated_delivery_time' => now()->addMinutes(10),
        ]);

        $this->actingAs($user);

        $this->assertNotEquals($user->id, $order->user_id);

        $this->get(route('orders.show', $order))->assertForbidden();
        $this->post(route('orders.cancel', $order))->assertForbidden();
    }
}

