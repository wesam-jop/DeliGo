<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generate a unique phone number
        $phone = '963' . fake()->numerify('#########'); // 963 + 9 digits
        
        return [
            'name' => fake()->name(),
            'phone' => $phone,
            'password' => static::$password ??= Hash::make('default'), // كلمة مرور افتراضية غير مستخدمة
            'user_type' => 'customer',
            'is_verified' => fake()->boolean(80), // 80% verified
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the user should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => false,
        ]);
    }
}
