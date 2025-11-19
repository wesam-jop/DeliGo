<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $groceryCategory = Category::where('slug', 'grocery')->first();
        $fruitsCategory = Category::where('slug', 'fruits-vegetables')->first();
        $meatCategory = Category::where('slug', 'meat-fish')->first();
        $dairyCategory = Category::where('slug', 'dairy')->first();
        $beveragesCategory = Category::where('slug', 'beverages')->first();
        $sweetsCategory = Category::where('slug', 'sweets')->first();
        $cleaningCategory = Category::where('slug', 'cleaning')->first();
        $personalCareCategory = Category::where('slug', 'personal-care')->first();
        $pharmacyCategory = Category::where('slug', 'pharmacy')->first();
        $petSuppliesCategory = Category::where('slug', 'pet-supplies')->first();

        $products = [
            // البقالة
            [
                'category_id' => $groceryCategory->id,
                'name' => 'أرز بسمتي',
                'slug' => 'basmati-rice',
                'description' => 'أرز بسمتي عالي الجودة',
                'price' => 15.00,
                'unit' => 'كيلو',
                'stock_quantity' => 100,
                'is_available' => true,
                'is_featured' => true,
                'weight' => 1000,
                'brand' => 'الرائد',
                'sort_order' => 1,
            ],
            [
                'category_id' => $groceryCategory->id,
                'name' => 'زيت زيتون',
                'slug' => 'olive-oil',
                'description' => 'زيت زيتون بكر ممتاز',
                'price' => 25.00,
                'unit' => 'لتر',
                'stock_quantity' => 50,
                'is_available' => true,
                'is_featured' => true,
                'weight' => 1000,
                'brand' => 'الذهب الأخضر',
                'sort_order' => 2,
            ],
            [
                'category_id' => $groceryCategory->id,
                'name' => 'معكرونة',
                'slug' => 'pasta',
                'description' => 'معكرونة إيطالية',
                'price' => 8.00,
                'unit' => 'كيس',
                'stock_quantity' => 200,
                'is_available' => true,
                'is_featured' => false,
                'weight' => 500,
                'brand' => 'باريلا',
                'sort_order' => 3,
            ],

            // الفواكه والخضروات
            [
                'category_id' => $fruitsCategory->id,
                'name' => 'موز',
                'slug' => 'banana',
                'description' => 'موز طازج',
                'price' => 12.00,
                'unit' => 'كيلو',
                'stock_quantity' => 80,
                'is_available' => true,
                'is_featured' => true,
                'weight' => 1000,
                'brand' => 'طبيعي',
                'sort_order' => 1,
            ],
            [
                'category_id' => $fruitsCategory->id,
                'name' => 'طماطم',
                'slug' => 'tomato',
                'description' => 'طماطم طازجة',
                'price' => 6.00,
                'unit' => 'كيلو',
                'stock_quantity' => 150,
                'is_available' => true,
                'is_featured' => false,
                'weight' => 1000,
                'brand' => 'طبيعي',
                'sort_order' => 2,
            ],
            [
                'category_id' => $fruitsCategory->id,
                'name' => 'خس',
                'slug' => 'lettuce',
                'description' => 'خس طازج',
                'price' => 4.00,
                'unit' => 'حبة',
                'stock_quantity' => 60,
                'is_available' => true,
                'is_featured' => false,
                'weight' => 300,
                'brand' => 'طبيعي',
                'sort_order' => 3,
            ],

            // اللحوم والأسماك
            [
                'category_id' => $meatCategory->id,
                'name' => 'لحم بقري',
                'slug' => 'beef',
                'description' => 'لحم بقري طازج',
                'price' => 45.00,
                'unit' => 'كيلو',
                'stock_quantity' => 30,
                'is_available' => true,
                'is_featured' => true,
                'weight' => 1000,
                'brand' => 'الطازج',
                'sort_order' => 1,
            ],
            [
                'category_id' => $meatCategory->id,
                'name' => 'دجاج',
                'slug' => 'chicken',
                'description' => 'دجاج طازج',
                'price' => 20.00,
                'unit' => 'كيلو',
                'stock_quantity' => 40,
                'is_available' => true,
                'is_featured' => true,
                'weight' => 1000,
                'brand' => 'الطازج',
                'sort_order' => 2,
            ],

            // منتجات الألبان
            [
                'category_id' => $dairyCategory->id,
                'name' => 'حليب طازج',
                'slug' => 'fresh-milk',
                'description' => 'حليب طازج كامل الدسم',
                'price' => 8.00,
                'unit' => 'لتر',
                'stock_quantity' => 100,
                'is_available' => true,
                'is_featured' => true,
                'weight' => 1000,
                'brand' => 'اللبن',
                'sort_order' => 1,
            ],
            [
                'category_id' => $dairyCategory->id,
                'name' => 'جبن أبيض',
                'slug' => 'white-cheese',
                'description' => 'جبن أبيض طازج',
                'price' => 12.00,
                'unit' => 'كيلو',
                'stock_quantity' => 50,
                'is_available' => true,
                'is_featured' => false,
                'weight' => 1000,
                'brand' => 'اللبن',
                'sort_order' => 2,
            ],

            // المشروبات
            [
                'category_id' => $beveragesCategory->id,
                'name' => 'ماء معدني',
                'slug' => 'mineral-water',
                'description' => 'ماء معدني طبيعي',
                'price' => 2.00,
                'unit' => 'زجاجة',
                'stock_quantity' => 500,
                'is_available' => true,
                'is_featured' => false,
                'weight' => 500,
                'brand' => 'الينابيع',
                'sort_order' => 1,
            ],
            [
                'category_id' => $beveragesCategory->id,
                'name' => 'عصير برتقال',
                'slug' => 'orange-juice',
                'description' => 'عصير برتقال طبيعي',
                'price' => 6.00,
                'unit' => 'لتر',
                'stock_quantity' => 80,
                'is_available' => true,
                'is_featured' => true,
                'weight' => 1000,
                'brand' => 'الطازج',
                'sort_order' => 2,
            ],

            // الحلويات
            [
                'category_id' => $sweetsCategory->id,
                'name' => 'كيك الشوكولاتة',
                'slug' => 'chocolate-cake',
                'description' => 'كيك شوكولاتة لذيذ',
                'price' => 18.00,
                'unit' => 'قطعة',
                'stock_quantity' => 20,
                'is_available' => true,
                'is_featured' => true,
                'weight' => 200,
                'brand' => 'الحلويات',
                'sort_order' => 1,
            ],

            // المنظفات
            [
                'category_id' => $cleaningCategory->id,
                'name' => 'منظف أرضيات',
                'slug' => 'floor-cleaner',
                'description' => 'منظف أرضيات قوي',
                'price' => 15.00,
                'unit' => 'زجاجة',
                'stock_quantity' => 60,
                'is_available' => true,
                'is_featured' => false,
                'weight' => 1000,
                'brand' => 'النظافة',
                'sort_order' => 1,
            ],

            // العناية الشخصية
            [
                'category_id' => $personalCareCategory->id,
                'name' => 'شامبو',
                'slug' => 'shampoo',
                'description' => 'شامبو للشعر',
                'price' => 22.00,
                'unit' => 'زجاجة',
                'stock_quantity' => 40,
                'is_available' => true,
                'is_featured' => false,
                'weight' => 400,
                'brand' => 'الجمال',
                'sort_order' => 1,
            ],
            // الصيدلية
            [
                'category_id' => $pharmacyCategory->id,
                'name' => 'باراسيتامول',
                'slug' => 'paracetamol',
                'description' => 'مسكن للآلام وخافض للحرارة',
                'price' => 5.00,
                'unit' => 'علبة',
                'stock_quantity' => 200,
                'is_available' => true,
                'is_featured' => true,
                'weight' => 50,
                'brand' => 'فايزر',
                'sort_order' => 1,
            ],
            [
                'category_id' => $pharmacyCategory->id,
                'name' => 'فيتامين سي',
                'slug' => 'vitamin-c',
                'description' => 'فيتامين سي لتقوية المناعة',
                'price' => 12.00,
                'unit' => 'علبة',
                'stock_quantity' => 150,
                'is_available' => true,
                'is_featured' => false,
                'weight' => 100,
                'brand' => 'ناتشرال',
                'sort_order' => 2,
            ],
            [
                'category_id' => $pharmacyCategory->id,
                'name' => 'كريم مرطب',
                'slug' => 'moisturizing-cream',
                'description' => 'كريم مرطب للبشرة الجافة',
                'price' => 18.00,
                'unit' => 'أنبوب',
                'stock_quantity' => 80,
                'is_available' => true,
                'is_featured' => false,
                'weight' => 200,
                'brand' => 'نيفيا',
                'sort_order' => 3,
            ],
            // مستلزمات الحيوانات الأليفة
            [
                'category_id' => $petSuppliesCategory->id,
                'name' => 'طعام الكلاب',
                'slug' => 'dog-food',
                'description' => 'طعام جاف للكلاب البالغة',
                'price' => 35.00,
                'unit' => 'كيس',
                'stock_quantity' => 60,
                'is_available' => true,
                'is_featured' => true,
                'weight' => 3000,
                'brand' => 'رويال كانين',
                'sort_order' => 1,
            ],
            [
                'category_id' => $petSuppliesCategory->id,
                'name' => 'طعام القطط',
                'slug' => 'cat-food',
                'description' => 'طعام رطب للقطط',
                'price' => 8.00,
                'unit' => 'علبة',
                'stock_quantity' => 120,
                'is_available' => true,
                'is_featured' => false,
                'weight' => 400,
                'brand' => 'فريسكيز',
                'sort_order' => 2,
            ],
            [
                'category_id' => $petSuppliesCategory->id,
                'name' => 'ألعاب الكلاب',
                'slug' => 'dog-toys',
                'description' => 'ألعاب مطاطية للكلاب',
                'price' => 15.00,
                'unit' => 'قطعة',
                'stock_quantity' => 40,
                'is_available' => true,
                'is_featured' => false,
                'weight' => 150,
                'brand' => 'كونغ',
                'sort_order' => 3,
            ],
        ];

        foreach ($products as $product) {
            // إضافة sales_count عشوائي لكل منتج
            $product['sales_count'] = rand(0, 100);
            Product::create($product);
        }
    }
}
