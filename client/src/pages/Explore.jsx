import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { destinationService } from '../services/destinationService';
import DestinationCard from '../components/DestinationCard';
import FilterPanel from '../components/FilterPanel';
import { CardSkeleton } from '../components/SkeletonLoader';
import { Search, SlidersHorizontal, MapPin, X, ChevronLeft, ChevronRight, Compass } from 'lucide-react';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State initialized from URL query parameters
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    country: searchParams.get('country') || '',
    maxBudget: searchParams.get('maxBudget') || '',
    minRating: searchParams.get('minRating') || '',
    sort: searchParams.get('sort') || '',
    page: parseInt(searchParams.get('page')) || 1
  });

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL params change externally
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      country: searchParams.get('country') || '',
      maxBudget: searchParams.get('maxBudget') || '',
      minRating: searchParams.get('minRating') || '',
      sort: searchParams.get('sort') || '',
      page: parseInt(searchParams.get('page')) || 1
    }));
  }, [searchParams]);

  // Fetch destinations when filters change
  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const queryParams = {};
        if (filters.search) queryParams.search = filters.search;
        if (filters.category && filters.category !== 'All') queryParams.category = filters.category;
        if (filters.country) queryParams.country = filters.country;
        if (filters.maxBudget) queryParams.maxBudget = filters.maxBudget;
        if (filters.minRating) queryParams.minRating = filters.minRating;
        if (filters.sort) queryParams.sort = filters.sort;
        queryParams.page = filters.page;
        queryParams.limit = 9;

        const res = await destinationService.getDestinations(queryParams);
        if (res.success) {
          setDestinations(res.destinations);
          setTotal(res.total);
          setTotalPages(res.pages);
        }
      } catch (err) {
        console.error('Failed to fetch destinations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      country: '',
      maxBudget: '',
      minRating: '',
      sort: '',
      page: 1
    });
    setSearchParams({});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Destinations
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Discover breathtaking places, filter by budget, category, or country ratings.
          </p>
        </div>

        {/* Search Bar & Mobile Filter Trigger */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <form onSubmit={handleSearchSubmit} className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by destination name, country, or keyword..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium shadow-sm"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, search: '', page: 1 }))}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </form>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-md"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filter Places</span>
          </button>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28">
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                onReset={handleResetFilters}
                totalResults={total}
              />
            </div>
          </div>

          {/* Destination Results Grid */}
          <div className="lg:col-span-3 space-y-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <CardSkeleton key={n} />
                ))}
              </div>
            ) : destinations.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-4 my-8">
                <div className="p-4 rounded-full bg-emerald-50 text-emerald-600 w-16 h-16 mx-auto flex items-center justify-center">
                  <Compass className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No destinations found</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  We couldn't find any places matching your criteria. Try adjusting your filters or search keywords.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {destinations.map((dest) => (
                    <DestinationCard key={dest._id} destination={dest} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6">
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                            filters.page === p
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page === totalPages}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Filter Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-slate-950/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs sm:max-w-sm bg-white h-full overflow-y-auto p-6 space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
              totalResults={total}
            />
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold shadow-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
