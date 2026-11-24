import React from 'react';
import { Star, User } from 'lucide-react';

const ReviewCard = ({ review }) => {
  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Recent';

  return (
    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={review.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
            alt={review.user?.name || "Traveler"}
            className="w-10 h-10 rounded-full object-cover border border-emerald-500 shadow-sm"
          />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">
              {review.user?.name || 'Anonymous Traveler'}
            </h4>
            <span className="text-[11px] text-slate-400 font-medium">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-0.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 text-amber-700 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{review.rating}.0</span>
        </div>
      </div>

      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic">
        "{review.comment}"
      </p>
    </div>
  );
};

export default ReviewCard;
