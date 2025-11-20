<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DriverApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DriverApplicationController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->get('status', 'pending');

        $query = DriverApplication::with('user')->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $applications = $query->paginate(15)->through(function (DriverApplication $application) {
            return [
                'id' => $application->id,
                'full_name' => $application->full_name,
                'phone' => $application->phone,
                'status' => $application->status,
                'submitted_at' => $application->created_at?->toIso8601String(),
                'user' => [
                    'id' => $application->user->id,
                    'name' => $application->user->name,
                ],
            ];
        });

        $stats = [
            'pending' => DriverApplication::where('status', 'pending')->count(),
            'approved' => DriverApplication::where('status', 'approved')->count(),
            'rejected' => DriverApplication::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Drivers/Applications/Index', [
            'applications' => $applications,
            'filters' => [
                'status' => $status,
            ],
            'stats' => $stats,
        ]);
    }

    public function show(DriverApplication $driverApplication)
    {
        $driverApplication->load(['user', 'reviewer']);

        return Inertia::render('Admin/Drivers/Applications/Show', [
            'application' => [
                'id' => $driverApplication->id,
                'full_name' => $driverApplication->full_name,
                'phone' => $driverApplication->phone,
                'address' => $driverApplication->address,
                'birth_date' => $driverApplication->birth_date?->toDateString(),
                'vehicle_type' => $driverApplication->vehicle_type,
                'status' => $driverApplication->status,
                'notes' => $driverApplication->notes,
                'vehicle_photo_url' => $driverApplication->vehicle_photo_url,
                'personal_photo_url' => $driverApplication->personal_photo_url,
                'id_photo_url' => $driverApplication->id_photo_url,
                'submitted_at' => $driverApplication->created_at?->toIso8601String(),
                'reviewed_at' => $driverApplication->reviewed_at?->toIso8601String(),
                'reviewer' => $driverApplication->reviewer ? [
                    'id' => $driverApplication->reviewer->id,
                    'name' => $driverApplication->reviewer->name,
                ] : null,
                'user' => [
                    'id' => $driverApplication->user->id,
                    'name' => $driverApplication->user->name,
                    'email' => $driverApplication->user->email,
                ],
            ],
        ]);
    }

    public function approve(Request $request, DriverApplication $driverApplication)
    {
        if ($driverApplication->status === 'approved') {
            return back()->with('success', __('driver_application_already_approved'));
        }

        $data = $request->validate([
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $driverApplication->update([
            'status' => 'approved',
            'notes' => $data['notes'] ?? null,
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        $driverApplication->user->update(['user_type' => 'driver']);

        return redirect()->route('admin.drivers.applications.index')
            ->with('success', __('driver_application_approved_success'));
    }

    public function reject(Request $request, DriverApplication $driverApplication)
    {
        $data = $request->validate([
            'notes' => ['required', 'string', 'max:1000'],
        ]);

        $driverApplication->update([
            'status' => 'rejected',
            'notes' => $data['notes'],
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        return redirect()->route('admin.drivers.applications.index')
            ->with('success', __('driver_application_rejected_success'));
    }
}

