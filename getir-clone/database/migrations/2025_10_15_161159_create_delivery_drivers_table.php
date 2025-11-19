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
        Schema::create('delivery_drivers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone')->unique();
            $table->string('email')->unique();
            $table->string('vehicle_type')->default('motorcycle'); // motorcycle, bicycle, car
            $table->string('license_number')->nullable();
            $table->enum('status', ['available', 'busy', 'offline'])->default('offline');
            $table->decimal('current_latitude', 10, 8)->nullable();
            $table->decimal('current_longitude', 11, 8)->nullable();
            $table->boolean('is_active')->default(true);
            $table->decimal('rating', 3, 2)->default(5.0);
            $table->integer('total_deliveries')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_drivers');
    }
};
