import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import { Shield, ArrowRight, X, Phone, User as UserIcon, FileText } from 'lucide-react';

export default function AdminAccessEdit({ adminAccess, users }) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        phone: adminAccess?.phone || '',
        user_id: adminAccess?.user_id || '',
        is_active: adminAccess?.is_active ?? true,
        notes: adminAccess?.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/admin-access/${adminAccess.id}`);
    };

    return (
        <AdminLayout title={t('edit_permission')}>
            <Head title={t('edit_permission')} />
            
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{t('edit_permission') || 'Edit Permission'}</h2>
                                <p className="text-sm text-slate-600">{t('edit_permission_info') || 'Edit permission information'}</p>
                            </div>
                        </div>
                        <Link
                            href="/admin/admin-access"
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {t('phone_number')} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    placeholder="963111111111"
                                    required
                                />
                            </div>
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {t('link_to_user_account') || 'Link to User Account'} ({t('optional') || 'Optional'})
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <select
                                    value={data.user_id}
                                    onChange={(e) => setData('user_id', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                >
                                    <option value="">{t('select_user') || 'Select user...'}</option>
                                    {users && users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} - {user.phone}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.user_id && (
                                <p className="mt-1 text-sm text-red-500">{errors.user_id}</p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">{t('enable_permission') || 'Enable Permission'}</span>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {t('notes')} ({t('optional') || 'Optional'})
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-3">
                                    <FileText className="h-5 w-5 text-slate-400" />
                                </div>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    placeholder={t('add_notes_about_permission') || 'Add any notes about this permission...'}
                                />
                            </div>
                            {errors.notes && (
                                <p className="mt-1 text-sm text-red-500">{errors.notes}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>{t('saving') || 'Saving...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{t('save_changes') || 'Save Changes'}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                            <Link
                                href="/admin/admin-access"
                                className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                {t('cancel') || 'Cancel'}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

