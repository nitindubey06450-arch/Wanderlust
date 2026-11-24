import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { destinationService } from '../services/destinationService';
import toast from 'react-hot-toast';
import {
  Shield,
  Users,
  MapPin,
  Heart,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Sparkles,
  DollarSign,
  Star,
  Search,
  Globe
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDestinations: 0,
    totalFavorites: 0,
    totalReviews: 0
  });

  const [destinations, setDestinations] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('destinations'); // 'destinations' | 'users'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    region: '',
    category: 'Beach',
    estimatedBudget: 500,
    bestTimeToVisit: '',
    description: '',
    images: '',
    attractions: '',
    thingsToDo: '',
    travelTips: '',
    latitude: 0,
    longitude: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await authService.getAdminStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }

      const destRes = await destinationService.getDestinations({ limit: 100 });
      if (destRes.success) {
        setDestinations(destRes.destinations);
      }

      const usersRes = await authService.getAdminUsers();
      if (usersRes.success) {
        setUsersList(usersRes.users);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
      toast.error('Failed to fetch admin stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      country: '',
      region: '',
      category: 'Beach',
      estimatedBudget: 500,
      bestTimeToVisit: '',
      description: '',
      images: '',
      attractions: '',
      thingsToDo: '',
      travelTips: '',
      latitude: 0,
      longitude: 0
    });
    setEditingId(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEditModal = (dest) => {
    setEditingId(dest._id);
    setFormData({
      name: dest.name,
      country: dest.country,
      region: dest.region,
      category: dest.category,
      estimatedBudget: dest.estimatedBudget,
      bestTimeToVisit: dest.bestTimeToVisit,
      description: dest.description,
      images: Array.isArray(dest.images) ? dest.images.join(', ') : dest.images,
      attractions: Array.isArray(dest.attractions) ? dest.attractions.join(', ') : dest.attractions,
      thingsToDo: Array.isArray(dest.thingsToDo) ? dest.thingsToDo.join(', ') : dest.thingsToDo,
      travelTips: Array.isArray(dest.travelTips) ? dest.travelTips.join(', ') : dest.travelTips,
      latitude: dest.latitude || 0,
      longitude: dest.longitude || 0
    });
    setModalOpen(true);
  };

  const handleDeleteDestination = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const res = await destinationService.deleteDestination(id);
        if (res.success) {
          toast.success(`Deleted ${name}`);
          fetchData();
        }
      } catch (err) {
        toast.error(err.message || 'Failed to delete destination');
      }
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const imagesArray = typeof formData.images === 'string'
      ? formData.images.split(',').map(s => s.trim()).filter(Boolean)
      : formData.images;

    const payload = {
      ...formData,
      images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'],
      attractions: typeof formData.attractions === 'string' ? formData.attractions.split(',').map(s => s.trim()).filter(Boolean) : formData.attractions,
      thingsToDo: typeof formData.thingsToDo === 'string' ? formData.thingsToDo.split(',').map(s => s.trim()).filter(Boolean) : formData.thingsToDo,
      travelTips: typeof formData.travelTips === 'string' ? formData.travelTips.split(',').map(s => s.trim()).filter(Boolean) : formData.travelTips,
      estimatedBudget: Number(formData.estimatedBudget),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude)
    };

    try {
      if (editingId) {
        await destinationService.updateDestination(editingId, payload);
        toast.success('Destination updated successfully!');
      } else {
        await destinationService.createDestination(payload);
        toast.success('New destination created successfully!');
      }

      setModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Wanderlust Admin Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage travel destinations, view platform statistics, and monitor users.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="self-start sm:self-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Destination</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Total Users</span>
              <h3 className="text-2xl font-extrabold text-slate-900">{stats.totalUsers}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Destinations</span>
              <h3 className="text-2xl font-extrabold text-slate-900">{stats.totalDestinations}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-600">
              <Heart className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Total Saved Favorites</span>
              <h3 className="text-2xl font-extrabold text-slate-900">{stats.totalFavorites}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Total Reviews</span>
              <h3 className="text-2xl font-extrabold text-slate-900">{stats.totalReviews}</h3>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab('destinations')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'destinations'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Manage Destinations ({destinations.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Registered Users ({usersList.length})
          </button>
        </div>

        {/* Tab 1: Destinations Table */}
        {activeTab === 'destinations' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">Destination</th>
                    <th className="py-4 px-4">Country / Region</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Est. Budget</th>
                    <th className="py-4 px-4">Rating</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {destinations.map((dest) => (
                    <tr key={dest._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={dest.images[0]}
                            alt={dest.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                          />
                          <span>{dest.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {dest.country}, {dest.region}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-700">
                          {dest.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">
                        ${dest.estimatedBudget}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-600 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {dest.rating}
                      </td>
                      <td className="py-3.5 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(dest)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDestination(dest._id, dest.name)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Users List Table */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">User</th>
                    <th className="py-4 px-4">Email</th>
                    <th className="py-4 px-4">Role</th>
                    <th className="py-4 px-6">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                            alt={u.name}
                            className="w-9 h-9 rounded-full object-cover border border-emerald-500"
                          />
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {u.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          u.role === 'admin' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-slate-500 text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Add / Edit Destination Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                {editingId ? 'Edit Destination' : 'Add New Destination'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Destination Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                    placeholder="e.g. Manali"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                    placeholder="e.g. India"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Region</label>
                  <input
                    type="text"
                    required
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                    placeholder="e.g. Himachal Pradesh"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  >
                    <option value="Beach">Beach</option>
                    <option value="Mountain">Mountain</option>
                    <option value="Cultural">Cultural</option>
                    <option value="City">City</option>
                    <option value="Nature">Nature</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Estimated Budget ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.estimatedBudget}
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Best Time to Visit</label>
                  <input
                    type="text"
                    required
                    value={formData.bestTimeToVisit}
                    onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                    placeholder="e.g. October to June"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Image URLs (comma separated)</label>
                <input
                  type="text"
                  required
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  placeholder="https://image1.jpg, https://image2.jpg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Attractions (comma separated)</label>
                  <input
                    type="text"
                    value={formData.attractions}
                    onChange={(e) => setFormData({ ...formData, attractions: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Things to Do (comma separated)</label>
                  <input
                    type="text"
                    value={formData.thingsToDo}
                    onChange={(e) => setFormData({ ...formData, thingsToDo: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {editingId ? 'Save Changes' : 'Create Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
