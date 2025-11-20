<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StoreType;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Inertia\Inertia;

class StoreTypeController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/StoreTypes', [
            'storeTypes' => StoreType::orderBy('display_order')->orderBy('name_en')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'key' => ['nullable', 'string', 'max:50', 'regex:/^[a-z0-9-_]+$/i', 'unique:store_types,key'],
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:10'],
            'description' => ['nullable', 'string', 'max:500'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if (empty($data['key'])) {
            $data['key'] = Str::slug($data['name_en']);
        }

        $data['is_active'] = $data['is_active'] ?? true;

        StoreType::create($data);

        return redirect()->back()->with('success', __('store_type_created'));
    }

    public function update(Request $request, StoreType $storeType)
    {
        $data = $request->validate([
            'key' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-z0-9-_]+$/i',
                Rule::unique('store_types', 'key')->ignore($storeType->id),
            ],
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:10'],
            'description' => ['nullable', 'string', 'max:500'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $storeType->update($data);

        return redirect()->back()->with('success', __('store_type_updated'));
    }

    public function destroy(StoreType $storeType)
    {
        if ($storeType->key === 'grocery') {
            return redirect()->back()->with('error', __('store_type_delete_protected'));
        }

        $storeType->delete();

        return redirect()->back()->with('success', __('store_type_deleted'));
    }
}

