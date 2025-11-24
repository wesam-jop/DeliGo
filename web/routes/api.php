<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\FavoriteProductController;
use App\Http\Controllers\Api\DeliveryLocationController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProfileController;

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
    Route::post('/verify-phone', [AuthController::class, 'verifyPhone']);
    Route::post('/resend-verification', [AuthController::class, 'resendVerification']);
    
    // Public product and category routes
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::get('/stores', [StoreController::class, 'index']);
    Route::get('/stores/{id}', [StoreController::class, 'show']);
    Route::get('/stores/{id}/products', [StoreController::class, 'products']);
    
    // Location routes
    Route::get('/governorates', function () {
        $governorates = \App\Models\Governorate::active()
            ->orderBy('display_order')
            ->get()
            ->map(fn ($gov) => [
                'id' => $gov->id,
                'name' => app()->getLocale() === 'ar' ? $gov->name_ar : $gov->name_en,
            ]);
        
        return response()->json([
            'success' => true,
            'data' => $governorates
        ]);
    });
    
    Route::get('/cities', function (Request $request) {
        $query = \App\Models\City::active()->orderBy('display_order');
        
        if ($governorateId = $request->get('governorate_id')) {
            $query->where('governorate_id', $governorateId);
        }
        
        $cities = $query->get()
            ->map(fn ($city) => [
                'id' => $city->id,
                'name' => app()->getLocale() === 'ar' ? $city->name_ar : $city->name_en,
                'governorate_id' => $city->governorate_id,
            ]);
        
        return response()->json([
            'success' => true,
            'data' => $cities
        ]);
    });
    
    Route::get('/areas', function (Request $request) {
        $query = \App\Models\Area::active()->ordered();
        
        // فلترة المناطق حسب المحافظة
        if ($governorateId = $request->get('governorate_id')) {
            // جلب أسماء المدن في هذه المحافظة
            $cities = \App\Models\City::where('governorate_id', $governorateId)
                ->active()
                ->get();
            
            if ($cities->count() > 0) {
                // جمع أسماء المدن بالعربي والإنجليزي (مع تنظيف الفضاءات)
                $cityNamesAr = $cities->pluck('name_ar')->filter()->map(fn($name) => trim($name))->unique()->filter()->toArray();
                $cityNamesEn = $cities->pluck('name_en')->filter()->map(fn($name) => trim($name))->unique()->filter()->toArray();
                $allCityNames = array_unique(array_merge($cityNamesAr, $cityNamesEn));
                
                // فلترة المناطق التي تطابق أسماء المدن (مطابقة كاملة أو جزئية)
                if (count($allCityNames) > 0) {
                    $query->where(function ($q) use ($allCityNames) {
                        $first = true;
                        foreach ($allCityNames as $cityName) {
                            if (empty(trim($cityName))) continue;
                            
                            if ($first) {
                                $q->where(function ($subQ) use ($cityName) {
                                    $subQ->where('city', '=', $cityName)
                                         ->orWhere('city', 'like', '%' . $cityName . '%')
                                         ->orWhere('city_en', '=', $cityName)
                                         ->orWhere('city_en', 'like', '%' . $cityName . '%');
                                });
                                $first = false;
                            } else {
                                $q->orWhere(function ($subQ) use ($cityName) {
                                    $subQ->where('city', '=', $cityName)
                                         ->orWhere('city', 'like', '%' . $cityName . '%')
                                         ->orWhere('city_en', '=', $cityName)
                                         ->orWhere('city_en', 'like', '%' . $cityName . '%');
                                });
                            }
                        }
                    });
                } else {
                    // إذا لم تكن هناك أسماء مدن، لا تعرض أي مناطق
                    $query->whereRaw('1 = 0');
                }
            } else {
                // إذا لم تكن هناك مدن في المحافظة، لا تعرض أي مناطق
                $query->whereRaw('1 = 0');
            }
        }
        
        $areas = $query->get()
            ->map(fn ($area) => [
                'id' => $area->id,
                'name' => app()->getLocale() === 'ar' ? $area->name : ($area->name_en ?? $area->name),
                'city' => app()->getLocale() === 'ar' ? $area->city : ($area->city_en ?? $area->city),
                'latitude' => $area->latitude,
                'longitude' => $area->longitude,
            ]);
        
        return response()->json([
            'success' => true,
            'data' => $areas
        ]);
    });
    
    // Terms of Service
    Route::get('/terms', function (Request $request) {
        $locale = $request->header('Accept-Language', 'en');
        app()->setLocale($locale);
        
        $defaultSections = [
            [
                'title' => $locale === 'ar' ? 'الأهلية ومسؤوليات الحساب' : 'Eligibility & Account Responsibilities',
                'content' => $locale === 'ar' 
                    ? 'بإنشاء حساب، تؤكد أنك تبلغ من العمر 18 عاماً على الأقل، وتقدم معلومات دقيقة، وستحافظ على أمان بيانات تسجيل الدخول الخاصة بك. أنت مسؤول بالكامل عن جميع الأنشطة التي تتم تحت حسابك.'
                    : 'By creating an account, you confirm that you are at least 18 years old, provide accurate information, and will keep your login credentials secure. You are fully responsible for all activity performed under your account.',
            ],
            [
                'title' => $locale === 'ar' ? 'الطلبات والمدفوعات والتوصيل' : 'Orders, Payments, and Delivery',
                'content' => $locale === 'ar'
                    ? 'جميع الطلبات المقدمة من خلال المنصة تخضع للتوفر واللوائح المحلية. أوقات التوصيل هي تقديرات وقد تختلف. قد تتغير الأسعار في أي وقت، لكن التغييرات لن تؤثر على الطلبات المؤكدة.'
                    : 'All orders placed through the platform are subject to availability and local regulations. Delivery times are estimates and may vary. Prices may change at any time, but changes will not affect confirmed orders.',
            ],
            [
                'title' => $locale === 'ar' ? 'الأنشطة المحظورة' : 'Prohibited Activities',
                'content' => $locale === 'ar'
                    ? 'لا يجوز لك إساءة استخدام المنصة، أو محاولة الوصول غير المصرح به، أو جمع البيانات، أو الانخراط في أي نشاط يعطل خدماتنا. قد تؤدي الانتهاكات إلى التعليق الفوري.'
                    : 'You may not misuse the platform, attempt to gain unauthorized access, scrape data, or engage in any activity that disrupts our services. Violations may result in immediate suspension.',
            ],
            [
                'title' => $locale === 'ar' ? 'المسؤولية والحدود' : 'Liability & Limitation',
                'content' => $locale === 'ar'
                    ? 'نسعى جاهدين لتوفير خدمة موثوقة ولكن لا يمكننا ضمان التوفر دون انقطاع. مسؤوليتنا محدودة إلى أقصى حد يسمح به القانون.'
                    : 'We strive to provide reliable service but cannot guarantee uninterrupted availability. Our liability is limited to the maximum extent permitted by law.',
            ],
        ];

        $sections = json_decode(\App\Models\Setting::get('terms_sections', json_encode($defaultSections, JSON_UNESCAPED_UNICODE)), true);
        if (!is_array($sections) || empty($sections)) {
            $sections = $defaultSections;
        }

        return response()->json([
            'success' => true,
            'data' => [
                'intro' => \App\Models\Setting::get('terms_intro', $locale === 'ar' 
                    ? 'باستخدام منصتنا، أنت توافق على الشروط والأحكام التالية التي تحكم جميع الطلبات والخدمات والتفاعلات.'
                    : 'By using our platform you agree to the following terms and conditions that govern all orders, services, and interactions.'),
                'lastUpdated' => \App\Models\Setting::get('terms_last_updated', now()->format('F j, Y')),
                'sections' => $sections,
            ]
        ]);
    });
    
    // Privacy Policy
    Route::get('/privacy', function (Request $request) {
        $locale = $request->header('Accept-Language', 'en');
        app()->setLocale($locale);
        
        $defaultSections = [
            [
                'title' => $locale === 'ar' ? 'البيانات التي نجمعها' : 'Data We Collect',
                'content' => $locale === 'ar'
                    ? 'نجمع المعلومات التي تقدمها أثناء التسجيل والطلب ودعم العملاء. يتضمن ذلك تفاصيل الاتصال وعناوين التوصيل وتفضيلات الدفع ومعلومات الجهاز المستخدمة لتحسين الأمان وتخصيص تجربتك.'
                    : 'We collect the information you provide during registration, ordering, and customer support. This includes contact details, delivery addresses, payment preferences, and device information used to improve security and personalize your experience.',
            ],
            [
                'title' => $locale === 'ar' ? 'كيف نستخدم بياناتك' : 'How We Use Your Data',
                'content' => $locale === 'ar'
                    ? 'تسمح لنا بياناتك بمعالجة الطلبات وضمان التوصيل في الوقت المحدد وتخصيص توصيات المنتجات والتواصل مع التحديثات. تساعدنا المقاييس المجمعة والمجهولة الهوية على تحسين التوفر والخدمات اللوجستية والعروض الترويجية.'
                    : 'Your data allows us to process orders, ensure on-time delivery, tailor product recommendations, and communicate updates. Aggregated, anonymized metrics help us improve availability, logistics, and promotions.',
            ],
            [
                'title' => $locale === 'ar' ? 'المشاركة والأطراف الثالثة' : 'Sharing & Third Parties',
                'content' => $locale === 'ar'
                    ? 'نشارك البيانات الشخصية فقط مع الشركاء الموثوقين الذين يساعدوننا في تشغيل المنصة (معالجات الدفع وشركاء التوصيل والتحليلات). كل شريك ملزم تعاقدياً بحماية بياناتك واستخدامها فقط للخدمة المقصودة.'
                    : 'We only share personal data with trusted partners who help us operate the platform (payment processors, delivery partners, analytics). Each partner is contractually obligated to protect your data and use it solely for the intended service.',
            ],
            [
                'title' => $locale === 'ar' ? 'خياراتك وحقوقك' : 'Your Choices & Rights',
                'content' => $locale === 'ar'
                    ? 'يمكنك تحديث بيانات ملفك الشخصي أو طلب نسخة من معلوماتك أو طلب حذفها عن طريق الاتصال بالدعم. يمكن إدارة أذونات الموقع وإشعارات التسويق وتفضيلات التوطين داخل التطبيق.'
                    : 'You can update your profile data, request a copy of your information, or ask us to delete it by contacting support. Location permissions, marketing notifications, and localization preferences can be managed inside the app.',
            ],
        ];

        $sections = json_decode(\App\Models\Setting::get('privacy_sections', json_encode($defaultSections, JSON_UNESCAPED_UNICODE)), true);
        if (!is_array($sections) || empty($sections)) {
            $sections = $defaultSections;
        }

        return response()->json([
            'success' => true,
            'data' => [
                'intro' => \App\Models\Setting::get('privacy_intro', $locale === 'ar'
                    ? 'نوضح ما هي البيانات التي نجمعها وكيف نحميها والخيارات المتاحة لك فيما يتعلق بخصوصيتك أثناء استخدام منصتنا.'
                    : 'We explain what data we collect, how we protect it, and the choices you have over your privacy while using our platform.'),
                'lastUpdated' => \App\Models\Setting::get('privacy_last_updated', now()->format('F j, Y')),
                'sections' => $sections,
            ]
        ]);
    });
});

