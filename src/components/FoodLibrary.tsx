import React, { useMemo } from 'react';
import { Meal, FilterState, MealCategory } from '../types/meal';
import { FoodCard } from './FoodCard';
import { formatDateLabel } from '../utils/storage';
import {
  Search,
  X,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  HelpCircle,
  Heart
} from 'lucide-react';

interface FoodLibraryProps {
  meals: Meal[];
  filters: FilterState;
  onUpdateFilters: (filters: Partial<FilterState>) => void;
  onSelectMeal: (mealId: string) => void;
  onNavigateToRestaurant: (restaurantName: string) => void;
  onNavigateToDaily: (date: string) => void;
  onToggleFavorite: (mealId: string) => void;
}

const CATEGORIES: ('All' | MealCategory)[] = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Drink', 'Snack'];

export const FoodLibrary: React.FC<FoodLibraryProps> = ({
  meals,
  filters,
  onUpdateFilters,
  onSelectMeal,
  onNavigateToRestaurant,
  onNavigateToDaily,
  onToggleFavorite
}) => {
  // Extract all unique restaurants for the filter dropdown
  const uniqueRestaurants = useMemo(() => {
    const set = new Set<string>();
    meals.forEach(m => {
      if (m.restaurant) set.add(m.restaurant);
    });
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [meals]);

  // Comprehensive search across food name, restaurant, and nested components
  const filteredMeals = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();

    return meals
      .filter(m => {
        // Search query across: name, restaurant, components, notes
        if (q) {
          const nameMatch = m.name.toLowerCase().includes(q);
          const restMatch = m.restaurant.toLowerCase().includes(q);
          const compMatch = m.components.some(c => c.toLowerCase().includes(q));
          const notesMatch = m.notes.some(n => n.toLowerCase().includes(q));
          if (!nameMatch && !restMatch && !compMatch && !notesMatch) {
            return false;
          }
        }

        // Category filter
        if (filters.category !== 'All' && m.category !== filters.category) {
          return false;
        }

        // Restaurant filter
        if (filters.restaurant !== 'All' && m.restaurant !== filters.restaurant) {
          return false;
        }

        // Uncertain identities filter
        if (filters.onlyUncertain && !m.uncertainIdentity) {
          return false;
        }

        // Favorites filter
        if (filters.onlyFavorites && !m.isFavorite) {
          return false;
        }

        return true;
      })
      // Alphabetical browsing by default (as strictly requested)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [meals, filters]);

  // Alphabetical groupings for quick visual scannability
  const alphabetLetters = useMemo(() => {
    const letters = new Set<string>();
    filteredMeals.forEach(m => {
      const first = m.name.trim().charAt(0).toUpperCase();
      if (first) letters.add(first);
    });
    return Array.from(letters).sort();
  }, [filteredMeals]);

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.category !== 'All' ||
    filters.restaurant !== 'All' ||
    filters.onlyUncertain ||
    filters.onlyFavorites;

  const handleResetFilters = () => {
    onUpdateFilters({
      searchQuery: '',
      category: 'All',
      restaurant: 'All',
      onlyUncertain: false,
      onlyFavorites: false
    });
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Controls */}
      <div className="bg-white rounded-xl border border-[#e8e2d9] p-3.5 sm:p-4 shadow-2xs space-y-3">
        {/* Search input with real-time feedback */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8c827a] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
            placeholder="Search food names, restaurants, or nested ingredients (e.g. tofu, matcha, oats)..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-[#faf8f5] border border-[#ded7cc] rounded-lg text-[#2c2b29] placeholder-[#8c827a] focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800/40 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onUpdateFilters({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c827a] hover:text-[#2c2b29] p-0.5 rounded cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Row: Categories & Restaurant Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          {/* Interactive Category Segmented Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => onUpdateFilters({ category: cat })}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filters.category === cat
                    ? 'bg-[#3e3832] text-white shadow-xs'
                    : 'bg-[#f4efe8] text-[#5c544d] hover:bg-[#eae3d8] hover:text-[#2c2b29]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Restaurant Filter Dropdown & View Mode */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Restaurant select */}
            <div className="flex items-center gap-1.5 text-xs text-[#6e655d]">
              <span className="hidden sm:inline">Venue:</span>
              <select
                value={filters.restaurant}
                onChange={(e) => onUpdateFilters({ restaurant: e.target.value })}
                className="bg-[#f4efe8] border border-[#ded7cc] text-[#2c2b29] rounded-lg text-xs py-1.5 pl-2.5 pr-7 focus:outline-none focus:ring-2 focus:ring-amber-800/20 cursor-pointer"
              >
                {uniqueRestaurants.map(r => (
                  <option key={r} value={r}>
                    {r === 'All' ? 'All Restaurants' : r}
                  </option>
                ))}
              </select>
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center bg-[#f4efe8] border border-[#ded7cc] rounded-lg p-0.5">
              <button
                onClick={() => onUpdateFilters({ layoutMode: 'compact-cards' })}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  filters.layoutMode === 'compact-cards'
                    ? 'bg-white text-[#2c2b29] shadow-2xs'
                    : 'text-[#8c827a] hover:text-[#2c2b29]'
                }`}
                title="Compact Card Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateFilters({ layoutMode: 'dense-list' })}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  filters.layoutMode === 'dense-list'
                    ? 'bg-white text-[#2c2b29] shadow-2xs'
                    : 'text-[#8c827a] hover:text-[#2c2b29]'
                }`}
                title="Dense List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Discreet Filter Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#f4efe8] text-xs">
          <div className="flex items-center gap-3">
            {/* Only Favorites */}
            <button
              onClick={() => onUpdateFilters({ onlyFavorites: !filters.onlyFavorites })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filters.onlyFavorites
                  ? 'bg-rose-50 text-rose-700 font-medium'
                  : 'text-[#7c736c] hover:text-[#2c2b29]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${filters.onlyFavorites ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>Favorites only</span>
            </button>

            {/* Only Uncertain Identities */}
            <button
              onClick={() => onUpdateFilters({ onlyUncertain: !filters.onlyUncertain })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filters.onlyUncertain
                  ? 'bg-amber-50 text-amber-800 font-medium'
                  : 'text-[#7c736c] hover:text-[#2c2b29]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Uncertain recipes (~)</span>
            </button>
          </div>

          {/* Result Count and Clear Filters */}
          <div className="flex items-center gap-2 text-[#7c736c]">
            <span className="font-mono-numbers">
              {filteredMeals.length} {filteredMeals.length === 1 ? 'food' : 'foods'}
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-amber-800 hover:text-amber-950 underline cursor-pointer font-medium ml-1"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredMeals.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e8e2d9] p-8 text-center space-y-3">
          <p className="font-serif-journal text-lg text-[#2c2b29]">
            No matching food records found
          </p>
          <p className="text-xs text-[#7c736c] max-w-sm mx-auto">
            Try adjusting your search terms or clearing restaurant and category filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#3e3832] text-white hover:bg-[#2c2824] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : filters.layoutMode === 'compact-cards' ? (
        /* Compact, Attractive Food Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredMeals.map((meal) => (
            <FoodCard
              key={meal.id}
              meal={meal}
              onSelectMeal={onSelectMeal}
              onNavigateToRestaurant={onNavigateToRestaurant}
              onNavigateToDaily={onNavigateToDaily}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        /* Dense List View */
        <div className="bg-white rounded-xl border border-[#e8e2d9] divide-y divide-[#f2ece3] overflow-hidden">
          {filteredMeals.map((meal) => (
            <div
              key={meal.id}
              onClick={() => onSelectMeal(meal.id)}
              className="px-4 py-3 hover:bg-[#faf7f2] transition-colors flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif-journal text-base font-medium text-[#221f1c] group-hover:text-amber-900 transition-colors truncate">
                    {meal.name}
                  </h3>
                  {meal.uncertainIdentity && (
                    <span
                      className="font-mono text-[11px] text-[#8a6b32] bg-[#fbf6ec] border border-[#ecdcb8] px-1 rounded"
                      title={meal.uncertaintyNote}
                    >
                      ~
                    </span>
                  )}
                  {meal.isFavorite && (
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500 shrink-0" />
                  )}
                </div>

                {/* Clean unboxed metadata with subtle separators */}
                <div className="flex items-center gap-1.5 text-xs text-[#7c736c] mt-0.5 truncate">
                  <span>📍 {meal.restaurant}</span>
                  {meal.location && (
                    <>
                      <span className="text-[#b5aaa0]" aria-hidden="true">·</span>
                      <span>{meal.location}</span>
                    </>
                  )}
                  <span className="text-[#b5aaa0]" aria-hidden="true">·</span>
                  <span>{formatDateLabel(meal.date)}</span>
                  <span className="text-[#b5aaa0]" aria-hidden="true">·</span>
                  <span>{meal.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono-numbers text-xs text-[#8c827a] font-medium hidden sm:inline">
                  {meal.nutrition.calories} kcal
                </span>
                <span className="text-xs font-medium text-amber-900 group-hover:translate-x-0.5 transition-transform">
                  View →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
