import React from 'react';
import { Sparkles, ShoppingBag, Palette, RefreshCw, BookmarkCheck, Sliders } from 'lucide-react';

interface NavbarProps {
  savedCount: number;
  totalBudget: number;
  onOpenMoodboard: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  savedCount,
  totalBudget,
  onOpenMoodboard,
  onReset
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-900/30 ring-1 ring-amber-400/30">
            <Sparkles className="w-5 h-5 text-stone-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-serif tracking-tight font-semibold text-stone-100">
                Aura Interior
              </h1>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
                AI Studio
              </span>
            </div>
            <p className="text-xs text-stone-400 font-sans hidden sm:block">
              Interactive Room Makeover & Design Consultant
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800 transition-colors border border-stone-800 hover:border-stone-700"
            title="Start New Room Makeover"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Change Room</span>
          </button>

          {/* Moodboard / Saved Items Button */}
          <button
            onClick={onOpenMoodboard}
            className="relative flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold shadow-md transition-all transform active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Saved Items</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-stone-950 text-amber-300 text-[11px] font-bold rounded-full">
                {savedCount}
              </span>
            )}
            {totalBudget > 0 && (
              <span className="hidden sm:inline-block ml-1 pl-1.5 border-l border-stone-950/20 text-[11px]">
                ${totalBudget.toLocaleString()}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
