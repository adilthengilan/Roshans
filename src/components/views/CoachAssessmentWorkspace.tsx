import React, { useState, useMemo } from 'react';
import { usePrimeStore } from '../../lib/store';
import { AssessmentRecord, SkillProgressItem } from '../../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Activity,
  TrendingDown,
  TrendingUp,
  Scale,
  Percent,
  HeartPulse,
  Award,
  Plus,
  CheckCircle2,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Dumbbell,
  Shield,
  Target,
  Ruler,
  FileText,
  Clock,
  Flame,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface CoachAssessmentWorkspaceProps {
  currentCoachName: string;
}

export const CoachAssessmentWorkspace: React.FC<CoachAssessmentWorkspaceProps> = ({
  currentCoachName,
}) => {
  const {
    assessmentRecords,
    addAssessmentRecord,
    clientMasterRecords,
  } = usePrimeStore();

  // Helper for coach assignment
  const isClientAssignedToCoach = (coachNameOrRole?: string, filterCoach?: string) => {
    if (!coachNameOrRole || !filterCoach) return true;
    const c1 = coachNameOrRole.toLowerCase();
    const c2 = filterCoach.toLowerCase();
    return c1.includes(c2) || c2.includes(c1);
  };

  const myAssignedClients = useMemo(() => {
    return clientMasterRecords.filter((c) =>
      isClientAssignedToCoach(c.assignedCoach, currentCoachName)
    );
  }, [clientMasterRecords, currentCoachName]);

  // Selected client for graphs & assessment
  const [selectedClientId, setSelectedClientId] = useState<string>(() => {
    return myAssignedClients[0]?.id || clientMasterRecords[0]?.id || 'CLI-101';
  });

  // Keep selectedClientId valid if coach changes
  const activeClient = useMemo(() => {
    return (
      clientMasterRecords.find((c) => c.id === selectedClientId) ||
      myAssignedClients[0] ||
      clientMasterRecords[0]
    );
  }, [clientMasterRecords, myAssignedClients, selectedClientId]);

  // Assessments for active client (sorted chronologically for graphs)
  const clientAssessments = useMemo(() => {
    if (!activeClient) return [];
    return assessmentRecords
      .filter(
        (a) =>
          a.clientId === activeClient.id ||
          a.clientName.toLowerCase() === activeClient.name.toLowerCase()
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [assessmentRecords, activeClient]);

  // Latest assessment record
  const latestAssessment: AssessmentRecord | undefined = clientAssessments[clientAssessments.length - 1];
  const baselineAssessment: AssessmentRecord | undefined = clientAssessments[0];

  // Active Metric Tab for Graph View
  const [activeMetricTab, setActiveMetricTab] = useState<
    'weight' | 'body_fat' | 'vo2_max' | 'skills' | 'multi_metric'
  >('weight');

  // Assessment Entry Mode / Modal Tabs
  const [showAddForm, setShowAddForm] = useState(false);
  const [entrySection, setEntrySection] = useState<
    'body_comp' | 'cardio_vitals' | 'strength_1rm' | 'posture_mobility' | 'skills'
  >('body_comp');

  // Form States
  const [assDate, setAssDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [assWeight, setAssWeight] = useState<string>('84.0');
  const [assBodyFat, setAssBodyFat] = useState<string>('11.0');
  const [assVo2, setAssVo2] = useState<string>('59.5');
  const [assMuscleMass, setAssMuscleMass] = useState<string>('42.0');
  const [assRestingHr, setAssRestingHr] = useState<string>('50');
  const [assBpSystolic, setAssBpSystolic] = useState<string>('120');
  const [assBpDiastolic, setAssBpDiastolic] = useState<string>('78');

  // Girths (cm)
  const [girthChest, setGirthChest] = useState<string>('108');
  const [girthWaist, setGirthWaist] = useState<string>('82');
  const [girthHips, setGirthHips] = useState<string>('100');
  const [girthLeftArm, setGirthLeftArm] = useState<string>('38');
  const [girthRightArm, setGirthRightArm] = useState<string>('38.5');
  const [girthLeftThigh, setGirthLeftThigh] = useState<string>('59');
  const [girthRightThigh, setGirthRightThigh] = useState<string>('59');
  const [girthLeftCalf, setGirthLeftCalf] = useState<string>('38');
  const [girthRightCalf, setGirthRightCalf] = useState<string>('38');

  // Strength & 1RMs
  const [bench1RM, setBench1RM] = useState<string>('120');
  const [squat1RM, setSquat1RM] = useState<string>('155');
  const [deadlift1RM, setDeadlift1RM] = useState<string>('190');
  const [ohp1RM, setOhp1RM] = useState<string>('77.5');
  const [pullUpsMax, setPullUpsMax] = useState<string>('22');
  const [powerWatts, setPowerWatts] = useState<string>('700');
  const [vertJumpCm, setVertJumpCm] = useState<string>('67');

  // Posture & Mobility
  const [postureScore, setPostureScore] = useState<number>(9);
  const [mobilityScore, setMobilityScore] = useState<number>(9);
  const [aerobicScore, setAerobicScore] = useState<number>(92);
  const [deficiencyInput, setDeficiencyInput] = useState<string>('Minor left hip flexor stiffness');

  // Skill Assessment State
  const [skillsList, setSkillsList] = useState<SkillProgressItem[]>([
    {
      id: 'sk-new-1',
      skillName: 'Strict Ring Muscle-Up',
      category: 'Gymnastics & Calisthenics',
      level: 'Advanced (Level 4)',
      progressPercentage: 90,
      benchmarkMetric: '6 Unbroken Strict Reps',
      coachingCues: 'False grip maintained; tight core hollow arch transition.',
    },
    {
      id: 'sk-new-2',
      skillName: 'Squat Snatch',
      category: 'Olympic Weightlifting',
      level: 'Advanced (Level 4)',
      progressPercentage: 80,
      benchmarkMetric: '90 kg 1RM',
      coachingCues: 'Fast turnover, aggressive lockout with stable bottom hold.',
    },
  ]);

  const [newSkillName, setNewSkillName] = useState<string>('Pistol Squat');
  const [newSkillCategory, setNewSkillCategory] = useState<
    | 'Gymnastics & Calisthenics'
    | 'Olympic Weightlifting'
    | 'Martial Arts & Striking'
    | 'Functional Mobility'
    | 'Power & Speed'
  >('Gymnastics & Calisthenics');
  const [newSkillLevel, setNewSkillLevel] = useState<
    | 'Novice (Level 1)'
    | 'Developing (Level 2)'
    | 'Proficient (Level 3)'
    | 'Advanced (Level 4)'
    | 'Elite / Mastered (Level 5)'
  >('Developing (Level 2)');
  const [newSkillProgress, setNewSkillProgress] = useState<number>(65);
  const [newSkillBenchmark, setNewSkillBenchmark] = useState<string>('8 Reps / Leg Unassisted');
  const [newSkillCues, setNewSkillCues] = useState<string>('Keep chest elevated and heel flat on drive.');

  const [assNotes, setAssNotes] = useState<string>(
    'Client demonstrating exceptional work capacity, reduced body fat, and higher VO2 max output.'
  );
  const [assMilestone, setAssMilestone] = useState<string>('Target: Sub-10% Body Fat & 200kg Deadlift');
  const [assSuccessMsg, setAssSuccessMsg] = useState(false);

  // Expanded History Card ID
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Compute Delta Changes
  const weightDelta = useMemo(() => {
    if (!baselineAssessment || !latestAssessment || clientAssessments.length < 2) return null;
    const diff = latestAssessment.weightKg - baselineAssessment.weightKg;
    return diff;
  }, [baselineAssessment, latestAssessment, clientAssessments]);

  const bodyFatDelta = useMemo(() => {
    if (!baselineAssessment || !latestAssessment || clientAssessments.length < 2) return null;
    const diff = latestAssessment.bodyFatPercentage - baselineAssessment.bodyFatPercentage;
    return diff;
  }, [baselineAssessment, latestAssessment, clientAssessments]);

  const vo2Delta = useMemo(() => {
    if (!baselineAssessment || !latestAssessment || clientAssessments.length < 2) return null;
    const diff = latestAssessment.vo2Max - baselineAssessment.vo2Max;
    return diff;
  }, [baselineAssessment, latestAssessment, clientAssessments]);

  // Prepare Data for Recharts
  const chartData = useMemo(() => {
    return clientAssessments.map((a, idx) => ({
      date: a.date.slice(5), // MM-DD
      fullDate: a.date,
      index: idx + 1,
      weight: a.weightKg,
      bodyFat: a.bodyFatPercentage,
      vo2Max: a.vo2Max,
      muscleMass: a.muscleMassKg || (a.weightKg * (1 - a.bodyFatPercentage / 100)).toFixed(1),
      benchPress: a.benchPress1RM || 0,
      squat: a.squat1RM || 0,
      deadlift: a.deadlift1RM || 0,
      restingHr: a.restingHeartRateBpm || 55,
      coach: a.coachName || a.assessedBy || 'Staff',
    }));
  }, [clientAssessments]);

  // Aggregate active client's skill progression deck
  const activeSkills: SkillProgressItem[] = useMemo(() => {
    if (latestAssessment?.skillProgressions && latestAssessment.skillProgressions.length > 0) {
      return latestAssessment.skillProgressions;
    }
    // Fallback default skills for display
    return [
      {
        id: 'sk-fb-1',
        skillName: 'Strict Ring Muscle-Up',
        category: 'Gymnastics & Calisthenics',
        level: 'Elite / Mastered (Level 5)',
        progressPercentage: 92,
        benchmarkMetric: '8 Unbroken Strict Reps',
        coachingCues: 'False grip stable, zero kipping, hollow arch turnover.',
      },
      {
        id: 'sk-fb-2',
        skillName: 'Olympic Squat Snatch',
        category: 'Olympic Weightlifting',
        level: 'Advanced (Level 4)',
        progressPercentage: 84,
        benchmarkMetric: '92.5 kg 1RM',
        coachingCues: 'Fast drop under the bar with locked thoracic spine.',
      },
      {
        id: 'sk-fb-3',
        skillName: 'Freestanding Handstand Pushup',
        category: 'Gymnastics & Calisthenics',
        level: 'Advanced (Level 4)',
        progressPercentage: 85,
        benchmarkMetric: '6 Strict Free Reps',
        coachingCues: 'Controlled descent, head-tripod alignment.',
      },
      {
        id: 'sk-fb-4',
        skillName: 'Striking Velocity & Slip Combos',
        category: 'Martial Arts & Striking',
        level: 'Proficient (Level 3)',
        progressPercentage: 76,
        benchmarkMetric: '3-Round Explosive Pad Test',
        coachingCues: 'Maintain guard symmetry during low angle slips.',
      },
    ];
  }, [latestAssessment]);

  // Add Skill to in-progress list
  const handleAddSkillToForm = () => {
    if (!newSkillName.trim()) return;
    const item: SkillProgressItem = {
      id: `sk-${Date.now()}`,
      skillName: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel,
      progressPercentage: Number(newSkillProgress),
      benchmarkMetric: newSkillBenchmark.trim() || undefined,
      coachingCues: newSkillCues.trim() || undefined,
    };
    setSkillsList((prev) => [...prev, item]);
    setNewSkillName('');
    setNewSkillBenchmark('');
    setNewSkillCues('');
  };

  const handleRemoveSkillFromForm = (id?: string) => {
    if (!id) return;
    setSkillsList((prev) => prev.filter((s) => s.id !== id));
  };

  // Submit complete Trainerize Assessment Record
  const handleSaveFullAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClient) return;

    const newRecord: Omit<AssessmentRecord, 'id'> = {
      clientId: activeClient.id,
      clientName: activeClient.name,
      date: assDate,
      coachName: currentCoachName,
      assessedBy: currentCoachName,
      weightKg: Number(assWeight),
      bodyFatPercentage: Number(assBodyFat),
      vo2Max: Number(assVo2),
      muscleMassKg: assMuscleMass ? Number(assMuscleMass) : undefined,
      restingHeartRateBpm: assRestingHr ? Number(assRestingHr) : undefined,
      bloodPressureSystolic: assBpSystolic ? Number(assBpSystolic) : undefined,
      bloodPressureDiastolic: assBpDiastolic ? Number(assBpDiastolic) : undefined,
      girths: {
        chestCm: girthChest ? Number(girthChest) : undefined,
        waistCm: girthWaist ? Number(girthWaist) : undefined,
        hipsCm: girthHips ? Number(girthHips) : undefined,
        leftArmCm: girthLeftArm ? Number(girthLeftArm) : undefined,
        rightArmCm: girthRightArm ? Number(girthRightArm) : undefined,
        leftThighCm: girthLeftThigh ? Number(girthLeftThigh) : undefined,
        rightThighCm: girthRightThigh ? Number(girthRightThigh) : undefined,
        leftCalfCm: girthLeftCalf ? Number(girthLeftCalf) : undefined,
        rightCalfCm: girthRightCalf ? Number(girthRightCalf) : undefined,
      },
      benchPress1RM: bench1RM ? Number(bench1RM) : undefined,
      squat1RM: squat1RM ? Number(squat1RM) : undefined,
      deadlift1RM: deadlift1RM ? Number(deadlift1RM) : undefined,
      overheadPress1RM: ohp1RM ? Number(ohp1RM) : undefined,
      pullUpMaxReps: pullUpsMax ? Number(pullUpsMax) : undefined,
      powerOutputWatt: powerWatts ? Number(powerWatts) : undefined,
      verticalJumpCm: vertJumpCm ? Number(vertJumpCm) : undefined,
      postureScore,
      mobilityScore,
      aerobicCapacityScore: aerobicScore,
      movementDeficiencies: deficiencyInput ? [deficiencyInput.trim()] : undefined,
      skillProgressions: skillsList,
      coachObservations: assNotes,
      notes: assNotes,
      targetMilestone: assMilestone,
    };

    addAssessmentRecord(newRecord);
    setAssSuccessMsg(true);
    setShowAddForm(false);
    setTimeout(() => setAssSuccessMsg(false), 4000);
  };

  // Helper for VO2 rating
  const getVo2Rating = (vo2: number) => {
    if (vo2 >= 58) return { label: 'Superior / Elite', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
    if (vo2 >= 50) return { label: 'Excellent', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (vo2 >= 42) return { label: 'Good', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    return { label: 'Fair / Developing', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
  };

  return (
    <div className="space-y-4">
      {/* HEADER & CLIENT SELECTOR BANNER */}
      <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#26262A]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                <Activity className="w-3 h-3 text-purple-400" /> Trainerize Biomarker Engine
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                Total Ledger: {assessmentRecords.length} Records
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-1 flex items-center gap-2">
              <span>Physical Assessments, Biomarker Graphs & Skill Mastery</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Interactive trajectory graphs for Weight, Body Fat %, VO2 Max, full Trainerize girths & skill progressions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-purple-900/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? 'Hide Entry Form' : 'Log New Assessment'}</span>
            </button>
          </div>
        </div>

        {/* CLIENT SELECTOR CHIPS & ACTIVE CLIENT OVERVIEW */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-400" /> Select Client for Graph & Assessment Analysis:
            </label>
            <span className="text-[10px] text-neutral-400 font-mono">
              {clientAssessments.length} assessment checkpoints recorded
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {clientMasterRecords.map((c) => {
              const isSelected = c.id === selectedClientId;
              const isMyClient = isClientAssignedToCoach(c.assignedCoach, currentCoachName);
              const count = assessmentRecords.filter(
                (a) => a.clientId === c.id || a.clientName.toLowerCase() === c.name.toLowerCase()
              ).length;

              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedClientId(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap border shrink-0 ${
                    isSelected
                      ? 'bg-purple-600/20 text-purple-300 border-purple-500/50 shadow-md'
                      : 'bg-[#1c1c20] text-neutral-400 hover:text-white border-[#2e2e34] hover:border-neutral-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                      isSelected
                        ? 'bg-purple-500 text-white'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {c.name.split(' ')[0]?.[0] || 'C'}
                  </div>
                  <span>{c.name}</span>
                  {count > 0 && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected
                          ? 'bg-purple-500/30 text-purple-200'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                  {isMyClient && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Assigned to you" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {assSuccessMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Trainerize Assessment successfully logged & biomarker trajectory graphs updated!</span>
          </div>
        )}
      </div>

      {/* QUICK METRIC STAT TILES (LATEST VS BASELINE) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* WEIGHT STAT */}
        <div
          onClick={() => setActiveMetricTab('weight')}
          className={`p-3.5 rounded-xl border transition cursor-pointer ${
            activeMetricTab === 'weight'
              ? 'bg-purple-950/20 border-purple-500/60 ring-1 ring-purple-500/30'
              : 'bg-[#161618] border-[#26262A] hover:border-neutral-700'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono uppercase">
            <span className="flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-purple-400" /> Body Weight
            </span>
            {weightDelta !== null && (
              <span
                className={`font-bold flex items-center gap-0.5 ${
                  weightDelta <= 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {weightDelta <= 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {Math.abs(weightDelta).toFixed(1)} kg
              </span>
            )}
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white font-mono">
              {latestAssessment ? latestAssessment.weightKg : '—'}
            </span>
            <span className="text-xs text-neutral-400 font-bold">kg</span>
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5 truncate">
            Baseline: {baselineAssessment?.weightKg || '—'} kg · {clientAssessments.length} logs
          </div>
        </div>

        {/* BODY FAT % STAT */}
        <div
          onClick={() => setActiveMetricTab('body_fat')}
          className={`p-3.5 rounded-xl border transition cursor-pointer ${
            activeMetricTab === 'body_fat'
              ? 'bg-amber-950/20 border-amber-500/60 ring-1 ring-amber-500/30'
              : 'bg-[#161618] border-[#26262A] hover:border-neutral-700'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono uppercase">
            <span className="flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-amber-400" /> Body Fat
            </span>
            {bodyFatDelta !== null && (
              <span
                className={`font-bold flex items-center gap-0.5 ${
                  bodyFatDelta <= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {bodyFatDelta <= 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {Math.abs(bodyFatDelta).toFixed(1)}%
              </span>
            )}
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
              {latestAssessment ? latestAssessment.bodyFatPercentage : '—'}
            </span>
            <span className="text-xs text-neutral-400 font-bold">%</span>
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5 truncate">
            Baseline: {baselineAssessment?.bodyFatPercentage || '—'}% · Athletic Tier
          </div>
        </div>

        {/* VO2 MAX STAT */}
        <div
          onClick={() => setActiveMetricTab('vo2_max')}
          className={`p-3.5 rounded-xl border transition cursor-pointer ${
            activeMetricTab === 'vo2_max'
              ? 'bg-cyan-950/20 border-cyan-500/60 ring-1 ring-cyan-500/30'
              : 'bg-[#161618] border-[#26262A] hover:border-neutral-700'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono uppercase">
            <span className="flex items-center gap-1">
              <HeartPulse className="w-3.5 h-3.5 text-cyan-400" /> VO2 Max
            </span>
            {vo2Delta !== null && (
              <span
                className={`font-bold flex items-center gap-0.5 ${
                  vo2Delta >= 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {vo2Delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                +{vo2Delta.toFixed(1)}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">
              {latestAssessment ? latestAssessment.vo2Max : '—'}
            </span>
            <span className="text-[10px] text-neutral-400 font-bold">ml/kg/min</span>
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5 truncate">
            {latestAssessment ? getVo2Rating(latestAssessment.vo2Max).label : '—'}
          </div>
        </div>

        {/* SKILL PROGRESS STAT */}
        <div
          onClick={() => setActiveMetricTab('skills')}
          className={`p-3.5 rounded-xl border transition cursor-pointer ${
            activeMetricTab === 'skills'
              ? 'bg-emerald-950/20 border-emerald-500/60 ring-1 ring-emerald-500/30'
              : 'bg-[#161618] border-[#26262A] hover:border-neutral-700'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono uppercase">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-400" /> Skill Mastery
            </span>
            <span className="text-emerald-400 font-bold font-mono">{activeSkills.length} Tracked</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
              {Math.round(
                activeSkills.reduce((acc, s) => acc + s.progressPercentage, 0) /
                  (activeSkills.length || 1)
              )}
            </span>
            <span className="text-xs text-neutral-400 font-bold">% Avg Mastery</span>
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5 truncate">
            Top: {activeSkills[0]?.skillName || 'Ring Muscle-Up'}
          </div>
        </div>
      </div>

      {/* INTERACTIVE GRAPHS & SKILL PROGRESSION HUB */}
      <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
        {/* GRAPH VIEW SELECTOR TABS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#26262A]">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveMetricTab('weight')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeMetricTab === 'weight'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-[#1c1c20] text-neutral-400 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Weight Graph (kg)</span>
            </button>

            <button
              onClick={() => setActiveMetricTab('body_fat')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeMetricTab === 'body_fat'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-[#1c1c20] text-neutral-400 hover:text-white'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>Body Fat % Graph</span>
            </button>

            <button
              onClick={() => setActiveMetricTab('vo2_max')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeMetricTab === 'vo2_max'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-[#1c1c20] text-neutral-400 hover:text-white'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>VO2 Max Graph</span>
            </button>

            <button
              onClick={() => setActiveMetricTab('skills')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeMetricTab === 'skills'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#1c1c20] text-neutral-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Skill Progress ({activeSkills.length})</span>
            </button>

            <button
              onClick={() => setActiveMetricTab('multi_metric')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeMetricTab === 'multi_metric'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-[#1c1c20] text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Combined Multi-Trend</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-neutral-400 self-end sm:self-auto">
            Client: <strong className="text-white">{activeClient?.name}</strong>
          </span>
        </div>

        {/* 1. WEIGHT GRAPH */}
        {activeMetricTab === 'weight' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-purple-400" /> Body Weight Progression (kg)
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Targeted mass regulation & lean mass retention trajectory over time.
                </p>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-neutral-400 block">Current: <strong className="text-white">{latestAssessment?.weightKg || 0} kg</strong></span>
                {weightDelta !== null && (
                  <span className={`text-[10px] font-bold ${weightDelta <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    Net Change: {weightDelta > 0 ? `+${weightDelta.toFixed(1)}` : weightDelta.toFixed(1)} kg
                  </span>
                )}
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#26262A" />
                    <XAxis dataKey="date" stroke="#737373" tick={{ fontSize: 11, fill: '#a3a3a3' }} />
                    <YAxis
                      domain={['dataMin - 2', 'dataMax + 2']}
                      stroke="#737373"
                      tick={{ fontSize: 11, fill: '#a3a3a3' }}
                      unit="kg"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#121214',
                        borderColor: '#3f3f46',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#ffffff',
                      }}
                      formatter={(val: any) => [`${val} kg`, 'Body Weight']}
                      labelFormatter={(label) => `Assessment Checkpoint: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke="#a855f7"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#weightGrad)"
                      dot={{ r: 5, fill: '#a855f7', stroke: '#ffffff', strokeWidth: 2 }}
                      activeDot={{ r: 7 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-neutral-500 text-xs">
                  No historical weight assessment data recorded for {activeClient?.name}.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. BODY FAT % GRAPH */}
        {activeMetricTab === 'body_fat' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-amber-400" /> Body Fat Percentage (%) & Muscle Mass
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Adipose reduction curve vs Skeletal Muscle mass preservation.
                </p>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-neutral-400 block">Current: <strong className="text-amber-300">{latestAssessment?.bodyFatPercentage || 0}%</strong></span>
                {bodyFatDelta !== null && (
                  <span className={`text-[10px] font-bold ${bodyFatDelta <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    Net Delta: {bodyFatDelta > 0 ? `+${bodyFatDelta.toFixed(1)}` : bodyFatDelta.toFixed(1)}% BF
                  </span>
                )}
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="bfGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#26262A" />
                    <XAxis dataKey="date" stroke="#737373" tick={{ fontSize: 11, fill: '#a3a3a3' }} />
                    <YAxis
                      domain={['dataMin - 1', 'dataMax + 1']}
                      stroke="#737373"
                      tick={{ fontSize: 11, fill: '#a3a3a3' }}
                      unit="%"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#121214',
                        borderColor: '#3f3f46',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#ffffff',
                      }}
                      formatter={(val: any) => [`${val}%`, 'Body Fat %']}
                      labelFormatter={(label) => `Assessment Checkpoint: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="bodyFat"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#bfGrad)"
                      dot={{ r: 5, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
                      activeDot={{ r: 7 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-neutral-500 text-xs">
                  No body fat assessment data recorded for {activeClient?.name}.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. VO2 MAX GRAPH */}
        {activeMetricTab === 'vo2_max' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-cyan-400" /> VO2 Max Aerobic Power (ml/kg/min)
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Cardiorespiratory endurance capacity, anaerobic threshold & recovery index.
                </p>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-neutral-400 block">Current: <strong className="text-cyan-300">{latestAssessment?.vo2Max || 0} ml/kg/min</strong></span>
                {vo2Delta !== null && (
                  <span className={`text-[10px] font-bold ${vo2Delta >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    Net Gain: +{vo2Delta.toFixed(1)} ml/kg/min
                  </span>
                )}
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="vo2Grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#26262A" />
                    <XAxis dataKey="date" stroke="#737373" tick={{ fontSize: 11, fill: '#a3a3a3' }} />
                    <YAxis
                      domain={['dataMin - 3', 'dataMax + 3']}
                      stroke="#737373"
                      tick={{ fontSize: 11, fill: '#a3a3a3' }}
                      unit=" ml"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#121214',
                        borderColor: '#3f3f46',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#ffffff',
                      }}
                      formatter={(val: any) => [`${val} ml/kg/min`, 'VO2 Max Score']}
                      labelFormatter={(label) => `Assessment Checkpoint: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="vo2Max"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#vo2Grad)"
                      dot={{ r: 5, fill: '#06b6d4', stroke: '#ffffff', strokeWidth: 2 }}
                      activeDot={{ r: 7 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-neutral-500 text-xs">
                  No VO2 max assessment data recorded for {activeClient?.name}.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. SKILL PROGRESSION DECK */}
        {activeMetricTab === 'skills' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#26262A]">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" /> Athletic Skill Mastery & Progression Board
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Track technical mastery levels for Calisthenics, Olympic Lifts, Martial Arts & Speed skills.
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-xl transition flex items-center gap-1 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" /> Assess New Skill
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeSkills.map((skill, idx) => {
                const getLevelColor = (lvl: string) => {
                  if (lvl.includes('Elite') || lvl.includes('Mastered') || lvl.includes('Level 5')) {
                    return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
                  }
                  if (lvl.includes('Advanced') || lvl.includes('Level 4')) {
                    return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
                  }
                  if (lvl.includes('Proficient') || lvl.includes('Level 3')) {
                    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                  }
                  return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                };

                return (
                  <div
                    key={skill.id || idx}
                    className="p-4 rounded-xl border border-[#26262A] bg-[#121214] hover:border-emerald-500/40 transition space-y-3 relative overflow-hidden group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                          {skill.category}
                        </span>
                        <h5 className="text-sm font-black text-white mt-0.5">{skill.skillName}</h5>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${getLevelColor(
                          skill.level
                        )}`}
                      >
                        {skill.level.split(' ')[0]}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-400 text-[11px]">Technical Competency</span>
                        <span className="font-extrabold text-emerald-400">{skill.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-[#202024] h-2.5 rounded-full overflow-hidden border border-[#2e2e34]">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${skill.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Benchmark & Coaching Cue */}
                    <div className="bg-[#18181C] border border-[#26262A] p-2.5 rounded-lg text-xs space-y-1">
                      {skill.benchmarkMetric && (
                        <div className="flex items-center gap-1.5 text-neutral-300 font-mono">
                          <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Benchmark: <strong className="text-white">{skill.benchmarkMetric}</strong></span>
                        </div>
                      )}
                      {skill.coachingCues && (
                        <div className="text-[11px] text-neutral-400 italic">
                          "{skill.coachingCues}"
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. MULTI-METRIC COMBINED GRAPH */}
        {activeMetricTab === 'multi_metric' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> Multi-Biomarker Historical Overview
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Weight (Purple), Body Fat % (Amber), and VO2 Max (Cyan) curves over time.
                </p>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#26262A" />
                    <XAxis dataKey="date" stroke="#737373" tick={{ fontSize: 11, fill: '#a3a3a3' }} />
                    <YAxis stroke="#737373" tick={{ fontSize: 11, fill: '#a3a3a3' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#121214',
                        borderColor: '#3f3f46',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#ffffff',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      name="Weight (kg)"
                      stroke="#a855f7"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bodyFat"
                      name="Body Fat %"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="vo2Max"
                      name="VO2 Max"
                      stroke="#06b6d4"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-neutral-500 text-xs">
                  No multi-metric data available.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* COMPLETE TRAINERIZE ASSESSMENT ENTRY FORM */}
      {showAddForm && (
        <div className="bg-[#161618] border border-purple-500/40 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl relative">
          <div className="flex items-center justify-between pb-3 border-b border-[#26262A]">
            <div>
              <span className="text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded uppercase">
                Trainerize Pro Assessment Input
              </span>
              <h3 className="text-base font-black text-white mt-1">
                Record Athletic Assessment for {activeClient?.name}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-neutral-400 hover:text-white px-2.5 py-1 rounded-lg bg-[#242428]"
            >
              Cancel
            </button>
          </div>

          {/* SECTION SWITCHER */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setEntrySection('body_comp')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                entrySection === 'body_comp'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-[#202024] text-neutral-400 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>1. Body Comp & Girths</span>
            </button>

            <button
              type="button"
              onClick={() => setEntrySection('cardio_vitals')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                entrySection === 'cardio_vitals'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-[#202024] text-neutral-400 hover:text-white'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>2. Cardio & Biomarkers</span>
            </button>

            <button
              type="button"
              onClick={() => setEntrySection('strength_1rm')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                entrySection === 'strength_1rm'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-[#202024] text-neutral-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>3. Strength & 1RMs</span>
            </button>

            <button
              type="button"
              onClick={() => setEntrySection('posture_mobility')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                entrySection === 'posture_mobility'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-[#202024] text-neutral-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>4. Movement & Posture</span>
            </button>

            <button
              type="button"
              onClick={() => setEntrySection('skills')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                entrySection === 'skills'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#202024] text-neutral-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>5. Skill Progressions ({skillsList.length})</span>
            </button>
          </div>

          <form onSubmit={handleSaveFullAssessment} className="space-y-4">
            {/* COMMON DATE FIELD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                  Assessment Date
                </label>
                <input
                  type="date"
                  value={assDate}
                  onChange={(e) => setAssDate(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                  Assessing Performance Coach
                </label>
                <input
                  type="text"
                  value={currentCoachName}
                  disabled
                  className="w-full bg-[#0A0A0B]/60 border border-[#26262A] rounded-xl p-2.5 text-xs text-neutral-400 focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* SECTION 1: BODY COMPOSITION & GIRTHS */}
            {entrySection === 'body_comp' && (
              <div className="space-y-3 p-3 bg-[#101012] border border-[#242428] rounded-xl">
                <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Scale className="w-4 h-4" /> Core Body Composition (Interactive Graph Inputs)
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      Body Weight (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={assWeight}
                      onChange={(e) => setAssWeight(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      Body Fat % *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={assBodyFat}
                      onChange={(e) => setAssBodyFat(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-amber-300 font-mono focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      Muscle Mass (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={assMuscleMass}
                      onChange={(e) => setAssMuscleMass(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      Resting HR (bpm)
                    </label>
                    <input
                      type="number"
                      value={assRestingHr}
                      onChange={(e) => setAssRestingHr(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                {/* Girth Circumferences */}
                <div className="pt-2 border-t border-[#242428] space-y-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block font-mono">
                    Trainerize Girth Circumferences (cm):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase">Chest</span>
                      <input
                        type="number"
                        step="0.5"
                        value={girthChest}
                        onChange={(e) => setGirthChest(e.target.value)}
                        className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-lg p-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase">Waist</span>
                      <input
                        type="number"
                        step="0.5"
                        value={girthWaist}
                        onChange={(e) => setGirthWaist(e.target.value)}
                        className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-lg p-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase">Hips</span>
                      <input
                        type="number"
                        step="0.5"
                        value={girthHips}
                        onChange={(e) => setGirthHips(e.target.value)}
                        className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-lg p-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase">Right Arm</span>
                      <input
                        type="number"
                        step="0.5"
                        value={girthRightArm}
                        onChange={(e) => setGirthRightArm(e.target.value)}
                        className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-lg p-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase">Left Arm</span>
                      <input
                        type="number"
                        step="0.5"
                        value={girthLeftArm}
                        onChange={(e) => setGirthLeftArm(e.target.value)}
                        className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-lg p-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase">Right Thigh</span>
                      <input
                        type="number"
                        step="0.5"
                        value={girthRightThigh}
                        onChange={(e) => setGirthRightThigh(e.target.value)}
                        className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-lg p-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase">Left Thigh</span>
                      <input
                        type="number"
                        step="0.5"
                        value={girthLeftThigh}
                        onChange={(e) => setGirthLeftThigh(e.target.value)}
                        className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-lg p-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase">Calf</span>
                      <input
                        type="number"
                        step="0.5"
                        value={girthRightCalf}
                        onChange={(e) => setGirthRightCalf(e.target.value)}
                        className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-lg p-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: CARDIOVASCULAR & VITALS */}
            {entrySection === 'cardio_vitals' && (
              <div className="space-y-3 p-3 bg-[#101012] border border-[#242428] rounded-xl">
                <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4" /> Cardiovascular Biomarkers & Aerobic Tests
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      VO2 Max (ml/kg/min) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={assVo2}
                      onChange={(e) => setAssVo2(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-cyan-300 font-mono focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      Systolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      value={assBpSystolic}
                      onChange={(e) => setAssBpSystolic(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono focus:outline-none"
                      placeholder="120"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      Diastolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      value={assBpDiastolic}
                      onChange={(e) => setAssBpDiastolic(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono focus:outline-none"
                      placeholder="80"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      Conditioning Score (1-100)
                    </label>
                    <input
                      type="number"
                      value={aerobicScore}
                      onChange={(e) => setAerobicScore(Number(e.target.value))}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: STRENGTH & 1RMS */}
            {entrySection === 'strength_1rm' && (
              <div className="space-y-3 p-3 bg-[#101012] border border-[#242428] rounded-xl">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Dumbbell className="w-4 h-4" /> Strength & 1RM Power Benchmarks (kg)
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      Bench Press 1RM (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={bench1RM}
                      onChange={(e) => setBench1RM(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      Squat 1RM (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={squat1RM}
                      onChange={(e) => setSquat1RM(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      Deadlift 1RM (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={deadlift1RM}
                      onChange={(e) => setDeadlift1RM(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      Overhead Press 1RM (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={ohp1RM}
                      onChange={(e) => setOhp1RM(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      Max Pull-Ups (Reps)
                    </label>
                    <input
                      type="number"
                      value={pullUpsMax}
                      onChange={(e) => setPullUpsMax(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      Peak Power (Watts)
                    </label>
                    <input
                      type="number"
                      value={powerWatts}
                      onChange={(e) => setPowerWatts(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      Vertical Jump (cm)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={vertJumpCm}
                      onChange={(e) => setVertJumpCm(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: MOVEMENT & POSTURE */}
            {entrySection === 'posture_mobility' && (
              <div className="space-y-3 p-3 bg-[#101012] border border-[#242428] rounded-xl">
                <div className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> Movement Screen, FMS & Postural Alignment
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      Postural Alignment Score (1-10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={postureScore}
                      onChange={(e) => setPostureScore(Number(e.target.value))}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      Mobility & Flexibility Score (1-10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={mobilityScore}
                      onChange={(e) => setMobilityScore(Number(e.target.value))}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                    Movement Deficiencies & Corrective Flags
                  </label>
                  <input
                    type="text"
                    value={deficiencyInput}
                    onChange={(e) => setDeficiencyInput(e.target.value)}
                    placeholder="e.g. Anterior pelvic tilt, tight right hip flexor"
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* SECTION 5: SKILL PROGRESSIONS */}
            {entrySection === 'skills' && (
              <div className="space-y-3 p-3 bg-[#101012] border border-[#242428] rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> Skill Progression Assessment
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {skillsList.length} Skills Included in this Record
                  </span>
                </div>

                {/* Current Skills in this assessment */}
                <div className="space-y-2">
                  {skillsList.map((sk) => (
                    <div
                      key={sk.id}
                      className="flex items-center justify-between p-2.5 bg-[#18181C] border border-[#28282E] rounded-xl text-xs"
                    >
                      <div>
                        <span className="font-bold text-white block">{sk.skillName}</span>
                        <span className="text-[10px] text-neutral-400">
                          {sk.category} · {sk.level} ({sk.progressPercentage}%) · {sk.benchmarkMetric}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkillFromForm(sk.id)}
                        className="text-[10px] text-rose-400 hover:text-rose-300 px-2 py-1 bg-rose-500/10 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Skill Sub-form */}
                <div className="p-3 bg-[#1a1a1e] border border-dashed border-[#3e3e44] rounded-xl space-y-2">
                  <span className="text-[11px] font-bold text-white block">Add / Update Skill Progress:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Skill Name (e.g. Ring Muscle-Up)"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      className="bg-[#0A0A0B] border border-[#26262A] rounded-lg p-2 text-xs text-white"
                    />

                    <select
                      value={newSkillCategory}
                      onChange={(e: any) => setNewSkillCategory(e.target.value)}
                      className="bg-[#0A0A0B] border border-[#26262A] rounded-lg p-2 text-xs text-white"
                    >
                      <option value="Gymnastics & Calisthenics">Gymnastics & Calisthenics</option>
                      <option value="Olympic Weightlifting">Olympic Weightlifting</option>
                      <option value="Martial Arts & Striking">Martial Arts & Striking</option>
                      <option value="Functional Mobility">Functional Mobility</option>
                      <option value="Power & Speed">Power & Speed</option>
                    </select>

                    <select
                      value={newSkillLevel}
                      onChange={(e: any) => setNewSkillLevel(e.target.value)}
                      className="bg-[#0A0A0B] border border-[#26262A] rounded-lg p-2 text-xs text-white"
                    >
                      <option value="Novice (Level 1)">Novice (Level 1)</option>
                      <option value="Developing (Level 2)">Developing (Level 2)</option>
                      <option value="Proficient (Level 3)">Proficient (Level 3)</option>
                      <option value="Advanced (Level 4)">Advanced (Level 4)</option>
                      <option value="Elite / Mastered (Level 5)">Elite / Mastered (Level 5)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[9px] text-neutral-400 uppercase block">Progress % (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newSkillProgress}
                        onChange={(e) => setNewSkillProgress(Number(e.target.value))}
                        className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-lg p-2 text-xs text-emerald-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-neutral-400 uppercase block">Benchmark Metric</label>
                      <input
                        type="text"
                        placeholder="e.g. 5 Reps, 85kg 1RM"
                        value={newSkillBenchmark}
                        onChange={(e) => setNewSkillBenchmark(e.target.value)}
                        className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-neutral-400 uppercase block">Coaching Cues</label>
                      <input
                        type="text"
                        placeholder="e.g. False grip, clean turnover"
                        value={newSkillCues}
                        onChange={(e) => setNewSkillCues(e.target.value)}
                        className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSkillToForm}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition"
                  >
                    + Append Skill to Assessment
                  </button>
                </div>
              </div>
            )}

            {/* OBSERVATIONS & TARGET MILESTONE */}
            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                  Coach Observations & Athletic Summary
                </label>
                <textarea
                  rows={2}
                  value={assNotes}
                  onChange={(e) => setAssNotes(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                  Next Milestone / Evaluation Goal
                </label>
                <input
                  type="text"
                  value={assMilestone}
                  onChange={(e) => setAssMilestone(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  placeholder="e.g. Target: Sub-10% Body Fat & 200kg Deadlift"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs sm:text-sm rounded-xl hover:from-purple-500 hover:to-indigo-500 transition shadow-lg"
            >
              Commit Trainerize Assessment & Update Graphs
            </button>
          </form>
        </div>
      )}

      {/* ASSESSMENT HISTORY LEDGER */}
      <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#26262A]">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" /> Assessment History Ledger for {activeClient?.name}
            </h4>
            <p className="text-[11px] text-neutral-400">
              {clientAssessments.length} complete assessments recorded with Trainerize metrics.
            </p>
          </div>
        </div>

        {clientAssessments.length === 0 ? (
          <div className="p-8 text-center bg-[#101012] border border-[#26262A] rounded-xl space-y-2">
            <Activity className="w-8 h-8 text-neutral-500 mx-auto" />
            <div className="text-xs font-bold text-white">No Assessment Records for {activeClient?.name}</div>
            <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
              Click "Log New Assessment" above to record the initial baseline assessment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {clientAssessments.slice().reverse().map((ass) => {
              const isExpanded = expandedCardId === ass.id;

              return (
                <div
                  key={ass.id}
                  className="bg-[#121214] border border-[#26262A] rounded-xl p-4 space-y-3 hover:border-purple-500/40 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded">
                          {ass.date}
                        </span>
                        <span className="text-xs font-black text-white">{ass.clientName}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 block mt-0.5">
                        Assessed by <strong className="text-neutral-300">{ass.coachName || ass.assessedBy || currentCoachName}</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedCardId(isExpanded ? null : ass.id)}
                      className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-[#1c1c20] px-2.5 py-1 rounded-lg border border-[#2e2e34]"
                    >
                      <span>{isExpanded ? 'Collapse' : 'Full Trainerize Metrics'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Primary Biomarkers */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                    <div className="bg-[#18181C] p-2.5 rounded-lg border border-[#26262A]">
                      <span className="text-[9px] text-neutral-400 block uppercase">Weight</span>
                      <span className="font-extrabold text-white text-sm">{ass.weightKg} kg</span>
                    </div>

                    <div className="bg-[#18181C] p-2.5 rounded-lg border border-[#26262A]">
                      <span className="text-[9px] text-neutral-400 block uppercase">Body Fat</span>
                      <span className="font-extrabold text-amber-300 text-sm">{ass.bodyFatPercentage}%</span>
                    </div>

                    <div className="bg-[#18181C] p-2.5 rounded-lg border border-[#26262A]">
                      <span className="text-[9px] text-neutral-400 block uppercase">VO2 Max</span>
                      <span className="font-extrabold text-cyan-300 text-sm">{ass.vo2Max}</span>
                    </div>

                    <div className="hidden sm:block bg-[#18181C] p-2.5 rounded-lg border border-[#26262A]">
                      <span className="text-[9px] text-neutral-400 block uppercase">Resting HR</span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {ass.restingHeartRateBpm ? `${ass.restingHeartRateBpm} bpm` : '50 bpm'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Trainerize Details */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-[#26262A] space-y-3 text-xs">
                      {/* Strength 1RMs */}
                      {(ass.benchPress1RM || ass.squat1RM || ass.deadlift1RM) && (
                        <div className="p-2.5 bg-[#18181C] rounded-lg space-y-1">
                          <span className="text-[10px] font-bold text-amber-300 uppercase font-mono block">
                            1RM Strength Benchmarks:
                          </span>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                            {ass.benchPress1RM && <span>Bench: <strong className="text-white">{ass.benchPress1RM} kg</strong></span>}
                            {ass.squat1RM && <span>Squat: <strong className="text-white">{ass.squat1RM} kg</strong></span>}
                            {ass.deadlift1RM && <span>Deadlift: <strong className="text-white">{ass.deadlift1RM} kg</strong></span>}
                            {ass.powerOutputWatt && <span>Power: <strong className="text-white">{ass.powerOutputWatt} W</strong></span>}
                          </div>
                        </div>
                      )}

                      {/* Girths */}
                      {ass.girths && (
                        <div className="p-2.5 bg-[#18181C] rounded-lg space-y-1">
                          <span className="text-[10px] font-bold text-purple-300 uppercase font-mono block">
                            Circumference Measurements (cm):
                          </span>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 font-mono text-[11px] text-neutral-300">
                            {ass.girths.chestCm && <span>Chest: {ass.girths.chestCm}cm</span>}
                            {ass.girths.waistCm && <span>Waist: {ass.girths.waistCm}cm</span>}
                            {ass.girths.hipsCm && <span>Hips: {ass.girths.hipsCm}cm</span>}
                            {ass.girths.rightArmCm && <span>Arm: {ass.girths.rightArmCm}cm</span>}
                            {ass.girths.rightThighCm && <span>Thigh: {ass.girths.rightThighCm}cm</span>}
                            {ass.girths.rightCalfCm && <span>Calf: {ass.girths.rightCalfCm}cm</span>}
                          </div>
                        </div>
                      )}

                      {/* Skill Progressions */}
                      {ass.skillProgressions && ass.skillProgressions.length > 0 && (
                        <div className="p-2.5 bg-[#18181C] rounded-lg space-y-1.5">
                          <span className="text-[10px] font-bold text-emerald-300 uppercase font-mono block">
                            Skill Progressions ({ass.skillProgressions.length}):
                          </span>
                          <div className="space-y-1">
                            {ass.skillProgressions.map((sk, i) => (
                              <div key={i} className="flex justify-between items-center text-[11px] font-mono">
                                <span className="text-white">{sk.skillName} ({sk.level})</span>
                                <span className="text-emerald-400 font-bold">{sk.progressPercentage}% · {sk.benchmarkMetric}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes & Milestone */}
                      {(ass.coachObservations || ass.notes) && (
                        <div className="p-2.5 bg-[#18181C] rounded-lg text-[11px] text-neutral-300 space-y-1">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase font-mono block">Coach Observations:</span>
                          <p>{ass.coachObservations || ass.notes}</p>
                          {ass.targetMilestone && (
                            <p className="text-purple-300 font-semibold pt-1 border-t border-[#26262A]">
                              🎯 {ass.targetMilestone}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
