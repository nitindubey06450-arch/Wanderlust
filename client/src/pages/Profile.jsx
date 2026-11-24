import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DestinationCard from '../components/DestinationCard';
import { aiService } from '../services/aiService';
import { User, Mail, Shield, Heart, Calendar, Edit3, Save, Sparkles, MapPin, Trash2, Compass, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, favorites, updateProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const [savedTrips, setSavedTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await aiService.getSavedTrips();
        if (res.success) {
          setSavedTrips(res.savedTrips || []);
        }
      } catch (err) {
        console.error('Failed to load saved trips:', err);
      } finally {
        setLoadingTrips(false);
      }
    };
    fetchTrips();
  }, []);

  // Handle local device image file picker
  const handleDeviceImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Base64 Data URL representation of device image
        toast.success('Picture selected from your device!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const payload = { name, avatar };
      if (password.trim()) {
        payload.password = password;
      }

      await updateProfile(payload);
      setEditing(false);
      setPassword('');
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTrip = async (id) => {
    if (window.confirm('Delete this saved travel plan?')) {
      try {
        const res = await aiService.deleteSavedTrip(id);
        if (res.success) {
          setSavedTrips(prev => prev.filter(t => t._id !== id));
          toast.success('Saved trip deleted');
        }
      } catch (err) {
        toast.error('Failed to delete trip');
      }
    }
  };

  const formattedJoinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
    : 'Member';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Profile Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            <div className="relative group">
              <img
                src={avatar || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={user?.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-emerald-500 shadow-md"
              />
            </div>

            <div className="flex-grow text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {user?.name}
                </h1>
                <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 w-fit mx-auto sm:mx-0">
                  {user?.role === 'admin' ? '🛡️ Admin' : '✈️ Explorer'}
                </span>
              </div>

              <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {user?.email}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Joined {formattedJoinDate}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  {favorites.length} Saved Places
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {savedTrips.length} AI Trip Plans
                </span>
              </div>
            </div>

            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-2 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors self-center sm:self-start"
            >
              <Edit3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{editing ? 'Cancel Editing' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Edit Profile Form with Device Image File Picker */}
        {editing && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
              Edit Profile & Change Avatar
            </h3>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* Upload Profile Picture from Device */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Profile Picture (Upload from Device)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm transition-all">
                    <Upload className="w-4 h-4" />
                    <span>Choose Photo from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDeviceImageUpload}
                      className="hidden"
                    />
                  </label>

                  {avatar && (
                    <img
                      src={avatar}
                      alt="Preview"
                      className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                    />
                  )}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Select any image file from your phone, laptop, or computer.
                </span>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Or Enter Avatar Image URL
                </label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  New Password (Optional)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Saved AI Travel Plans Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Saved AI Travel Plans ({savedTrips.length})
            </h2>
          </div>

          {savedTrips.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-100 dark:border-slate-800 space-y-3">
              <Compass className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No AI Trip Plans Saved Yet</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto">
                Ask <strong>Wanderlust AI</strong> to plan a trip for you, then click "Save Itinerary to Profile".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedTrips.map((trip) => (
                <div
                  key={trip._id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-md transition-shadow relative"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                        {trip.duration} • {trip.budget}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">{trip.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Destination: {trip.destination}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteTrip(trip._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60 max-h-40 overflow-y-auto text-xs text-slate-700 dark:text-slate-200 space-y-1 font-sans">
                    <p className="whitespace-pre-wrap leading-relaxed">{trip.itinerary}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Favorite Places Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Saved Destinations ({favorites.length})
            </h2>
          </div>

          {favorites.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="p-4 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-500 w-16 h-16 mx-auto flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No saved favorites yet</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto">
                Explore our catalog and click the heart icon on any destination card to save your dream spots here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favorites.map((dest) => (
                typeof dest === 'object' && dest._id ? (
                  <DestinationCard key={dest._id} destination={dest} />
                ) : null
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
