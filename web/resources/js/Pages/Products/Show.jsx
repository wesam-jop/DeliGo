import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Layout from '../Layout';
import { useTranslation } from '../../hooks/useTranslation';
import ProductCard from '../../Components/ProductCard';
import FavoriteToggleButton from '../../Components/FavoriteToggleButton';
import AppDownloadSection from '../../Components/AppDownloadSection';
import { DollarSign } from 'lucide-react';

export default function ProductShow({ product, relatedProducts }) {
    const { t } = useTranslation();
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        router.post('/cart/add', {
            product_id: product.id,
            quantity: quantity
        }, {
            onSuccess: () => {
                alert(t('product_added_to_cart', { quantity, name: product.name }));
            },
            onError: (errors) => {
                if (errors.quantity) {
                    alert(errors.quantity);
                } else {
                    alert(t('error_adding_to_cart'));
                }
            }
        });
    };

    return (
        <Layout>
            <Head title={product.name} />
            
            <div className="min-h-screen bg-slate-50">
                {/* Breadcrumb */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <nav className="flex items-center space-x-2 text-sm">
                            <Link href="/" className="text-slate-500 hover:text-purple-600">{t('home')}</Link>
                            <span className="text-slate-400">/</span>
                            <Link href="/products" className="text-slate-500 hover:text-purple-600">{t('products')}</Link>
                            <span className="text-slate-400">/</span>
                            <Link href={`/categories/${product.category.id}`} className="text-slate-500 hover:text-purple-600">
                                {product.category.name}
                            </Link>
                            <span className="text-slate-400">/</span>
                            <span className="text-slate-900 font-medium">{product.name}</span>
                        </nav>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Product Image */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                                <span className="text-8xl">{product.category?.icon || '📦'}</span>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                    {product.category?.icon} {product.category?.name}
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold text-slate-900 mb-4">{product.name}</h1>
                            
                            <p className="text-slate-600 mb-6 leading-relaxed">{product.description}</p>

                            <div className="mb-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center space-x-2">
                                        <DollarSign className="w-6 h-6 text-green-600" />
                                        <span className="text-3xl font-bold text-purple-600">
                                            {product.price}
                                        </span>
                                    </div>
                                    <span className="text-lg text-slate-500">/ {product.unit}</span>
                                </div>

                                {product.is_featured && (
                                    <div className="mb-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                            ⭐ {t('featured')}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    {t('quantity')}
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-50"
                                    >
                                        -
                                    </button>
                                    <span className="w-16 text-center font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-50"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart & Favorite */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                                >
                                    {t('add_to_cart')}
                                </button>
                                <FavoriteToggleButton
                                    productId={product.id}
                                    variant="pill"
                                    className="w-full justify-center sm:w-auto"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('product_info')}</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">{t('brand')}:</span>
                                        <span className="font-medium">{product.brand || t('not_specified')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">{t('weight')}:</span>
                                        <span className="font-medium">{product.weight} {t('grams')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">{t('stock')}:</span>
                                        <span className="font-medium text-green-600">
                                            {product.stock_quantity} {t('available')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('related_products')}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <ProductCard key={relatedProduct.id} product={relatedProduct} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* App Download Section */}
            <AppDownloadSection />
        </Layout>
    );
}
