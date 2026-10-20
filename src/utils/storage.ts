import { Meal, FilterState } from '../types/meal';
import { INITIAL_MEALS } from '../data/initialMeals';

const MEALS_STORAGE_KEY = 'food_library_meals_v3';
const FILTERS_STORAGE_KEY = 'food_library_filters_v3';

export function loadSavedMeals(): Meal[] {
  try {
    const raw = localStorage.getItem(MEALS_STORAGE_KEY);
    if (!raw) {
      saveMeals(INITIAL_MEALS);
      return INITIAL_MEALS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load meals from localStorage, falling back to defaults', err);
  }
  return INITIAL_MEALS;
}

export function saveMeals(meals: Meal[]): void {
  try {
    localStorage.setItem(MEALS_STORAGE_KEY, JSON.stringify(meals));
  } catch (err) {
    console.error('Failed to save meals to localStorage', err);
  }
}

export function resetToInitialMeals(): Meal[] {
  saveMeals(INITIAL_MEALS);
  return INITIAL_MEALS;
}

export const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'All',
  restaurant: 'All',
  onlyUncertain: false,
  onlyFavorites: false,
  layoutMode: 'compact-cards'
};

export function loadSavedFilters(): FilterState {
  try {
    const raw = localStorage.getItem(FILTERS_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_FILTERS, ...JSON.parse(raw) };
    }
  } catch {
    // Ignore error
  }
  return DEFAULT_FILTERS;
}

export function saveFilters(filters: FilterState): void {
  try {
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
  } catch {
    // Ignore error
  }
}

export function formatDateLabel(dateString: string): string {
  try {
    const d = new Date(dateString + 'T12:00:00');
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatDayHeader(dateString: string): { main: string; relative?: string } {
  try {
    const d = new Date(dateString + 'T12:00:00');
    const main = d.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return { main };
  } catch {
    return { main: dateString };
  }
}
