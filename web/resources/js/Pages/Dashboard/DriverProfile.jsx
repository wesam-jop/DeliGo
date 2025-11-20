import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from '../../hooks/useTranslation';
import DriverLayout from './DriverLayout';
import UserAvatar from '../../Components/UserAvatar';
import { Camera, Loader, User as UserIcon, Phone, MapPin } from 'lucide-react';

export default function DriverProfile({ profile }) {
    const { t } = useTranslation();
    const [avatarPreview, setAvatarPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: profile?.name || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
        avatar: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/dashboard/driver/profile', {
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

    const currentAvatar = avatarPreview || profile?.avatar;

    return (
        <DriverLayout title={t('driver_profile_title') || 'Driver Profile'}>
            <Head title={t('driver_profile_title') || 'Driver Profile'} />

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">{t('personal_information')}</h2>
                    <p className="text-sm text-slate-500">{t('profile_update_hint')}</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                <UserAvatar user={{ avatar: currentAvatar, name: data.name }} size={96} showInitials />
                            </div>
                            <label className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700">
                                <Camera className="w-4 h-4 text-white" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </label>
                        </div>
                        <p className="text-sm text-slate-500">{t('allowed_file_types')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">{t('name')}</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            {errors.name && <p className="text-sm text-rose-600 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">{t('phone_number')}</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            {errors.phone && <p className="text-sm text-rose-600 mt-1">{errors.phone}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-900 mb-2">{t('address')}</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <textarea
                                rows={3}
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
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
        </DriverLayout>
    );
}

