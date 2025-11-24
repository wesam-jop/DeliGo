import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Truck, 
    Package, 
    Clock, 
    DollarSign,
    MapPin,
    Phone,
    CheckCircle,
    AlertCircle,
    Star
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import DriverLayout from './DriverLayout';

export default function DriverDashboard({ stats, assignedOrders, availableOrders }) {
    const { t } = useTranslation();
    const statCards = [
        { 
            label: t('driver_total_deliveries') || 'Total Deliveries', 
            value: stats.total_deliveries || 0, 
            icon: Truck,
            accent: 'from-blue-500/20 to-blue-500/5 text-blue-700'
        },
        { 
            label: t('driver_pending_deliveries') || 'Active Deliveries', 
            value: stats.pending_deliveries || 0, 
            icon: Clock,
            accent: 'from-amber-500/20 to-amber-500/5 text-amber-700'
        },
        { 
            label: t('driver_completed_deliveries') || 'Completed', 
            value: stats.completed_deliveries || 0, 
            icon: CheckCircle,
            accent: 'from-emerald-500/20 to-emerald-500/5 text-emerald-700'
        },
        { 
            label: t('driver_total_earnings') || 'Total Earnings', 
            value: `${stats.total_earnings || 0} ${t('currency') || 'SYP'}`, 
            icon: DollarSign,
            accent: 'from-purple-500/20 to-purple-500/5 text-purple-700'
        },
    ];

    return (
        <DriverLayout title={t('driver_dashboard')} subtitle={t('driver_intro') || ''}>
            <Head title={t('driver_dashboard')} />

            <div className="space-y-8">
                <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {statCards.map(({ label, value, icon: Icon, accent }) => (
                            <div key={label} className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${accent} p-4 shadow-sm`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
                                        <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
                                    </div>
                                    <div className="rounded-2xl bg-white shadow p-3 text-blue-600">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
                            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">{t('today_deliveries') || 'Today'}</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.today_deliveries ?? 0}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
                            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">{t('this_week') || 'This Week'}</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.this_week_deliveries ?? 0}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
                            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">{t('this_month_earnings') || 'This Month'}</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.this_month_earnings ?? 0} {t('currency') || 'SYP'}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-blue-600" />
                                {t('available_orders') || 'Available Orders'}
                            </h3>
                            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">{availableOrders.length}</span>
                        </div>
                        <div className="p-6 space-y-4">
                                {availableOrders.length > 0 ? (
                                availableOrders.map((order) => (
                                    <div key={order.id} className="rounded-2xl border border-slate-200 p-4 hover:border-blue-200 hover:shadow-sm transition">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-semibold text-slate-900">#{order.order_number}</h4>
                                                <p className="text-sm text-slate-500">{order.store?.name}</p>
                                            </div>
                                            <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                                {t('pending_driver_approval') || 'في انتظار الموافقة'}
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-slate-600">
                                            {order.customer_name && (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-slate-900">{order.customer_name}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-slate-400" />
                                                <span className="flex-1">{order.delivery_address}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-slate-400" />
                                                <a href={`tel:${order.customer_phone}`} className="text-blue-600 hover:underline">{order.customer_phone}</a>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-slate-400" />
                                                <span className="font-semibold">{order.total_amount} {t('currency') || 'SYP'}</span>
                                            </div>
                                        </div>
                                        {order.stores && order.stores.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-slate-200">
                                                <div className="text-xs text-slate-500 mb-2">
                                                    {order.stores.length > 1 
                                                        ? `${order.stores.length} ${t('stores') || 'متاجر'}` 
                                                        : t('store') || 'متجر'}
                                                </div>
                                                {order.stores.map((store, idx) => (
                                                    <div key={idx} className="text-xs text-slate-600 mb-1 flex items-center gap-1">
                                                        <Package className="w-3 h-3 text-blue-600" />
                                                        <span>{store.name}</span>
                                                        {store.status && (
                                                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                                                store.status === 'store_approved' ? 'bg-emerald-100 text-emerald-700' :
                                                                store.status === 'store_preparing' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-amber-100 text-amber-700'
                                                            }`}>
                                                                {store.status === 'store_approved' ? t('approved') || 'موافق' :
                                                                store.status === 'store_preparing' ? t('preparing') || 'قيد التحضير' :
                                                                t('pending') || 'في الانتظار'}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={() => router.post(`/dashboard/driver/orders/${order.id}/accept`, {}, { preserveScroll: true })}
                                                className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                            >
                                                {t('accept_order') || 'قبول الطلب'}
                                            </button>
                                            <button
                                                onClick={() => router.post(`/dashboard/driver/orders/${order.id}/reject`, {}, { preserveScroll: true })}
                                                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                            >
                                                {t('reject_order') || 'رفض'}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-500">
                                    <Package className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                                    {t('no_available_orders') || 'No orders right now'}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                            <Truck className="w-5 h-5 text-emerald-600" />
                            <h3 className="text-lg font-semibold text-slate-900">{t('assigned_orders') || 'Assigned Orders'}</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {assignedOrders.length > 0 ? (
                                assignedOrders.map((order) => (
                                    <div key={order.id} className="rounded-2xl border border-slate-200 p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-semibold text-slate-900">#{order.order_number}</h4>
                                                <p className="text-sm text-slate-500">{order.store?.name}</p>
                                            </div>
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                order.status === 'out_for_delivery' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                                {order.status === 'out_for_delivery' ? t('out_for_delivery') : t('delivered')}
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-slate-600">
                                            {order.customer_name && (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-slate-900">{order.customer_name}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-slate-400" />
                                                <span className="flex-1">{order.delivery_address}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-slate-400" />
                                                <a href={`tel:${order.customer_phone}`} className="text-blue-600 hover:underline">{order.customer_phone}</a>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-slate-400" />
                                                <span className="font-semibold">{order.total_amount} {t('currency') || 'SYP'}</span>
                                            </div>
                                        </div>
                                        {order.stores && order.stores.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-slate-200">
                                                <div className="text-xs text-slate-500 mb-2">
                                                    {order.stores.length > 1 
                                                        ? `${order.stores.length} ${t('stores') || 'متاجر'}` 
                                                        : t('store') || 'متجر'}
                                                </div>
                                                {order.stores.map((store, idx) => (
                                                    <div key={idx} className="text-xs text-slate-600 mb-1">
                                                        <Package className="w-3 h-3 text-blue-600 inline mr-1" />
                                                        <span>{store.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {(order.status === 'driver_picked_up' || order.status === 'out_for_delivery') && (
                                            <button 
                                                onClick={() => router.post(`/dashboard/driver/orders/${order.id}/complete`, {}, { preserveScroll: true })}
                                                className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                                            >
                                                {t('confirm_delivery') || 'Confirm delivery'}
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-500">
                                    <Truck className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                                    {t('no_assigned_orders') || 'No assigned orders yet'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('quick_actions')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-blue-200">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            {t('update_location') || 'Update location'}
                        </button>
                        <button className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-blue-200">
                            <Clock className="w-5 h-5 text-amber-500" />
                            {t('change_status') || 'Change status'}
                        </button>
                        <button className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-blue-200">
                            <Star className="w-5 h-5 text-purple-500" />
                            {t('view_ratings') || 'View ratings'}
                        </button>
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
}
