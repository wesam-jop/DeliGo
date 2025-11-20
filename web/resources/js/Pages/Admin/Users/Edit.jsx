import React from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import { User, Phone, Shield, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

export default function UserEdit({ user }) {
    const { t } = useTranslation();

    if (!user) {
        return (
            <AdminLayout title={t('edit_user') || 'Edit user'}>
                <div className="p-6 text-center text-slate-500">
                    {t('user_not_found') || 'User not found'}
                </div>
            </AdminLayout>
        );
    }

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        phone: user.phone || '',
        user_type: user.user_type || 'customer',
        is_verified: Boolean(user.is_verified),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <AdminLayout title={t('edit_user') || 'Edit user'}>
            <Head title={`${t('edit_user') || 'Edit user'} - ${user.name}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{t('edit_user') || 'Edit user'}</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {t('user_id_label', { id: user.id }) || `ID: ${user.id}`}
                        </p>
                    </div>
                    <Link
                        href="/admin/users"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('back_to_users') || 'Back to users'}
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">
                    <Field
                        label={t('name') || 'Name'}
                        icon={User}
                        error={errors.name}
                    >
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            required
                        />
                    </Field>

                    <Field
                        label={t('phone') || 'Phone'}
                        icon={Phone}
                        error={errors.phone}
                    >
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            required
                        />
                    </Field>

                    <Field
                        label={t('user_type') || 'User type'}
                        icon={Shield}
                        error={errors.user_type}
                    >
                        <select
                            value={data.user_type}
                            onChange={(e) => setData('user_type', e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="customer">{t('customer') || 'Customer'}</option>
                            <option value="store_owner">{t('store_owner') || 'Store owner'}</option>
                            <option value="driver">{t('driver') || 'Driver'}</option>
                            <option value="admin">{t('admin') || 'Admin'}</option>
                        </select>
                    </Field>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setData('is_verified', !data.is_verified)}
                            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                                data.is_verified
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                    : 'border-slate-200 bg-slate-50 text-slate-600'
                            }`}
                        >
                            {data.is_verified ? (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    {t('verified') || 'Verified'}
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-4 h-4" />
                                    {t('not_verified') || 'Not verified'}
                                </>
                            )}
                        </button>
                        <span className="text-xs text-slate-500">
                            {t('toggle_verification_status') || 'Toggle verification status'}
                        </span>
                    </div>

                    {errors.is_verified && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                            {errors.is_verified}
                        </p>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50"
                        >
                            {processing ? t('saving') || 'Saving...' : t('save_changes') || 'Save changes'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

function Field({ label, icon: Icon, error, children }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                {Icon && (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        <Icon className="w-3.5 h-3.5" />
                    </span>
                )}
                {label}
            </label>
            {children}
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

