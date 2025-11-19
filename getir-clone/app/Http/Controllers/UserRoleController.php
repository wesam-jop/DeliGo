<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserRoleController extends Controller
{
    public function upgrade(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'target_role' => ['required', Rule::in(['store_owner', 'driver'])],
        ]);

        if (!$user) {
            abort(401);
        }

        if ($user->isAdmin()) {
            return back()->with('error', 'لا يمكن للمدير تغيير نوع حسابه.');
        }

        if ($user->user_type === $validated['target_role']) {
            $message = $validated['target_role'] === 'store_owner'
                ? 'حسابك مسجل بالفعل كتاجر.'
                : 'حسابك مسجل بالفعل كمندوب توصيل.';

            return back()->with('success', $message);
        }

        if ($validated['target_role'] === 'driver' && !$user->isCustomer()) {
            return back()->with('error', 'يمكن فقط للمستخدمين العاديين ترقية حسابهم من هنا.');
        }

        if ($validated['target_role'] === 'store_owner') {
            return redirect()->route('dashboard.store.setup')->with('success', __('store_setup_redirect_message'));
        }

        $user->user_type = 'driver';
        $user->save();

        return redirect('/dashboard/driver')->with('success', 'تمت ترقية حسابك إلى حساب مندوب توصيل بنجاح.');
    }
}


