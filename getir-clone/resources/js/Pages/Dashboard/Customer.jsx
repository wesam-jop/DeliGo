import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Store, Truck, ShoppingBag, ShoppingCart, Grid3X3, Package } from 'lucide-react';
import Layout from '../Layout';
import AppDownloadSection from '../../Components/AppDownloadSection';
import { useTranslation } from '../../hooks/useTranslation';

export default function CustomerDashboard({ stats, recentOrders, favoriteProducts }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const upgradeForm = useForm({ target_role: '' });
    const { t, locale } = useTranslation();
    const dateLocale = locale === 'ar' ? 'ar-SA' : 'en-US';

    const handleUpgrade = (role) => {
        upgradeForm.setData('target_role', role);
        upgradeForm.post('/dashboard/upgrade-role', {
            preserveScroll: true,
        });
    };

    const statCards = [
        {
            label: t('total_orders'),
            value: stats.total_orders,
            icon: ShoppingBag,
            accent: 'from-purple-500/20 to-purple-500/5 text-purple-700',
        },
        {
            label: t('pending_orders'),
            value: stats.pending_orders,
            icon: ClockIcon,
            accent: 'from-amber-500/20 to-amber-500/5 text-amber-700',
        },
        {
            label: t('delivered_orders'),
            value: stats.delivered_orders,
            icon: CheckIcon,
            accent: 'from-emerald-500/20 to-emerald-500/5 text-emerald-700',
        },
        {
            label: t('total_spent'),
            value: `${stats.total_spent} ${t('total_spent_currency')}`,
            icon: WalletIcon,
            accent: 'from-indigo-500/20 to-indigo-500/5 text-indigo-700',
        },
    ];

    const quickActions = [
        {
            href: '/products',
            label: t('quick_actions_shop'),
            icon: Package,
            accent: 'from-purple-500/20 to-purple-500/5 text-purple-600',
        },
        {
            href: '/orders',
            label: t('quick_actions_orders'),
            icon: ShoppingBag,
            accent: 'from-blue-500/20 to-blue-500/5 text-blue-600',
        },
        {
            href: '/cart',
            label: t('quick_actions_cart'),
            icon: ShoppingCart,
            accent: 'from-emerald-500/20 to-emerald-500/5 text-emerald-600',
        },
        {
            href: '/categories',
            label: t('quick_actions_categories'),
            icon: Grid3X3,
            accent: 'from-amber-500/20 to-amber-500/5 text-amber-600',
        },
    ];

    const statusClasses = {
        pending: 'bg-amber-100 text-amber-800',
        delivered: 'bg-emerald-100 text-emerald-800',
        preparing: 'bg-indigo-100 text-indigo-800',
    };

    const statusLabel = (status) => t(status) || status;

    return (
        <Layout>
            <Head title={t('customer_dashboard')} />

            <div className="relative min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a0e4d] via-[#160b31] to-[#05030f]" />
                <div className="absolute -top-32 -right-40 w-96 h-96 bg-purple-500/40 blur-[200px]" />
                <div className="absolute -bottom-24 -left-32 w-96 h-96 bg-indigo-500/30 blur-[200px]" />

                <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                    <div className="rounded-3xl border border-white/20 bg-white/5 backdrop-blur px-6 py-8 text-white shadow-2xl">
                        <h1 className="text-3xl font-bold">{t('customer_dashboard')}</h1>
                        <p className="text-purple-100 mt-2">{t('dashboard_welcome')}</p>
                    </div>

                    {(flash.success || flash.error) && (
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {statCards.map(({ label, value, icon: Icon, accent }) => (
                            <div
                                key={label}
                                className="rounded-2xl border border-white/40 bg-white/90 p-5 shadow-xl"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">{label}</p>
                                        <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
                                    </div>
                                    <div className={`rounded-2xl bg-gradient-to-br ${accent} p-3`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="rounded-3xl border border-white/40 bg-white/95 shadow-xl">
                            <div className="border-b border-slate-100 px-6 py-5">
                                <h3 className="text-lg font-semibold text-slate-900">{t('recent_orders')}</h3>
                            </div>
                            <div className="p-6">
                                {recentOrders.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentOrders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                                            >
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        #{order.order_number}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {order.store?.name || t('no_orders_text')}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {new Date(order.created_at).toLocaleDateString(dateLocale)}
                                                    </p>
                                                </div>
                                                <div className="text-sm text-right">
                                                    <p className="font-bold text-purple-600">
                                                        {order.total_amount} {t('total_spent_currency')}
                                                    </p>
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                                            statusClasses[order.status] || 'bg-slate-100 text-slate-700'
                                                        }`}
                                                    >
                                                        {statusLabel(order.status)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-slate-500 mb-3">{t('no_recent_orders')}</p>
                                        <Link
                                            href="/products"
                                            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg"
                                        >
                                            {t('start_shopping_cta')}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/40 bg-white/95 shadow-xl">
                            <div className="border-b border-slate-100 px-6 py-5">
                                <h3 className="text-lg font-semibold text-slate-900">{t('favorite_products_title')}</h3>
                            </div>
                            <div className="p-6">
                                {favoriteProducts.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {favoriteProducts.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/products/${product.id}`}
                                                className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center transition hover:border-purple-200 hover:bg-white"
                                            >
                                                <div className="text-2xl mb-2">{product.category?.icon}</div>
                                                <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {product.price} {t('total_spent_currency')}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-slate-500 mb-3">{t('no_favorites')}</p>
                                        <Link
                                            href="/products"
                                            className="inline-flex items-center justify-center rounded-2xl border border-purple-200 bg-white px-5 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50"
                                        >
                                            {t('browse_products_cta')}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/40 bg-white/95 p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('quick_actions')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {quickActions.map(({ href, label, icon: Icon, accent }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className={`flex items-center gap-3 rounded-2xl border border-slate-100 bg-gradient-to-br ${accent} p-4 text-slate-900`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-medium">{label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/40 bg-white/95 p-6 shadow-xl">
                        <div className="flex flex-col gap-3 mb-6">
                            <h3 className="text-lg font-semibold text-slate-900">{t('upgrade_section_title')}</h3>
                            <p className="text-sm text-slate-500">{t('upgrade_section_subtitle')}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5 flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-2xl bg-purple-100 text-purple-700">
                                        <Store className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-base font-semibold text-slate-900">
                                            {t('register_upgrade_store_title')}
                                        </p>
                                        <p className="text-sm text-slate-500">{t('dashboard_upgrade_store_desc')}</p>
                                    </div>
                                </div>
                                    <Link
                                        href="/dashboard/store/setup"
                                        className="mt-auto inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg"
                                    >
                                        {t('upgrade_store_cta')}
                                    </Link>
                            </div>
                            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-base font-semibold text-slate-900">
                                            {t('register_upgrade_driver_title')}
                                        </p>
                                        <p className="text-sm text-slate-500">{t('dashboard_upgrade_driver_desc')}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleUpgrade('driver')}
                                    disabled={upgradeForm.processing}
                                    className="mt-auto inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg disabled:opacity-50"
                                >
                                    {t('upgrade_driver_cta')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AppDownloadSection />
        </Layout>
    );
}

function ClockIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2.5 2.5" />
            <circle cx="12" cy="12" r="9" />
        </svg>
    );
}

function CheckIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}

function WalletIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18v10H3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 12h4" />
        </svg>
    );
}
