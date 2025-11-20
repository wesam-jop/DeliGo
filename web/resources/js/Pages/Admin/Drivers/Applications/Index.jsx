import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../Layout';
import { useTranslation } from '../../../../hooks/useTranslation';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { useGeneralSettings } from '../../../../hooks/useGeneralSettings';

export default function DriverApplicationsIndex({ applications, stats, filters }) {
    const { t } = useTranslation();
    const { formatDateTime } = useGeneralSettings();

    const tabs = [
        { key: 'pending', label: t('pending'), count: stats.pending, icon: Clock, color: 'text-amber-600' },
        { key: 'approved', label: t('approved'), count: stats.approved, icon: CheckCircle, color: 'text-emerald-600' },
        { key: 'rejected', label: t('rejected'), count: stats.rejected, icon: XCircle, color: 'text-rose-600' },
        { key: 'all', label: t('all'), count: stats.pending + stats.approved + stats.rejected, icon: null, color: 'text-slate-600' },
    ];

    const handleFilterChange = (status) => {
        router.get('/admin/drivers/applications', { status }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title={t('driver_applications_admin_title')} subtitle={t('driver_applications_admin_subtitle')}>
            <Head title={t('driver_applications_admin_title')} />

            <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                    {tabs.map(({ key, label, count, icon: Icon, color }) => (
                        <button
                            key={key}
                            onClick={() => handleFilterChange(key)}
                            className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                                filters.status === key
                                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {Icon && <Icon className={`w-4 h-4 ${color}`} />}
                            <span>{label}</span>
                            <span className="text-xs text-slate-400">{count}</span>
                        </button>
                    ))}
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <Th>{t('applicant')}</Th>
                                <Th>{t('phone')}</Th>
                                <Th>{t('status')}</Th>
                                <Th>{t('submitted_at')}</Th>
                                <Th></Th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {applications.data.length ? (
                                applications.data.map((application) => (
                                    <tr key={application.id} className="hover:bg-slate-50">
                                        <Td>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{application.full_name}</p>
                                                <p className="text-xs text-slate-500">#{application.id}</p>
                                            </div>
                                        </Td>
                                        <Td>
                                            <p className="text-sm text-slate-700">{application.phone}</p>
                                        </Td>
                                        <Td>
                                            <StatusBadge status={application.status} t={t} />
                                        </Td>
                                        <Td>
                                            <p className="text-sm text-slate-600">
                                                {application.submitted_at ? formatDateTime(application.submitted_at) : '--'}
                                            </p>
                                        </Td>
                                        <Td className="text-right">
                                            <Link
                                                href={`/admin/drivers/applications/${application.id}`}
                                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                                            >
                                                {t('view_details')}
                                            </Link>
                                        </Td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center text-slate-500">
                                        {t('driver_applications_empty')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {applications.links && applications.links.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                        {applications.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 text-sm rounded-lg border ${
                                    link.active ? 'bg-purple-600 text-white border-purple-600' : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function Th({ children }) {
    return (
        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {children}
        </th>
    );
}

function Td({ children, className = '' }) {
    return <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>;
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

