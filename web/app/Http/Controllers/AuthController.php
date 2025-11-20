<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    public function showVerify()
    {
        return Inertia::render('Auth/Verify');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:users,phone',
        ]);

        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'user_type' => 'customer',
            'password' => Hash::make('temp_password'), // سيتم تغييره بعد التحقق
        ]);

        // إرسال رمز التحقق
        $verificationCode = $user->generateVerificationCode();
        
        // TODO: إرسال SMS بالرمز
        // $this->sendSMS($user->phone, "رمز التحقق: $verificationCode");

        return redirect()->route('auth.verify')->with([
            'phone' => $user->phone,
            'message' => 'تم إرسال رمز التحقق إلى رقم هاتفك'
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'verification_code' => 'required|string|size:6',
        ]);

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            return back()->withErrors(['phone' => 'رقم الهاتف غير مسجل']);
        }

        if ($user->verifyCode($request->verification_code)) {
            Auth::login($user);
            
            // توجيه حسب نوع المستخدم
            if ($user->isCustomer()) {
                return redirect()->route('dashboard.customer');
            } elseif ($user->isStoreOwner()) {
                return redirect()->route('dashboard.store');
            } else {
                return redirect()->route('dashboard.admin');
            }
        }

        return back()->withErrors(['verification_code' => 'رمز التحقق غير صحيح أو منتهي الصلاحية']);
    }

    public function resendCode(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            return back()->withErrors(['phone' => 'رقم الهاتف غير مسجل']);
        }

        $verificationCode = $user->generateVerificationCode();
        
        // TODO: إرسال SMS بالرمز
        // $this->sendSMS($user->phone, "رمز التحقق: $verificationCode");

        return back()->with('message', 'تم إرسال رمز جديد إلى رقم هاتفك');
    }

    public function login(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            return back()->withErrors(['phone' => 'رقم الهاتف غير مسجل']);
        }

        if (!$user->isVerified()) {
            $verificationCode = $user->generateVerificationCode();
            
            // TODO: إرسال SMS بالرمز
            // $this->sendSMS($user->phone, "رمز التحقق: $verificationCode");

            return redirect()->route('auth.verify')->with([
                'phone' => $user->phone,
                'message' => 'تم إرسال رمز التحقق إلى رقم هاتفك'
            ]);
        }

        Auth::login($user);
        
        // توجيه حسب نوع المستخدم
        if ($user->isCustomer()) {
            return redirect()->route('dashboard.customer');
        } elseif ($user->isStoreOwner()) {
            return redirect()->route('dashboard.store');
        } else {
            return redirect()->route('dashboard.admin');
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
