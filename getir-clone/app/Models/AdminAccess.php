<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminAccess extends Model
{
    protected $fillable = [
        'user_id',
        'phone',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the user that owns the admin access
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if a phone number has admin access
     */
    public static function hasAccess($phone): bool
    {
        return self::where('phone', $phone)
            ->where('is_active', true)
            ->exists();
    }
}
