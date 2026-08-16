import React, { useState } from 'react';
import { usePrimeStore } from '../../lib/store';
import {
  Apple,
  Search,
  Plus,
  CheckCircle2,
  Calendar,
  User,
  Zap,
  Flame,
  Calculator,
  BookOpen,
  Award,
  Filter,
  FileText,
  Copy,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const NutritionOsView: React.FC = () => {
  const {
    clientMasterRecords,
    nutritionPlanRecords,
    syncNutritionPlanToSystem2,
    selectedStaffRole,
  } = usePrimeStore();

  const [activeTab, setActiveTab] = useState<'records' | 'builder' | 'calculator' | 'library'>('records');

  // Search & Filters for Records
  const [searchTerm, setSearchTerm] = useState('');
  const [dietFilter, setDietFilter] = useState('All');

  // Diet Plan Builder Form State
  const [selectedClient, setSelectedClient] = useState('CLI-101');
  const [dietType, setDietType] = useState('High-Protein Athletic Performance');
  const [caloriesTarget, setCaloriesTarget] = useState('3100');
  const [proteinGrams, setProteinGrams] = useState('210');
  const [carbsGrams, setCarbsGrams] = useState('320');
  const [fatsGrams, setFatsGrams] = useState('85');
  const [waterLiters, setWaterLiters] = useState('4.5');
  const [mealBreakdown, setMealBreakdown] = useState(
    'Meal 1 (08:00): 4 Eggs, 100g Oats with Berries & Honey\nMeal 2 (12:30): 200g Grilled Chicken Breast, 150g Jasmine Rice, Avocado\nMeal 3 Pre-Workout (16:00): Whey Isolate, Rice Cake & Banana\nMeal 4 Post-Workout (19:30): 220g Salmon, Sweet Potato, Asparagus\nMeal 5 (21:30): Greek Yogurt & Almonds'
  );
  const [specialNotes, setSpecialNotes] = useState('Post-workout carb refeed within 45 mins of heavy training.');
  const [assignedNutritionist, setAssignedNutritionist] = useState('Sara Al-Mansoori (Lead Nutritionist)');
  const [builderSuccess, setBuilderSuccess] = useState(false);

  // Calculator State
  const [calcWeight, setCalcWeight] = useState('82');
  const [calcHeight, setCalcHeight] = useState('180');
  const [calcAge, setCalcAge] = useState('29');
  const [calcGender, setCalcGender] = useState<'male' | 'female'>('male');
  const [calcActivity, setCalcActivity] = useState('1.55'); // Moderate/High
  const [calcGoal, setCalcGoal] = useState<'surplus' | 'maintenance' | 'deficit' | 'cut'>('surplus');

  // Calculated Results
  const calculateMacros = () => {
    const weight = Number(calcWeight) || 75;
    const height = Number(calcHeight) || 175;
    const age = Number(calcAge) || 28;
    const activity = Number(calcActivity) || 1.55;

    // Miffln-St Jeor Equation
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr += calcGender === 'male' ? 5 : -161;

    let tdee = Math.round(bmr * activity);

    if (calcGoal === 'surplus') tdee = Math.round(tdee * 1.15); // +15%
    else if (calcGoal === 'deficit') tdee = Math.round(tdee * 0.85); // -15%
    else if (calcGoal === 'cut') tdee = Math.round(tdee * 0.75); // -25% rapid cut

    const p = Math.round(weight * 2.4); // 2.4g/kg
    const f = Math.round((tdee * 0.25) / 9); // 25% calories from fat
    const remainingCals = tdee - (p * 4 + f * 9);
    const c = Math.max(50, Math.round(remainingCals / 4));
    const water = (weight * 0.045).toFixed(1);

    return { bmr: Math.round(bmr), tdee, p, c, f, water };
  };

  const calcResults = calculateMacros();

  const handleApplyCalcToBuilder = () => {
    setCaloriesTarget(calcResults.tdee.toString());
    setProteinGrams(calcResults.p.toString());
    setCarbsGrams(calcResults.c.toString());
    setFatsGrams(calcResults.f.toString());
    setWaterLiters(calcResults.water);
    setActiveTab('builder');
  };

  const handleSaveDietPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clientMasterRecords.find((c) => c.id === selectedClient) || clientMasterRecords[0];

    syncNutritionPlanToSystem2({
      clientId: client.id,
      clientName: client.name,
      caloriesTarget: Number(caloriesTarget) || 2500,
      proteinGrams: Number(proteinGrams) || 180,
      carbsGrams: Number(carbsGrams) || 250,
      fatsGrams: Number(fatsGrams) || 70,
      waterLiters: Number(waterLiters) || 4.0,
      notes: `${dietType} — ${specialNotes}\n\n[Meal Protocol]\n${mealBreakdown}`,
      assignedNutritionist: assignedNutritionist,
    });

    setBuilderSuccess(true);
    setTimeout(() => setBuilderSuccess(false), 3500);
  };

  // Protocols Library
  const protocolsLibrary = [
    {
      id: 'PROT-1',
      title: 'Pro Combat Weight Cut & Glycogen Load',
      category: 'Combat Sports',
      calories: 2200,
      protein: 220,
      carbs: 180,
      fats: 60,
      water: 5.5,
      summary: 'Designed for fight week weight management with rapid electrolyte rehydration protocols post-weigh-in.',
      meals: 'Meal 1: Egg White Omelet & Spinach\nMeal 2: Lean Turkey & White Rice\nMeal 3: Cod & Steamed Green Beans\nMeal 4: Casein & Electrolyte Slurry',
    },
    {
      id: 'PROT-2',
      title: 'Hypertrophy Surplus & Scapular Recovery',
      category: 'Strength & Mass',
      calories: 3400,
      protein: 230,
      carbs: 420,
      fats: 90,
      water: 4.8,
      summary: 'High carb availability to maximize intra-workout intra-cellular swelling and ATP synthesis.',
      meals: 'Meal 1: Cream of Rice, Whey Isolate & Peanut Butter\nMeal 2: Lean Beef & Jasmine Rice\nMeal 3 Pre-Workout: Cluster Dextrin + EAAs\nMeal 4 Post-Workout: Chicken, Sweet Potato & Honey\nMeal 5: Steak & Roasted Potatoes',
    },
    {
      id: 'PROT-3',
      title: 'Executive Low-Glycemic Anti-Inflammatory',
      category: 'Executive Health',
      calories: 2400,
      protein: 180,
      carbs: 160,
      fats: 95,
      water: 4.0,
      summary: 'Stabilizes insulin response, reduces joint inflammation, and sustains cognitive focus for high-stress executives.',
      meals: 'Meal 1: Avocado, Poached Eggs & Wild Salmon\nMeal 2: Organic Turkey Salad with Olive Oil Dressing\nMeal 3: Macadamia Nuts & Blueberries\nMeal 4: Wild Sea Bass, Quinoa & Grilled Asparagus',
    },
    {
      id: 'PROT-4',
      title: 'Plant-Based Endurance & Athletic Fueling',
      category: 'Vegan Athletic',
      calories: 2900,
      protein: 190,
      carbs: 380,
      fats: 75,
      water: 4.5,
      summary: 'Complete amino acid profile balancing pea/rice isolate, lentils, seeds, and fermented vegan proteins.',
      meals: 'Meal 1: Tofu Scramble with Turmeric & Whole Grain Toast\nMeal 2: Lentil & Quinoa Bowl with Tahini\nMeal 3 Pre-Run: Oats, Chia Seeds & Banana\nMeal 4: Tempeh Stir-fry with Brown Rice & Edamame',
    },
  ];

  const handleApplyTemplate = (prot: typeof protocolsLibrary[0]) => {
    setDietType(prot.title);
    setCaloriesTarget(prot.calories.toString());
    setProteinGrams(prot.protein.toString());
    setCarbsGrams(prot.carbs.toString());
    setFatsGrams(prot.fats.toString());
    setWaterLiters(prot.water.toString());
    setMealBreakdown(prot.meals);
    setSpecialNotes(prot.summary);
    setActiveTab('builder');
  };

  const filteredRecords = nutritionPlanRecords.filter((rec) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      rec.clientName.toLowerCase().includes(q) ||
      rec.assignedNutritionist.toLowerCase().includes(q) ||
      rec.notes.toLowerCase().includes(q);

    return matchesSearch;
  });

  return (
    <div className="space-y-5 pb-20 max-w-5xl mx-auto px-3 sm:px-6 pt-4">
      {/* Nutrition OS Header */}
      <div className="bg-[#14161f] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner hidden sm:flex">
              <Apple className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.75]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Nutrition OS
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                Nutrition & Dietetics
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                Macro programming, meal breakdowns, protocol templates, and client compliance.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('builder')}
            className="px-3.5 py-2 bg-gradient-to-r from-[#ec2226] to-[#06b6d4] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm hover:opacity-95 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Plan</span>
          </button>
        </div>

        {/* 4 Clean Balanced Bright & Dark Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-white/[0.06]">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 space-y-1 shadow-sm">
            <span className="text-[11px] text-slate-500 font-medium block">Active Plans</span>
            <span className="text-xl font-bold text-slate-900 font-mono block">{nutritionPlanRecords.length} <span className="text-xs font-sans text-slate-500 font-normal">Clients</span></span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 space-y-1 shadow-sm">
            <span className="text-[11px] text-slate-500 font-medium block">Lead Specialist</span>
            <span className="text-sm font-bold text-[#0891b2] truncate block">Sara Al-Mansoori</span>
          </div>

          <div className="bg-white border border-emerald-200/90 rounded-2xl p-3.5 space-y-1 shadow-sm">
            <span className="text-[11px] text-slate-500 font-medium block">Avg Compliance</span>
            <span className="text-xl font-bold text-emerald-600 font-mono block">92.5%</span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 space-y-1 shadow-sm">
            <span className="text-[11px] text-slate-500 font-medium block">Protocols</span>
            <span className="text-xl font-bold text-slate-900 font-mono block">{protocolsLibrary.length} <span className="text-xs font-sans text-slate-500 font-normal">Templates</span></span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex bg-[#14161f] border border-white/[0.08] rounded-2xl p-1 gap-1 overflow-x-auto no-scrollbar whitespace-nowrap">
        <button
          onClick={() => setActiveTab('records')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
            activeTab === 'records'
              ? 'bg-white text-[#0d0e12] shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Diet Plans ({nutritionPlanRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('builder')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
            activeTab === 'builder'
              ? 'bg-white text-[#0d0e12] shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Apple className="w-3.5 h-3.5" />
          <span>Builder</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
            activeTab === 'calculator'
              ? 'bg-white text-[#0d0e12] shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
            activeTab === 'library'
              ? 'bg-white text-[#0d0e12] shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Library</span>
        </button>
      </div>

      {/* TAB 1: CLIENT DIET RECORDS LIST */}
      {activeTab === 'records' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Apple className="w-4 h-4 text-emerald-400" /> Synchronized Client Diet Master Records
                </h3>
                <p className="text-xs text-neutral-400">
                  Active dietary protocols assigned by nutritionists and synced to Master Database.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search client, diet, notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#0A0A0B] border border-[#26262A] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredRecords.map((plan) => (
              <div
                key={plan.id}
                className="bg-[#161618] border border-[#26262A] hover:border-emerald-500/40 rounded-2xl p-4 space-y-3 shadow-lg transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                      {plan.id}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">{plan.clientName}</h4>
                  </div>

                  <span className="text-[10px] font-bold text-neutral-400 bg-[#0A0A0B] px-2 py-1 rounded-lg border border-[#26262A]">
                    Updated: {plan.lastUpdated}
                  </span>
                </div>

                {/* Macros Banner */}
                <div className="grid grid-cols-4 gap-1.5 p-2.5 bg-[#0A0A0B] rounded-xl text-center border border-[#202024]">
                  <div>
                    <span className="text-[9px] text-neutral-400 uppercase block">Calories</span>
                    <span className="text-xs font-black text-amber-400 font-mono">{plan.caloriesTarget} kcal</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-400 uppercase block">Protein</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">{plan.proteinGrams}g</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-400 uppercase block">Carbs</span>
                    <span className="text-xs font-bold text-blue-400 font-mono">{plan.carbsGrams}g</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-400 uppercase block">Fats</span>
                    <span className="text-xs font-bold text-purple-400 font-mono">{plan.fatsGrams}g</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-400 bg-[#0A0A0B]/50 p-2 rounded-xl">
                  <span>Hydration Target: <strong className="text-blue-300 font-mono">{plan.waterLiters} Liters/day</strong></span>
                  <span>Nutritionist: <strong className="text-emerald-300">{plan.assignedNutritionist}</strong></span>
                </div>

                {plan.notes && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block">Meal Guidelines & Notes</span>
                    <pre className="text-xs text-neutral-300 font-mono bg-[#0A0A0B] p-2.5 rounded-xl border border-[#202024] whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto no-scrollbar">
                      {plan.notes}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DIET PLAN BUILDER */}
      {activeTab === 'builder' && (
        <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-[#26262A]">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Apple className="w-4 h-4 text-emerald-400" /> Custom Diet & Macronutrient Program Builder
              </h3>
              <p className="text-xs text-neutral-400">
                Design specific caloric and macronutrient splits with timing protocols for assigned clients.
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Master DB Sync
            </span>
          </div>

          {builderSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" /> Diet plan successfully recorded and synced to Master Database!
            </div>
          )}

          <form onSubmit={handleSaveDietPlan} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Select Client</label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {clientMasterRecords.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id}) — {c.program}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Assigned Diet Specialist</label>
                <select
                  value={assignedNutritionist}
                  onChange={(e) => setAssignedNutritionist(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Sara Al-Mansoori (Lead Nutritionist)">Sara Al-Mansoori (Lead Nutritionist)</option>
                  <option value="Coach Ahmed (Head Coach)">Coach Ahmed (Head Coach)</option>
                  <option value="Dr. Zeyad (Physiotherapy)">Dr. Zeyad (Physiotherapy)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Diet Protocol Name / Category</label>
              <input
                type="text"
                required
                value={dietType}
                onChange={(e) => setDietType(e.target.value)}
                placeholder="e.g. High-Protein Athletic Performance & Refeed"
                className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Macros Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div>
                <label className="text-[10px] font-bold text-amber-400 uppercase block mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  required
                  value={caloriesTarget}
                  onChange={(e) => setCaloriesTarget(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">Protein (g)</label>
                <input
                  type="number"
                  required
                  value={proteinGrams}
                  onChange={(e) => setProteinGrams(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-blue-400 uppercase block mb-1">Carbs (g)</label>
                <input
                  type="number"
                  required
                  value={carbsGrams}
                  onChange={(e) => setCarbsGrams(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-purple-400 uppercase block mb-1">Fats (g)</label>
                <input
                  type="number"
                  required
                  value={fatsGrams}
                  onChange={(e) => setFatsGrams(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] font-bold text-cyan-400 uppercase block mb-1">Water (L/day)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={waterLiters}
                  onChange={(e) => setWaterLiters(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                Meal Schedule & Food Selections
              </label>
              <textarea
                rows={5}
                required
                value={mealBreakdown}
                onChange={(e) => setMealBreakdown(e.target.value)}
                placeholder="Meal 1 (08:00)..."
                className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                Special Directives & Intra-Workout Supplementation
              </label>
              <textarea
                rows={2}
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g. 5g Creatine monohydrate + 10g EAAs intra-workout..."
                className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
            >
              <Apple className="w-4 h-4" /> Save & Sync Client Diet Plan
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: BMR & TDEE CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-[#26262A]">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" /> BMR & TDEE Scientific Macronutrient Engine
              </h3>
              <p className="text-xs text-neutral-400">
                Mifflin-St Jeor athletic metabolic equation for precise energy expenditure calculations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Form */}
            <div className="space-y-3 bg-[#0A0A0B] p-4 rounded-xl border border-[#202024]">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Client Metabolic Inputs</h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Body Weight (kg)</label>
                  <input
                    type="number"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(e.target.value)}
                    className="w-full bg-[#161618] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={calcHeight}
                    onChange={(e) => setCalcHeight(e.target.value)}
                    className="w-full bg-[#161618] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={calcAge}
                    onChange={(e) => setCalcAge(e.target.value)}
                    className="w-full bg-[#161618] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Gender</label>
                  <select
                    value={calcGender}
                    onChange={(e) => setCalcGender(e.target.value as any)}
                    className="w-full bg-[#161618] border border-[#26262A] rounded-xl p-2 text-xs text-white focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Training Activity Multiplier</label>
                <select
                  value={calcActivity}
                  onChange={(e) => setCalcActivity(e.target.value)}
                  className="w-full bg-[#161618] border border-[#26262A] rounded-xl p-2 text-xs text-white focus:outline-none"
                >
                  <option value="1.2">Sedentary (1.2x)</option>
                  <option value="1.375">Light Athletic Training 1-3x/wk (1.375x)</option>
                  <option value="1.55">Moderate Athletic Training 3-5x/wk (1.55x)</option>
                  <option value="1.725">Heavy Pro Training 6-7x/wk (1.725x)</option>
                  <option value="1.9">Elite Double Sessions / Fight Camp (1.9x)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Athletic Objective</label>
                <select
                  value={calcGoal}
                  onChange={(e) => setCalcGoal(e.target.value as any)}
                  className="w-full bg-[#161618] border border-[#26262A] rounded-xl p-2 text-xs text-white focus:outline-none"
                >
                  <option value="surplus">Hypertrophy & Lean Bulk (+15%)</option>
                  <option value="maintenance">Metabolic Maintenance</option>
                  <option value="deficit">Recomposition & Fat Loss (-15%)</option>
                  <option value="cut">Combat Rapid Weight Cut (-25%)</option>
                </select>
              </div>
            </div>

            {/* Calculated Output Card */}
            <div className="bg-[#0A0A0B] p-4 rounded-xl border border-emerald-500/30 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> Target Energy Expenditure Results
                </h4>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="p-3 bg-[#161618] rounded-xl border border-[#26262A]">
                    <span className="text-[10px] text-neutral-400 uppercase block">Basal Metabolic Rate</span>
                    <span className="text-lg font-black text-white font-mono">{calcResults.bmr} <span className="text-xs text-neutral-500 font-normal">kcal</span></span>
                  </div>

                  <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                    <span className="text-[10px] text-emerald-400 uppercase block">Target Daily TDEE</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">{calcResults.tdee} <span className="text-xs text-emerald-500 font-normal">kcal</span></span>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-[#161618] rounded-xl border border-[#26262A] space-y-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block">Suggested Macronutrient Target Split</span>

                  <div className="grid grid-cols-4 gap-1 text-center font-mono">
                    <div className="bg-[#0A0A0B] p-2 rounded-lg">
                      <span className="text-[9px] text-emerald-400 block">PROTEIN</span>
                      <span className="text-xs font-bold text-white">{calcResults.p}g</span>
                    </div>

                    <div className="bg-[#0A0A0B] p-2 rounded-lg">
                      <span className="text-[9px] text-blue-400 block">CARBS</span>
                      <span className="text-xs font-bold text-white">{calcResults.c}g</span>
                    </div>

                    <div className="bg-[#0A0A0B] p-2 rounded-lg">
                      <span className="text-[9px] text-purple-400 block">FATS</span>
                      <span className="text-xs font-bold text-white">{calcResults.f}g</span>
                    </div>

                    <div className="bg-[#0A0A0B] p-2 rounded-lg">
                      <span className="text-[9px] text-cyan-400 block">WATER</span>
                      <span className="text-xs font-bold text-white">{calcResults.water}L</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleApplyCalcToBuilder}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-md"
              >
                <Apple className="w-4 h-4" /> Apply Calculated Target to Diet Builder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SPORTS NUTRITION PROTOCOLS LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 space-y-1 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" /> Pre-Built Elite Sports Nutrition Protocols
            </h3>
            <p className="text-xs text-neutral-400">
              Master diet templates designed by Lead Sports Nutritionist Sara Al-Mansoori. One-click to customize for any client.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {protocolsLibrary.map((prot) => (
              <div
                key={prot.id}
                className="bg-[#161618] border border-[#26262A] hover:border-emerald-500/40 rounded-2xl p-4 space-y-3 shadow-lg transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                      {prot.category}
                    </span>
                    <span className="text-xs font-black text-amber-400 font-mono">{prot.calories} kcal</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-inner">
                      <Apple className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{prot.title}</h4>
                      <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2">{prot.summary}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1 p-2 bg-[#0A0A0B] rounded-xl text-center text-xs font-mono border border-[#202024]">
                    <div>
                      <span className="text-[9px] text-neutral-500 block">PRO</span>
                      <span className="text-emerald-400 font-bold">{prot.protein}g</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block">CARB</span>
                      <span className="text-blue-400 font-bold">{prot.carbs}g</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block">FAT</span>
                      <span className="text-purple-400 font-bold">{prot.fats}g</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block">WATER</span>
                      <span className="text-cyan-400 font-bold">{prot.water}L</span>
                    </div>
                  </div>

                  <pre className="text-[10px] text-neutral-300 font-mono bg-[#0A0A0B] p-2.5 rounded-xl border border-[#202024] whitespace-pre-wrap max-h-28 overflow-y-auto no-scrollbar">
                    {prot.meals}
                  </pre>
                </div>

                <button
                  onClick={() => handleApplyTemplate(prot)}
                  className="w-full py-2 bg-[#202024] hover:bg-emerald-500 hover:text-black text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition mt-2"
                >
                  <Copy className="w-3.5 h-3.5" /> Use Template in Diet Builder
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
