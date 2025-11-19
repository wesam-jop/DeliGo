<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\StoreController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::prefix('v1')->group(function () {
    // Authentication routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // Public product and category routes
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::get('/stores', [StoreController::class, 'index']);
    Route::get('/stores/{id}', [StoreController::class, 'show']);
});

// Protected routes
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Order routes
    Route::apiResource('orders', OrderController::class)->names('api.orders');
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('api.orders.cancel');
    Route::get('/orders/{order}/track', [OrderController::class, 'track'])->name('api.orders.track');
    
    // User orders
    Route::get('/user/orders', [OrderController::class, 'userOrders']);
});

// Admin routes (you can add admin middleware later)
Route::prefix('v1/admin')->middleware('auth:sanctum')->group(function () {
    Route::apiResource('categories', CategoryController::class)
        ->except(['index', 'show'])
        ->names('api.categories');
    Route::apiResource('products', ProductController::class)
        ->except(['index', 'show'])
        ->names('api.products');
    Route::apiResource('stores', StoreController::class)
        ->except(['index', 'show'])
        ->names('api.stores');
});
