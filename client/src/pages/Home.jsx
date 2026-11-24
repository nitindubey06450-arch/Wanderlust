import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VideoHero from '../components/VideoHero';
import DestinationCard from '../components/DestinationCard';
import { CardSkeleton } from '../components/SkeletonLoader';
import { destinationService } from '../services/destinationService';
import {
  Compass,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Globe2,
  HeartHandshake,
  Luggage,
  Sun,
  Mountain,
  Palmtree,
  Landmark,
  Building2,
  Gem
} from 'lucide-react';

const categories = [
  { name: 'Beach',    icon: Palmtree,  color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',   count: '4+ Places' },
  { name: 'Mountain', icon: Mountain,  color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', count: '5+ Places' },
  { name: 'Cultural', icon: Landmark,  color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', count: '8+ Places' },
  { name: 'City',     icon: Building2, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',       count: '4+ Places' },
  { name: 'Luxury',   icon: Gem,       color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',       count: '3+ Places' },
  { name: 'Nature',   icon: Sun,       color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',       count: '6+ Places' },
];

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await destinationService.getDestinations({ limit: 8 });
        if (res.success) {
          setTrending(res.destinations.slice(0, 4));
          setTopRated(res.destinations.slice(4, 8));
        }
      } catch (err) {
        console.error('Failed to load home destinations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">

      {/* ── 1. Full-Screen Adventure Video Hero ── */}
      <VideoHero />

      {/* ── 2. Categories Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Explore by Category
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                Pick your vibe for your next grand adventure
              </p>
            </div>
            <Link
              to="/explore"
              className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => navigate(`/explore?category=${cat.name}`)}
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg transition-all text-center group flex flex-col items-center justify-center space-y-2"
                >
                  <div className={`p-3 rounded-2xl ${cat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Trending Destinations Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending Places</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Most Popular Destinations
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Top curated hotspots across all 28 States and 8 Union Territories of India.
            </p>
          </div>
          <Link
            to="/explore"
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white hover:bg-emerald-600 dark:hover:bg-emerald-700 font-bold text-sm transition-all shadow-md"
          >
            Explore All Destinations
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => <CardSkeleton key={n} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map((dest) => (
              <DestinationCard key={dest._id} destination={dest} />
            ))}
          </div>
        )}
      </section>

      {/* ── 4. Why Wanderlust Section ── */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white py-20 relative overflow-hidden border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-emerald-400 text-xs font-extrabold uppercase tracking-widest block mb-2">
              Unforgettable Experiences
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Why Travelers Choose Wanderlust
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              We bring you seamless exploration, verified insights, and handpicked places for lifetime memories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/50 backdrop-blur-md space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 w-fit">
                <Globe2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold">All Indian States Covered</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                From Kashmir to Kanyakumari, Goa beaches to Assam's Kaziranga rhinos and Gujarat's Rann of Kutch.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/50 backdrop-blur-md space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 w-fit">
                <Luggage className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold">Wanderlust AI Companion</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ask our AI assistant for custom itineraries, budget estimates, and save your travel plans.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/50 backdrop-blur-md space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 w-fit">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold">Saved Favorites & Dark Mode</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Seamless theme toggling and real-time saved favorite syncing across all devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Top Rated Destinations ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Highest Rated</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Top Rated Experiences
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Top 5-star destination ratings loved by global adventurers.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => <CardSkeleton key={n} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRated.map((dest) => (
              <DestinationCard key={dest._id} destination={dest} />
            ))}
          </div>
        )}
      </section>

      {/* ── 6. CTA Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 dark:from-emerald-950 dark:via-teal-950 dark:to-slate-950 p-8 sm:p-14 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              Ready to Start Your Next Adventure?
            </h2>
            <p className="text-emerald-100 text-base sm:text-lg">
              Explore authentic destinations across all 28 States and 8 Union Territories in India with Wanderlust AI.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/register"
                className="px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold rounded-2xl shadow-lg transition-all"
              >
                Create Free Account
              </Link>
              <Link
                to="/explore"
                className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 transition-all backdrop-blur-md"
              >
                Explore Destinations
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
