<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'store_id',
        'name',
        'slug',
        'description',
        'price',
        'discount_price',
        'image',
        'images',
        'unit',
        'stock_quantity',
        'is_available',
        'is_featured',
        'weight',
        'nutritional_info',
        'brand',
        'barcode',
        'sort_order',
        'sales_count',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'weight' => 'decimal:2',
        'images' => 'array',
        'nutritional_info' => 'array',
        'is_available' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function getFinalPriceAttribute()
    {
        return $this->discount_price ?? $this->price;
    }

    public function getDiscountPercentageAttribute()
    {
        if (!$this->discount_price) {
            return 0;
        }
        
        return round((($this->price - $this->discount_price) / $this->price) * 100);
    }
}
