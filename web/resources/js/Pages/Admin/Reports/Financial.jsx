import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import { 
    DollarSign, 
    TrendingUp,
    TrendingDown,
    Download,
    RefreshCw,
    Eye,
    ArrowUpRight,
    ShoppingCart,
    Calendar,
    BarChart3,
    PieChart,
    CreditCard,
    Wallet,
    Banknote,
    Receipt,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';

export default function Financial({ 
    stats, 
    dailyRevenue, 
    monthlyRevenue, 
    revenueByPaymentMethod, 
    revenueByPaymentStatus,
    topRevenueDays,
    recentTransactions,
    refundedOrders,
    refundedAmount,
    timeRange: initialTimeRange
}) {
    const { t } = useTranslation();
    const [timeRange, setTimeRange] = useState(initialTimeRange || '30d');

    const formatCurrency = (amount) => {
        return parseFloat(amount || 0).toFixed(2);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar-SA', {
            month: 'short',
            day: 'numeric'
        });
    };

    const formatMonth = (year, month) => {
        const date = new Date(year, month - 1, 1);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long'
        });
    };

    const handleTimeRangeChange = (newRange) => {
        setTimeRange(newRange);
        router.get('/admin/reports/financial', { range: newRange }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getPaymentMethodLabel = (method) => {
        const labels = {
            cash: t('cash') || 'Cash',
            card: t('card') || 'Card',
            wallet: t('wallet') || 'Wallet',
        };
        return labels[method] || method;
    };

    const getPaymentMethodIcon = (method) => {
        switch(method) {
            case 'cash':
                return <Banknote className="w-4 h-4" />;
            case 'card':
                return <CreditCard className="w-4 h-4" />;
            case 'wallet':
                return <Wallet className="w-4 h-4" />;
            default:
                return <Receipt className="w-4 h-4" />;
        }
    };

    const getPaymentStatusLabel = (status) => {
        const labels = {
            paid: t('paid') || 'Paid',
            pending: t('pending') || 'Pending',
            failed: t('failed') || 'Failed',
            refunded: t('refunded') || 'Refunded',
        };
        return labels[status] || status;
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            paid: 'bg-green-100 text-green-700 border-green-200',
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            failed: 'bg-red-100 text-red-700 border-red-200',
            refunded: 'bg-orange-100 text-orange-700 border-orange-200',
        };
        return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
    };

    return (
        <AdminLayout title={t('financial_reports') || 'Financial Reports'}>
            <Head title={t('financial_reports') || 'Financial Reports'} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">{t('financial_reports') || 'Financial Reports'}</h2>
                        <p className="text-slate-600 mt-2">{t('comprehensive_financial_analysis') || 'Comprehensive financial analysis and revenue insights'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={timeRange}
                            onChange={(e) => handleTimeRangeChange(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="7d">{t('last_7_days') || 'Last 7 Days'}</option>
                            <option value="30d">{t('last_30_days') || 'Last 30 Days'}</option>
                            <option value="90d">{t('last_90_days') || 'Last 90 Days'}</option>
                            <option value="12m">{t('last_12_months') || 'Last 12 Months'}</option>
                        </select>
                        <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm">
                            <Download className="w-4 h-4" />
                            <span className="font-medium">{t('export') || 'Export'}</span>
                        </button>
                        <button 
                            onClick={() => handleTimeRangeChange(timeRange)}
                            className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span className="font-medium">{t('refresh') || 'Refresh'}</span>
                        </button>
                    </div>
                </div>

                {/* Main Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm border border-emerald-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-700">{t('total_revenue') || 'Total Revenue'}</p>
                                <p className="text-3xl font-bold text-emerald-900 mt-2">
                                    {formatCurrency(stats?.total_revenue)}
                                </p>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="text-xs text-green-600 font-medium">+15.3%</span>
                                    <span className="text-xs text-slate-500">{t('vs_last_period') || 'vs last period'}</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <DollarSign className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700">{t('net_profit') || 'Net Profit'}</p>
                                <p className="text-3xl font-bold text-blue-900 mt-2">
                                    {formatCurrency(stats?.net_profit)}
                                </p>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="text-xs text-green-600 font-medium">+8.2%</span>
                                    <span className="text-xs text-slate-500">{t('vs_last_period') || 'vs last period'}</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-700">{t('total_orders') || 'Total Orders'}</p>
                                <p className="text-3xl font-bold text-purple-900 mt-2">{stats?.total_orders || 0}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="text-xs text-green-600 font-medium">+9.1%</span>
                                    <span className="text-xs text-slate-500">{t('vs_last_period') || 'vs last period'}</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <ShoppingCart className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-700">{t('refunded_amount') || 'Refunded'}</p>
                                <p className="text-3xl font-bold text-red-900 mt-2">
                                    {formatCurrency(refundedAmount)}
                                </p>
                                <p className="text-xs text-red-600 mt-1">{t('total_refunds') || 'Total refunds'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <XCircle className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('subtotal') || 'Subtotal'}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats?.total_subtotal)}</p>
                            </div>
                            <Receipt className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('delivery_fees') || 'Delivery Fees'}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats?.total_delivery_fees)}</p>
                            </div>
                            <ShoppingCart className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('tax') || 'Tax'}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats?.total_tax)}</p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('discounts') || 'Discounts'}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats?.total_discounts)}</p>
                            </div>
                            <TrendingDown className="w-8 h-8 text-orange-600" />
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Daily Revenue Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{t('daily_revenue') || 'Daily Revenue'}</h3>
                                <p className="text-sm text-slate-500">{t('revenue_trend') || 'Revenue trend over time'}</p>
                            </div>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-1">
                            {dailyRevenue && dailyRevenue.length > 0 ? (
                                dailyRevenue.map((day, index) => {
                                    const maxRevenue = Math.max(...dailyRevenue.map(d => parseFloat(d.revenue || 0)));
                                    const height = maxRevenue > 0 ? ((parseFloat(day.revenue || 0) / maxRevenue) * 100) : 0;
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="w-full bg-slate-100 rounded-t-lg relative group cursor-pointer" style={{ height: `${height}%` }}>
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    {formatCurrency(day.revenue)}<br />
                                                    {day.orders_count || 0} {t('orders') || 'orders'}
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-500 transform -rotate-45 origin-top-left whitespace-nowrap">
                                                {formatDate(day.date)}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <p>{t('no_data_available') || 'No data available'}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Monthly Revenue Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{t('monthly_revenue') || 'Monthly Revenue'}</h3>
                                <p className="text-sm text-slate-500">{t('last_12_months') || 'Last 12 months'}</p>
                            </div>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {monthlyRevenue && monthlyRevenue.length > 0 ? (
                                monthlyRevenue.map((month, index) => {
                                    const maxRevenue = Math.max(...monthlyRevenue.map(m => parseFloat(m.revenue || 0)));
                                    const height = maxRevenue > 0 ? ((parseFloat(month.revenue || 0) / maxRevenue) * 100) : 0;
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="w-full bg-slate-100 rounded-t-lg relative group cursor-pointer" style={{ height: `${height}%` }}>
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    {formatCurrency(month.revenue)}<br />
                                                    {month.orders_count || 0} {t('orders') || 'orders'}
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-500 transform -rotate-45 origin-top-left whitespace-nowrap">
                                                {formatMonth(month.year, month.month)}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <p>{t('no_data_available') || 'No data available'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Revenue by Payment Method & Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue by Payment Method */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{t('revenue_by_payment_method') || 'Revenue by Payment Method'}</h3>
                                <p className="text-sm text-slate-500">{t('breakdown_by_method') || 'Breakdown by payment method'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {revenueByPaymentMethod && revenueByPaymentMethod.length > 0 ? (
                                revenueByPaymentMethod.map((item) => (
                                    <div key={item.payment_method} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                                                {getPaymentMethodIcon(item.payment_method)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{getPaymentMethodLabel(item.payment_method)}</p>
                                                <p className="text-xs text-slate-500">{item.orders_count || 0} {t('orders') || 'orders'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-emerald-700">{formatCurrency(item.revenue)}</p>
                                            <p className="text-xs text-slate-500">
                                                {((parseFloat(item.revenue || 0) / parseFloat(stats?.total_revenue || 1)) * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-slate-400 py-8">
                                    <p>{t('no_data_available') || 'No data available'}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Revenue by Payment Status */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{t('revenue_by_payment_status') || 'Revenue by Payment Status'}</h3>
                                <p className="text-sm text-slate-500">{t('breakdown_by_status') || 'Breakdown by payment status'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {revenueByPaymentStatus && revenueByPaymentStatus.length > 0 ? (
                                revenueByPaymentStatus.map((item) => (
                                    <div key={item.payment_status} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getPaymentStatusColor(item.payment_status)}`}>
                                                {getPaymentStatusLabel(item.payment_status)}
                                            </span>
                                            <p className="text-xs text-slate-500">{item.orders_count || 0} {t('orders') || 'orders'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-bold ${
                                                item.payment_status === 'paid' ? 'text-emerald-700' :
                                                item.payment_status === 'refunded' ? 'text-red-700' :
                                                'text-slate-700'
                                            }`}>
                                                {formatCurrency(item.revenue)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-slate-400 py-8">
                                    <p>{t('no_data_available') || 'No data available'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Top Revenue Days */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{t('top_revenue_days') || 'Top Revenue Days'}</h3>
                            <p className="text-sm text-slate-500">{t('best_performing_days') || 'Best performing days'}</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('date') || 'Date'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('orders') || 'Orders'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('revenue') || 'Revenue'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {topRevenueDays && topRevenueDays.length > 0 ? (
                                    topRevenueDays.map((day, index) => (
                                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                        {index + 1}
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-900">{formatDate(day.date)}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-bold text-slate-900">{day.orders_count || 0}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-bold text-emerald-700">{formatCurrency(day.revenue)}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-8 text-center text-slate-400">
                                            {t('no_data_available') || 'No data available'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{t('recent_transactions') || 'Recent Transactions'}</h3>
                            <p className="text-sm text-slate-500">{t('latest_financial_transactions') || 'Latest financial transactions'}</p>
                        </div>
                        <Link
                            href="/admin/orders"
                            className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                        >
                            {t('view_all') || 'View All'}
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('order') || 'Order'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('customer') || 'Customer'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('payment_method') || 'Payment Method'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('payment_status') || 'Status'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('amount') || 'Amount'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('date') || 'Date'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('actions') || 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentTransactions && recentTransactions.length > 0 ? (
                                    recentTransactions.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-semibold text-slate-900">{order.order_number || `#${order.id}`}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-slate-700">{order.user?.name || '-'}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {getPaymentMethodIcon(order.payment_method)}
                                                    <span className="text-sm text-slate-700">{getPaymentMethodLabel(order.payment_method)}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                                                    {getPaymentStatusLabel(order.payment_status)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-bold text-emerald-700">{formatCurrency(order.total_amount)}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-slate-600">
                                                    {new Date(order.created_at).toLocaleDateString('ar-SA', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-8 text-center text-slate-400">
                                            {t('no_transactions_found') || 'No transactions found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Refunded Orders */}
                {refundedOrders && refundedOrders.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-red-900">{t('refunded_orders') || 'Refunded Orders'}</h3>
                                <p className="text-sm text-red-600">{t('orders_with_refunds') || 'Orders with refunds'}</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-red-50 border-b border-red-200">
                                    <tr>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-red-700 uppercase">{t('order') || 'Order'}</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-red-700 uppercase">{t('customer') || 'Customer'}</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-red-700 uppercase">{t('amount') || 'Amount'}</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-red-700 uppercase">{t('date') || 'Date'}</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-red-700 uppercase">{t('actions') || 'Actions'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-red-100">
                                    {refundedOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-red-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-semibold text-red-900">{order.order_number || `#${order.id}`}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-red-700">{order.user?.name || '-'}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-bold text-red-700">{formatCurrency(order.total_amount)}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-red-600">
                                                    {new Date(order.created_at).toLocaleDateString('ar-SA', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

