"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export interface MapLocation {
  id: string;
  name: string;
  nameEn: string;
  type: "HISTORICAL" | "NATURAL" | "RELIGIOUS" | "RECREATIONAL" | "TOUR";
  latitude: number;
  longitude: number;
  description: string;
  image?: string;
  tourCount?: number;
  province?: string;
}

interface InteractiveMapProps {
  locations: MapLocation[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onLocationClick?: (location: MapLocation) => void;
}

const typeColors: Record<string, string> = {
  HISTORICAL: "#8B5CF6",
  NATURAL: "#10B981",
  RELIGIOUS: "#F59E0B",
  RECREATIONAL: "#3B82F6",
  TOUR: "#EF4444",
};

const typeLabels: Record<string, string> = {
  HISTORICAL: "Historical",
  NATURAL: "Natural",
  RELIGIOUS: "Religious",
  RECREATIONAL: "Recreational",
  TOUR: "Tour Location",
};

function createCustomIcon(type: string) {
  const color = typeColors[type] || "#6B7280";
  return L.divIcon({
    html: `<div style="width:32px;height:32px;background:${color};border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function InteractiveMap({
  locations,
  center = [32.4279, 53.688],
  zoom = 6,
  height = "600px",
}: InteractiveMapProps) {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<string>("ALL");
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState(zoom);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredLocations =
    filter === "ALL"
      ? locations
      : locations.filter((loc) => loc.type === filter);

  const handleTypeFilter = (type: string) => {
    setFilter(type);
    if (type !== "ALL") {
      const filtered = locations.filter((l) => l.type === type);
      if (filtered.length > 0) {
        const avgLat =
          filtered.reduce((sum, l) => sum + l.latitude, 0) / filtered.length;
        const avgLng =
          filtered.reduce((sum, l) => sum + l.longitude, 0) / filtered.length;
        setMapCenter([avgLat, avgLng]);
        setMapZoom(7);
      }
    } else {
      setMapCenter([32.4279, 53.688]);
      setMapZoom(6);
    }
  };

  if (!mounted) {
    return (
      <div
        className="bg-gray-100 rounded-xl flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2" />
          <p className="text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Filter Bar */}
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { value: "ALL", label: "All" },
          { value: "HISTORICAL", label: "Historical" },
          { value: "NATURAL", label: "Natural" },
          { value: "RELIGIOUS", label: "Religious" },
          { value: "RECREATIONAL", label: "Recreational" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => handleTypeFilter(item.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === item.value
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {item.value !== "ALL" && (
              <span
                className="inline-block w-2 h-2 rounded-full mr-1.5"
                style={{ backgroundColor: typeColors[item.value] }}
              />
            )}
            {item.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-gray-200">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height }}
          scrollWheelZoom={true}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapUpdater center={mapCenter} zoom={mapZoom} />
          {filteredLocations.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={createCustomIcon(location.type)}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div
                    className="h-24 rounded-lg mb-2 flex items-center justify-center text-white font-bold text-xl"
                    style={{
                      backgroundColor: typeColors[location.type],
                    }}
                  >
                    {location.nameEn.charAt(0)}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {location.nameEn}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {typeLabels[location.type]}
                    {location.province && ` • ${location.province}`}
                  </p>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                    {location.description}
                  </p>
                  {location.tourCount && (
                    <p className="text-xs text-emerald-600 font-medium mt-2">
                      {location.tourCount} tours available
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            {typeLabels[type]}
          </div>
        ))}
      </div>
    </div>
  );
}
