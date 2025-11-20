<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class Category extends Model
{
    protected $fillable = [
        'name',
        'name_ar',
        'name_en',
        'slug',
        'description',
        'description_ar',
        'description_en',
        'image',
        'icon',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'image_url',
        'display_name',
        'display_description',
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        if (Str::startsWith($this->image, ['http://', 'https://', 'data:'])) {
            return $this->image;
        }

        $path = Str::startsWith($this->image, 'storage/') ? $this->image : 'storage/' . ltrim($this->image, '/');

        return asset($path);
    }

    public function getDisplayNameAttribute(): ?string
    {
        $locale = app()->getLocale();
        $nameAr = Arr::get($this->attributes, 'name_ar');
        $nameEn = Arr::get($this->attributes, 'name_en');
        $fallback = Arr::get($this->attributes, 'name');

        return $locale === 'en'
            ? ($nameEn ?? $nameAr ?? $fallback)
            : ($nameAr ?? $nameEn ?? $fallback);
    }

    public function getDisplayDescriptionAttribute(): ?string
    {
        $locale = app()->getLocale();
        $descAr = Arr::get($this->attributes, 'description_ar');
        $descEn = Arr::get($this->attributes, 'description_en');
        $fallback = Arr::get($this->attributes, 'description');

        return $locale === 'en'
            ? ($descEn ?? $descAr ?? $fallback)
            : ($descAr ?? $descEn ?? $fallback);
    }

    public function getNameAttribute($value)
    {
        $locale = app()->getLocale();
        $nameAr = Arr::get($this->attributes, 'name_ar');
        $nameEn = Arr::get($this->attributes, 'name_en');

        return $locale === 'en'
            ? ($nameEn ?? $nameAr ?? $value)
            : ($nameAr ?? $nameEn ?? $value);
    }

    public function getDescriptionAttribute($value)
    {
        $locale = app()->getLocale();
        $descAr = Arr::get($this->attributes, 'description_ar');
        $descEn = Arr::get($this->attributes, 'description_en');

        return $locale === 'en'
            ? ($descEn ?? $descAr ?? $value)
            : ($descAr ?? $descEn ?? $value);
    }
}
