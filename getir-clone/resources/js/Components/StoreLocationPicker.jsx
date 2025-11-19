import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const DEFAULT_CENTER = { lat: 33.5138, lng: 36.2765 }; // Damascus as default

export default function StoreLocationPicker({ latitude, longitude, onChange, height = 320 }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    const lat = parseFloat(latitude) || DEFAULT_CENTER.lat;
    const lng = parseFloat(longitude) || DEFAULT_CENTER.lng;

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) {
            return;
        }

        mapRef.current = new maplibregl.Map({
            container: mapContainerRef.current,
            style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
            center: [lng, lat],
            zoom: 12,
            attributionControl: false,
        });

        mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        markerRef.current = new maplibregl.Marker({ color: '#7c3aed' })
            .setLngLat([lng, lat])
            .addTo(mapRef.current);

        mapRef.current.on('click', (event) => {
            const { lng: clickLng, lat: clickLat } = event.lngLat;
            updateMarker(clickLng, clickLat);
            onChange({
                latitude: clickLat.toFixed(6),
                longitude: clickLng.toFixed(6),
            });
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (mapRef.current && markerRef.current && !isNaN(lat) && !isNaN(lng)) {
            markerRef.current.setLngLat([lng, lat]);
            mapRef.current.setCenter([lng, lat]);
        }
    }, [lat, lng]);

    const updateMarker = (newLng, newLat) => {
        if (markerRef.current) {
            markerRef.current.setLngLat([newLng, newLat]);
        }
    };

    return (
        <div
            ref={mapContainerRef}
            className="rounded-2xl border border-slate-200 shadow-inner overflow-hidden"
            style={{ height }}
        />
    );
}


