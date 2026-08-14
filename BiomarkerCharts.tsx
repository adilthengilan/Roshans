import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from 'recharts';
import {
  Scale,
  Activity,
  Moon,
  Heart,
  TrendingDown,
  TrendingUp,
  Calendar,
  Zap,
  BarChart2,
  CheckCircle2,
  ArrowDownRight,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { BodyEntry, RecoveryEntry } from '../types';

interface Props {
  bodyEntries: BodyEntry[];
  recoveryEntries: RecoveryEntry[];
  onOpenAddModal?: () => void;
}

type Timeframe = 'Days' | 'Weeks' | 'Months' | 'Years';
type ActiveMetric = 'ALL' | 'WEIGHT' | 'BODY_FAT' | 'SLEEP' | 'HEART_RATE';

interface BiomarkerDataPoint {
  label: string;
  date: string;
  period: string;
  weight: number;
  bodyFat: number;
  sleep: number;
  hr: number;
  hrv: number;
}

export const BiomarkerCharts: React.FC<Props> = ({
  bodyEntries,
  recoveryEntries,
  onOpenAddModal,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('Days');
  const [activeMetric, setActiveMetric] = useState<ActiveMetric>('ALL');

  // --- 1. DATASETS FOR DAYS, WEEKS, MONTHS, YEARS ---

  // Daily Data (Last 14 Days)
  const daysData: BiomarkerDataPoint[] = [
    { label: 'Jul 27', date: '2026-07-27', period: 'Jul 27, 2026', weight: 82.8, bodyFat: 10.8, sleep: 7.0, hr: 54, hrv: 74 },
    { label: 'Jul 28', date: '2026-07-28', period: 'Jul 28, 2026', weight: 82.6, bodyFat: 10.7, sleep: 7.2, hr: 53, hrv: 76 },
    { label: 'Jul 29', date: '2026-07-29', period: 'Jul 29, 2026', weight: 82.5, bodyFat: 10.6, sleep: 6.8, hr: 55, hrv: 72 },
    { label: 'Jul 30', date: '2026-07-30', period: 'Jul 30, 2026', weight: 82.3, bodyFat: 10.5, sleep: 7.5, hr: 51, hrv: 80 },
    { label: 'Jul 31', date: '2026-07-31', period: 'Jul 31, 2026', weight: 82.2, bodyFat: 10.4, sleep: 7.6, hr: 50, hrv: 82 },
    { label: 'Aug 01', date: '2026-08-01', period: 'Aug 01, 2026', weight: 82.1, bodyFat: 10.3, sleep: 7.4, hr: 50, hrv: 83 },
    { label: 'Aug 02', date: '2026-08-02', period: 'Aug 02, 2026', weight: 82.0, bodyFat: 10.2, sleep: 7.5, hr: 49, hrv: 85 },
    { label: 'Aug 03', date: '2026-08-03', period: 'Aug 03, 2026', weight: 81.9, bodyFat: 10.2, sleep: 7.3, hr: 50, hrv: 84 },
    { label: 'Aug 04', date: '2026-08-04', period: 'Aug 04, 2026', weight: 81.8, bodyFat: 10.1, sleep: 7.8, hr: 48, hrv: 88 },
    { label: 'Aug 05', date: '2026-08-05', period: 'Aug 05, 2026', weight: 81.7, bodyFat: 10.0, sleep: 7.6, hr: 49, hrv: 86 },
    { label: 'Aug 06', date: '2026-08-06', period: 'Aug 06, 2026', weight: 81.5, bodyFat: 10.0, sleep: 8.0, hr: 47, hrv: 90 },
    { label: 'Aug 07', date: '2026-08-07', period: 'Aug 07, 2026', weight: 81.6, bodyFat: 10.0, sleep: 8.2, hr: 46, hrv: 92 },
    { label: 'Aug 08', date: '2026-08-08', period: 'Aug 08, 2026', weight: 81.4, bodyFat: 9.9, sleep: 6.5, hr: 52, hrv: 72 },
    { label: 'Aug 09', date: '2026-08-09', period: 'Aug 09, 2026', weight: 81.2, bodyFat: 9.8, sleep: 7.8, hr: 48, hrv: 88 },
  ];

  // Weekly Data (Last 12 Weeks)
  const weeksData: BiomarkerDataPoint[] = [
    { label: 'Wk 21', date: '2026-05-18', period: 'May 18-24, 2026', weight: 84.5, bodyFat: 12.2, sleep: 6.6, hr: 56, hrv: 68 },
    { label: 'Wk 22', date: '2026-05-25', period: 'May 25-31, 2026', weight: 84.2, bodyFat: 12.0, sleep: 6.8, hr: 55, hrv: 70 },
    { label: 'Wk 23', date: '2026-06-01', period: 'Jun 01-07, 2026', weight: 83.9, bodyFat: 11.8, sleep: 7.0, hr: 54, hrv: 72 },
    { label: 'Wk 24', date: '2026-06-08', period: 'Jun 08-14, 2026', weight: 83.6, bodyFat: 11.5, sleep: 7.1, hr: 53, hrv: 75 },
    { label: 'Wk 25', date: '2026-06-15', period: 'Jun 15-21, 2026', weight: 83.4, bodyFat: 11.3, sleep: 7.2, hr: 52, hrv: 76 },
    { label: 'Wk 26', date: '2026-06-22', period: 'Jun 22-28, 2026', weight: 83.1, bodyFat: 11.1, sleep: 7.3, hr: 51, hrv: 78 },
    { label: 'Wk 27', date: '2026-06-29', period: 'Jun 29-Jul 05', weight: 82.9, bodyFat: 11.0, sleep: 7.4, hr: 51, hrv: 80 },
    { label: 'Wk 28', date: '2026-07-06', period: 'Jul 06-12, 2026', weight: 82.7, bodyFat: 10.8, sleep: 7.5, hr: 50, hrv: 81 },
    { label: 'Wk 29', date: '2026-07-13', period: 'Jul 13-19, 2026', weight: 82.4, bodyFat: 10.6, sleep: 7.4, hr: 50, hrv: 82 },
    { label: 'Wk 30', date: '2026-07-20', period: 'Jul 20-26, 2026', weight: 82.1, bodyFat: 10.4, sleep: 7.6, hr: 49, hrv: 84 },
    { label: 'Wk 31', date: '2026-07-27', period: 'Jul 27-Aug 02', weight: 81.8, bodyFat: 10.1, sleep: 7.7, hr: 48, hrv: 86 },
    { label: 'Wk 32', date: '2026-08-03', period: 'Aug 03-09, 2026', weight: 81.2, bodyFat: 9.8, sleep: 7.8, hr: 48, hrv: 88 },
  ];

  // Monthly Data (Last 12 Months)
  const monthsData: BiomarkerDataPoint[] = [
    { label: 'Sep 25', date: '2025-09-01', period: 'Sep 2025', weight: 86.2, bodyFat: 14.5, sleep: 6.2, hr: 58, hrv: 62 },
    { label: 'Oct 25', date: '2025-10-01', period: 'Oct 2025', weight: 85.8, bodyFat: 14.0, sleep: 6.4, hr: 57, hrv: 64 },
    { label: 'Nov 25', date: '2025-11-01', period: 'Nov 2025', weight: 85.3, bodyFat: 13.5, sleep: 6.5, hr: 56, hrv: 66 },
    { label: 'Dec 25', date: '2025-12-01', period: 'Dec 2025', weight: 85.0, bodyFat: 13.1, sleep: 6.6, hr: 58, hrv: 68 },
    { label: 'Jan 26', date: '2026-01-01', period: 'Jan 2026', weight: 84.6, bodyFat: 12.6, sleep: 6.8, hr: 54, hrv: 70 },
    { label: 'Feb 26', date: '2026-02-01', period: 'Feb 2026', weight: 84.1, bodyFat: 12.2, sleep: 7.0, hr: 53, hrv: 73 },
    { label: 'Mar 26', date: '2026-03-01', period: 'Mar 2026', weight: 83.7, bodyFat: 11.8, sleep: 7.1, hr: 52, hrv: 75 },
    { label: 'Apr 26', date: '2026-04-01', period: 'Apr 2026', weight: 83.2, bodyFat: 11.3, sleep: 7.3, hr: 51, hrv: 78 },
    { label: 'May 26', date: '2026-05-01', period: 'May 2026', weight: 82.8, bodyFat: 10.9, sleep: 7.4, hr: 50, hrv: 80 },
    { label: 'Jun 26', date: '2026-06-01', period: 'Jun 2026', weight: 82.2, bodyFat: 10.4, sleep: 7.5, hr: 49, hrv: 83 },
    { label: 'Jul 26', date: '2026-07-01', period: 'Jul 2026', weight: 81.7, bodyFat: 10.0, sleep: 7.6, hr: 48, hrv: 86 },
    { label: 'Aug 26', date: '2026-08-01', period: 'Aug 2026', weight: 81.2, bodyFat: 9.8, sleep: 7.8, hr: 48, hrv: 88 },
  ];

  // Yearly Data (Past 4 Years)
  const yearsData: BiomarkerDataPoint[] = [
    { label: '2023', date: '2023-01-01', period: 'Year 2023', weight: 89.5, bodyFat: 17.2, sleep: 5.8, hr: 62, hrv: 54 },
    { label: '2024', date: '2024-01-01', period: 'Year 2024', weight: 87.0, bodyFat: 15.0, sleep: 6.3, hr: 58, hrv: 62 },
    { label: '2025', date: '2025-01-01', period: 'Year 2025', weight: 84.8, bodyFat: 12.8, sleep: 6.8, hr: 53, hrv: 72 },
    { label: '2026 (Now)', date: '2026-01-01', period: 'Year 2026', weight: 81.2, bodyFat: 9.8, sleep: 7.8, hr: 48, hrv: 88 },
  ];

  // Pick dataset based on timeframe selector
  const activeDataset =
    timeframe === 'Days'
      ? daysData
      : timeframe === 'Weeks'
      ? weeksData
      : timeframe === 'Months'
      ? monthsData
      : yearsData;

  const firstEntry = activeDataset[0];
  const lastEntry = activeDataset[activeDataset.length - 1];

  // Calculations for Summary Progress
  const weightChange = (lastEntry.weight - firstEntry.weight).toFixed(1);
  const fatChange = (lastEntry.bodyFat - firstEntry.bodyFat).toFixed(1);
  const sleepChange = (lastEntry.sleep - firstEntry.sleep).toFixed(1);
  const hrChange = lastEntry.hr - firstEntry.hr;

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#121214] border border-[#26262A] rounded-xl p-3 shadow-2xl text-xs space-y-1.5 min-w-[160px]">
          <div className="font-bold text-white border-b border-[#26262A] pb-1 flex items-center justify-between">
            <span>{data.label}</span>
            <span className="text-[10px] text-neutral-400 font-normal">{data.period || data.date || ''}</span>
          </div>

          <div className="space-y-1 pt-0.5">
            <div className="flex justify-between items-center text-emerald-400">
              <span className="text-neutral-400">Body Weight:</span>
              <span className="font-mono font-bold">{data.weight} kg</span>
            </div>

            <div className="flex justify-between items-center text-[#FF5A1F]">
              <span className="text-neutral-400">Body Fat:</span>
              <span className="font-mono font-bold">{data.bodyFat} %</span>
            </div>

            <div className="flex justify-between items-center text-blue-400">
              <span className="text-neutral-400">Sleep:</span>
              <span className="font-mono font-bold">{data.sleep} hrs</span>
            </div>

            <div className="flex justify-between items-center text-purple-400">
              <span className="text-neutral-400">Resting HR:</span>
              <span className="font-mono font-bold">{data.hr} bpm</span>
            </div>

            {data.hrv && (
              <div className="flex justify-between items-center text-amber-400">
                <span className="text-neutral-400">HRV Score:</span>
                <span className="font-mono font-bold">{data.hrv} ms</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Timeframe Selector Header */}
      <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Interactive Progress Analytics Engine
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold font-mono">
              PREVIOUS TO CURRENT
            </span>
          </div>
          <p className="text-xs text-neutral-300 mt-0.5 font-medium">
            Comparing baseline initial records vs active peak athletic parameters
          </p>
        </div>

        {/* Timeframe Pills (Days, Weeks, Months, Years) */}
        <div className="flex items-center gap-1 bg-[#0A0A0B] p-1 rounded-xl border border-[#26262A]">
          {(['Days', 'Weeks', 'Months', 'Years'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                timeframe === tf
                  ? 'bg-[#FF5A1F] text-white shadow-md shadow-[#FF5A1F]/20'
                  : 'text-neutral-400 hover:text-white hover:bg-[#161618]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Focus Filter Pills */}
      <div className="flex items-center gap-1.5 bg-[#161618] p-1.5 rounded-xl border border-[#26262A] overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => setActiveMetric('ALL')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
            activeMetric === 'ALL'
              ? 'bg-[#FF5A1F] text-white'
              : 'text-neutral-400 hover:text-white hover:bg-[#0A0A0B]'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Master Overview (All 4)</span>
        </button>

        <button
          onClick={() => setActiveMetric('WEIGHT')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
            activeMetric === 'WEIGHT'
              ? 'bg-emerald-600 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-[#0A0A0B]'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-emerald-400" />
          <span>Body Weight ({lastEntry.weight} kg)</span>
        </button>

        <button
          onClick={() => setActiveMetric('BODY_FAT')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
            activeMetric === 'BODY_FAT'
              ? 'bg-amber-600 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-[#0A0A0B]'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span>Body Fat ({lastEntry.bodyFat} %)</span>
        </button>

        <button
          onClick={() => setActiveMetric('SLEEP')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
            activeMetric === 'SLEEP'
              ? 'bg-blue-600 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-[#0A0A0B]'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-blue-400" />
          <span>Sleep Duration ({lastEntry.sleep} hrs)</span>
        </button>

        <button
          onClick={() => setActiveMetric('HEART_RATE')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
            activeMetric === 'HEART_RATE'
              ? 'bg-purple-600 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-[#0A0A0B]'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-purple-400" />
          <span>Resting Heart Rate ({lastEntry.hr} bpm)</span>
        </button>
      </div>

      {/* Comparison Summary Banner Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Weight Card */}
        <div className="bg-[#161618] border border-[#26262A] p-3.5 rounded-2xl shadow-lg space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Body Weight</span>
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-white tabular-nums">{lastEntry.weight}</span>
            <span className="text-xs text-neutral-400 font-bold">kg</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>{weightChange} kg ({timeframe})</span>
          </div>
          <p className="text-[10px] text-neutral-500 font-mono">Previous: {firstEntry.weight} kg</p>
        </div>

        {/* Body Fat Card */}
        <div className="bg-[#161618] border border-[#26262A] p-3.5 rounded-2xl shadow-lg space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Body Fat %</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-white tabular-nums">{lastEntry.bodyFat}</span>
            <span className="text-xs text-neutral-400 font-bold">%</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>{fatChange}% ({timeframe})</span>
          </div>
          <p className="text-[10px] text-neutral-500 font-mono">Previous: {firstEntry.bodyFat}%</p>
        </div>

        {/* Sleep Duration Card */}
        <div className="bg-[#161618] border border-[#26262A] p-3.5 rounded-2xl shadow-lg space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Sleep Duration</span>
            <Moon className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-white tabular-nums">{lastEntry.sleep}</span>
            <span className="text-xs text-neutral-400 font-bold">hrs</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-blue-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{sleepChange} hrs ({timeframe})</span>
          </div>
          <p className="text-[10px] text-neutral-500 font-mono">Previous: {firstEntry.sleep} hrs</p>
        </div>

        {/* Resting Heart Rate Card */}
        <div className="bg-[#161618] border border-[#26262A] p-3.5 rounded-2xl shadow-lg space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Resting HR</span>
            <Heart className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-white tabular-nums">{lastEntry.hr}</span>
            <span className="text-xs text-neutral-400 font-bold">bpm</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-purple-400">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>{hrChange} bpm ({timeframe})</span>
          </div>
          <p className="text-[10px] text-neutral-500 font-mono">Previous: {firstEntry.hr} bpm</p>
        </div>
      </div>

      {/* --- MASTER OVERVIEW OR INDIVIDUAL HIGH RESOLUTION GRAPH --- */}

      {/* GRAPH 1: BODY WEIGHT GRAPH */}
      {(activeMetric === 'ALL' || activeMetric === 'WEIGHT') && (
        <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Body Weight Curve ({timeframe} View)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-neutral-400">Start: <strong className="text-white">{firstEntry.weight}kg</strong></span>
              <span className="text-neutral-400">Current: <strong className="text-emerald-400">{lastEntry.weight}kg</strong></span>
              <span className="text-neutral-400">Target: <strong className="text-blue-400">80.0kg</strong></span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeDataset} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#26262A" vertical={false} />
                <XAxis dataKey="label" stroke="#737373" fontSize={11} tickLine={false} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#737373" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={80.0} stroke="#3B82F6" strokeDasharray="4 4" label={{ value: 'Target: 80.0 kg', fill: '#3B82F6', fontSize: 10 }} />
                <Area type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" dot={{ fill: '#10B981', r: 4 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* GRAPH 2: BODY FAT PERCENTAGE GRAPH */}
      {(activeMetric === 'ALL' || activeMetric === 'BODY_FAT') && (
        <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FF5A1F]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Body Fat % Progression ({timeframe} View)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-neutral-400">Start: <strong className="text-white">{firstEntry.bodyFat}%</strong></span>
              <span className="text-neutral-400">Current: <strong className="text-[#FF5A1F]">{lastEntry.bodyFat}%</strong></span>
              <span className="text-neutral-400">Target: <strong className="text-amber-400">9.0%</strong></span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeDataset} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5A1F" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF5A1F" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#26262A" vertical={false} />
                <XAxis dataKey="label" stroke="#737373" fontSize={11} tickLine={false} />
                <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} stroke="#737373" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={9.0} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'Athletic Peak: 9.0%', fill: '#F59E0B', fontSize: 10 }} />
                <Area type="monotone" dataKey="bodyFat" stroke="#FF5A1F" strokeWidth={3} fillOpacity={1} fill="url(#colorFat)" dot={{ fill: '#FF5A1F', r: 4 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* GRAPH 3: SLEEP DURATION GRAPH */}
      {(activeMetric === 'ALL' || activeMetric === 'SLEEP') && (
        <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Sleep Duration & Recovery Quality ({timeframe} View)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-neutral-400">Start: <strong className="text-white">{firstEntry.sleep} hrs</strong></span>
              <span className="text-neutral-400">Current: <strong className="text-blue-400">{lastEntry.sleep} hrs</strong></span>
              <span className="text-neutral-400">Goal: <strong className="text-emerald-400">8.0 hrs</strong></span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeDataset} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#26262A" vertical={false} />
                <XAxis dataKey="label" stroke="#737373" fontSize={11} tickLine={false} />
                <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} stroke="#737373" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={8.0} stroke="#10B981" strokeDasharray="4 4" label={{ value: 'Optimal Sleep: 8.0 hrs', fill: '#10B981', fontSize: 10 }} />
                <Area type="monotone" dataKey="sleep" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorSleep)" dot={{ fill: '#3B82F6', r: 4 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* GRAPH 4: RESTING HEART RATE & HRV GRAPH */}
      {(activeMetric === 'ALL' || activeMetric === 'HEART_RATE') && (
        <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Resting Heart Rate & HRV Score ({timeframe} View)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-neutral-400">Start: <strong className="text-white">{firstEntry.hr} bpm</strong></span>
              <span className="text-neutral-400">Current: <strong className="text-purple-400">{lastEntry.hr} bpm</strong></span>
              <span className="text-neutral-400">Goal: <strong className="text-emerald-400">45 bpm</strong></span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeDataset} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#26262A" vertical={false} />
                <XAxis dataKey="label" stroke="#737373" fontSize={11} tickLine={false} />
                <YAxis yAxisId="hr" domain={['dataMin - 2', 'dataMax + 2']} stroke="#C084FC" fontSize={11} tickLine={false} />
                <YAxis yAxisId="hrv" orientation="right" domain={['dataMin - 5', 'dataMax + 5']} stroke="#F59E0B" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine yAxisId="hr" y={45} stroke="#10B981" strokeDasharray="4 4" label={{ value: 'Elite Baseline: 45 bpm', fill: '#10B981', fontSize: 10 }} />
                <Line yAxisId="hr" type="monotone" dataKey="hr" name="Resting HR (bpm)" stroke="#A855F7" strokeWidth={3} dot={{ fill: '#A855F7', r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="hrv" type="monotone" dataKey="hrv" name="HRV (ms)" stroke="#F59E0B" strokeWidth={2} strokeDasharray="3 3" dot={{ fill: '#F59E0B', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
