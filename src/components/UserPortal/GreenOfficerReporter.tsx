'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { FacilityType, CrowdLevel, CleanlinessState } from '@/types';
import { 
  ShieldCheck, 
  Droplet, 
  Trash2, 
  AlertTriangle, 
  Star, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Coins, 
  MapPin, 
  Plus, 
  Search, 
  Sparkles,
  Users,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

const FACILITY_OPTIONS: { type: FacilityType; label: string; icon: any; color: string }[] = [
  { type: 'Restroom', label: 'Public Restroom', icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { type: 'Water Source', label: 'Water Hydration Point', icon: Droplet, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
  { type: 'Dustbin', label: 'Waste / Recycling Bin', icon: Trash2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { type: 'Hazard Point', label: 'Hazard / Drainage Spot', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-200' },
];

export const GreenOfficerReporter: React.FC = () => {
  const { reports, addReport, selectedCity } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [officerName, setOfficerName] = useState('Green Officer Elena (Mobile App)');
  const [locationName, setLocationName] = useState('');
  const [facilityType, setFacilityType] = useState<FacilityType>('Restroom');
  const [rating, setRating] = useState<number>(4);
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel>('Moderate');
  const [cleanlinessState, setCleanlinessState] = useState<CleanlinessState>('Acceptable');
  const [missingDustbins, setMissingDustbins] = useState<boolean>(false);
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [awardedCredits, setAwardedCredits] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName.trim()) return;

    addReport({
      officerName,
      locationName,
      city: selectedCity || 'Copenhagen',
      lat: 55.6761 + (Math.random() - 0.5) * 0.04,
      lng: 12.5683 + (Math.random() - 0.5) * 0.04,
      facilityType,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80',
      rating,
      crowdLevel,
      cleanlinessState,
      missingDustbins,
      notes: notes || 'Facility inspected via Green Officer mobile audit checklist.'
    });

    setAwardedCredits(true);
    setShowAddForm(false);
    setLocationName('');
    setNotes('');
    setPhotoUrl('');

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00F29D', '#06B6D4', '#10B981']
      });
    } catch (err) {}

    setTimeout(() => setAwardedCredits(false), 4000);
  };

  const filteredReports = reports.filter(r =>
    r.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.facilityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cleanlinessState.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Green Officer Community Network
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Civic Sanitation &amp; Resource Mapping
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Submit facility inspection reports, flag missing infrastructure, and earn <span className="text-emerald-700 font-bold">+10 Green Credits</span> per verified report.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm hover:brightness-105 active:scale-95 transition"
        >
          {showAddForm ? 'Close Report Form' : '+ New Sanitation Audit'}
        </button>
      </div>

      {/* Reward Banner if just submitted */}
      {awardedCredits && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between animate-fadeIn shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950">
                Civic Report Logged &amp; Verified!
              </h4>
              <p className="text-xs text-emerald-800">
                +10 Green Credits deposited into your wallet for eco-stewardship.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 font-mono text-sm font-extrabold border border-emerald-300">
            +10 Credits
          </span>
        </div>
      )}

      {/* Add New Report Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 sm:p-6 rounded-3xl bg-slate-50 border border-indigo-200 shadow-sm animate-fadeIn">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" /> New Sanitation &amp; Facility Inspection
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Facility / Location Name:
              </label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g., Central Station Underground Restroom"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Facility Type:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FACILITY_OPTIONS.map((f) => (
                  <button
                    key={f.type}
                    type="button"
                    onClick={() => setFacilityType(f.type)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition ${
                      facilityType === f.type
                        ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-xs'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <f.icon className="w-3.5 h-3.5" />
                    {f.type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* Cleanliness State */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cleanliness State:
              </label>
              <select
                value={cleanlinessState}
                onChange={(e) => setCleanlinessState(e.target.value as CleanlinessState)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 shadow-xs"
              >
                <option value="Spotless">Spotless (Clean)</option>
                <option value="Acceptable">Acceptable</option>
                <option value="Needs Attention">Needs Attention</option>
                <option value="Critical">Critical (Urgent Clean)</option>
              </select>
            </div>

            {/* Crowd Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Crowd Level:
              </label>
              <select
                value={crowdLevel}
                onChange={(e) => setCrowdLevel(e.target.value as CrowdLevel)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 shadow-xs"
              >
                <option value="Low">Low Crowd</option>
                <option value="Moderate">Moderate Crowd</option>
                <option value="High">High Crowd / Congested</option>
              </select>
            </div>

            {/* Rating Stars */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Sanitation Rating:
              </label>
              <div className="flex items-center gap-1 py-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-500 hover:scale-110 transition"
                  >
                    <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={missingDustbins}
                onChange={(e) => setMissingDustbins(e.target.checked)}
                className="w-4 h-4 rounded bg-white border-slate-300 text-rose-600 focus:ring-0"
              />
              <span className="font-semibold text-rose-700">
                Flag: Missing / Inadequate Segregated Dustbins at this spot
              </span>
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Observations &amp; Operational Notes:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Soap dispenser empty, tap aerator leaking, heavy pedestrian footfall..."
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm hover:brightness-105"
            >
              <CheckCircle2 className="w-4 h-4" /> Submit Report &amp; Claim +10 Credits
            </button>
          </div>
        </form>
      )}

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nearby sanitation points, restrooms, or water kiosks..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => {
          const badgeColor =
            report.cleanlinessState === 'Spotless'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : report.cleanlinessState === 'Acceptable'
              ? 'bg-cyan-100 text-cyan-800 border-cyan-300'
              : report.cleanlinessState === 'Needs Attention'
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : 'bg-rose-100 text-rose-800 border-rose-300';

          return (
            <div
              key={report.id}
              className="rounded-2xl bg-white border border-slate-200 p-4 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                      {report.facilityType === 'Restroom' && <ShieldCheck className="w-4 h-4 text-indigo-600" />}
                      {report.facilityType === 'Water Source' && <Droplet className="w-4 h-4 text-cyan-600" />}
                      {report.facilityType === 'Dustbin' && <Trash2 className="w-4 h-4 text-emerald-600" />}
                      {report.facilityType === 'Hazard Point' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                        {report.facilityType}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {report.locationName}
                      </h4>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                    {report.cleanlinessState}
                  </span>
                </div>

                {report.photoUrl && (
                  <img
                    src={report.photoUrl}
                    alt={report.locationName}
                    className="w-full h-28 object-cover rounded-xl my-2.5 border border-slate-200"
                  />
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span className="font-bold text-slate-900">{report.rating}.0</span> / 5
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Crowd: {report.crowdLevel}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  "{report.notes}"
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="text-slate-500">{report.officerName}</span>
                <span className={`font-semibold ${
                  report.status === 'RESOLVED' ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {report.status === 'RESOLVED' ? '✓ Verified Resolved' : '● Live Incident'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
