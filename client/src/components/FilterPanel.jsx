import React from 'react';
import { SlidersHorizontal, RotateCcw, DollarSign, Star, Compass, Filter } from 'lucide-react';

const categories = ['All', 'Beach', 'Mountain', 'Cultural', 'City', 'Nature', 'Adventure', 'Luxury'];

const FilterPanel = ({ filters, setFilters, onReset, totalResults }) => {
  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value, page: 1 }));
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Filter Places</h3>
            <span className="text-xs text-slate-400 font-medium">Found {totalResults} destinations</span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
          title="Reset filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleChange('category', cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filters.category === cat || (cat === 'All' && !filters.category)
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={filters.sort || ''}
          onChange={(e) => handleChange('sort', e.target.value)}
          className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
        >
          <option value="">Popularity / Newest</option>
          <option value="rating">Highest Rated</option>
          <option value="price-low">Budget: Low to High</option>
          <option value="price-high">Budget: High to Low</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      {/* Max Budget Slider */}
      <div>
        <div className="flex justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          <span>Max Budget</span>
          <span className="text-emerald-600 font-extrabold text-sm">
            ${filters.maxBudget || 3500}
          </span>
        </div>
        <input
          type="range"
          min="300"
          max="3500"
          step="100"
          value={filters.maxBudget || 3500}
          onChange={(e) => handleChange('maxBudget', e.target.value)}
          className="w-full accent-emerald-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
          <span>$300</span>
          <span>$3,500+</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Minimum Rating
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[0, 4.0, 4.5, 4.8].map((rating) => (
            <button
              key={rating}
              onClick={() => handleChange('minRating', rating === 0 ? '' : rating)}
              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                Number(filters.minRating) === rating || (rating === 0 && !filters.minRating)
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{rating === 0 ? 'All' : `${rating}+`}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Country Filter Input */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Country
        </label>
        <input
          type="text"
          placeholder="e.g. India, Japan, France"
          value={filters.country || ''}
          onChange={(e) => handleChange('country', e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
        />
      </div>

    </div>
  );
};

export default FilterPanel;
