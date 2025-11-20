import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import { User, Phone, Mail, Calendar, Shield, ArrowLeft, MapPin, Image } from 'lucide-react';

export default function UserShow({ user, driverApplication }) {
    const { t } = useTranslation();

    if (!user) {
        return (
            <AdminLayout title={t('user_details') || 'User details'}>
                <div className="p-6 text-center text-slate-500">
                    {t('user_not_found') || 'User not found'}
                </div>
            </AdminLayout>
        );
    }

    const createdAt = user.created_at
        ? new Date(user.created_at).toLocaleString()
        : '-';

    return (
        <AdminLayout title={t('user_details') || 'User details'}>
            <Head title={`${t('user_details') || 'User details'} - ${user.name}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            {user.name}
                        </h1>
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <User className="w-5 h-5 text-purple-600" />
                            {t('profile') || 'Profile'}
                        </h2>

                        <InfoRow label={t('name') || 'Name'} value={user.name} />
                        <InfoRow label={t('user_type') || 'Type'} value={t(user.user_type) || user.user_type} />
                        <InfoRow
                            label={t('verification_status') || 'Verification status'}
                            value={
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                    user.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {user.is_verified ? (t('verified') || 'Verified') : (t('not_verified') || 'Not verified')}
                                </span>
                            }
                        />
                        <InfoRow label={t('created_at') || 'Created at'} value={createdAt} icon={Calendar} />
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            {t('contact_info') || 'Contact info'}
                        </h2>

                        <InfoRow label={t('phone') || 'Phone'} value={user.phone || '-'} icon={Phone} />
                        <InfoRow label={t('email') || 'Email'} value={user.email || '-'} icon={Mail} />
                        <InfoRow label={t('address') || 'Address'} value={user.address || '-'} icon={MapPin} />
                    </div>

                    {driverApplication && (
                        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 space-y-5 lg:col-span-2">
                            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <Image className="w-5 h-5 text-emerald-600" />
                                {t('driver_application_documents') || 'Driver documents'}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <DocumentCard
                                    title={t('driver_application_personal_photo') || 'Personal photo'}
                                    url={driverApplication.personal_photo_url}
                                />
                                <DocumentCard
                                    title={t('driver_application_id_photo') || 'ID Photo'}
                                    url={driverApplication.id_photo_url}
                                />
                                <DocumentCard
                                    title={t('driver_application_vehicle_photo') || 'Vehicle photo'}
                                    url={driverApplication.vehicle_photo_url}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

function InfoRow({ label, value, icon: Icon }) {
    return (
        <div className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-none last:pb-0">
            {Icon && (
                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-slate-500" />
                </div>
            )}
            <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
                <div className="mt-1 text-sm text-slate-900 break-all">
                    {value || '-'}
                </div>
            </div>
        </div>
    );
}

function DocumentCard({ title, url }) {
    if (!url) return null;

    return (
        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100 text-sm font-semibold text-slate-900">
                {title}
            </div>
            <img src={url} alt={title} className="w-full h-56 object-cover" />
        </div>
    );
}

