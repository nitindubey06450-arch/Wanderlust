import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Volume2, VolumeX, Play, Pause, ChevronDown, Search, MapPin,
  Compass, Mountain, Palmtree, Waves, Castle, Church, Footprints, TreePine
} from 'lucide-react';

// ─────────────────────────────────────────────
// Adventure category config (maps to DB values)
// ─────────────────────────────────────────────
const ADVENTURE_CATEGORIES = [
  { label: 'Adventure',  icon: Compass,    dbValue: 'Adventure' },
  { label: 'Nature',     icon: TreePine,   dbValue: 'Nature'    },
  { label: 'Wildlife',   icon: Footprints, dbValue: 'Nature'    },
  { label: 'Heritage',   icon: Castle,     dbValue: 'Historical'},
  { label: 'Spiritual',  icon: Church,     dbValue: 'Cultural'  },
  { label: 'Beaches',    icon: Waves,      dbValue: 'Beach'     },
  { label: 'Mountains',  icon: Mountain,   dbValue: 'Mountain'  },
];

// ─────────────────────────────────────────────
// Fallback poster image (shown when video fails)
// ─────────────────────────────────────────────
const FALLBACK_POSTER =
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80';

// ─────────────────────────────────────────────
// LOCAL video asset — place your mp4 at:
//   client/public/videos/adventure.mp4
// ─────────────────────────────────────────────
const VIDEO_SRC = '/videos/adventure.mp4';

const VideoHero = () => {
  const videoRef = useRef(null);
  const nextSectionRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [muted, setMuted]           = useState(true);
  const [playing, setPlaying]       = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [loaded, setLoaded]         = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Respect prefers-reduced-motion
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Video event handlers ────────────────────
  const handleVideoLoad = () => setLoaded(true);
  const handleVideoError = () => {
    setVideoError(true);
    setLoaded(true);
  };

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    setMuted(next);
  }, [muted]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setPlaying(true);
    }
  }, [playing]);

  // ── Category click ──────────────────────────
  const handleCategoryClick = (cat) => {
    const next = activeCategory === cat.label ? null : cat.label;
    setActiveCategory(next);
    if (next) {
      navigate(`/explore?category=${encodeURIComponent(cat.dbValue)}`);
    } else {
      navigate('/explore');
    }
  };

  // ── Search ──────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      searchQuery.trim()
        ? `/explore?search=${encodeURIComponent(searchQuery.trim())}`
        : '/explore'
    );
  };

  // ── Scroll-to-next ──────────────────────────
  const scrollToNext = () => {
    const target = document.getElementById('wanderlust-content');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ── Autoplay on mount ───────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v || prefersReduced) return;
    v.play().catch(() => setPlaying(false));
  }, [prefersReduced]);

  return (
    <>
      {/* ═══════════════════════════════════════
          FULL-SCREEN VIDEO HERO
      ══════════════════════════════════════ */}
      <section
        className="relative w-full h-screen min-h-[600px] max-h-[1000px] overflow-hidden flex flex-col items-center justify-center"
        aria-label="Adventure Hero Section"
      >
        {/* ── Video / Fallback Background ── */}
        {!prefersReduced && !videoError ? (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            src={VIDEO_SRC}
            poster={FALLBACK_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={handleVideoLoad}
            onError={handleVideoError}
            aria-hidden="true"
          />
        ) : null}

        {/* Fallback image (if video fails or reduced motion) */}
        {(videoError || prefersReduced) && (
          <img
            src={FALLBACK_POSTER}
            alt="Adventure travel background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Loading shimmer while video buffering */}
        {!loaded && !videoError && (
          <div className="absolute inset-0 bg-slate-900 animate-pulse" />
        )}

        {/* ── Dark Cinematic Gradient Overlays ── */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/40 to-slate-950/80 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/40 z-10" />

        {/* ── Hero Content ── */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center text-white flex flex-col items-center gap-6 mt-10">

          {/* Eyebrow text */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide shadow-xl">
            <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Your AI Travel Companion for India &amp; Beyond</span>
          </div>

          {/* Main heading */}
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-amber-400/90">
              EXPLORE THE UNEXPECTED
            </p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight drop-shadow-2xl">
              Adventure{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Awaits
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-200 max-w-2xl leading-relaxed font-light">
            Discover breathtaking destinations, unique stays and unforgettable experiences
            across all 28 States and 8 Union Territories of Incredible India.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-2xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-white/30 flex flex-col sm:flex-row items-center gap-2 text-slate-800 dark:text-slate-100"
          >
            <div className="flex items-center gap-3 px-4 py-2 w-full">
              <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <input
                type="text"
                placeholder="Where do you want to go? (e.g. Manali, Goa, Jaipur, Kashmir)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 flex-shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <Link
              to="/explore"
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-900/40 transition-all text-sm hover:scale-105"
            >
              🌍 Explore Places
            </Link>
            {isAuthenticated && (
              <Link
                to="/places/new"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/25 backdrop-blur-md transition-all text-sm hover:scale-105"
              >
                ＋ Add Your Place
              </Link>
            )}
          </div>
        </div>

        {/* ── Video Controls (Bottom-Right) ── */}
        <div className="absolute bottom-32 right-5 sm:right-8 z-30 flex items-center gap-2" role="group" aria-label="Video controls">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            disabled={videoError || prefersReduced}
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all disabled:opacity-40"
            aria-label={playing ? 'Pause video' : 'Play video'}
            title={playing ? 'Pause video' : 'Play video'}
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Mute/Unmute */}
          <button
            onClick={toggleMute}
            disabled={videoError || prefersReduced}
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all disabled:opacity-40"
            aria-label={muted ? 'Unmute video' : 'Mute video'}
            title={muted ? 'Unmute video' : 'Mute video'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* ── Adventure Category Strip (at bottom of hero) ── */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-slate-950/90 via-slate-950/70 to-transparent pt-12 pb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 sm:justify-center">
              {ADVENTURE_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    onClick={() => handleCategoryClick(cat)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 border ${
                      isActive
                        ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-900/40 scale-105'
                        : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:text-white backdrop-blur-md'
                    }`}
                    aria-pressed={isActive}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-300'}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Scroll Indicator ── */}
        <button
          onClick={scrollToNext}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors group"
          aria-label="Scroll to explore content"
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 animate-bounce group-hover:text-emerald-400" />
        </button>
      </section>

      {/* Anchor for scroll-to-next */}
      <div id="wanderlust-content" />
    </>
  );
};

export default VideoHero;
