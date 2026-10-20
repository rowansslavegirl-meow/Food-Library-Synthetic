import React, { useState } from 'react';
import { Meal } from '../types/meal';
import { formatDateLabel } from '../utils/storage';
import { ChevronDown, ChevronUp, MapPin, Calendar, HelpCircle, Heart } from 'lucide-react';

interface FoodCardProps {
  meal: Meal;
  onSelectMeal: (mealId: string) => void;
  onNavigateToRestaurant: (restaurantName: string) => void;
  onNavigateToDaily: (date: string) => void;
  onToggleFavorite?: (mealId: string) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  meal,
  onSelectMeal,
  onNavigateToRestaurant,
  onNavigateToDaily,
  onToggleFavorite
}) => {
  const [isQuickExpanded, setIsQuickExpanded] = useState(false);

  return (
    <article className="group bg-white rounded-xl border border-[#e8e2d9] hover:border-[#cfc4b6] hover:shadow-xs transition-all duration-150 flex flex-col justify-between overflow-hidden">
      <div className="p-4 sm:p-4.5">
        {/* Top line: Meal Name & Discreet Indicators */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <button
              onClick={() => onSelectMeal(meal.id)}
              className="text-left font-serif-journal text-[1.05rem] font-semibold text-[#221f1c] hover:text-amber-900 transition-colors line-clamp-1 cursor-pointer"
              title={meal.name}
            >
              {meal.name}
            </button>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Discreet indicator for uncertain food identity */}
            {meal.uncertainIdentity && (
              <span
                className="inline-flex items-center justify-center text-[#8a6b32] hover:text-[#5f471b] p-0.5 rounded cursor-help"
                title={meal.uncertaintyNote || 'Estimated identity / recipe unverified'}
              >
                <span className="font-mono text-xs font-bold px-1 bg-[#fbf6ec] border border-[#ecdcb8] rounded">~</span>
              </span>
            )}

            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(meal.id);
                }}
                className={`p-1 rounded hover:bg-[#f6f2ec] transition-colors cursor-pointer ${
                  meal.isFavorite ? 'text-rose-500' : 'text-[#c2b9af] hover:text-[#7c736c]'
                }`}
                title={meal.isFavorite ? 'Favorited' : 'Add favorite'}
              >
                <Heart className={`w-3.5 h-3.5 ${meal.isFavorite ? 'fill-rose-500' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Clean unboxed metadata with subtle typographic separators */}
        <div className="mt-2 text-xs text-[#6e655d] space-y-1">
          {/* Restaurant · Location */}
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[13px] select-none" aria-hidden="true">📍</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToRestaurant(meal.restaurant);
              }}
              className="hover:text-[#2c2b29] hover:underline font-medium text-[#423c36] truncate cursor-pointer"
            >
              {meal.restaurant}
            </button>
            {meal.location && (
              <>
                <span className="text-[#b5aaa0]" aria-hidden="true">·</span>
                <span className="text-[#7c736c] truncate">{meal.location}</span>
              </>
            )}
          </div>

          {/* Date · Category */}
          <div className="flex items-center gap-1.5 text-[#7c736c]">
            <span className="text-[13px] select-none" aria-hidden="true">📅</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToDaily(meal.date);
              }}
              className="hover:text-[#2c2b29] hover:underline cursor-pointer"
            >
              {formatDateLabel(meal.date)}
            </button>
            <span className="text-[#b5aaa0]" aria-hidden="true">·</span>
            <span>{meal.category}</span>
            <span className="text-[#b5aaa0]" aria-hidden="true">·</span>
            <span className="font-mono-numbers text-[11px] text-[#8c827a]">
              {meal.nutrition.calories} kcal
            </span>
          </div>
        </div>

        {/* Inline Component Preview (if quick-expanded) */}
        {isQuickExpanded && (
          <div className="mt-3 pt-2.5 border-t border-[#f0eae0] text-xs text-[#4e4741] space-y-2 animate-in fade-in duration-150">
            <div>
              <div className="font-medium text-[#7c736c] mb-1">Components:</div>
              <ul className="pl-4 list-disc space-y-0.5 marker:text-amber-800/50">
                {meal.components.map((c, i) => (
                  <li key={i} className="line-clamp-1">{c}</li>
                ))}
              </ul>
            </div>
            {meal.notes.length > 0 && (
              <div>
                <div className="font-medium text-[#7c736c] mb-1">Details:</div>
                <p className="italic text-[#6b625b] line-clamp-2">{meal.notes[0]}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="px-4 py-2.5 bg-[#fdfcf9] border-t border-[#f2ece3] flex items-center justify-between gap-1 text-xs">
        <button
          onClick={() => onSelectMeal(meal.id)}
          className="font-medium text-[#2c2b29] hover:text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>See meal</span>
          <span aria-hidden="true">→</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsQuickExpanded(!isQuickExpanded)}
            className="px-2 py-1 text-[11px] text-[#7c736c] hover:text-[#2c2b29] hover:bg-[#ede7de] rounded transition-colors flex items-center gap-0.5 cursor-pointer"
            title={isQuickExpanded ? 'Collapse preview' : 'Quick preview'}
          >
            <span>{isQuickExpanded ? 'Less' : 'Preview'}</span>
            {isQuickExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </article>
  );
};
