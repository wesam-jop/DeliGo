<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::withCount('products')
            ->orderBy('sort_order')
            ->orderBy('created_at', 'desc')
            ->get()
            ->append(['display_name', 'display_description', 'image_url']);

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

    public function create()
    {
        return Inertia::render('Admin/Categories/Create', [
            'nextSortOrder' => (Category::max('sort_order') ?? 0) + 1,
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validateCategory($request);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('categories', 'public');
        }

        $data['slug'] = $data['slug'] ?: Str::slug($data['name_en'] ?? $data['name_ar']);
        $data['sort_order'] = $data['sort_order'] ?? (Category::max('sort_order') ?? 0) + 1;

        Category::create($data);

        return redirect()->route('admin.categories.index')->with('success', __('category_created'));
    }

    public function edit(Category $category)
    {
        $category->append('image_url');

        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $data = $this->validateCategory($request, $category->id);

        if ($request->boolean('remove_image')) {
            $this->deleteImage($category->image);
            $data['image'] = null;
        }

        if ($request->hasFile('image')) {
            $this->deleteImage($category->image);
            $data['image'] = $request->file('image')->store('categories', 'public');
        }

        $data['slug'] = $data['slug'] ?: Str::slug($data['name_en'] ?? $data['name_ar']);

        $category->update($data);

        return redirect()->route('admin.categories.index')->with('success', __('category_updated'));
    }

    public function destroy(Category $category)
    {
        if ($category->products()->exists()) {
            return redirect()->back()->with('error', __('category_delete_has_products'));
        }

        $this->deleteImage($category->image);

        $category->delete();

        return redirect()->route('admin.categories.index')->with('success', __('category_deleted'));
    }

    public function toggleActive(Category $category)
    {
        $category->update([
            'is_active' => !$category->is_active,
        ]);

        return redirect()->back()->with('success', __('category_status_updated'));
    }

    protected function validateCategory(Request $request, ?int $ignoreId = null): array
    {
        $data = $request->validate([
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('categories', 'slug')->ignore($ignoreId),
            ],
            'description_ar' => ['nullable', 'string', 'max:1000'],
            'description_en' => ['nullable', 'string', 'max:1000'],
            'icon' => ['nullable', 'string', 'max:10'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:1000'],
            'is_active' => ['nullable', 'boolean'],
            'image' => ['nullable', 'image', 'max:2048'],
        ]);

        $data['is_active'] = array_key_exists('is_active', $data)
            ? (bool) $data['is_active']
            : true;

        $data['name'] = $data['name_ar'];
        $data['description'] = $data['description_ar'];

        return $data;
    }

    protected function deleteImage(?string $path): void
    {
        if (!$path) {
            return;
        }

        if (Str::startsWith($path, ['http://', 'https://', 'data:'])) {
            return;
        }

        $cleanPath = Str::startsWith($path, 'storage/')
            ? substr($path, 8)
            : ltrim($path, '/');

        if (Storage::disk('public')->exists($cleanPath)) {
            Storage::disk('public')->delete($cleanPath);
        }
    }
}

