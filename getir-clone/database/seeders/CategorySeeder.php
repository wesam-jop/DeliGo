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
                'name' => 'البقالة',
                'slug' => 'grocery',
                'description' => 'منتجات البقالة الأساسية',
                'icon' => '🛒',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'الفواكه والخضروات',
                'slug' => 'fruits-vegetables',
                'description' => 'فواكه وخضروات طازجة',
                'icon' => '🥬',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'اللحوم والأسماك',
                'slug' => 'meat-fish',
                'description' => 'لحوم وأسماك طازجة',
                'icon' => '🥩',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'منتجات الألبان',
                'slug' => 'dairy',
                'description' => 'حليب وجبن ومنتجات ألبان',
                'icon' => '🥛',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'المشروبات',
                'slug' => 'beverages',
                'description' => 'مشروبات باردة وساخنة',
                'icon' => '🥤',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'الحلويات',
                'slug' => 'sweets',
                'description' => 'حلويات ومعجنات',
                'icon' => '🍰',
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'name' => 'المنظفات',
                'slug' => 'cleaning',
                'description' => 'منظفات ومستحضرات تنظيف',
                'icon' => '🧽',
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'name' => 'العناية الشخصية',
                'slug' => 'personal-care',
                'description' => 'مستحضرات العناية الشخصية',
                'icon' => '🧴',
                'is_active' => true,
                'sort_order' => 8,
            ],
            [
                'name' => 'الصيدلية',
                'slug' => 'pharmacy',
                'description' => 'أدوية ومنتجات صحية',
                'icon' => '💊',
                'is_active' => true,
                'sort_order' => 9,
            ],
            [
                'name' => 'مستلزمات الحيوانات الأليفة',
                'slug' => 'pet-supplies',
                'description' => 'طعام وإكسسوارات الحيوانات الأليفة',
                'icon' => '🐕',
                'is_active' => true,
                'sort_order' => 10,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
