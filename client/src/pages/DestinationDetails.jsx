import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { destinationService } from '../services/destinationService';
import { useAuth } from '../context/AuthContext';
import ReviewCard from '../components/ReviewCard';
import { DetailSkeleton } from '../components/SkeletonLoader';
import toast from 'react-hot-toast';
import {
  Heart,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Compass,
  CheckCircle2,
  Lightbulb,
  CloudSun,
  Globe,
  MessageSquarePlus,
  Send,
  ArrowLeft,
  Navigation,
  Edit3,
  Trash2,
  Train,
  Bus,
  Plane,
  User,
  ExternalLink,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, toggleFavorite, isFavorite } = useAuth();

  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const destRes = await destinationService.getDestinationById(id);
        if (destRes.success) {
          setDestination(destRes.destination);
        }

        const revRes = await destinationService.getReviews(id);
        if (revRes.success) {
          setReviews(revRes.reviews);
        }
      } catch (err) {
        console.error('Error fetching destination details:', err);
        toast.error('Failed to load destination details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleFavorite = () => {
    if (destination) {
      toggleFavorite(destination._id);
    }
  };

  const handleDeletePlace = async () => {
    if (window.confirm(`Are you sure you want to delete "${destination.name}"? This action cannot be undone.`)) {
      try {
        const res = await destinationService.deleteDestination(id);
        if (res.success) {
          toast.success('Place deleted successfully');
          navigate('/my-places');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete place');
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to submit a review');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await destinationService.addReview(id, { rating, comment });
      if (res.success) {
        toast.success(res.message || 'Review submitted!');
        setComment('');
        // Refresh reviews
        const revRes = await destinationService.getReviews(id);
        if (revRes.success) {
          setReviews(revRes.reviews);
        }
        // Refresh destination rating
        const destRes = await destinationService.getDestinationById(id);
        if (destRes.success) {
          setDestination(destRes.destination);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <DetailSkeleton />;

  if (!destination) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 text-center px-4">
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Destination Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">The destination you are looking for does not exist or has been removed.</p>
          <Link to="/explore" className="inline-block px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl">
            Explore All Places
          </Link>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(destination._id);
  const ownerId = typeof destination.owner === 'object' ? destination.owner?._id : destination.owner;
  const isOwner = user && (ownerId === user._id || isAdmin);
  const ownerInfo = typeof destination.owner === 'object' ? destination.owner : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>

        {/* Title Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                {destination.category}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {destination.region}, {destination.country}
              </span>

              {/* Owner Info Badge */}
              {ownerInfo && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200/80 dark:border-slate-700">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hosted by {ownerInfo.name}</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {destination.name}
            </h1>
          </div>

          {/* Action Buttons: Edit, Delete, Favorite */}
          <div className="flex items-center gap-3">
            {isOwner && (
              <>
                <Link
                  to={`/places/${destination._id}/edit`}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-colors shadow-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Place</span>
                </Link>

                <button
                  onClick={handleDeletePlace}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </>
            )}

            <button
              onClick={handleFavorite}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all ${
                favorite
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:border-rose-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              <span>{favorite ? 'Saved' : 'Save Place'}</span>
            </button>
          </div>
        </div>

        {/* Image Gallery Grid */}
        <div className="space-y-4 mb-12">
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
            <img
              src={destination.images[activeImage] || destination.images[0]}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{destination.rating} / 5.0</span>
            </div>
          </div>

          {/* Image Thumbnails */}
          {destination.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {destination.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === idx ? 'border-emerald-600 ring-2 ring-emerald-500/30 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Left Content */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Overview / Description */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">About {destination.name}</h2>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed whitespace-pre-line">
                {destination.description}
              </p>
            </div>

            {/* Plan Your Journey Section */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">
                  Travel Booking & Transport
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Plan Your Journey to {destination.name}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                  Book official train, bus, or flight tickets directly for your trip.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                
                {/* Train Option */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3 flex flex-col justify-between hover:border-emerald-500 transition-all">
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 w-fit">
                      <Train className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Train</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      Official Indian Railways & Express Trains.
                    </p>
                  </div>

                  <Link
                    to={`/train-ticket?dest=${encodeURIComponent(destination.name)}`}
                    className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Book Train Ticket</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Bus Option */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3 flex flex-col justify-between hover:border-emerald-500 transition-all">
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 w-fit">
                      <Bus className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Bus</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      Intercity Volvo & Sleeper Buses via redBus.
                    </p>
                  </div>

                  <a
                    href={`https://www.redbus.in/bus-tickets?dest=${encodeURIComponent(destination.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Book Bus Ticket</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Flight Option */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3 flex flex-col justify-between hover:border-emerald-500 transition-all">
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 w-fit">
                      <Plane className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Flight</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      Domestic & International Flights.
                    </p>
                  </div>

                  <a
                    href="https://www.makemytrip.com/flights/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Book Flight Ticket</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            </div>

            {/* Attractions & Things To Do Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Popular Attractions */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                  <Compass className="w-5 h-5" />
                  <h3>Popular Attractions</h3>
                </div>
                <ul className="space-y-2.5">
                  {destination.attractions && destination.attractions.map((att, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{att}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Things to Do */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-lg">
                  <Navigation className="w-5 h-5" />
                  <h3>Things to Do</h3>
                </div>
                <ul className="space-y-2.5">
                  {destination.thingsToDo && destination.thingsToDo.map((thing, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                      <span>{thing}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Travel Tips */}
            {destination.travelTips && destination.travelTips.length > 0 && (
              <div className="bg-amber-50/60 dark:bg-amber-950/40 p-6 rounded-3xl border border-amber-200/60 dark:border-amber-900/60 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-base">
                  <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <h3>Essential Travel Tips</h3>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {destination.travelTips.map((tip, i) => (
                    <li key={i} className="text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-medium flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Traveler Reviews ({reviews.length})
                </h2>
                <div className="flex items-center gap-1 font-bold text-amber-500 text-sm bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{destination.rating} rating</span>
                </div>
              </div>

              {/* Add Review Form */}
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                    <MessageSquarePlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Write a Review
                  </h4>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Your Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="p-1 text-amber-400 focus:outline-none"
                        >
                          <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows="3"
                    placeholder="Share your travel experiences and recommendations..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  ></textarea>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-600 dark:text-slate-400">
                  Please{' '}
                  <Link to="/login" className="font-bold text-emerald-600 dark:text-emerald-400 underline">
                    Log In
                  </Link>{' '}
                  to write a review for this destination.
                </div>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <p className="text-slate-400 text-sm italic py-4 text-center">
                  No reviews yet. Be the first adventurer to review {destination.name}!
                </p>
              ) : (
                <div className="space-y-4 pt-2">
                  {reviews.map((rev) => (
                    <ReviewCard key={rev._id} review={rev} />
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar Info Card */}
          <div className="space-y-6">
            
            {/* Quick Trip Specs */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
                Property Quick Specs
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 block">Best Time to Visit</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{destination.bestTimeToVisit}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 block">Nightly Price</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      ${destination.estimatedBudget} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ night</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 block">Category</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{destination.category} Escapes</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleFavorite}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-white' : ''}`} />
                <span>{favorite ? 'Saved in Favorites' : 'Save to Favorites'}</span>
              </button>
            </div>

            {/* Owner Details Box */}
            {ownerInfo && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Listed By</h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <img
                    src={ownerInfo.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={ownerInfo.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{ownerInfo.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{ownerInfo.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Map / Coordinates Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Location Map</h4>
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-200 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
                  alt="Map Location"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-slate-950/20"></div>
                <div className="absolute px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{destination.name}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default DestinationDetails;
