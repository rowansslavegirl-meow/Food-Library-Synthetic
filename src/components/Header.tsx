import React from 'react';
import { ViewMode } from '../types/meal';
import { Plus, BookOpen, Calendar, MapPin } from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onOpenAddModal: () => void;
  mealCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenAddModal,
  mealCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e8e2d9] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('library')}
          className="text-left group flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/30 rounded-md"
          title="Return to Food Library"
        >
          <span className="font-serif-journal text-xl font-semibold tracking-tight text-[#2c2b29] group-hover:text-amber-900 transition-colors whitespace-nowrap shrink-0">
            Food Library
          </span>
          <span className="text-xs text-[#8c827a] font-normal hidden sm:inline">
            · personal diary
          </span>
        </button>

        {/* Zone 2: Primary Nav Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onNavigate('library')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'library'
                ? 'bg-[#ede7de] text-[#2c2b29] font-semibold shadow-xs'
                : 'text-[#6b625b] hover:text-[#2c2b29] hover:bg-[#f2ece3]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-800/80" />
            <span>Library</span>
            <span className="text-[11px] font-mono-numbers text-[#8c827a] hidden md:inline">
              ({mealCount})
            </span>
          </button>

          <button
            onClick={() => onNavigate('daily')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'daily'
                ? 'bg-[#ede7de] text-[#2c2b29] font-semibold shadow-xs'
                : 'text-[#6b625b] hover:text-[#2c2b29] hover:bg-[#f2ece3]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-800/80" />
            <span>Daily Log</span>
          </button>

          <button
            onClick={() => onNavigate('restaurants')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'restaurants'
                ? 'bg-[#ede7de] text-[#2c2b29] font-semibold shadow-xs'
                : 'text-[#6b625b] hover:text-[#2c2b29] hover:bg-[#f2ece3]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-800/80" />
            <span>Restaurants</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-[#3e3832] hover:bg-[#2c2824] active:scale-[0.98] transition-all rounded-lg shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            title="Log a new meal"
          >
            <Plus className="w-4 h-4" />
            <span>Log Meal</span>
          </button>
        </div>
      </div>
    </header>
  );
};
