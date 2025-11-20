import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../../Layout';

export default function StoreNoStore() {
    return (
        <Layout>
            <Head title="لم يتم إعداد متجر" />

            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
                <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                    <div className="mx-auto w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                        <svg
                            className="w-10 h-10 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 7h18M3 7l1.664 8.32A2 2 0 006.64 17H17.36a2 2 0 001.975-1.68L21 7M3 7l4-4h10l4 4M7 21h10"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        لم يتم إعداد متجر لك بعد
                    </h1>
                    <p className="text-gray-600 leading-relaxed mb-8">
                        يبدو أنك لم تقم بإنشاء متجر خاص بك حتى الآن. تواصل مع فريق الدعم أو قم بإرسال طلب
                        لإنشاء متجر جديد حتى تتمكن من إدارة منتجاتك وطلباتك من خلال لوحة التحكم.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
                        >
                            تواصل مع الدعم
                        </Link>
                        <Link
                            href="/"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                        >
                            العودة للرئيسية
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}





