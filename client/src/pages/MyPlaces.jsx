import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { destinationService } from '../services/destinationService';
import { Building, PlusCircle, Eye, Edit3, Trash2, MapPin, DollarSign, Loader2, Sparkles, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const MyPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyPlaces = async () => {
    try {
      const res = await destinationService.getMyPlaces();
      if (res.success) {
        setPlaces(res.destinations || []);
      }
    } catch (err) {
      toast.error('Failed to load your places');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPlaces();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        const res = await destinationService.deleteDestination(id);
        if (res.success) {
          toast.success('Place deleted successfully');
          setPlaces(prev => prev.filter(p => p._id !== id));
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete place');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center pt-24">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              <Building className="w-3.5 h-3.5" />
              <span>Owner Dashboard</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              My Places ({places.length})
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              Manage, edit, or delete listings you have created on Wanderlust.
            </p>
          </div>

          <Link
            to="/places/new"
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 self-start sm:self-auto transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Place</span>
          </Link>
        </div>

        {/* Places Grid */}
        {places.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="p-4 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 w-16 h-16 mx-auto flex items-center justify-center">
              <Building className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Places Added Yet</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
              You haven't created any property or travel listings yet. Share your first destination to start hosting travelers!
            </p>
            <Link
              to="/places/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all mt-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Your First Place</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <div
                key={place._id}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                {/* Image Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={place.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-100 shadow-md">
                    {place.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3 flex-grow">
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{place.region}, {place.country}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
                    {place.name}
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {place.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center">
                      <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400 -mr-0.5" />
                      {place.estimatedBudget}
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/ night</span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <Link
                    to={`/destinations/${place._id}`}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </Link>

                  <Link
                    to={`/places/${place._id}/edit`}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(place._id, place.name)}
                    className="py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                    title="Delete Place"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyPlaces;
