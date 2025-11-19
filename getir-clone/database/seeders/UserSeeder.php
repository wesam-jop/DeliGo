<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\AdminAccess;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Clean phone number - remove all non-digit characters
     */
    private function cleanPhoneNumber($phone)
    {
        return preg_replace('/\D/', '', $phone);
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // إنشاء حساب إدمن
        $adminUser = User::create([
            'name' => 'Admin User',
            'phone' => '963111111111', // رقم هاتف بسيط للإدمن
            'password' => Hash::make('default'), // كلمة مرور افتراضية غير مستخدمة
            'user_type' => 'admin',
            'is_verified' => true,
        ]);

        // إضافة صلاحية الدخول للإدمن
        AdminAccess::create([
            'user_id' => $adminUser->id,
            'phone' => '963111111111',
            'is_active' => true,
            'notes' => 'حساب الإدمن الافتراضي',
        ]);

        // إنشاء صاحب متجر
        User::create([
            'name' => 'Store Owner',
            'phone' => $this->cleanPhoneNumber('+963-11-9876543'), // 963119876543
            'password' => Hash::make('default'), // كلمة مرور افتراضية غير مستخدمة
            'user_type' => 'store_owner',
            'is_verified' => true,
        ]);

        // إنشاء سائق توصيل
        User::create([
            'name' => 'Delivery Driver',
            'phone' => $this->cleanPhoneNumber('+963-11-5555555'), // 963115555555
            'password' => Hash::make('default'), // كلمة مرور افتراضية غير مستخدمة
            'user_type' => 'driver',
            'is_verified' => true,
        ]);

        // إنشاء عملاء تجريبيين
        User::create([
            'name' => 'Ahmed Ali',
            'phone' => $this->cleanPhoneNumber('+963-11-1234567'), // 963111234567
            'password' => Hash::make('default'), // كلمة مرور افتراضية غير مستخدمة
            'user_type' => 'customer',
            'is_verified' => true,
        ]);

        User::create([
            'name' => 'Fatima Hassan',
            'phone' => $this->cleanPhoneNumber('+963-11-2345678'), // 963112345678
            'password' => Hash::make('default'), // كلمة مرور افتراضية غير مستخدمة
            'user_type' => 'customer',
            'is_verified' => true,
        ]);

        User::create([
            'name' => 'Omar Khaled',
            'phone' => $this->cleanPhoneNumber('+963-11-3456789'), // 963113456789
            'password' => Hash::make('default'), // كلمة مرور افتراضية غير مستخدمة
            'user_type' => 'customer',
            'is_verified' => false, // غير محقق للاختبار
        ]);

        // إنشاء عملاء إضافيين باستخدام Factory
        User::factory(10)->create([
            'user_type' => 'customer',
            'is_verified' => true,
        ]);

        User::factory(5)->create([
            'user_type' => 'customer',
            'is_verified' => false,
        ]);

        User::factory(3)->create([
            'user_type' => 'store_owner',
            'is_verified' => true,
        ]);

        User::factory(5)->create([
            'user_type' => 'driver',
            'is_verified' => true,
        ]);
    }
}
