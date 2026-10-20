import React, { useState, useEffect } from 'react';
import { Meal, MealCategory } from '../types/meal';
import { X, Plus, Trash2, HelpCircle } from 'lucide-react';

interface MealFormModalProps {
  isOpen: boolean;
  initialMeal?: Meal | null;
  onClose: () => void;
  onSave: (meal: Meal) => void;
  existingRestaurants: string[];
}

export const MealFormModal: React.FC<MealFormModalProps> = ({
  isOpen,
  initialMeal,
  onClose,
  onSave,
  existingRestaurants
}) => {
  const [name, setName] = useState('');
  const [restaurant, setRestaurant] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState<MealCategory>('Lunch');
  const [componentsText, setComponentsText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [calories, setCalories] = useState<number>(500);
  const [protein, setProtein] = useState<number>(20);
  const [fat, setFat] = useState<number>(15);
  const [carbs, setCarbs] = useState<number>(60);
  const [fiber, setFiber] = useState<number>(5);
  const [sodium, setSodium] = useState<number>(650);
  const [uncertainIdentity, setUncertainIdentity] = useState(false);
  const [uncertaintyNote, setUncertaintyNote] = useState('');

  useEffect(() => {
    if (initialMeal) {
      setName(initialMeal.name);
      setRestaurant(initialMeal.restaurant);
      setLocation(initialMeal.location || '');
      setDate(initialMeal.date);
      setCategory(initialMeal.category);
      setComponentsText(initialMeal.components.join('\n'));
      setNotesText(initialMeal.notes.join('\n'));
      setCalories(initialMeal.nutrition.calories);
      setProtein(initialMeal.nutrition.protein);
      setFat(initialMeal.nutrition.fat);
      setCarbs(initialMeal.nutrition.carbs);
      setFiber(initialMeal.nutrition.fiber);
      setSodium(initialMeal.nutrition.sodium);
      setUncertainIdentity(!!initialMeal.uncertainIdentity);
      setUncertaintyNote(initialMeal.uncertaintyNote || '');
    } else {
      setName('');
      setRestaurant('');
      setLocation('');
      setDate(new Date().toISOString().slice(0, 10));
      setCategory('Lunch');
      setComponentsText('');
      setNotesText('');
      setCalories(520);
      setProtein(24);
      setFat(18);
      setCarbs(65);
      setFiber(6);
      setSodium(720);
      setUncertainIdentity(false);
      setUncertaintyNote('');
    }
  }, [initialMeal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !restaurant.trim()) return;

    const components = componentsText
      .split('\n')
      .map(c => c.trim().replace(/^[-•*]\s*/, ''))
      .filter(Boolean);

    const notes = notesText
      .split('\n')
      .map(n => n.trim().replace(/^[-•*]\s*/, ''))
      .filter(Boolean);

    const mealData: Meal = {
      id: initialMeal?.id || `m_${Date.now()}`,
      name: name.trim(),
      restaurant: restaurant.trim(),
      location: location.trim() || undefined,
      date,
      category,
      recordedCount: initialMeal?.recordedCount || 1,
      components: components.length > 0 ? components : [name.trim()],
      notes,
      nutrition: {
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        fat: Number(fat) || 0,
        carbs: Number(carbs) || 0,
        fiber: Number(fiber) || 0,
        sodium: Number(sodium) || 0,
        isEstimated: uncertainIdentity
      },
      uncertainIdentity,
      uncertaintyNote: uncertainIdentity ? (uncertaintyNote.trim() || 'Estimated identity / portion unverified') : undefined,
      originalRecord: initialMeal?.originalRecord || {
        id: `rec_${Date.now()}`,
        loggedAt: new Date().toISOString(),
        entryMethod: 'Personal journal entry'
      },
      isFavorite: initialMeal?.isFavorite || false
    };

    onSave(mealData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl border border-[#ded7cc] shadow-xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#f2ece3] flex items-center justify-between">
          <h2 className="font-serif-journal text-lg sm:text-xl font-semibold text-[#221f1c]">
            {initialMeal ? 'Edit Meal Record' : 'Log a Meal'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8c827a] hover:text-[#2c2b29] hover:bg-[#f4efe8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Meal Name */}
          <div>
            <label className="block font-medium text-[#423c36] mb-1">
              Food / Meal Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sirloin Gyukatsu Set, Truffle Risotto"
              className="w-full px-3 py-2 bg-[#faf8f5] border border-[#ded7cc] rounded-lg text-[#2c2b29] focus:outline-none focus:ring-2 focus:ring-amber-800/20"
            />
          </div>

          {/* Restaurant & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#423c36] mb-1">
                Restaurant / Venue *
              </label>
              <input
                type="text"
                required
                list="restaurants-list"
                value={restaurant}
                onChange={(e) => setRestaurant(e.target.value)}
                placeholder="e.g. Maple Kitchen"
                className="w-full px-3 py-2 bg-[#faf8f5] border border-[#ded7cc] rounded-lg text-[#2c2b29] focus:outline-none focus:ring-2 focus:ring-amber-800/20"
              />
              <datalist id="restaurants-list">
                {existingRestaurants.filter(r => r !== 'All').map(r => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block font-medium text-[#423c36] mb-1">
                Location / Branch (optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Orchard Central, Waterfront"
                className="w-full px-3 py-2 bg-[#faf8f5] border border-[#ded7cc] rounded-lg text-[#2c2b29] focus:outline-none focus:ring-2 focus:ring-amber-800/20"
              />
            </div>
          </div>

          {/* Date & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#423c36] mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#faf8f5] border border-[#ded7cc] rounded-lg text-[#2c2b29] focus:outline-none focus:ring-2 focus:ring-amber-800/20 font-mono-numbers"
              />
            </div>

            <div>
              <label className="block font-medium text-[#423c36] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MealCategory)}
                className="w-full px-3 py-2 bg-[#faf8f5] border border-[#ded7cc] rounded-lg text-[#2c2b29] focus:outline-none focus:ring-2 focus:ring-amber-800/20 cursor-pointer"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
                <option value="Drink">Drink</option>
              </select>
            </div>
          </div>

          {/* 🥢 What I ate (Components) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-[#423c36]">
                🥢 What I ate (components & quantities, one per line)
              </label>
            </div>
            <textarea
              rows={3}
              value={componentsText}
              onChange={(e) => setComponentsText(e.target.value)}
              placeholder="Medium-rare breaded sirloin cutlet (130 g)&#10;Barley rice bowl (180 g)&#10;Shredded cabbage with yuzu dressing"
              className="w-full px-3 py-2 bg-[#faf8f5] border border-[#ded7cc] rounded-lg text-[#2c2b29] focus:outline-none focus:ring-2 focus:ring-amber-800/20 font-sans"
            />
          </div>

          {/* 📝 Little details */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-[#423c36]">
                📝 Little details (personal observations, modifications, uneaten portions)
              </label>
            </div>
            <textarea
              rows={2}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Asked for dressing on the side&#10;Left half of the steamed rice"
              className="w-full px-3 py-2 bg-[#faf8f5] border border-[#ded7cc] rounded-lg text-[#2c2b29] focus:outline-none focus:ring-2 focus:ring-amber-800/20 font-sans"
            />
          </div>

          {/* Discreet uncertain identity toggle */}
          <div className="p-3 bg-[#fbf9f5] border border-[#ece4d8] rounded-xl space-y-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={uncertainIdentity}
                onChange={(e) => setUncertainIdentity(e.target.checked)}
                className="w-4 h-4 rounded border-[#ded7cc] text-amber-900 focus:ring-amber-800/20"
              />
              <span className="font-medium text-[#423c36]">
                Discreet uncertain identity indicator (~)
              </span>
            </label>
            {uncertainIdentity && (
              <input
                type="text"
                value={uncertaintyNote}
                onChange={(e) => setUncertaintyNote(e.target.value)}
                placeholder="Reason (e.g. Unlisted menu recipe / portion estimated)"
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#ded7cc] rounded-lg text-[#2c2b29]"
              />
            )}
          </div>

          {/* 📊 Nutrition grid inputs */}
          <div>
            <label className="block font-medium text-[#423c36] mb-1.5">
              📊 Nutrition estimates (compact metrics)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
              <div>
                <span className="text-[#8c827a] block mb-0.5">Calories (kcal)</span>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-[#faf8f5] border border-[#ded7cc] rounded-lg font-mono-numbers"
                />
              </div>
              <div>
                <span className="text-[#8c827a] block mb-0.5">Protein (g)</span>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-[#faf8f5] border border-[#ded7cc] rounded-lg font-mono-numbers"
                />
              </div>
              <div>
                <span className="text-[#8c827a] block mb-0.5">Fat (g)</span>
                <input
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-[#faf8f5] border border-[#ded7cc] rounded-lg font-mono-numbers"
                />
              </div>
              <div>
                <span className="text-[#8c827a] block mb-0.5">Carbs (g)</span>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-[#faf8f5] border border-[#ded7cc] rounded-lg font-mono-numbers"
                />
              </div>
              <div>
                <span className="text-[#8c827a] block mb-0.5">Fibre (g)</span>
                <input
                  type="number"
                  value={fiber}
                  onChange={(e) => setFiber(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-[#faf8f5] border border-[#ded7cc] rounded-lg font-mono-numbers"
                />
              </div>
              <div>
                <span className="text-[#8c827a] block mb-0.5">Sodium (mg)</span>
                <input
                  type="number"
                  value={sodium}
                  onChange={(e) => setSodium(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-[#faf8f5] border border-[#ded7cc] rounded-lg font-mono-numbers"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-[#f2ece3] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#ded7cc] text-[#5c544d] hover:bg-[#faf8f5] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#3e3832] text-white hover:bg-[#2c2824] transition-colors font-medium shadow-xs cursor-pointer"
            >
              {initialMeal ? 'Save Changes' : 'Record Meal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
