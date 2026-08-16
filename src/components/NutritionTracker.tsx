import React, { useState } from 'react';
import { usePrimeStore } from '../lib/store';
import { MealEntry } from '../types';
import { Plus, Trash2, Utensils, Droplets, Flame, Shield, Edit2, X, Check, Clock, Sparkles } from 'lucide-react';

export const NutritionTracker: React.FC = () => {
  const {
    mealEntries,
    nutritionTarget,
    addMealEntry,
    deleteMealEntry,
    updateNutritionTarget,
  } = usePrimeStore();

  const todayStr = '2026-08-09';
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [showEditTargetModal, setShowEditTargetModal] = useState(false);

  // Form states for Add Meal
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState<MealEntry['mealType']>('Post-Workout');
  const [mealTime, setMealTime] = useState('01:30 PM');
  const [mealCalories, setMealCalories] = useState<number | ''>(550);
  const [mealProtein, setMealProtein] = useState<number | ''>(45);
  const [mealCarbs, setMealCarbs] = useState<number | ''>(60);
  const [mealFats, setMealFats] = useState<number | ''>(15);
  const [mealWater, setMealWater] = useState<number | ''>(0.5);
  const [mealNotes, setMealNotes] = useState('');

  // Form states for Edit Targets
  const [targetCalories, setTargetCalories] = useState(nutritionTarget?.calories || 3000);
  const [targetProtein, setTargetProtein] = useState(nutritionTarget?.protein || 190);
  const [targetCarbs, setTargetCarbs] = useState(nutritionTarget?.carbs || 310);
  const [targetFats, setTargetFats] = useState(nutritionTarget?.fats || 75);
  const [targetWater, setTargetWater] = useState(nutritionTarget?.water || 4.0);

  // Filter today's meals
  const todaysMeals = mealEntries.filter((m) => m.date === todayStr);

  // Calculate totals for today
  const totalCalories = todaysMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProtein = todaysMeals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const totalCarbs = todaysMeals.reduce((sum, m) => sum + (m.carbs || 0), 0);
  const totalFats = todaysMeals.reduce((sum, m) => sum + (m.fats || 0), 0);
  const totalWater = Number(todaysMeals.reduce((sum, m) => sum + (m.water || 0), 0).toFixed(1));

  // Percentages relative to targets
  const calPct = Math.min(100, Math.round((totalCalories / (nutritionTarget?.calories || 3000)) * 100));
  const proPct = Math.min(100, Math.round((totalProtein / (nutritionTarget?.protein || 190)) * 100));
  const carbPct = Math.min(100, Math.round((totalCarbs / (nutritionTarget?.carbs || 310)) * 100));
  const fatPct = Math.min(100, Math.round((totalFats / (nutritionTarget?.fats || 75)) * 100));
  const waterPct = Math.min(100, Math.round((totalWater / (nutritionTarget?.water || 4.0)) * 100));

  const handleSaveMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    addMealEntry({
      date: todayStr,
      time: mealTime || '12:00 PM',
      name: mealName.trim(),
      mealType,
      calories: Number(mealCalories) || 0,
      protein: Number(mealProtein) || 0,
      carbs: Number(mealCarbs) || 0,
      fats: Number(mealFats) || 0,
      water: Number(mealWater) || 0,
      notes: mealNotes.trim() || undefined,
    });

    // Reset form
    setMealName('');
    setMealNotes('');
    setShowAddMealModal(false);
  };

  const handleQuickAddPreset = (preset: {
    name: string;
    type: MealEntry['mealType'];
    cal: number;
    pro: number;
    carb: number;
    fat: number;
    wat: number;
  }) => {
    addMealEntry({
      date: todayStr,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: preset.name,
      mealType: preset.type,
      calories: preset.cal,
      protein: preset.pro,
      carbs: preset.carb,
      fats: preset.fat,
      water: preset.wat,
    });
  };

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    updateNutritionTarget({
      calories: Number(targetCalories) || 3000,
      protein: Number(targetProtein) || 190,
      carbs: Number(targetCarbs) || 310,
      fats: Number(targetFats) || 75,
      water: Number(targetWater) || 4.0,
    });
    setShowEditTargetModal(false);
  };

  const presetSuggestions = [
    { label: '🥩 Steak & Jasmine Rice', name: 'Grass-Fed Tenderloin Steak & Jasmine Rice', type: 'Post-Workout' as const, cal: 750, pro: 55, carb: 70, fat: 18, wat: 0.5 },
    { label: '🍳 4 Organic Eggs & Avocado', name: 'Organic Omelette (4 Eggs) + Avocado Toast', type: 'Breakfast' as const, cal: 580, pro: 36, carb: 40, fat: 26, wat: 0.4 },
    { label: '🥤 Whey Isolate Shake', name: 'Grass-Fed Whey Isolate Shake + Berries', type: 'Snack' as const, cal: 280, pro: 42, carb: 18, fat: 3, wat: 0.5 },
    { label: '💧 500ml Electrolyte Water', name: '500ml Mineral Water & Himalayan Electrolytes', type: 'Hydration' as const, cal: 0, pro: 0, carb: 0, fat: 0, wat: 0.5 },
  ];

  return (
    <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#26262A] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#FF5A1F]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Daily Athletic Nutrition & Macros Target
            </h3>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Log meals, track macro ratios & monitor real-time metabolic fueling
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEditTargetModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#202024] hover:bg-[#2A2A30] border border-[#303036] text-neutral-300 font-semibold rounded-xl text-xs transition"
            title="Edit Daily Macro Targets"
          >
            <Edit2 className="w-3.5 h-3.5 text-neutral-400" />
            <span>Targets</span>
          </button>

          <button
            onClick={() => setShowAddMealModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF5A1F] hover:bg-[#E04D18] text-white font-bold rounded-xl text-xs transition shadow-md shadow-[#FF5A1F]/20"
          >
            <Plus className="w-4 h-4" /> Log Nutrition
          </button>
        </div>
      </div>

      {/* Quick Add Presets */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
          Quick 1-Click Presets
        </span>
        <div className="flex flex-wrap gap-1.5">
          {presetSuggestions.map((ps, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAddPreset(ps)}
              className="flex items-center gap-1 bg-[#0A0A0B] hover:bg-[#202024] border border-[#26262A] hover:border-[#FF5A1F]/50 px-2.5 py-1 rounded-lg text-xs text-neutral-300 hover:text-white transition group"
            >
              <span>{ps.label}</span>
              <Plus className="w-3 h-3 text-neutral-500 group-hover:text-[#FF5A1F]" />
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Macro Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
        {/* Calories */}
        <div className="bg-[#0A0A0B] p-2.5 rounded-xl border border-[#26262A] space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-neutral-400 font-semibold flex items-center gap-1 text-[11px]">
              <Flame className="w-3.5 h-3.5 text-[#FF5A1F]" /> Calories
            </span>
            <span className="text-white font-mono font-bold text-xs">
              {totalCalories} / {nutritionTarget?.calories || 3000}
            </span>
          </div>
          <div className="w-full bg-[#161618] h-2 rounded-full overflow-hidden border border-[#26262A]">
            <div
              className="bg-[#FF5A1F] h-full rounded-full transition-all duration-500"
              style={{ width: `${calPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-neutral-400">
            <span>{calPct}% fulfilled</span>
            <span>{(nutritionTarget?.calories || 3000) - totalCalories > 0 ? `${(nutritionTarget?.calories || 3000) - totalCalories} kcal left` : 'Target Met'}</span>
          </div>
        </div>

        {/* Protein */}
        <div className="bg-[#0A0A0B] p-2.5 rounded-xl border border-[#26262A] space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-neutral-400 font-semibold flex items-center gap-1 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Protein
            </span>
            <span className="text-emerald-400 font-mono font-bold text-xs">
              {totalProtein}g / {nutritionTarget?.protein || 190}g
            </span>
          </div>
          <div className="w-full bg-[#161618] h-2 rounded-full overflow-hidden border border-[#26262A]">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${proPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-neutral-400">
            <span>{proPct}% fulfilled</span>
            <span>{(nutritionTarget?.protein || 190) - totalProtein > 0 ? `${(nutritionTarget?.protein || 190) - totalProtein}g left` : 'Target Met'}</span>
          </div>
        </div>

        {/* Carbs */}
        <div className="bg-[#0A0A0B] p-2.5 rounded-xl border border-[#26262A] space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-neutral-400 font-semibold flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Carbs
            </span>
            <span className="text-amber-400 font-mono font-bold text-xs">
              {totalCarbs}g / {nutritionTarget?.carbs || 310}g
            </span>
          </div>
          <div className="w-full bg-[#161618] h-2 rounded-full overflow-hidden border border-[#26262A]">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${carbPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-neutral-400">
            <span>{carbPct}% fulfilled</span>
            <span>{(nutritionTarget?.carbs || 310) - totalCarbs > 0 ? `${(nutritionTarget?.carbs || 310) - totalCarbs}g left` : 'Target Met'}</span>
          </div>
        </div>

        {/* Fats */}
        <div className="bg-[#0A0A0B] p-2.5 rounded-xl border border-[#26262A] space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-neutral-400 font-semibold flex items-center gap-1 text-[11px]">
              <Utensils className="w-3.5 h-3.5 text-purple-400" /> Fats
            </span>
            <span className="text-purple-400 font-mono font-bold text-xs">
              {totalFats}g / {nutritionTarget?.fats || 75}g
            </span>
          </div>
          <div className="w-full bg-[#161618] h-2 rounded-full overflow-hidden border border-[#26262A]">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${fatPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-neutral-400">
            <span>{fatPct}% fulfilled</span>
            <span>{(nutritionTarget?.fats || 75) - totalFats > 0 ? `${(nutritionTarget?.fats || 75) - totalFats}g left` : 'Target Met'}</span>
          </div>
        </div>

        {/* Hydration */}
        <div className="bg-[#0A0A0B] p-2.5 rounded-xl border border-[#26262A] space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-neutral-400 font-semibold flex items-center gap-1 text-[11px]">
              <Droplets className="w-3.5 h-3.5 text-blue-400" /> Hydration
            </span>
            <span className="text-blue-400 font-mono font-bold text-xs">
              {totalWater}L / {nutritionTarget?.water || 4.0}L
            </span>
          </div>
          <div className="w-full bg-[#161618] h-2 rounded-full overflow-hidden border border-[#26262A]">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${waterPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-neutral-400">
            <span>{waterPct}% fulfilled</span>
            <span>{(nutritionTarget?.water || 4.0) - totalWater > 0 ? `${((nutritionTarget?.water || 4.0) - totalWater).toFixed(1)}L left` : 'Target Met'}</span>
          </div>
        </div>
      </div>

      {/* Logged Meals List for Today */}
      <div className="space-y-2 pt-2 border-t border-[#26262A]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Today's Logged Meals ({todaysMeals.length})
          </span>
          <span className="text-[10px] text-neutral-400 font-mono">Date: {todayStr}</span>
        </div>

        {todaysMeals.length === 0 ? (
          <div className="bg-[#0A0A0B] border border-dashed border-[#26262A] rounded-xl p-4 text-center">
            <p className="text-xs text-neutral-400">No meals logged for today yet.</p>
            <button
              onClick={() => setShowAddMealModal(true)}
              className="mt-2 text-xs text-[#FF5A1F] hover:underline font-semibold"
            >
              + Click to add your first meal
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {todaysMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-[#0A0A0B] border border-[#26262A] hover:border-[#36363C] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#202024] text-[#FF5A1F] rounded-md border border-[#303036]">
                      {meal.mealType}
                    </span>
                    <span className="text-xs font-bold text-white">{meal.name}</span>
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      {meal.time}
                    </span>
                  </div>

                  {meal.notes && (
                    <p className="text-[11px] text-neutral-400 italic bg-[#161618] px-2 py-1 rounded border border-[#26262A]/60 w-fit">
                      "{meal.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0 border-t sm:border-0 border-[#26262A]">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-white font-bold">{meal.calories} kcal</span>
                    <span className="text-emerald-400">{meal.protein}g P</span>
                    <span className="text-amber-400">{meal.carbs}g C</span>
                    <span className="text-purple-400">{meal.fats}g F</span>
                    {meal.water > 0 && <span className="text-blue-400">{meal.water}L</span>}
                  </div>

                  <button
                    onClick={() => deleteMealEntry(meal.id)}
                    className="p-1 text-neutral-500 hover:text-red-400 transition"
                    title="Delete meal entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: ADD MEAL */}
      {showAddMealModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 w-full max-w-md space-y-3">
            <div className="flex items-center justify-between border-b border-[#26262A] pb-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-[#FF5A1F]" /> Log Nutrition / Meal
              </h3>
              <button
                onClick={() => setShowAddMealModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMeal} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Meal / Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Grass-Fed Steak & Jasmine Rice"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Meal Category</label>
                  <select
                    value={mealType}
                    onChange={(e: any) => setMealType(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Post-Workout">Post-Workout</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                    <option value="Hydration">Hydration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Time</label>
                  <input
                    type="text"
                    value={mealTime}
                    onChange={(e) => setMealTime(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={mealCalories}
                    onChange={(e) => setMealCalories(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-2.5 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-emerald-400 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={mealProtein}
                    onChange={(e) => setMealProtein(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-2.5 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-amber-400 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={mealCarbs}
                    onChange={(e) => setMealCarbs(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-2.5 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-purple-400 mb-1">Fats (g)</label>
                  <input
                    type="number"
                    value={mealFats}
                    onChange={(e) => setMealFats(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-2.5 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-blue-400 mb-1">Hydration Water (Liters)</label>
                <input
                  type="number"
                  step="0.1"
                  value={mealWater}
                  onChange={(e) => setMealWater(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Notes / Ingredients (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Grass-fed beef, organic olive oil, pink salt"
                  value={mealNotes}
                  onChange={(e) => setMealNotes(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF5A1F] hover:bg-[#E04D18] text-white font-bold rounded-xl text-xs transition shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Save Meal Entry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT TARGET MACROS */}
      {showEditTargetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 w-full max-w-md space-y-3">
            <div className="flex items-center justify-between border-b border-[#26262A] pb-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-1.5">
                <Edit2 className="w-4 h-4 text-[#FF5A1F]" /> Edit Daily Athletic Targets
              </h3>
              <button
                onClick={() => setShowEditTargetModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTargets} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Target Calories (kcal)</label>
                  <input
                    type="number"
                    value={targetCalories}
                    onChange={(e) => setTargetCalories(Number(e.target.value))}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-emerald-400 mb-1">Target Protein (g)</label>
                  <input
                    type="number"
                    value={targetProtein}
                    onChange={(e) => setTargetProtein(Number(e.target.value))}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-amber-400 mb-1">Target Carbs (g)</label>
                  <input
                    type="number"
                    value={targetCarbs}
                    onChange={(e) => setTargetCarbs(Number(e.target.value))}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-purple-400 mb-1">Target Fats (g)</label>
                  <input
                    type="number"
                    value={targetFats}
                    onChange={(e) => setTargetFats(Number(e.target.value))}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-blue-400 mb-1">Target Hydration (Liters)</label>
                <input
                  type="number"
                  step="0.1"
                  value={targetWater}
                  onChange={(e) => setTargetWater(Number(e.target.value))}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF5A1F] hover:bg-[#E04D18] text-white font-bold rounded-xl text-xs transition shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Save Targets
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
