import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from './Layout';
import { useTranslation } from '../hooks/useTranslation';
import {
    ShieldCheck,
    Lock,
    Database,
    Bell,
    Mail,
    Clock,
    Globe,
} from 'lucide-react';

export default function PrivacyPolicy({ intro, lastUpdated, sections = [] }) {
    const { t } = useTranslation();

    const highlights = [
        {
            icon: Lock,
            title: t('privacy_highlight_security') || 'Bank-grade protection',
            description: t('privacy_highlight_security_desc') || 'All sensitive data is encrypted in transit and at rest using modern standards.',
        },
        {
            icon: Database,
            title: t('privacy_highlight_control') || 'Full data control',
            description: t('privacy_highlight_control_desc') || 'You decide what information to share, and you can request export or deletion any time.',
        },
        {
            icon: Globe,
            title: t('privacy_highlight_transparency') || 'Transparent usage',
            description: t('privacy_highlight_transparency_desc') || 'We only use your data to operate the service, improve logistics, and comply with the law.',
        },
    ];

    return (
        <Layout>
            <Head title={t('privacy_policy_title') || 'Privacy Policy'} />

            <div className="bg-gradient-to-b from-slate-50 via-white to-white">
                <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-white/15 rounded-3xl flex items-center justify-center shadow-2xl">
                                <ShieldCheck className="w-10 h-10" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">
                                {t('privacy_center') || 'Privacy Center'}
                            </p>
                            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                                {t('privacy_policy_title') || 'Privacy Policy'}
                            </h1>
                            <p className="text-lg text-emerald-50 max-w-3xl mx-auto">
                                {intro}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 text-sm text-emerald-100">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10">
                                <Clock className="w-4 h-4" />
                                <span>{t('last_updated')} {lastUpdated}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10">
                                <Bell className="w-4 h-4" />
                                <span>{t('privacy_trust_badge') || 'Committed to your privacy'}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="-mt-16 pb-6">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {highlights.map((highlight) => (
                                <div
                                    key={highlight.title}
                                    className="bg-white rounded-3xl shadow-lg border border-emerald-50 p-6 space-y-4"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <highlight.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">{highlight.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{highlight.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                        {sections.map((section, index) => (
                            <article
                                key={`${section.title}-${index}`}
                                className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold">
                                        {index + 1}
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        {section.title}
                                    </h2>
                                </div>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                    {section.content}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="pb-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-slate-900 text-white rounded-3xl p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center gap-6">
                            <div className="flex-1 space-y-2">
                                <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
                                    {t('privacy_questions') || 'Have a privacy question?'}
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {t('privacy_support_heading') || 'Speak with our data protection team'}
                                </h3>
                                <p className="text-slate-200">
                                    {t('privacy_support_text') || 'We respond to privacy inquiries within 2 business days. Let us know if you need copies of your data or want it removed.'}
                                </p>
                            </div>
                            <a
                                href="mailto:privacy@getir-clone.test"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-emerald-700 font-semibold hover:bg-emerald-50 transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                {t('contact_privacy_team') || 'Contact privacy team'}
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}

