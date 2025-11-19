import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import { 
    Users, 
    UserPlus,
    UserCheck,
    Crown,
    TrendingUp,
    TrendingDown,
    Download,
    RefreshCw,
    Eye,
    ArrowUpRight,
    ShoppingCart,
    DollarSign,
    Calendar,
    BarChart3,
    PieChart,
    Activity,
    Star
} from 'lucide-react';

export default function Customers({ 
    stats, 
    dailyCustomerGrowth, 
    monthlyCustomerGrowth, 
    topCustomersByOrders, 
    topCustomersByRevenue,
    customerDistribution,
    newCustomers,
    activeCustomers,
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
        router.get('/admin/analytics/customers', { range: newRange }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title={t('customer_analytics') || 'Customer Analytics'}>
            <Head title={t('customer_analytics') || 'Customer Analytics'} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">{t('customer_analytics') || 'Customer Analytics'}</h2>
                        <p className="text-slate-600 mt-2">{t('detailed_customer_insights') || 'Detailed customer insights and behavior analytics'}</p>
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
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700">{t('total_customers') || 'Total Customers'}</p>
                                <p className="text-3xl font-bold text-blue-900 mt-2">{stats?.total_customers || 0}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="text-xs text-green-600 font-medium">+12.5%</span>
                                    <span className="text-xs text-slate-500">{t('vs_last_period') || 'vs last period'}</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-700">{t('new_customers') || 'New Customers'}</p>
                                <p className="text-3xl font-bold text-green-900 mt-2">{stats?.new_customers || 0}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="text-xs text-green-600 font-medium">+8.2%</span>
                                    <span className="text-xs text-slate-500">{t('vs_last_period') || 'vs last period'}</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <UserPlus className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-700">{t('active_customers') || 'Active Customers'}</p>
                                <p className="text-3xl font-bold text-purple-900 mt-2">{stats?.active_customers || 0}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="text-xs text-green-600 font-medium">+5.7%</span>
                                    <span className="text-xs text-slate-500">{t('vs_last_period') || 'vs last period'}</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <UserCheck className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-sm border border-amber-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-amber-700">{t('vip_customers') || 'VIP Customers'}</p>
                                <p className="text-3xl font-bold text-amber-900 mt-2">{stats?.vip_customers || 0}</p>
                                <p className="text-xs text-amber-600 mt-1">{t('high_value_customers') || 'High value customers'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Crown className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('total_customer_revenue') || 'Total Customer Revenue'}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats?.total_customer_revenue)}</p>
                                <p className="text-xs text-slate-500 mt-1">{t('revenue_from_customers') || 'Revenue from customers'}</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-emerald-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('average_customer_value') || 'Avg Customer Value'}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats?.average_customer_value)}</p>
                                <p className="text-xs text-slate-500 mt-1">{t('average_spending') || 'Average spending per customer'}</p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Daily Customer Growth */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{t('daily_customer_growth') || 'Daily Customer Growth'}</h3>
                                <p className="text-sm text-slate-500">{t('new_customers_per_day') || 'New customers per day'}</p>
                            </div>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-1">
                            {dailyCustomerGrowth && dailyCustomerGrowth.length > 0 ? (
                                dailyCustomerGrowth.map((day, index) => {
                                    const maxCount = Math.max(...dailyCustomerGrowth.map(d => d.count || 0));
                                    const height = maxCount > 0 ? ((day.count || 0) / maxCount * 100) : 0;
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="w-full bg-slate-100 rounded-t-lg relative group cursor-pointer" style={{ height: `${height}%` }}>
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    {day.count || 0} {t('customers') || 'customers'}
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

                    {/* Monthly Customer Growth */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{t('monthly_customer_growth') || 'Monthly Customer Growth'}</h3>
                                <p className="text-sm text-slate-500">{t('last_12_months') || 'Last 12 months'}</p>
                            </div>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {monthlyCustomerGrowth && monthlyCustomerGrowth.length > 0 ? (
                                monthlyCustomerGrowth.map((month, index) => {
                                    const maxCount = Math.max(...monthlyCustomerGrowth.map(m => m.count || 0));
                                    const height = maxCount > 0 ? ((month.count || 0) / maxCount * 100) : 0;
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="w-full bg-slate-100 rounded-t-lg relative group cursor-pointer" style={{ height: `${height}%` }}>
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    {month.count || 0} {t('customers') || 'customers'}
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

                {/* Customer Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{t('customer_distribution') || 'Customer Distribution'}</h3>
                            <p className="text-sm text-slate-500">{t('customers_by_order_count') || 'Customers grouped by order count'}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <p className="text-2xl font-bold text-slate-900">{customerDistribution?.no_orders || 0}</p>
                            <p className="text-xs text-slate-600 mt-1">{t('no_orders') || 'No Orders'}</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-blue-50 border border-blue-200">
                            <p className="text-2xl font-bold text-blue-900">{customerDistribution?.one_to_five_orders || 0}</p>
                            <p className="text-xs text-blue-600 mt-1">1-5 {t('orders') || 'Orders'}</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-green-50 border border-green-200">
                            <p className="text-2xl font-bold text-green-900">{customerDistribution?.six_to_ten_orders || 0}</p>
                            <p className="text-xs text-green-600 mt-1">6-10 {t('orders') || 'Orders'}</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-purple-50 border border-purple-200">
                            <p className="text-2xl font-bold text-purple-900">{customerDistribution?.eleven_to_twenty_orders || 0}</p>
                            <p className="text-xs text-purple-600 mt-1">11-20 {t('orders') || 'Orders'}</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-amber-50 border border-amber-200">
                            <p className="text-2xl font-bold text-amber-900">{customerDistribution?.more_than_twenty_orders || 0}</p>
                            <p className="text-xs text-amber-600 mt-1">20+ {t('orders') || 'Orders'}</p>
                        </div>
                    </div>
                </div>

                {/* Top Customers by Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{t('top_customers_by_orders') || 'Top Customers by Orders'}</h3>
                            <p className="text-sm text-slate-500">{t('most_active_customers') || 'Most active customers'}</p>
                        </div>
                        <Link
                            href="/admin/users/customers"
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
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('customer') || 'Customer'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('phone') || 'Phone'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('total_orders') || 'Total Orders'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('delivered_orders') || 'Delivered'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('total_spent') || 'Total Spent'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('actions') || 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {topCustomersByOrders && topCustomersByOrders.length > 0 ? (
                                    topCustomersByOrders.map((customer, index) => (
                                        <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">{customer.name}</p>
                                                        <p className="text-xs text-slate-500">{new Date(customer.created_at).toLocaleDateString('ar-SA')}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-slate-700">{customer.phone || '-'}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <ShoppingCart className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm font-bold text-slate-900">{customer.total_orders || 0}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-semibold text-green-700">{customer.delivered_orders || 0}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-bold text-emerald-700">{formatCurrency(customer.total_spent)}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/admin/users/customers`}
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
                                            {t('no_customers_found') || 'No customers found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Customers by Revenue */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{t('top_customers_by_revenue') || 'Top Customers by Revenue'}</h3>
                            <p className="text-sm text-slate-500">{t('highest_spending_customers') || 'Highest spending customers'}</p>
                        </div>
                        <Link
                            href="/admin/users/customers"
                            className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                        >
                            {t('view_all') || 'View All'}
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {topCustomersByRevenue && topCustomersByRevenue.length > 0 ? (
                            topCustomersByRevenue.map((customer, index) => (
                                <div key={customer.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 truncate">{customer.name}</p>
                                        <p className="text-xs text-slate-500">{customer.phone || '-'}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div>
                                                <p className="text-xs text-slate-500">{t('orders') || 'Orders'}</p>
                                                <p className="text-sm font-bold text-slate-900">{customer.total_orders || 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">{t('spent') || 'Spent'}</p>
                                                <p className="text-sm font-bold text-emerald-700">{formatCurrency(customer.total_spent)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-slate-400 py-8">
                                <p>{t('no_customers_found') || 'No customers found'}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* New Customers */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{t('new_customers') || 'New Customers'}</h3>
                            <p className="text-sm text-slate-500">{t('last_30_days') || 'Last 30 days'}</p>
                        </div>
                        <Link
                            href="/admin/users/customers"
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
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('customer') || 'Customer'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('phone') || 'Phone'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('join_date') || 'Join Date'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('orders') || 'Orders'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('total_spent') || 'Total Spent'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {newCustomers && newCustomers.length > 0 ? (
                                    newCustomers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-semibold text-slate-900">{customer.name}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-slate-700">{customer.phone || '-'}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-slate-600">
                                                    {new Date(customer.created_at).toLocaleDateString('ar-SA', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-bold text-slate-900">{customer.orders_count || 0}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-bold text-emerald-700">{formatCurrency(customer.total_spent)}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-slate-400">
                                            {t('no_customers_found') || 'No customers found'}
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

