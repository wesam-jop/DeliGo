<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'admin/*', 'owner/*', 'investor/*'],

    'allowed_methods' => ['*'],

    // Allow all origins for mobile app and development
    // For production, you may want to restrict this to specific domains
    'allowed_origins' => ['*'],

    // Pattern to allow all local network IPs (192.168.x.x, 10.x.x.x, etc.)
    'allowed_origins_patterns' => [
        '/^http:\/\/192\.168\.\d+\.\d+:8000$/',
        '/^http:\/\/10\.\d+\.\d+\.\d+:8000$/',
        '/^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+:8000$/',
        '/^http:\/\/localhost:\d+$/',
        '/^http:\/\/127\.0\.0\.1:\d+$/',
        "http://192.168.1.100:8000",
        "http://192.168.1.100",
        "http://192.168.1.100:3000",
        "http://192.168.1.100:9090",
        "http://192.168.1.100:8000",
        "http://192.168.1.100:8000",
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
