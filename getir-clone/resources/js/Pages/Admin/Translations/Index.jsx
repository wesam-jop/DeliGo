import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { 
    Globe, 
    Save, 
    Plus, 
    Trash2, 
    Edit3, 
    Check, 
    X,
    Search,
    Filter
} from 'lucide-react';

export default function TranslationsIndex({ translations, locales }) {
    const [activeLocale, setActiveLocale] = useState('ar');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingKey, setEditingKey] = useState(null);
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        translations: translations || {}
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/translations/update', {
            onSuccess: () => {
                // Show success message
            }
        });
    };

    const handleAddTranslation = () => {
        if (newKey && newValue) {
            setData('translations', {
                ...data.translations,
                [activeLocale]: {
                    ...data.translations[activeLocale],
                    [newKey]: newValue
                }
            });
            setNewKey('');
            setNewValue('');
        }
    };

    const handleDeleteTranslation = (key) => {
        const updatedTranslations = { ...data.translations };
        if (updatedTranslations[activeLocale]) {
            delete updatedTranslations[activeLocale][key];
        }
        setData('translations', updatedTranslations);
    };

    const filteredTranslations = data.translations[activeLocale] 
        ? Object.entries(data.translations[activeLocale]).filter(([key, value]) =>
            key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            value.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    return (
        <AdminLayout title="Translations">
            <Head title="Translations Management" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Translations Management</h1>
                        <p className="text-gray-600">Manage your website translations and multilingual content.</p>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {processing ? 'Saving...' : 'Save All'}
                    </button>
                </div>

                {/* Locale Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex">
                            {locales.map((locale) => (
                                <button
                                    key={locale}
                                    onClick={() => setActiveLocale(locale)}
                                    className={`flex items-center py-4 px-6 border-b-2 font-medium text-sm ${
                                        activeLocale === locale
                                            ? 'border-purple-500 text-purple-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Globe className="w-4 h-4 mr-2" />
                                    {locale.toUpperCase()}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Search and Add */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search translations..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <input
                                    type="text"
                                    placeholder="Key"
                                    value={newKey}
                                    onChange={(e) => setNewKey(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <input
                                    type="text"
                                    placeholder="Value"
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleAddTranslation}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Translations List */}
                        <div className="space-y-3">
                            {filteredTranslations.map(([key, value]) => (
                                <div key={key} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <span className="font-medium text-gray-900 min-w-0 flex-1">
                                                {key}
                                            </span>
                                            <span className="text-gray-500">:</span>
                                            <span className="text-gray-700 min-w-0 flex-1">
                                                {editingKey === key ? (
                                                    <input
                                                        type="text"
                                                        value={value}
                                                        onChange={(e) => setData('translations', {
                                                            ...data.translations,
                                                            [activeLocale]: {
                                                                ...data.translations[activeLocale],
                                                                [key]: e.target.value
                                                            }
                                                        })}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    value
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        {editingKey === key ? (
                                            <>
                                                <button
                                                    onClick={() => setEditingKey(null)}
                                                    className="p-2 text-green-600 hover:text-green-700"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingKey(null)}
                                                    className="p-2 text-gray-400 hover:text-gray-600"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => setEditingKey(key)}
                                                    className="p-2 text-blue-600 hover:text-blue-700"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTranslation(key)}
                                                    className="p-2 text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            {filteredTranslations.length === 0 && (
                                <div className="text-center py-12">
                                    <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No translations found
                                    </h3>
                                    <p className="text-gray-500">
                                        {searchTerm ? 'Try adjusting your search terms.' : 'Add your first translation above.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
