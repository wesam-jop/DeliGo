<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::withCount('products')
            ->orderBy('sort_order')
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate stats
        $stats = [
            'total' => Category::count(),
            'active' => Category::where('is_active', true)->count(),
            'inactive' => Category::where('is_active', false)->count(),
            'total_products' => Category::withCount('products')->get()->sum('products_count'),
            'categories_with_products' => Category::has('products')->count(),
            'categories_without_products' => Category::doesntHave('products')->count(),
        ];

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'stats' => $stats,
        ]);
    }

    public function show(Category $category)
    {
        $category->load(['products' => function($query) {
            $query->latest()->limit(10);
        }]);
        
        return Inertia::render('Admin/Categories/Show', [
            'category' => $category,
        ]);
    }

    public function toggleActive(Category $category)
    {
        $category->update([
            'is_active' => !$category->is_active,
        ]);

        return redirect()->back()->with('success', 'Category status updated successfully');
    }
}

