<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\App;

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
        
        // Redirect back to the previous page
        return Redirect::back();
    }
}