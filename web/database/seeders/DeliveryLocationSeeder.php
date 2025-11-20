<?php

namespace Database\Seeders;

use App\Models\DeliveryLocation;
use App\Models\User;
use Illuminate\Database\Seeder;

class DeliveryLocationSeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::where('user_type', 'customer')->take(5)->get();

        $defaultLocations = [
            [
                'label' => 'المنزل',
                'address' => 'دمشق، المزة، جانب جامع الأكرم',
                'latitude' => 33.5090,
                'longitude' => 36.2789,
                'notes' => 'الباب البني، الطابق الثالث',
            ],
            [
                'label' => 'مكان العمل',
                'address' => 'دمشق، ساحة الأمويين، بناء الهيئة',
                'latitude' => 33.5175,
                'longitude' => 36.2816,
                'notes' => 'استقبال الطابق الأرضي',
            ],
            [
                'label' => 'بيت العائلة',
                'address' => 'حلب، الجميلية، شارع الكنيسة',
                'latitude' => 36.2045,
                'longitude' => 37.1516,
                'notes' => '',
            ],
            [
                'label' => 'المزرعة',
                'address' => 'ريف دمشق، جديدة عرطوز',
                'latitude' => 33.4284,
                'longitude' => 36.1811,
                'notes' => 'باب خشبي أخضر',
            ],
        ];

        foreach ($customers as $index => $customer) {
            foreach ($defaultLocations as $key => $location) {
                DeliveryLocation::updateOrCreate(
                    [
                        'user_id' => $customer->id,
                        'label' => $location['label'],
                    ],
                    [
                        'address' => $location['address'],
                        'latitude' => $location['latitude'] + ($index * 0.0005) + rand(-10, 10) / 10000,
                        'longitude' => $location['longitude'] + ($index * 0.0005) + rand(-10, 10) / 10000,
                        'notes' => $location['notes'],
                        'is_default' => $key === 0,
                    ]
                );
            }
        }
    }
}

