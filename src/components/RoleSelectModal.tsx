'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { UserRole, WasteCategory } from '@/types';
import { 
  User, 
  Truck, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Leaf, 
  MapPin, 
  ArrowRight,
  Shield,
  Layers,
  Search,
  Navigation,
  Compass,
  MapPinned,
  Radio,
  X
} from 'lucide-react';
import { ThreeLeafHero } from './ThreeLeafHero';

const ALL_CATEGORIES: WasteCategory[] = [
  'IT Product',
  'Electronic Waste',
  'Transport',
  'Furniture',
  'Glass Product',
  'Biodegradable',
  'Others'
];

const PRESET_LOCATIONS = [
  { name: 'NIT Rourkela', full: 'NIT Rourkela, Odisha', coords: [22.2531, 84.9011] as [number, number] },
  { name: 'Bhubaneswar', full: 'Bhubaneswar, Odisha', coords: [20.2961, 85.8245] as [number, number] },
  { name: 'New Delhi', full: 'New Delhi (NCR), India', coords: [28.6139, 77.2090] as [number, number] },
  { name: 'Mumbai', full: 'Mumbai, Maharashtra', coords: [19.0760, 72.8777] as [number, number] },
  { name: 'Bengaluru', full: 'Bengaluru, Karnataka', coords: [12.9716, 77.5946] as [number, number] },
];

