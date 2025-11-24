<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Get user profile
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user()->load(['governorate', 'city']);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'latitude' => $user->latitude ? (float) $user->latitude : null,
                'longitude' => $user->longitude ? (float) $user->longitude : null,
                'user_type' => $user->user_type,
                'is_verified' => $user->is_verified,
                'avatar' => $user->avatar,
                'governorate_id' => $user->governorate_id,
                'city_id' => $user->city_id,
                'governorate' => $user->governorate ? [
                    'id' => $user->governorate->id,
                    'name' => app()->getLocale() === 'ar' 
                        ? $user->governorate->name_ar 
                        : $user->governorate->name_en,
                ] : null,
                'city' => $user->city ? [
                    'id' => $user->city->id,
                    'name' => app()->getLocale() === 'ar' 
                        ? $user->city->name_ar 
                        : $user->city->name_en,
                ] : null,
                'created_at' => $user->created_at->toIso8601String(),
            ]
        ]);
    }

    /**
     * Update user profile
     */
    public function update(Request $request): JsonResponse
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
            'avatar' => 'nullable|string|max:500', // URL or base64
        ]);

        $data = $request->only([
            'name', 'email', 'phone', 'address', 
            'latitude', 'longitude', 'governorate_id', 'city_id', 'avatar'
        ]);

        // Handle avatar upload if it's base64
        if ($request->has('avatar') && str_starts_with($request->avatar, 'data:image')) {
            // Decode base64 image
            $imageData = $request->avatar;
            $imageInfo = explode(';base64,', $imageData);
            $imageExt = explode('/', $imageInfo[0])[1];
            $imageContent = base64_decode($imageInfo[1]);
            
            $fileName = 'avatars/' . $user->id . '_' . time() . '.' . $imageExt;
            
            // Delete old avatar if exists
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            
            Storage::disk('public')->put($fileName, $imageContent);
            $data['avatar'] = $fileName;
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'data' => $user->fresh()->load(['governorate', 'city'])->makeHidden(['password', 'verification_code']),
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

