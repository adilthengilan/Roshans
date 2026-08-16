import React, { useState, useEffect, useMemo, useRef } from 'react';
import { usePrimeStore } from '../../lib/store';
import {
  TrainerizeExercise,
  TrainerizeSet,
  GlobalExerciseItem,
  GivenSessionPlanRecord,
  ClientMasterRecord,
} from '../../types';
import {
  Dumbbell,
  Plus,
  Trash2,
  Copy,
  TrendingUp,
  Award,
  Zap,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Flame,
  Scale,
  Sparkles,
  Info,
  Calendar,
  Clock,
  ArrowRightLeft,
  Search,
  BookOpen,
  Target,
  BarChart3,
  ListOrdered,
  X,
  Activity,
} from 'lucide-react';

interface TrainerizeSessionPlannerProps {
  currentCoachName: string;
  myAssignedClients: ClientMasterRecord[];
  onSessionLogged?: () => void;
}

// Preset Workout Templates for quick 1-click loading
const WORKOUT_PRESET_TEMPLATES: {
  title: string;
  category: 'Athletics' | 'Wellness' | '1:1 Personal' | 'Group Batch' | 'Combat' | 'Calisthenics';
  targetFocus: string;
  durationMinutes: number;
  rpeTarget: number;
  exercises: {
    name: string;
    category: string;
    equipment: string;
    targetMuscle: string;
    supersetTag?: string;
    sets: { weight: number; reps: number; type: TrainerizeSet['setType']; rpe: number; rest: number }[];
    coachCues?: string;
  }[];
}[] = [
  {
    title: 'A1. Upper Body Heavy Compound & Hypertrophy',
    category: '1:1 Personal',
    targetFocus: 'Pectoral & Lat Maximal Force, Scapular Retraction',
    durationMinutes: 60,
    rpeTarget: 8,
    exercises: [
      {
        name: 'Barbell Flat Bench Press',
        category: 'Chest',
        equipment: 'Barbell',
        targetMuscle: 'Pectoralis Major',
        supersetTag: 'A1',
        sets: [
          { weight: 60, reps: 10, type: 'Warmup', rpe: 6, rest: 90 },
          { weight: 85, reps: 8, type: 'Working', rpe: 8, rest: 120 },
          { weight: 90, reps: 6, type: 'Working', rpe: 8.5, rest: 120 },
          { weight: 92.5, reps: 5, type: 'Working', rpe: 9, rest: 150 },
        ],
        coachCues: 'Drive through heels, maintain 3-point contact, retract scapulae on descent.',
      },
      {
        name: 'Weighted Pull-ups',
        category: 'Back',
        equipment: 'Bodyweight',
        targetMuscle: 'Latissimus Dorsi',
        supersetTag: 'A2',
        sets: [
          { weight: 0, reps: 8, type: 'Warmup', rpe: 6, rest: 60 },
          { weight: 10, reps: 6, type: 'Working', rpe: 8, rest: 90 },
          { weight: 15, reps: 5, type: 'Working', rpe: 8.5, rest: 90 },
          { weight: 15, reps: 5, type: 'Working', rpe: 9, rest: 90 },
        ],
        coachCues: 'Full extension at bottom, drive elbows down to hips.',
      },
      {
        name: 'Incline Dumbbell Bench Press',
        category: 'Chest',
        equipment: 'Dumbbell',
        targetMuscle: 'Upper Chest',
        supersetTag: 'B1',
        sets: [
          { weight: 28, reps: 10, type: 'Working', rpe: 7.5, rest: 90 },
          { weight: 32, reps: 8, type: 'Working', rpe: 8.5, rest: 90 },
          { weight: 32, reps: 8, type: 'Working', rpe: 9, rest: 90 },
        ],
        coachCues: '30-degree incline, 3-second eccentric tempo.',
      },
      {
        name: 'Cable Face Pulls',
        category: 'Back',
        equipment: 'Cable',
        targetMuscle: 'Rear Delts / Scapular Retractors',
        supersetTag: 'B2',
        sets: [
          { weight: 35, reps: 15, type: 'Working', rpe: 7, rest: 60 },
          { weight: 40, reps: 12, type: 'Working', rpe: 8, rest: 60 },
          { weight: 40, reps: 12, type: 'Working', rpe: 8, rest: 60 },
        ],
        coachCues: 'External rotation at peak, hold 1-sec contraction.',
      },
    ],
  },
  {
    title: 'B1. Posterior Chain & Barbell Squat Peak',
    category: 'Athletics',
    targetFocus: 'Lower Body Maximal Strength & Quad Hypertrophy',
    durationMinutes: 70,
    rpeTarget: 9,
    exercises: [
      {
        name: 'Barbell Back Squat',
        category: 'Legs',
        equipment: 'Barbell',
        targetMuscle: 'Quadriceps / Glutes',
        supersetTag: 'A1',
        sets: [
          { weight: 70, reps: 8, type: 'Warmup', rpe: 6, rest: 90 },
          { weight: 110, reps: 6, type: 'Working', rpe: 8, rest: 150 },
          { weight: 120, reps: 5, type: 'Working', rpe: 8.5, rest: 180 },
          { weight: 125, reps: 4, type: 'Working', rpe: 9, rest: 180 },
        ],
        coachCues: 'Hit parallel depth, knees track over toes, brace core 360 degrees.',
      },
      {
        name: 'Romanian Deadlift (RDL)',
        category: 'Legs',
        equipment: 'Barbell',
        targetMuscle: 'Hamstrings / Glutes',
        supersetTag: 'B1',
        sets: [
          { weight: 80, reps: 10, type: 'Working', rpe: 7.5, rest: 120 },
          { weight: 100, reps: 8, type: 'Working', rpe: 8.5, rest: 120 },
          { weight: 105, reps: 8, type: 'Working', rpe: 9, rest: 120 },
        ],
        coachCues: 'Soft knees, push hips back to wall, maintain neutral lumbar.',
      },
      {
        name: 'Bulgarian Split Squats (Dumbbell)',
        category: 'Legs',
        equipment: 'Dumbbell',
        targetMuscle: 'Quads / Glute Medius',
        supersetTag: 'C1',
        sets: [
          { weight: 20, reps: 10, type: 'Working', rpe: 8, rest: 90 },
          { weight: 24, reps: 8, type: 'Working', rpe: 8.5, rest: 90 },
          { weight: 24, reps: 8, type: 'Working', rpe: 9, rest: 90 },
        ],
        coachCues: 'Slight forward torso lean to maximize glute recruitment.',
      },
    ],
  },
  {
    title: 'C1. Athletic Power & Olympic Explosiveness',
    category: 'Athletics',
    targetFocus: 'Rate of Force Development & Triple Extension',
    durationMinutes: 60,
    rpeTarget: 8.5,
    exercises: [
      {
        name: 'Barbell Power Clean',
        category: 'Olympic',
        equipment: 'Barbell',
        targetMuscle: 'Full Body Explosive Triple Extension',
        sets: [
          { weight: 50, reps: 5, type: 'Warmup', rpe: 6, rest: 90 },
          { weight: 70, reps: 3, type: 'Working', rpe: 8, rest: 120 },
          { weight: 75, reps: 3, type: 'Working', rpe: 8.5, rest: 120 },
          { weight: 80, reps: 2, type: 'Working', rpe: 9, rest: 150 },
        ],
        coachCues: 'Violent hip pop, rapid elbow rotation under the bar.',
      },
      {
        name: 'Box Jumps (Depth Jump to Height)',
        category: 'Olympic',
        equipment: 'Plyo Box',
        targetMuscle: 'Plyometrics / Rate of Force',
        sets: [
          { weight: 0, reps: 5, type: 'Working', rpe: 7, rest: 90 },
          { weight: 0, reps: 5, type: 'Working', rpe: 7.5, rest: 90 },
          { weight: 0, reps: 5, type: 'Working', rpe: 8, rest: 90 },
        ],
        coachCues: 'Minimize ground contact time, soft landing in quarter squat.',
      },
      {
        name: 'Farmer Walk Heavy Carry',
        category: 'Core',
        equipment: 'Kettlebell',
        targetMuscle: 'Grip / Scapular / Core',
        sets: [
          { weight: 32, reps: 40, type: 'Working', rpe: 8, rest: 90 },
          { weight: 36, reps: 40, type: 'Working', rpe: 8.5, rest: 90 },
          { weight: 40, reps: 30, type: 'Working', rpe: 9, rest: 120 },
        ],
        coachCues: 'Shoulders back and down, short rapid steps, anti-lateral flexion.',
      },
    ],
  },
  {
    title: 'D1. Combat Striking & Rotational Core Conditioning',
    category: 'Combat',
    targetFocus: 'Rotational Velocity, Counter Punching & Anaerobic Capacity',
    durationMinutes: 65,
    rpeTarget: 9,
    exercises: [
      {
        name: 'Heavy Bag Strike Intervals (5x3 min)',
        category: 'Combat',
        equipment: 'Heavy Bag',
        targetMuscle: 'Rotational Power / Anaerobic',
        sets: [
          { weight: 0, reps: 1, type: 'Working', rpe: 8, rest: 60 },
          { weight: 0, reps: 1, type: 'Working', rpe: 8.5, rest: 60 },
          { weight: 0, reps: 1, type: 'Working', rpe: 9, rest: 60 },
          { weight: 0, reps: 1, type: 'Working', rpe: 9.5, rest: 60 },
        ],
        coachCues: 'Focus on 1-2-3 combo speed followed by rapid angle exit.',
      },
      {
        name: 'Medicine Ball Rotational Slam',
        category: 'Core',
        equipment: 'Medicine Ball',
        targetMuscle: 'Obliques / Power',
        sets: [
          { weight: 8, reps: 12, type: 'Working', rpe: 7.5, rest: 60 },
          { weight: 10, reps: 10, type: 'Working', rpe: 8.5, rest: 60 },
          { weight: 10, reps: 10, type: 'Working', rpe: 9, rest: 60 },
        ],
        coachCues: 'Pivot rear foot, slam with explosive hip rotation.',
      },
      {
        name: 'Assault AirBike Sprints (20/10 Tabata)',
        category: 'Conditioning',
        equipment: 'Cardio',
        targetMuscle: 'Lactate Threshold / VO2 Max',
        sets: [
          { weight: 0, reps: 8, type: 'Working', rpe: 9.5, rest: 120 },
        ],
        coachCues: 'Max RPM output for each 20s sprint interval.',
      },
    ],
  },
];

