import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layout';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useGeneralSettings } from '../../../../hooks/useGeneralSettings';
import { CheckCircle, XCircle, Download, User, MapPin, Calendar } from 'lucide-react';

export default function DriverApplicationShow({ application }) {
    const { t } = useTranslation();
    const { formatDateTime } = useGeneralSettings();

    const approveForm = useForm({ notes: '' });
    const rejectForm = useForm({ notes: '' });

    const handleApprove = () => {
        approveForm.post(`/admin/drivers/applications/${application.id}/approve`, {
            preserveScroll: true,
        });
    };

    const handleReject = (event) => {
        event.preventDefault();
        rejectForm.post(`/admin/drivers/applications/${application.id}/reject`, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout
            title={t('driver_application_view_title', { name: application.full_name })}
            subtitle={t('driver_application_view_subtitle')}
        >
            <Head title={t('driver_application_view_title', { name: application.full_name })} />

            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <InfoCard title={t('applicant_information')}>
                            <div className="space-y-4">
                                <InfoRow icon={User} label={t('full_name')} value={application.full_name} />
                                <InfoRow icon={Calendar} label={t('birth_date')} value={application.birth_date} />
                                <InfoRow label={t('phone')} value={application.phone} />
                                <InfoRow icon={MapPin} label={t('address')} value={application.address} />
                                <InfoRow label={t('driver_application_vehicle_type')} value={application.vehicle_type || '--'} />
                                <InfoRow label={t('status')} value={<StatusBadge status={application.status} t={t} />} />
                                <InfoRow label={t('submitted_at')} value={formatDateTime(application.submitted_at)} />
                                {application.reviewed_at && (
                                    <InfoRow label={t('reviewed_at')} value={formatDateTime(application.reviewed_at)} />
                                )}
                                {application.reviewer && (
                                    <InfoRow label={t('reviewed_by')} value={application.reviewer.name} />
                                )}
                                {application.notes && (
                                    <InfoRow label={t('notes')} value={application.notes} />
                                )}
                            </div>
                        </InfoCard>

                        <InfoCard title={t('driver_application_documents')}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <DocumentCard title={t('driver_application_personal_photo')} url={application.personal_photo_url} t={t} />
                                <DocumentCard title={t('driver_application_id_photo')} url={application.id_photo_url} t={t} />
                                <DocumentCard title={t('driver_application_vehicle_photo')} url={application.vehicle_photo_url} t={t} />
                            </div>
                        </InfoCard>
                    </div>

                    <div className="space-y-6">
                        <InfoCard title={t('admin_actions')}>
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={handleApprove}
                                    disabled={application.status === 'approved' || approveForm.processing}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    {t('approve')}
                                </button>

                                <form className="space-y-3" onSubmit={handleReject}>
                                    <textarea
                                        rows="4"
                                        required
                                        value={rejectForm.data.notes}
                                        onChange={(e) => rejectForm.setData('notes', e.target.value)}
                                        placeholder={t('driver_application_reject_reason_placeholder')}
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    />
                                    {rejectForm.errors.notes && (
                                        <p className="text-xs text-rose-600">{rejectForm.errors.notes}</p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={rejectForm.processing}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        {t('reject')}
                                    </button>
                                </form>
                            </div>
                        </InfoCard>

                        <InfoCard title={t('linked_user')}>
                            <div className="space-y-2">
                                <p className="text-sm font-semibold text-slate-900">{application.user.name}</p>
                                <p className="text-xs text-slate-500">{application.user.email}</p>
                                <Link
                                    href={`/admin/users/${application.user.id}`}
                                    className="inline-flex items-center gap-2 text-xs font-semibold text-purple-600 hover:text-purple-800"
                                >
                                    {t('view_user_profile')}
                                </Link>
                            </div>
                        </InfoCard>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function InfoCard({ title, children }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            {children}
        </div>
    );
}

function InfoRow({ label, value, icon: Icon }) {
    return (
        <div className="flex items-start gap-3 text-sm">
            {Icon && <Icon className="w-4 h-4 text-slate-400 mt-1" />}
            <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
                <div className="mt-1 text-slate-800">{value || '--'}</div>
            </div>
        </div>
    );
}

function DocumentCard({ title, url, t }) {
    if (!url) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                {title}
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">{title}</p>
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-purple-600 hover:text-purple-800 inline-flex items-center gap-1"
                >
                    <Download className="w-4 h-4" />
                    {t('download')}
                </a>
            </div>
            <img src={url} alt={title} className="w-full h-48 object-cover" />
        </div>
    );
}

function StatusBadge({ status, t }) {
    const map = {
        pending: 'bg-amber-100 text-amber-700 border-amber-200',
        approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        rejected: 'bg-rose-100 text-rose-700 border-rose-200',
    };

    return (
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${map[status] || 'bg-slate-100'}`}>
            {t(status) || status}
        </span>
    );
}

