import React, { useMemo } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import CustomerLayout from './CustomerLayout';
import { useTranslation } from '../../hooks/useTranslation';
import {
    Upload,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
} from 'lucide-react';

export default function DriverApplication({ application, profile }) {
    const { t } = useTranslation();
    const { flash } = usePage().props;

    const statusMeta = useMemo(() => {
        const map = {
            pending: {
                icon: Clock,
                color: 'text-amber-600',
                bg: 'bg-amber-50 border-amber-200',
                title: t('driver_application_status_pending'),
                description: t('driver_application_status_pending_desc'),
            },
            approved: {
                icon: CheckCircle,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50 border-emerald-200',
                title: t('driver_application_status_approved'),
                description: t('driver_application_status_approved_desc'),
            },
            rejected: {
                icon: XCircle,
                color: 'text-rose-600',
                bg: 'bg-rose-50 border-rose-200',
                title: t('driver_application_status_rejected'),
                description: application?.notes || t('driver_application_status_rejected_desc'),
            },
        };
        return map[application?.status] || null;
    }, [application, t]);

    const form = useForm({
        full_name: profile?.name || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
        birth_date: profile?.birth_date || '',
        vehicle_type: application?.vehicle_type || '',
        personal_photo: null,
        vehicle_photo: null,
        id_photo: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post('/dashboard/driver/apply', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const disableForm = application?.status === 'pending';

    const renderFileField = (field, label, hint) => (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">{label}</label>
            <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center cursor-pointer hover:border-purple-400 transition">
                <Upload className="h-8 w-8 text-purple-500" />
                <span className="mt-3 text-sm font-semibold text-slate-700">
                    {form.data[field]?.name || hint}
                </span>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={disableForm}
                    onChange={(event) => form.setData(field, event.target.files[0])}
                />
            </label>
            {form.errors[field] && <p className="text-xs text-rose-600">{form.errors[field]}</p>}
        </div>
    );

    const renderExistingMedia = (title, url) => {
        if (!url) {
            return null;
        }

        return (
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <p className="text-sm font-semibold text-slate-700">{title}</p>
                </div>
                <img src={url} alt={title} className="w-full h-52 object-cover" />
            </div>
        );
    };

    return (
        <CustomerLayout
            title={t('driver_application_title')}
            subtitle={t('driver_application_subtitle')}
        >
            <Head title={t('driver_application_title')} />

            <div className="space-y-6">
                {(flash?.success || flash?.error) && (
                    <div
                        className={`rounded-2xl border p-4 text-sm ${
                            flash.success
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                : 'border-rose-200 bg-rose-50 text-rose-700'
                        }`}
                    >
                        {flash.success || flash.error}
                    </div>
                )}

                {statusMeta && (
                    <div className={`rounded-3xl border ${statusMeta.bg} p-5 flex gap-4`}>
                        <statusMeta.icon className={`w-6 h-6 ${statusMeta.color}`} />
                        <div>
                            <p className="text-base font-semibold text-slate-900">{statusMeta.title}</p>
                            <p className="text-sm text-slate-600 mt-1">{statusMeta.description}</p>
                            {application?.status === 'rejected' && (
                                <p className="text-xs text-slate-500 mt-2">
                                    {t('driver_application_reapply_hint')}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                            {t('driver_application_form_section')}
                        </p>
                        <h2 className="text-2xl font-bold text-slate-900 mt-1">
                            {t('driver_application_form_title')}
                        </h2>
                        <p className="text-sm text-slate-500 mt-2">
                            {t('driver_application_form_description')}
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('driver_application_full_name')}
                                </label>
                                <input
                                    type="text"
                                    value={form.data.full_name}
                                    disabled={disableForm}
                                    onChange={(e) => form.setData('full_name', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {form.errors.full_name && (
                                    <p className="text-xs text-rose-600 mt-1">{form.errors.full_name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('driver_application_phone')}
                                </label>
                                <input
                                    type="tel"
                                    value={form.data.phone}
                                    disabled={disableForm}
                                    onChange={(e) => form.setData('phone', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {form.errors.phone && (
                                    <p className="text-xs text-rose-600 mt-1">{form.errors.phone}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('driver_application_birth_date')}
                                </label>
                                <input
                                    type="date"
                                    value={form.data.birth_date}
                                    disabled={disableForm}
                                    onChange={(e) => form.setData('birth_date', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {form.errors.birth_date && (
                                    <p className="text-xs text-rose-600 mt-1">{form.errors.birth_date}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('driver_application_vehicle_type')}
                                </label>
                                <input
                                    type="text"
                                    value={form.data.vehicle_type}
                                    disabled={disableForm}
                                    onChange={(e) => form.setData('vehicle_type', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {form.errors.vehicle_type && (
                                    <p className="text-xs text-rose-600 mt-1">{form.errors.vehicle_type}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {t('driver_application_address')}
                            </label>
                            <textarea
                                rows="3"
                                value={form.data.address}
                                disabled={disableForm}
                                onChange={(e) => form.setData('address', e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            {form.errors.address && (
                                <p className="text-xs text-rose-600 mt-1">{form.errors.address}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {renderFileField('personal_photo', t('driver_application_personal_photo'), t('driver_application_upload_hint'))}
                            {renderFileField('id_photo', t('driver_application_id_photo'), t('driver_application_upload_hint'))}
                            {renderFileField('vehicle_photo', t('driver_application_vehicle_photo'), t('driver_application_upload_hint'))}
                        </div>

                        {application && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {renderExistingMedia(t('driver_application_personal_photo'), application.personal_photo_url)}
                                {renderExistingMedia(t('driver_application_id_photo'), application.id_photo_url)}
                                {renderExistingMedia(t('driver_application_vehicle_photo'), application.vehicle_photo_url)}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={disableForm || form.processing}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-purple-700 disabled:opacity-50"
                            >
                                {form.processing ? t('driver_application_sending') : t('driver_application_submit')}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.visit('/dashboard')}
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                {t('cancel')}
                            </button>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <AlertTriangle className="w-4 h-4" />
                                <span>{t('driver_application_review_notice')}</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </CustomerLayout>
    );
}

