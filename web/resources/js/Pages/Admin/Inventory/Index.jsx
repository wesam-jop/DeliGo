import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import { 
    Package, 
    Search, 
    Filter,
    Eye,
    Edit,
    CheckCircle,
    XCircle,
    AlertTriangle,
    TrendingUp,
    DollarSign,
    Download,
    Plus,
    Minus,
    Save,
    Store,
    Tag,
    ShoppingCart
} from 'lucide-react';

const StockBadge = ({ stock, unit, t }) => {
    if (stock <= 0) {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                <XCircle className="w-3.5 h-3.5" />
                <span>{t('out_of_stock') || 'Out of Stock'}</span>
            </span>
        );
    } else if (stock <= 10) {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t('low_stock') || 'Low Stock'}</span>
            </span>
        );
    } else {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{t('in_stock') || 'In Stock'}</span>
            </span>
        );
    }
};

const StockEditor = ({ product, onSave, t }) => {
    const [editing, setEditing] = useState(false);
    const [stockValue, setStockValue] = useState(product.stock_quantity || 0);
    const { data, setData, put, processing } = useForm({
        stock_quantity: product.stock_quantity || 0,
    });

    const handleSave = () => {
        put(`/admin/inventory/${product.id}/stock`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditing(false);
                if (onSave) onSave();
            },
        });
    };

    if (editing) {
        return (
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    value={stockValue}
                    onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setStockValue(value);
                        setData('stock_quantity', value);
                    }}
                    min="0"
                    className="w-20 px-2 py-1 rounded-lg border border-slate-300 text-sm font-semibold text-center focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                    onClick={handleSave}
                    disabled={processing}
                    className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all"
                    title={t('save') || 'Save'}
                >
                    <Save className="w-4 h-4" />
                </button>
                <button
                    onClick={() => {
                        setEditing(false);
                        setStockValue(product.stock_quantity || 0);
                    }}
                    className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                    title={t('cancel') || 'Cancel'}
                >
                    <XCircle className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">{product.stock_quantity || 0}</span>
            <span className="text-xs text-slate-500">{product.unit || 'units'}</span>
            <button
                onClick={() => setEditing(true)}
                className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all"
                title={t('edit') || 'Edit'}
            >
                <Edit className="w-3.5 h-3.5" />
            </button>
        </div>
    );
};

