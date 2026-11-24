import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Train, Search, ArrowRight, ArrowLeft, ArrowLeftRight,
  Calendar, MapPin, ExternalLink, Info, AlertCircle,
  CheckCircle2, Ticket, Clock, Star, Zap
} from 'lucide-react';

// ─── Popular Indian Railway Stations ─────────────────────────────────────────
const POPULAR_STATIONS = [
  'New Delhi (NDLS)', 'Mumbai CST (CSTM)', 'Mumbai Central (BCT)',
  'Howrah (HWH)', 'Chennai Central (MAS)', 'Bangalore City (SBC)',
  'Hyderabad Deccan (HYB)', 'Ahmedabad (ADI)', 'Pune (PUNE)',
  'Jaipur (JP)', 'Lucknow (LKO)', 'Patna (PNBE)',
  'Bhopal (BPL)', 'Nagpur (NGP)', 'Surat (ST)',
  'Varanasi (BSB)', 'Agra Cantt (AGC)', 'Amritsar (ASR)',
  'Chandigarh (CDG)', 'Kolkata (KOAA)', 'Kochi (ERS)',
  'Thiruvananthapuram (TVC)', 'Coimbatore (CBE)', 'Madurai (MDU)',
  'Visakhapatnam (VSKP)', 'Guwahati (GHY)', 'Bhubaneswar (BBS)',
  'Raipur (R)', 'Indore (INDB)', 'Jodhpur (JU)',
];

// ─── Booking Platforms (all working, no CDN block) ───────────────────────────
const BOOKING_PLATFORMS = [
  {
    name: 'RailYatri',
    logo: '🚆',
    desc: 'Live train status, PNR check & booking',
    color: 'bg-orange-500 hover:bg-orange-600',
    badge: 'Most Reliable',
    badgeColor: 'bg-orange-100 text-orange-700',
    getUrl: (from, to, date) => {
      const f = from.split('(')[0].trim();
      const t = to.split('(')[0].trim();
      return `https://www.railyatri.in/train-ticket?source=${encodeURIComponent(f)}&destination=${encodeURIComponent(t)}&journey_date=${date}`;
    },
  },
  {
    name: 'ConfirmTkt',
    logo: '✅',
    desc: 'Waitlist ticket confirmation prediction',
    color: 'bg-green-600 hover:bg-green-700',
    badge: 'Best for Waitlist',
    badgeColor: 'bg-green-100 text-green-700',
    getUrl: (from, to, date) => {
      const f = encodeURIComponent(from.split('(')[0].trim());
      const t = encodeURIComponent(to.split('(')[0].trim());
      return `https://confirmtkt.com/train-ticket?from=${f}&to=${t}&date=${date}`;
    },
  },
  {
    name: 'MakeMyTrip Trains',
    logo: '🌐',
    desc: 'Book trains with cashback & offers',
    color: 'bg-blue-600 hover:bg-blue-700',
    badge: 'Best Deals',
    badgeColor: 'bg-blue-100 text-blue-700',
    getUrl: (from, to, date) => {
      const f = encodeURIComponent(from.split('(')[0].trim().toUpperCase());
      const t = encodeURIComponent(to.split('(')[0].trim().toUpperCase());
      return `https://www.makemytrip.com/railways/results?from=${f}&to=${t}&dateOfJourney=${date}`;
    },
  },
  {
    name: 'IRCTC Official',
    logo: '🇮🇳',
    desc: 'Official Indian Railways booking portal',
    color: 'bg-indigo-600 hover:bg-indigo-700',
    badge: 'Official',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    getUrl: () => 'https://www.irctc.co.in/nget/train-search',
    note: 'Opens IRCTC — may require login',
  },
  {
    name: 'Paytm Trains',
    logo: '💳',
    desc: 'UPI payments, instant confirmation',
    color: 'bg-sky-500 hover:bg-sky-600',
    badge: 'UPI Friendly',
    badgeColor: 'bg-sky-100 text-sky-700',
    getUrl: (from, to, date) => {
      const f = encodeURIComponent(from.split('(')[0].trim());
      const t = encodeURIComponent(to.split('(')[0].trim());
      return `https://tickets.paytm.com/trains/searchtrains?from=${f}&to=${t}&dateofjournay=${date}`;
    },
  },
  {
    name: 'Goibibo Trains',
    logo: '🎫',
    desc: 'GoCash rewards on every booking',
    color: 'bg-red-500 hover:bg-red-600',
    badge: 'Rewards',
    badgeColor: 'bg-red-100 text-red-700',
    getUrl: (from, to) => {
      const f = encodeURIComponent(from.split('(')[0].trim());
      const t = encodeURIComponent(to.split('(')[0].trim());
      return `https://www.goibibo.com/trains/results/?source=${f}&destination=${t}`;
    },
  },
];

// ─── Today's date in YYYY-MM-DD ───────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split('T')[0];
const minDate = todayStr();