export const TrainerizeSessionPlanner: React.FC<TrainerizeSessionPlannerProps> = ({
  currentCoachName,
  myAssignedClients,
  onSessionLogged,
}) => {
  const {
    clientMasterRecords,
    globalExercises,
    addGlobalExercise,
    getClientExerciseHistory,
    addGivenSessionPlanRecord,
    syncSessionToSystem2,
  } = usePrimeStore();

  // Selected Client
  const [selectedClientId, setSelectedClientId] = useState<string>(
    myAssignedClients.length > 0 ? myAssignedClients[0].id : clientMasterRecords[0]?.id || 'CLI-101'
  );

  // Session General Info
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [sessionTime, setSessionTime] = useState<string>('09:00 AM');
  const [sessionAttendance, setSessionAttendance] = useState<'Present' | 'Late' | 'Absent'>('Present');
  const [workoutTitle, setWorkoutTitle] = useState<string>('A1. Upper Body Heavy Compound & Hypertrophy');
  const [workoutCategory, setWorkoutCategory] = useState<GivenSessionPlanRecord['category']>('1:1 Personal');
  const [targetFocus, setTargetFocus] = useState<string>('Pectoral & Lat Maximal Force, Scapular Retraction');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [rpeTarget, setRpeTarget] = useState<number>(8);
  const [sessionNotes, setSessionNotes] = useState<string>('Client showed excellent recovery readiness. Ready for progressive overload on primary compound lifts.');

  // Structured Exercises (Trainerize style)
  const [exercises, setExercises] = useState<TrainerizeExercise[]>([
    {
      id: 'ex-1',
      name: 'Barbell Flat Bench Press',
      category: 'Chest',
      equipment: 'Barbell',
      targetMuscle: 'Pectoralis Major',
      supersetTag: 'A1',
      coachCues: 'Drive through heels, maintain 3-point contact, retract scapulae on descent.',
      sets: [
        { id: 's-1-1', setNumber: 1, setType: 'Warmup', targetWeightKg: 60, targetReps: 10, rpe: 6, restSeconds: 90, tempo: '3-0-1-0', completed: true },
        { id: 's-1-2', setNumber: 2, setType: 'Working', targetWeightKg: 85, targetReps: 8, rpe: 8, restSeconds: 120, tempo: '2-0-1-0', completed: true },
        { id: 's-1-3', setNumber: 3, setType: 'Working', targetWeightKg: 90, targetReps: 6, rpe: 8.5, restSeconds: 120, tempo: '2-0-1-0', completed: true },
        { id: 's-1-4', setNumber: 4, setType: 'Working', targetWeightKg: 92.5, targetReps: 5, rpe: 9, restSeconds: 150, tempo: '2-0-1-0', completed: true },
      ],
    },
    {
      id: 'ex-2',
      name: 'Weighted Pull-ups',
      category: 'Back',
      equipment: 'Bodyweight',
      targetMuscle: 'Latissimus Dorsi',
      supersetTag: 'A2',
      coachCues: 'Full extension at bottom, drive elbows down to hips.',
      sets: [
        { id: 's-2-1', setNumber: 1, setType: 'Warmup', targetWeightKg: 0, targetReps: 8, rpe: 6, restSeconds: 60, tempo: '2-0-1-0', completed: true },
        { id: 's-2-2', setNumber: 2, setType: 'Working', targetWeightKg: 10, targetReps: 6, rpe: 8, restSeconds: 90, tempo: '2-0-1-0', completed: true },
        { id: 's-2-3', setNumber: 3, setType: 'Working', targetWeightKg: 15, targetReps: 5, rpe: 8.5, restSeconds: 90, tempo: '2-0-1-0', completed: true },
        { id: 's-2-4', setNumber: 4, setType: 'Working', targetWeightKg: 15, targetReps: 5, rpe: 9, restSeconds: 90, tempo: '2-0-1-0', completed: true },
      ],
    },
    {
      id: 'ex-3',
      name: 'Incline Dumbbell Bench Press',
      category: 'Chest',
      equipment: 'Dumbbell',
      targetMuscle: 'Upper Chest',
      supersetTag: 'B1',
      coachCues: '30-degree incline, control descent with 3s tempo.',
      sets: [
        { id: 's-3-1', setNumber: 1, setType: 'Working', targetWeightKg: 28, targetReps: 10, rpe: 7.5, restSeconds: 90, tempo: '3-0-1-0', completed: true },
        { id: 's-3-2', setNumber: 2, setType: 'Working', targetWeightKg: 32, targetReps: 8, rpe: 8.5, restSeconds: 90, tempo: '2-0-1-0', completed: true },
        { id: 's-3-3', setNumber: 3, setType: 'Working', targetWeightKg: 32, targetReps: 8, rpe: 9, restSeconds: 90, tempo: '2-0-1-0', completed: true },
      ],
    },
    {
      id: 'ex-4',
      name: 'Cable Face Pulls',
      category: 'Back',
      equipment: 'Cable',
      targetMuscle: 'Rear Delts / Scapular Retractors',
      supersetTag: 'B2',
      coachCues: 'External rotation at peak, hold 1-sec contraction.',
      sets: [
        { id: 's-4-1', setNumber: 1, setType: 'Working', targetWeightKg: 35, targetReps: 15, rpe: 7, restSeconds: 60, tempo: '2-0-1-1', completed: true },
        { id: 's-4-2', setNumber: 2, setType: 'Working', targetWeightKg: 40, targetReps: 12, rpe: 8, restSeconds: 60, tempo: '2-0-1-1', completed: true },
        { id: 's-4-3', setNumber: 3, setType: 'Working', targetWeightKg: 40, targetReps: 12, rpe: 8, restSeconds: 60, tempo: '2-0-1-1', completed: true },
      ],
    },
  ]);

  // Autocomplete & Exercise Search State
  const [activeSearchExerciseId, setActiveSearchExerciseId] = useState<string | null>(null);
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Interactive Coach Pro Tools
  const [showToolsDrawer, setShowToolsDrawer] = useState<boolean>(false);
  const [activeToolTab, setActiveToolTab] = useState<'1rm' | 'timer' | 'plates' | 'analytics'>('1rm');

  // 1RM Calculator State
  const [calcWeight, setCalcWeight] = useState<number>(85);
  const [calcReps, setCalcReps] = useState<number>(8);

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(90);
  const [timerRemaining, setTimerRemaining] = useState<number>(90);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerIntervalRef = useRef<any>(null);

  // Plate Loading Calculator State
  const [plateBarWeight, setPlateBarWeight] = useState<number>(20);
  const [plateTargetWeight, setPlateTargetWeight] = useState<number>(100);

  // Submission Toast State
  const [successToast, setSuccessToast] = useState<{
    show: boolean;
    clientName: string;
    title: string;
    totalVolumeKg: number;
    overloadText: string;
  } | null>(null);

  // Active Client Record
  const selectedClient = useMemo(() => {
    return clientMasterRecords.find((c) => c.id === selectedClientId) || clientMasterRecords[0];
  }, [selectedClientId, clientMasterRecords]);

  // Handle Timer Countdown
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            // Play Web Audio Beep
            playTimerBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  const playTimerBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // AudioContext fallback
    }
  };

  const startTimerPreset = (secs: number) => {
    setTimerSeconds(secs);
    setTimerRemaining(secs);
    setIsTimerRunning(true);
  };

  // 1RM Computations (Epley & Brzycki formulas)
  const calculated1RM = useMemo(() => {
    if (calcWeight <= 0 || calcReps <= 0) return 0;
    if (calcReps === 1) return calcWeight;
    // Epley Formula: 1RM = Weight * (1 + Reps / 30)
    const epley = calcWeight * (1 + calcReps / 30);
    // Brzycki Formula: 1RM = Weight * (36 / (37 - Reps))
    const brzycki = calcReps < 37 ? calcWeight * (36 / (37 - calcReps)) : epley;
    return Math.round((epley + brzycki) / 2);
  }, [calcWeight, calcReps]);

  // Plate Calculator Computation
  const plateBreakdown = useMemo(() => {
    const remainingToLoad = Math.max(0, plateTargetWeight - plateBarWeight);
    const perSide = remainingToLoad / 2;
    const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
    let remainingPerSide = perSide;
    const result: { plateKg: number; countPerSide: number }[] = [];

    for (const p of availablePlates) {
      if (remainingPerSide >= p) {
        const count = Math.floor(remainingPerSide / p);
        result.push({ plateKg: p, countPerSide: count });
        remainingPerSide = Math.round((remainingPerSide - count * p) * 100) / 100;
      }
    }

    return {
      perSideWeight: perSide,
      plates: result,
      remainder: remainingPerSide,
    };
  }, [plateBarWeight, plateTargetWeight]);

  // Live Workout Volume & Set Statistics
  const workoutStats = useMemo(() => {
    let totalVolumeKg = 0;
    let totalSets = 0;
    let totalReps = 0;
    let workingSetsCount = 0;
    let warmupSetsCount = 0;
    const muscleMap: Record<string, number> = {};

    exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        totalSets += 1;
        totalReps += s.targetReps || 0;
        const volume = (s.targetWeightKg || 0) * (s.targetReps || 0);
        totalVolumeKg += volume;
        if (s.setType === 'Working') workingSetsCount += 1;
        if (s.setType === 'Warmup') warmupSetsCount += 1;
      });

      const cat = ex.category || 'General';
      muscleMap[cat] = (muscleMap[cat] || 0) + ex.sets.length;
    });

    // Check progressive overload against previous sessions
    let totalOverloadScore = 0;
    let benchmarkCount = 0;
    let progressingCount = 0;

    exercises.forEach((ex) => {
      const history = getClientExerciseHistory(selectedClientId, ex.name);
      if (history && history.lastWeightKg > 0) {
        benchmarkCount += 1;
        const maxPlannedWeight = Math.max(...ex.sets.map((s) => s.targetWeightKg || 0));
        if (maxPlannedWeight > history.lastWeightKg) {
          progressingCount += 1;
          totalOverloadScore += (maxPlannedWeight - history.lastWeightKg) / history.lastWeightKg;
        } else if (maxPlannedWeight === history.lastWeightKg) {
          const maxPlannedReps = Math.max(...ex.sets.map((s) => s.targetReps || 0));
          if (maxPlannedReps > history.lastReps) {
            progressingCount += 1;
            totalOverloadScore += (maxPlannedReps - history.lastReps) / history.lastReps;
          }
        }
      }
    });

    const avgOverloadPercent =
      benchmarkCount > 0 ? Math.round((totalOverloadScore / benchmarkCount) * 100) : 8;

    const overloadStatus: 'Progressing' | 'Maintained' | 'Baseline' | 'Deload' =
      benchmarkCount === 0
        ? 'Baseline'
        : progressingCount > 0
        ? 'Progressing'
        : 'Maintained';

    return {
      totalVolumeKg,
      totalSets,
      totalReps,
      workingSetsCount,
      warmupSetsCount,
      exerciseCount: exercises.length,
      muscleMap,
      benchmarkCount,
      progressingCount,
      avgOverloadPercent,
      overloadStatus,
    };
  }, [exercises, selectedClientId, getClientExerciseHistory]);

  // Load Preset Template
  const handleLoadTemplate = (template: typeof WORKOUT_PRESET_TEMPLATES[0]) => {
    setWorkoutTitle(template.title);
    setWorkoutCategory(template.category);
    setTargetFocus(template.targetFocus);
    setDurationMinutes(template.durationMinutes);
    setRpeTarget(template.rpeTarget);

    const loadedExercises: TrainerizeExercise[] = template.exercises.map((ex, idx) => ({
      id: `ex-preset-${Date.now()}-${idx}`,
      name: ex.name,
      category: ex.category,
      equipment: ex.equipment,
      targetMuscle: ex.targetMuscle,
      supersetTag: ex.supersetTag,
      coachCues: ex.coachCues,
      sets: ex.sets.map((s, sIdx) => ({
        id: `s-${idx}-${sIdx}-${Date.now()}`,
        setNumber: sIdx + 1,
        setType: s.type,
        targetWeightKg: s.weight,
        targetReps: s.reps,
        rpe: s.rpe,
        restSeconds: s.rest,
        tempo: '2-0-1-0',
        completed: true,
      })),
    }));

    setExercises(loadedExercises);
  };

  // Add Exercise Block
  const handleAddExercise = (exerciseName?: string, category = 'Chest', equipment = 'Barbell') => {
    const name = exerciseName || 'Barbell Back Squat';
    const newEx: TrainerizeExercise = {
      id: `ex-${Date.now()}`,
      name: name,
      category: category,
      equipment: equipment,
      targetMuscle: category,
      supersetTag: `A${exercises.length + 1}`,
      coachCues: 'Control concentric speed, maintain brace throughout entire movement.',
      sets: [
        {
          id: `set-${Date.now()}-1`,
          setNumber: 1,
          setType: 'Warmup',
          targetWeightKg: 40,
          targetReps: 10,
          rpe: 6,
          restSeconds: 90,
          tempo: '2-0-1-0',
          completed: true,
        },
        {
          id: `set-${Date.now()}-2`,
          setNumber: 2,
          setType: 'Working',
          targetWeightKg: 80,
          targetReps: 8,
          rpe: 8,
          restSeconds: 120,
          tempo: '2-0-1-0',
          completed: true,
        },
        {
          id: `set-${Date.now()}-3`,
          setNumber: 3,
          setType: 'Working',
          targetWeightKg: 85,
          targetReps: 8,
          rpe: 8.5,
          restSeconds: 120,
          tempo: '2-0-1-0',
          completed: true,
        },
      ],
    };

    // Auto-register to global catalog so all coaches immediately see it
    addGlobalExercise({
      name: name,
      category: category,
      equipment: equipment,
      primaryMuscle: category,
      addedByCoach: currentCoachName,
    });

    setExercises((prev) => [...prev, newEx]);
  };

  // Add Superset Pair
  const handleAddSuperset = () => {
    const pairTag = `S${exercises.length + 1}`;
    const ex1: TrainerizeExercise = {
      id: `ex-${Date.now()}-1`,
      name: 'Incline Dumbbell Bench Press',
      category: 'Chest',
      equipment: 'Dumbbell',
      targetMuscle: 'Upper Chest',
      supersetTag: `${pairTag}.1`,
      coachCues: 'Keep elbows at 45 degrees, stretch at bottom.',
      sets: [
        { id: `s-${Date.now()}-1`, setNumber: 1, setType: 'Working', targetWeightKg: 30, targetReps: 8, rpe: 8, restSeconds: 45, tempo: '2-0-1-0', completed: true },
        { id: `s-${Date.now()}-2`, setNumber: 2, setType: 'Working', targetWeightKg: 32, targetReps: 8, rpe: 8.5, restSeconds: 45, tempo: '2-0-1-0', completed: true },
      ],
    };
    const ex2: TrainerizeExercise = {
      id: `ex-${Date.now()}-2`,
      name: 'Single-Arm Dumbbell Row',
      category: 'Back',
      equipment: 'Dumbbell',
      targetMuscle: 'Latissimus Dorsi',
      supersetTag: `${pairTag}.2`,
      coachCues: 'Pull with elbow, avoid excessive torso rotation.',
      sets: [
        { id: `s-${Date.now()}-3`, setNumber: 1, setType: 'Working', targetWeightKg: 32, targetReps: 10, rpe: 8, restSeconds: 90, tempo: '2-0-1-0', completed: true },
        { id: `s-${Date.now()}-4`, setNumber: 2, setType: 'Working', targetWeightKg: 34, targetReps: 8, rpe: 8.5, restSeconds: 90, tempo: '2-0-1-0', completed: true },
      ],
    };

    setExercises((prev) => [...prev, ex1, ex2]);
  };

  // Set-by-Set Management
  const handleAddSetToExercise = (exId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exId) {
          const lastSet = ex.sets[ex.sets.length - 1];
          const newSet: TrainerizeSet = {
            id: `s-${Date.now()}-${ex.sets.length + 1}`,
            setNumber: ex.sets.length + 1,
            setType: lastSet?.setType || 'Working',
            targetWeightKg: lastSet ? lastSet.targetWeightKg : 60,
            targetReps: lastSet ? lastSet.targetReps : 8,
            rpe: lastSet ? lastSet.rpe : 8,
            restSeconds: lastSet ? lastSet.restSeconds : 90,
            tempo: lastSet?.tempo || '2-0-1-0',
            completed: true,
          };
          return { ...ex, sets: [...ex.sets, newSet] };
        }
        return ex;
      })
    );
  };

  const handleDuplicateSet = (exId: string, setIndex: number) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exId) {
          const setToDup = ex.sets[setIndex];
          const newSet: TrainerizeSet = {
            ...setToDup,
            id: `s-dup-${Date.now()}`,
            setNumber: ex.sets.length + 1,
          };
          const newSets = [...ex.sets];
          newSets.splice(setIndex + 1, 0, newSet);
          // Renumber sets
          return {
            ...ex,
            sets: newSets.map((s, idx) => ({ ...s, setNumber: idx + 1 })),
          };
        }
        return ex;
      })
    );
  };

  const handleRemoveSet = (exId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exId) {
          if (ex.sets.length <= 1) return ex; // Keep at least 1 set
          const filtered = ex.sets.filter((s) => s.id !== setId);
          return {
            ...ex,
            sets: filtered.map((s, idx) => ({ ...s, setNumber: idx + 1 })),
          };
        }
        return ex;
      })
    );
  };

  const handleUpdateSetField = (
    exId: string,
    setId: string,
    field: keyof TrainerizeSet,
    value: any
  ) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exId) {
          return {
            ...ex,
            sets: ex.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s)),
          };
        }
        return ex;
      })
    );
  };

  const handleRemoveExercise = (exId: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== exId));
  };

  // Exercise Name Autocomplete Search List
  const filteredGlobalExercises = useMemo(() => {
    const query = exerciseSearchQuery.toLowerCase().trim();
    return globalExercises.filter((item) => {
      const matchCat = categoryFilter === 'ALL' || item.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchQuery = !query || item.name.toLowerCase().includes(query) || item.primaryMuscle.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });
  }, [globalExercises, exerciseSearchQuery, categoryFilter]);

  // Select Exercise from Autocomplete
  const handleSelectAutocompleteExercise = (exId: string, item: GlobalExerciseItem) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exId) {
          return {
            ...ex,
            name: item.name,
            category: item.category,
            equipment: item.equipment,
            targetMuscle: item.primaryMuscle,
          };
        }
        return ex;
      })
    );
    setActiveSearchExerciseId(null);
    setExerciseSearchQuery('');
  };

  // Submit and Sync Workout Plan
  const handleSubmitWorkoutPlan = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Format plan details string
    const formattedProtocolText = exercises
      .map((ex, idx) => {
        const tag = ex.supersetTag ? `[${ex.supersetTag}] ` : `${idx + 1}. `;
        const setsText = ex.sets
          .map((s) => `${s.targetWeightKg}kg × ${s.targetReps} reps (${s.setType}${s.rpe ? ` @ RPE ${s.rpe}` : ''})`)
          .join(' | ');
        const cuesText = ex.coachCues ? `\n   ↳ Cue: ${ex.coachCues}` : '';
        return `${tag}${ex.name} (${ex.category || 'Compound'})\n   Sets: ${setsText}${cuesText}`;
      })
      .join('\n\n');

    // 2. Generate Statistics Note for Business View and Logs
    const statisticsNote = `📊 PROGRESSIVE OVERLOAD & PERFORMANCE NOTE:
• Total Volume Load: ${workoutStats.totalVolumeKg.toLocaleString()} kg
• Total Sets: ${workoutStats.totalSets} (${workoutStats.workingSetsCount} working sets, ${workoutStats.warmupSetsCount} warmup)
• Total Planned Reps: ${workoutStats.totalReps}
• Overload Status: ${workoutStats.overloadStatus === 'Progressing' ? `🟢 Overload Active (+${workoutStats.avgOverloadPercent}% Delta)` : workoutStats.overloadStatus === 'Baseline' ? '🟣 Baseline Assessment' : '🟡 Maintained Volume'}
• Intensity Target: RPE ${rpeTarget} (${durationMinutes} mins)
• Exercises: ${exercises.map((e) => e.name).join(', ')}`;

    const overloadSummary = `${workoutStats.overloadStatus.toUpperCase()}: ${workoutStats.totalVolumeKg.toLocaleString()} kg Vol · ${workoutStats.totalSets} Sets · RPE ${rpeTarget}`;

    // 3. Sync Session to System 2 Master DB (Master Session Ledger)
    syncSessionToSystem2({
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      coachName: currentCoachName,
      date: sessionDate,
      time: sessionTime,
      sessionType: workoutTitle,
      attendanceStatus: sessionAttendance,
      location: 'INTOKINE Elite Performance Arena',
      notes: `Focus: ${targetFocus}\n\nCoach Session Summary:\n${sessionNotes}\n\n${formattedProtocolText}`,
      statisticsNote: statisticsNote,
      totalVolumeKg: workoutStats.totalVolumeKg,
      overloadSummary: overloadSummary,
      loggedByStaff: currentCoachName,
    });

    // 4. Record to Given Session Plans (with full Trainerize structured data)
    addGivenSessionPlanRecord({
      date: sessionDate,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      coachName: currentCoachName,
      planTitle: workoutTitle,
      category: workoutCategory,
      planDetails: `${formattedProtocolText}\n\n${statisticsNote}`,
      targetFocus: targetFocus,
      durationMinutes: durationMinutes,
      rpeTarget: rpeTarget,
      status: 'Completed',
      totalVolumeKg: workoutStats.totalVolumeKg,
      totalSets: workoutStats.totalSets,
      totalReps: workoutStats.totalReps,
      overloadDeltaPercent: workoutStats.avgOverloadPercent,
      overloadStatus: workoutStats.overloadStatus,
      structuredExercises: exercises,
      statisticsNote: statisticsNote,
    });

    // 5. Trigger Success Feedback
    setSuccessToast({
      show: true,
      clientName: selectedClient.name,
      title: workoutTitle,
      totalVolumeKg: workoutStats.totalVolumeKg,
      overloadText:
        workoutStats.overloadStatus === 'Progressing'
          ? `+${workoutStats.avgOverloadPercent}% Overload Active`
          : 'Prescribed & Recorded',
    });

    if (onSessionLogged) {
      onSessionLogged();
    }

    setTimeout(() => {
      setSuccessToast(null);
    }, 5000);
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {successToast && (
        <div className="bg-emerald-500/15 border border-emerald-500/40 p-4 rounded-2xl flex items-start justify-between gap-3 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Workout Plan Logged & Synced to Business OS</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">
                  {successToast.overloadText}
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 mt-0.5">
                Prescribed <span className="text-white font-semibold">{successToast.title}</span> for{' '}
                <span className="text-emerald-400 font-semibold">{successToast.clientName}</span> (Total Volume: {successToast.totalVolumeKg.toLocaleString()} kg).
              </p>
            </div>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-neutral-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Trainerize Planning Sheet Container */}
      <div className="bg-[#121318] border border-white/[0.08] rounded-3xl p-4 sm:p-6 space-y-6 shadow-2xl">
        {/* TOP BAR: Client Selection & Preset Routine Launcher */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Trainerize-Style Session Planning & Overload Engine</span>
                </h3>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Real-time exercise auto-learn, progressive overload delta tracking, and 1-click sync to Business Session Logs.
              </p>
            </div>

            {/* Quick Pro Tools Toggle & Preset Dropdown */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowToolsDrawer(!showToolsDrawer)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                  showToolsDrawer
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                    : 'bg-[#181920] hover:bg-[#20212b] text-neutral-300 border-white/[0.08]'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Coach Pro Tools</span>
                <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded text-amber-300 font-mono">
                  1RM · Timer · Plates
                </span>
              </button>

              {/* Volume Live Badge */}
              <div className="bg-[#181920] border border-white/[0.08] px-3 py-2 rounded-xl flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-neutral-400">Planned Vol:</span>
                <span className="text-xs font-mono font-extrabold text-emerald-300">
                  {workoutStats.totalVolumeKg.toLocaleString()} kg
                </span>
              </div>
            </div>
          </div>

          {/* Pro Tools Drawer (Collapsible) */}
          {showToolsDrawer && (
            <div className="bg-[#0b0c10] border border-blue-500/25 p-4 rounded-2xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveToolTab('1rm')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      activeToolTab === '1rm' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    1RM & Load % Calculator
                  </button>
                  <button
                    onClick={() => setActiveToolTab('timer')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      activeToolTab === 'timer' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Rest Timer ({timerRemaining}s)
                  </button>
                  <button
                    onClick={() => setActiveToolTab('plates')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      activeToolTab === 'plates' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Plate Loading Calc
                  </button>
                  <button
                    onClick={() => setActiveToolTab('analytics')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      activeToolTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Session Metrics
                  </button>
                </div>
                <button
                  onClick={() => setShowToolsDrawer(false)}
                  className="text-neutral-500 hover:text-white text-xs"
                >
                  Close
                </button>
              </div>

              {/* TOOL 1: 1RM Calculator */}
              {activeToolTab === '1rm' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-neutral-400">Lift Weight & Reps</label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <span className="text-[10px] text-neutral-500 block">Weight (kg)</span>
                        <input
                          type="number"
                          value={calcWeight}
                          onChange={(e) => setCalcWeight(Number(e.target.value))}
                          className="w-full bg-[#16171f] border border-white/[0.08] rounded-lg p-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="w-20">
                        <span className="text-[10px] text-neutral-500 block">Reps</span>
                        <input
                          type="number"
                          value={calcReps}
                          onChange={(e) => setCalcReps(Number(e.target.value))}
                          className="w-full bg-[#16171f] border border-white/[0.08] rounded-lg p-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#14151c] p-3 rounded-xl border border-white/[0.06] text-center">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Estimated 1RM</span>
                    <div className="text-2xl font-mono font-black text-amber-400 mt-1">
                      {calculated1RM} <span className="text-xs font-normal text-neutral-400">kg</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">Brzycki & Epley Blend</span>
                  </div>

                  {/* Percentage Matrix */}
                  <div className="grid grid-cols-4 gap-1 text-center">
                    {[95, 90, 85, 80, 75, 70, 65, 60].map((pct) => (
                      <div key={pct} className="bg-[#14151c] p-1.5 rounded border border-white/[0.04]">
                        <div className="text-[10px] font-bold text-neutral-400">{pct}%</div>
                        <div className="text-xs font-mono font-bold text-white">
                          {Math.round((calculated1RM * pct) / 100)}kg
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TOOL 2: Rest Timer */}
              {activeToolTab === 'timer' && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border font-mono ${
                        isTimerRunning
                          ? 'bg-blue-600/20 border-blue-500 text-blue-400 animate-pulse'
                          : 'bg-[#14151c] border-white/[0.08] text-white'
                      }`}
                    >
                      <span className="text-2xl font-black">{timerRemaining}</span>
                      <span className="text-[9px] uppercase tracking-widest text-neutral-400">SEC</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex gap-1.5">
                        {[30, 45, 60, 90, 120, 180].map((sec) => (
                          <button
                            key={sec}
                            onClick={() => startTimerPreset(sec)}
                            className="px-2.5 py-1 bg-[#181920] hover:bg-blue-600 hover:text-white text-neutral-300 border border-white/[0.08] text-xs font-mono rounded-lg transition"
                          >
                            {sec}s
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-neutral-400">
                        Plays audio chime when rest interval completes between working sets.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isTimerRunning ? 'bg-amber-500 text-black' : 'bg-blue-600 text-white'
                      }`}
                    >
                      {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsTimerRunning(false);
                        setTimerRemaining(timerSeconds);
                      }}
                      className="p-2 bg-[#181920] hover:bg-[#22232c] text-neutral-400 hover:text-white rounded-xl border border-white/[0.08]"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TOOL 3: Barbell Plate Calculator */}
              {activeToolTab === 'plates' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-400 font-medium">Target Load:</span>
                      <input
                        type="number"
                        step="2.5"
                        value={plateTargetWeight}
                        onChange={(e) => setPlateTargetWeight(Number(e.target.value))}
                        className="w-24 bg-[#16171f] border border-white/[0.08] rounded-lg p-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                      />
                      <span className="text-xs text-neutral-400">kg</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-400 font-medium">Barbell:</span>
                      <select
                        value={plateBarWeight}
                        onChange={(e) => setPlateBarWeight(Number(e.target.value))}
                        className="bg-[#16171f] border border-white/[0.08] rounded-lg p-1.5 text-xs text-white"
                      >
                        <option value="20">Olympic Bar (20 kg)</option>
                        <option value="15">Women's / Tech Bar (15 kg)</option>
                        <option value="10">EZ-Curl Bar (10 kg)</option>
                        <option value="25">Trap / Hex Bar (25 kg)</option>
                      </select>
                    </div>

                    <div className="text-xs font-mono text-neutral-300 ml-auto">
                      Per Side Load: <span className="font-bold text-blue-400">{plateBreakdown.perSideWeight} kg</span>
                    </div>
                  </div>

                  {/* Plates Visualizer */}
                  <div className="p-3 bg-[#14151c] rounded-xl border border-white/[0.06] flex items-center justify-between flex-wrap gap-2">
                    <div className="text-xs font-medium text-neutral-300">
                      Plates needed per side:
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {plateBreakdown.plates.length === 0 ? (
                        <span className="text-xs text-neutral-500">Bar only (0 plates)</span>
                      ) : (
                        plateBreakdown.plates.map((pl) => (
                          <div
                            key={pl.plateKg}
                            className="flex items-center gap-1 bg-[#1c1e28] px-2.5 py-1 rounded-lg border border-white/[0.08]"
                          >
                            <span className="text-xs font-mono font-black text-amber-400">
                              {pl.countPerSide}×
                            </span>
                            <span className="text-xs font-mono font-bold text-white">
                              {pl.plateKg} kg
                            </span>
                          </div>
                        ))
                      )}
                      {plateBreakdown.remainder > 0 && (
                        <span className="text-[10px] text-amber-400 font-mono">
                          (+{plateBreakdown.remainder}kg unassigned)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TOOL 4: Session Metrics */}
              {activeToolTab === 'analytics' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#14151c] p-3 rounded-xl border border-white/[0.06]">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Volume</span>
                    <span className="text-lg font-mono font-black text-emerald-400">
                      {workoutStats.totalVolumeKg.toLocaleString()} kg
                    </span>
                  </div>
                  <div className="bg-[#14151c] p-3 rounded-xl border border-white/[0.06]">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Working Sets</span>
                    <span className="text-lg font-mono font-black text-blue-400">
                      {workoutStats.workingSetsCount} / {workoutStats.totalSets}
                    </span>
                  </div>
                  <div className="bg-[#14151c] p-3 rounded-xl border border-white/[0.06]">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Reps</span>
                    <span className="text-lg font-mono font-black text-purple-400">
                      {workoutStats.totalReps}
                    </span>
                  </div>
                  <div className="bg-[#14151c] p-3 rounded-xl border border-white/[0.06]">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Overload Status</span>
                    <span
                      className={`text-xs font-bold inline-block mt-1 px-2 py-0.5 rounded-full ${
                        workoutStats.overloadStatus === 'Progressing'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : workoutStats.overloadStatus === 'Baseline'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {workoutStats.overloadStatus} (+{workoutStats.avgOverloadPercent}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Preset Workout Routine Chips */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Trainerize Routine Presets (1-Click Load)</span>
              </span>
              <span className="text-[10px] text-neutral-500">Includes prescribed weights, reps & tempo</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {WORKOUT_PRESET_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.title}
                  type="button"
                  onClick={() => handleLoadTemplate(tmpl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                    workoutTitle === tmpl.title
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                      : 'bg-[#181920] hover:bg-[#20212b] text-neutral-300 border-white/[0.08] hover:text-white'
                  }`}
                >
                  <span>{tmpl.title}</span>
                  <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded text-neutral-300 font-mono">
                    {tmpl.durationMinutes}m
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* WORKOUT HEADER DETAILS FORM */}
        <form onSubmit={handleSubmitWorkoutPlan} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#0d0e12] p-4 rounded-2xl border border-white/[0.06]">
            {/* 1. Client Picker */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-neutral-400 block">1. Client Assignment</label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full bg-[#181920] border border-white/[0.08] rounded-xl p-2.5 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
              >
                {clientMasterRecords.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.programEnrolled || 'Active Client'})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Date & Time */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-neutral-400 block">2. Session Date & Time</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  required
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="flex-1 bg-[#181920] border border-white/[0.08] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <select
                  value={sessionTime}
                  onChange={(e) => setSessionTime(e.target.value)}
                  className="w-28 bg-[#181920] border border-white/[0.08] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="06:00 AM">06:00 AM</option>
                  <option value="07:30 AM">07:30 AM</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:30 PM">05:30 PM</option>
                  <option value="07:00 PM">07:00 PM</option>
                </select>
              </div>
            </div>

            {/* 3. Attendance Status */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-neutral-400 block">3. Attendance</label>
              <div className="flex gap-1">
                {(['Present', 'Late', 'Absent'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSessionAttendance(status)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition border ${
                      sessionAttendance === status
                        ? status === 'Present'
                          ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/20'
                          : status === 'Late'
                          ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                          : 'bg-rose-500 text-white border-rose-400 shadow-md'
                        : 'bg-[#181920] text-neutral-400 border-white/[0.08] hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Category / Discipline */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-neutral-400 block">4. Category</label>
              <select
                value={workoutCategory}
                onChange={(e) => setWorkoutCategory(e.target.value as any)}
                className="w-full bg-[#181920] border border-white/[0.08] rounded-xl p-2.5 text-xs font-semibold text-white focus:outline-none"
              >
                <option value="1:1 Personal">1:1 Personal Training</option>
                <option value="Athletics">Athletics & Strength</option>
                <option value="Combat">Combat & Martial Arts</option>
                <option value="Calisthenics">Calisthenics & Gymnastics</option>
                <option value="Wellness">Wellness & Rehab</option>
                <option value="Group Batch">Group Batch Squad</option>
              </select>
            </div>
          </div>

          {/* Workout Title & Focus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#0d0e12] p-4 rounded-2xl border border-white/[0.06]">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-neutral-400 block">Workout Name / Code</label>
              <input
                type="text"
                required
                placeholder="e.g. A1. Upper Body Heavy Compound & Hypertrophy"
                value={workoutTitle}
                onChange={(e) => setWorkoutTitle(e.target.value)}
                className="w-full bg-[#181920] border border-white/[0.08] rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-neutral-400 block">Target Athletic Focus & Objectives</label>
              <input
                type="text"
                required
                placeholder="e.g. Pectoral & Lat Maximal Force, Scapular Retraction"
                value={targetFocus}
                onChange={(e) => setTargetFocus(e.target.value)}
                className="w-full bg-[#181920] border border-white/[0.08] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* DYNAMIC TRAINERIZE EXERCISE LIST */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-blue-400" />
                  <span>Exercise Prescription & Progressive Overload Grid</span>
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Configure sets, weights, reps, rest intervals, and live overload comparisons.
                </p>
              </div>

              {/* Action Buttons: Add Exercise / Add Superset */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddExercise()}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Exercise</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddSuperset}
                  className="px-3 py-2 bg-[#1c1d26] hover:bg-[#252733] text-purple-300 border border-purple-500/30 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>+ Add Superset (A1+A2)</span>
                </button>
              </div>
            </div>

            {/* Exercise Cards */}
            {exercises.length === 0 ? (
              <div className="p-8 text-center bg-[#0d0e12] border border-dashed border-white/[0.1] rounded-2xl space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-white">No exercises added yet</div>
                <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
                  Click "+ Add Exercise" or choose a Trainerize routine preset from above to build this session.
                </p>
                <button
                  type="button"
                  onClick={() => handleAddExercise()}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
                >
                  Add First Exercise
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {exercises.map((ex, exIndex) => {
                  const history = getClientExerciseHistory(selectedClientId, ex.name);
                  const plannedVol = ex.sets.reduce((sum, s) => sum + (s.targetWeightKg || 0) * (s.targetReps || 0), 0);
                  const maxPlannedWeight = Math.max(...ex.sets.map((s) => s.targetWeightKg || 0), 0);

                  // Overload calculations
                  const hasOverload = history && history.lastWeightKg > 0 && maxPlannedWeight > history.lastWeightKg;
                  const hasVolOverload = history && history.lastVolumeKg > 0 && plannedVol > history.lastVolumeKg;

                  return (
                    <div
                      key={ex.id}
                      className="bg-[#0e0f14] border border-white/[0.08] hover:border-blue-500/30 rounded-2xl p-4 space-y-4 transition shadow-lg"
                    >
                      {/* Exercise Card Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                        <div className="flex items-center gap-3 flex-1">
                          {/* Superset Tag Pill */}
                          <input
                            type="text"
                            value={ex.supersetTag || `A${exIndex + 1}`}
                            onChange={(e) => {
                              const val = e.target.value;
                              setExercises((prev) =>
                                prev.map((item) => (item.id === ex.id ? { ...item, supersetTag: val } : item))
                              );
                            }}
                            className="w-12 text-center bg-blue-500/15 border border-blue-500/30 text-blue-400 font-mono font-black text-xs py-1.5 rounded-lg focus:outline-none"
                            title="Superset Tag (e.g. A1, A2, B1)"
                          />

                          {/* Exercise Name Input with Autocomplete Toggle */}
                          <div className="relative flex-1">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={ex.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setExercises((prev) =>
                                    prev.map((item) => (item.id === ex.id ? { ...item, name: val } : item))
                                  );
                                  // Auto-register to global catalog
                                  addGlobalExercise({
                                    name: val,
                                    category: ex.category,
                                    equipment: ex.equipment || 'Barbell',
                                    primaryMuscle: ex.targetMuscle || 'Full Body',
                                    addedByCoach: currentCoachName,
                                  });
                                }}
                                onFocus={() => {
                                  setActiveSearchExerciseId(ex.id);
                                  setExerciseSearchQuery(ex.name);
                                }}
                                placeholder="Type or search exercise name..."
                                className="w-full bg-[#181920] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  if (activeSearchExerciseId === ex.id) {
                                    setActiveSearchExerciseId(null);
                                  } else {
                                    setActiveSearchExerciseId(ex.id);
                                    setExerciseSearchQuery(ex.name);
                                  }
                                }}
                                className="p-2 bg-[#181920] hover:bg-[#22232c] text-neutral-400 hover:text-white rounded-xl border border-white/[0.08] shrink-0"
                                title="Browse Exercise Catalog"
                              >
                                <Search className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Autocomplete Dropdown */}
                            {activeSearchExerciseId === ex.id && (
                              <div className="absolute left-0 right-0 top-full mt-1 bg-[#14161f] border border-blue-500/40 rounded-xl p-2 z-50 shadow-2xl space-y-2 max-h-64 overflow-y-auto">
                                <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
                                  <span className="text-[10px] font-bold text-neutral-400 uppercase">
                                    Global Exercise Library ({filteredGlobalExercises.length})
                                  </span>
                                  <button
                                    onClick={() => setActiveSearchExerciseId(null)}
                                    className="text-neutral-500 hover:text-white text-[10px]"
                                  >
                                    Close ✕
                                  </button>
                                </div>

                                {/* Category filter chips */}
                                <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
                                  {['ALL', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Olympic', 'Combat', 'Conditioning', 'Mobility'].map(
                                    (cat) => (
                                      <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategoryFilter(cat)}
                                        className={`px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${
                                          categoryFilter === cat
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-[#1c1e28] text-neutral-400 hover:text-white'
                                        }`}
                                      >
                                        {cat}
                                      </button>
                                    )
                                  )}
                                </div>

                                <div className="space-y-1">
                                  {filteredGlobalExercises.map((item) => (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => handleSelectAutocompleteExercise(ex.id, item)}
                                      className="w-full text-left p-2 rounded-lg hover:bg-blue-600/20 hover:border-blue-500/30 border border-transparent flex items-center justify-between gap-2 transition"
                                    >
                                      <div>
                                        <div className="text-xs font-bold text-white">{item.name}</div>
                                        <div className="text-[10px] text-neutral-400">
                                          {item.primaryMuscle} · {item.equipment}
                                        </div>
                                      </div>
                                      <span className="text-[10px] bg-white/[0.06] text-neutral-300 px-2 py-0.5 rounded">
                                        {item.category}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Exercise Meta & Overload Indicator */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Category Tag */}
                          <select
                            value={ex.category}
                            onChange={(e) => {
                              const val = e.target.value;
                              setExercises((prev) =>
                                prev.map((item) => (item.id === ex.id ? { ...item, category: val } : item))
                              );
                            }}
                            className="bg-[#181920] border border-white/[0.08] text-neutral-300 text-[11px] rounded-lg px-2 py-1 focus:outline-none"
                          >
                            <option value="Chest">Chest</option>
                            <option value="Back">Back</option>
                            <option value="Legs">Legs</option>
                            <option value="Shoulders">Shoulders</option>
                            <option value="Arms">Arms</option>
                            <option value="Core">Core</option>
                            <option value="Olympic">Olympic</option>
                            <option value="Combat">Combat</option>
                            <option value="Conditioning">Conditioning</option>
                            <option value="Mobility">Mobility</option>
                          </select>

                          {/* Planned Volume Pill */}
                          <div className="bg-[#181920] border border-white/[0.08] px-2.5 py-1 rounded-lg text-[11px] font-mono text-neutral-300">
                            Vol: <span className="font-bold text-white">{plannedVol.toLocaleString()} kg</span>
                          </div>

                          {/* Remove Exercise Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveExercise(ex.id)}
                            className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                            title="Remove Exercise"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* LAST TIME PERFORMANCE & PROGRESSIVE OVERLOAD BAR */}
                      <div className="bg-[#13141b] border border-white/[0.06] p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                              Client's Prior Performance History
                            </span>
                            {history ? (
                              <div className="text-xs text-white font-medium">
                                <span className="text-amber-400 font-mono font-bold">
                                  {history.lastSetsText || `${history.lastWeightKg} kg × ${history.lastReps} reps`}
                                </span>{' '}
                                <span className="text-neutral-400 text-[11px]">
                                  (Vol: {history.lastVolumeKg.toLocaleString()}kg on {history.lastDate})
                                </span>
                              </div>
                            ) : (
                              <div className="text-xs text-purple-300 font-medium">
                                ⭐️ First time prescribing this movement for {selectedClient.name} (Baseline Session)
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Overload Status & Quick Overload Adjuster */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {history && (
                            <span
                              className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                                hasOverload
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : hasVolOverload
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              }`}
                            >
                              {hasOverload
                                ? `+${(maxPlannedWeight - history.lastWeightKg).toFixed(1)}kg Overload 🟢`
                                : hasVolOverload
                                ? '+Volume Overload 📈'
                                : 'Match Previous Load 🟡'}
                            </span>
                          )}

                          {/* Quick Overload Assist Buttons */}
                          {history && history.lastWeightKg > 0 && (
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const targetLoad = history.lastWeightKg + 2.5;
                                  setExercises((prev) =>
                                    prev.map((item) =>
                                      item.id === ex.id
                                        ? {
                                            ...item,
                                            sets: item.sets.map((s) =>
                                              s.setType === 'Working' ? { ...s, targetWeightKg: targetLoad } : s
                                            ),
                                          }
                                        : item
                                    )
                                  );
                                }}
                                className="px-2 py-0.5 bg-[#1f202b] hover:bg-emerald-600 hover:text-white text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-mono font-bold transition"
                                title="Apply +2.5kg Progressive Overload to working sets"
                              >
                                +2.5kg
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const targetLoad = history.lastWeightKg + 5.0;
                                  setExercises((prev) =>
                                    prev.map((item) =>
                                      item.id === ex.id
                                        ? {
                                            ...item,
                                            sets: item.sets.map((s) =>
                                              s.setType === 'Working' ? { ...s, targetWeightKg: targetLoad } : s
                                            ),
                                          }
                                        : item
                                    )
                                  );
                                }}
                                className="px-2 py-0.5 bg-[#1f202b] hover:bg-emerald-600 hover:text-white text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-mono font-bold transition"
                                title="Apply +5.0kg Progressive Overload to working sets"
                              >
                                +5.0kg
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* TRAINERIZE SET-BY-SET TABLE */}
                      <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[620px]">
                          <thead>
                            <tr className="border-b border-white/[0.06] text-[10px] uppercase font-bold text-neutral-400">
                              <th className="pb-2 pl-2 w-12">Set</th>
                              <th className="pb-2 w-28">Type</th>
                              <th className="pb-2 w-24">Previous</th>
                              <th className="pb-2 w-32">Weight (kg)</th>
                              <th className="pb-2 w-28">Target Reps</th>
                              <th className="pb-2 w-20">RPE</th>
                              <th className="pb-2 w-24">Rest (s)</th>
                              <th className="pb-2 w-24">Tempo</th>
                              <th className="pb-2 text-right pr-2 w-20">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.04]">
                            {ex.sets.map((set, sIdx) => {
                              return (
                                <tr key={set.id} className="hover:bg-white/[0.02] transition group">
                                  {/* Set Number */}
                                  <td className="py-2 pl-2">
                                    <span
                                      className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-black text-xs ${
                                        set.setType === 'Warmup'
                                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                          : set.setType === 'Drop'
                                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                      }`}
                                    >
                                      {set.setType === 'Warmup' ? 'W' : set.setType === 'Drop' ? 'D' : sIdx + 1}
                                    </span>
                                  </td>

                                  {/* Set Type */}
                                  <td className="py-2 pr-2">
                                    <select
                                      value={set.setType}
                                      onChange={(e) =>
                                        handleUpdateSetField(ex.id, set.id, 'setType', e.target.value)
                                      }
                                      className="bg-[#181920] border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                                    >
                                      <option value="Working">Working</option>
                                      <option value="Warmup">Warmup</option>
                                      <option value="Drop">Drop Set</option>
                                      <option value="AMRAP">AMRAP</option>
                                      <option value="Cooldown">Cooldown</option>
                                    </select>
                                  </td>

                                  {/* Previous Benchmark */}
                                  <td className="py-2 pr-2">
                                    <span className="text-xs font-mono text-neutral-400">
                                      {history ? `${history.lastWeightKg}k × ${history.lastReps}` : '—'}
                                    </span>
                                  </td>

                                  {/* Target Weight (kg) */}
                                  <td className="py-2 pr-2">
                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleUpdateSetField(
                                            ex.id,
                                            set.id,
                                            'targetWeightKg',
                                            Math.max(0, (set.targetWeightKg || 0) - 2.5)
                                          )
                                        }
                                        className="w-5 h-5 rounded bg-[#181920] hover:bg-[#252733] text-neutral-400 hover:text-white flex items-center justify-center text-xs font-bold font-mono"
                                      >
                                        -
                                      </button>
                                      <input
                                        type="number"
                                        step="0.5"
                                        value={set.targetWeightKg}
                                        onChange={(e) =>
                                          handleUpdateSetField(
                                            ex.id,
                                            set.id,
                                            'targetWeightKg',
                                            Number(e.target.value)
                                          )
                                        }
                                        className="w-16 bg-[#181920] border border-white/[0.08] rounded-lg py-1 px-1.5 text-center text-xs font-mono font-bold text-white focus:outline-none focus:border-blue-500"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleUpdateSetField(
                                            ex.id,
                                            set.id,
                                            'targetWeightKg',
                                            (set.targetWeightKg || 0) + 2.5
                                          )
                                        }
                                        className="w-5 h-5 rounded bg-[#181920] hover:bg-[#252733] text-neutral-400 hover:text-white flex items-center justify-center text-xs font-bold font-mono"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>

                                  {/* Target Reps */}
                                  <td className="py-2 pr-2">
                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleUpdateSetField(
                                            ex.id,
                                            set.id,
                                            'targetReps',
                                            Math.max(1, (set.targetReps || 1) - 1)
                                          )
                                        }
                                        className="w-5 h-5 rounded bg-[#181920] hover:bg-[#252733] text-neutral-400 hover:text-white flex items-center justify-center text-xs font-bold font-mono"
                                      >
                                        -
                                      </button>
                                      <input
                                        type="number"
                                        value={set.targetReps}
                                        onChange={(e) =>
                                          handleUpdateSetField(
                                            ex.id,
                                            set.id,
                                            'targetReps',
                                            Number(e.target.value)
                                          )
                                        }
                                        className="w-12 bg-[#181920] border border-white/[0.08] rounded-lg py-1 px-1 text-center text-xs font-mono font-bold text-white focus:outline-none focus:border-blue-500"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleUpdateSetField(
                                            ex.id,
                                            set.id,
                                            'targetReps',
                                            (set.targetReps || 1) + 1
                                          )
                                        }
                                        className="w-5 h-5 rounded bg-[#181920] hover:bg-[#252733] text-neutral-400 hover:text-white flex items-center justify-center text-xs font-bold font-mono"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>

                                  {/* RPE */}
                                  <td className="py-2 pr-2">
                                    <input
                                      type="number"
                                      step="0.5"
                                      min="1"
                                      max="10"
                                      value={set.rpe || 8}
                                      onChange={(e) =>
                                        handleUpdateSetField(ex.id, set.id, 'rpe', Number(e.target.value))
                                      }
                                      className="w-12 bg-[#181920] border border-white/[0.08] rounded-lg py-1 px-1 text-center text-xs font-mono text-amber-300 focus:outline-none"
                                    />
                                  </td>

                                  {/* Rest (s) */}
                                  <td className="py-2 pr-2">
                                    <select
                                      value={set.restSeconds || 90}
                                      onChange={(e) =>
                                        handleUpdateSetField(ex.id, set.id, 'restSeconds', Number(e.target.value))
                                      }
                                      className="bg-[#181920] border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-neutral-300 focus:outline-none font-mono"
                                    >
                                      <option value="30">30s</option>
                                      <option value="45">45s</option>
                                      <option value="60">60s</option>
                                      <option value="90">90s</option>
                                      <option value="120">120s</option>
                                      <option value="180">180s</option>
                                    </select>
                                  </td>

                                  {/* Tempo */}
                                  <td className="py-2 pr-2">
                                    <input
                                      type="text"
                                      value={set.tempo || '2-0-1-0'}
                                      onChange={(e) =>
                                        handleUpdateSetField(ex.id, set.id, 'tempo', e.target.value)
                                      }
                                      placeholder="3-0-1-0"
                                      className="w-16 bg-[#181920] border border-white/[0.08] rounded-lg py-1 px-1 text-center text-xs font-mono text-neutral-300 focus:outline-none"
                                    />
                                  </td>

                                  {/* Actions */}
                                  <td className="py-2 pr-2 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleDuplicateSet(ex.id, sIdx)}
                                        className="p-1 text-neutral-500 hover:text-blue-400 hover:bg-blue-500/10 rounded transition"
                                        title="Duplicate Set"
                                      >
                                        <Copy className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveSet(ex.id, set.id)}
                                        className="p-1 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
                                        title="Delete Set"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Add Set Row & Coaching Cues */}
                      <div className="pt-2 border-t border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => handleAddSetToExercise(ex.id)}
                          className="px-3 py-1.5 bg-[#181920] hover:bg-blue-600/20 hover:border-blue-500/40 hover:text-blue-300 text-neutral-400 text-xs font-bold rounded-xl border border-white/[0.08] transition flex items-center gap-1.5 w-fit"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Set</span>
                        </button>

                        <div className="flex items-center gap-2 flex-1 max-w-lg">
                          <span className="text-[10px] uppercase font-bold text-neutral-500 whitespace-nowrap">
                            Coach Cue:
                          </span>
                          <input
                            type="text"
                            value={ex.coachCues || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setExercises((prev) =>
                                prev.map((item) => (item.id === ex.id ? { ...item, coachCues: val } : item))
                              );
                            }}
                            placeholder="e.g. Drive through heels, maintain 3-point contact..."
                            className="w-full bg-[#181920] border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs text-neutral-300 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SESSION LEVEL PARAMETERS & COACHING NOTES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0d0e12] p-4 rounded-2xl border border-white/[0.06]">
            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-neutral-400 block">Session Duration</label>
              <div className="flex gap-1.5">
                {[30, 45, 60, 75, 90].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDurationMinutes(dur)}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition border ${
                      durationMinutes === dur
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                        : 'bg-[#181920] text-neutral-400 border-white/[0.08] hover:text-white'
                    }`}
                  >
                    {dur}m
                  </button>
                ))}
              </div>
            </div>

            {/* Target RPE */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-neutral-400 block">
                Target Intensity RPE (1-10)
              </label>
              <div className="flex items-center gap-3 bg-[#181920] p-2 rounded-xl border border-white/[0.08]">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={rpeTarget}
                  onChange={(e) => setRpeTarget(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <span className="text-xs font-mono font-black text-amber-400 bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/30 shrink-0">
                  RPE {rpeTarget}
                </span>
              </div>
            </div>

            {/* Session Notes */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-neutral-400 block">Coach Session Summary</label>
              <textarea
                rows={2}
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Notes on client form, readiness, recovery state..."
                className="w-full bg-[#181920] border border-white/[0.08] rounded-xl p-2 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* MASTER SUBMIT BUTTON WITH SUMMARY STRIP */}
          <div className="space-y-3 pt-2">
            <div className="bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-blue-900/20 border border-blue-500/30 p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs text-neutral-300">
                <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white">Summary: </span>
                  <span className="font-mono text-emerald-400 font-extrabold">{workoutStats.totalVolumeKg.toLocaleString()} kg Total Volume</span>
                  <span className="text-neutral-400"> · {workoutStats.totalSets} Sets · {workoutStats.totalReps} Reps · RPE {rpeTarget}</span>
                </div>
              </div>

              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Auto-generates Business Session Log note</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-blue-600/30 transition active:scale-[0.99]"
            >
              <ArrowRightLeft className="w-5 h-5" />
              <span>Save & Sync Session Plan to System 2 & Business OS</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
