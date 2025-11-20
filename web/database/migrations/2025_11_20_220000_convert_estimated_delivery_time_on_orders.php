<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->integer('estimated_delivery_time_minutes')->nullable()->after('estimated_delivery_time');
        });

        DB::table('orders')
            ->select('id', 'estimated_delivery_time')
            ->orderBy('id')
            ->chunkById(100, function ($orders) {
                foreach ($orders as $order) {
                    $value = $order->estimated_delivery_time;

                    if (!$value) {
                        continue;
                    }

                    $timestamp = Carbon::parse($value)->timestamp;

                    DB::table('orders')
                        ->where('id', $order->id)
                        ->update(['estimated_delivery_time_minutes' => $timestamp]);
                }
            });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('estimated_delivery_time');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->renameColumn('estimated_delivery_time_minutes', 'estimated_delivery_time');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->timestamp('estimated_delivery_time_backup')->nullable()->after('estimated_delivery_time');
        });

        DB::table('orders')
            ->select('id', 'estimated_delivery_time')
            ->orderBy('id')
            ->chunkById(100, function ($orders) {
                foreach ($orders as $order) {
                    if ($order->estimated_delivery_time === null) {
                        continue;
                    }

                    $timestamp = Carbon::createFromTimestamp($order->estimated_delivery_time);

                    DB::table('orders')
                        ->where('id', $order->id)
                        ->update(['estimated_delivery_time_backup' => $timestamp]);
                }
            });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('estimated_delivery_time');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->renameColumn('estimated_delivery_time_backup', 'estimated_delivery_time');
        });
    }
};

