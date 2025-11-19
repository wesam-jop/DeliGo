import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import { 
    DollarSign, 
    ShoppingCart, 
    TrendingUp,
    TrendingDown,
    Download,
    RefreshCw,
    Eye,
    ArrowUpRight,
    Store,
    Package,
    Tag,
    Calendar,
    BarChart3,
    PieChart,
    LineChart,
    Activity
} from 'lucide-react';

export default function Sales({ 
    stats, 
    dailySales, 
    monthlySales, 
    salesByStore, 
    salesByCategory, 
    topSellingProducts,
    recentSales,
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
        router.get('/admin/analytics/sales', { range: newRange }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title={t('sales_reports') || 'Sales Reports'}>
            <Head title={t('sales_reports') || 'Sales Reports'} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">{t('sales_reports') || 'Sales Reports'}</h2>
                        <p className="text-slate-600 mt-2">{t('detailed_sales_analytics') || 'Detailed sales performance and revenue analytics'}</p>
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
                                <p className="text-sm font-medium text-blue-700">{t('total_orders') || 'Total Orders'}</p>
                                <p className="text-3xl font-bold text-blue-900 mt-2">{stats?.total_orders || 0}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="text-xs text-green-600 font-medium">+9.1%</span>
                                    <span className="text-xs text-slate-500">{t('vs_last_period') || 'vs last period'}</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <ShoppingCart className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-700">{t('average_order_value') || 'Avg Order Value'}</p>
                                <p className="text-3xl font-bold text-purple-900 mt-2">
                                    {formatCurrency(stats?.average_order_value)}
                                </p>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingDown className="w-4 h-4 text-red-600" />
                                    <span className="text-xs text-red-600 font-medium">-1.2%</span>
                                    <span className="text-xs text-slate-500">{t('vs_last_period') || 'vs last period'}</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <BarChart3 className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-700">{t('total_delivery_fees') || 'Delivery Fees'}</p>
                                <p className="text-3xl font-bold text-orange-900 mt-2">
                                    {formatCurrency(stats?.total_delivery_fees)}
                                </p>
                                <p className="text-xs text-orange-600 mt-1">{t('collected_fees') || 'Collected fees'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Activity className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('total_discounts') || 'Total Discounts'}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats?.total_discounts)}</p>
                                <p className="text-xs text-slate-500 mt-1">{t('discounts_applied') || 'Discounts applied'}</p>
                            </div>
                            <TrendingDown className="w-8 h-8 text-red-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('total_tax') || 'Total Tax'}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats?.total_tax)}</p>
                                <p className="text-xs text-slate-500 mt-1">{t('tax_collected') || 'Tax collected'}</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-blue-600" />
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
                            {dailySales && dailySales.length > 0 ? (
                                dailySales.map((day, index) => {
                                    const maxRevenue = Math.max(...dailySales.map(d => parseFloat(d.revenue || 0)));
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

                    {/* Monthly Sales Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{t('monthly_sales') || 'Monthly Sales'}</h3>
                                <p className="text-sm text-slate-500">{t('last_12_months') || 'Last 12 months'}</p>
                            </div>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {monthlySales && monthlySales.length > 0 ? (
                                monthlySales.map((month, index) => {
                                    const maxRevenue = Math.max(...monthlySales.map(m => parseFloat(m.revenue || 0)));
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

                {/* Sales by Store */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{t('sales_by_store') || 'Sales by Store'}</h3>
                            <p className="text-sm text-slate-500">{t('revenue_per_store') || 'Revenue breakdown by store'}</p>
                        </div>
                        <Link
                            href="/admin/stores"
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
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('store') || 'Store'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('orders') || 'Orders'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('revenue') || 'Revenue'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('delivery_fees') || 'Delivery Fees'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('actions') || 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {salesByStore && salesByStore.length > 0 ? (
                                    salesByStore.filter(store => (store.total_revenue || 0) > 0).map((store) => (
                                        <tr key={store.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {store.logo_path ? (
                                                        <img src={store.logo_path} alt={store.name} className="w-10 h-10 rounded-lg object-cover" />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                                                            {store.name?.charAt(0)?.toUpperCase() || 'S'}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">{store.name}</p>
                                                        {store.owner && (
                                                            <p className="text-xs text-slate-500">{store.owner.name}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-bold text-slate-900">{store.delivered_orders_count || 0}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-bold text-emerald-700">{formatCurrency(store.total_revenue)}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-slate-700">{formatCurrency(store.total_delivery_fees)}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/admin/stores/${store.id}`}
                                                    className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-slate-400">
                                            {t('no_stores_found') || 'No stores found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{t('top_selling_products') || 'Top Selling Products'}</h3>
                            <p className="text-sm text-slate-500">{t('best_performing_products') || 'Best performing products by sales'}</p>
                        </div>
                        <Link
                            href="/admin/products"
                            className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                        >
                            {t('view_all') || 'View All'}
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {topSellingProducts && topSellingProducts.length > 0 ? (
                            topSellingProducts.map((product, index) => (
                                <div key={product.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                        {index + 1}
                                    </div>
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
                                    ) : (
                                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                                            <Package className="w-8 h-8 text-slate-400" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 truncate">{product.name}</p>
                                        {product.category && (
                                            <p className="text-xs text-slate-500">{product.category.name}</p>
                                        )}
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-bold text-emerald-700">{product.sales_count || 0}</span>
                                            <span className="text-xs text-slate-500">{t('sales') || 'sales'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-slate-400 py-8">
                                <p>{t('no_products_found') || 'No products found'}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Sales */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{t('recent_sales') || 'Recent Sales'}</h3>
                            <p className="text-sm text-slate-500">{t('latest_delivered_orders') || 'Latest delivered orders'}</p>
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
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('store') || 'Store'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('amount') || 'Amount'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('date') || 'Date'}</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">{t('actions') || 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentSales && recentSales.length > 0 ? (
                                    recentSales.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-semibold text-slate-900">{order.order_number || `#${order.id}`}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-slate-700">{order.user?.name || '-'}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-slate-700">{order.store?.name || '-'}</span>
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
                                        <td colSpan="6" className="px-4 py-8 text-center text-slate-400">
                                            {t('no_orders_found') || 'No orders found'}
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

