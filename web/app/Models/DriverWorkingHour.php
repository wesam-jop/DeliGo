<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DriverWorkingHour extends Model
{
    protected $fillable = [
        'user_id',
        'day_of_week',
        'opening_time',
        'closing_time',
        'is_closed',
    ];

    protected $casts = [
        'opening_time' => 'datetime:H:i',
        'closing_time' => 'datetime:H:i',
        'is_closed' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getDayNameAttribute(): string
    {
        $days = [
            'sunday' => app()->getLocale() === 'ar' ? 'الأحد' : 'Sunday',
            'monday' => app()->getLocale() === 'ar' ? 'الإثنين' : 'Monday',
            'tuesday' => app()->getLocale() === 'ar' ? 'الثلاثاء' : 'Tuesday',
            'wednesday' => app()->getLocale() === 'ar' ? 'الأربعاء' : 'Wednesday',
            'thursday' => app()->getLocale() === 'ar' ? 'الخميس' : 'Thursday',
            'friday' => app()->getLocale() === 'ar' ? 'الجمعة' : 'Friday',
            'saturday' => app()->getLocale() === 'ar' ? 'السبت' : 'Saturday',
        ];

        return $days[$this->day_of_week] ?? $this->day_of_week;
    }
}
