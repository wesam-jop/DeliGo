<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class FavoriteProductController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => ['required', 'exists:products,id'],
        ]);

        $user = $request->user();

        if (!$user) {
            abort(403);
        }

        $user->favoriteProducts()->syncWithoutDetaching([
            $request->integer('product_id'),
        ]);

        return redirect()->back()->with('success', __('favorite_added_success'));
    }

    public function destroy(Request $request, Product $product)
    {
        $user = $request->user();

        if (!$user) {
            abort(403);
        }

        $user->favoriteProducts()->detach($product->id);

        return redirect()->back()->with('success', __('favorite_removed_success'));
    }
}

