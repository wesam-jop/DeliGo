<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Area extends Model
{
    protected $fillable = [
        'name',
        'name_en',
        'description',
        'description_en',
        'city',
        'city_en',
        'address',
        'latitude',
        'longitude',
        'delivery_radius',
        'delivery_fee',
        'estimated_delivery_time',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'delivery_fee' => 'decimal:2',
        'delivery_radius' => 'integer',
        'estimated_delivery_time' => 'integer',
        'display_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order')->orderBy('name');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function deliveryDrivers(): HasMany
    {
        return $this->hasMany(DeliveryDriver::class);
    }
}
