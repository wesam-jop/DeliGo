<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeliveryDriver extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'email',
        'vehicle_type',
        'license_number',
        'status',
        'current_latitude',
        'current_longitude',
        'is_active',
        'rating',
        'total_deliveries',
    ];

    protected $casts = [
        'current_latitude' => 'decimal:8',
        'current_longitude' => 'decimal:8',
        'rating' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'available')->where('is_active', true);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function isAvailable()
    {
        return $this->status === 'available' && $this->is_active;
    }

    public function isBusy()
    {
        return $this->status === 'busy';
    }

    public function isOffline()
    {
        return $this->status === 'offline';
    }
}
