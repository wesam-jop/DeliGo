import React from 'react';
import { Link } from '@inertiajs/react';
import { Store, MapPin, ShoppingBag, Package } from 'lucide-react';

export default function StoreCard({ store, t }) {
    return (
        <div className="bg-white rounded-3xl border border-white/40 shadow-xl p-6 flex flex-wrap gap-4 justify-between items-center">
            {/* <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 pointer-events-none" /> */}

            <div className="">
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 shadow-inner">
                        <Store className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{store.name}</h2>
                        <p className="text-sm text-slate-500 capitalize">
                            {store.store_type_label || store.store_type}
                        </p>
                    </div>
                </div>
                <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        store.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}
                >
                    {store.is_active ? t('store_products_available') : t('store_products_unavailable')}
                </span>
            </div>

            {store.address && (
                <p className="text-sm text-slate-600 flex items-center gap-2 leading-relaxed">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    {store.address}
                </p>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">{t('orders')}</p>
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-purple-500" />
                        <span className="text-xl font-semibold text-slate-900">{store.orders_count}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        {t('stores_orders_count', { count: store.orders_count })}
                    </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">{t('store_products_section_title')}</p>
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-purple-500" />
                        <span className="text-xl font-semibold text-slate-900">{store.products_count}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        {t('stores_products_count', { count: store.products_count })}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <Link
                    href={`/products?store=${store.id}`}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-purple-500/40 transition"
                >
                    {t('stores_view_store')}
                </Link>
            </div>
        </div>
    );
}