// Protected routes
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/change-password', [ProfileController::class, 'changePassword']);
    
    // Cart routes
    Route::get('/cart', [CartController::class, 'index'])->name('api.cart.index');
    Route::get('/cart/count', [CartController::class, 'count'])->name('api.cart.count');
    Route::post('/cart/add', [CartController::class, 'add'])->name('api.cart.add');
    Route::put('/cart/update', [CartController::class, 'update'])->name('api.cart.update');
    Route::delete('/cart/remove/{product}', [CartController::class, 'remove'])->name('api.cart.remove');
    Route::delete('/cart/clear', [CartController::class, 'clear'])->name('api.cart.clear');
    
    // Favorite routes
    Route::get('/favorites', [FavoriteProductController::class, 'index'])->name('api.favorites.index');
    Route::post('/favorites', [FavoriteProductController::class, 'store'])->name('api.favorites.store');
    Route::delete('/favorites/{product}', [FavoriteProductController::class, 'destroy'])->name('api.favorites.destroy');
    
    // Delivery locations routes
    Route::get('/delivery-locations', [DeliveryLocationController::class, 'index'])->name('api.delivery-locations.index');
    Route::post('/delivery-locations', [DeliveryLocationController::class, 'store'])->name('api.delivery-locations.store');
    Route::put('/delivery-locations/{deliveryLocation}', [DeliveryLocationController::class, 'update'])->name('api.delivery-locations.update');
    Route::delete('/delivery-locations/{deliveryLocation}', [DeliveryLocationController::class, 'destroy'])->name('api.delivery-locations.destroy');
    Route::post('/delivery-locations/{deliveryLocation}/default', [DeliveryLocationController::class, 'setDefault'])->name('api.delivery-locations.default');
    
    // Order routes
    Route::get('/user/orders', [OrderController::class, 'userOrders'])->name('api.user.orders');
    Route::apiResource('orders', OrderController::class)->names('api.orders');
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('api.orders.cancel');
    Route::get('/orders/{order}/track', [OrderController::class, 'track'])->name('api.orders.track');
    
    // Dashboard routes
    Route::get('/dashboard/customer', [DashboardController::class, 'customerStats'])->name('api.dashboard.customer');
    Route::get('/dashboard/store', [DashboardController::class, 'storeStats'])->name('api.dashboard.store');
    Route::get('/dashboard/admin', [DashboardController::class, 'adminStats'])->name('api.dashboard.admin');
    
    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('api.notifications.index');
    Route::get('/notifications/{id}', [NotificationController::class, 'show'])->name('api.notifications.show');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('api.notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('api.notifications.read-all');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('api.notifications.destroy');
    Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount'])->name('api.notifications.unread-count');
    
    // Push Notifications
    Route::post('/notifications/subscribe', [NotificationController::class, 'subscribe'])->name('api.notifications.subscribe');
    Route::post('/notifications/unsubscribe', [NotificationController::class, 'unsubscribe'])->name('api.notifications.unsubscribe');
});

// Admin routes
Route::prefix('v1/admin')->middleware('auth:sanctum')->group(function () {
    Route::apiResource('categories', CategoryController::class)
        ->except(['index', 'show'])
        ->names('api.admin.categories');
    Route::apiResource('products', ProductController::class)
        ->except(['index', 'show'])
        ->names('api.admin.products');
    Route::apiResource('stores', StoreController::class)
        ->except(['index', 'show'])
        ->names('api.admin.stores');
});
