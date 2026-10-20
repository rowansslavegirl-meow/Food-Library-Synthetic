import React, { useEffect } from 'react';
import { ArrowLeft, Home, ChevronRight, RotateCcw } from 'lucide-react';
import { ViewMode } from '../types/meal';

interface NavigationBackProps {
  currentView: ViewMode;
  targetView: ViewMode;
  targetLabel: string;
  currentTitle?: string;
  onBack: () => void;
  onHome: () => void;
  isSticky?: boolean;
}

export const NavigationBack: React.FC<NavigationBackProps> = ({
  currentView,
  targetView,
  targetLabel,
  currentTitle,
  onBack,
  onHome,
  isSticky = true
}) => {
  // Listen for Escape key to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  const viewNameMap: Record<ViewMode, string> = {
    library: 'Food Library',
    daily: 'Daily Log',
    restaurants: 'Restaurants',
    detail: 'Meal Detail'
  };

  return (
    <div
      className={`${
        isSticky
          ? 'sticky top-15 z-20 bg-[#faf8f5]/90 backdrop-blur-md py-2.5 px-4 sm:px-6 border-b border-[#e8e2d9]/80 shadow-2xs'
          : 'py-2 px-1'
      } transition-all`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Left: Prominent Contextual Back Button */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-[#dfd7cc] text-[#3e3832] hover:bg-[#f3ede4] hover:text-[#201d1a] active:scale-[0.98] transition-all font-medium shadow-2xs cursor-pointer shrink-0"
            title={`Back to ${targetLabel} (Esc)`}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-900" />
            <span>Back to <strong className="font-semibold">{targetLabel}</strong></span>
          </button>

          {/* Breadcrumb path */}
          <div className="hidden md:flex items-center gap-1.5 text-[#7c736c] truncate text-xs">
            <button
              onClick={onHome}
              className="hover:text-[#2c2b29] hover:underline transition-colors shrink-0 cursor-pointer"
            >
              Library
            </button>
            <ChevronRight className="w-3 h-3 text-[#b4aaa0] shrink-0" />
            <span className="shrink-0 text-[#7c736c]">
              {viewNameMap[targetView] || targetLabel}
            </span>
            {currentTitle && (
              <>
                <ChevronRight className="w-3 h-3 text-[#b4aaa0] shrink-0" />
                <span className="font-medium text-[#2c2b29] truncate max-w-[220px]">
                  {currentTitle}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Quick Emergency Return to Home Library */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onHome}
            className="flex items-center gap-1 text-[11px] sm:text-xs text-[#7c736c] hover:text-[#2c2b29] px-2 py-1 rounded hover:bg-[#ede7de] transition-colors cursor-pointer"
            title="Jump directly to Food Library"
          >
            <Home className="w-3 h-3" />
            <span className="hidden sm:inline">All Foods</span>
          </button>
        </div>
      </div>
    </div>
  );
};
