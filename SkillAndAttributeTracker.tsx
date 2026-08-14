import React, { useState, useMemo } from 'react';
import {
  Award,
  Zap,
  TrendingUp,
  Plus,
  BarChart2,
  CheckCircle2,
  Sliders,
  Target,
  Flame,
  Activity,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ComposedChart,
  Line,
} from 'recharts';

export interface AthleticSkill {
  id: string;
  name: string;
  discipline: 'Calisthenics' | 'Combat Sports' | 'Gymnastics & Rings' | 'Olympic & Weightlifting' | 'Mobility & Control';
  stage: 'Novice' | 'Intermediate' | 'Advanced' | 'Elite';
  masteryScore: number; // 1 - 100
  targetScore: number;
  weeklyHoursPracticed: number;
  drills: string;
  cues: string;
}

export interface AthleticAttribute {
  id: string;
  name: string;
  category: 'Strength' | 'Endurance' | 'Power' | 'Explosive' | 'Speed' | 'Agility' | 'Mobility' | 'Anaerobic';
  score: number; // 1 - 100
  targetScore: number;
  benchmarkTest: string; // e.g., "Weighted Pull-Up +20kg"
  latestValue: string; // e.g., "+20kg (8 Reps)"
  unit: string;
  statusText: string;
}

export interface BenchmarkLog {
  id: string;
  date: string;
  attributeName: string;
  testName: string;
  resultValue: string;
  scoreGained: number;
  notes?: string;
}

