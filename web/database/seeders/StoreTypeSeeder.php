<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StoreType;

class StoreTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaults = [
            [
                'key' => 'grocery',
                'name_ar' => 'بقالة',
                'name_en' => 'Grocery',
                'icon' => '🛒',
                'display_order' => 1,
            ],
            [
                'key' => 'pharmacy',
                'name_ar' => 'صيدلية',
                'name_en' => 'Pharmacy',
                'icon' => '💊',
                'display_order' => 2,
            ],
            [
                'key' => 'restaurant',
                'name_ar' => 'مطعم',
                'name_en' => 'Restaurant',
                'icon' => '🍽️',
                'display_order' => 3,
            ],
            [
                'key' => 'pet',
                'name_ar' => 'مستلزمات الحيوانات',
                'name_en' => 'Pet Supplies',
                'icon' => '🐾',
                'display_order' => 4,
            ],
            [
                'key' => 'electronics',
                'name_ar' => 'إلكترونيات',
                'name_en' => 'Electronics',
                'icon' => '🔌',
                'display_order' => 5,
            ],
        ];

        foreach ($defaults as $type) {
            StoreType::updateOrCreate(
                ['key' => $type['key']],
                $type
            );
        }
    }
}

