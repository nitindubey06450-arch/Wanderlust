import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { aiService } from '../services/aiService';
import DestinationCard from '../components/DestinationCard';
import {
  MapPin, Sparkles, ChevronDown, Loader2, AlertCircle,
  ArrowRight, Flag, Mountain, Landmark, Compass
} from 'lucide-react';

// ─── All 36 Indian States & UTs ─────────────────────────────────────────────
const INDIAN_STATES = [
  // 28 States
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // 8 Union Territories
  'Andaman & Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

// ─── Markdown-to-HTML simple renderer ───────────────────────────────────────
const FormattedText = ({ text }) => {
  if (!text) return null;
  const lines = text.split('\n');

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return (
            <h2 key={i} className="text-lg font-bold text-slate-900 dark:text-white mt-5 mb-2 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-500 shrink-0" />
              {line.replace('## ', '')}
            </h2>
          );
        }
        if (line.startsWith('# ')) {
          return (
            <h1 key={i} className="text-xl font-extrabold text-slate-900 dark:text-white mt-4 mb-2">
              {line.replace('# ', '')}
            </h1>
          );
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <p key={i} className="font-bold text-slate-800 dark:text-slate-200 mt-3 mb-1">
              {line.replace(/\*\*/g, '')}
            </p>
          );
        }
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <li key={i} className="ml-4 text-slate-700 dark:text-slate-300 list-disc">
              {line.replace(/^[-•]\s/, '')}
            </li>
          );
        }
        if (line.trim() === '') {
          return <br key={i} />;
        }
        // Inline bold: **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="text-slate-700 dark:text-slate-300">
            {parts.map((part, j) =>
              part.startsWith('**') && part.endsWith('**') ? (
                <strong key={j} className="font-semibold text-slate-900 dark:text-white">
                  {part.replace(/\*\*/g, '')}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      })}
    </div>
  );
};

// ─── Quick Category Icons ────────────────────────────────────────────────────
const QUICK_PICKS = [
  { label: 'Rajasthan', emoji: '🏰', desc: 'Forts & Deserts' },
  { label: 'Kerala', emoji: '🌴', desc: 'Backwaters & Spice' },
  { label: 'Himachal Pradesh', emoji: '🏔️', desc: 'Snow & Valleys' },
  { label: 'Goa', emoji: '🏖️', desc: 'Beaches & Nightlife' },
  { label: 'Uttar Pradesh', emoji: '🕌', desc: 'Heritage & Culture' },
  { label: 'Uttarakhand', emoji: '⛰️', desc: 'Yoga & Peaks' },
  { label: 'Tamil Nadu', emoji: '🛕', desc: 'Temples & Coast' },
  { label: 'Sikkim', emoji: '🌸', desc: 'Flora & Monasteries' },
];

// ─── Main Component ──────────────────────────────────────────────────────────
const StateTouristExplorer = () => {
  const [selectedState, setSelectedState] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExplore = async (stateName) => {
    const state = stateName || selectedState;
    if (!state) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedState(state);

    try {
      const data = await aiService.getStateTouristPlaces(state);
      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || 'Could not fetch tourist information.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleExplore();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-4">
            <Flag className="w-3.5 h-3.5" />
            Powered by OpenAI
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
            India State Explorer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-xl mx-auto">
            Discover top tourist places for any Indian State or Union Territory — powered by AI. Select a state below to get a comprehensive travel guide.
          </p>
        </div>

        {/* ── Search / Selector ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-8">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Choose a State or Union Territory
          </label>
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="">-- Select a State or UT --</option>
                <optgroup label="States">
                  {INDIAN_STATES.slice(0, 28).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </optgroup>
                <optgroup label="Union Territories">
                  {INDIAN_STATES.slice(28).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <button
              onClick={() => handleExplore()}
              disabled={!selectedState || loading}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Exploring...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Explore
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Quick Picks ── */}
        {!result && !loading && (
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
              Quick Picks — Popular States
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_PICKS.map((pick) => (
                <button
                  key={pick.label}
                  onClick={() => handleExplore(pick.label)}
                  className="flex flex-col items-center justify-center gap-1 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition-all group text-center"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">{pick.emoji}</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">{pick.label}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{pick.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Loading State ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-200 dark:border-emerald-900 animate-pulse" />
              <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-emerald-600 animate-spin" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-semibold">
              AI is generating a guide for <span className="text-emerald-600 dark:text-emerald-400">{selectedState}</span>…
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">This may take a few seconds</p>
          </div>
        )}

        {/* ── Error State ── */}
        {error && !loading && (
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-700 dark:text-rose-400 text-sm">Could not load tourist information</p>
              <p className="text-rose-600 dark:text-rose-500 text-xs mt-1">{error}</p>
              <button
                onClick={() => handleExplore()}
                className="mt-3 text-xs font-semibold text-rose-700 dark:text-rose-400 underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {result && !loading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* State Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 p-8 text-white shadow-lg">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white" />
              </div>
              <div className="relative z-10 flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <MapPin className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">AI Travel Guide</p>
                  <h2 className="text-3xl font-extrabold">{result.state}</h2>
                  <p className="text-emerald-100 text-sm mt-1">
                    {result.matchedDestinations?.length > 0
                      ? `${result.matchedDestinations.length} destination${result.matchedDestinations.length !== 1 ? 's' : ''} found in our listings`
                      : 'Comprehensive AI-generated travel guide'}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Guide Text */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">AI Travel Guide</h3>
                <span className="ml-auto text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  Powered by OpenAI
                </span>
              </div>
              <FormattedText text={result.guide || result.responseText || result.reply} />
            </div>

            {/* Matched Destinations from DB */}
            {result.matchedDestinations?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Mountain className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Wanderlust Listings in {result.state}
                  </h3>
                  <span className="ml-auto text-xs text-slate-400">
                    {result.matchedDestinations.length} place{result.matchedDestinations.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {result.matchedDestinations.map((dest) => (
                    <DestinationCard key={dest._id} destination={dest} />
                  ))}
                </div>
              </div>
            )}

            {/* Explore All CTA */}
            <div className="text-center pt-4">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:scale-105 transition-transform shadow-lg"
              >
                <Compass className="w-4 h-4" />
                Explore All Destinations
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StateTouristExplorer;
