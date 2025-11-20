import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import {
    FileText,
    Save,
    Plus,
    Trash2,
    GripVertical,
    AlertCircle,
    Loader,
    Calendar,
} from 'lucide-react';

export default function TermsSettings({ settings }) {
    const { t } = useTranslation();
    const initialSections = (() => {
        try {
            return settings?.terms_sections ? JSON.parse(settings.terms_sections) : [];
        } catch {
            return [];
        }
    })();

    const { data, setData, post, processing, errors } = useForm({
        terms_intro: settings?.terms_intro || '',
        terms_last_updated: settings?.terms_last_updated || new Date().toISOString().slice(0, 10),
        terms_sections: JSON.stringify(initialSections),
    });

    const [sections, setSections] = useState(initialSections.length > 0 ? initialSections : [
        { title: '', content: '' },
    ]);

    useEffect(() => {
        setData('terms_sections', JSON.stringify(sections));
    }, [sections]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setData('terms_sections', JSON.stringify(sections));
        post('/admin/settings/terms', {
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
        <AdminLayout title={t('terms_admin_title') || 'Terms Management'}>
            <Head title={t('terms_admin_title') || 'Terms Management'} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">
                            {t('terms_admin_title') || 'Terms & Conditions'}
                        </h2>
                        <p className="text-slate-600 mt-2">
                            {t('terms_admin_subtitle') || 'Edit the legal copy that appears on the public terms page.'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-slate-200 flex items-center gap-3">
                            <FileText className="w-5 h-5 text-purple-600" />
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {t('terms_intro_section') || 'Introduction'}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    {t('terms_intro_hint') || 'Displayed at the top of the terms page.'}
                                </p>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('terms_intro_label') || 'Introductory paragraph'}
                                </label>
                                <textarea
                                    value={data.terms_intro}
                                    onChange={(e) => setData('terms_intro', e.target.value)}
                                    rows={4}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {errors.terms_intro && (
                                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.terms_intro}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('terms_last_updated_label') || 'Last updated date'}
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="date"
                                        value={data.terms_last_updated}
                                        onChange={(e) => setData('terms_last_updated', e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                {errors.terms_last_updated && (
                                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.terms_last_updated}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {t('terms_sections_title') || 'Terms sections'}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    {t('terms_sections_hint') || 'Each section appears as a separate article on the public page.'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={addSection}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold shadow hover:bg-purple-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                {t('add_section') || 'Add section'}
                            </button>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {sections.map((section, index) => (
                                <div key={`section-${index}`} className="p-6 space-y-4">
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
                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder={t('section_title_placeholder') || 'e.g., Eligibility & Accounts'}
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
                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder={t('section_content_placeholder') || 'Describe the rules that apply.'}
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

