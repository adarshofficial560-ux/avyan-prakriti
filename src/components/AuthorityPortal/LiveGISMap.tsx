'use client';

import React, { useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { SensorMarker, GreenOfficerReport } from '@/types';
import { Activity, Layers, Maximize2, Compass } from 'lucide-react';

interface LiveGISMapProps {
  sensors: SensorMarker[];
  reports: GreenOfficerReport[];
  selectedCity: string;
  customCoordinates?: [number, number] | null;
  onSelectSensor: (sensor: SensorMarker) => void;
  selectedSensorId: string | null;
}

export const LiveGISMap: React.FC<LiveGISMapProps> = ({
  sensors,
  reports,
  selectedCity,
  customCoordinates,
  onSelectSensor,
  selectedSensorId,
}) => {
  const { authorityCoords } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const centerCoords: [number, number] = customCoordinates || authorityCoords || [22.2531, 84.9011];

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically load leaflet on the client
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      const container = mapContainerRef.current;

      // Ensure leaflet CSS link is present
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Official, accurate OpenStreetMap tile infrastructure
      const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      if (!mapInstanceRef.current) {
        (container as any)._leaflet_id = null;

        const map = L.map(container, {
          center: centerCoords,
          zoom: 15,
          zoomControl: false,
          attributionControl: false
        });

        tileLayerRef.current = L.tileLayer(tileUrl, {
          maxZoom: 19,
          subdomains: 'abc',
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        mapInstanceRef.current = map;
      } else {
        mapInstanceRef.current.setView(centerCoords, 15);
      }

      // Force layout re-calculation to prevent grey or misaligned tiles
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Render City Resource & Sensor Pins localized around the exact active center
      sensors.forEach((sensor, idx) => {
        const isSelected = selectedSensorId === sensor.id;
        
        let typeIcon = '🗑️';
        let typeBadge = 'Smart Waste Compactor';
        if (sensor.type.toLowerCase().includes('toilet') || sensor.type.toLowerCase().includes('sanitation')) {
          typeIcon = '🚻';
          typeBadge = 'Sanitation Block';
        } else if (sensor.type.toLowerCase().includes('water')) {
          typeIcon = '💧';
          typeBadge = 'Water Filtration Hub';
        }

        const statusColor =
          sensor.status === 'Connected'
            ? '#10B981' // Green
            : sensor.status === 'Warning'
            ? '#F59E0B' // Amber
            : '#EF4444'; // Red

        const customIcon = L.divIcon({
          className: 'custom-sensor-icon',
          html: `
            <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <div style="position: absolute; inset: 0; border-radius: 14px; background-color: ${statusColor}33; transform: scale(${isSelected ? 1.35 : 1}); transition: all 0.3s ease;"></div>
              <div style="width: 32px; height: 32px; border-radius: 12px; background: #FFFFFF; border: 2.5px solid ${statusColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.18); font-size: 15px;">
                <span>${typeIcon}</span>
              </div>
              <div style="position: absolute; top: -3px; right: -3px; width: 10px; height: 10px; border-radius: 9999px; background-color: ${statusColor}; border: 1.5px solid #ffffff;"></div>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });

        // Spatial offsets in municipal grid perimeter
        const latOffset = (idx === 0 ? 0.0012 : idx === 1 ? -0.0024 : idx === 2 ? 0.0032 : idx === 3 ? -0.0016 : 0.0022);
        const lngOffset = (idx === 0 ? -0.0011 : idx === 1 ? 0.0026 : idx === 2 ? 0.0018 : idx === 3 ? -0.0034 : -0.0022);

        const markerLat = centerCoords[0] + latOffset;
        const markerLng = centerCoords[1] + lngOffset;

        const marker = L.marker([markerLat, markerLng], { icon: customIcon }).addTo(mapInstanceRef.current);
        
        marker.bindTooltip(`
          <div style="font-family: inherit; padding: 3px;">
            <div style="font-weight: 800; font-size: 11px; color: #1E293B;">${typeBadge}</div>
            <div style="font-size: 10px; color: ${statusColor}; font-weight: bold;">${sensor.name} (${sensor.status})</div>
            <div style="font-size: 10px; color: #64748B;">Cleanliness: ${sensor.cleanlinessScore}/100</div>
          </div>
        `, {
          direction: 'top',
          offset: [0, -16],
          className: 'custom-light-tooltip'
        });

        marker.on('click', () => {
          onSelectSensor({
            ...sensor,
            lat: markerLat,
            lng: markerLng,
          });
        });

        markersRef.current.push(marker);
      });

      // Render Green Officer Field Incident Markers
      reports.forEach((rep, idx) => {
        if (rep.status === 'REPORTED') {
          const reportIcon = L.divIcon({
            className: 'custom-report-icon',
            html: `
              <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                <div style="position: absolute; inset: 0; border-radius: 9999px; background-color: #F43F5E44; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                <div style="width: 26px; height: 26px; border-radius: 8px; background-color: #F43F5E; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(244,63,94,0.5); color: white; font-size: 13px; font-weight: bold;">
                  !
                </div>
              </div>
            `,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
          });

          const repLat = centerCoords[0] + (idx % 2 === 0 ? 0.0026 : -0.0028);
          const repLng = centerCoords[1] + (idx % 2 === 0 ? -0.0022 : 0.0033);

          const repMarker = L.marker([repLat, repLng], { icon: reportIcon }).addTo(mapInstanceRef.current);
          repMarker.bindTooltip(`
            <div style="font-family: inherit; padding: 2px;">
              <div style="font-weight: 800; font-size: 11px; color: #F43F5E;">⚠️ Citizen Alert: ${rep.facilityType}</div>
              <div style="font-size: 10px; color: #334155;">${rep.locationName} (${rep.cleanlinessState})</div>
            </div>
          `, {
            direction: 'top',
            offset: [0, -14],
          });
          markersRef.current.push(repMarker);
        }
      });
    });

    return () => {
      isMounted = false;
    };
  }, [centerCoords, sensors, reports, selectedSensorId]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(centerCoords, 15, { animate: true });
      mapInstanceRef.current.invalidateSize();
    }
  };

  return (
    <div className="relative w-full h-[460px] sm:h-[540px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-md">
      
      {/* Map Target Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Legend Overlay (Light Theme) */}
      <div className="absolute top-4 left-4 z-20 p-3.5 rounded-2xl border bg-white/95 border-slate-200 text-slate-800 shadow-md backdrop-blur-md text-xs space-y-1.5 pointer-events-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 text-slate-600">
          <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> City Resource Map Key
        </div>
        <div className="flex items-center gap-2">
          <span>🚻</span>
          <span className="text-[11px] font-medium text-slate-700">Public Sanitation Block</span>
        </div>
        <div className="flex items-center gap-2">
          <span>💧</span>
          <span className="text-[11px] font-medium text-slate-700">Smart Water Filtration Point</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🗑️</span>
          <span className="text-[11px] font-medium text-slate-700">IoT Smart Waste Compactor</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
          <div className="w-3.5 h-3.5 rounded bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">!</div>
          <span className="text-[11px] font-semibold text-rose-600">Citizen Officer Alert</span>
        </div>
      </div>

      {/* Recenter Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={handleRecenter}
          className="p-2.5 rounded-2xl border shadow-md bg-white/95 hover:bg-slate-50 border-slate-200 text-purple-800 text-xs font-semibold flex items-center gap-1.5 transition backdrop-blur-md"
          title="Recenter Map on Jurisdiction"
        >
          <Compass className="w-4 h-4 text-purple-600 animate-spin-slow" />
          <span className="hidden sm:inline">Recenter</span>
        </button>
      </div>

    </div>
  );
};
