<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Store;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stores = [
            [
                'name' => 'متجر دمشق المركزي',
                'code' => 'DAM001',
                'address' => 'شارع الحمرا، دمشق، سوريا',
                'latitude' => 33.5138,
                'longitude' => 36.2765,
                'phone' => '+963-11-1234567',
                'email' => 'damascus@getir.com',
                'opening_time' => '06:00:00',
                'closing_time' => '23:00:00',
                'is_active' => true,
                'delivery_radius' => 5.0,
                'delivery_fee' => 5.00,
                'estimated_delivery_time' => 15,
            ],
            [
                'name' => 'متجر حلب الشمالي',
                'code' => 'ALP001',
                'address' => 'شارع الجمهورية، حلب، سوريا',
                'latitude' => 36.2021,
                'longitude' => 37.1343,
                'phone' => '+963-21-1234567',
                'email' => 'aleppo@getir.com',
                'opening_time' => '06:00:00',
                'closing_time' => '23:00:00',
                'is_active' => true,
                'delivery_radius' => 4.5,
                'delivery_fee' => 4.50,
                'estimated_delivery_time' => 12,
            ],
            [
                'name' => 'متجر حمص الغربي',
                'code' => 'HOM001',
                'address' => 'شارع القوتلي، حمص، سوريا',
                'latitude' => 34.7389,
                'longitude' => 36.7136,
                'phone' => '+963-31-1234567',
                'email' => 'homs@getir.com',
                'opening_time' => '06:00:00',
                'closing_time' => '22:30:00',
                'is_active' => true,
                'delivery_radius' => 4.0,
                'delivery_fee' => 4.00,
                'estimated_delivery_time' => 10,
            ],
            [
                'name' => 'متجر اللاذقية الساحلي',
                'code' => 'LAT001',
                'address' => 'شارع 8 آذار، اللاذقية، سوريا',
                'latitude' => 35.5177,
                'longitude' => 35.7831,
                'phone' => '+963-41-1234567',
                'email' => 'latakia@getir.com',
                'opening_time' => '06:00:00',
                'closing_time' => '23:30:00',
                'is_active' => true,
                'delivery_radius' => 3.5,
                'delivery_fee' => 3.50,
                'estimated_delivery_time' => 8,
            ],
            [
                'name' => 'متجر طرطوس الجنوبي',
                'code' => 'TAR001',
                'address' => 'شارع الساحل، طرطوس، سوريا',
                'latitude' => 34.8886,
                'longitude' => 35.8869,
                'phone' => '+963-43-1234567',
                'email' => 'tartus@getir.com',
                'opening_time' => '06:00:00',
                'closing_time' => '23:00:00',
                'is_active' => true,
                'delivery_radius' => 3.0,
                'delivery_fee' => 3.00,
                'estimated_delivery_time' => 7,
            ],
            [
                'name' => 'صيدلية الشفاء',
                'code' => 'PHM001',
                'address' => 'شارع المالكي، دمشق، سوريا',
                'latitude' => 33.5138,
                'longitude' => 36.2765,
                'phone' => '+963-11-7654321',
                'email' => 'pharmacy@getir.com',
                'opening_time' => '08:00:00',
                'closing_time' => '22:00:00',
                'is_active' => true,
                'delivery_radius' => 4.0,
                'delivery_fee' => 6.00,
                'estimated_delivery_time' => 20,
            ],
            [
                'name' => 'متجر الحيوانات الأليفة',
                'code' => 'PET001',
                'address' => 'شارع أبو رمانة، دمشق، سوريا',
                'latitude' => 33.5138,
                'longitude' => 36.2765,
                'phone' => '+963-11-9999999',
                'email' => 'pets@getir.com',
                'opening_time' => '09:00:00',
                'closing_time' => '21:00:00',
                'is_active' => true,
                'delivery_radius' => 3.5,
                'delivery_fee' => 8.00,
                'estimated_delivery_time' => 25,
            ],
        ];

        foreach ($stores as $store) {
            Store::create($store);
        }
    }
}
