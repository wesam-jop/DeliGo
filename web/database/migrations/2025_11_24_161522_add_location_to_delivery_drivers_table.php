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
        Schema::table('delivery_drivers', function (Blueprint $table) {
            $table->foreignId('governorate_id')->nullable()->after('current_longitude')->constrained()->onDelete('set null');
            $table->foreignId('area_id')->nullable()->after('governorate_id')->constrained('areas')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('delivery_drivers', function (Blueprint $table) {
            $table->dropForeign(['governorate_id']);
            $table->dropForeign(['area_id']);
            $table->dropColumn(['governorate_id', 'area_id']);
        });
    }
};
