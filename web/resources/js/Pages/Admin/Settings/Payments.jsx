import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import { 
    CreditCard, 
    Save,
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
    Lock,
    DollarSign,
    Settings,
    Shield,
    Clock,
    RefreshCw,
    Loader
} from 'lucide-react';

export default function PaymentSettings({ settings }) {
    const { props } = usePage();
    const { t } = useTranslation();
    const [showSecrets, setShowSecrets] = useState({});
    const generalSettings = props?.settings || {};

    const { data, setData, post, processing, errors } = useForm({
        enable_cash_payment: settings?.enable_cash_payment === '1' || settings?.enable_cash_payment === true,
        enable_card_payment: settings?.enable_card_payment === '1' || settings?.enable_card_payment === true,
        enable_wallet_payment: settings?.enable_wallet_payment === '1' || settings?.enable_wallet_payment === true,
        default_payment_method: settings?.default_payment_method || 'cash',
        payment_gateway: settings?.payment_gateway || 'none',
        stripe_public_key: settings?.stripe_public_key || '',
        stripe_secret_key: settings?.stripe_secret_key || '',
        stripe_webhook_secret: settings?.stripe_webhook_secret || '',
        paypal_client_id: settings?.paypal_client_id || '',
        paypal_secret: settings?.paypal_secret || '',
        paypal_mode: settings?.paypal_mode || 'sandbox',
        processing_fee_percentage: settings?.processing_fee_percentage || '0',
        processing_fee_fixed: settings?.processing_fee_fixed || '0',
        minimum_order_amount: settings?.minimum_order_amount || '0',
        maximum_order_amount: settings?.maximum_order_amount || '10000',
        enable_refunds: settings?.enable_refunds === '1' || settings?.enable_refunds === true,
        refund_days_limit: settings?.refund_days_limit || '7',
        auto_refund_on_cancel: settings?.auto_refund_on_cancel === '1' || settings?.auto_refund_on_cancel === true,
        enable_payment_notifications: settings?.enable_payment_notifications === '1' || settings?.enable_payment_notifications === true,
        payment_timeout_minutes: settings?.payment_timeout_minutes || '15',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/settings/payments', {
            preserveScroll: true,
            onSuccess: () => {
                // Show success message
            },
        });
    };

    const toggleSecret = (key) => {
        setShowSecrets(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <AdminLayout title={t('payment_settings') || 'Payment Settings'}>
            <Head title={t('payment_settings') || 'Payment Settings'} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">{t('payment_settings') || 'Payment Settings'}</h2>
                        <p className="text-slate-600 mt-2">{t('manage_payment_methods') || 'Manage payment methods and gateway configurations'}</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Payment Methods */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-green-600" />
                                {t('payment_methods') || 'Payment Methods'}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">{t('enable_disable_payment_methods') || 'Enable or disable available payment methods'}</p>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Cash Payment */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900">
                                            {t('cash_payment') || 'Cash Payment'}
                                        </label>
                                        <p className="text-sm text-slate-600 mt-1">
                                            {t('cash_on_delivery') || 'Cash on delivery'}
                                        </p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.enable_cash_payment}
                                        onChange={(e) => setData('enable_cash_payment', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>

                            {/* Card Payment */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900">
                                            {t('card_payment') || 'Card Payment'}
                                        </label>
                                        <p className="text-sm text-slate-600 mt-1">
                                            {t('credit_debit_cards') || 'Credit and debit cards'}
                                        </p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.enable_card_payment}
                                        onChange={(e) => setData('enable_card_payment', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Wallet Payment */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900">
                                            {t('wallet_payment') || 'Wallet Payment'}
                                        </label>
                                        <p className="text-sm text-slate-600 mt-1">
                                            {t('digital_wallet') || 'Digital wallet'}
                                        </p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.enable_wallet_payment}
                                        onChange={(e) => setData('enable_wallet_payment', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                </label>
                            </div>

                            {/* Default Payment Method */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('default_payment_method') || 'Default Payment Method'} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.default_payment_method}
                                    onChange={(e) => setData('default_payment_method', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                >
                                    {data.enable_cash_payment && <option value="cash">{t('cash') || 'Cash'}</option>}
                                    {data.enable_card_payment && <option value="card">{t('card') || 'Card'}</option>}
                                    {data.enable_wallet_payment && <option value="wallet">{t('wallet') || 'Wallet'}</option>}
                                </select>
                                {errors.default_payment_method && (
                                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.default_payment_method}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Gateway */}
                    {data.enable_card_payment && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-blue-600" />
                                    {t('payment_gateway') || 'Payment Gateway'}
                                </h3>
                                <p className="text-sm text-slate-600 mt-1">{t('configure_payment_gateway') || 'Configure payment gateway for card payments'}</p>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Payment Gateway Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        {t('payment_gateway') || 'Payment Gateway'}
                                    </label>
                                    <select
                                        value={data.payment_gateway}
                                        onChange={(e) => setData('payment_gateway', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    >
                                        <option value="none">{t('none') || 'None'}</option>
                                        <option value="stripe">Stripe</option>
                                        <option value="paypal">PayPal</option>
                                    </select>
                                </div>

                                {/* Stripe Settings */}
                                {data.payment_gateway === 'stripe' && (
                                    <div className="space-y-4 p-4 rounded-xl border border-blue-200 bg-blue-50">
                                        <h4 className="text-sm font-semibold text-blue-900">Stripe Configuration</h4>
                                        
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('stripe_public_key') || 'Stripe Public Key'}
                                            </label>
                                            <input
                                                type="text"
                                                value={data.stripe_public_key}
                                                onChange={(e) => setData('stripe_public_key', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                placeholder="pk_test_..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('stripe_secret_key') || 'Stripe Secret Key'}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showSecrets.stripe_secret_key ? 'text' : 'password'}
                                                    value={data.stripe_secret_key}
                                                    onChange={(e) => setData('stripe_secret_key', e.target.value)}
                                                    className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                    placeholder="sk_test_..."
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => toggleSecret('stripe_secret_key')}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                                >
                                                    {showSecrets.stripe_secret_key ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('stripe_webhook_secret') || 'Stripe Webhook Secret'}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showSecrets.stripe_webhook_secret ? 'text' : 'password'}
                                                    value={data.stripe_webhook_secret}
                                                    onChange={(e) => setData('stripe_webhook_secret', e.target.value)}
                                                    className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                    placeholder="whsec_..."
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => toggleSecret('stripe_webhook_secret')}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                                >
                                                    {showSecrets.stripe_webhook_secret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* PayPal Settings */}
                                {data.payment_gateway === 'paypal' && (
                                    <div className="space-y-4 p-4 rounded-xl border border-blue-200 bg-blue-50">
                                        <h4 className="text-sm font-semibold text-blue-900">PayPal Configuration</h4>
                                        
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('paypal_client_id') || 'PayPal Client ID'}
                                            </label>
                                            <input
                                                type="text"
                                                value={data.paypal_client_id}
                                                onChange={(e) => setData('paypal_client_id', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                placeholder="Client ID"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('paypal_secret') || 'PayPal Secret'}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showSecrets.paypal_secret ? 'text' : 'password'}
                                                    value={data.paypal_secret}
                                                    onChange={(e) => setData('paypal_secret', e.target.value)}
                                                    className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                    placeholder="Secret"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => toggleSecret('paypal_secret')}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                                >
                                                    {showSecrets.paypal_secret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('paypal_mode') || 'PayPal Mode'}
                                            </label>
                                            <select
                                                value={data.paypal_mode}
                                                onChange={(e) => setData('paypal_mode', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            >
                                                <option value="sandbox">{t('sandbox') || 'Sandbox (Testing)'}</option>
                                                <option value="live">{t('live') || 'Live (Production)'}</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Payment Fees & Limits */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-purple-600" />
                                {t('payment_fees_limits') || 'Payment Fees & Limits'}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">{t('configure_fees_and_limits') || 'Configure processing fees and order limits'}</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Processing Fee Percentage */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        {t('processing_fee_percentage') || 'Processing Fee (%)'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            value={data.processing_fee_percentage}
                                            onChange={(e) => setData('processing_fee_percentage', e.target.value)}
                                            className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            placeholder="0.00"
                                        />
                                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500">%</span>
                                    </div>
                                    {errors.processing_fee_percentage && (
                                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.processing_fee_percentage}
                                        </p>
                                    )}
                                </div>

                                {/* Processing Fee Fixed */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        {t('processing_fee_fixed') || 'Processing Fee (Fixed)'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.processing_fee_fixed}
                                            onChange={(e) => setData('processing_fee_fixed', e.target.value)}
                                            className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            placeholder="0.00"
                                        />
                                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500">{generalSettings?.default_currency || 'SYP'}</span>
                                    </div>
                                    {errors.processing_fee_fixed && (
                                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.processing_fee_fixed}
                                        </p>
                                    )}
                                </div>

                                {/* Minimum Order Amount */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        {t('minimum_order_amount') || 'Minimum Order Amount'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.minimum_order_amount}
                                            onChange={(e) => setData('minimum_order_amount', e.target.value)}
                                            className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            placeholder="0.00"
                                        />
                                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500">{generalSettings?.default_currency || 'SYP'}</span>
                                    </div>
                                    {errors.minimum_order_amount && (
                                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.minimum_order_amount}
                                        </p>
                                    )}
                                </div>

                                {/* Maximum Order Amount */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        {t('maximum_order_amount') || 'Maximum Order Amount'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.maximum_order_amount}
                                            onChange={(e) => setData('maximum_order_amount', e.target.value)}
                                            className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            placeholder="10000.00"
                                        />
                                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500">{generalSettings?.default_currency || 'SYP'}</span>
                                    </div>
                                    {errors.maximum_order_amount && (
                                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.maximum_order_amount}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Refund Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <RefreshCw className="w-5 h-5 text-orange-600" />
                                {t('refund_settings') || 'Refund Settings'}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">{t('configure_refund_policies') || 'Configure refund policies and settings'}</p>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Enable Refunds */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900">
                                        {t('enable_refunds') || 'Enable Refunds'}
                                    </label>
                                    <p className="text-sm text-slate-600 mt-1">
                                        {t('allow_customer_refunds') || 'Allow customers to request refunds'}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.enable_refunds}
                                        onChange={(e) => setData('enable_refunds', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                </label>
                            </div>

                            {data.enable_refunds && (
                                <>
                                    {/* Refund Days Limit */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                                            {t('refund_days_limit') || 'Refund Days Limit'}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="1"
                                                max="365"
                                                value={data.refund_days_limit}
                                                onChange={(e) => setData('refund_days_limit', e.target.value)}
                                                className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                placeholder="7"
                                            />
                                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500">{t('days') || 'days'}</span>
                                        </div>
                                        {errors.refund_days_limit && (
                                            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.refund_days_limit}
                                            </p>
                                        )}
                                    </div>

                                    {/* Auto Refund on Cancel */}
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900">
                                                {t('auto_refund_on_cancel') || 'Auto Refund on Cancel'}
                                            </label>
                                            <p className="text-sm text-slate-600 mt-1">
                                                {t('automatically_refund_cancelled_orders') || 'Automatically refund cancelled orders'}
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.auto_refund_on_cancel}
                                                onChange={(e) => setData('auto_refund_on_cancel', e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Payment Security & Notifications */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-slate-600" />
                                {t('security_notifications') || 'Security & Notifications'}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">{t('payment_security_settings') || 'Payment security and notification settings'}</p>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Enable Payment Notifications */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900">
                                        {t('enable_payment_notifications') || 'Enable Payment Notifications'}
                                    </label>
                                    <p className="text-sm text-slate-600 mt-1">
                                        {t('notify_customers_payment_status') || 'Notify customers about payment status'}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.enable_payment_notifications}
                                        onChange={(e) => setData('enable_payment_notifications', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                </label>
                            </div>

                            {/* Payment Timeout */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    {t('payment_timeout') || 'Payment Timeout'}
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="number"
                                        min="1"
                                        max="60"
                                        value={data.payment_timeout_minutes}
                                        onChange={(e) => setData('payment_timeout_minutes', e.target.value)}
                                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                        placeholder="15"
                                    />
                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500">{t('minutes') || 'minutes'}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{t('payment_timeout_description') || 'Time before payment session expires'}</p>
                                {errors.payment_timeout_minutes && (
                                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.payment_timeout_minutes}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold"
                        >
                            {processing ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    <span>{t('saving') || 'Saving...'}</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>{t('save_settings') || 'Save Settings'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

