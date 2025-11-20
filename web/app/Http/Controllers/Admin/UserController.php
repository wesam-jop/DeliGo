<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:users',
            'user_type' => 'required|in:customer,store_owner,driver,admin',
            'is_verified' => 'boolean',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator->errors());
        }

        // Clean phone number
        $cleanedPhone = preg_replace('/\D/', '', $request->phone);

        $user = User::create([
            'name' => $request->name,
            'phone' => $cleanedPhone,
            'password' => Hash::make('default'), // كلمة مرور افتراضية غير مستخدمة
            'user_type' => $request->user_type,
            'is_verified' => $request->is_verified ?? false,
        ]);

        return redirect()->route('admin.users.index')->with('success', 'User created successfully!');
    }

    public function show(User $user)
    {
        $user->load('driverApplication');

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'driverApplication' => $user->driverApplication ? [
                'status' => $user->driverApplication->status,
                'personal_photo_url' => $user->driverApplication->personal_photo_url,
                'id_photo_url' => $user->driverApplication->id_photo_url,
                'vehicle_photo_url' => $user->driverApplication->vehicle_photo_url,
            ] : null,
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:users,phone,' . $user->id,
            'user_type' => 'required|in:customer,store_owner,driver,admin',
            'is_verified' => 'boolean',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator->errors());
        }

        // Clean phone number
        $cleanedPhone = preg_replace('/\D/', '', $request->phone);

        $updateData = [
            'name' => $request->name,
            'phone' => $cleanedPhone,
            'user_type' => $request->user_type,
            'is_verified' => $request->is_verified ?? false,
        ];

        $user->update($updateData);

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully!');
    }

    public function destroy(User $user)
    {
        // Prevent deleting admin users
        if ($user->user_type === 'admin') {
            return back()->withErrors(['message' => 'Cannot delete admin users.']);
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully!');
    }

    public function customers()
    {
        $customers = User::where('user_type', 'customer')
            ->withCount('orders')
            ->orderBy('created_at', 'desc')
            ->get();
        
        $stats = [
            'total' => $customers->count(),
            'verified' => $customers->where('is_verified', true)->count(),
            'unverified' => $customers->where('is_verified', false)->count(),
            'with_orders' => $customers->where('orders_count', '>', 0)->count(),
        ];
        
        return Inertia::render('Admin/Users/Customers', [
            'customers' => $customers,
            'stats' => $stats,
        ]);
    }

    public function storeOwners()
    {
        $storeOwners = User::where('user_type', 'store_owner')
            ->with(['stores'])
            ->withCount(['orders', 'stores'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        $stats = [
            'total' => $storeOwners->count(),
            'verified' => $storeOwners->where('is_verified', true)->count(),
            'unverified' => $storeOwners->where('is_verified', false)->count(),
            'with_stores' => $storeOwners->where('stores_count', '>', 0)->count(),
            'active_stores' => $storeOwners->sum(function($owner) {
                return $owner->stores->where('is_active', true)->count();
            }),
        ];
        
        return Inertia::render('Admin/Users/StoreOwners', [
            'storeOwners' => $storeOwners,
            'stats' => $stats,
        ]);
    }

    public function drivers()
    {
        $drivers = User::where('user_type', 'driver')
            ->withCount('orders')
            ->orderBy('created_at', 'desc')
            ->get();
        
        $stats = [
            'total' => $drivers->count(),
            'verified' => $drivers->where('is_verified', true)->count(),
            'unverified' => $drivers->where('is_verified', false)->count(),
            'with_orders' => $drivers->where('orders_count', '>', 0)->count(),
            'active_drivers' => $drivers->where('is_verified', true)->count(),
        ];
        
        return Inertia::render('Admin/Users/Drivers', [
            'drivers' => $drivers,
            'stats' => $stats,
        ]);
    }
}
