<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\UserRoleController;
use App\Http\Controllers\StoreProductController;
use App\Http\Controllers\StorefrontController;
use App\Http\Controllers\StoreSetupController;

// Language switching
Route::get('/language/{locale}', [LanguageController::class, 'switch'])->name('language.switch');

// Storage files access (for images and files)
Route::get('/storage/{path}', function ($path) {
    // Decode URL-encoded path
    $path = urldecode($path);
    
    // Security: prevent directory traversal
    if (strpos($path, '..') !== false) {
        abort(403);
    }
    
    $filePath = storage_path('app/public/' . $path);
    
    if (!file_exists($filePath) || !is_file($filePath)) {
        abort(404);
    }
    
    // Get MIME type
    $mimeType = mime_content_type($filePath);
    if (!$mimeType) {
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        $mimeTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'ico' => 'image/x-icon',
            'svg' => 'image/svg+xml',
        ];
        $mimeType = $mimeTypes[strtolower($extension)] ?? 'application/octet-stream';
    }
    
    return response()->file($filePath, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=31536000',
    ]);
})->where('path', '.*')->name('storage.file');

// Static Pages
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::get('/careers', function () {
    return Inertia::render('Careers');
})->name('careers');

Route::get('/help', function () {
    return Inertia::render('Help');
})->name('help');

// Service Pages
Route::get('/services/grocery-delivery', function () {
    $categories = \App\Models\Category::active()->orderBy('sort_order')->get();
    $products = \App\Models\Product::with('category')
        ->available()
        ->orderBy('sort_order')
        ->paginate(20);
    
    return Inertia::render('Services/GroceryDelivery', [
        'products' => $products,
        'categories' => $categories,
    ]);
})->name('services.grocery');

Route::get('/services/food-delivery', function () {
    $categories = \App\Models\Category::active()->orderBy('sort_order')->get();
    $products = \App\Models\Product::with('category')
        ->available()
        ->orderBy('sort_order')
        ->paginate(20);
    
    return Inertia::render('Services/FoodDelivery', [
        'products' => $products,
        'categories' => $categories,
    ]);
})->name('services.food');

Route::get('/services/pharmacy', function () {
    $categories = \App\Models\Category::active()->orderBy('sort_order')->get();
    $products = \App\Models\Product::with('category')
        ->available()
        ->orderBy('sort_order')
        ->paginate(20);
    
    return Inertia::render('Services/Pharmacy', [
        'products' => $products,
        'categories' => $categories,
    ]);
})->name('services.pharmacy');

Route::get('/stores', [StorefrontController::class, 'index'])->name('stores.index');

Route::get('/services/pet-supplies', function () {
    $categories = \App\Models\Category::active()->orderBy('sort_order')->get();
    $products = \App\Models\Product::with('category')
        ->available()
        ->orderBy('sort_order')
        ->paginate(20);
    
    return Inertia::render('Services/PetSupplies', [
        'products' => $products,
        'categories' => $categories,
    ]);
})->name('services.pet');

// Auth Routes
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login')->middleware('guest');

Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register')->middleware('guest');

Route::get('/verify-phone', function () {
    return Inertia::render('Auth/VerifyPhone', [
        'phone' => request('phone'),
        'userType' => request('user_type', 'customer'),
        'action' => request('action', 'register')
    ]);
})->name('verify.phone');

// Auth Actions
Route::post('/login', [App\Http\Controllers\Auth\AuthController::class, 'login'])->name('login.post');
Route::post('/register', [App\Http\Controllers\Auth\AuthController::class, 'register'])->name('register.post');
Route::post('/verify-phone', [App\Http\Controllers\Auth\AuthController::class, 'verifyPhone'])->name('verify.phone.post');
Route::post('/resend-verification', [App\Http\Controllers\Auth\AuthController::class, 'resendVerification'])->name('resend.verification');
Route::post('/logout', [App\Http\Controllers\Auth\AuthController::class, 'logout'])->name('logout');


// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/settings', [App\Http\Controllers\Admin\AdminController::class, 'settings'])->name('settings');
    Route::get('/settings/general', [App\Http\Controllers\Admin\AdminController::class, 'generalSettings'])->name('settings.general');
    Route::post('/settings/general', [App\Http\Controllers\Admin\AdminController::class, 'updateGeneralSettings'])->name('settings.general.update');
    Route::get('/settings/payments', [App\Http\Controllers\Admin\AdminController::class, 'paymentSettings'])->name('settings.payments');
    Route::post('/settings/payments', [App\Http\Controllers\Admin\AdminController::class, 'updatePaymentSettings'])->name('settings.payments.update');
    Route::get('/settings/areas', [App\Http\Controllers\Admin\AdminController::class, 'areaSettings'])->name('settings.areas');
    Route::post('/settings/areas', [App\Http\Controllers\Admin\AdminController::class, 'storeArea'])->name('settings.areas.store');
    Route::put('/settings/areas/{id}', [App\Http\Controllers\Admin\AdminController::class, 'updateArea'])->name('settings.areas.update');
    Route::delete('/settings/areas/{id}', [App\Http\Controllers\Admin\AdminController::class, 'deleteArea'])->name('settings.areas.delete');
    Route::get('/backups', [App\Http\Controllers\Admin\AdminController::class, 'backups'])->name('backups');
    Route::post('/backups/create', [App\Http\Controllers\Admin\AdminController::class, 'createBackup'])->name('backups.create');
    Route::get('/backups/download/{filename}', [App\Http\Controllers\Admin\AdminController::class, 'downloadBackup'])->name('backups.download');
    Route::delete('/backups/{filename}', [App\Http\Controllers\Admin\AdminController::class, 'deleteBackup'])->name('backups.delete');
    Route::post('/backups/restore/{filename}', [App\Http\Controllers\Admin\AdminController::class, 'restoreBackup'])->name('backups.restore');
    Route::get('/logs', [App\Http\Controllers\Admin\AdminController::class, 'logs'])->name('logs');
    Route::post('/logs/clear', [App\Http\Controllers\Admin\AdminController::class, 'clearLogs'])->name('logs.clear');
    Route::delete('/logs/{filename}', [App\Http\Controllers\Admin\AdminController::class, 'deleteLogFile'])->name('logs.delete');
    Route::get('/logs/download/{filename}', [App\Http\Controllers\Admin\AdminController::class, 'downloadLog'])->name('logs.download');
    Route::get('/help', [App\Http\Controllers\Admin\AdminController::class, 'help'])->name('help');
    Route::get('/profile', [App\Http\Controllers\Admin\AdminController::class, 'profile'])->name('profile');
    Route::post('/profile', [App\Http\Controllers\Admin\AdminController::class, 'updateProfile'])->name('profile.update');
    Route::post('/upload-file', [App\Http\Controllers\Admin\AdminController::class, 'uploadFile'])->name('upload.file');
    
    // Users Management
    Route::get('/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::get('/users/customers', [App\Http\Controllers\Admin\UserController::class, 'customers'])->name('users.customers');
    Route::get('/users/store-owners', [App\Http\Controllers\Admin\UserController::class, 'storeOwners'])->name('users.store-owners');
    Route::get('/users/drivers', [App\Http\Controllers\Admin\UserController::class, 'drivers'])->name('users.drivers');
    Route::get('/users/create', [App\Http\Controllers\Admin\UserController::class, 'create'])->name('users.create');
    Route::post('/users', [App\Http\Controllers\Admin\UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'show'])->name('users.show');
    Route::get('/users/{user}/edit', [App\Http\Controllers\Admin\UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');
    
    // Admin Access Management
    Route::get('/admin-access', [App\Http\Controllers\Admin\AdminAccessController::class, 'index'])->name('admin-access.index');
    Route::get('/admin-access/create', [App\Http\Controllers\Admin\AdminAccessController::class, 'create'])->name('admin-access.create');
    Route::post('/admin-access', [App\Http\Controllers\Admin\AdminAccessController::class, 'store'])->name('admin-access.store');
    Route::get('/admin-access/{adminAccess}', [App\Http\Controllers\Admin\AdminAccessController::class, 'show'])->name('admin-access.show');
    Route::get('/admin-access/{adminAccess}/edit', [App\Http\Controllers\Admin\AdminAccessController::class, 'edit'])->name('admin-access.edit');
    Route::put('/admin-access/{adminAccess}', [App\Http\Controllers\Admin\AdminAccessController::class, 'update'])->name('admin-access.update');
    Route::delete('/admin-access/{adminAccess}', [App\Http\Controllers\Admin\AdminAccessController::class, 'destroy'])->name('admin-access.destroy');
    Route::post('/admin-access/{adminAccess}/toggle-active', [App\Http\Controllers\Admin\AdminAccessController::class, 'toggleActive'])->name('admin-access.toggle-active');
    
    // Orders Management
    Route::get('/orders', [App\Http\Controllers\Admin\OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [App\Http\Controllers\Admin\OrderController::class, 'show'])->name('orders.show');
    Route::put('/orders/{order}/status', [App\Http\Controllers\Admin\OrderController::class, 'updateStatus'])->name('orders.update-status');
    
    // Stores Management
    Route::get('/stores', [App\Http\Controllers\Admin\StoreController::class, 'index'])->name('stores.index');
    Route::get('/stores/{store}', [App\Http\Controllers\Admin\StoreController::class, 'show'])->name('stores.show');
    Route::post('/stores/{store}/toggle-active', [App\Http\Controllers\Admin\StoreController::class, 'toggleActive'])->name('stores.toggle-active');
    
    // Products Management
    Route::get('/products', [App\Http\Controllers\Admin\ProductController::class, 'index'])->name('products.index');
    Route::get('/products/{product}', [App\Http\Controllers\Admin\ProductController::class, 'show'])->name('products.show');
    Route::post('/products/{product}/toggle-available', [App\Http\Controllers\Admin\ProductController::class, 'toggleAvailable'])->name('products.toggle-available');
    Route::post('/products/{product}/toggle-featured', [App\Http\Controllers\Admin\ProductController::class, 'toggleFeatured'])->name('products.toggle-featured');
    
    // Categories Management
    Route::get('/categories', [App\Http\Controllers\Admin\CategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/{category}', [App\Http\Controllers\Admin\CategoryController::class, 'show'])->name('categories.show');
    Route::post('/categories/{category}/toggle-active', [App\Http\Controllers\Admin\CategoryController::class, 'toggleActive'])->name('categories.toggle-active');
    
    // Inventory Management
    Route::get('/inventory', [App\Http\Controllers\Admin\InventoryController::class, 'index'])->name('inventory.index');
    Route::put('/inventory/{product}/stock', [App\Http\Controllers\Admin\InventoryController::class, 'updateStock'])->name('inventory.update-stock');
    
    // Analytics
    Route::get('/analytics/overview', [App\Http\Controllers\Admin\AnalyticsController::class, 'overview'])->name('analytics.overview');
    Route::get('/analytics/sales', [App\Http\Controllers\Admin\AnalyticsController::class, 'sales'])->name('analytics.sales');
    Route::get('/analytics/customers', [App\Http\Controllers\Admin\AnalyticsController::class, 'customers'])->name('analytics.customers');
    Route::get('/analytics/delivery', [App\Http\Controllers\Admin\AnalyticsController::class, 'delivery'])->name('analytics.delivery');

    // Reports
    Route::get('/reports/financial', [App\Http\Controllers\Admin\FinancialReportController::class, 'financial'])->name('reports.financial');
});

// Download App
Route::get('/download-app', function () {
    return Inertia::render('DownloadApp');
})->name('download.app');

Route::get('/', function () {
    $categories = \App\Models\Category::active()->orderBy('sort_order')->limit(6)->get();

    $featuredProducts = \App\Models\Product::with('category')
        ->available()
        ->orderBy('sales_count', 'desc')
        ->limit(4)
        ->get();

    $featuredStores = \App\Models\Store::active()
        ->withCount(['orders', 'products'])
        ->orderByDesc('orders_count')
        ->limit(4)
        ->get();

    return Inertia::render('Home', [
        'categories' => $categories,
        'featuredProducts' => $featuredProducts,
        'featuredStores' => $featuredStores,
    ]);
});


// صفحات المنتجات
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

// صفحات الفئات
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/{category}', [CategoryController::class, 'show'])->name('categories.show');

Route::middleware('auth')->group(function () {
    // صفحات السلة
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::put('/cart/update', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/remove/{product}', [CartController::class, 'remove'])->name('cart.remove');
    Route::delete('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');

    // صفحات الطلبات
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
});


// صفحات الداشبورد
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();
        
        // Redirect to appropriate dashboard based on user type
        switch ($user->user_type) {
            case 'admin':
                return redirect()->route('admin.dashboard');
            case 'store_owner':
                return redirect('/dashboard/store');
            case 'driver':
                return redirect('/dashboard/driver');
            case 'customer':
            default:
                return redirect('/dashboard/customer');
        }
    })->name('dashboard');
    
    Route::get('/dashboard/customer', [DashboardController::class, 'customer'])->name('dashboard.customer');
    Route::get('/dashboard/store', [DashboardController::class, 'store'])->name('dashboard.store');
    Route::get('/dashboard/admin', [DashboardController::class, 'admin'])->name('dashboard.admin');
    Route::get('/dashboard/driver', [DashboardController::class, 'driver'])->name('dashboard.driver');
    Route::post('/dashboard/upgrade-role', [UserRoleController::class, 'upgrade'])->name('dashboard.upgrade-role');
    Route::get('/dashboard/store/setup', [StoreSetupController::class, 'create'])->name('dashboard.store.setup');
    Route::post('/dashboard/store/setup', [StoreSetupController::class, 'store'])->name('dashboard.store.setup.store');
    Route::post('/dashboard/store/products', [StoreProductController::class, 'store'])->name('dashboard.store.products.store');
});
