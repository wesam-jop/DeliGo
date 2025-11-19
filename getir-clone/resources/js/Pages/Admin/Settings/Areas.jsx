import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import { 
    MapPin, 
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    Search,
    Filter,
    Map,
    Navigation,
    Clock,
    DollarSign,
    Globe,
    Loader,
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
    Settings
} from 'lucide-react';

export default function Areas({ areas: initialAreas }) {
    const { props } = usePage();
    const { t } = useTranslation();
    const generalSettings = props?.settings || {};
    const [areas, setAreas] = useState(initialAreas || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingArea, setEditingArea] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        name_en: '',
        description: '',
        description_en: '',
        city: '',
        city_en: '',
        address: '',
        latitude: '',
        longitude: '',
        delivery_radius: 5,
        delivery_fee: 0,
        estimated_delivery_time: 10,
        display_order: 0,
        is_active: true,
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const filteredAreas = areas.filter(area => {
        const search = searchTerm.toLowerCase();
        return (
            area.name?.toLowerCase().includes(search) ||
            area.name_en?.toLowerCase().includes(search) ||
            area.city?.toLowerCase().includes(search) ||
            area.address?.toLowerCase().includes(search)
        );
    });

    const openModal = (area = null) => {
        if (area) {
            setEditingArea(area);
            setFormData({
                name: area.name || '',
                name_en: area.name_en || '',
                description: area.description || '',
                description_en: area.description_en || '',
                city: area.city || '',
                city_en: area.city_en || '',
                address: area.address || '',
                latitude: area.latitude || '',
                longitude: area.longitude || '',
                delivery_radius: area.delivery_radius || 5,
                delivery_fee: area.delivery_fee || 0,
                estimated_delivery_time: area.estimated_delivery_time || 10,
                display_order: area.display_order || 0,
                is_active: area.is_active !== undefined ? area.is_active : true,
            });
        } else {
            setEditingArea(null);
            setFormData({
                name: '',
                name_en: '',
                description: '',
                description_en: '',
                city: '',
                city_en: '',
                address: '',
                latitude: '',
                longitude: '',
                delivery_radius: 5,
                delivery_fee: 0,
                estimated_delivery_time: 10,
                display_order: 0,
                is_active: true,
            });
        }
        setErrors({});
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingArea(null);
        setErrors({});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const url = editingArea 
            ? `/admin/settings/areas/${editingArea.id}`
            : '/admin/settings/areas';
        
        const method = editingArea ? 'put' : 'post';

        router[method](url, formData, {
            preserveScroll: true,
            onSuccess: (page) => {
                setAreas(page.props.areas || []);
                closeModal();
                setProcessing(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
        });
    };

    const handleDelete = (area) => {
        if (confirm(t('confirm_delete_area') || `Are you sure you want to delete "${area.name}"?`)) {
            router.delete(`/admin/settings/areas/${area.id}`, {
                preserveScroll: true,
                onSuccess: (page) => {
                    setAreas(page.props.areas || []);
                },
            });
        }
    };

    const toggleActive = (area) => {
        router.put(`/admin/settings/areas/${area.id}`, {
            ...area,
            is_active: !area.is_active,
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                setAreas(page.props.areas || []);
            },
        });
    };

    return (
        <AdminLayout title={t('area_settings') || 'Area Settings'}>
            <Head title={t('area_settings') || 'Area Settings'} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">{t('area_settings') || 'Area Settings'}</h2>
                        <p className="text-slate-600 mt-2">{t('manage_delivery_areas') || 'Manage delivery areas and zones'}</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg font-semibold"
                    >
                        <Plus className="w-5 h-5" />
                        <span>{t('add_area') || 'Add Area'}</span>
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('total_areas') || 'Total Areas'}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{areas.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('active_areas') || 'Active Areas'}</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">
                                    {areas.filter(a => a.is_active).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('inactive_areas') || 'Inactive Areas'}</p>
                                <p className="text-2xl font-bold text-slate-400 mt-1">
                                    {areas.filter(a => !a.is_active).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-500 rounded-lg flex items-center justify-center">
                                <X className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">{t('avg_delivery_time') || 'Avg Delivery Time'}</p>
                                <p className="text-2xl font-bold text-blue-600 mt-1">
                                    {areas.length > 0 
                                        ? Math.round(areas.reduce((sum, a) => sum + (a.estimated_delivery_time || 0), 0) / areas.length)
                                        : 0
                                    } {t('minutes') || 'min'}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('search_areas') || 'Search areas...'}
                            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        />
                    </div>
                </div>

                {/* Areas List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('name') || 'Name'}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('city') || 'City'}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('delivery_radius') || 'Radius'}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('delivery_fee') || 'Fee'}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('delivery_time') || 'Time'}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('status') || 'Status'}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        {t('actions') || 'Actions'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {filteredAreas.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <MapPin className="w-12 h-12 mb-3" />
                                                <p className="text-lg font-semibold">{t('no_areas_found') || 'No areas found'}</p>
                                                <p className="text-sm mt-1">{t('add_first_area') || 'Add your first delivery area'}</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAreas.map((area) => (
                                        <tr key={area.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-900">{area.name}</div>
                                                    {area.name_en && (
                                                        <div className="text-xs text-slate-500">{area.name_en}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-700">{area.city || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-700">{area.delivery_radius || 0} km</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-700">
                                                    {parseFloat(area.delivery_fee || 0).toFixed(2)} {generalSettings?.default_currency || 'SYP'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-700">{area.estimated_delivery_time || 0} {t('minutes') || 'min'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => toggleActive(area)}
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                                        area.is_active
                                                            ? 'bg-green-100 text-green-700 border border-green-200'
                                                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                    }`}
                                                >
                                                    {area.is_active ? (
                                                        <>
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            {t('active') || 'Active'}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <X className="w-3 h-3 mr-1" />
                                                            {t('inactive') || 'Inactive'}
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openModal(area)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title={t('edit') || 'Edit'}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(area)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title={t('delete') || 'Delete'}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">
                                    {editingArea ? (t('edit_area') || 'Edit Area') : (t('add_area') || 'Add Area')}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-purple-600" />
                                        {t('basic_information') || 'Basic Information'}
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('name') || 'Name'} (AR) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                required
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('name') || 'Name'} (EN)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name_en}
                                                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            />
                                            {errors.name_en && (
                                                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.name_en}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('city') || 'City'} (AR)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('city') || 'City'} (EN)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.city_en}
                                                onChange={(e) => setFormData({ ...formData, city_en: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('address') || 'Address'}
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('description') || 'Description'} (AR)
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                rows="3"
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('description') || 'Description'} (EN)
                                            </label>
                                            <textarea
                                                value={formData.description_en}
                                                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                                                rows="3"
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                        <Navigation className="w-5 h-5 text-blue-600" />
                                        {t('location') || 'Location'}
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('latitude') || 'Latitude'}
                                            </label>
                                            <input
                                                type="number"
                                                step="0.00000001"
                                                value={formData.latitude}
                                                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                placeholder="-90 to 90"
                                            />
                                            {errors.latitude && (
                                                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.latitude}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('longitude') || 'Longitude'}
                                            </label>
                                            <input
                                                type="number"
                                                step="0.00000001"
                                                value={formData.longitude}
                                                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                placeholder="-180 to 180"
                                            />
                                            {errors.longitude && (
                                                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.longitude}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Settings */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-green-600" />
                                        {t('delivery_settings') || 'Delivery Settings'}
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('delivery_radius') || 'Delivery Radius'} (km)
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={formData.delivery_radius}
                                                onChange={(e) => setFormData({ ...formData, delivery_radius: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            />
                                            {errors.delivery_radius && (
                                                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.delivery_radius}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('delivery_fee') || 'Delivery Fee'}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={formData.delivery_fee}
                                                    onChange={(e) => setFormData({ ...formData, delivery_fee: e.target.value })}
                                                    className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                />
                                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
                                                    {generalSettings?.default_currency || 'SYP'}
                                                </span>
                                            </div>
                                            {errors.delivery_fee && (
                                                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.delivery_fee}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('estimated_delivery_time') || 'Est. Delivery Time'} (min)
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="300"
                                                value={formData.estimated_delivery_time}
                                                onChange={(e) => setFormData({ ...formData, estimated_delivery_time: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            />
                                            {errors.estimated_delivery_time && (
                                                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.estimated_delivery_time}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Settings */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                        <Settings className="w-5 h-5 text-slate-600" />
                                        {t('additional_settings') || 'Additional Settings'}
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                                {t('display_order') || 'Display Order'}
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.display_order}
                                                onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-900">
                                                    {t('is_active') || 'Active'}
                                                </label>
                                                <p className="text-xs text-slate-600 mt-1">
                                                    {t('enable_disable_area') || 'Enable or disable this area'}
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.is_active}
                                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold"
                                    >
                                        {t('cancel') || 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin" />
                                                <span>{t('saving') || 'Saving...'}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                <span>{t('save') || 'Save'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

