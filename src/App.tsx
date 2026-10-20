import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Meal, ViewMode, FilterState, NavigationState } from './types/meal';
import {
  loadSavedMeals,
  saveMeals,
  loadSavedFilters,
  saveFilters,
  resetToInitialMeals,
  DEFAULT_FILTERS,
  formatDateLabel
} from './utils/storage';
import { Header } from './components/Header';
import { NavigationBack } from './components/NavigationBack';
import { FoodLibrary } from './components/FoodLibrary';
import { MealDetail } from './components/MealDetail';
import { DailyLog } from './components/DailyLog';
import { RestaurantList } from './components/RestaurantList';
import { MealFormModal } from './components/MealFormModal';

export default function App() {
  // State: Meals collection with persistence
  const [meals, setMeals] = useState<Meal[]>(() => loadSavedMeals());

  // State: Search and filter settings with persistence
  const [filters, setFilters] = useState<FilterState>(() => loadSavedFilters());

  // State: Navigation view & parameters
  const [currentView, setCurrentView] = useState<ViewMode>('library');
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [selectedDailyDate, setSelectedDailyDate] = useState<string | null>(null);

  // Navigation History Stack to guarantee foolproof, non-stranded back-navigation
  const [historyStack, setHistoryStack] = useState<NavigationState[]>([]);

  // State: Modal for adding/editing meals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

  // Save meals whenever modified
  useEffect(() => {
    saveMeals(meals);
  }, [meals]);

  // Save filters whenever modified (preserving search, filter, and layout state)
  const handleUpdateFilters = useCallback((patch: Partial<FilterState>) => {
    setFilters(prev => {
      const updated = { ...prev, ...patch };
      saveFilters(updated);
      return updated;
    });
  }, []);

  // Primary Navigation Dispatcher
  const navigateTo = useCallback((targetView: ViewMode, options?: {
    mealId?: string | null;
    restaurant?: string | null;
    date?: string | null;
    fromLabel?: string;
  }) => {
    // Push current view to history stack before transitioning
    setHistoryStack(prev => [
      ...prev,
      {
        view: currentView,
        mealId: selectedMealId,
        restaurantFilter: selectedRestaurant,
        dateFilter: selectedDailyDate,
        fromLabel: currentView === 'library'
          ? 'Food Library'
          : currentView === 'restaurants'
            ? (selectedRestaurant || 'Restaurants')
            : currentView === 'daily'
              ? (selectedDailyDate ? formatDateLabel(selectedDailyDate) : 'Daily Log')
              : 'Meal Detail'
      }
    ]);

    setCurrentView(targetView);
    if (options?.mealId !== undefined) setSelectedMealId(options.mealId);
    if (options?.restaurant !== undefined) setSelectedRestaurant(options.restaurant);
    if (options?.date !== undefined) setSelectedDailyDate(options.date);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedMealId, selectedRestaurant, selectedDailyDate]);

  // Robust Back Handler
  const handleBack = useCallback(() => {
    if (historyStack.length > 0) {
      const nextStack = [...historyStack];
      const previousState = nextStack.pop()!;
      setHistoryStack(nextStack);
      setCurrentView(previousState.view);
      setSelectedMealId(previousState.mealId || null);
      setSelectedRestaurant(previousState.restaurantFilter || null);
      setSelectedDailyDate(previousState.dateFilter || null);
    } else {
      // Default fallback: Always return safely to Food Library
      setCurrentView('library');
      setSelectedMealId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [historyStack]);

  // Jump to Food Library (Home)
  const handleGoHome = useCallback(() => {
    setHistoryStack([]);
    setCurrentView('library');
    setSelectedMealId(null);
    setSelectedRestaurant(null);
    setSelectedDailyDate(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Top header tab click (resets nested drilldown of that tab while retaining library filters)
  const handleTabChange = useCallback((tab: ViewMode) => {
    if (tab === currentView) return;
    setHistoryStack(prev => [
      ...prev,
      {
        view: currentView,
        mealId: selectedMealId,
        restaurantFilter: selectedRestaurant,
        dateFilter: selectedDailyDate,
        fromLabel: currentView === 'library' ? 'Food Library' : currentView === 'daily' ? 'Daily Log' : 'Restaurants'
      }
    ]);
    setCurrentView(tab);
    if (tab === 'library') setSelectedMealId(null);
    if (tab === 'restaurants' && !selectedRestaurant) setSelectedRestaurant(null);
    if (tab === 'daily' && !selectedDailyDate) setSelectedDailyDate(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedMealId, selectedRestaurant, selectedDailyDate]);

  // Handle meal selection (e.g. from cards or lists)
  const handleSelectMeal = useCallback((mealId: string) => {
    navigateTo('detail', { mealId });
  }, [navigateTo]);

  // Handle clicking a restaurant name
  const handleNavigateToRestaurant = useCallback((restaurantName: string) => {
    navigateTo('restaurants', { restaurant: restaurantName });
  }, [navigateTo]);

  // Handle clicking a date
  const handleNavigateToDaily = useCallback((date: string) => {
    navigateTo('daily', { date });
  }, [navigateTo]);

  // Toggle favorite status
  const handleToggleFavorite = useCallback((mealId: string) => {
    setMeals(prev =>
      prev.map(m => (m.id === mealId ? { ...m, isFavorite: !m.isFavorite } : m))
    );
  }, []);

  // Open add modal
  const handleOpenAddModal = useCallback(() => {
    setEditingMeal(null);
    setIsModalOpen(true);
  }, []);

  // Open edit modal
  const handleOpenEditModal = useCallback((meal: Meal) => {
    setEditingMeal(meal);
    setIsModalOpen(true);
  }, []);

  // Save new or edited meal
  const handleSaveMeal = useCallback((savedMeal: Meal) => {
    setMeals(prev => {
      const index = prev.findIndex(m => m.id === savedMeal.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = savedMeal;
        return copy;
      }
      return [savedMeal, ...prev];
    });
  }, []);

  // Reset to initial demo dataset
  const handleResetSampleData = useCallback(() => {
    if (window.confirm('Restore initial sample meals?')) {
      const reset = resetToInitialMeals();
      setMeals(reset);
      setFilters(DEFAULT_FILTERS);
      handleGoHome();
    }
  }, [handleGoHome]);

  // Active meal object for detail view
  const activeMeal = useMemo(() => {
    return meals.find(m => m.id === selectedMealId) || null;
  }, [meals, selectedMealId]);

  // Unique restaurants for autocompletion
  const existingRestaurants = useMemo(() => {
    return Array.from(new Set(meals.map(m => m.restaurant))).sort();
  }, [meals]);

  // Compute label for the Back button
  const backTarget = useMemo(() => {
    if (historyStack.length > 0) {
      const prev = historyStack[historyStack.length - 1];
      return {
        view: prev.view,
        label: prev.fromLabel || (prev.view === 'library' ? 'Food Library' : prev.view === 'restaurants' ? 'Restaurants' : 'Daily Log')
      };
    }
    if (currentView === 'detail') {
      return { view: 'library' as ViewMode, label: 'Food Library' };
    }
    if (currentView === 'restaurants' && selectedRestaurant) {
      return { view: 'restaurants' as ViewMode, label: 'All Restaurants' };
    }
    if (currentView === 'daily' && selectedDailyDate) {
      return { view: 'daily' as ViewMode, label: 'All Days' };
    }
    return { view: 'library' as ViewMode, label: 'Food Library' };
  }, [historyStack, currentView, selectedRestaurant, selectedDailyDate]);

  // Determine if contextual back navigation should be visible
  const showBackNavigation =
    currentView === 'detail' ||
    (currentView === 'restaurants' && !!selectedRestaurant) ||
    (currentView === 'daily' && !!selectedDailyDate) ||
    historyStack.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#2c2b29]">
      {/* Primary Top Bar Contract */}
      <Header
        currentView={currentView}
        onNavigate={handleTabChange}
        onOpenAddModal={handleOpenAddModal}
        mealCount={meals.length}
      />

      {/* Contextual & Sticky Back Navigation Bar */}
      {showBackNavigation && (
        <NavigationBack
          currentView={currentView}
          targetView={backTarget.view}
          targetLabel={backTarget.label}
          currentTitle={currentView === 'detail' ? activeMeal?.name : undefined}
          onBack={handleBack}
          onHome={handleGoHome}
          isSticky={true}
        />
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentView === 'library' && (
          <FoodLibrary
            meals={meals}
            filters={filters}
            onUpdateFilters={handleUpdateFilters}
            onSelectMeal={handleSelectMeal}
            onNavigateToRestaurant={handleNavigateToRestaurant}
            onNavigateToDaily={handleNavigateToDaily}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentView === 'detail' && (
          <div>
            {activeMeal ? (
              <MealDetail
                meal={activeMeal}
                onNavigateToRestaurant={handleNavigateToRestaurant}
                onNavigateToDaily={handleNavigateToDaily}
                onToggleFavorite={handleToggleFavorite}
                onEditMeal={handleOpenEditModal}
              />
            ) : (
              <div className="bg-white rounded-xl border border-[#e8e2d9] p-8 text-center max-w-md mx-auto space-y-3">
                <p className="font-serif-journal text-lg text-[#2c2b29]">
                  Meal not found
                </p>
                <p className="text-xs text-[#7c736c]">
                  This meal record may have been removed or updated.
                </p>
                <button
                  onClick={handleGoHome}
                  className="px-4 py-2 bg-[#3e3832] text-white rounded-lg text-xs font-medium cursor-pointer"
                >
                  Return to Food Library
                </button>
              </div>
            )}
          </div>
        )}

        {currentView === 'daily' && (
          <DailyLog
            meals={meals}
            selectedDate={selectedDailyDate}
            onSelectDate={setSelectedDailyDate}
            onSelectMeal={handleSelectMeal}
            onNavigateToRestaurant={handleNavigateToRestaurant}
            onToggleFavorite={handleToggleFavorite}
            onOpenAddModal={handleOpenAddModal}
          />
        )}

        {currentView === 'restaurants' && (
          <RestaurantList
            meals={meals}
            selectedRestaurant={selectedRestaurant}
            onSelectRestaurant={setSelectedRestaurant}
            onSelectMeal={handleSelectMeal}
            onNavigateToDaily={handleNavigateToDaily}
            onToggleFavorite={handleToggleFavorite}
            onGoToLibrary={handleGoHome}
          />
        )}
      </main>

      {/* Warm Journal Footer */}
      <footer className="mt-auto border-t border-[#e8e2d9] bg-[#faf8f5] py-6 text-xs text-[#8c827a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-journal font-medium text-[#5c544d]">
              Food Library
            </span>
            <span aria-hidden="true">·</span>
            <span>Personal food journal</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetSampleData}
              className="text-[#8c827a] hover:text-[#2c2b29] hover:underline cursor-pointer"
              title="Reset records to default sample demo data"
            >
              Reset sample entries
            </button>
            <span aria-hidden="true">·</span>
            <span>{meals.length} meals catalogued</span>
          </div>
        </div>
      </footer>

      {/* Add / Edit Meal Modal */}
      <MealFormModal
        isOpen={isModalOpen}
        initialMeal={editingMeal}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMeal(null);
        }}
        onSave={handleSaveMeal}
        existingRestaurants={existingRestaurants}
      />
    </div>
  );
}
