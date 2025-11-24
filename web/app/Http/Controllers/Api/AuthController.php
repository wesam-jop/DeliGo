<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20|unique:users',
            'user_type' => 'nullable|in:customer,store_owner,driver',
            'address' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'governorate_id' => 'required|exists:governorates,id',
            'city_id' => 'nullable|exists:cities,id',
            'area_id' => 'required|exists:areas,id',
        ]);

        // Clean phone number
        $cleanedPhone = preg_replace('/\D/', '', $request->phone);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $cleanedPhone,
            'password' => Hash::make('default_password_' . $cleanedPhone), // Temporary password - user won't use it
            'user_type' => $request->user_type ?? 'customer',
            'address' => $request->address,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'governorate_id' => $request->governorate_id,
            'city_id' => $request->city_id,
            'area_id' => $request->area_id,
            'is_verified' => false,
        ]);

        // Generate OTP
        $otp = '12345'; // Default OTP for development - TODO: Generate random OTP
        
        // Store OTP in cache for 5 minutes
        \Illuminate\Support\Facades\Cache::put("verification_code_{$cleanedPhone}", $otp, 300);

        // TODO: Send SMS with verification code
        Log::info("API Registration OTP for {$cleanedPhone}: {$otp}");

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user->makeHidden(['password', 'verification_code']),
                'phone' => $cleanedPhone,
                'user_type' => $user->user_type,
                'action' => 'register',
                'verification_required' => true,
                // Remove this in production
                'otp' => config('app.debug') ? $otp : null,
            ],
            'message' => 'تم التسجيل بنجاح. يرجى التحقق من رقم الهاتف'
        ], 201);
    }

    /**
     * Login user - Request OTP
     */
    public function login(Request $request): JsonResponse
    {
        // Log incoming request
        Log::info('API Login Request Received:', [
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'headers' => $request->headers->all(),
            'all_data' => $request->all(),
        ]);
        
        $request->validate([
            'phone' => 'required|string',
        ]);

        // Clean phone number
        $cleanedPhone = preg_replace('/\D/', '', $request->phone);
        
        Log::info('API Login - Searching for user with phone:', [
            'original_phone' => $request->phone,
            'cleaned_phone' => $cleanedPhone
        ]);
        
        $user = User::where('phone', $cleanedPhone)->first();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'رقم الهاتف غير مسجل. يرجى التسجيل أولاً'
            ], 404);
        }
        
        Log::info('API Login - User found:', ['user_id' => $user->id, 'phone' => $user->phone]);

        // Generate OTP
        $otp = '12345'; // Default OTP for development - TODO: Generate random OTP
        
        // Store OTP in cache for 5 minutes
        \Illuminate\Support\Facades\Cache::put("login_otp_{$cleanedPhone}", $otp, 300);
        
        // Log OTP for development
        Log::info("API Login OTP for {$cleanedPhone}: {$otp}");

        return response()->json([
            'success' => true,
            'data' => [
                'phone' => $cleanedPhone,
                'user_type' => $user->user_type,
                'action' => 'login',
                // Remove this in production
                'otp' => config('app.debug') ? $otp : null,
            ],
            'message' => 'تم إرسال رمز التحقق إلى رقم هاتفك'
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الخروج بنجاح'
        ]);
    }

    /**
     * Verify phone number
     */
    public function verifyPhone(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => 'required|string',
            'code' => 'required|string|size:5',
            'action' => 'nullable|string|in:login,register',
        ]);

        // Clean phone number
        $cleanedPhone = preg_replace('/\D/', '', $request->phone);
        
        // Get the correct cache key based on action
        $action = $request->action ?? 'login';
        $cacheKey = $action === 'login' 
            ? "login_otp_{$cleanedPhone}" 
            : "verification_code_{$cleanedPhone}";
            
        $cachedCode = \Illuminate\Support\Facades\Cache::get($cacheKey);
        
        Log::info('API Verify Phone:', [
            'phone' => $cleanedPhone,
            'action' => $action,
            'cache_key' => $cacheKey,
            'code_received' => $request->code,
            'code_cached' => $cachedCode
        ]);
        
        if (!$cachedCode || $cachedCode !== $request->code) {
            return response()->json([
                'success' => false,
                'message' => 'رمز التحقق غير صحيح أو منتهي الصلاحية'
            ], 400);
        }

        $user = User::where('phone', $cleanedPhone)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'رقم الهاتف غير مسجل'
            ], 404);
        }

        // For registration, mark as verified
        if ($action === 'register') {
            $user->update(['is_verified' => true]);
        }

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;
        
        // Clear verification code
        \Illuminate\Support\Facades\Cache::forget($cacheKey);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user->makeHidden(['password', 'verification_code']),
                'token' => $token,
                'token_type' => 'Bearer',
                'is_verified' => true,
            ],
            'message' => 'تم التحقق من الهاتف بنجاح'
        ]);
    }

    /**
     * Resend verification code
     */
    public function resendVerification(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => 'required|string',
            'action' => 'nullable|string|in:login,register',
        ]);

        // Clean phone number
        $cleanedPhone = preg_replace('/\D/', '', $request->phone);
        
        $user = User::where('phone', $cleanedPhone)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'رقم الهاتف غير مسجل'
            ], 404);
        }

        // Generate new OTP
        $otp = '12345'; // Default OTP for development - TODO: Generate random OTP
        
        // Set the correct cache key based on action
        $action = $request->action ?? 'login';
        $cacheKey = $action === 'login' 
            ? "login_otp_{$cleanedPhone}" 
            : "verification_code_{$cleanedPhone}";
            
        \Illuminate\Support\Facades\Cache::put($cacheKey, $otp, 300); // 5 minutes

        // Log OTP for development
        Log::info("API Resent OTP for {$cleanedPhone} ({$action}): {$otp}");

        return response()->json([
            'success' => true,
            'message' => 'تم إعادة إرسال رمز التحقق',
            // Remove this in production
            'otp' => config('app.debug') ? $otp : null,
        ]);
    }

    /**
     * Get authenticated user
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['governorate', 'city', 'area']);

        return response()->json([
            'success' => true,
            'data' => $user->makeHidden(['password', 'verification_code'])
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|nullable|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'sometimes|required|string|max:20|unique:users,phone,' . $user->id,
            'address' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'governorate_id' => 'nullable|exists:governorates,id',
            'city_id' => 'nullable|exists:cities,id',
            'area_id' => 'nullable|exists:areas,id',
            'avatar' => 'nullable|string|max:500', // URL or base64
        ]);

        $user->update($request->only([
            'name', 'email', 'phone', 'address', 
            'latitude', 'longitude', 'governorate_id', 'city_id', 'area_id', 'avatar'
        ]));

        return response()->json([
            'success' => true,
            'data' => $user->fresh()->makeHidden(['password', 'verification_code']),
            'message' => 'تم تحديث الملف الشخصي بنجاح'
        ]);
    }

    /**
     * Change password
     */
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8',
            'new_password_confirmation' => 'required|same:new_password',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'كلمة المرور الحالية غير صحيحة'
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم تغيير كلمة المرور بنجاح'
        ]);
    }
}
