import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from './Layout';
import { useTranslation } from '../../hooks/useTranslation';
import { 
    Database, 
    HardDrive,
    Download,
    Trash2,
    RefreshCw,
    Plus,
    AlertCircle,
    CheckCircle,
    Clock,
    FileArchive,
    Server,
    Loader,
    Archive,
    FileText
} from 'lucide-react';

export default function Backups({ backups: initialBackups, disk_total, disk_free, disk_used }) {
    const { t } = useTranslation();
    const [backups, setBackups] = useState(initialBackups || []);
    const [creating, setCreating] = useState(false);
    const [backupType, setBackupType] = useState('database');

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFileType = (filename) => {
        if (filename.includes('_files.zip')) return 'files';
        if (filename.endsWith('.sql')) return 'database';
        if (filename.endsWith('.sqlite')) return 'database';
        if (filename.includes('_full_')) return 'full';
        return 'unknown';
    };

    const getFileTypeIcon = (filename) => {
        const type = getFileType(filename);
        switch (type) {
            case 'database':
                return <Database className="w-5 h-5 text-blue-600" />;
            case 'files':
                return <FileArchive className="w-5 h-5 text-purple-600" />;
            case 'full':
                return <Archive className="w-5 h-5 text-green-600" />;
            default:
                return <FileText className="w-5 h-5 text-slate-600" />;
        }
    };

    const getFileTypeLabel = (filename) => {
        const type = getFileType(filename);
        switch (type) {
            case 'database':
                return t('database') || 'Database';
            case 'files':
                return t('files') || 'Files';
            case 'full':
                return t('full_backup') || 'Full Backup';
            default:
                return t('unknown') || 'Unknown';
        }
    };

    const handleCreateBackup = () => {
        setCreating(true);
        router.post('/admin/backups/create', { type: backupType }, {
            preserveScroll: true,
            onSuccess: (page) => {
                setBackups(page.props.backups || []);
                setCreating(false);
            },
            onError: () => {
                setCreating(false);
            },
        });
    };

    const handleDownload = (filename) => {
        window.location.href = `/admin/backups/download/${filename}`;
    };

    const handleDelete = (filename) => {
        if (confirm(t('confirm_delete_backup') || `Are you sure you want to delete "${filename}"?`)) {
            router.delete(`/admin/backups/${filename}`, {
                preserveScroll: true,
                onSuccess: (page) => {
                    setBackups(page.props.backups || []);
                },
            });
        }
    };

    const handleRestore = (filename) => {
        if (confirm(t('confirm_restore_backup') || `Are you sure you want to restore "${filename}"? This will overwrite current data.`)) {
            router.post(`/admin/backups/restore/${filename}`, {}, {
                preserveScroll: true,
                onSuccess: () => {
                    alert(t('backup_restored') || 'Backup restored successfully!');
                },
            });
        }
    };

    const diskUsagePercent = disk_total > 0 ? ((disk_used / disk_total) * 100).toFixed(1) : 0;

    return (
        <AdminLayout title={t('backups') || 'Backups'}>
            <Head title={t('backups') || 'Backups'} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">{t('backups') || 'Backups'}</h2>
                        <p className="text-slate-600 mt-2">{t('manage_system_backups') || 'Manage system backups and restore data'}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('total_backups') || 'Total Backups'}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{backups.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <Archive className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('total_size') || 'Total Size'}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                    {formatBytes(backups.reduce((sum, b) => sum + (b.size || 0), 0))}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                <HardDrive className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('disk_used') || 'Disk Used'}</p>
                                <p className="text-2xl font-bold text-blue-600 mt-1">{formatBytes(disk_used || 0)}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <Server className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('disk_free') || 'Disk Free'}</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">{formatBytes(disk_free || 0)}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <HardDrive className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Disk Usage */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{t('disk_usage') || 'Disk Usage'}</h3>
                        <span className="text-sm font-semibold text-slate-700">{diskUsagePercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all"
                            style={{ width: `${diskUsagePercent}%` }}
                        ></div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-sm text-slate-600">
                        <span>{formatBytes(disk_used || 0)} {t('used') || 'used'}</span>
                        <span>{formatBytes(disk_free || 0)} {t('free') || 'free'}</span>
                    </div>
                </div>

                {/* Create Backup */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('create_backup') || 'Create Backup'}</h3>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                {t('backup_type') || 'Backup Type'}
                            </label>
                            <select
                                value={backupType}
                                onChange={(e) => setBackupType(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            >
                                <option value="database">{t('database_only') || 'Database Only'}</option>
                                <option value="files">{t('files_only') || 'Files Only'}</option>
                                <option value="full">{t('full_backup') || 'Full Backup'}</option>
                            </select>
                        </div>
                        <button
                            onClick={handleCreateBackup}
                            disabled={creating}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold mt-6 sm:mt-0"
                        >
                            {creating ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    <span>{t('creating') || 'Creating...'}</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    <span>{t('create_backup') || 'Create Backup'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Backups List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900">{t('backup_files') || 'Backup Files'}</h3>
                    </div>
                    <div className="overflow-x-auto">
                        {backups.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="flex flex-col items-center justify-center text-slate-400">
                                    <Archive className="w-16 h-16 mb-4" />
                                    <p className="text-lg font-semibold">{t('no_backups_found') || 'No backups found'}</p>
                                    <p className="text-sm mt-1">{t('create_first_backup') || 'Create your first backup to get started'}</p>
                                </div>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            {t('name') || 'Name'}
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            {t('type') || 'Type'}
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            {t('size') || 'Size'}
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            {t('created_at') || 'Created At'}
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            {t('actions') || 'Actions'}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {backups.map((backup, index) => (
                                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    {getFileTypeIcon(backup.name)}
                                                    <div>
                                                        <div className="text-sm font-semibold text-slate-900">{backup.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                                                    {getFileTypeLabel(backup.name)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-700">{formatBytes(backup.size || 0)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Clock className="w-4 h-4" />
                                                    {formatDate(backup.created_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDownload(backup.name)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title={t('download') || 'Download'}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRestore(backup.name)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title={t('restore') || 'Restore'}
                                                    >
                                                        <RefreshCw className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(backup.name)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title={t('delete') || 'Delete'}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

