<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // تشغيل جميع الـ Seeders
        $this->call([
            SettingSeeder::class,
            UserSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            StoreSeeder::class,
        ]);
    }
}
