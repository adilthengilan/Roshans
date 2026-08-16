import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  Repeat,
  ShieldAlert,
  Plus,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  Activity,
  Flame,
  ChevronRight,
  Info,
  Sliders,
  Sparkles,
} from 'lucide-react';

export interface Mesocycle {
  id: string;
  name: string;
  weeksRange: string;
  focusAttributes: string[];
  volumeTarget: string;
  intensityTarget: string;
  status: 'Completed' | 'Active' | 'Upcoming';
  deloadScheduledWeek: number; // e.g. Week 4 of meso
  notes: string;
}

export interface MicrocycleDay {
  day: string;
  shortDay: string;
  theme: string;
  morningSession: {
    title: string;
    focus: string;
    rpe: number;
    duration: number; // mins
    completed: boolean;
  };
  eveningSession?: {
    title: string;
    focus: string;
    rpe: number;
    duration: number; // mins
    completed: boolean;
  };
  isRestDay?: boolean;
}

export const AthleticPeriodization: React.FC = () => {
  // Periodization Sub-Tab Navigation
  const [periodTab, setPeriodTab] = useState<'macro' | 'meso' | 'micro' | 'deload'>('micro');

  // Macrocycle State
  const [macroTitle, setMacroTitle] = useState('2026 World Combat & Calisthenics Championship Peak');
  const [macroWeeks, setMacroWeeks] = useState(52);
  const [currentMacroWeek, setCurrentMacroWeek] = useState(32);
  const [macroPhase, setMacroPhase] = useState('Phase 3: Explosive Power & Speed Peaking');
  const [macroGoal, setMacroGoal] = useState(
    'Maximize fight conditioning, anaerobic threshold, and explosive power while preserving 81kg body composition.'
  );

  // Mesocycles State
  const [mesocycles, setMesocycles] = useState<Mesocycle[]>([
    {
      id: 'm1',
      name: 'Meso 1: Aerobic Base & Calisthenics Foundation',
      weeksRange: 'Weeks 1 - 8',
      focusAttributes: ['Endurance', 'Mobility', 'Work Capacity'],
      volumeTarget: 'High Volume (22 Sets/Week)',
      intensityTarget: 'Moderate (RPE 6-7)',
      status: 'Completed',
      deloadScheduledWeek: 4,
      notes: 'Built solid structural integrity in shoulder girdle & tendon resilience.',
    },
    {
      id: 'm2',
      name: 'Meso 2: Maximal Strength & Neural Drive',
      weeksRange: 'Weeks 9 - 16',
      focusAttributes: ['Strength', 'Power', 'Anaerobic Engine'],
      volumeTarget: 'Moderate Volume (16 Sets/Week)',
      intensityTarget: 'High Intensity (RPE 8.5-9.5)',
      status: 'Completed',
      deloadScheduledWeek: 4,
      notes: 'Set new PR in weighted pull-ups (+20kg x 8 reps) and strict ring dips.',
    },
    {
      id: 'm3',
      name: 'Meso 3: Hypertrophy & Ring Skill Progression',
      weeksRange: 'Weeks 17 - 24',
      focusAttributes: ['Strength', 'Explosive Power', 'Agility'],
      volumeTarget: 'High Volume (20 Sets/Week)',
      intensityTarget: 'Moderate-High (RPE 7.5-8.5)',
      status: 'Completed',
      deloadScheduledWeek: 4,
      notes: 'Achieved 5 strict ring muscle-ups; improved kickboxing footwork agility.',
    },
    {
      id: 'm4',
      name: 'Meso 4: Explosive Power & Anaerobic Threshold Peak',
      weeksRange: 'Weeks 25 - 32',
      focusAttributes: ['Explosive Power', 'Speed', 'Agility', 'Anaerobic Engine'],
      volumeTarget: 'Moderate Volume (14 Sets/Week)',
      intensityTarget: 'Peak Intensity (RPE 9-10)',
      status: 'Active',
      deloadScheduledWeek: 4,
      notes: 'Current active block. Focusing on plyometrics, heavy bag combinations, and Echo bike intervals.',
    },
    {
      id: 'm5',
      name: 'Meso 5: Competition Tapering & Fine Technique',
      weeksRange: 'Weeks 33 - 40',
      focusAttributes: ['Speed', 'Agility', 'Recovery', 'Precision'],
      volumeTarget: 'Low Volume (10 Sets/Week)',
      intensityTarget: 'High Speed / Low Fatigue',
      status: 'Upcoming',
      deloadScheduledWeek: 3,
      notes: 'Sharpen fight reaction times, footwork drills, and weight cut protocol.',
    },
  ]);

  const [activeMesoId, setActiveMesoId] = useState<string>('m4');

  // Deload State
  const [isDeloadActive, setIsDeloadActive] = useState<boolean>(false);
  const [deloadReduction, setDeloadReduction] = useState<number>(45); // 45% volume reduction
  const [deloadMaxRpe, setDeloadMaxRpe] = useState<number>(6);
  const [deloadReason, setDeloadReason] = useState('Scheduled 4th Week Deload / Central Nervous System Recovery');

  // Microcycle (Weekly Schedule) State
  const [microcycleDays, setMicrocycleDays] = useState<MicrocycleDay[]>([
    {
      day: 'Monday',
      shortDay: 'MON',
      theme: 'Double Day: Upper Ring Power + Striking Sparring',
      morningSession: {
        title: 'Calisthenics & Ring Power',
        focus: 'Strict Muscle-Ups 5x5, Planche Leans, Weighted Dips',
        rpe: 8.5,
        duration: 60,
        completed: true,
      },
      eveningSession: {
        title: 'Kickboxing & Heavy Bag Sparring',
        focus: '6 Rounds Pad Work, Slip Counter Drills & Sparring',
        rpe: 9.0,
        duration: 75,
        completed: true,
      },
    },
    {
      day: 'Tuesday',
      shortDay: 'TUE',
      theme: 'Anaerobic Engine & Boxing Footwork',
      morningSession: {
        title: 'Boxing Footwork & Mitts',
        focus: 'T-Test Agility Drills, Pivot Footwork, Speed Combos',
        rpe: 8.0,
        duration: 50,
        completed: true,
      },
      eveningSession: {
        title: 'CrossFit Anaerobic Intervals',
        focus: 'Echo Bike Sprints 10x30s ON / 30s OFF, Kettlebell Snatches',
        rpe: 9.5,
        duration: 45,
        completed: false,
      },
    },
    {
      day: 'Wednesday',
      shortDay: 'WED',
      theme: 'Double Day: Lower Explosive Strength + Grappling',
      morningSession: {
        title: 'Explosive Lower Body & Plyometrics',
        focus: 'Depth Jumps, Pistol Squats, Broad Jumps 5x3',
        rpe: 8.5,
        duration: 60,
        completed: false,
      },
      eveningSession: {
        title: 'Wrestling & BJJ Takedowns',
        focus: 'Double Leg Entries, Guard Passing & Scrambles',
        rpe: 8.5,
        duration: 90,
        completed: false,
      },
    },
    {
      day: 'Thursday',
      shortDay: 'THU',
      theme: 'Active Skill Flow & Core Stability',
      morningSession: {
        title: 'Calisthenics Skill & Handstands',
        focus: 'Freestanding Handstand Practice, Front Lever Progression',
        rpe: 7.0,
        duration: 45,
        completed: false,
      },
      eveningSession: {
        title: 'Zone 2 Aerobic Flush',
        focus: '45 Mins Row Ergometer @ 135 bpm HR',
        rpe: 6.0,
        duration: 45,
        completed: false,
      },
    },
    {
      day: 'Friday',
      shortDay: 'FRI',
      theme: 'Maximum Power & Hard Sparring',
      morningSession: {
        title: 'Max Upper Body Pull & Push',
        focus: 'Weighted Pull-Ups 4x5 (+25kg), Deficit HSPU',
        rpe: 9.0,
        duration: 60,
        completed: false,
      },
      eveningSession: {
        title: 'Open Mat Combat Sparring',
        focus: '8 x 3-Min Rounds Mixed Rules Sparring',
        rpe: 9.5,
        duration: 60,
        completed: false,
      },
    },
    {
      day: 'Saturday',
      shortDay: 'SAT',
      theme: 'Active Recovery & Joint Decompression',
      morningSession: {
        title: 'Pancake & Hip Mobility Flow',
        focus: 'Loaded Stretching, Jefferson Curls, CARs Rotations',
        rpe: 5.0,
        duration: 50,
        completed: false,
      },
      isRestDay: false,
    },
    {
      day: 'Sunday',
      shortDay: 'SUN',
      theme: 'Complete Rest, Ice Bath & Sauna Deload',
      morningSession: {
        title: 'Contrast Therapy & Hydrotherapy',
        focus: '15 Mins Sauna + 3 Mins Ice Bath (3 Cycles)',
        rpe: 3.0,
        duration: 45,
        completed: false,
      },
      isRestDay: true,
    },
  ]);

  // Modal State for adding Mesocycle
  const [showAddMesoModal, setShowAddMesoModal] = useState(false);
  const [newMesoName, setNewMesoName] = useState('');
  const [newMesoWeeks, setNewMesoWeeks] = useState('Weeks 33 - 36');
  const [newMesoAttr, setNewMesoAttr] = useState('Explosive Power, Speed, Agility');
  const [newMesoVol, setNewMesoVol] = useState('Moderate (16 Sets/Wk)');
  const [newMesoInt, setNewMesoInt] = useState('Peak (RPE 9-10)');

  const activeMeso = mesocycles.find((m) => m.id === activeMesoId) || mesocycles[3];

  const handleToggleSession = (dayIndex: number, sessionKey: 'morningSession' | 'eveningSession') => {
    const updated = [...microcycleDays];
    const sess = updated[dayIndex][sessionKey];
    if (sess) {
      sess.completed = !sess.completed;
      setMicrocycleDays(updated);
    }
  };

  const handleCreateMeso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMesoName.trim()) return;

    const newMeso: Mesocycle = {
      id: `meso-${Date.now()}`,
      name: newMesoName.trim(),
      weeksRange: newMesoWeeks,
      focusAttributes: newMesoAttr.split(',').map((s) => s.trim()),
      volumeTarget: newMesoVol,
      intensityTarget: newMesoInt,
      status: 'Upcoming',
      deloadScheduledWeek: 4,
      notes: 'New custom planned mesocycle block.',
    };

    setMesocycles([...mesocycles, newMeso]);
    setShowAddMesoModal(false);
    setNewMesoName('');
  };

  const totalWeeklySessions = microcycleDays.reduce((acc, curr) => {
    let cnt = curr.morningSession ? 1 : 0;
    if (curr.eveningSession) cnt += 1;
    return acc + cnt;
  }, 0);

  const completedWeeklySessions = microcycleDays.reduce((acc, curr) => {
    let cnt = curr.morningSession?.completed ? 1 : 0;
    if (curr.eveningSession?.completed) cnt += 1;
    return acc + cnt;
  }, 0);

  return (
    <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 sm:p-5 shadow-xl space-y-5">
      {/* Header & Main Toggle Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#26262A] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 text-[#FF5A1F] rounded-lg">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                Athletic Periodization Planner
              </h2>
              <p className="text-xs text-neutral-400">
                Macrocycle (Annual) → Mesocycle (4-8 Wks) → Microcycle (7 Days) → Active Deload Management
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Deload Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDeloadActive(!isDeloadActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-sm ${
              isDeloadActive
                ? 'bg-amber-500 text-black border-amber-400 font-extrabold animate-pulse'
                : 'bg-[#0A0A0B] text-amber-400 border-amber-500/30 hover:border-amber-400'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            {isDeloadActive ? 'DELOAD ACTIVE (45% Volume Drop)' : 'Trigger Active Deload Week'}
          </button>
        </div>
      </div>

      {/* Periodization Level Tabs (Macro, Meso, Micro, Deload) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0A0A0B] p-1.5 rounded-xl border border-[#26262A]">
        <button
          onClick={() => setPeriodTab('macro')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            periodTab === 'macro'
              ? 'bg-[#FF5A1F] text-white shadow'
              : 'text-neutral-400 hover:text-white hover:bg-[#161618]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>1. Macrocycle ({macroWeeks} Wks)</span>
        </button>

        <button
          onClick={() => setPeriodTab('meso')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            periodTab === 'meso'
              ? 'bg-[#FF5A1F] text-white shadow'
              : 'text-neutral-400 hover:text-white hover:bg-[#161618]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2. Mesocycles ({mesocycles.length} Blocks)</span>
        </button>

        <button
          onClick={() => setPeriodTab('micro')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            periodTab === 'micro'
              ? 'bg-[#FF5A1F] text-white shadow'
              : 'text-neutral-400 hover:text-white hover:bg-[#161618]'
          }`}
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>3. Microcycle (7-Day Plan)</span>
        </button>

        <button
          onClick={() => setPeriodTab('deload')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            periodTab === 'deload'
              ? 'bg-amber-600 text-white shadow'
              : isDeloadActive
              ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
              : 'text-neutral-400 hover:text-white hover:bg-[#161618]'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>4. Deload Protocol</span>
        </button>
      </div>

      {/* Active Deload Warning Banner if Deload is Enabled */}
      {isDeloadActive && (
        <div className="bg-amber-950/20 border border-amber-500/40 p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-amber-300 block">ACTIVE DELOAD PHASE ENGAGED</span>
              <p className="text-[11px] text-amber-200/80">
                All training session volumes are automatically cut by {deloadReduction}%. Target RPE capped at {deloadMaxRpe}/10. Priority: Joint restoration, CNS recovery, and mobility.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDeloadActive(false)}
            className="px-3 py-1 bg-amber-500 text-black font-bold text-xs rounded-lg hover:bg-amber-400 transition shrink-0"
          >
            End Deload Early
          </button>
        </div>
      )}

      {/* VIEW 1: MACROCYCLE (Annual Plan) */}
      {periodTab === 'macro' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-[#0A0A0B] border border-[#26262A] p-4 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#26262A] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#FF5A1F] bg-[#FF5A1F]/10 px-2 py-0.5 rounded font-bold border border-[#FF5A1F]/20">
                  Annual Macrocycle Plan
                </span>
                <h3 className="text-sm font-bold text-white mt-1">{macroTitle}</h3>
              </div>

              <div className="text-right">
                <span className="text-sm font-black font-mono text-emerald-400">
                  Week {currentMacroWeek} / {macroWeeks}
                </span>
                <span className="text-[10px] text-neutral-400 block font-semibold">{macroPhase}</span>
              </div>
            </div>

            {/* Macrocycle Visual Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-neutral-400">
                <span>Annual Timeline Progress</span>
                <span className="text-white font-mono">{Math.round((currentMacroWeek / macroWeeks) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-[#1A1A1E] h-3 rounded-full overflow-hidden border border-[#26262A]">
                <div
                  className="bg-gradient-to-r from-[#FF5A1F] via-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(currentMacroWeek / macroWeeks) * 100}%` }}
                />
              </div>
            </div>

            {/* Macro Goal Details */}
            <div className="p-3 bg-[#121215] border border-[#26262A] rounded-xl text-xs space-y-1">
              <span className="font-bold text-[#FF5A1F] uppercase tracking-wider block text-[10px]">
                Primary Macrocycle Objective:
              </span>
              <p className="text-neutral-300 italic">"{macroGoal}"</p>
            </div>

            {/* 6 Phase Macrocycle Roadmap */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                Macrocycle Structural Phases Breakdown
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="bg-[#121215] border border-emerald-500/30 p-3 rounded-xl space-y-1">
                  <div className="flex justify-between text-xs font-bold text-emerald-400">
                    <span>Phase 1: Base & Integrity</span>
                    <span>Wks 1 - 12 ✓</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">GPP, Tendon Conditioning, Aerobic Base Build</p>
                </div>

                <div className="bg-[#121215] border border-emerald-500/30 p-3 rounded-xl space-y-1">
                  <div className="flex justify-between text-xs font-bold text-emerald-400">
                    <span>Phase 2: Max Strength</span>
                    <span>Wks 13 - 24 ✓</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">Heavy Calisthenics, Weighted Pulls/Dips, Neural Drive</p>
                </div>

                <div className="bg-[#121215] border border-[#FF5A1F] p-3 rounded-xl space-y-1 shadow-md shadow-[#FF5A1F]/10">
                  <div className="flex justify-between text-xs font-bold text-[#FF5A1F]">
                    <span>Phase 3: Explosive Power</span>
                    <span className="bg-[#FF5A1F]/20 px-1.5 py-0.5 rounded text-[10px]">CURRENT (Wks 25-36)</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 font-semibold">Plyometrics, Anaerobic Threshold, Fight Sparring</p>
                </div>

                <div className="bg-[#121215] border border-[#26262A] p-3 rounded-xl space-y-1 opacity-70">
                  <div className="flex justify-between text-xs font-bold text-neutral-300">
                    <span>Phase 4: Speed & Taper</span>
                    <span>Wks 37 - 44</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">High Velocity, Footwork Precision, Fat Cut</p>
                </div>

                <div className="bg-[#121215] border border-[#26262A] p-3 rounded-xl space-y-1 opacity-70">
                  <div className="flex justify-between text-xs font-bold text-neutral-300">
                    <span>Phase 5: Competition Peak</span>
                    <span>Wks 45 - 48</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">Championship Performance & Fight Readiness</p>
                </div>

                <div className="bg-[#121215] border border-[#26262A] p-3 rounded-xl space-y-1 opacity-70">
                  <div className="flex justify-between text-xs font-bold text-neutral-300">
                    <span>Phase 6: Active Transition</span>
                    <span>Wks 49 - 52</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">Complete Restoration & Next Season Planning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: MESOCYCLES (4-8 Week Training Blocks) */}
      {periodTab === 'meso' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Mesocycle Training Blocks ({mesocycles.length} Planned Blocks)
              </h3>
              <p className="text-[11px] text-neutral-400">
                Each mesocycle targets specific athletic adaptations with built-in Deload weeks
              </p>
            </div>

            <button
              onClick={() => setShowAddMesoModal(true)}
              className="px-3 py-1.5 bg-[#FF5A1F] hover:bg-[#E04D18] text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow"
            >
              <Plus className="w-4 h-4" /> Add Custom Mesocycle Block
            </button>
          </div>

          <div className="space-y-3">
            {mesocycles.map((meso) => {
              const isActive = meso.id === activeMesoId;

              return (
                <div
                  key={meso.id}
                  className={`p-4 rounded-xl border transition space-y-3 ${
                    meso.status === 'Active'
                      ? 'bg-[#0A0A0B] border-[#FF5A1F] shadow-lg shadow-[#FF5A1F]/10'
                      : meso.status === 'Completed'
                      ? 'bg-[#0A0A0B]/60 border-[#26262A] opacity-80'
                      : 'bg-[#0A0A0B] border-[#26262A]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#26262A] pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{meso.name}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            meso.status === 'Active'
                              ? 'bg-[#FF5A1F]/20 text-[#FF5A1F] border-[#FF5A1F]/40'
                              : meso.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                          }`}
                        >
                          {meso.status.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-[#FF5A1F] font-bold mt-0.5 block">
                        {meso.weeksRange} · Deload Scheduled on Week {meso.deloadScheduledWeek}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {meso.status !== 'Active' && (
                        <button
                          onClick={() => {
                            setMesocycles(
                              mesocycles.map((m) => ({
                                ...m,
                                status: m.id === meso.id ? 'Active' : m.status === 'Active' ? 'Completed' : m.status,
                              }))
                            );
                            setActiveMesoId(meso.id);
                          }}
                          className="px-2.5 py-1 bg-[#161618] hover:bg-[#222226] border border-[#26262A] text-neutral-300 font-bold rounded-lg transition"
                        >
                          Set as Active Block
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Focus Attributes Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase mr-1">Target Attributes:</span>
                    {meso.focusAttributes.map((attr, idx) => (
                      <span
                        key={idx}
                        className="bg-[#121215] border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded-md text-[10px] font-bold"
                      >
                        ⚡ {attr}
                      </span>
                    ))}
                  </div>

                  {/* Parameters Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                    <div className="bg-[#121215] p-2 rounded-lg border border-[#26262A]">
                      <span className="text-[10px] text-neutral-500 uppercase block">Target Volume</span>
                      <span className="text-white font-bold">{meso.volumeTarget}</span>
                    </div>

                    <div className="bg-[#121215] p-2 rounded-lg border border-[#26262A]">
                      <span className="text-[10px] text-neutral-500 uppercase block">Target Intensity</span>
                      <span className="text-amber-400 font-bold">{meso.intensityTarget}</span>
                    </div>

                    <div className="bg-[#121215] p-2 rounded-lg border border-[#26262A] col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-neutral-500 uppercase block">Deload Frequency</span>
                      <span className="text-emerald-400 font-bold">Week {meso.deloadScheduledWeek} (3:1 Loading)</span>
                    </div>
                  </div>

                  {meso.notes && (
                    <p className="text-xs text-neutral-400 italic bg-[#121215] p-2 rounded-lg border border-[#26262A]">
                      "{meso.notes}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: MICROCYCLE (7-Day Weekly Session Plan) */}
      {periodTab === 'micro' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#0A0A0B] p-3 rounded-xl border border-[#26262A]">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#FF5A1F] uppercase">
                Active Microcycle Schedule ({activeMeso.name})
              </span>
              <h3 className="text-xs font-bold text-white">7-Day High-Performance Athletic Split</h3>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-neutral-400">
                Sessions Completed: <span className="text-emerald-400 font-bold">{completedWeeklySessions} / {totalWeeklySessions}</span>
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/20">
                {Math.round((completedWeeklySessions / Math.max(1, totalWeeklySessions)) * 100)}% Adherence
              </span>
            </div>
          </div>

          {/* 7 Days Schedule Cards */}
          <div className="space-y-3">
            {microcycleDays.map((dayObj, index) => (
              <div
                key={dayObj.day}
                className={`p-3.5 rounded-xl border transition space-y-3 ${
                  dayObj.isRestDay
                    ? 'bg-[#0A0A0B]/80 border-blue-500/30'
                    : 'bg-[#0A0A0B] border-[#26262A] hover:border-neutral-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#1F1F24] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-mono bg-[#FF5A1F] text-white px-2 py-0.5 rounded">
                      {dayObj.shortDay}
                    </span>
                    <span className="text-xs font-bold text-white">{dayObj.day}</span>
                    {dayObj.isRestDay && (
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-bold">
                        REST & HYDROTHERAPY
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-neutral-400 font-semibold">{dayObj.theme}</span>
                </div>

                {/* Session Slots (Morning & Evening) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {/* Morning Session */}
                  <div
                    className={`p-3 rounded-xl border transition flex items-start justify-between gap-2 ${
                      dayObj.morningSession.completed
                        ? 'bg-emerald-950/10 border-emerald-500/30'
                        : 'bg-[#121215] border-[#26262A]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-[#FF5A1F] bg-[#FF5A1F]/10 px-1.5 py-0.5 rounded">
                          Morning Session
                        </span>
                        <span className="text-xs font-bold text-white">{dayObj.morningSession.title}</span>
                      </div>
                      <p className="text-xs text-neutral-400">{dayObj.morningSession.focus}</p>
                      <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-neutral-400 pt-1">
                        <span>Duration: {dayObj.morningSession.duration}m</span>
                        <span className={isDeloadActive ? 'text-amber-400' : 'text-purple-400'}>
                          Target RPE: {isDeloadActive ? Math.min(6, dayObj.morningSession.rpe) : dayObj.morningSession.rpe}/10
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleSession(index, 'morningSession')}
                      className={`p-1.5 rounded-lg border transition ${
                        dayObj.morningSession.completed
                          ? 'bg-emerald-500 text-black border-emerald-400'
                          : 'bg-[#0A0A0B] text-neutral-500 border-[#26262A] hover:text-white'
                      }`}
                      title="Toggle Session Completion"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Evening Session (if present) */}
                  {dayObj.eveningSession ? (
                    <div
                      className={`p-3 rounded-xl border transition flex items-start justify-between gap-2 ${
                        dayObj.eveningSession.completed
                          ? 'bg-emerald-950/10 border-emerald-500/30'
                          : 'bg-[#121215] border-[#26262A]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                            Evening Session
                          </span>
                          <span className="text-xs font-bold text-white">{dayObj.eveningSession.title}</span>
                        </div>
                        <p className="text-xs text-neutral-400">{dayObj.eveningSession.focus}</p>
                        <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-neutral-400 pt-1">
                          <span>Duration: {dayObj.eveningSession.duration}m</span>
                          <span className={isDeloadActive ? 'text-amber-400' : 'text-purple-400'}>
                            Target RPE: {isDeloadActive ? Math.min(6, dayObj.eveningSession.rpe) : dayObj.eveningSession.rpe}/10
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleSession(index, 'eveningSession')}
                        className={`p-1.5 rounded-lg border transition ${
                          dayObj.eveningSession.completed
                            ? 'bg-emerald-500 text-black border-emerald-400'
                            : 'bg-[#0A0A0B] text-neutral-500 border-[#26262A] hover:text-white'
                        }`}
                        title="Toggle Session Completion"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl border border-[#26262A] bg-[#121215]/50 flex items-center justify-center text-xs text-neutral-500 italic">
                      Single Session Day — Focus on Nutrition & Evening Recovery
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: DELOAD PHASE MANAGEMENT */}
      {periodTab === 'deload' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-[#0A0A0B] border border-amber-500/30 p-4 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#26262A] pb-3">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" /> Active Deload & Fatigue Management Protocol
                </span>
                <p className="text-[11px] text-neutral-400">
                  Deloading dissipates systemic fatigue while retaining fitness adaptations
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDeloadActive(!isDeloadActive)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    isDeloadActive
                      ? 'bg-amber-500 text-black border-amber-400 font-extrabold'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                  }`}
                >
                  {isDeloadActive ? 'DELOAD PHASE ENGAGED ✓' : 'Engage Deload Week Now'}
                </button>
              </div>
            </div>

            {/* Deload Parameters Form Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#121215] border border-[#26262A] p-3 rounded-xl space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">
                  Volume Reduction (% Cut)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="20"
                    max="60"
                    step="5"
                    value={deloadReduction}
                    onChange={(e) => setDeloadReduction(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <span className="text-sm font-black font-mono text-amber-400">{deloadReduction}%</span>
                </div>
                <span className="text-[10px] text-neutral-500 block">Recommended: 40% - 50% cut</span>
              </div>

              <div className="bg-[#121215] border border-[#26262A] p-3 rounded-xl space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">
                  Intensity Cap (Max RPE)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="4"
                    max="7"
                    step="0.5"
                    value={deloadMaxRpe}
                    onChange={(e) => setDeloadMaxRpe(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <span className="text-sm font-black font-mono text-amber-400">RPE {deloadMaxRpe}</span>
                </div>
                <span className="text-[10px] text-neutral-500 block">Recommended: RPE ≤ 6.0</span>
              </div>

              <div className="bg-[#121215] border border-[#26262A] p-3 rounded-xl space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">
                  Deload Frequency Target
                </label>
                <span className="text-xs font-bold text-white block mt-1">3 Weeks Hard + 1 Week Deload (3:1)</span>
                <span className="text-[10px] text-emerald-400 block font-semibold">Prevents Overtraining & Injury</span>
              </div>
            </div>

            {/* Deload Guidelines Checklist */}
            <div className="space-y-2 pt-2 border-t border-[#1F1F24]">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Athletic Deload Action Plan
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="bg-[#121215] p-2.5 rounded-xl border border-[#26262A] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-neutral-300">Cut working sets from 5x5 to 3x3 at 70% 1RM load</span>
                </div>
                <div className="bg-[#121215] p-2.5 rounded-xl border border-[#26262A] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-neutral-300">Replace hard sparring with light technical drill flows</span>
                </div>
                <div className="bg-[#121215] p-2.5 rounded-xl border border-[#26262A] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-neutral-300">Increase sauna & cold plunge duration to boost blood flow</span>
                </div>
                <div className="bg-[#121215] p-2.5 rounded-xl border border-[#26262A] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-neutral-300">Prioritize 8.5+ hours sleep and anti-inflammatory nutrition</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE MESOCYCLE BLOCK */}
      {showAddMesoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#26262A] pb-3">
              <h3 className="text-sm font-bold text-white">Add Custom Mesocycle Block</h3>
              <button
                onClick={() => setShowAddMesoModal(false)}
                className="text-neutral-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMeso} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                  Mesocycle Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Meso 6: Speed, Punch Velocity & Tapering"
                  value={newMesoName}
                  onChange={(e) => setNewMesoName(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                  Weeks Duration Range
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Weeks 33 - 38"
                  value={newMesoWeeks}
                  onChange={(e) => setNewMesoWeeks(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                  Target Focus Attributes (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="Speed, Agility, Explosive Power"
                  value={newMesoAttr}
                  onChange={(e) => setNewMesoAttr(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                    Volume Target
                  </label>
                  <input
                    type="text"
                    value={newMesoVol}
                    onChange={(e) => setNewMesoVol(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                    Intensity Target
                  </label>
                  <input
                    type="text"
                    value={newMesoInt}
                    onChange={(e) => setNewMesoInt(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMesoModal(false)}
                  className="px-3 py-2 bg-[#0A0A0B] border border-[#26262A] text-neutral-400 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF5A1F] hover:bg-[#E04D18] text-white font-bold rounded-xl shadow"
                >
                  Save Mesocycle Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
