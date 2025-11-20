import React, { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import StoreLayout from './StoreLayout';
import { useTranslation } from '../../hooks/useTranslation';
import StoreLocationPicker from '../../Components/StoreLocationPicker';
import { MapPin, Star, Trash2, Save, LocateFixed, Loader, Crosshair } from 'lucide-react';

const DEFAULT_COORDS = { lat: 33.5138, lng: 36.2765 };

export default function StoreLocations({ locations: initialLocations }) {
    const { t } = useTranslation();
    const [locations, setLocations] = useState(initialLocations);
    const [mapPosition, setMapPosition] = useState({
        latitude: DEFAULT_COORDS.lat,
        longitude: DEFAULT_COORDS.lng,
    });
    const [geolocateStatus, setGeolocateStatus] = useState(null);

    const createForm = useForm({
        label: '',
        address: '',
        latitude: DEFAULT_COORDS.lat,
        longitude: DEFAULT_COORDS.lng,
        notes: '',
        is_default: initialLocations.length === 0,
    });

    useEffect(() => {
        setLocations(initialLocations);
    }, [initialLocations]);

    const handleMapChange = ({ latitude, longitude }) => {
        createForm.setData({
            ...createForm.data,
            latitude,
            longitude,
        });
        setMapPosition({ latitude, longitude });
        setGeolocateStatus(null);
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
                handleMapChange({
                    latitude: latitude.toFixed(6),
                    longitude: longitude.toFixed(6),
                });
                setGeolocateStatus({
                    type: 'success',
                    message: t('location_geolocate_success') || 'Location updated.',
                });
            },
            () => {
                setGeolocateStatus({
                    type: 'error',
                    message: t('location_geolocate_denied') || 'Unable to retrieve your location.',
                });
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post('/dashboard/customer/locations', {
            preserveScroll: true,
            onSuccess: () => {
                createForm.reset();
                createForm.setData('is_default', locations.length === 0);
                setGeolocateStatus(null);
            },
        });
    };

    const handleDelete = (locationId) => {
        if (!confirm(t('confirm_delete_location') || 'Delete this location?')) {
            return;
        }
        router.delete(`/dashboard/customer/locations/${locationId}`, {
            preserveScroll: true,
        });
    };

    const handleSetDefault = (locationId) => {
        router.post(`/dashboard/customer/locations/${locationId}/default`, {}, { preserveScroll: true });
    };

    return (
        <StoreLayout
            title={t('delivery_locations_title')}
            subtitle={t('delivery_locations_subtitle')}
        >
            <Head title={t('delivery_locations_title')} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-4">
                    {locations.length ? (
                        locations.map((location) => (
                            <div
                                key={location.id}
                                className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-3"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-base font-semibold text-slate-900">{location.label}</p>
                                            <p className="text-xs text-slate-500">
                                                {Number(location.latitude).toFixed(4)}, {Number(location.longitude).toFixed(4)}
                                            </p>
                                        </div>
                                    </div>
                                    {location.is_default && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                                            <Star className="w-3.5 h-3.5" />
                                            {t('default_location_badge') || 'Default'}
                                        </span>
                                    )}
                                </div>
                                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                                    <p className="text-sm text-slate-600">{location.address}</p>
                                    {location.notes && (
                                        <p className="text-xs text-slate-500 border-t border-dashed border-slate-200 pt-2 mt-2">
                                            {location.notes}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                                    {!location.is_default && (
                                        <button
                                            type="button"
                                            onClick={() => handleSetDefault(location.id)}
                                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:border-purple-200 hover:text-purple-700"
                                        >
                                            <Star className="w-4 h-4" />
                                            {t('set_as_default')}
                                        </button>
                                    )}
                                    <button
                                            type="button"
                                            onClick={() => handleDelete(location.id)}
                                            className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 hover:text-rose-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        {t('delete_location')}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center space-y-3">
                            <div className="w-16 h-16 mx-auto rounded-full bg-white shadow flex items-center justify-center text-3xl">
                                <MapPin className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-lg font-semibold text-slate-900">
                                {t('no_saved_locations_hint') || 'No locations saved yet'}
                            </p>
                            <p className="text-sm text-slate-500 max-w-md mx-auto">
                                {t('delivery_locations_intro') || 'Add your frequently used addresses to speed up checkout.'}
                            </p>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                        {t('add_new_location') || 'Add new location'}
                    </h3>
                    <div className="space-y-2">
                        <StoreLocationPicker
                            latitude={createForm.data.latitude || mapPosition.latitude}
                            longitude={createForm.data.longitude || mapPosition.longitude}
                            onChange={handleMapChange}
                            height={220}
                        />
                        <div className="flex flex-wrap items-center gap-3">
                            <p className="text-xs text-slate-500 flex-1">
                                {t('location_map_help') || 'Click on the map to place the pin accurately.'}
                            </p>
                            <button
                                type="button"
                                onClick={handleUseCurrentLocation}
                                className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100"
                            >
                                <LocateFixed className="w-4 h-4" />
                                {t('location_use_current') || 'Use current location'}
                            </button>
                        </div>
                        {geolocateStatus && (
                            <p
                                className={`text-xs font-medium flex items-center gap-1 ${
                                    geolocateStatus.type === 'success'
                                        ? 'text-emerald-600'
                                        : geolocateStatus.type === 'loading'
                                        ? 'text-slate-600'
                                        : 'text-rose-600'
                                }`}
                            >
                                <Crosshair className="w-3 h-3" />
                                {geolocateStatus.message}
                            </p>
                        )}
                    </div>
                    <form onSubmit={handleCreate} className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                {t('location_label') || 'Location name'}
                            </label>
                            <input
                                type="text"
                                value={createForm.data.label}
                                onChange={(e) => createForm.setData('label', e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder={t('location_label_placeholder') || 'e.g., Home, Office'}
                            />
                            {createForm.errors.label && (
                                <p className="text-xs text-rose-600 mt-1">{createForm.errors.label}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                {t('location_address') || t('delivery_address')}
                            </label>
                            <textarea
                                value={createForm.data.address}
                                onChange={(e) => createForm.setData('address', e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder={t('location_address_placeholder') || 'Street, building, floor...'}
                                required
                            />
                            {createForm.errors.address && (
                                <p className="text-xs text-rose-600 mt-1">{createForm.errors.address}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                {t('location_notes') || t('additional_notes')}
                            </label>
                            <textarea
                                value={createForm.data.notes}
                                onChange={(e) => createForm.setData('notes', e.target.value)}
                                rows={2}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder={t('location_notes_placeholder') || 'Apartment number, access code...'}
                            />
                            {createForm.errors.notes && (
                                <p className="text-xs text-rose-600 mt-1">{createForm.errors.notes}</p>
                            )}
                        </div>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                            <input
                                type="checkbox"
                                checked={createForm.data.is_default}
                                onChange={(e) => createForm.setData('is_default', e.target.checked)}
                                className="rounded border-slate-300 text-purple-600 shadow-sm focus:ring-purple-500"
                            />
                            {t('set_as_default') || 'Set as default'}
                        </label>
                        <button
                            type="submit"
                            disabled={createForm.processing}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {createForm.processing ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    <span>{t('saving') || 'Saving...'}</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>{t('save_location') || 'Save location'}</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </StoreLayout>
    );
}

