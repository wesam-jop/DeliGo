<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();
        
        // Check if user is admin
        if ($user->user_type !== 'admin') {
            abort(403, 'Access denied. Admin privileges required.');
        }

        // Check if user has admin access permission
        if (!\App\Models\AdminAccess::hasAccess($user->phone)) {
            abort(403, 'Access denied. Your account does not have admin access permission.');
        }

        return $next($request);
    }
}
