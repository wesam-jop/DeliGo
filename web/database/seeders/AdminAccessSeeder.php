<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AdminAccess;
use App\Models\User;

class AdminAccessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // إضافة صلاحية للإدمن الافتراضي إذا كان موجوداً
        $adminUser = User::where('phone', '963111111111')->first();
        
        if ($adminUser && !AdminAccess::where('phone', '963111111111')->exists()) {
            AdminAccess::create([
                'user_id' => $adminUser->id,
                'phone' => '963111111111',
                'is_active' => true,
                'notes' => 'حساب الإدمن الافتراضي',
            ]);
        }
    }
}
