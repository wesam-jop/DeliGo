<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('user_type', ['customer', 'store_owner', 'admin'])->default('customer')->after('email');
            $table->boolean('is_verified')->default(false)->after('user_type');
            $table->string('verification_code')->nullable()->after('is_verified');
            $table->timestamp('verification_code_expires_at')->nullable()->after('verification_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['user_type', 'is_verified', 'verification_code', 'verification_code_expires_at']);
        });
    }
};
