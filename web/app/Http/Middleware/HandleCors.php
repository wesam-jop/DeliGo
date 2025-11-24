<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleCors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Log all API requests for debugging
        \Illuminate\Support\Facades\Log::info('API Request:', [
            'method' => $request->getMethod(),
            'url' => $request->fullUrl(),
            'path' => $request->path(),
            'ip' => $request->ip(),
            'headers' => $request->headers->all(),
            'data' => $request->all(),
        ]);
        
        // Handle OPTIONS preflight requests
        if ($request->getMethod() === 'OPTIONS') {
            \Illuminate\Support\Facades\Log::info('API OPTIONS Preflight Request');
            return response('', 200)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept-Language, X-Requested-With, Accept')
                ->header('Access-Control-Max-Age', '3600');
        }
        
        $response = $next($request);
        
        // Add CORS headers to response
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept-Language, X-Requested-With, Accept');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        
        // Log response
        \Illuminate\Support\Facades\Log::info('API Response:', [
            'status' => $response->getStatusCode(),
            'url' => $request->fullUrl(),
        ]);
        
        return $response;
    }
}