export const SkillAndAttributeTracker: React.FC = () => {
  const [activeSubView, setActiveSubView] = useState<'skills' | 'attributes'>('attributes');

  // Discipline Filter for Skills
  const [skillDisciplineFilter, setSkillDisciplineFilter] = useState<string>('ALL');

  // Skills State
  const [skills, setSkills] = useState<AthleticSkill[]>([
    {
      id: 's1',
      name: 'Strict Ring Muscle-Up',
      discipline: 'Calisthenics',
      stage: 'Advanced',
      masteryScore: 88,
      targetScore: 98,
      weeklyHoursPracticed: 3.5,
      drills: 'False grip hangs, strict transition pulls, ring dips with pause',
      cues: 'Drive elbows back at transition, maintain tight hollow body position',
    },
    {
      id: 's2',
      name: 'Boxing Slip & Counter Combinations',
      discipline: 'Combat Sports',
      stage: 'Elite',
      masteryScore: 92,
      targetScore: 98,
      weeklyHoursPracticed: 5.0,
      drills: 'Slip bag drills, double-end bag timing, 6-round mitt work',
      cues: 'Bend at hips not waist, return hands to guard immediately',
    },
    {
      id: 's3',
      name: 'Freestanding Handstand Push-Up',
      discipline: 'Gymnastics & Rings',
      stage: 'Intermediate',
      masteryScore: 74,
      targetScore: 90,
      weeklyHoursPracticed: 2.5,
      drills: 'Wall-facing chest-to-wall HSPU, parallette holds, eccentric negatives',
      cues: 'Gaze between thumbs, grip floor aggressively, hollow spine',
    },
    {
      id: 's4',
      name: 'Clean & Jerk Technique',
      discipline: 'Olympic & Weightlifting',
      stage: 'Intermediate',
      masteryScore: 78,
      targetScore: 88,
      weeklyHoursPracticed: 2.0,
      drills: 'Tall cleans, jerk dip drives, front squat mobility',
      cues: 'Keep bar path tight to chest, drive vertically before split',
    },
    {
      id: 's5',
      name: 'Full Pancake Stretch & Loaded Hip Extension',
      discipline: 'Mobility & Control',
      stage: 'Advanced',
      masteryScore: 85,
      targetScore: 95,
      weeklyHoursPracticed: 3.0,
      drills: 'Jefferson curls, straddle compressions, weighted pancake holds',
      cues: 'Anterior pelvic tilt, fold from hips with flat lower back',
    },
    {
      id: 's6',
      name: 'Takedown Defense & Double Leg Entry',
      discipline: 'Combat Sports',
      stage: 'Advanced',
      masteryScore: 84,
      targetScore: 92,
      weeklyHoursPracticed: 4.0,
      drills: 'Sprawl drills, level change entries, wall wrestling',
      cues: 'Head up, chest high, explosive penetration step with trail leg',
    },
  ]);

  // Athletic Attributes State (8 Core Capabilities)
  const [attributes, setAttributes] = useState<AthleticAttribute[]>([
    {
      id: 'a1',
      name: 'Strength',
      category: 'Strength',
      score: 88,
      targetScore: 95,
      benchmarkTest: 'Weighted Pull-Up & Ring Dips',
      latestValue: '+20 kg (8 Reps)',
      unit: 'kg',
      statusText: 'Elite Upper Body Pull Strength',
    },
    {
      id: 'a2',
      name: 'Endurance',
      category: 'Endurance',
      score: 82,
      targetScore: 90,
      benchmarkTest: '5km Run / Zone 2 Heart Rate',
      latestValue: '21m 15s (142 bpm)',
      unit: 'mins',
      statusText: 'High Aerobic Base Capacity',
    },
    {
      id: 'a3',
      name: 'Power',
      category: 'Power',
      score: 90,
      targetScore: 96,
      benchmarkTest: 'Echo Bike Peak Wattage',
      latestValue: '450 W Avg / 620 W Peak',
      unit: 'Watts',
      statusText: 'Anaerobic Power Output Peak',
    },
    {
      id: 'a4',
      name: 'Explosive Power',
      category: 'Explosive',
      score: 86,
      targetScore: 94,
      benchmarkTest: 'Vertical Jump & Broad Jump',
      latestValue: '72 cm Vertical / 2.85m Broad',
      unit: 'cm',
      statusText: 'High Fast-Twitch Muscle Drive',
    },
    {
      id: 'a5',
      name: 'Speed',
      category: 'Speed',
      score: 84,
      targetScore: 92,
      benchmarkTest: '100m Sprint & Punch Velocity',
      latestValue: '11.4s 100m / 32 km/h Punch',
      unit: 'km/h',
      statusText: 'Rapid Reaction & Velocity',
    },
    {
      id: 'a6',
      name: 'Agility',
      category: 'Agility',
      score: 85,
      targetScore: 92,
      benchmarkTest: 'T-Test Agility & Footwork Ladder',
      latestValue: '9.2s T-Test Time',
      unit: 'sec',
      statusText: 'Sharp Multi-Directional Pivoting',
    },
    {
      id: 'a7',
      name: 'Mobility',
      category: 'Mobility',
      score: 82,
      targetScore: 92,
      benchmarkTest: 'Pancake Stretch & Shoulder CARs',
      latestValue: 'Chest Floor Contact Pancake',
      unit: 'deg',
      statusText: 'High Hip & Shoulder Mobility',
    },
    {
      id: 'a8',
      name: 'Anaerobic Engine',
      category: 'Anaerobic',
      score: 89,
      targetScore: 96,
      benchmarkTest: '500m Row Sprint & Assault Bike',
      latestValue: '1m 24s 500m Row',
      unit: 'sec',
      statusText: 'Lactic Acid Buffer Resilience',
    },
  ]);

  // Benchmark Logs State
  const [benchmarkLogs, setBenchmarkLogs] = useState<BenchmarkLog[]>([
    {
      id: 'b1',
      date: '2026-08-08',
      attributeName: 'Explosive Power',
      testName: 'Vertical Jump Assessment',
      resultValue: '72 cm (+3cm PR)',
      scoreGained: 3,
      notes: 'Depth jump reactive plyometric training paying off',
    },
    {
      id: 'b2',
      date: '2026-08-05',
      attributeName: 'Strength',
      testName: 'Weighted Ring Muscle-Up',
      resultValue: '+10 kg x 3 Reps',
      scoreGained: 2,
      notes: 'Strong false grip stabilization on rings',
    },
    {
      id: 'b3',
      date: '2026-08-02',
      attributeName: 'Speed',
      testName: 'Footwork Slip Counter Velocity',
      resultValue: '32 km/h hand speed',
      scoreGained: 2,
      notes: 'Relaxed shoulders allowed faster whip speed',
    },
  ]);

  // Add Skill Modal State
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillDisc, setNewSkillDisc] = useState<any>('Calisthenics');
  const [newSkillStage, setNewSkillStage] = useState<any>('Intermediate');
  const [newSkillScore, setNewSkillScore] = useState(70);
  const [newSkillHours, setNewSkillHours] = useState(2.0);
  const [newSkillDrills, setNewSkillDrills] = useState('');
  const [newSkillCues, setNewSkillCues] = useState('');

  // Add Benchmark Log Modal State
  const [showAddBenchmarkModal, setShowAddBenchmarkModal] = useState(false);
  const [bmAttr, setBmAttr] = useState('Explosive Power');
  const [bmTest, setBmTest] = useState('Vertical Jump');
  const [bmVal, setBmVal] = useState('74 cm');
  const [bmBoost, setBmBoost] = useState(2);
  const [bmNotes, setBmNotes] = useState('');

  // Compute Skill Practice Hours by Discipline for Chart
  const skillDisciplineData = useMemo(() => {
    const map: { [key: string]: number } = {};
    skills.forEach((s) => {
      map[s.discipline] = (map[s.discipline] || 0) + s.weeklyHoursPracticed;
    });
    return Object.keys(map).map((k) => ({
      discipline: k.split(' ')[0], // short name
      fullName: k,
      hours: map[k],
    }));
  }, [skills]);

  // Radar Chart Data for Attributes
  const radarAttributeData = useMemo(() => {
    return attributes.map((a) => ({
      attribute: a.name,
      Current: a.score,
      Target: a.targetScore,
    }));
  }, [attributes]);

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: AthleticSkill = {
      id: `skill-${Date.now()}`,
      name: newSkillName.trim(),
      discipline: newSkillDisc,
      stage: newSkillStage,
      masteryScore: Number(newSkillScore),
      targetScore: Math.min(100, Number(newSkillScore) + 10),
      weeklyHoursPracticed: Number(newSkillHours),
      drills: newSkillDrills.trim() || 'Custom progression drills',
      cues: newSkillCues.trim() || 'Focus on smooth movement execution',
    };

    setSkills([...skills, newSkill]);
    setShowAddSkillModal(false);
    setNewSkillName('');
    setNewSkillDrills('');
    setNewSkillCues('');
  };

  const handleCreateBenchmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bmTest.trim()) return;

    // Update matching attribute score
    setAttributes((prev) =>
      prev.map((attr) => {
        if (attr.name === bmAttr) {
          return {
            ...attr,
            score: Math.min(100, attr.score + bmBoost),
            latestValue: bmVal,
          };
        }
        return attr;
      })
    );

    const newLog: BenchmarkLog = {
      id: `bm-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      attributeName: bmAttr,
      testName: bmTest,
      resultValue: bmVal,
      scoreGained: bmBoost,
      notes: bmNotes,
    };

    setBenchmarkLogs([newLog, ...benchmarkLogs]);
    setShowAddBenchmarkModal(false);
    setBmTest('');
    setBmNotes('');
  };

  const filteredSkills = useMemo(() => {
    if (skillDisciplineFilter === 'ALL') return skills;
    return skills.filter((s) => s.discipline === skillDisciplineFilter);
  }, [skills, skillDisciplineFilter]);

  return (
    <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 sm:p-5 shadow-xl space-y-5">
      {/* Header & Main SubView Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#26262A] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                Athletic Capabilities & Skills Matrix
              </h2>
              <p className="text-xs text-neutral-400">
                Track Strength, Explosive Power, Speed, Agility & Technical Skill Progress with Statistics
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher: Attributes vs Skills */}
        <div className="flex items-center bg-[#0A0A0B] p-1 rounded-xl border border-[#26262A]">
          <button
            onClick={() => setActiveSubView('attributes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubView === 'attributes'
                ? 'bg-purple-600 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Athletic Capabilities (8 Stats)</span>
          </button>

          <button
            onClick={() => setActiveSubView('skills')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubView === 'skills'
                ? 'bg-purple-600 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Technical Skills ({skills.length})</span>
          </button>
        </div>
      </div>

      {/* SUBVIEW 1: ATHLETIC CAPABILITIES / ATTRIBUTES BY STATISTICS */}
      {activeSubView === 'attributes' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Radar Chart & Capabilities Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Radar Spider Chart Card */}
            <div className="lg:col-span-6 bg-[#0A0A0B] border border-[#26262A] p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-[#26262A] pb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-purple-400" /> Athletic Profile Radar Graph
                </span>
                <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  Avg Level: {Math.round(attributes.reduce((a, b) => a + b.score, 0) / attributes.length)} / 100
                </span>
              </div>

              {/* Recharts Radar Chart */}
              <div className="h-64 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarAttributeData}>
                    <PolarGrid stroke="#26262A" />
                    <PolarAngleAxis dataKey="attribute" stroke="#a855f7" fontSize={10} tick={{ fill: '#d8b4fe', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#44444c" fontSize={8} />
                    <Radar name="Current Capability" dataKey="Current" stroke="#a855f7" fill="#8b5cf6" fillOpacity={0.4} />
                    <Radar name="Target Target" dataKey="Target" stroke="#34d399" fill="#10b981" fillOpacity={0.15} strokeDasharray="3 3" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#161618] border border-[#26262A] p-2.5 rounded-xl shadow-xl text-xs space-y-1">
                              <p className="font-bold text-white border-b border-[#26262A] pb-1">{data.attribute}</p>
                              <p className="text-purple-300">
                                Current Score: <span className="font-bold">{data.Current} / 100</span>
                              </p>
                              <p className="text-emerald-400">
                                Target Score: <span className="font-bold">{data.Target} / 100</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-neutral-400 pt-1 border-t border-[#1C1C20]">
                <span className="flex items-center gap-1.5 text-purple-300">
                  <span className="w-2.5 h-2.5 bg-purple-500 rounded-full inline-block" /> Current Attribute Level
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full inline-block" /> Target Capability Level
                </span>
              </div>
            </div>

            {/* Quick Benchmark Test Action & High-Level Summary Cards */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  8 Core Athletic Capabilities
                </span>

                <button
                  onClick={() => setShowAddBenchmarkModal(true)}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow"
                >
                  <Plus className="w-3.5 h-3.5" /> Record Benchmark Test
                </button>
              </div>

              {/* 8 Attributes Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                {attributes.map((attr) => (
                  <div
                    key={attr.id}
                    className="bg-[#0A0A0B] border border-[#26262A] hover:border-purple-500/50 p-3 rounded-xl space-y-1.5 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        ⚡ {attr.name}
                      </span>
                      <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                        {attr.score} / 100
                      </span>
                    </div>

                    <div className="w-full bg-[#1A1A1E] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: `${attr.score}%` }} />
                    </div>

                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-neutral-400 font-mono truncate">{attr.benchmarkTest}</span>
                      <span className="text-emerald-400 font-bold shrink-0">{attr.latestValue}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Benchmark Log Ledger */}
              <div className="bg-[#0A0A0B] border border-[#26262A] p-3 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Recent Athletic Test Logs
                </span>
                <div className="space-y-1.5 text-xs">
                  {benchmarkLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-[#121215] border border-[#26262A] p-2 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-white block">{log.testName} ({log.attributeName})</span>
                        <span className="text-[10px] text-neutral-400">{log.notes}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-400 block">{log.resultValue}</span>
                        <span className="text-[9px] text-purple-400 font-mono">+{log.scoreGained} Stat Boost</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 2: TECHNICAL SKILLS PLANNING & STATISTICS */}
      {activeSubView === 'skills' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Top Filter & Add Skill Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0A0A0B] p-3 rounded-xl border border-[#26262A]">
            {/* Discipline Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
              <span className="text-[10px] text-neutral-500 font-bold uppercase mr-1">Discipline:</span>
              {[
                'ALL',
                'Calisthenics',
                'Combat Sports',
                'Gymnastics & Rings',
                'Olympic & Weightlifting',
                'Mobility & Control',
              ].map((disc) => (
                <button
                  key={disc}
                  onClick={() => setSkillDisciplineFilter(disc)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap text-[11px] ${
                    skillDisciplineFilter === disc
                      ? 'bg-purple-600 text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-[#161618]'
                  }`}
                >
                  {disc.split(' ')[0]}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddSkillModal(true)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Plan New Skill
            </button>
          </div>

          {/* Skill Practice Statistics BarChart */}
          <div className="bg-[#0A0A0B] border border-[#26262A] p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#26262A] pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-purple-400" /> Weekly Skill Practice Hours by Discipline
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Total Weekly Skill Practice: {skills.reduce((acc, curr) => acc + curr.weeklyHoursPracticed, 0)} Hours
              </span>
            </div>

            <div className="h-44 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillDisciplineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#26262A" vertical={false} />
                  <XAxis dataKey="discipline" stroke="#888888" fontSize={10} tickLine={false} axisLine={{ stroke: '#26262A' }} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={{ stroke: '#26262A' }} unit="h" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#161618] border border-[#26262A] p-2.5 rounded-xl shadow-xl text-xs space-y-1">
                            <p className="font-bold text-white border-b border-[#26262A] pb-1">{data.fullName}</p>
                            <p className="text-purple-300">
                              Practice Time: <span className="font-bold">{data.hours} Hours / Week</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="hours" fill="#a855f7" radius={[6, 6, 0, 0]} maxBarSize={36}>
                    {skillDisciplineData.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={idx % 2 === 0 ? '#a855f7' : '#8b5cf6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skill Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSkills.map((sk) => (
              <div
                key={sk.id}
                className="bg-[#0A0A0B] border border-[#26262A] hover:border-purple-500/40 p-4 rounded-xl space-y-3 transition shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        {sk.discipline}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          sk.stage === 'Elite'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : sk.stage === 'Advanced'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {sk.stage} Stage
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-1.5">{sk.name}</h3>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black font-mono text-purple-400">{sk.masteryScore}</span>
                    <span className="text-[10px] text-neutral-500 block">/ 100 Mastery</span>
                  </div>
                </div>

                {/* Level Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-neutral-400">
                    <span>Skill Mastery Level</span>
                    <span className="text-emerald-400 font-mono">Target: {sk.targetScore}/100</span>
                  </div>
                  <div className="w-full bg-[#1A1A1E] h-2 rounded-full overflow-hidden border border-[#26262A]">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${sk.masteryScore}%` }}
                    />
                  </div>
                </div>

                {/* Drills & Technical Cues */}
                <div className="bg-[#121215] border border-[#26262A] p-2.5 rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-purple-300 block text-[10px]">Target Drills:</span>
                  <p className="text-neutral-300 text-[11px]">{sk.drills}</p>
                  <span className="font-bold text-amber-400 block text-[10px] pt-1">Key Technical Cue:</span>
                  <p className="text-neutral-400 text-[11px] italic">"{sk.cues}"</p>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#1C1C20]">
                  <span className="text-neutral-400">Weekly Practice: <strong className="text-white">{sk.weeklyHoursPracticed} Hours</strong></span>

                  <button
                    onClick={() => {
                      setSkills(
                        skills.map((s) =>
                          s.id === sk.id
                            ? {
                                ...s,
                                masteryScore: Math.min(100, s.masteryScore + 1),
                                weeklyHoursPracticed: Math.round((s.weeklyHoursPracticed + 0.5) * 10) / 10,
                              }
                            : s
                        )
                      );
                    }}
                    className="px-2.5 py-1 bg-[#161618] hover:bg-purple-950/30 text-purple-300 border border-purple-500/30 rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                  >
                    + Log Practice Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: PLAN NEW SKILL */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#26262A] pb-3">
              <h3 className="text-sm font-bold text-white">Plan & Track New Athletic Skill</h3>
              <button onClick={() => setShowAddSkillModal(false)} className="text-neutral-400 hover:text-white text-xs font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Planche Push-Up / Spinning Hook Kick"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Discipline</label>
                  <select
                    value={newSkillDisc}
                    onChange={(e) => setNewSkillDisc(e.target.value as any)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Calisthenics">Calisthenics</option>
                    <option value="Combat Sports">Combat Sports</option>
                    <option value="Gymnastics & Rings">Gymnastics & Rings</option>
                    <option value="Olympic & Weightlifting">Olympic & Weightlifting</option>
                    <option value="Mobility & Control">Mobility & Control</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Current Stage</label>
                  <select
                    value={newSkillStage}
                    onChange={(e) => setNewSkillStage(e.target.value as any)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Novice">Novice</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Elite">Elite</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Progression Drills</label>
                <input
                  type="text"
                  placeholder="e.g., Band assisted holds, eccentric negatives"
                  value={newSkillDrills}
                  onChange={(e) => setNewSkillDrills(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Technical Cues</label>
                <input
                  type="text"
                  placeholder="e.g., Protracted scapula, depress shoulders"
                  value={newSkillCues}
                  onChange={(e) => setNewSkillCues(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(false)}
                  className="px-3 py-2 bg-[#0A0A0B] border border-[#26262A] text-neutral-400 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow">
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD BENCHMARK TEST */}
      {showAddBenchmarkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#26262A] pb-3">
              <h3 className="text-sm font-bold text-white">Record Athletic Benchmark Assessment</h3>
              <button onClick={() => setShowAddBenchmarkModal(false)} className="text-neutral-400 hover:text-white text-xs font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBenchmark} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Target Athletic Capability</label>
                <select
                  value={bmAttr}
                  onChange={(e) => setBmAttr(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-purple-500"
                >
                  {attributes.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name} (Current Level: {a.score})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Test / Metric Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Vertical Jump Test / 100m Sprint"
                  value={bmTest}
                  onChange={(e) => setBmTest(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Test Result Value</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 75 cm / 11.2s"
                    value={bmVal}
                    onChange={(e) => setBmVal(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Stat Boost (+ Points)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bmBoost}
                    onChange={(e) => setBmBoost(Number(e.target.value))}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-purple-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Notes / Performance Highlights</label>
                <input
                  type="text"
                  placeholder="e.g., New PR set during afternoon session"
                  value={bmNotes}
                  onChange={(e) => setBmNotes(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBenchmarkModal(false)}
                  className="px-3 py-2 bg-[#0A0A0B] border border-[#26262A] text-neutral-400 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow">
                  Save Assessment & Update Stat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
