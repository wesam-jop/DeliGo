<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class DriverApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'full_name',
        'phone',
        'address',
        'birth_date',
        'vehicle_type',
        'vehicle_photo_path',
        'personal_photo_path',
        'id_photo_path',
        'status',
        'notes',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'reviewed_at' => 'datetime',
    ];

    protected $appends = [
        'vehicle_photo_url',
        'personal_photo_url',
        'id_photo_url',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function getVehiclePhotoUrlAttribute(): ?string
    {
        return $this->vehicle_photo_path ? Storage::url($this->vehicle_photo_path) : null;
    }

    public function getPersonalPhotoUrlAttribute(): ?string
    {
        return $this->personal_photo_path ? Storage::url($this->personal_photo_path) : null;
    }

    public function getIdPhotoUrlAttribute(): ?string
    {
        return $this->id_photo_path ? Storage::url($this->id_photo_path) : null;
    }
}

