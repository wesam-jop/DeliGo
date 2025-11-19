import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import { 
    Settings, 
    Save,
    Upload,
    Image,
    Globe,
    Clock,
    DollarSign,
    AlertCircle,
    CheckCircle,
    X,
    Loader
} from 'lucide-react';

export default function GeneralSettings({ settings }) {
    const { t } = useTranslation();
    const [uploading, setUploading] = useState({});

    const { data, setData, post, processing, errors } = useForm({
        site_name: settings?.site_name || '',
        site_description: settings?.site_description || '',
        site_logo: settings?.site_logo || '',
        site_favicon: settings?.site_favicon || '',
        default_language: settings?.default_language || 'ar',
        default_currency: settings?.default_currency || 'SYP',
        timezone: settings?.timezone || 'Asia/Damascus',
        date_format: settings?.date_format || 'Y-m-d',
        time_format: settings?.time_format || 'H:i',
        maintenance_mode: settings?.maintenance_mode === '1' || settings?.maintenance_mode === true,
        maintenance_message: settings?.maintenance_message || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/settings/general', {
            preserveScroll: true,
            onSuccess: () => {
                // Force page reload to apply all settings immediately
                window.location.reload();
            },
        });
    };

    const handleFileUpload = async (key, file, type) => {
        setUploading(prev => ({ ...prev, [key]: true }));
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        try {
            const response = await fetch('/admin/upload-file', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            const result = await response.json();
            if (result.success) {
                setData(key, result.url);
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(prev => ({ ...prev, [key]: false }));
        }
    };

    const timezones = [
        'Asia/Damascus',
        'Asia/Dubai',
        'Asia/Riyadh',
        'Asia/Kuwait',
        'Asia/Baghdad',
        'Europe/London',
        'America/New_York',
    ];

    const dateFormats = [
        { value: 'Y-m-d', label: 'YYYY-MM-DD (2024-12-25)' },
        { value: 'd/m/Y', label: 'DD/MM/YYYY (25/12/2024)' },
        { value: 'm/d/Y', label: 'MM/DD/YYYY (12/25/2024)' },
        { value: 'd-m-Y', label: 'DD-MM-YYYY (25-12-2024)' },
    ];

    const timeFormats = [
        { value: 'H:i', label: '24-hour (14:30)' },
        { value: 'h:i A', label: '12-hour (02:30 PM)' },
    ];

    return (
        <AdminLayout title={t('general_settings') || 'General Settings'}>
            <Head title={t('general_settings') || 'General Settings'} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">{t('general_settings') || 'General Settings'}</h2>
                        <p className="text-slate-600 mt-2">{t('manage_general_site_settings') || 'Manage your general site settings and configuration'}</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Site Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-purple-600" />
                                {t('site_information') || 'Site Information'}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">{t('basic_site_details') || 'Basic site details and branding'}</p>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Site Name */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('site_name') || 'Site Name'} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.site_name}
                                    onChange={(e) => setData('site_name', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    placeholder={t('enter_site_name') || 'Enter site name'}
                                />
                                {errors.site_name && (
                                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.site_name}
                                    </p>
                                )}
                            </div>

                            {/* Site Description */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('site_description') || 'Site Description'}
                                </label>
                                <textarea
                                    value={data.site_description}
                                    onChange={(e) => setData('site_description', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                                    placeholder={t('enter_site_description') || 'Enter site description'}
                                />
                                {errors.site_description && (
                                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.site_description}
                                    </p>
                                )}
                            </div>

                            {/* Site Logo */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('site_logo') || 'Site Logo'}
                                </label>
                                <div className="space-y-3">
                                    {data.site_logo && data.site_logo.trim() !== '' && (
                                        <div className="relative inline-block">
                                            <img 
                                                src={data.site_logo.startsWith('http') ? data.site_logo : (data.site_logo.startsWith('/') ? data.site_logo : `/${data.site_logo}`)} 
                                                alt="Site Logo"
                                                className="w-32 h-32 object-contain rounded-xl border-2 border-slate-200 bg-slate-50 p-2"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setData('site_logo', '')}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    <label className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 cursor-pointer transition-all shadow-sm w-fit">
                                        {uploading.site_logo ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin" />
                                                <span>{t('uploading') || 'Uploading...'}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4" />
                                                <span>{t('upload_logo') || 'Upload Logo'}</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    handleFileUpload('site_logo', file, 'image');
                                                }
                                            }}
                                            disabled={uploading.site_logo}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Site Favicon */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('site_favicon') || 'Site Favicon'}
                                </label>
                                <div className="space-y-3">
                                    {data.site_favicon && data.site_favicon.trim() !== '' && (
                                        <div className="relative inline-block">
                                            <img 
                                                src={data.site_favicon.startsWith('http') ? data.site_favicon : (data.site_favicon.startsWith('/') ? data.site_favicon : `/${data.site_favicon}`)} 
                                                alt="Site Favicon"
                                                className="w-16 h-16 object-contain rounded-lg border-2 border-slate-200 bg-slate-50 p-2"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setData('site_favicon', '')}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    <label className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 cursor-pointer transition-all shadow-sm w-fit">
                                        {uploading.site_favicon ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin" />
                                                <span>{t('uploading') || 'Uploading...'}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Image className="w-4 h-4" />
                                                <span>{t('upload_favicon') || 'Upload Favicon'}</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    handleFileUpload('site_favicon', file, 'image');
                                                }
                                            }}
                                            disabled={uploading.site_favicon}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Localization */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-600" />
                                {t('localization') || 'Localization'}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">{t('language_currency_timezone') || 'Language, currency, and timezone settings'}</p>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Default Language */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('default_language') || 'Default Language'} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.default_language}
                                    onChange={(e) => setData('default_language', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                >
                                    <option value="ar">{t('arabic') || 'Arabic'}</option>
                                    <option value="en">{t('english') || 'English'}</option>
                                </select>
                                {errors.default_language && (
                                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.default_language}
                                    </p>
                                )}
                            </div>

                            {/* Default Currency */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('default_currency') || 'Default Currency'} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={data.default_currency}
                                        onChange={(e) => setData('default_currency', e.target.value)}
                                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                        placeholder="SYP"
                                    />
                                </div>
                                {errors.default_currency && (
                                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.default_currency}
                                    </p>
                                )}
                            </div>

                            {/* Timezone */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('timezone') || 'Timezone'} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <select
                                        value={data.timezone}
                                        onChange={(e) => setData('timezone', e.target.value)}
                                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    >
                                        {timezones.map(tz => (
                                            <option key={tz} value={tz}>{tz}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.timezone && (
                                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.timezone}
                                    </p>
                                )}
                            </div>

                            {/* Date Format */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('date_format') || 'Date Format'} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.date_format}
                                    onChange={(e) => setData('date_format', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                >
                                    {dateFormats.map(format => (
                                        <option key={format.value} value={format.value}>{format.label}</option>
                                    ))}
                                </select>
                                {errors.date_format && (
                                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.date_format}
                                    </p>
                                )}
                            </div>

                            {/* Time Format */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('time_format') || 'Time Format'} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.time_format}
                                    onChange={(e) => setData('time_format', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                >
                                    {timeFormats.map(format => (
                                        <option key={format.value} value={format.value}>{format.label}</option>
                                    ))}
                                </select>
                                {errors.time_format && (
                                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.time_format}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Maintenance Mode */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-orange-600" />
                                {t('maintenance_mode') || 'Maintenance Mode'}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">{t('enable_disable_maintenance') || 'Enable or disable maintenance mode'}</p>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Maintenance Mode Toggle */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900">
                                        {t('enable_maintenance_mode') || 'Enable Maintenance Mode'}
                                    </label>
                                    <p className="text-sm text-slate-600 mt-1">
                                        {t('maintenance_mode_description') || 'When enabled, only administrators can access the site'}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.maintenance_mode}
                                        onChange={(e) => setData('maintenance_mode', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                </label>
                            </div>

                            {/* Maintenance Message */}
                            {data.maintenance_mode && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        {t('maintenance_message') || 'Maintenance Message'}
                                    </label>
                                    <textarea
                                        value={data.maintenance_message}
                                        onChange={(e) => setData('maintenance_message', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                                        placeholder={t('enter_maintenance_message') || 'Enter maintenance message'}
                                    />
                                    {errors.maintenance_message && (
                                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.maintenance_message}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold"
                        >
                            {processing ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    <span>{t('saving') || 'Saving...'}</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>{t('save_settings') || 'Save Settings'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

