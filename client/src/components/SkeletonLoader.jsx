import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 p-4 space-y-4 animate-pulse">
      <div className="w-full aspect-[4/3] bg-slate-200 rounded-2xl"></div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-full"></div>
      </div>
      <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
        <div className="h-5 bg-slate-200 rounded w-1/4"></div>
        <div className="h-8 bg-slate-200 rounded-xl w-1/3"></div>
      </div>
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 space-y-8 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-1/4"></div>
      <div className="h-12 bg-slate-200 rounded w-1/2"></div>
      <div className="w-full h-96 bg-slate-200 rounded-3xl"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 bg-slate-200 rounded w-full"></div>
          <div className="h-6 bg-slate-200 rounded w-full"></div>
          <div className="h-6 bg-slate-200 rounded w-2/3"></div>
        </div>
        <div className="h-64 bg-slate-200 rounded-3xl"></div>
      </div>
    </div>
  );
};
