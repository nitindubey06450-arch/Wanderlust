import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { destinationService } from '../services/destinationService';
import DestinationCard from '../components/DestinationCard';
import { CardSkeleton } from '../components/SkeletonLoader';
import {
  Heart, Compass, ArrowRight, Trash2, CheckSquare, Square,
  AlertTriangle, X, CheckCheck, Loader2
} from 'lucide-react';

// ─── Confirmation Modal ───────────────────────────────────────────────────────
const ConfirmModal = ({ open, title, message, onConfirm, onCancel, danger = true, loading = false }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-sm p-6 space-y-4 animate-in zoom-in-95 duration-200">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${danger ? 'bg-rose-100 dark:bg-rose-900/40' : 'bg-amber-100 dark:bg-amber-900/40'}`}>
          <AlertTriangle className={`w-6 h-6 ${danger ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`} />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${danger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'}`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Removing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Favorites Page ──────────────────────────────────────────────────────
const Favorites = () => {
  const { user, removeBulkFavorites, clearAllFavorites } = useAuth();

  const [favoriteDestinations, setFavoriteDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selection state
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Modal state
  const [modal, setModal] = useState({ open: false, type: null }); // type: 'bulk' | 'clear'
  const [actionLoading, setActionLoading] = useState(false);

  // ── Fetch Favorites ─────────────────────────────────────────────────────────
  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await destinationService.getFavorites();
      if (res.success) {
        setFavoriteDestinations(res.favorites || []);
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [user, fetchFavorites]);

  // ── Selection Helpers ───────────────────────────────────────────────────────
  const toggleSelectMode = () => {
    setSelectMode((prev) => !prev);
    setSelectedIds(new Set());
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(favoriteDestinations.map((d) => d._id)));
  };

  const deselectAll = () => setSelectedIds(new Set());

  const allSelected =
    favoriteDestinations.length > 0 && selectedIds.size === favoriteDestinations.length;

  // ── Delete Handlers ─────────────────────────────────────────────────────────
  const handleBulkDelete = async () => {
    setActionLoading(true);
    try {
      await removeBulkFavorites(Array.from(selectedIds));
      setFavoriteDestinations((prev) => prev.filter((d) => !selectedIds.has(d._id)));
      setSelectedIds(new Set());
      setSelectMode(false);
    } catch (err) {
      console.error('Bulk delete failed:', err);
    } finally {
      setActionLoading(false);
      setModal({ open: false, type: null });
    }
  };

  const handleClearAll = async () => {
    setActionLoading(true);
    try {
      await clearAllFavorites();
      setFavoriteDestinations([]);
      setSelectedIds(new Set());
      setSelectMode(false);
    } catch (err) {
      console.error('Clear all failed:', err);
    } finally {
      setActionLoading(false);
      setModal({ open: false, type: null });
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 text-xs font-bold mb-2">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Saved Bucket List</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Your Favourite Destinations
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {favoriteDestinations.length > 0
                ? `${favoriteDestinations.length} place${favoriteDestinations.length !== 1 ? 's' : ''} saved to your bucket list`
                : 'All your saved travel spots synced across devices in one place.'}
            </p>
          </div>

          <Link
            to="/explore"
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <Compass className="w-4 h-4" />
            <span>Explore More Places</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Toolbar (only when there are favorites) ── */}
        {!loading && favoriteDestinations.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Select Mode Toggle */}
            <button
              onClick={toggleSelectMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all border ${
                selectMode
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={selectMode ? 'Exit selection mode' : 'Enter selection mode'}
            >
              {selectMode ? (
                <>
                  <X className="w-4 h-4" /> Cancel
                </>
              ) : (
                <>
                  <CheckSquare className="w-4 h-4" /> Select
                </>
              )}
            </button>

            {selectMode && (
              <>
                {/* Select / Deselect All */}
                <button
                  onClick={allSelected ? deselectAll : selectAll}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <CheckCheck className="w-4 h-4" />
                  {allSelected ? 'Deselect All' : 'Select All'}
                </button>

                {/* Count badge */}
                {selectedIds.size > 0 && (
                  <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                    {selectedIds.size} selected
                  </span>
                )}

                {/* Delete Selected */}
                <button
                  onClick={() => setModal({ open: true, type: 'bulk' })}
                  disabled={selectedIds.size === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                  title={selectedIds.size === 0 ? 'Select at least one place' : `Delete ${selectedIds.size} selected`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </button>
              </>
            )}

            {/* Clear All — always visible when there are favorites */}
            <button
              onClick={() => setModal({ open: true, type: 'clear' })}
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
              title="Remove all favourites"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <CardSkeleton key={n} />
            ))}
          </div>
        ) : favoriteDestinations.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800 shadow-sm space-y-5 my-8">
            <div className="p-4 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-500 w-16 h-16 mx-auto flex items-center justify-center">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your favourite list is empty</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
              You haven't saved any travel destinations yet. Click the ♥ icon on any destination card to build your travel bucket list.
            </p>
            <Link
              to="/explore"
              className="inline-block px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md"
            >
              Explore Destinations
            </Link>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteDestinations.map((dest) => (
              <div key={dest._id} className="relative group">
                {/* Selection Checkbox Overlay */}
                {selectMode && (
                  <button
                    onClick={() => toggleSelect(dest._id)}
                    aria-label={selectedIds.has(dest._id) ? 'Deselect' : 'Select'}
                    className={`absolute top-3 left-3 z-20 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all shadow-md ${
                      selectedIds.has(dest._id)
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white/90 dark:bg-slate-800/90 border-slate-300 dark:border-slate-600 text-slate-400 hover:border-indigo-500'
                    }`}
                  >
                    {selectedIds.has(dest._id) ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                )}

                {/* Dim overlay when in select mode and selected */}
                {selectMode && selectedIds.has(dest._id) && (
                  <div className="absolute inset-0 z-10 rounded-2xl ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-950 pointer-events-none" />
                )}

                {/* The card — clicking it in select mode toggles selection */}
                <div
                  onClick={selectMode ? () => toggleSelect(dest._id) : undefined}
                  className={selectMode ? 'cursor-pointer' : ''}
                >
                  <DestinationCard destination={dest} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Confirm Modals ── */}
      <ConfirmModal
        open={modal.open && modal.type === 'bulk'}
        title="Delete Selected Places?"
        message={`Are you sure you want to remove ${selectedIds.size} place${selectedIds.size !== 1 ? 's' : ''} from your favourites? This cannot be undone.`}
        onConfirm={handleBulkDelete}
        onCancel={() => setModal({ open: false, type: null })}
        loading={actionLoading}
        danger
      />
      <ConfirmModal
        open={modal.open && modal.type === 'clear'}
        title="Clear All Favourites?"
        message="This will remove every saved destination from your bucket list. Are you sure?"
        onConfirm={handleClearAll}
        onCancel={() => setModal({ open: false, type: null })}
        loading={actionLoading}
        danger
      />
    </div>
  );
};

export default Favorites;
