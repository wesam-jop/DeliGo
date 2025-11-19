<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    protected $fillable = [
        'owner_id',
        'name',
        'code',
        'store_type',
        'logo_path',
        'address',
        'latitude',
        'longitude',
        'phone',
        'email',
        'opening_time',
        'closing_time',
        'is_active',
        'delivery_radius',
        'delivery_fee',
        'estimated_delivery_time',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'delivery_fee' => 'decimal:2',
        'is_active' => 'boolean',
        'opening_time' => 'datetime:H:i',
        'closing_time' => 'datetime:H:i',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function isWithinDeliveryRadius($latitude, $longitude)
    {
        $distance = $this->calculateDistance($latitude, $longitude);
        return $distance <= $this->delivery_radius;
    }

    private function calculateDistance($latitude, $longitude)
    {
        $earthRadius = 6371; // Earth's radius in kilometers

        $latDiff = deg2rad($latitude - $this->latitude);
        $lonDiff = deg2rad($longitude - $this->longitude);

        $a = sin($latDiff / 2) * sin($latDiff / 2) +
             cos(deg2rad($this->latitude)) * cos(deg2rad($latitude)) *
             sin($lonDiff / 2) * sin($lonDiff / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
