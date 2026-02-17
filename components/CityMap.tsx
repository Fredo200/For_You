"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface CityMapProps {
    latitude: number;
    longitude: number;
    cityName: string;
    isDark: boolean;
}

export default function CityMap({ latitude, longitude, cityName, isDark }: CityMapProps) {
    useEffect(() => {
        // Initialize map
        const map = L.map("city-map").setView([latitude, longitude], 12);

        // Add tile layer (OpenStreetMap)
        L.tileLayer(
            isDark
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution: isDark
                    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }
        ).addTo(map);

        // Custom marker icon
        const customIcon = L.divIcon({
            className: "custom-marker",
            html: `<div style="background: ${isDark ? '#60a5fa' : '#2563eb'}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
        });

        // Add marker
        const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
        marker.bindPopup(`<b>${cityName}</b>`).openPopup();

        // Cleanup on unmount
        return () => {
            map.remove();
        };
    }, [latitude, longitude, cityName, isDark]);

    return (
        <div
            id="city-map"
            className="h-64 w-full rounded-2xl overflow-hidden shadow-lg"
            style={{ zIndex: 0 }}
        />
    );
}
