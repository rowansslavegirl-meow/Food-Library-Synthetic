import React, { useMemo } from 'react';
import { Meal } from '../types/meal';
import { formatDayHeader, formatDateLabel } from '../utils/storage';
import { FoodCard } from './FoodCard';
import { Calendar, ChevronRight, Utensils, Flame, Sparkles } from 'lucide-react';

interface DailyLogProps {
  meals: Meal[];
  selectedDate?: string | null;
  onSelectDate: (date: string | null) => void;
  onSelectMeal: (mealId: string) => void;
  onNavigateToRestaurant: (restaurantName: string) => void;
  onToggleFavorite: (mealId: string) => void;
  onOpenAddModal: () => void;
}

export const DailyLog: React.FC<DailyLogProps> = ({
  meals,
  selectedDate,
  onSelectDate,
  onSelectMeal,
  onNavigateToRestaurant,
  onToggleFavorite,
  onOpenAddModal
}) => {
  // Group meals by date descending (newest first)
  const groupedByDate = useMemo(() => {
    const map = new Map<string, Meal[]>();
    // Sort meals by date descending
    const sorted = [...meals].sort((a, b) => b.date.localeCompare(a.date));

    sorted.forEach(m => {
      const existing = map.get(m.date) || [];
      existing.push(m);
      map.set(m.date, existing);
    });

    return Array.from(map.entries()).map(([date, dateMeals]) => {
      // Calculate daily nutrition summary
      const totals = dateMeals.reduce(
        (acc, m) => {
          acc.calories += m.nutrition.calories;
          acc.protein += m.nutrition.protein;
          acc.fat += m.nutrition.fat;
          acc.carbs += m.nutrition.carbs;
          return acc;
        },
        { calories: 0, protein: 0, fat: 0, carbs: 0 }
      );

      return {
        date,
        meals: dateMeals,
        totals
      };
    });
  }, [meals]);

  const activeDayGroup = useMemo(() => {
    if (!selectedDate) return null;
    return groupedByDate.find(g => g.date === selectedDate) || null;
  }, [groupedByDate, selectedDate]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Context */}
      <div className="bg-white rounded-xl border border-[#e8e2d9] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div>
          <h1 className="font-serif-journal text-xl sm:text-2xl font-semibold text-[#221f1c]">
            {selectedDate ? `Log for ${formatDateLabel(selectedDate)}` : 'Daily Journal Log'}
          </h1>
          <p className="text-xs text-[#7c736c] mt-0.5">
            {selectedDate
              ? 'Chronological record of meals eaten on this day.'
              : `${groupedByDate.length} days recorded with meal components and little details.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedDate && (
            <button
              onClick={() => onSelectDate(null)}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#ded7cc] bg-[#f4efe8] text-[#423c36] hover:bg-[#eae3d8] transition-colors cursor-pointer"
            >
              Show all days
            </button>
          )}

          <button
            onClick={onOpenAddModal}
            className="text-xs px-3 py-1.5 rounded-lg bg-[#3e3832] text-white hover:bg-[#2c2824] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>+ Add to this log</span>
          </button>
        </div>
      </div>

      {/* Date Quick Carousel / Selector */}
      <div className="overflow-x-auto pb-1 no-scrollbar flex items-center gap-2">
        <button
          onClick={() => onSelectDate(null)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            !selectedDate
              ? 'bg-[#3e3832] text-white shadow-2xs'
              : 'bg-white border border-[#e8e2d9] text-[#6b625b] hover:bg-[#faf8f5]'
          }`}
        >
          All dates ({groupedByDate.length})
        </button>
        {groupedByDate.map(g => (
          <button
            key={g.date}
            onClick={() => onSelectDate(g.date)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedDate === g.date
                ? 'bg-[#3e3832] text-white shadow-2xs'
                : 'bg-white border border-[#e8e2d9] text-[#6b625b] hover:bg-[#faf8f5]'
            }`}
          >
            <span>{formatDateLabel(g.date)}</span>
            <span className="font-mono-numbers text-[10px] text-[#8c827a] ml-1.5">
              ({g.meals.length})
            </span>
          </button>
        ))}
      </div>

      {/* Daily Groups */}
      <div className="space-y-6">
        {(selectedDate && activeDayGroup ? [activeDayGroup] : groupedByDate).map(group => {
          const { main } = formatDayHeader(group.date);
          return (
            <section
              key={group.date}
              className="bg-white rounded-xl border border-[#e8e2d9] overflow-hidden shadow-2xs"
            >
              {/* Day Header with Nutrition Roll-up */}
              <div className="px-4 py-3.5 sm:px-5 sm:py-4 bg-[#fbf9f6] border-b border-[#e8e2d9] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-base select-none" aria-hidden="true">📅</span>
                  <div>
                    <h2 className="font-serif-journal text-base sm:text-lg font-semibold text-[#221f1c]">
                      {main}
                    </h2>
                    <div className="text-xs text-[#7c736c]">
                      {group.meals.length} {group.meals.length === 1 ? 'meal' : 'meals'} recorded
                    </div>
                  </div>
                </div>

                {/* Daily Nutrition Totals */}
                <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono-numbers text-[#5c544d] bg-white border border-[#ded7cc] px-3 py-1.5 rounded-lg">
                  <div className="flex items-center gap-1">
                    <span className="text-[#a49a90] text-[11px]">Energy:</span>
                    <strong className="text-[#2c2b29]">{group.totals.calories}</strong>
                    <span className="text-[10px] text-[#a49a90]">kcal</span>
                  </div>
                  <span className="text-[#d5cec5]" aria-hidden="true">·</span>
                  <div>
                    <span className="text-[#a49a90] text-[11px]">P:</span> {group.totals.protein}g
                  </div>
                  <div>
                    <span className="text-[#a49a90] text-[11px]">F:</span> {group.totals.fat}g
                  </div>
                  <div>
                    <span className="text-[#a49a90] text-[11px]">C:</span> {group.totals.carbs}g
                  </div>
                </div>
              </div>

              {/* Meals logged for that day */}
              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.meals.map(meal => (
                    <FoodCard
                      key={meal.id}
                      meal={meal}
                      onSelectMeal={onSelectMeal}
                      onNavigateToRestaurant={onNavigateToRestaurant}
                      onNavigateToDaily={() => onSelectDate(meal.date)}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
