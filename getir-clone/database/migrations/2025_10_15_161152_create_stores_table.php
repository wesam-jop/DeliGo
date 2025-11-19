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
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique(); // Store identifier
            $table->text('address');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->time('opening_time');
            $table->time('closing_time');
            $table->boolean('is_active')->default(true);
            $table->integer('delivery_radius')->default(5); // in kilometers
            $table->decimal('delivery_fee', 8, 2)->default(0);
            $table->integer('estimated_delivery_time')->default(10); // in minutes
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
