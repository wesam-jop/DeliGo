<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->available();

        // البحث
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        // التصفية حسب الفئة
        if ($request->has('category') && $request->category) {
            $query->where('category_id', $request->category);
        }

        // الترتيب
        $sortBy = $request->get('sort', 'sort_order');
        $sortDirection = $request->get('direction', 'asc');
        
        if ($sortBy === 'price') {
            $query->orderBy('price', $sortDirection);
        } elseif ($sortBy === 'name') {
            $query->orderBy('name', $sortDirection);
        } else {
            $query->orderBy('sort_order', 'asc');
        }

        $products = $query->paginate(20);
        $categories = Category::active()->orderBy('sort_order')->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'sort', 'direction']),
        ]);
    }

    public function show(Product $product)
    {
        $product->load('category');
        
        // خوارزمية محسنة للمنتجات المشابهة
        $relatedProducts = $this->getRelatedProducts($product);

        return Inertia::render('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * خوارزمية محسنة للحصول على المنتجات المشابهة
     */
    private function getRelatedProducts(Product $product)
    {
        // 1. منتجات من نفس الفئة (الأولوية الأولى)
        $sameCategoryProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->available()
            ->inRandomOrder()
            ->limit(2)
            ->get();

        // 2. منتجات مميزة من فئات أخرى (الأولوية الثانية)
        $featuredProducts = Product::where('category_id', '!=', $product->category_id)
            ->where('is_featured', true)
            ->available()
            ->inRandomOrder()
            ->limit(1)
            ->get();

        // 3. منتجات عشوائية من فئات أخرى (الأولوية الثالثة)
        $randomProducts = Product::where('category_id', '!=', $product->category_id)
            ->where('is_featured', false)
            ->available()
            ->inRandomOrder()
            ->limit(1)
            ->get();

        // دمج النتائج مع الحفاظ على الترتيب
        $relatedProducts = $sameCategoryProducts
            ->concat($featuredProducts)
            ->concat($randomProducts)
            ->take(4);

        return $relatedProducts;
    }
}
