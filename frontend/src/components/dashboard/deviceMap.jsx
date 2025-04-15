import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

// Create custom icon using Lucide's MapPin
const createLucideIcon = () => {
  return L.divIcon({
    className: 'custom-icon',
    html: `
      <div style="position: relative;">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="red"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
    `,
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 32], // Point of the icon that will correspond to marker's location
    popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
  });
};

const DeviceMap = ({ latitude, longitude }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !latitude || !longitude) return null;

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden relative">
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        preferCanvas={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          position={[latitude, longitude]}
          icon={createLucideIcon()}
        >
          <Popup className="custom-popup">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" />
              <span>Device Location</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      
      {/* Optional: Add a Lucide icon in the corner */}
      <div className="absolute bottom-2 left-2 bg-white p-1 rounded-lg shadow-sm">
        <MapPin className="w-6 h-6 text-red-600" />
        <span className="text-sm ml-1">Device Location</span>
      </div>
    </div>
  );
};

export default DeviceMap;