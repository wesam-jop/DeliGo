import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from './Layout';
import { useTranslation } from '../../hooks/useTranslation';
import { 
    FileText, 
    Search,
    Filter,
    Trash2,
    Download,
    RefreshCw,
    AlertCircle,
    AlertTriangle,
    Info,
    Bug,
    X,
    CheckCircle,
    Clock,
    File,
    Loader
} from 'lucide-react';

export default function Logs({ 
    logs: initialLogs, 
    logFiles: initialLogFiles, 
    currentFile: initialCurrentFile,
    level: initialLevel,
    search: initialSearch,
    limit: initialLimit,
    stats: initialStats
}) {
    const { t } = useTranslation();
    const [logs, setLogs] = useState(initialLogs || []);
    const [logFiles, setLogFiles] = useState(initialLogFiles || []);
    const [currentFile, setCurrentFile] = useState(initialCurrentFile || 'laravel.log');
    const [level, setLevel] = useState(initialLevel || 'all');
    const [search, setSearch] = useState(initialSearch || '');
    const [limit, setLimit] = useState(initialLimit || 100);
    const [stats, setStats] = useState(initialStats || {});
    const [clearing, setClearing] = useState(false);

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getLevelIcon = (level) => {
        switch (level) {
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
            case 'info':
                return <Info className="w-4 h-4 text-blue-600" />;
            case 'debug':
                return <Bug className="w-4 h-4 text-purple-600" />;
            default:
                return <FileText className="w-4 h-4 text-slate-600" />;
        }
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'error':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'warning':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'info':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'debug':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getLevelLabel = (level) => {
        const labels = {
            error: t('error') || 'Error',
            warning: t('warning') || 'Warning',
            info: t('info') || 'Info',
            debug: t('debug') || 'Debug',
        };
        return labels[level] || level.toUpperCase();
    };

    const handleFilter = () => {
        router.get('/admin/logs', {
            file: currentFile,
            level: level,
            search: search,
            limit: limit,
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                setLogs(page.props.logs || []);
                setStats(page.props.stats || {});
            },
        });
    };

    const handleFileChange = (filename) => {
        setCurrentFile(filename);
        router.get('/admin/logs', {
            file: filename,
            level: level,
            search: search,
            limit: limit,
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                setLogs(page.props.logs || []);
                setLogFiles(page.props.logFiles || []);
                setStats(page.props.stats || {});
            },
        });
    };

    const handleClear = () => {
        if (confirm(t('confirm_clear_logs') || `Are you sure you want to clear "${currentFile}"?`)) {
            setClearing(true);
            router.post('/admin/logs/clear', { file: currentFile }, {
                preserveScroll: true,
                onSuccess: (page) => {
                    setLogs([]);
                    setStats({
                        total_entries: 0,
                        error_count: 0,
                        warning_count: 0,
                        info_count: 0,
                        debug_count: 0,
                    });
                    setClearing(false);
                },
                onError: () => {
                    setClearing(false);
                },
            });
        }
    };

    const handleDelete = (filename) => {
        if (confirm(t('confirm_delete_log') || `Are you sure you want to delete "${filename}"?`)) {
            router.delete(`/admin/logs/${filename}`, {
                preserveScroll: true,
                onSuccess: (page) => {
                    setLogFiles(page.props.logFiles || []);
                    if (filename === currentFile) {
                        setCurrentFile('laravel.log');
                        handleFileChange('laravel.log');
                    }
                },
            });
        }
    };

    const handleDownload = (filename) => {
        window.location.href = `/admin/logs/download/${filename}`;
    };

    return (
        <AdminLayout title={t('logs') || 'Logs'}>
            <Head title={t('logs') || 'Logs'} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">{t('logs') || 'Logs'}</h2>
                        <p className="text-slate-600 mt-2">{t('view_system_logs') || 'View and manage system logs'}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('total_entries') || 'Total Entries'}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total_entries || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('errors') || 'Errors'}</p>
                                <p className="text-2xl font-bold text-red-600 mt-1">{stats.error_count || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('warnings') || 'Warnings'}</p>
                                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.warning_count || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('info') || 'Info'}</p>
                                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.info_count || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <Info className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('debug') || 'Debug'}</p>
                                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.debug_count || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Bug className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Log File Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                {t('log_file') || 'Log File'}
                            </label>
                            <select
                                value={currentFile}
                                onChange={(e) => handleFileChange(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            >
                                {logFiles.map((file) => (
                                    <option key={file.name} value={file.name}>
                                        {file.name} ({formatBytes(file.size)})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Level Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                {t('level') || 'Level'}
                            </label>
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            >
                                <option value="all">{t('all') || 'All'}</option>
                                <option value="error">{t('error') || 'Error'}</option>
                                <option value="warning">{t('warning') || 'Warning'}</option>
                                <option value="info">{t('info') || 'Info'}</option>
                                <option value="debug">{t('debug') || 'Debug'}</option>
                            </select>
                        </div>

                        {/* Search */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                {t('search') || 'Search'}
                            </label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={t('search_logs') || 'Search logs...'}
                                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Limit */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                {t('limit') || 'Limit'}
                            </label>
                            <select
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            >
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="200">200</option>
                                <option value="500">500</option>
                                <option value="1000">1000</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 mt-4">
                        <button
                            onClick={handleFilter}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg font-semibold"
                        >
                            <Filter className="w-5 h-5" />
                            <span>{t('apply_filters') || 'Apply Filters'}</span>
                        </button>
                        <button
                            onClick={handleClear}
                            disabled={clearing}
                            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold"
                        >
                            {clearing ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    <span>{t('clearing') || 'Clearing...'}</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-5 h-5" />
                                    <span>{t('clear_logs') || 'Clear Logs'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Log Files List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('log_files') || 'Log Files'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {logFiles.map((file) => (
                            <div
                                key={file.name}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                    currentFile === file.name
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <File className="w-5 h-5 text-slate-600" />
                                        <span className="text-sm font-semibold text-slate-900">{file.name}</span>
                                    </div>
                                    {currentFile === file.name && (
                                        <CheckCircle className="w-5 h-5 text-purple-600" />
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
                                    <span>{formatBytes(file.size)}</span>
                                    <span>{formatDate(file.modified)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleFileChange(file.name)}
                                        className="flex-1 px-3 py-1.5 text-xs font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        {t('view') || 'View'}
                                    </button>
                                    <button
                                        onClick={() => handleDownload(file.name)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title={t('download') || 'Download'}
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file.name)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title={t('delete') || 'Delete'}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900">{t('log_entries') || 'Log Entries'}</h3>
                    </div>
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        {logs.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="flex flex-col items-center justify-center text-slate-400">
                                    <FileText className="w-16 h-16 mb-4" />
                                    <p className="text-lg font-semibold">{t('no_logs_found') || 'No logs found'}</p>
                                    <p className="text-sm mt-1">{t('try_adjusting_filters') || 'Try adjusting your filters'}</p>
                                </div>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            {t('timestamp') || 'Timestamp'}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            {t('level') || 'Level'}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            {t('message') || 'Message'}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {logs.map((log, index) => (
                                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Clock className="w-4 h-4" />
                                                    {formatDate(log.timestamp)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(log.level)}`}>
                                                    {getLevelIcon(log.level)}
                                                    {getLevelLabel(log.level)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-900 font-mono break-words max-w-4xl">
                                                    {log.message}
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

