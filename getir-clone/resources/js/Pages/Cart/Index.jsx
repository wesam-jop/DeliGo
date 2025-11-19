import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Layout from '../Layout';
import { useTranslation } from '../../hooks/useTranslation';
import AppDownloadSection from '../../Components/AppDownloadSection';
import { DollarSign } from 'lucide-react';

export default function CartIndex({ cartItems, total }) {
    const { t } = useTranslation();
    
    const [quantities, setQuantities] = useState(
        cartItems.reduce((acc, item) => {
            acc[item.product.id] = item.quantity;
            return acc;
        }, {})
    );

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 0) return;
        
        setQuantities(prev => ({
            ...prev,
            [productId]: newQuantity
        }));

        router.put('/cart/update', {
            product_id: productId,
            quantity: newQuantity
        }, {
            preserveState: true,
            onSuccess: () => {
                // يمكن إضافة رسالة نجاح هنا
            }
        });
    };

    const handleRemoveItem = (productId) => {
        router.delete(`/cart/remove/${productId}`, {
            preserveState: true
        });
    };

    const handleClearCart = () => {
        if (confirm(t('confirm_clear_cart'))) {
            router.delete('/cart/clear', {
                preserveState: true
            });
        }
    };

    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [formData, setFormData] = useState({
        delivery_address: '',
        delivery_latitude: 33.5138, // دمشق
        delivery_longitude: 36.2765,
        customer_phone: '',
        notes: ''
    });

    const handleCheckout = () => {
        setShowCheckoutForm(true);
    };

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        
        router.post('/orders', formData, {
            onSuccess: () => {
                setShowCheckoutForm(false);
            },
            onError: (errors) => {
                console.error('Order errors:', errors);
            }
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Layout>
            <Head title={t('shopping_cart')} />
            
            <div className="min-h-screen bg-slate-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <h1 className="text-2xl font-bold text-slate-900">{t('shopping_cart')}</h1>
                        <p className="text-slate-600 mt-1">{t('review_products_before_order')}</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {cartItems.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg shadow-sm">
                                    <div className="p-6 border-b border-slate-200">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-semibold text-slate-900">
                                                {t('products')} ({cartItems.length})
                                            </h2>
                                            <button
                                                onClick={handleClearCart}
                                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                                            >
                                                {t('clear_cart')}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="divide-y divide-gray-200">
                                        {cartItems.map((item) => (
                                            <div key={item.product.id} className="p-6">
                                                <div className="flex items-center space-x-4">
                                                    {/* Product Image */}
                                                    <div className="flex-shrink-0">
                                                        <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center">
                                                            <span className="text-2xl">{item.product.category?.icon || '📦'}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Product Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <Link
                                                            href={`/products/${item.product.id}`}
                                                            className="text-lg font-medium text-slate-900 hover:text-purple-600 transition-colors"
                                                        >
                                                            {item.product.name}
                                                        </Link>
                                                        <p className="text-sm text-slate-600 mt-1">
                                                            {item.product.description}
                                                        </p>
                                                        <div className="flex items-center mt-2">
                                                            <div className="flex items-center space-x-1">
                                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                                <span className="text-lg font-bold text-purple-600">
                                                                    {item.product.price}
                                                                </span>
                                                            </div>
                                                            <span className="text-sm text-slate-500 mr-2">
                                                                / {item.product.unit}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={() => handleQuantityChange(item.product.id, quantities[item.product.id] - 1)}
                                                            className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-12 text-center font-medium">
                                                            {quantities[item.product.id]}
                                                        </span>
                                                        <button
                                                            onClick={() => handleQuantityChange(item.product.id, quantities[item.product.id] + 1)}
                                                            className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    
                                                    {/* Subtotal */}
                                                    <div className="text-right">
                                                        <div className="flex items-center space-x-1">
                                                            <DollarSign className="w-4 h-4 text-green-600" />
                                                            <span className="text-lg font-bold text-slate-900">
                                                                {item.subtotal}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveItem(item.product.id)}
                                                            className="text-red-600 hover:text-red-700 text-sm mt-1"
                                                        >
                                                            {t('remove')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('order_summary')}</h3>
                                    
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">{t('subtotal')}:</span>
                                            <div className="flex items-center space-x-1">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                <span className="font-medium">{total}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">{t('delivery_fee')}:</span>
                                            <div className="flex items-center space-x-1">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                <span className="font-medium">5.00</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">{t('tax')}:</span>
                                            <div className="flex items-center space-x-1">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                <span className="font-medium">0.00</span>
                                            </div>
                                        </div>
                                        <div className="border-t border-slate-200 pt-3">
                                            <div className="flex justify-between">
                                                <span className="text-lg font-semibold text-slate-900">{t('total')}:</span>
                                                <div className="flex items-center space-x-1">
                                                    <DollarSign className="w-4 h-4 text-green-600" />
                                                    <span className="text-lg font-bold text-purple-600">{total + 5}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                                    >
                                        {t('proceed_to_order')}
                                    </button>
                                    
                                    <Link
                                        href="/products"
                                        className="block w-full text-center mt-3 text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        {t('add_more_products')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🛒</div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">{t('cart_empty')}</h3>
                            <p className="text-slate-600 mb-6">{t('start_adding_products')}</p>
                            <Link
                                href="/products"
                                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                {t('browse_products')}
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Checkout Modal */}
            {showCheckoutForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-slate-900">{t('confirm_order')}</h3>
                                <button
                                    onClick={() => setShowCheckoutForm(false)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmitOrder} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        {t('delivery_address')} *
                                    </label>
                                    <textarea
                                        name="delivery_address"
                                        value={formData.delivery_address}
                                        onChange={handleInputChange}
                                        required
                                        rows={3}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder={t('enter_delivery_address')}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        {t('phone_number')} *
                                    </label>
                                    <input
                                        type="tel"
                                        name="customer_phone"
                                        value={formData.customer_phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="+963-XX-XXXXXXX"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        {t('additional_notes')}
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder={t('special_notes')}
                                    />
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-slate-900 mb-2">{t('order_summary')}</h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span>{t('subtotal')}:</span>
                                            <div className="flex items-center space-x-1">
                                                <DollarSign className="w-3 h-3 text-green-600" />
                                                <span>{total}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>{t('delivery_fee')}:</span>
                                            <div className="flex items-center space-x-1">
                                                <DollarSign className="w-3 h-3 text-green-600" />
                                                <span>5.00</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between font-semibold">
                                            <span>{t('total')}:</span>
                                            <div className="flex items-center space-x-1">
                                                <DollarSign className="w-3 h-3 text-green-600" />
                                                <span>{total + 5}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCheckoutForm(false)}
                                        className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    >
                                        {t('confirm_order')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* App Download Section */}
            <AppDownloadSection />
        </Layout>
    );
}
