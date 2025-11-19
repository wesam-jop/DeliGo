<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\App;
use App\Models\Setting;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $cart = $request->session()->get('cart', []);
        $cartCount = array_sum($cart);
        
        // Get locale from session first, then from app
        $locale = $request->session()->get('locale', App::getLocale());
        
        // Ensure locale is valid
        if (!in_array($locale, ['ar', 'en'])) {
            $locale = 'ar';
        }

        // Get general settings
        $settings = $this->getGeneralSettings();
        
        // Override locale with default from settings if not set
        if (!$request->session()->has('locale') && isset($settings['default_language'])) {
            $locale = $settings['default_language'];
        }

        return [
            ...parent::share($request),
            'cartCount' => $cartCount,
            'locale' => $locale,
            'translations' => $this->getTranslations($locale),
            'settings' => $settings,
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'phone' => $request->user()->phone,
                    'user_type' => $request->user()->user_type,
                    'is_verified' => $request->user()->is_verified,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }

    /**
     * Get translations for the current locale
     */
    private function getTranslations(string $locale): array
    {
        $translations = [];
        
        // Load app translations
        if (file_exists(resource_path("lang/{$locale}/app.php"))) {
            $translations = array_merge($translations, require resource_path("lang/{$locale}/app.php"));
        }
        
        // Load auth translations
        if (file_exists(resource_path("lang/{$locale}/auth.php"))) {
            $translations = array_merge($translations, require resource_path("lang/{$locale}/auth.php"));
        }
        
        // Load validation translations
        if (file_exists(resource_path("lang/{$locale}/validation.php"))) {
            $translations = array_merge($translations, require resource_path("lang/{$locale}/validation.php"));
        }
        
        return $translations;
    }

    /**
     * Get general settings from database
     */
    private function getGeneralSettings(): array
    {
        return [
            'site_name' => Setting::get('site_name', 'Getir Clone'),
            'site_description' => Setting::get('site_description', 'Fast grocery delivery in 10 minutes'),
            'site_logo' => Setting::get('site_logo', ''),
            'site_favicon' => Setting::get('site_favicon', ''),
            'default_language' => Setting::get('default_language', 'ar'),
            'default_currency' => Setting::get('default_currency', 'SYP'),
            'timezone' => Setting::get('timezone', 'Asia/Damascus'),
            'date_format' => Setting::get('date_format', 'Y-m-d'),
            'time_format' => Setting::get('time_format', 'H:i'),
            'maintenance_mode' => Setting::get('maintenance_mode', '0') === '1' || Setting::get('maintenance_mode', '0') === true,
            'maintenance_message' => Setting::get('maintenance_message', 'We are currently under maintenance. Please check back later.'),
        ];
    }
}