export default function Inventory({ products, stats }) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredProducts = products?.filter(product => {
        const matchesSearch = 
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.barcode?.includes(searchTerm) ||
            product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.store?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = 
            filterStatus === 'all' ||
            (filterStatus === 'in_stock' && product.stock_quantity > 10) ||
            (filterStatus === 'low_stock' && product.stock_quantity > 0 && product.stock_quantity <= 10) ||
            (filterStatus === 'out_of_stock' && product.stock_quantity <= 0);
        
        return matchesSearch && matchesFilter;
    }) || [];

    return (
        <AdminLayout title={t('inventory') || 'Inventory'}>
            <Head title={t('inventory') || 'Inventory'} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">{t('inventory') || 'Inventory'}</h2>
                        <p className="text-slate-600 mt-2">{t('manage_inventory') || 'Manage product stock levels and inventory'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm">
                            <Download className="w-4 h-4" />
                            <span className="font-medium">{t('export') || 'Export'}</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700">{t('total_products') || 'Total Products'}</p>
                                <p className="text-3xl font-bold text-blue-900 mt-2">{stats?.total_products || 0}</p>
                                <p className="text-xs text-blue-600 mt-1">{t('all_products') || 'All products'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Package className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-700">{t('total_stock') || 'Total Stock'}</p>
                                <p className="text-3xl font-bold text-purple-900 mt-2">{stats?.total_stock || 0}</p>
                                <p className="text-xs text-purple-600 mt-1">{t('total_units') || 'Total units'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <ShoppingCart className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-700">{t('in_stock') || 'In Stock'}</p>
                                <p className="text-3xl font-bold text-green-900 mt-2">{stats?.in_stock || 0}</p>
                                <p className="text-xs text-green-600 mt-1">{t('good_stock') || 'Good stock'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <CheckCircle className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-700">{t('low_stock') || 'Low Stock'}</p>
                                <p className="text-3xl font-bold text-orange-900 mt-2">{stats?.low_stock || 0}</p>
                                <p className="text-xs text-orange-600 mt-1">{t('needs_restock') || 'Needs restock'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <AlertTriangle className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-700">{t('out_of_stock') || 'Out of Stock'}</p>
                                <p className="text-3xl font-bold text-red-900 mt-2">{stats?.out_of_stock || 0}</p>
                                <p className="text-xs text-red-600 mt-1">{t('no_stock') || 'No stock'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <XCircle className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm border border-emerald-200 p-6 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-700">{t('total_value') || 'Total Value'}</p>
                                <p className="text-2xl font-bold text-emerald-900 mt-2">
                                    {stats?.total_value ? `${parseFloat(stats.total_value).toFixed(2)}` : '0.00'}
                                </p>
                                <p className="text-xs text-emerald-600 mt-1">{t('inventory_value') || 'Inventory value'}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <DollarSign className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <Search className="w-5 h-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t('search_inventory') || 'Search by product name, barcode, category, or store...'}
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
                                <Filter className="w-4 h-4 text-slate-500" />
                                <span className="text-sm font-medium text-slate-700">{t('filter') || 'Filter'}</span>
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm font-medium text-slate-700 min-w-[150px]"
                            >
                                <option value="all">{t('all') || 'All'}</option>
                                <option value="in_stock">{t('in_stock') || 'In Stock'}</option>
                                <option value="low_stock">{t('low_stock') || 'Low Stock'}</option>
                                <option value="out_of_stock">{t('out_of_stock') || 'Out of Stock'}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('product') || 'Product'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('category') || 'Category'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('store') || 'Store'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('current_stock') || 'Current Stock'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('stock_status') || 'Status'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('stock_value') || 'Stock Value'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('actions') || 'Actions'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => {
                                        const stockValue = (product.stock_quantity || 0) * (parseFloat(product.price) || 0);
                                        return (
                                            <tr key={product.id} className="hover:bg-slate-50/50 transition-all duration-150 group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {product.image ? (
                                                            <img 
                                                                src={product.image} 
                                                                alt={product.name}
                                                                className="w-12 h-12 rounded-xl object-cover shadow-md"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                                {product.name?.charAt(0)?.toUpperCase() || 'P'}
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-bold text-slate-900 truncate">
                                                                {product.name || '-'}
                                                            </div>
                                                            {product.barcode && (
                                                                <div className="text-xs text-slate-500 mt-0.5">
                                                                    {t('barcode') || 'Barcode'}: {product.barcode}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {product.category ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                                                <Tag className="w-4 h-4 text-blue-600" />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-900">{product.category.name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-slate-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {product.store ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                                                <Store className="w-4 h-4 text-green-600" />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-900">{product.store.name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-slate-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StockEditor product={product} t={t} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StockBadge stock={product.stock_quantity || 0} unit={product.unit} t={t} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                                                            <DollarSign className="w-4 h-4 text-emerald-600" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900">
                                                                {stockValue.toFixed(2)}
                                                            </div>
                                                            <div className="text-xs text-slate-500">
                                                                {t('value') || 'Value'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1">
                                                        <Link
                                                            href={`/admin/products/${product.id}`}
                                                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 group/action"
                                                            title={t('view') || 'View'}
                                                        >
                                                            <Eye className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                                    <Package className="w-10 h-10 text-slate-400" />
                                                </div>
                                                <p className="text-slate-600 font-medium mb-1">{t('no_products_found') || 'No products found'}</p>
                                                <p className="text-sm text-slate-400">{t('try_different_search') || 'Try adjusting your search or filter criteria'}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Results Count */}
                {filteredProducts.length > 0 && (
                    <div className="text-center text-sm text-slate-600">
                        {t('showing_results') || 'Showing'} {filteredProducts.length} {t('of') || 'of'} {products?.length || 0} {t('products') || 'products'}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

