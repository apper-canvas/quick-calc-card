import React from "react";

const Loading = ({ variant = "default", className = "" }) => {
  if (variant === "table") {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
          <div className="col-span-2 h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
          <div className="col-span-3 h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
          <div className="col-span-2 h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
          <div className="col-span-2 h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="grid grid-cols-12 gap-4">
            <div className="col-span-3 h-12 bg-gradient-to-r from-slate-100 to-slate-200 rounded"></div>
            <div className="col-span-2 h-12 bg-gradient-to-r from-slate-100 to-slate-200 rounded"></div>
            <div className="col-span-3 h-12 bg-gradient-to-r from-slate-100 to-slate-200 rounded"></div>
            <div className="col-span-2 h-12 bg-gradient-to-r from-slate-100 to-slate-200 rounded"></div>
            <div className="col-span-2 h-12 bg-gradient-to-r from-slate-100 to-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "calendar") {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="grid grid-cols-7 gap-4 mb-6">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-4">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-slate-200 to-slate-300"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded"></div>
                  <div className="h-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded w-5/6"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
                  <div className="h-8 w-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`min-h-[400px] flex items-center justify-center ${className}`}>
      <div className="text-center space-y-4">
        <div className="relative">
          <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-primary-600 rounded-full opacity-20 animate-ping"></div>
        </div>
        <div className="space-y-2">
          <div className="text-slate-800 font-semibold gradient-text">Loading...</div>
          <div className="text-slate-500 text-sm">Please wait while we prepare your data</div>
        </div>
      </div>
    </div>
  );
};

export default Loading;