<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name_ar' => 'البقالة',
                'name_en' => 'Grocery',
                'slug' => 'grocery',
                'description_ar' => 'منتجات البقالة الأساسية',
                'description_en' => 'Everyday grocery essentials',
                'icon' => '🛒',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name_ar' => 'الفواكه والخضروات',
                'name_en' => 'Fruits & Vegetables',
                'slug' => 'fruits-vegetables',
                'description_ar' => 'فواكه وخضروات طازجة',
                'description_en' => 'Fresh produce delivered daily',
                'icon' => '🥬',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name_ar' => 'اللحوم والأسماك',
                'name_en' => 'Meat & Fish',
                'slug' => 'meat-fish',
                'description_ar' => 'لحوم وأسماك طازجة',
                'description_en' => 'Premium cuts and seafood',
                'icon' => '🥩',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name_ar' => 'منتجات الألبان',
                'name_en' => 'Dairy',
                'slug' => 'dairy',
                'description_ar' => 'حليب وجبن ومنتجات ألبان',
                'description_en' => 'Milk, cheese, and dairy goods',
                'icon' => '🥛',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name_ar' => 'المشروبات',
                'name_en' => 'Beverages',
                'slug' => 'beverages',
                'description_ar' => 'مشروبات باردة وساخنة',
                'description_en' => 'Hot and cold drinks',
                'icon' => '🥤',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name_ar' => 'الحلويات',
                'name_en' => 'Sweets & Bakery',
                'slug' => 'sweets',
                'description_ar' => 'حلويات ومعجنات',
                'description_en' => 'Desserts and baked goods',
                'icon' => '🍰',
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'name_ar' => 'المنظفات',
                'name_en' => 'Cleaning Supplies',
                'slug' => 'cleaning',
                'description_ar' => 'منظفات ومستحضرات تنظيف',
                'description_en' => 'Home and laundry cleaners',
                'icon' => '🧽',
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'name_ar' => 'العناية الشخصية',
                'name_en' => 'Personal Care',
                'slug' => 'personal-care',
                'description_ar' => 'مستحضرات العناية الشخصية',
                'description_en' => 'Skin, hair, and body care',
                'icon' => '🧴',
                'is_active' => true,
                'sort_order' => 8,
            ],
            [
                'name_ar' => 'الصيدلية',
                'name_en' => 'Pharmacy',
                'slug' => 'pharmacy',
                'description_ar' => 'أدوية ومنتجات صحية',
                'description_en' => 'Medicines and health essentials',
                'icon' => '💊',
                'is_active' => true,
                'sort_order' => 9,
            ],
            [
                'name_ar' => 'مستلزمات الحيوانات الأليفة',
                'name_en' => 'Pet Supplies',
                'slug' => 'pet-supplies',
                'description_ar' => 'طعام وإكسسوارات الحيوانات الأليفة',
                'description_en' => 'Food and accessories for pets',
                'icon' => '🐕',
                'is_active' => true,
                'sort_order' => 10,
            ],
        ];

        foreach ($categories as $category) {
            Category::create([
                ...$category,
                'name' => $category['name_ar'],
                'description' => $category['description_ar'],
            ]);
        }
    }
}
