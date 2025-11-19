@php
    use App\Models\Setting;
    $currentLocale = session('locale', Setting::get('default_language', app()->getLocale()));
    $isRTL = $currentLocale === 'ar';
    $siteName = Setting::get('site_name', config('app.name', 'Getir Clone'));
    $siteFavicon = Setting::get('site_favicon', '');
@endphp

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', $currentLocale) }}" dir="{{ $isRTL ? 'rtl' : 'ltr' }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ $siteName }}</title>
        
        @if($siteFavicon && $siteFavicon !== '')
        <link rel="icon" type="image/x-icon" href="{{ $siteFavicon }}">
        @endif
        
        <meta name="description" content="{{ Setting::get('site_description', '') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        
        <!-- Arabic Font -->
        @if($isRTL)
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        @endif

        <!-- Scripts -->
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased {{ $isRTL ? 'font-cairo' : '' }}" dir="{{ $isRTL ? 'rtl' : 'ltr' }}">
        @inertia
        
        <script>
            // تحديث الـ dir عند تغيير اللغة
            document.addEventListener('DOMContentLoaded', function() {
                // مراقبة تغيير الـ locale في Inertia
                window.addEventListener('popstate', function() {
                    updateDirection();
                });
                
                // مراقبة تغيير الـ locale من Inertia
                if (window.Inertia) {
                    window.Inertia.on('navigate', function() {
                        setTimeout(updateDirection, 100);
                    });
                }
                
                // تحديث الـ dir عند تحميل الصفحة
                updateDirection();
            });
            
            function updateDirection() {
                // الحصول على الـ locale من البيانات الممررة أو من الـ session
                const locale = window.page?.props?.locale || 
                              document.documentElement.getAttribute('lang') || 
                              'ar';
                const isRTL = locale === 'ar';
                
                // تحديث الـ dir للـ html و body
                document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
                document.documentElement.setAttribute('lang', locale);
                document.body.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
                
                // تحديث الـ font family
                if (isRTL) {
                    document.body.classList.add('font-cairo');
                    document.body.classList.remove('font-sans');
                } else {
                    document.body.classList.remove('font-cairo');
                    document.body.classList.add('font-sans');
                }
                
                // إضافة class للـ body لسهولة التمييز
                document.body.classList.toggle('rtl', isRTL);
                document.body.classList.toggle('ltr', !isRTL);
            }
        </script>
    </body>
</html>
