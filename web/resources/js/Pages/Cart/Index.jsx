import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Layout from '../Layout';
import { useTranslation } from '../../hooks/useTranslation';
import AppDownloadSection from '../../Components/AppDownloadSection';
import StoreLocationPicker from '../../Components/StoreLocationPicker';
import { useGeneralSettings } from '../../hooks/useGeneralSettings';
import { DollarSign, Plus, Save } from 'lucide-react';

const DEFAULT_COORDS = { lat: 33.5138, lng: 36.2765 };

export default function CartIndex({ cartItems, total, deliveryLocations = [] }) {
    const { t } = useTranslation();
    const { props } = usePage();
    const authUser = props.auth?.user;
    const { formatCurrency } = useGeneralSettings();

    const preferredLocation = deliveryLocations.find((location) => location.is_default) || deliveryLocations[0];
    const [selectedLocationId, setSelectedLocationId] = useState(preferredLocation?.id || null);
    const selectedLocation = deliveryLocations.find((location) => location.id === selectedLocationId);
    
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
        delivery_address: preferredLocation?.address || '',
        delivery_latitude: preferredLocation?.latitude || DEFAULT_COORDS.lat,
        delivery_longitude: preferredLocation?.longitude || DEFAULT_COORDS.lng,
        customer_phone: authUser?.phone || '',
        notes: '',
    });
    const [showNewLocationForm, setShowNewLocationForm] = useState(deliveryLocations.length === 0);
    const [newLocationForm, setNewLocationForm] = useState({
        label: '',
        address: '',
        latitude: preferredLocation?.latitude || DEFAULT_COORDS.lat,
        longitude: preferredLocation?.longitude || DEFAULT_COORDS.lng,
        notes: '',
        is_default: deliveryLocations.length === 0,
    });
    const [newLocationErrors, setNewLocationErrors] = useState({});
    const [addingLocation, setAddingLocation] = useState(false);
    const [geolocateStatus, setGeolocateStatus] = useState(null);
    const deliveryFee = 5;
    const orderTotal = total + deliveryFee;

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
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (!selectedLocationId) {
            return;
        }

        const selectedLocation = deliveryLocations.find((location) => location.id === selectedLocationId);
        if (selectedLocation) {
            setFormData((prev) => ({
                ...prev,
                delivery_address: selectedLocation.address || '',
                delivery_latitude: selectedLocation.latitude,
                delivery_longitude: selectedLocation.longitude,
            }));
        }
    }, [selectedLocationId, deliveryLocations]);

    useEffect(() => {
        if (!deliveryLocations.length) {
            if (selectedLocationId) {
                setSelectedLocationId(null);
            }
            return;
        }

        if (!selectedLocationId || !deliveryLocations.some((location) => location.id === selectedLocationId)) {
            const fallbackLocation = deliveryLocations.find((location) => location.is_default) || deliveryLocations[0];
            if (fallbackLocation) {
                setSelectedLocationId(fallbackLocation.id);
                setFormData((prev) => ({
                    ...prev,
                    delivery_address: fallbackLocation.address || '',
                    delivery_latitude: fallbackLocation.latitude,
                    delivery_longitude: fallbackLocation.longitude,
                }));
            }
        }
    }, [deliveryLocations]);

    const handleNewLocationInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewLocationForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleNewLocationMapChange = ({ latitude, longitude }) => {
        setNewLocationForm((prev) => ({
            ...prev,
            latitude,
            longitude,
        }));
        setGeolocateStatus(null);
    };

    const resetNewLocationForm = () => {
        setNewLocationForm({
            label: '',
            address: '',
            latitude: DEFAULT_COORDS.lat,
            longitude: DEFAULT_COORDS.lng,
            notes: '',
            is_default: deliveryLocations.length === 0,
        });
        setNewLocationErrors({});
    };

    const handleNewLocationSubmit = (e) => {
        e.preventDefault();
        setAddingLocation(true);
        setNewLocationErrors({});

        router.post('/dashboard/customer/locations', newLocationForm, {
            preserveScroll: true,
            onSuccess: () => {
                setShowNewLocationForm(false);
                resetNewLocationForm();
                router.reload({
                    only: ['deliveryLocations'],
                    onSuccess: (page) => {
                        const updatedLocations = page.props.deliveryLocations || [];
                        const fallback = updatedLocations.find((location) => location.is_default) || updatedLocations[0];
                        if (fallback) {
                            setSelectedLocationId(fallback.id);
                        }
                    },
                    onFinish: () => setAddingLocation(false),
                });
            },
            onError: (errors) => {
                setNewLocationErrors(errors);
                setAddingLocation(false);
            },
            onFinish: () => {},
        });
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            setGeolocateStatus({
                type: 'error',
                message: t('location_geolocate_unsupported') || 'Geolocation is not supported by your browser.',
            });
            return;
        }

        setGeolocateStatus({
            type: 'loading',
            message: t('location_geolocate_fetching') || 'Detecting your current position...',
        });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                handleNewLocationMapChange({
                    latitude: latitude.toFixed(6),
                    longitude: longitude.toFixed(6),
                });
                setGeolocateStatus({
                    type: 'success',
                    message: t('location_geolocate_success') || 'Location updated based on your current position.',
                });
            },
            () => {
                setGeolocateStatus({
                    type: 'error',
                    message: t('location_geolocate_denied') || 'Unable to retrieve your location. Please allow access or set it manually.',
                });
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const canConfirmOrder =
        (!!formData.customer_phone?.trim() || !authUser) &&
        (deliveryLocations.length === 0 || !!selectedLocationId);

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
                                                                    {formatCurrency(item.product.price)}
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
                                                                {formatCurrency(item.subtotal)}
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
                                                <span className="font-medium">{formatCurrency(total)}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">{t('delivery_fee')}:</span>
                                            <div className="flex items-center space-x-1">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                <span className="font-medium">{formatCurrency(deliveryFee)}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">{t('tax')}:</span>
                                            <div className="flex items-center space-x-1">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                <span className="font-medium">{formatCurrency(0)}</span>
                                            </div>
                                        </div>
                                        <div className="border-t border-slate-200 pt-3">
                                            <div className="flex justify-between">
                                                <span className="text-lg font-semibold text-slate-900">{t('total')}:</span>
                                                <div className="flex items-center space-x-1">
                                                    <DollarSign className="w-4 h-4 text-green-600" />
                                                    <span className="text-lg font-bold text-purple-600">{formatCurrency(orderTotal)}</span>
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
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

                            <form onSubmit={handleSubmitOrder} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 mb-2">
                                            {t('select_saved_location') || 'اختر عنوان التوصيل'}
                                        </p>
                                        {deliveryLocations.length > 0 ? (
                                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                                {deliveryLocations.map((location) => {
                                                    const isActive = selectedLocationId === location.id;
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={location.id}
                                                            onClick={() => {
                                                                setSelectedLocationId(location.id);
                                                                setShowNewLocationForm(false);
                                                            }}
                                                            className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                                                                isActive
                                                                    ? 'border-purple-400 bg-purple-50/80 shadow-sm'
                                                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                            }`}
                                                        >
                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex items-center gap-3">
                                                                    <input
                                                                        type="radio"
                                                                        checked={isActive}
                                                                        readOnly
                                                                        className="text-purple-600 focus:ring-purple-500"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <p className="text-sm font-semibold text-slate-900">
                                                                                {location.label}
                                                                            </p>
                                                                            {location.is_default && (
                                                                                <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                                                                                    {t('default_location_badge') || 'Default'}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-xs text-slate-500">
                                                                            {location.address}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <p className="text-[11px] text-slate-400 pl-6">
                                                                    {Number(location.latitude).toFixed(4)}, {Number(location.longitude).toFixed(4)}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-500">
                                                {t('no_saved_locations_hint') || 'أضف موقعاً جديداً للمتابعة.'}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setShowNewLocationForm((prev) => !prev)}
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700"
                                    >
                                        <Plus className="w-4 h-4" />
                                        {showNewLocationForm
                                            ? t('hide_new_location_form') || 'إخفاء نموذج العنوان'
                                            : t('add_new_location') || 'إضافة موقع جديد'}
                                    </button>

                                    {showNewLocationForm && (
                                        <div className="space-y-4 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-4">
                                            <p className="text-sm font-semibold text-slate-900">
                                                {t('location_form_title') || 'تفاصيل الموقع الجديد'}
                                            </p>
                                            <div className="space-y-2">
                                                <StoreLocationPicker
                                                    latitude={newLocationForm.latitude}
                                                    longitude={newLocationForm.longitude}
                                                    onChange={handleNewLocationMapChange}
                                                    height={200}
                                                />
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <p className="text-xs text-slate-500 flex-1">
                                                        {t('location_map_help') || 'انقر على الخريطة لتحديث الإحداثيات بدقة.'}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={handleUseCurrentLocation}
                                                        className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100"
                                                    >
                                                        {t('location_use_current') || 'تحديد موقعي الحالي'}
                                                    </button>
                                                </div>
                                                {geolocateStatus && (
                                                    <p
                                                        className={`text-xs font-medium ${
                                                            geolocateStatus.type === 'success'
                                                                ? 'text-emerald-600'
                                                                : geolocateStatus.type === 'loading'
                                                                ? 'text-slate-600'
                                                                : 'text-rose-600'
                                                        }`}
                                                    >
                                                        {geolocateStatus.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                                    {t('location_label') || 'اسم الموقع'}
                                                </label>
                                                <input
                                                    type="text"
                                                    name="label"
                                                    value={newLocationForm.label}
                                                    onChange={handleNewLocationInputChange}
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    placeholder={t('location_label_placeholder') || 'مثال: المنزل، المكتب'}
                                                />
                                                {newLocationErrors.label && (
                                                    <p className="text-xs text-rose-600 mt-1">{newLocationErrors.label}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                                    {t('location_address') || t('delivery_address')} *
                                                </label>
                                                <textarea
                                                    name="address"
                                                    value={newLocationForm.address}
                                                    onChange={handleNewLocationInputChange}
                                                    rows={2}
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    placeholder={t('location_address_placeholder') || 'رقم البناء، الشارع، تفاصيل إضافية'}
                                                    required
                                                />
                                                {newLocationErrors.address && (
                                                    <p className="text-xs text-rose-600 mt-1">{newLocationErrors.address}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                                    {t('location_notes') || t('additional_notes')}
                                                </label>
                                                <textarea
                                                    name="notes"
                                                    value={newLocationForm.notes}
                                                    onChange={handleNewLocationInputChange}
                                                    rows={2}
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    placeholder={t('location_notes_placeholder') || 'مثال: البوابة الخلفية، الطابق الثاني'}
                                                />
                                                {newLocationErrors.notes && (
                                                    <p className="text-xs text-rose-600 mt-1">{newLocationErrors.notes}</p>
                                                )}
                                            </div>
                                            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700">
                                                <input
                                                    type="checkbox"
                                                    name="is_default"
                                                    checked={newLocationForm.is_default}
                                                    onChange={handleNewLocationInputChange}
                                                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                                />
                                                <span>{t('set_as_default') || 'تعيين كنقطة افتراضية'}</span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={handleNewLocationSubmit}
                                                disabled={addingLocation}
                                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700 disabled:opacity-60"
                                            >
                                                {addingLocation && (
                                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                        />
                                                    </svg>
                                                )}
                                                <Save className="w-4 h-4" />
                                                <span>{t('save_location') || 'حفظ الموقع'}</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {selectedLocation && (
                                    <div className="pt-4 border-t border-slate-200 space-y-3">
                                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                {t('delivery_details') || 'Delivery details'}
                                            </p>
                                            <p className="text-base font-semibold text-slate-900 mt-1">
                                                {selectedLocation.label}
                                            </p>
                                            <p className="text-sm text-slate-600">{selectedLocation.address}</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {Number(selectedLocation.latitude).toFixed(4)}, {Number(selectedLocation.longitude).toFixed(4)}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-3">
                                                {t('phone_number') || 'Phone'}: <span className="font-semibold text-slate-900">{formData.customer_phone || t('not_specified')}</span>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-slate-700">
                                        {t('additional_notes')}
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            rows={2}
                                            className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder={t('special_notes')}
                                        />
                                    </label>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-slate-900 mb-2">{t('order_summary')}</h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span>{t('subtotal')}:</span>
                                            <div className="flex items-center space-x-1">
                                                <DollarSign className="w-3 h-3 text-green-600" />
                                                <span>{formatCurrency(total)}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>{t('delivery_fee')}:</span>
                                            <div className="flex items-center space-x-1">
                                                <DollarSign className="w-3 h-3 text-green-600" />
                                                <span>{formatCurrency(deliveryFee)}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between font-semibold">
                                            <span>{t('total')}:</span>
                                            <div className="flex items-center space-x-1">
                                                <DollarSign className="w-3 h-3 text-green-600" />
                                                <span>{formatCurrency(orderTotal)}</span>
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
                                        disabled={!canConfirmOrder}
                                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
