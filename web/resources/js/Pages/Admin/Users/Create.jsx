import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { 
    User, 
    ArrowLeft, 
    Save
} from 'lucide-react';
import PhoneInput from '../../../Components/PhoneInput';

export default function CreateUser() {
    const [isPhoneValid, setIsPhoneValid] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        user_type: 'customer',
        is_verified: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/users');
    };

    const handlePhoneChange = (phone) => {
        setData('phone', phone);
    };

    const handlePhoneValidation = (isValid) => {
        setIsPhoneValid(isValid);
    };

    const userTypes = [
        { value: 'customer', label: 'Customer', description: 'Regular customer account' },
        { value: 'store_owner', label: 'Store Owner', description: 'Store owner account' },
        { value: 'driver', label: 'Driver', description: 'Delivery driver account' },
    ];

    return (
        <AdminLayout title="Create User">
            <Head title="Create User" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href="/admin/users"
                            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Users
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
                            <p className="text-gray-600">Add a new user to the system</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">User Information</h2>
                        <p className="text-sm text-gray-600">Enter the user's basic information</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Enter full name"
                                        required
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <PhoneInput
                                    value={data.phone}
                                    onChange={handlePhoneChange}
                                    onValidationChange={handlePhoneValidation}
                                    placeholder="Enter phone number"
                                    error={errors.phone}
                                    disabled={processing}
                                />
                            </div>


                            {/* User Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    User Type *
                                </label>
                                <select
                                    value={data.user_type}
                                    onChange={(e) => setData('user_type', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    required
                                >
                                    {userTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.user_type && (
                                    <p className="mt-1 text-sm text-red-600">{errors.user_type}</p>
                                )}
                            </div>

                            {/* Verification Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Verification Status
                                </label>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_verified"
                                        checked={data.is_verified}
                                        onChange={(e) => setData('is_verified', e.target.checked)}
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="is_verified" className="ml-2 block text-sm text-gray-900">
                                        Mark as verified
                                    </label>
                                </div>
                                {errors.is_verified && (
                                    <p className="mt-1 text-sm text-red-600">{errors.is_verified}</p>
                                )}
                            </div>
                        </div>

                        {/* User Type Description */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">
                                User Type Description
                            </h3>
                            <p className="text-sm text-gray-600">
                                {userTypes.find(type => type.value === data.user_type)?.description}
                            </p>
                        </div>

                        {/* Error Messages */}
                        {errors.message && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-600">{errors.message}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                            <Link
                                href="/admin/users"
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing || !isPhoneValid}
                                className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Create User
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
