<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
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
        }

        return $next($request);
    }
}
