import React, { useMemo } from 'react';
import { Meal } from '../types/meal';
import { FoodCard } from './FoodCard';
import { MapPin, Utensils, ChevronRight, ArrowLeft } from 'lucide-react';

interface RestaurantListProps {
  meals: Meal[];
  selectedRestaurant?: string | null;
  onSelectRestaurant: (restaurant: string | null) => void;
  onSelectMeal: (mealId: string) => void;
  onNavigateToDaily: (date: string) => void;
  onToggleFavorite: (mealId: string) => void;
  onGoToLibrary: () => void;
}

export const RestaurantList: React.FC<RestaurantListProps> = ({
  meals,
  selectedRestaurant,
  onSelectRestaurant,
  onSelectMeal,
  onNavigateToDaily,
  onToggleFavorite,
  onGoToLibrary
}) => {
  // Aggregate by restaurant
  const restaurantStats = useMemo(() => {
    const map = new Map<string, { location: string; meals: Meal[] }>();

    meals.forEach(m => {
      const existing = map.get(m.restaurant) || { location: m.location || '', meals: [] };
      if (m.location && !existing.location) {
        existing.location = m.location;
      }
      existing.meals.push(m);
      map.set(m.restaurant, existing);
    });

    return Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        location: data.location,
        meals: data.meals,
        count: data.meals.length
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [meals]);

  const activeRestaurantData = useMemo(() => {
    if (!selectedRestaurant) return null;
    return restaurantStats.find(r => r.name === selectedRestaurant) || null;
  }, [restaurantStats, selectedRestaurant]);

  // If a specific restaurant is selected
  if (selectedRestaurant && activeRestaurantData) {
    return (
      <div className="space-y-6">
        {/* Restaurant Header */}
        <div className="bg-white rounded-xl border border-[#e8e2d9] p-5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl select-none" aria-hidden="true">📍</span>
                <h1 className="font-serif-journal text-2xl font-semibold text-[#221f1c]">
                  {activeRestaurantData.name}
                </h1>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-[#7c736c]">
                {activeRestaurantData.location && (
                  <>
                    <span>{activeRestaurantData.location}</span>
                    <span className="text-[#b5aaa0]" aria-hidden="true">·</span>
                  </>
                )}
                <span className="font-mono-numbers">
                  {activeRestaurantData.count} {activeRestaurantData.count === 1 ? 'recorded meal' : 'recorded meals'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectRestaurant(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ded7cc] bg-[#f4efe8] text-[#3e3832] hover:bg-[#eae3d8] transition-colors text-xs font-medium cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Restaurants</span>
              </button>
            </div>
          </div>
        </div>

        {/* Meals at this restaurant */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeRestaurantData.meals.map(meal => (
            <FoodCard
              key={meal.id}
              meal={meal}
              onSelectMeal={onSelectMeal}
              onNavigateToRestaurant={() => {}}
              onNavigateToDaily={onNavigateToDaily}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </div>
    );
  }

  // Otherwise, show list of all recorded restaurants
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#e8e2d9] p-5 shadow-2xs flex items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-journal text-2xl font-semibold text-[#221f1c]">
            Places & Restaurants
          </h1>
          <p className="text-xs text-[#7c736c] mt-0.5">
            {restaurantStats.length} dining venues and coffee shops recorded in your diary.
          </p>
        </div>

        <button
          onClick={onGoToLibrary}
          className="text-xs px-3 py-1.5 rounded-lg border border-[#ded7cc] bg-[#f4efe8] text-[#423c36] hover:bg-[#eae3d8] transition-colors cursor-pointer"
        >
          View all foods →
        </button>
      </div>

      {/* Grid of Restaurants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {restaurantStats.map(r => (
          <div
            key={r.name}
            onClick={() => onSelectRestaurant(r.name)}
            className="group bg-white rounded-xl border border-[#e8e2d9] p-4 hover:border-[#cfc4b6] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-serif-journal text-base font-semibold text-[#221f1c] group-hover:text-amber-900 transition-colors">
                    {r.name}
                  </h2>
                  {r.location && (
                    <div className="text-xs text-[#7c736c] mt-0.5 flex items-center gap-1">
                      <span className="text-[12px]" aria-hidden="true">📍</span>
                      <span>{r.location}</span>
                    </div>
                  )}
                </div>
                <span className="text-xs font-mono-numbers px-2 py-0.5 rounded bg-[#f5efe6] text-[#5c544d] shrink-0 font-medium">
                  {r.count} {r.count === 1 ? 'meal' : 'meals'}
                </span>
              </div>

              {/* Sample dishes */}
              <div className="mt-3 pt-2.5 border-t border-[#f2ece3] text-xs text-[#6e655d] space-y-1">
                <div className="text-[11px] font-medium text-[#9c9187]">Recorded dishes:</div>
                <div className="space-y-0.5">
                  {r.meals.slice(0, 3).map(m => (
                    <div key={m.id} className="truncate hover:text-[#2c2b29]">
                      • {m.name}
                    </div>
                  ))}
                  {r.meals.length > 3 && (
                    <div className="text-[11px] text-[#9c9187] italic">
                      + {r.meals.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 text-xs font-medium text-amber-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>View venue meals</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
