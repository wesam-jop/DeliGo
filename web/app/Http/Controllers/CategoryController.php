<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Product;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::active()
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function show(Category $category, Request $request)
    {
        $query = $category->products()->available();

        // البحث
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
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

        return Inertia::render('Categories/Show', [
            'category' => $category,
            'products' => $products,
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }
}
