<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get locale from session or default to 'ar'
        $locale = Session::get('locale', 'ar');
        
        // Check if locale is being changed via URL parameter
        if ($request->has('locale')) {
            $locale = $request->get('locale');
        }
        
        // Validate locale
        if (!in_array($locale, ['ar', 'en'])) {
            $locale = 'ar';
        }
        
        // Set the application locale
        App::setLocale($locale);
        
        // Store locale in session for future requests
        Session::put('locale', $locale);
        
        // Also set the locale in the request for immediate use
        $request->attributes->set('locale', $locale);
        
        return $next($request);
    }
}