// ─── Main Component ───────────────────────────────────────────────────────────
const TrainTicket = () => {
  const [searchParams] = useSearchParams();
  const initialTo = searchParams.get('to') || searchParams.get('dest') || '';
  const initialFrom = searchParams.get('from') || '';

  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState(minDate);
  const [searched, setSearched] = useState(Boolean(initialFrom && initialTo));
  const [swapped, setSwapped] = useState(false);

  useEffect(() => {
    const dest = searchParams.get('to') || searchParams.get('dest');
    if (dest) {
      setTo(dest);
    }
    const src = searchParams.get('from');
    if (src) {
      setFrom(src);
    }
    if (src && dest) {
      setSearched(true);
    }
  }, [searchParams]);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setSwapped(!swapped);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) return;
    setSearched(true);
    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById('booking-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const fromCode = from.match(/\(([^)]+)\)/)?.[1] || from.split('(')[0].trim();
  const toCode = to.match(/\(([^)]+)\)/)?.[1] || to.split('(')[0].trim();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Back Link ── */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </Link>

        {/* ── Page Header ── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold mb-4">
            <Train className="w-3.5 h-3.5" />
            Indian Railways
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
            Book Train Tickets
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-lg mx-auto">
            Search trains between any two Indian cities and book instantly via trusted platforms.
          </p>
        </div>

        {/* ── Notice Banner ── */}
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-6">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-amber-800 dark:text-amber-300 text-sm">
            <strong>Tip:</strong> IRCTC's website sometimes blocks direct links. We've added <strong>5 alternative trusted platforms</strong> (RailYatri, ConfirmTkt, MakeMyTrip, Paytm, Goibibo) that always work reliably for Indian train bookings.
          </p>
        </div>

        {/* ── Search Form ── */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-500" />
            Search Trains
          </h2>

          <form onSubmit={handleSearch} className="space-y-4">
            {/* From / Swap / To */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {/* From */}
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                  From Station
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                  <input
                    list="stations-from"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="e.g. New Delhi (NDLS)"
                    required
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <datalist id="stations-from">
                    {POPULAR_STATIONS.map((s) => <option key={s} value={s} />)}
                  </datalist>
                </div>
              </div>

              {/* Swap Button */}
              <button
                type="button"
                onClick={swap}
                className="sm:mt-6 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-400 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
                title="Swap stations"
              >
                <ArrowLeftRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              {/* To */}
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                  To Station
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  <input
                    list="stations-to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="e.g. Mumbai CST (CSTM)"
                    required
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                  <datalist id="stations-to">
                    {POPULAR_STATIONS.map((s) => <option key={s} value={s} />)}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="max-w-xs">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                Journey Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  min={minDate}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              <Search className="w-4 h-4" />
              Find Trains
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* ── Booking Results ── */}
        {searched && (
          <div id="booking-results" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Route Summary Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Searching Trains For</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xl font-extrabold">{from || '—'}</span>
                <div className="flex items-center gap-1 text-blue-300">
                  <div className="w-8 h-px bg-blue-300" />
                  <Train className="w-5 h-5" />
                  <div className="w-8 h-px bg-blue-300" />
                </div>
                <span className="text-xl font-extrabold">{to || '—'}</span>
                <span className="ml-auto bg-white/20 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Platform Cards */}
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-blue-500" />
                Choose a Booking Platform
                <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-1">
                  — All open in a new tab
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BOOKING_PLATFORMS.map((platform) => {
                  const url = platform.getUrl(from, to, date);
                  return (
                    <div
                      key={platform.name}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-4 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{platform.logo}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-slate-900 dark:text-white text-base">{platform.name}</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${platform.badgeColor} dark:opacity-90`}>
                              {platform.badge}
                            </span>
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{platform.desc}</p>
                          {platform.note && (
                            <p className="text-amber-600 dark:text-amber-400 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {platform.note}
                            </p>
                          )}
                        </div>
                      </div>

                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-2.5 px-4 ${platform.color} text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm`}
                      >
                        <span>Book on {platform.name}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PNR & Live Status Tools */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Quick Railway Tools
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href="https://www.railyatri.in/pnr-status"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all group"
                >
                  <Ticket className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm">PNR Status</p>
                    <p className="text-slate-400 text-xs">Check booking status</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                </a>
                <a
                  href="https://www.railyatri.in/live-train-status"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                >
                  <Clock className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm">Live Train Status</p>
                    <p className="text-slate-400 text-xs">Track your train live</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                </a>
                <a
                  href="https://confirmtkt.com/train-ticket/seat-availability"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm">Seat Availability</p>
                    <p className="text-slate-400 text-xs">Check seats before booking</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                </a>
              </div>
            </div>

            {/* Travel Tips */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                Indian Railways Booking Tips
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Book at least <strong className="text-white">60 days in advance</strong> for Tatkal or premium trains.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> <strong className="text-white">Tatkal quota</strong> opens 1 day before journey (at 10 AM for AC, 11 AM for Sleeper).</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Waitlisted tickets get auto-confirmed as cancellations come in — use ConfirmTkt to predict chances.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Use <strong className="text-white">UPI / Paytm</strong> for fastest checkout without payment failures.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Download the <strong className="text-white">IRCTC Rail Connect</strong> app for the best mobile booking experience.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ── Popular Routes (shown when no search yet) ── */}
        {!searched && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              Popular Train Routes in India
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { from: 'New Delhi (NDLS)', to: 'Mumbai CST (CSTM)', label: 'Rajdhani Express' },
                { from: 'New Delhi (NDLS)', to: 'Jaipur (JP)', label: 'Pink City Express' },
                { from: 'Mumbai CST (CSTM)', to: 'Pune (PUNE)', label: 'Deccan Queen' },
                { from: 'Chennai Central (MAS)', to: 'Bangalore City (SBC)', label: 'Shatabdi Express' },
                { from: 'Howrah (HWH)', to: 'New Delhi (NDLS)', label: 'Duronto Express' },
                { from: 'New Delhi (NDLS)', to: 'Varanasi (BSB)', label: 'Vande Bharat' },
              ].map((route) => (
                <button
                  key={route.label}
                  onClick={() => { setFrom(route.from); setTo(route.to); }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left group"
                >
                  <Train className="w-4 h-4 text-blue-500 shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 dark:text-white text-xs truncate">
                      {route.from.split('(')[0].trim()} → {route.to.split('(')[0].trim()}
                    </p>
                    <p className="text-slate-400 text-xs">{route.label}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TrainTicket;
