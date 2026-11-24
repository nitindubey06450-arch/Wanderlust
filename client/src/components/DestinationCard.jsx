import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, DollarSign, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DestinationCard = ({ destination }) => {
  const { toggleFavorite, isFavorite } = useAuth();
  const favorite = isFavorite(destination._id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(destination._id);
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={destination.images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

        {/* Category Badge */}
        <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-100 shadow-md">
          {destination.category}
        </span>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md hover:bg-white text-slate-700 hover:text-rose-500 shadow-md transition-all transform active:scale-95"
          title={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300'
            }`}
          />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{destination.rating}</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{destination.country} • {destination.region}</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 mb-2">
            <Link to={`/destinations/${destination._id}`}>
              {destination.name}
            </Link>
          </h3>

          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
            {destination.description}
          </p>
        </div>

        {/* Card Footer Info */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Est. Budget</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white flex items-center">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400 -mr-0.5" />
              {destination.estimatedBudget}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/ person</span>
            </span>
          </div>

          <Link
            to={`/destinations/${destination._id}`}
            className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-600 text-slate-700 dark:text-slate-200 transition-all shadow-xs"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
