<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cookie;

class LanguageController extends Controller
{
    /**
     * Switch the application language
     */
    public function switch(Request $request, $locale)
    {
        // Validate locale
        if (!in_array($locale, ['ar', 'en'])) {
            $locale = 'ar';
        }
        
        // Store locale in session
        Session::put('locale', $locale);
        
        // Set the application locale immediately
        App::setLocale($locale);
        
        // Force session to be saved
        Session::save();
        
        // Store locale preference in cookie for long-term persistence (1 year)
        $cookie = Cookie::make('preferred_locale', $locale, 60 * 24 * 365);
        
        // Redirect back to the previous page with the cookie attached
        return Redirect::back()->withCookie($cookie);
    }
}