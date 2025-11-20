import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import {
    ShieldCheck,
    Save,
    Plus,
    Trash2,
    GripVertical,
    AlertCircle,
    Loader,
    Calendar,
} from 'lucide-react';

export default function PrivacySettings({ settings }) {
    const { t } = useTranslation();
    const initialSections = (() => {
        try {
            return settings?.privacy_sections ? JSON.parse(settings.privacy_sections) : [];
        } catch {
            return [];
        }
    })();

    const { data, setData, post, processing, errors } = useForm({
        privacy_intro: settings?.privacy_intro || '',
        privacy_last_updated: settings?.privacy_last_updated || new Date().toISOString().slice(0, 10),
        privacy_sections: JSON.stringify(initialSections),
    });

    const [sections, setSections] = useState(
        initialSections.length > 0 ? initialSections : [{ title: '', content: '' }]
    );

    useEffect(() => {
        setData('privacy_sections', JSON.stringify(sections));
    }, [sections]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setData('privacy_sections', JSON.stringify(sections));
        post('/admin/settings/privacy', {
            preserveScroll: true,
        });
    };

    const updateSection = (index, field, value) => {
        setSections((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const addSection = () => {
        setSections((prev) => [...prev, { title: '', content: '' }]);
    };

    const removeSection = (index) => {
        setSections((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <AdminLayout title={t('privacy_admin_title') || 'Privacy Policy'}>
            <Head title={t('privacy_admin_title') || 'Privacy Policy'} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">
                            {t('privacy_admin_title') || 'Privacy Policy'}
                        </h2>
                        <p className="text-slate-600 mt-2">
                            {t('privacy_admin_subtitle') || 'Control the legal copy that appears on the public privacy page.'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200 flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {t('privacy_intro_section') || 'Introduction'}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    {t('privacy_intro_hint') || 'Displayed under the hero area on the public privacy page.'}
                                </p>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('privacy_intro_label') || 'Introductory paragraph'}
                                </label>
                                <textarea
                                    value={data.privacy_intro}
                                    onChange={(e) => setData('privacy_intro', e.target.value)}
                                    rows={4}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                                {errors.privacy_intro && (
                                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.privacy_intro}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('privacy_last_updated_label') || 'Last updated date'}
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="date"
                                        value={data.privacy_last_updated}
                                        onChange={(e) => setData('privacy_last_updated', e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                </div>
                                {errors.privacy_last_updated && (
                                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.privacy_last_updated}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {t('privacy_sections_title') || 'Privacy sections'}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    {t('privacy_sections_hint') || 'Each section becomes a separate block on the public privacy page.'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={addSection}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                {t('add_section') || 'Add section'}
                            </button>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {sections.map((section, index) => (
                                <div key={`privacy-section-${index}`} className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-widest">
                                            <GripVertical className="w-4 h-4" />
                                            {t('section_label', { number: index + 1 }) || `Section ${index + 1}`}
                                        </div>
                                        {sections.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSection(index)}
                                                className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 text-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                {t('remove_section') || 'Remove'}
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('section_title_label') || 'Section title'}
                                            </label>
                                            <input
                                                type="text"
                                                value={section.title}
                                                onChange={(e) => updateSection(index, 'title', e.target.value)}
                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                placeholder={t('privacy_section_title_placeholder') || 'e.g., Data we collect'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('section_content_label') || 'Section content'}
                                            </label>
                                            <textarea
                                                value={section.content}
                                                onChange={(e) => updateSection(index, 'content', e.target.value)}
                                                rows={4}
                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                placeholder={t('privacy_section_content_placeholder') || 'Explain what users should know about this topic.'}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold"
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

