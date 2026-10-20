export type MealCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Drink';

export interface NutritionInfo {
  calories: number;   // kcal
  protein: number;    // g
  fat: number;        // g
  carbs: number;      // g
  fiber: number;      // g
  sodium: number;     // mg
  isEstimated?: boolean;
}

export interface Meal {
  id: string;
  name: string;
  restaurant: string;
  location?: string;
  date: string; // YYYY-MM-DD
  category: MealCategory;
  recordedCount?: number;
  components: string[]; // "🥢 What I ate" (bulleted meal components & quantities)
  notes: string[];      // "📝 Little details" (personal observations, modifications, uneaten portions)
  nutrition: NutritionInfo;
  uncertainIdentity?: boolean; // Discreet indicator for uncertain food identities
  uncertaintyNote?: string;    // e.g. "Estimated recipe / portion unconfirmed"
  originalRecord?: {
    id: string;
    loggedAt?: string;
    entryMethod?: string;
    internalNotes?: string;
  };
  isFavorite?: boolean;
}

export type ViewMode = 'library' | 'detail' | 'restaurants' | 'daily';

export interface NavigationState {
  view: ViewMode;
  mealId?: string | null;
  restaurantFilter?: string | null;
  dateFilter?: string | null;
  fromView?: ViewMode;
  fromLabel?: string;
}

export interface FilterState {
  searchQuery: string;
  category: string; // 'All' | MealCategory
  restaurant: string; // 'All' | specific restaurant name
  onlyUncertain: boolean;
  onlyFavorites: boolean;
  layoutMode: 'compact-cards' | 'dense-list';
}
