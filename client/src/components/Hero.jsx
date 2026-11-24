import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, Compass } from 'lucide-react';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const popularSuggestions = ['Manali', 'Goa', 'Jaipur', 'Kashmir', 'Kerala', 'Ladakh', 'Varanasi', 'Darjeeling'];

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80"
          alt="Travel Hero Background"
          className="w-full h-full object-cover object-center scale-105 transform animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-slate-950/80 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs sm:text-sm font-medium mb-6 shadow-xl animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Discover 15+ Handcrafted Global Destinations</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none mb-6">
          Explore the World, <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            One Journey at a Time
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-200 font-normal max-w-2xl mx-auto mb-10 leading-relaxed">
          Discover breathtaking destinations, hidden gems, and unforgettable experiences.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="bg-white/90 backdrop-blur-xl p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/40 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 text-slate-800"
        >
          <div className="flex items-center gap-3 px-4 py-2 w-full">
            <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <input
              type="text"
              placeholder="Where do you want to go? (e.g. Manali, Bali, Paris)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 text-sm sm:text-base focus:outline-none font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl transition-all shadow-md hover:shadow-emerald-600/30 flex items-center justify-center gap-2 flex-shrink-0"
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </form>

        {/* Popular Suggestions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-slate-300">
          <span className="font-semibold text-slate-400">Popular:</span>
          {popularSuggestions.map((place) => (
            <button
              key={place}
              onClick={() => navigate(`/explore?search=${place}`)}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-emerald-600/40 hover:text-white border border-white/10 backdrop-blur-md transition-all font-medium"
            >
              {place}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Hero;
