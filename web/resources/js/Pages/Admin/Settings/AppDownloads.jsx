import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import {
    Smartphone,
    Save,
    Upload,
    Download,
    Link2,
    Star,
    Users,
    AlertCircle,
    Loader,
    Trash2
} from 'lucide-react';

export default function AppDownloads({ settings }) {
    const { t } = useTranslation();
    const [uploading, setUploading] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        app_download_ios_url: settings?.app_download_ios_url || '',
        app_download_android_url: settings?.app_download_android_url || '',
        app_download_direct_file_url: settings?.app_download_direct_file_url || '',
        app_download_downloads_count: settings?.app_download_downloads_count || '100K+',
        app_download_rating: settings?.app_download_rating || '4.8',
        app_download_reviews_count: settings?.app_download_reviews_count || '12K+',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/settings/app-downloads', {
            preserveScroll: true,
        });
    };

    const handleFileUpload = async (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'file');

        try {
            const response = await fetch('/admin/upload-file', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            });

            const result = await response.json();
            if (result.success) {
                setData('app_download_direct_file_url', result.url);
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <AdminLayout title={t('app_download_settings') || 'App Download Settings'}>
            <Head title={t('app_download_settings') || 'App Download Settings'} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">
                            {t('app_download_settings') || 'App Download Settings'}
                        </h2>
                        <p className="text-slate-600 mt-2">
                            {t('manage_app_downloads') || 'Manage your App Store, Play Store, and direct download links.'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-purple-600" />
                                {t('app_links_section_title') || 'Mobile Store Links'}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                                {t('app_links_section_subtitle') || 'Add or update the official store links displayed on the download page.'}
                            </p>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* iOS */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('ios_app_link') || 'App Store URL'}
                                </label>
                                <div className="relative">
                                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="url"
                                        value={data.app_download_ios_url}
                                        onChange={(e) => setData('app_download_ios_url', e.target.value)}
                                        placeholder="https://apps.apple.com/..."
                                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    />
                                </div>
                                {errors.app_download_ios_url && (
                                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.app_download_ios_url}
                                    </p>
                                )}
                            </div>

                            {/* Android */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('android_app_link') || 'Google Play URL'}
                                </label>
                                <div className="relative">
                                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="url"
                                        value={data.app_download_android_url}
                                        onChange={(e) => setData('app_download_android_url', e.target.value)}
                                        placeholder="https://play.google.com/..."
                                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    />
                                </div>
                                {errors.app_download_android_url && (
                                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.app_download_android_url}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Direct download */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Download className="w-5 h-5 text-green-600" />
                                {t('direct_apk_file') || 'Direct Download (APK / IPA)'}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                                {t('direct_apk_file_hint') || 'Upload the latest build to offer a direct download mirror.'}
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            {data.app_download_direct_file_url ? (
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
                                    <div className="flex items-center gap-3">
                                        <Download className="w-5 h-5" />
                                        <a
                                            href={data.app_download_direct_file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold underline break-all"
                                        >
                                            {data.app_download_direct_file_url}
                                        </a>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('app_download_direct_file_url', '')}
                                        className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 font-semibold"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        {t('remove_file') || 'Remove'}
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">
                                    {t('no_direct_file_uploaded') || 'No direct download file uploaded yet.'}
                                </p>
                            )}

                            <label className="flex items-center gap-2 w-fit px-4 py-2.5 rounded-xl border border-dashed border-green-300 text-green-700 bg-white hover:border-green-400 cursor-pointer transition">
                                {uploading ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        <span>{t('uploading') || 'Uploading...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        <span>{t('upload_new_file') || 'Upload new file'}</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            handleFileUpload(file);
                                        }
                                    }}
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                {t('app_highlights') || 'App Highlights'}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                                {t('app_highlights_hint') || 'These numbers appear near the hero section to emphasize trust.'}
                            </p>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('downloads_count_label') || 'Total Downloads'}
                                </label>
                                <input
                                    type="text"
                                    value={data.app_download_downloads_count}
                                    onChange={(e) => setData('app_download_downloads_count', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('rating_label') || 'Average Rating'}
                                </label>
                                <div className="relative">
                                    <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={data.app_download_rating}
                                        onChange={(e) => setData('app_download_rating', e.target.value)}
                                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('reviews_label') || 'Reviews Count'}
                                </label>
                                <input
                                    type="text"
                                    value={data.app_download_reviews_count}
                                    onChange={(e) => setData('app_download_reviews_count', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold"
                        >
                            {processing ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    <span>{t('saving') || 'Saving...'}</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>{t('save_changes') || 'Save Changes'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

