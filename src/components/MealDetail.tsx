import React, { useState } from 'react';
import { Meal } from '../types/meal';
import { formatDateLabel } from '../utils/storage';
import {
  Heart,
  Share2,
  Calendar,
  MapPin,
  UtensilsCrossed,
  Info,
  ChevronDown,
  ChevronUp,
  Check,
  HelpCircle,
  Edit3
} from 'lucide-react';

interface MealDetailProps {
  meal: Meal;
  onNavigateToRestaurant: (restaurantName: string) => void;
  onNavigateToDaily: (date: string) => void;
  onToggleFavorite?: (mealId: string) => void;
  onEditMeal?: (meal: Meal) => void;
}

export const MealDetail: React.FC<MealDetailProps> = ({
  meal,
  onNavigateToRestaurant,
  onNavigateToDaily,
  onToggleFavorite,
  onEditMeal
}) => {
  const [copied, setCopied] = useState(false);
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);

  const handleShare = () => {
    const text = `${meal.name}\n📍 ${meal.restaurant}${meal.location ? ` · ${meal.location}` : ''}\n📅 ${formatDateLabel(meal.date)}\n\n🥢 What I ate:\n${meal.components.map(c => `• ${c}`).join('\n')}\n\n📝 Little details:\n${meal.notes.map(n => `• ${n}`).join('\n')}\n\n📊 Nutrition: ${meal.nutrition.calories} kcal | P: ${meal.nutrition.protein}g | F: ${meal.nutrition.fat}g | C: ${meal.nutrition.carbs}g`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const count = meal.recordedCount || 1;
  const countLabel = count === 1 ? '1 meal recorded' : `${count} meals recorded`;

  return (
    <article className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#e8e2d9] shadow-xs overflow-hidden transition-all my-6">
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 border-b border-[#f2ece3]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            {/* Meal Name */}
            <h1 className="font-serif-journal text-2xl sm:text-3xl font-semibold text-[#221f1c] tracking-tight leading-snug">
              {meal.name}
            </h1>

            {/* Uncertain identity discreet indicator if present */}
            {meal.uncertainIdentity && (
              <div className="inline-flex items-center gap-1.5 text-xs text-[#8a6b32] bg-[#fbf6ec] border border-[#eee1c4] px-2.5 py-1 rounded-md my-1">
                <HelpCircle className="w-3.5 h-3.5 text-[#b0873a] shrink-0" />
                <span>
                  {meal.uncertaintyNote || 'Estimated identity / portion unverified'}
                </span>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(meal.id)}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  meal.isFavorite
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-[#e2dacf] text-[#8c827a] hover:text-[#2c2b29] hover:bg-[#faf8f5]'
                }`}
                title={meal.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-4 h-4 ${meal.isFavorite ? 'fill-rose-600' : ''}`} />
              </button>
            )}

            {onEditMeal && (
              <button
                onClick={() => onEditMeal(meal)}
                className="p-2 rounded-lg border border-[#e2dacf] bg-white text-[#8c827a] hover:text-[#2c2b29] hover:bg-[#faf8f5] transition-colors cursor-pointer"
                title="Edit journal entry"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleShare}
              className="p-2 rounded-lg border border-[#e2dacf] bg-white text-[#8c827a] hover:text-[#2c2b29] hover:bg-[#faf8f5] transition-colors cursor-pointer relative"
              title="Copy meal entry"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Metadata Lines formatted strictly with zero-pill discipline */}
        <div className="mt-4 space-y-1.5 text-sm text-[#5f5851]">
          {/* 📍 Restaurant · Location */}
          <div className="flex items-center gap-2">
            <span className="text-base select-none" aria-hidden="true">📍</span>
            <button
              onClick={() => onNavigateToRestaurant(meal.restaurant)}
              className="text-[#2c2b29] font-medium hover:text-amber-900 hover:underline transition-colors cursor-pointer"
            >
              {meal.restaurant}
            </button>
            {meal.location && (
              <>
                <span className="text-[#a49a90]" aria-hidden="true">·</span>
                <span className="text-[#6b625b]">{meal.location}</span>
              </>
            )}
          </div>

          {/* 📅 Date */}
          <div className="flex items-center gap-2">
            <span className="text-base select-none" aria-hidden="true">📅</span>
            <button
              onClick={() => onNavigateToDaily(meal.date)}
              className="hover:text-amber-900 hover:underline transition-colors cursor-pointer text-[#4e4741]"
            >
              {formatDateLabel(meal.date)}
            </button>
            <span className="text-[#a49a90]" aria-hidden="true">·</span>
            <span className="text-[#7c736c]">{meal.category}</span>
          </div>

          {/* 🍽️ Recorded count */}
          <div className="flex items-center gap-2">
            <span className="text-base select-none" aria-hidden="true">🍽️</span>
            <span className="text-[#4e4741]">{countLabel}</span>
          </div>
        </div>
      </div>

      {/* Body Sections */}
      <div className="p-6 sm:p-8 space-y-7">
        {/* 🥢 What I ate */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg select-none" aria-hidden="true">🥢</span>
            <h2 className="font-serif-journal text-lg font-semibold text-[#2c2b29]">
              What I ate
            </h2>
          </div>
          <ul className="space-y-2 pl-7 list-disc marker:text-amber-800/60 text-[#3e3832] text-sm leading-relaxed">
            {meal.components.map((component, idx) => (
              <li key={idx} className="pl-1">
                {component}
              </li>
            ))}
          </ul>
        </section>

        {/* 📝 Little details */}
        <section className="pt-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg select-none" aria-hidden="true">📝</span>
            <h2 className="font-serif-journal text-lg font-semibold text-[#2c2b29]">
              Little details
            </h2>
          </div>
          {meal.notes.length > 0 ? (
            <ul className="space-y-2 pl-7 list-disc marker:text-amber-800/60 text-[#47413a] text-sm leading-relaxed">
              {meal.notes.map((note, idx) => (
                <li key={idx} className="pl-1">
                  {note}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#8c827a] italic pl-7">
              No extra personal observations recorded.
            </p>
          )}
        </section>

        {/* 📊 Nutrition */}
        <section className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg select-none" aria-hidden="true">📊</span>
              <h2 className="font-serif-journal text-lg font-semibold text-[#2c2b29]">
                Nutrition
              </h2>
            </div>
            {meal.nutrition.isEstimated && (
              <span className="text-xs text-[#8c827a] italic">
                Approximate estimation
              </span>
            )}
          </div>

          {/* Compact, responsive grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
            <div className="bg-[#f7f4ee] border border-[#ece4d8] rounded-xl p-2.5 text-center">
              <div className="font-mono-numbers text-base font-semibold text-[#2c2b29]">
                {meal.nutrition.calories}
              </div>
              <div className="text-[11px] text-[#7c736c] font-medium mt-0.5">Calories</div>
              <div className="text-[10px] text-[#a49a90]">kcal</div>
            </div>

            <div className="bg-[#f7f4ee] border border-[#ece4d8] rounded-xl p-2.5 text-center">
              <div className="font-mono-numbers text-base font-semibold text-[#2c2b29]">
                {meal.nutrition.protein}
              </div>
              <div className="text-[11px] text-[#7c736c] font-medium mt-0.5">Protein</div>
              <div className="text-[10px] text-[#a49a90]">g</div>
            </div>

            <div className="bg-[#f7f4ee] border border-[#ece4d8] rounded-xl p-2.5 text-center">
              <div className="font-mono-numbers text-base font-semibold text-[#2c2b29]">
                {meal.nutrition.fat}
              </div>
              <div className="text-[11px] text-[#7c736c] font-medium mt-0.5">Fat</div>
              <div className="text-[10px] text-[#a49a90]">g</div>
            </div>

            <div className="bg-[#f7f4ee] border border-[#ece4d8] rounded-xl p-2.5 text-center">
              <div className="font-mono-numbers text-base font-semibold text-[#2c2b29]">
                {meal.nutrition.carbs}
              </div>
              <div className="text-[11px] text-[#7c736c] font-medium mt-0.5">Carbs</div>
              <div className="text-[10px] text-[#a49a90]">g</div>
            </div>

            <div className="bg-[#f7f4ee] border border-[#ece4d8] rounded-xl p-2.5 text-center">
              <div className="font-mono-numbers text-base font-semibold text-[#2c2b29]">
                {meal.nutrition.fiber}
              </div>
              <div className="text-[11px] text-[#7c736c] font-medium mt-0.5">Fibre</div>
              <div className="text-[10px] text-[#a49a90]">g</div>
            </div>

            <div className="bg-[#f7f4ee] border border-[#ece4d8] rounded-xl p-2.5 text-center">
              <div className="font-mono-numbers text-base font-semibold text-[#2c2b29]">
                {meal.nutrition.sodium}
              </div>
              <div className="text-[11px] text-[#7c736c] font-medium mt-0.5">Sodium</div>
              <div className="text-[10px] text-[#a49a90]">mg</div>
            </div>
          </div>
        </section>

        {/* Optional Information Disclosure */}
        <section className="pt-2 border-t border-[#f2ece3]">
          <button
            onClick={() => setIsDisclosureOpen(!isDisclosureOpen)}
            className="w-full flex items-center justify-between text-left py-2 text-xs font-medium text-[#7c736c] hover:text-[#2c2b29] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#a49a90]" />
              Original record & technical details
            </span>
            {isDisclosureOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-[#a49a90]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[#a49a90]" />
            )}
          </button>

          {isDisclosureOpen && (
            <div className="mt-2.5 p-3.5 rounded-xl bg-[#f8f6f2] border border-[#e8e2d9] text-xs text-[#6b625b] space-y-1.5 font-mono-numbers">
              <div className="flex justify-between">
                <span className="text-[#8c827a]">Record ID:</span>
                <span className="text-[#2c2b29]">{meal.originalRecord?.id || meal.id}</span>
              </div>
              {meal.originalRecord?.loggedAt && (
                <div className="flex justify-between">
                  <span className="text-[#8c827a]">Logged timestamp:</span>
                  <span className="text-[#2c2b29]">{meal.originalRecord.loggedAt}</span>
                </div>
              )}
              {meal.originalRecord?.entryMethod && (
                <div className="flex justify-between">
                  <span className="text-[#8c827a]">Entry method:</span>
                  <span className="text-[#2c2b29]">{meal.originalRecord.entryMethod}</span>
                </div>
              )}
              {meal.originalRecord?.internalNotes && (
                <div className="pt-1 border-t border-[#ece4d8] text-[#7c736c]">
                  {meal.originalRecord.internalNotes}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Bottom Quick Contextual Links */}
        <div className="pt-3 border-t border-[#f2ece3] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToRestaurant(meal.restaurant)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e2dacf] bg-[#faf8f5] text-[#3e3832] hover:bg-white hover:text-amber-900 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-800" />
              <span>More at {meal.restaurant} →</span>
            </button>
            <button
              onClick={() => onNavigateToDaily(meal.date)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e2dacf] bg-[#faf8f5] text-[#3e3832] hover:bg-white hover:text-amber-900 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-800" />
              <span>View daily log for this date →</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
