import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import StoreLayout from './StoreLayout';
import { useTranslation } from '../../hooks/useTranslation';
import { useGeneralSettings } from '../../hooks/useGeneralSettings';
import { ShoppingBag, Store as StoreIcon, ArrowRight } from 'lucide-react';

export default function StoreMyOrders({ orders, filters }) {
    const { t } = useTranslation();
    const { formatCurrency, formatDate, formatTime } = useGeneralSettings();

    const statusOptions = [
        { value: 'all', label: t('all') || 'All' },
        { value: 'pending', label: t('pending') },
        { value: 'confirmed', label: t('confirmed') },
        { value: 'preparing', label: t('preparing') },
        { value: 'ready', label: t('ready_for_delivery') || t('ready') || 'Ready' },
        { value: 'on_delivery', label: t('on_delivery') },
        { value: 'delivered', label: t('delivered') },
        { value: 'cancelled', label: t('cancelled') },
    ];

    const statusClasses = {
        pending: 'bg-amber-100 text-amber-700',
        confirmed: 'bg-blue-100 text-blue-700',
        preparing: 'bg-indigo-100 text-indigo-700',
        ready: 'bg-slate-100 text-slate-700',
        ready_for_delivery: 'bg-slate-100 text-slate-700',
        on_delivery: 'bg-orange-100 text-orange-700',
        out_for_delivery: 'bg-orange-100 text-orange-700',
        delivered: 'bg-emerald-100 text-emerald-700',
        cancelled: 'bg-rose-100 text-rose-700',
    };

    return (
        <StoreLayout
            title={t('my_orders') || t('orders_page_title') || 'My orders'}
            subtitle={t('orders_page_subtitle') || 'Track the orders you placed as a customer.'}
        >
            <Head title={t('my_orders') || 'My orders'} />

            <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            {t('orders_page_subtitle') || 'Latest updates on your personal orders.'}
                        </p>
                        <p className="text-xs text-slate-500">
                            {t('store_orders_filter_hint') || 'Filter to see a specific status.'}
                        </p>
                    </div>
                    <select
                        value={filters?.status || 'all'}
                        onChange={(event) => {
                            const value = event.target.value;
                            router.get('/dashboard/store/my-orders', value === 'all' ? {} : { status: value }, { preserveState: true, replace: true });
                        }}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-4">
                    {orders.data.length ? (
                        orders.data.map((order) => (
                            <div
                                key={order.id}
                                className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-4"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                            <ShoppingBag className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                                                {t('order_number')}
                                            </p>
                                            <p className="text-xl font-semibold text-slate-900">{order.order_number}</p>
                                        </div>
                                    </div>
                                    <span
                                        className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold ${
                                            statusClasses[order.status] || 'bg-slate-100 text-slate-700'
                                        }`}
                                    >
                                        {t(order.status) || order.status}
                                    </span>
                                </div>
                                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-white text-purple-600 flex items-center justify-center border border-slate-100">
                                            <StoreIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-slate-400">{t('store')}</p>
                                            <p className="text-base font-semibold text-slate-900">{order.store?.name}</p>
                                            <p className="text-xs text-slate-500">{order.store?.address}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs uppercase tracking-widest text-slate-400">{t('total')}</p>
                                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(order.total_amount)}</p>
                                        <p className="text-xs text-slate-500">
                                            {formatDate(order.created_at)} · {formatTime(order.created_at)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <Link
                                        href={`/orders/${order.id}`}
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800"
                                    >
                                        {t('view_details')}
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    {order.can_cancel && (
                                        <Link
                                            href={`/orders/${order.id}/cancel`}
                                            method="post"
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700"
                                        >
                                            {t('cancel_order_button')}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center space-y-3">
                            <p className="text-lg font-semibold text-slate-900">
                                {t('orders_empty_title') || 'No orders yet'}
                            </p>
                            <p className="text-sm text-slate-500 max-w-md mx-auto">
                                {t('orders_empty_description') || 'Start shopping to see your orders history here.'}
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-2xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow"
                            >
                                {t('start_shopping') || 'Start shopping'}
                            </Link>
                        </div>
                    )}
                </div>

                {orders.links && orders.links.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                        {orders.links.map((link, index) => (
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
        </StoreLayout>
    );
}