export const RoleSelectModal: React.FC = () => {
  const { 
    isRoleModalOpen, 
    setIsRoleModalOpen, 
    role, 
    setRole, 
    collectorSpecializations, 
    setCollectorSpecializations,
    selectedCity,
    setSelectedCity,
    authorityCoords,
    setAuthorityCoords
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>(role || 'USER');
  const [selectedCats, setSelectedCats] = useState<WasteCategory[]>(collectorSpecializations);
  
  // Location Grid State for Authority
  const [typedCity, setTypedCity] = useState<string>(selectedCity || 'NIT Rourkela, Odisha');
  const [modalCoords, setModalCoords] = useState<[number, number]>(authorityCoords || [22.2531, 84.9011]);
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>(`${selectedCity || 'NIT Rourkela, Odisha'} (${modalCoords[0].toFixed(4)}° N, ${modalCoords[1].toFixed(4)}° E)`);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Initialize and update mini Leaflet map when Authority is selected
  useEffect(() => {
    if (selectedRole !== 'AUTHORITY' || typeof window === 'undefined') return;

    let isMounted = true;

    const timer = setTimeout(() => {
      import('leaflet').then((L) => {
        if (!isMounted || !mapContainerRef.current) return;

        const container = mapContainerRef.current;

        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        if (!mapInstanceRef.current) {
          (container as any)._leaflet_id = null;
          const map = L.map(container, {
            center: modalCoords,
            zoom: 14,
            zoomControl: false,
            attributionControl: false
          });

          L.tileLayer(tileUrl, { maxZoom: 18, subdomains: 'abc' }).addTo(map);

          // Click anywhere on map to pin custom location
          map.on('click', async (e: any) => {
            const { lat, lng } = e.latlng;
            setModalCoords([lat, lng]);
            if (markerRef.current) {
              markerRef.current.setLatLng([lat, lng]);
            }
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`, {
                headers: { 'Accept-Language': 'en' }
              });
              const data = await res.json();
              const place = data.address?.city || data.address?.town || data.address?.suburb || data.display_name?.split(',')[0] || 'Custom Grid Point';
              const fullText = `${place}${data.address?.state ? `, ${data.address.state}` : ''}`;
              setTypedCity(fullText);
              setLocationStatus(`${fullText} (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`);
            } catch {
              setLocationStatus(`Pinned at ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);
            }
          });

          mapInstanceRef.current = map;
        } else {
          mapInstanceRef.current.setView(modalCoords, 14);
          mapInstanceRef.current.invalidateSize();
        }

        // Add custom pulse pin
        const customPin = L.divIcon({
          className: 'modal-pin',
          html: `
            <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; inset: 0; border-radius: 9999px; background: rgba(147, 51, 234, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="width: 26px; height: 26px; border-radius: 9999px; background: #7E22CE; border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); color: white; font-size: 12px; font-weight: bold;">
                📍
              </div>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        if (markerRef.current) {
          markerRef.current.setLatLng(modalCoords);
        } else {
          markerRef.current = L.marker(modalCoords, { icon: customPin }).addTo(mapInstanceRef.current);
        }

        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 120);
      });
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedRole, modalCoords]);

  // If modal is closed and role is actively chosen, hide modal
  if (!isRoleModalOpen && role) return null;

  const toggleCategory = (cat: WasteCategory) => {
    if (selectedCats.includes(cat)) {
      if (selectedCats.length > 1) {
        setSelectedCats(selectedCats.filter(c => c !== cat));
      }
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  const handleSearchLocation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!typedCity.trim()) return;

    setIsGeocoding(true);
    setLocationStatus('Locating coordinates on GIS grid...');

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(typedCity)}&addressdetails=1&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const displayName = data[0].display_name.split(',')[0] || typedCity;

        setModalCoords([lat, lon]);
        setTypedCity(displayName);
        setLocationStatus(`✓ Pinned: ${data[0].display_name.slice(0, 48)}... (${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E)`);
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lon], 14);
          if (markerRef.current) markerRef.current.setLatLng([lat, lon]);
          mapInstanceRef.current.invalidateSize();
        }
      } else {
        setLocationStatus(`Location set to: ${typedCity}`);
      }
    } catch {
      setLocationStatus(`Location set to: ${typedCity}`);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleRequestLiveGPS = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsGeocoding(true);
    setLocationStatus('Connecting to GPS satellite...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setModalCoords([lat, lon]);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const place = data.address?.city || data.address?.town || data.address?.suburb || 'Current Physical Location';
          const fullLabel = `${place}${data.address?.state ? `, ${data.address.state}` : ''}`;
          setTypedCity(fullLabel);
          setLocationStatus(`📍 Live GPS Locked: ${fullLabel} (${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E)`);
        } catch {
          setTypedCity(`GPS Grid [${lat.toFixed(3)}, ${lon.toFixed(3)}]`);
          setLocationStatus(`📍 Live GPS Locked: ${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`);
        } finally {
          setIsGeocoding(false);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([lat, lon], 14);
            if (markerRef.current) markerRef.current.setLatLng([lat, lon]);
            mapInstanceRef.current.invalidateSize();
          }
        }
      },
      () => {
        setIsGeocoding(false);
        setLocationStatus('GPS permission denied. Please type your city above.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handlePresetSelect = (preset: typeof PRESET_LOCATIONS[0]) => {
    setTypedCity(preset.full);
    setModalCoords(preset.coords);
    setLocationStatus(`✓ Pinned: ${preset.full} (${preset.coords[0]}° N, ${preset.coords[1]}° E)`);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(preset.coords, 14);
      if (markerRef.current) markerRef.current.setLatLng(preset.coords);
      mapInstanceRef.current.invalidateSize();
    }
  };

  const handleConfirm = () => {
    if (selectedRole === 'COLLECTOR') {
      setCollectorSpecializations(selectedCats);
    }
    if (selectedRole === 'AUTHORITY') {
      setSelectedCity(typedCity);
      setAuthorityCoords(modalCoords);
    }
    setRole(selectedRole);
    setIsRoleModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-2xl text-slate-900 overflow-hidden my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
        
        {/* Soft Background Accents */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-100 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-cyan-100 rounded-full blur-3xl pointer-events-none" />

        {/* Header with 3D Leaf Badge */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 border-b border-slate-100 pb-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center relative overflow-hidden shadow-sm shrink-0">
            <ThreeLeafHero compact className="w-full h-full" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-emerald-600 animate-pulse" /> Eco-System Access Matrix
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Avyan Prakriti
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select your operational portal to enter the sustainable platform
            </p>
          </div>

          {role && (
            <button
              type="button"
              onClick={() => setIsRoleModalOpen(false)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Role Selection Cards (Light Theme) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          
          {/* 1. User Portal */}
          <div
            onClick={() => setSelectedRole('USER')}
            className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border flex flex-col items-center text-center relative ${
              selectedRole === 'USER'
                ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/30 shadow-md shadow-emerald-500/10 scale-[1.02]'
                : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 hover:border-emerald-300'
            }`}
          >
            {selectedRole === 'USER' && (
              <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5">
              <User className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1">User Portal</h3>
            <p className="text-[11px] text-slate-600 leading-snug">
              AI Waste Scan, Earn Green Credits, Sell &amp; Redeem
            </p>
          </div>

          {/* 2. Collector Portal */}
          <div
            onClick={() => setSelectedRole('COLLECTOR')}
            className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border flex flex-col items-center text-center relative ${
              selectedRole === 'COLLECTOR'
                ? 'bg-cyan-50/90 border-cyan-500 ring-2 ring-cyan-500/30 shadow-md shadow-cyan-500/10 scale-[1.02]'
                : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 hover:border-cyan-300'
            }`}
          >
            {selectedRole === 'COLLECTOR' && (
              <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-cyan-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2.5">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1">Collector Portal</h3>
            <p className="text-[11px] text-slate-600 leading-snug">
              Specialized Dispatch Queue, Pickups &amp; Bonuses
            </p>
          </div>

          {/* 3. Authority Portal */}
          <div
            onClick={() => setSelectedRole('AUTHORITY')}
            className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border flex flex-col items-center text-center relative ${
              selectedRole === 'AUTHORITY'
                ? 'bg-purple-50/90 border-purple-500 ring-2 ring-purple-500/30 shadow-md shadow-purple-500/10 scale-[1.02]'
                : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 hover:border-purple-300'
            }`}
          >
            {selectedRole === 'AUTHORITY' && (
              <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2.5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1">Authority Portal</h3>
            <p className="text-[11px] text-slate-600 leading-snug">
              GIS Smart City Sensor Map, Telemetry &amp; Alerts
            </p>
          </div>
        </div>

        {/* Conditional Collector Options (Light Theme) */}
        {selectedRole === 'COLLECTOR' && (
          <div className="mb-6 p-4 rounded-2xl bg-cyan-50/40 border border-cyan-200 animate-fadeIn">
            <div className="flex items-center gap-2 mb-1.5 text-cyan-900 font-bold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4 text-cyan-700" /> Category Specialization Filter (Multi-Select):
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Select the specific waste categories your facility is licensed to collect and process:
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((cat) => {
                const isSelected = selectedCats.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Interactive Map Location Grid for Authority (Light Theme) */}
        {selectedRole === 'AUTHORITY' && (
          <div className="mb-6 p-4 rounded-2xl bg-purple-50/40 border border-purple-200 animate-fadeIn space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wider">
                <MapPinned className="w-4 h-4 text-purple-700" /> City Grid &amp; Accurate GIS Map:
              </div>
              <span className="text-[10px] text-purple-700 font-mono">
                Click map or search below
              </span>
            </div>

            {/* Quick-select tags */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_LOCATIONS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition ${
                    typedCity.includes(preset.name)
                      ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                      : 'bg-white border-purple-200 text-purple-900 hover:bg-purple-100/60'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Search Input & Live GPS Buttons */}
            <form onSubmit={handleSearchLocation} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={typedCity}
                  onChange={(e) => setTypedCity(e.target.value)}
                  placeholder="Type any city, university or district..."
                  className="w-full bg-white border border-purple-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isGeocoding}
                  className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isGeocoding ? 'Locating...' : 'Pin Grid'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRequestLiveGPS}
                  disabled={isGeocoding}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-purple-50 border border-purple-300 text-purple-900 font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-xs"
                  title="Use Browser Geolocation"
                >
                  <Navigation className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                  <span>Live GPS</span>
                </button>
              </div>
            </form>

            {/* Mini Interactive Map Canvas */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-purple-200 shadow-inner bg-slate-100">
              <div ref={mapContainerRef} className="w-full h-full" />
              <div className="absolute bottom-2 left-2 z-20 px-2.5 py-1 rounded-lg bg-white/95 border border-slate-200 text-[10px] font-mono text-purple-900 shadow-sm backdrop-blur-xs">
                {locationStatus}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 pt-2">
          {role && (
            <button
              type="button"
              onClick={() => setIsRoleModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            className="ml-auto w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Launch {selectedRole === 'USER' ? 'User Portal' : selectedRole === 'COLLECTOR' ? 'Collector Portal' : 'Authority Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
