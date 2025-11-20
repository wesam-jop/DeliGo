import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import { 
    Truck, 
    Clock,
    TrendingUp,
    TrendingDown,
    Download,
    RefreshCw,
    Eye,
    ArrowUpRight,
    Package,
    DollarSign,
    Calendar,
    BarChart3,
    Activity,
    MapPin,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';

export default function Delivery({ 
    stats, 
    dailyDeliveries, 
    monthlyDeliveries, 
    topDriversByDeliveries, 
    deliveriesByStatus,
    deliveryTimeDistribution,
    recentDeliveries,
    driverStatusDistribution,
    timeRange: initialTimeRange
}) {
    const { t } = useTranslation();
    const [timeRange, setTimeRange] = useState(initialTimeRange || '30d');

    const formatCurrency = (amount) => {
        return parseFloat(amount || 0).toFixed(2);
    };

    const formatTime = (minutes) => {
        if (!minutes) return '-';
        const hours = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
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
        router.get('/admin/analytics/delivery', { range: newRange }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            out_for_delivery: 'bg-orange-100 text-orange-700 border-orange-200',
            delivered: 'bg-green-100 text-green-700 border-green-200',
            cancelled: 'bg-red-100 text-red-700 border-red-200',
        };
        return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
    };

    const getStatusLabel = (status) => {
        const labels = {
            out_for_delivery: t('on_delivery') || 'On Delivery',
            delivered: t('delivered') || 'Delivered',
            cancelled: t('cancelled') || 'Cancelled',
        };
        return labels[status] || status;
    };

    return (
        <AdminLayout title={t('delivery_analytics') || 'Delivery Analytics'}>
            <Head title={t('delivery_analytics') || 'Delivery Analytics'} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">{t('delivery_analytics') || 'Delivery Analytics'}</h2>
                        <p className="text-slate-600 mt-2">{t('detailed_delivery_performance') || 'Detailed delivery performance and driver analytics'}</p>
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
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-700">{t('total_deliveries') || 'Total Deliveries'}</p>
                                <p className="text-3xl font-bold text-green-900 mt-2">{stats?.total_deliveries || 0}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="text-xs text-green-600 font-medium">+12.5%</span>
                                    <span className="text-xs text-slate-500">{t('vs_last_period') || 'vs last period'}</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Package className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-700">{t('pending_deliveries') || 'Pending Deliveries'}</p>
                                <p className="text-3xl font-bold text-orange-900 mt-2">{stats?.pending_deliveries || 0}</p>
                                <p className="text-xs text-orange-600 mt-1">{t('in_transit') || 'In transit'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Truck className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700">{t('average_delivery_time') || 'Avg Delivery Time'}</p>
                                <p className="text-3xl font-bold text-blue-900 mt-2">{formatTime(stats?.average_delivery_time)}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingDown className="w-4 h-4 text-green-600" />
                                    <span className="text-xs text-green-600 font-medium">-5.2%</span>
                                    <span className="text-xs text-slate-500">{t('vs_last_period') || 'vs last period'}</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Clock className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-700">{t('total_delivery_fees') || 'Delivery Fees'}</p>
                                <p className="text-3xl font-bold text-purple-900 mt-2">{formatCurrency(stats?.total_delivery_fees)}</p>
                                <p className="text-xs text-purple-600 mt-1">{t('collected_fees') || 'Collected fees'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <DollarSign className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('active_drivers') || 'Active Drivers'}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.active_drivers || 0}</p>
                                <p className="text-xs text-slate-500 mt-1">{t('currently_available') || 'Currently available'}</p>
                            </div>
                            <Truck className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('total_drivers') || 'Total Drivers'}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.total_drivers || 0}</p>
                                <p className="text-xs text-slate-500 mt-1">{t('registered_drivers') || 'Registered drivers'}</p>
                            </div>
                            <Activity className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Daily Deliveries Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{t('daily_deliveries') || 'Daily Deliveries'}</h3>
                                <p className="text-sm text-slate-500">{t('deliveries_per_day') || 'Deliveries per day'}</p>
                            </div>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-1">
                            {dailyDeliveries && dailyDeliveries.length > 0 ? (
                                dailyDeliveries.map((day, index) => {
                                    const maxCount = Math.max(...dailyDeliveries.map(d => d.deliveries_count || 0));
                                    const height = maxCount > 0 ? ((day.deliveries_count || 0) / maxCount * 100) : 0;
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="w-full bg-slate-100 rounded-t-lg relative group cursor-pointer" style={{ height: `${height}%` }}>
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    {day.deliveries_count || 0} {t('deliveries') || 'deliveries'}<br />
                                                    {formatCurrency(day.delivery_fees)} {t('fees') || 'fees'}
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

                    {/* Monthly Deliveries Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{t('monthly_deliveries') || 'Monthly Deliveries'}</h3>
                                <p className="text-sm text-slate-500">{t('last_12_months') || 'Last 12 months'}</p>
                            </div>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {monthlyDeliveries && monthlyDeliveries.length > 0 ? (
                                monthlyDeliveries.map((month, index) => {
                                    const maxCount = Math.max(...monthlyDeliveries.map(m => m.deliveries_count || 0));
                                    const height = maxCount > 0 ? ((month.deliveries_count || 0) / maxCount * 100) : 0;
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="w-full bg-slate-100 rounded-t-lg relative group cursor-pointer" style={{ height: `${height}%` }}>
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    {month.deliveries_count || 0} {t('deliveries') || 'deliveries'}<br />
                                                    {formatTime(month.avg_delivery_time)} {t('avg_time') || 'avg time'}
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

                {/* Delivery Time Distribution & Driver Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Delivery Time Distribution */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{t('delivery_time_distribution') || 'Delivery Time Distribution'}</h3>
                                <p className="text-sm text-slate-500">{t('time_taken_for_deliveries') || 'Time taken for deliveries'}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 rounded-xl bg-green-50 border border-green-200">
                                <p className="text-2xl font-bold text-green-900">{deliveryTimeDistribution?.under_30_min || 0}</p>
                                <p className="text-xs text-green-600 mt-1">&lt; 30 {t('minutes') || 'min'}</p>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-blue-50 border border-blue-200">
                                <p className="text-2xl font-bold text-blue-900">{deliveryTimeDistribution?.['30_to_60_min'] || 0}</p>
                                <p className="text-xs text-blue-600 mt-1">30-60 {t('minutes') || 'min'}</p>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-orange-50 border border-orange-200">
                                <p className="text-2xl font-bold text-orange-900">{deliveryTimeDistribution?.['60_to_90_min'] || 0}</p>
                                <p className="text-xs text-orange-600 mt-1">60-90 {t('minutes') || 'min'}</p>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-red-50 border border-red-200">
                                <p className="text-2xl font-bold text-red-900">{deliveryTimeDistribution?.over_90_min || 0}</p>
                                <p className="text-xs text-red-600 mt-1">&gt; 90 {t('minutes') || 'min'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Driver Status Distribution */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{t('driver_status') || 'Driver Status'}</h3>
                                <p className="text-sm text-slate-500">{t('current_driver_availability') || 'Current driver availability'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-sm font-semibold text-green-900">{t('available') || 'Available'}</span>
                                </div>
                                <span className="text-xl font-bold text-green-900">{driverStatusDistribution?.available || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50 border border-orange-200">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-orange-600" />
                                    <span className="text-sm font-semibold text-orange-900">{t('busy') || 'Busy'}</span>
                                </div>
                                <span className="text-xl font-bold text-orange-900">{driverStatusDistribution?.busy || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <div className="flex items-center gap-3">
                                    <XCircle className="w-5 h-5 text-slate-600" />
                                    <span className="text-sm font-semibold text-slate-900">{t('offline') || 'Offline'}</span>
                                </div>
                                <span className="text-xl font-bold text-slate-900">{driverStatusDistribution?.offline || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Drivers by Deliveries */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{t('top_drivers_by_deliveries') || 'Top Drivers by Deliveries'}</h3>
                            <p className="text-sm text-slate-500">{t('most_active_drivers') || 'Most active drivers'}</p>
                        </div>
                        <Link
                            href="/admin/users/drivers"
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
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('driver') || 'Driver'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('phone') || 'Phone'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('deliveries') || 'Deliveries'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('delivery_fees') || 'Delivery Fees'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('rating') || 'Rating'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('status') || 'Status'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {topDriversByDeliveries && topDriversByDeliveries.length > 0 ? (
                                    topDriversByDeliveries.map((driver, index) => (
                                        <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">{driver.name}</p>
                                                        {driver.vehicle_type && (
                                                            <p className="text-xs text-slate-500">{driver.vehicle_type}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-slate-700">{driver.phone || '-'}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm font-bold text-slate-900">{driver.delivered_count || 0}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-bold text-emerald-700">{formatCurrency(driver.total_delivery_fees)}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-bold text-amber-700">{parseFloat(driver.rating || 0).toFixed(1)}</span>
                                                    <span className="text-xs text-slate-500">★</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                                    driver.status === 'available' ? 'bg-green-100 text-green-700' :
                                                    driver.status === 'busy' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {driver.status === 'available' ? (t('available') || 'Available') :
                                                     driver.status === 'busy' ? (t('busy') || 'Busy') :
                                                     (t('offline') || 'Offline')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-8 text-center text-slate-400">
                                            {t('no_drivers_found') || 'No drivers found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Deliveries */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{t('recent_deliveries') || 'Recent Deliveries'}</h3>
                            <p className="text-sm text-slate-500">{t('latest_completed_deliveries') || 'Latest completed deliveries'}</p>
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
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('driver') || 'Driver'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('delivery_address') || 'Address'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('delivered_at') || 'Delivered At'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('actions') || 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentDeliveries && recentDeliveries.length > 0 ? (
                                    recentDeliveries.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-semibold text-slate-900">{order.order_number || `#${order.id}`}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-slate-700">{order.user?.name || '-'}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-slate-700">{order.delivery_driver?.name || '-'}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm text-slate-600 truncate max-w-xs">{order.delivery_address || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-slate-600">
                                                    {order.delivered_at ? new Date(order.delivered_at).toLocaleDateString('ar-SA', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : '-'}
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
                                        <td colSpan="6" className="px-4 py-8 text-center text-slate-400">
                                            {t('no_deliveries_found') || 'No deliveries found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

