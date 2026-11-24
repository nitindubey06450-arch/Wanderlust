import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24 pb-16 px-4 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 border border-slate-100 shadow-xl space-y-6">
        <div className="p-4 rounded-full bg-emerald-50 text-emerald-600 w-20 h-20 mx-auto flex items-center justify-center animate-bounce">
          <Compass className="w-10 h-10" />
        </div>

        <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight">404</h1>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">You've Off-Tracked into Unknown Territory</h2>
          <p className="text-slate-500 text-xs leading-relaxed">
            The page or destination you are searching for might have been moved, renamed, or doesn't exist.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link
            to="/explore"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Destinations</span>
          </Link>
          <Link
            to="/"
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
