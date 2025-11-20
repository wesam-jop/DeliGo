import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from '../../hooks/useTranslation';
import CustomerLayout from './CustomerLayout';
import UserAvatar from '../../Components/UserAvatar';
import { Camera, Loader, Phone, MapPin, User as UserIcon, AlertCircle } from 'lucide-react';

export default function CustomerProfile({ customer }) {
    const { t } = useTranslation();
    const { props } = usePage();
    const flash = props.flash || {};
    const [avatarPreview, setAvatarPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: customer?.name || '',
        phone: customer?.phone || '',
        address: customer?.address || '',
        avatar: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/dashboard/customer/profile', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => setAvatarPreview(null),
        });
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const currentAvatar = avatarPreview || customer?.avatar;

    return (
        <CustomerLayout title={t('customer_profile') || 'My Profile'}>
            <Head title={t('customer_profile') || 'My Profile'} />

            <div className="space-y-6">
                {flash.success && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}
                {flash.error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {flash.error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-900">{t('personal_information')}</h2>
                            <p className="text-sm text-slate-500">{t('profile_update_hint') || 'Update your contact details.'}</p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                        <UserAvatar user={{ avatar: currentAvatar, name: data.name }} size={96} showInitials />
                                    </div>
                                    <label className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center shadow-lg cursor-pointer hover:bg-purple-700">
                                        <Camera className="w-4 h-4 text-white" />
                                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                    </label>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">{t('allowed_file_types') || 'JPEG, PNG up to 2MB'}</p>
                                    {errors.avatar && (
                                        <p className="text-sm text-rose-600 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.avatar}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-2">
                                    {t('name')}*
                                </label>
                                <div className="relative">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        required
                                    />
                                </div>
                                {errors.name && <p className="text-sm text-rose-600 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-2">
                                    {t('phone_number')}*
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        required
                                    />
                                </div>
                                {errors.phone && <p className="text-sm text-rose-600 mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-2">
                                    {t('address')}
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                                    />
                                </div>
                                {errors.address && <p className="text-sm text-rose-600 mt-1">{errors.address}</p>}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            {t('saving')}
                                        </>
                                    ) : (
                                        t('save_changes')
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">{t('account_details')}</h3>
                            <p className="text-sm text-slate-500">{t('account_details_hint') || 'Basic information about your account.'}</p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">{t('user_type')}</span>
                                <span className="text-sm font-semibold text-slate-900">{t('customer')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">{t('verification_status')}</span>
                                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${customer?.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {customer?.is_verified ? t('verified') : t('unverified')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">{t('member_since')}</span>
                                <span className="text-sm font-semibold text-slate-900">{customer?.created_at_formatted}</span>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                            <p className="text-sm text-slate-500">{t('profile_security_note') || 'We respect your privacy and never share your personal data.'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}

