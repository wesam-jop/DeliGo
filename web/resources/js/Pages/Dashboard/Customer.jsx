import React from 'react';
import { Link, useForm, router } from '@inertiajs/react';
import { Store, Truck, ShoppingBag, ShoppingCart, Grid3X3, Package } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useGeneralSettings } from '../../hooks/useGeneralSettings';
import CustomerLayout from './CustomerLayout';

export default function CustomerDashboard({ stats, recentOrders, favoriteProducts, driverApplication }) {
    const { t } = useTranslation();
    const { formatCurrency, formatDate } = useGeneralSettings();
    const upgradeForm = useForm({ target_role: '' });

    const statCards = [
        {
            label: t('total_orders'),
            value: stats.total_orders,
            icon: ShoppingBag,
            description: t('track_orders'),
            accent: 'from-purple-500/15 via-purple-500/5 to-white text-purple-600',
        },
        {
            label: t('pending_orders'),
            value: stats.pending_orders,
            icon: ClockIcon,
            description: t('pending'),
            accent: 'from-amber-400/20 via-amber-400/5 to-white text-amber-600',
        },
        {
            label: t('delivered_orders'),
            value: stats.delivered_orders,
            icon: CheckIcon,
            description: t('delivered'),
            accent: 'from-emerald-400/20 via-emerald-400/5 to-white text-emerald-600',
        },
        {
            label: t('total_spent'),
            value: formatCurrency(stats.total_spent),
            icon: WalletIcon,
            description: t('total_spent'),
            accent: 'from-indigo-500/20 via-indigo-500/5 to-white text-indigo-600',
        },
    ];

    const quickActions = [
        { href: '/products', label: t('quick_actions_shop'), icon: Package },
        { href: '/orders', label: t('quick_actions_orders'), icon: ShoppingBag },
        { href: '/cart', label: t('quick_actions_cart'), icon: ShoppingCart },
        { href: '/categories', label: t('quick_actions_categories'), icon: Grid3X3 },
    ];

    const driverStatusMeta = driverApplication
        ? {
              pending: {
                  badge: 'bg-amber-100 text-amber-700',
                  hint: t('driver_application_status_pending_desc'),
                  cta: t('driver_application_view_cta'),
              },
              rejected: {
                  badge: 'bg-rose-100 text-rose-700',
                  hint: driverApplication.notes || t('driver_application_status_rejected_desc'),
                  cta: t('driver_application_resubmit_cta'),
              },
              approved: {
                  badge: 'bg-emerald-100 text-emerald-700',
                  hint: t('driver_application_status_approved_desc'),
                  cta: t('go_to_driver_dashboard'),
              },
          }[driverApplication.status] || null
        : null;

    const statusClasses = {
        pending: 'bg-amber-100 text-amber-800',
        delivered: 'bg-emerald-100 text-emerald-800',
        preparing: 'bg-indigo-100 text-indigo-800',
    };

    const handleUpgrade = (role) => {
        if (role === 'driver') {
            router.get('/dashboard/driver/apply');
            return;
        }

        upgradeForm.setData('target_role', role);
        upgradeForm.post('/dashboard/upgrade-role', { preserveScroll: true });
    };

    return (
        <CustomerLayout title={t('customer_dashboard')}>
            <div className="space-y-8">
                    <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur shadow-sm p-6 space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{t('customer_dashboard')}</p>
                                <h1 className="text-2xl font-bold text-slate-900">{t('dashboard_welcome')}</h1>
                                <p className="text-sm text-slate-500">{t('my_orders')}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/dashboard/customer/profile"
                                    className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-purple-600 shadow-sm hover:bg-purple-50"
                                >
                                    {t('profile')}
                                </Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            {statCards.map(({ label, value, description, icon: Icon, accent }) => (
                                <div
                                    key={label}
                                    className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${accent} p-4 shadow-sm`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
                                            <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
                                            <p className="text-xs text-slate-500 mt-1">{description}</p>
                                        </div>
                                        <div className="rounded-2xl bg-white shadow p-3">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-5 py-4">
                            <h3 className="text-lg font-semibold text-slate-900">{t('recent_orders')}</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            {recentOrders.length ? (
                                recentOrders.map((order) => (
                                    <div key={order.id} className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <p className="font-semibold text-slate-900">#{order.order_number}</p>
                                            <p className="text-sm text-slate-500">{order.store?.name}</p>
                                            <p className="text-xs text-slate-400">{formatDate(order.created_at)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-purple-600">{formatCurrency(order.total_amount)}</p>
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusClasses[order.status] || 'bg-slate-100 text-slate-600'}`}>
                                                {t(order.status) || order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-sm text-slate-500 py-8">
                                    {t('no_recent_orders')}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-5 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">{t('favorite_products_title')}</h3>
                            {favoriteProducts.length > 0 && (
                                <Link
                                    href="/dashboard/customer/favorites"
                                    className="text-sm font-semibold text-purple-600 hover:text-purple-800"
                                >
                                    {t('view_all')}
                                </Link>
                            )}
                        </div>
                        <div className="p-5">
                            {favoriteProducts.length ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {favoriteProducts.map((product) => (
                                        <Link key={product.id} href={`/products/${product.id}`} className="rounded-xl border border-slate-200 p-4 hover:border-purple-200 hover:bg-purple-50/50 transition">
                                            <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                                            <p className="text-xs text-slate-500">{formatCurrency(product.price)}</p>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-sm text-slate-500 py-8">
                                    {t('no_favorites')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900">{t('quick_actions')}</h3>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{t('quick_actions')}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={label}
                                href={href}
                                className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 px-4 py-4 shadow-sm hover:border-purple-200 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-purple-50 text-purple-600 p-2">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{label}</p>
                                        <p className="text-xs text-slate-500">{t('click_to_open') || ''}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-white text-purple-600 shadow">
                                <Store className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-base font-semibold text-slate-900">{t('register_upgrade_store_title')}</p>
                                <p className="text-sm text-slate-600">{t('dashboard_upgrade_store_desc')}</p>
                            </div>
                        </div>
                        <Link href="/dashboard/store/setup" className="mt-auto inline-flex items-center justify-center rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700">
                            {t('upgrade_store_cta')}
                        </Link>
                    </div>
                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-white text-blue-600 shadow">
                                <Truck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-base font-semibold text-slate-900">{t('register_upgrade_driver_title')}</p>
                                <p className="text-sm text-slate-600">{t('dashboard_upgrade_driver_desc')}</p>
                                {driverStatusMeta && (
                                    <span className={`inline-flex items-center mt-2 rounded-full px-3 py-1 text-xs font-semibold ${driverStatusMeta.badge}`}>
                                        {t(driverApplication.status)}
                                    </span>
                                )}
                            </div>
                        </div>
                        {driverStatusMeta && (
                            <p className="text-xs text-slate-500 border border-dashed border-blue-200 rounded-xl bg-white/40 px-3 py-2">
                                {driverStatusMeta.hint}
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={() => handleUpgrade('driver')}
                            disabled={upgradeForm.processing}
                            className="mt-auto inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-50"
                        >
                            {driverStatusMeta?.cta || t('upgrade_driver_cta')}
                        </button>
                    </div>
                </div>
            </div>
        </CustomerLayout>
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
