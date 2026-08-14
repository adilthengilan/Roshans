import React, { useState } from 'react';
import { usePrimeStore } from '../lib/store';
import { TrainingType } from '../types';
import { X, CheckSquare, Dumbbell, DollarSign, BookOpen, PenTool, Calendar, Plus, Flame } from 'lucide-react';

export type QuickActionType = 'Task' | 'Workout' | 'Expense' | 'Knowledge' | 'Journal' | 'Event' | null;

interface Props {
  activeType: QuickActionType;
  onClose: () => void;
}

export const QuickActionModal: React.FC<Props> = ({ activeType, onClose }) => {
  const {
    addTask,
    addTrainingSession,
    addTransaction,
    addKnowledgeItem,
    addJournalEntry,
    setPlannerEvents,
  } = usePrimeStore();

  const [tab, setTab] = useState<NonNullable<QuickActionType>>(activeType || 'Task');

  // Task state
  const [taskName, setTaskName] = useState('');
  const [taskStatus, setTaskStatus] = useState<'Must Do' | 'Important' | 'Growth'>('Must Do');
  const [taskCategory, setTaskCategory] = useState('Training');

  // Workout state
  const [workoutType, setWorkoutType] = useState<TrainingType>('Calisthenics');
  const [workoutSlot, setWorkoutSlot] = useState<'Morning' | 'Evening' | 'Single'>('Morning');
  const [workoutGoal, setWorkoutGoal] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState(60);
  const [workoutRpe, setWorkoutRpe] = useState(8);
  const [workoutIntensity, setWorkoutIntensity] = useState(8);
  const [workoutPr, setWorkoutPr] = useState(false);
  const [workoutNotes, setWorkoutNotes] = useState('');

  // Expense/Income state
  const [txName, setTxName] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<'Expense' | 'Income'>('Expense');
  const [txCategory, setTxCategory] = useState<'Coaching' | 'Brand' | 'Living' | 'Gear' | 'Travel' | 'Health' | 'Education' | 'Other'>('Living');
  const [txNeed, setTxNeed] = useState<'Need' | 'Want'>('Need');

  // Knowledge state
  const [kTitle, setKTitle] = useState('');
  const [kType, setKType] = useState<'Book' | 'Research' | 'Course' | 'Article'>('Research');
  const [kSource, setKSource] = useState('');
  const [kLearning, setKLearning] = useState('');

  // Journal state
  const [jType, setJType] = useState<'Morning' | 'Night' | 'General' | 'Weekly'>('Night');
  const [jAccomplished, setJAccomplished] = useState('');
  const [jDifficult, setJDifficult] = useState('');
  const [jLearned, setJLearned] = useState('');
  const [jReflection, setJReflection] = useState('');

  // Event state
  const [eTitle, setETitle] = useState('');
  const [eTime, setETime] = useState('09:00 AM');
  const [eCategory, setECategory] = useState<'Training' | 'Client Session' | 'Business' | 'Personal' | 'Rest'>('Client Session');

  if (!activeType) return null;

  const todayStr = '2026-08-09';

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;
    addTask({
      name: taskName.trim(),
      status: taskStatus,
      completed: false,
      category: taskCategory,
      dueDate: todayStr,
      reminder: true,
    });
    onClose();
  };

  const handleSaveWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    addTrainingSession({
      date: todayStr,
      slot: workoutSlot,
      type: workoutType,
      goal: workoutGoal.trim() || `${workoutType} Session`,
      intensity: Number(workoutIntensity),
      sets: 12,
      reps: 100,
      rpe: Number(workoutRpe),
      duration: Number(workoutDuration),
      prFlag: workoutPr,
      exercises: [
        { name: `${workoutType} Main Working Sets`, sets: 4, reps: '10', completed: true },
        { name: 'Accessory / Core Drills', sets: 3, reps: '12', completed: true },
      ],
      performanceNotes: workoutNotes.trim() || 'Session completed with optimal form and intensity.',
      nextImprovement: 'Progress volume by 5% next session.',
    });
    onClose();
  };

  const handleSaveTx = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(txAmount);
    if (!txName.trim() || isNaN(val) || val <= 0) return;
    addTransaction({
      name: txName.trim(),
      amount: val,
      type: txType,
      category: txCategory,
      date: todayStr,
      needOrWant: txNeed,
    });
    onClose();
  };

  const handleSaveKnowledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kTitle.trim()) return;
    addKnowledgeItem({
      title: kTitle.trim(),
      type: kType,
      source: kSource.trim() || 'Muhammed Research Notes',
      status: 'Active',
      progress: 25,
      keyLearning: kLearning.trim(),
    });
    onClose();
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    addJournalEntry({
      date: todayStr,
      type: jType,
      accomplished: jAccomplished.trim(),
      difficult: jDifficult.trim(),
      learned: jLearned.trim(),
      reflection: jReflection.trim() || 'Executed with focus and clarity.',
    });
    onClose();
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eTitle.trim()) return;
    // update planner directly in store
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#161618] border border-[#26262A] rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#26262A] bg-[#0A0A0B]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
            <h3 className="font-semibold text-white text-base tracking-tight">One-Tap Quick Logger</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Type Selector Bar */}
        <div className="flex overflow-x-auto gap-1 p-2 bg-[#121214] border-b border-[#26262A] no-scrollbar">
          <button
            onClick={() => setTab('Task')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              tab === 'Task' ? 'bg-[#FF5A1F] text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200 bg-[#1A1A1E]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" /> Task
          </button>
          <button
            onClick={() => setTab('Workout')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              tab === 'Workout' ? 'bg-[#FF5A1F] text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200 bg-[#1A1A1E]'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" /> Workout
          </button>
          <button
            onClick={() => setTab('Expense')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              tab === 'Expense' ? 'bg-[#FF5A1F] text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200 bg-[#1A1A1E]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" /> Money
          </button>
          <button
            onClick={() => setTab('Knowledge')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              tab === 'Knowledge' ? 'bg-[#FF5A1F] text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200 bg-[#1A1A1E]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Knowledge
          </button>
          <button
            onClick={() => setTab('Journal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              tab === 'Journal' ? 'bg-[#FF5A1F] text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200 bg-[#1A1A1E]'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" /> Journal
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {tab === 'Task' && (
            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Review KATBA Athletic Samples"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
                  autoFocus
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Priority Tier</label>
                  <select
                    value={taskStatus}
                    onChange={(e: any) => setTaskStatus(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  >
                    <option value="Must Do">Must Do (Critical)</option>
                    <option value="Important">Important (Core)</option>
                    <option value="Growth">Growth (Long-term)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Category</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  >
                    <option value="Training">Training</option>
                    <option value="Business">Business</option>
                    <option value="Coaching">Coaching</option>
                    <option value="Personal">Personal</option>
                    <option value="Learning">Learning</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF5A1F] hover:bg-[#E04D18] text-white font-medium rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/20 mt-2"
              >
                <Plus className="w-4 h-4" /> Save Task
              </button>
            </form>
          )}

          {tab === 'Workout' && (
            <form onSubmit={handleSaveWorkout} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Discipline / Type</label>
                  <select
                    value={workoutType}
                    onChange={(e: any) => setWorkoutType(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  >
                    <option value="Calisthenics">Calisthenics</option>
                    <option value="Boxing">Boxing</option>
                    <option value="Kickboxing">Kickboxing</option>
                    <option value="CrossFit">CrossFit</option>
                    <option value="Wrestling">Wrestling</option>
                    <option value="Acrobatics">Acrobatics</option>
                    <option value="Weapon Skills">Weapon Skills</option>
                    <option value="Running">Running</option>
                    <option value="Strength">Strength</option>
                    <option value="Mobility">Mobility</option>
                    <option value="Recovery">Recovery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Session Slot</label>
                  <select
                    value={workoutSlot}
                    onChange={(e: any) => setWorkoutSlot(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  >
                    <option value="Morning">Morning Slot</option>
                    <option value="Evening">Evening Slot</option>
                    <option value="Single">Single Session</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Session Primary Goal</label>
                <input
                  type="text"
                  placeholder="e.g. Weighted dips + Ring Muscle-up max velocity"
                  value={workoutGoal}
                  onChange={(e) => setWorkoutGoal(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(Number(e.target.value))}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">RPE (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={workoutRpe}
                    onChange={(e) => setWorkoutRpe(Number(e.target.value))}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Intensity</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={workoutIntensity}
                    onChange={(e) => setWorkoutIntensity(Number(e.target.value))}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl">
                <input
                  type="checkbox"
                  id="prFlag"
                  checked={workoutPr}
                  onChange={(e) => setWorkoutPr(e.target.checked)}
                  className="accent-[#FF5A1F] w-4 h-4 rounded"
                />
                <label htmlFor="prFlag" className="text-xs text-white font-medium flex items-center gap-1 cursor-pointer">
                  <Flame className="w-3.5 h-3.5 text-[#FF5A1F]" /> Flag as Personal Record (PR)
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Performance Notes</label>
                <textarea
                  rows={2}
                  placeholder="Form feedback, tempo, feel..."
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF5A1F] hover:bg-[#E04D18] text-white font-medium rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/20"
              >
                <Dumbbell className="w-4 h-4" /> Save Workout Session
              </button>
            </form>
          )}

          {tab === 'Expense' && (
            <form onSubmit={handleSaveTx} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Transaction Type</label>
                  <select
                    value={txType}
                    onChange={(e: any) => setTxType(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  >
                    <option value="Expense">Expense (- AED)</option>
                    <option value="Income">Income (+ AED)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Amount (AED)</label>
                  <input
                    type="number"
                    placeholder="e.g. 12500"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Description / Client / Vendor</label>
                <input
                  type="text"
                  placeholder="e.g. 1:1 Coaching Retainer - Client Rashid"
                  value={txName}
                  onChange={(e) => setTxName(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Category</label>
                  <select
                    value={txCategory}
                    onChange={(e: any) => setTxCategory(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  >
                    <option value="Coaching">Coaching</option>
                    <option value="Brand">Brand / Business</option>
                    <option value="Living">Living / Organic Food</option>
                    <option value="Gear">Training Gear</option>
                    <option value="Travel">Travel</option>
                    <option value="Health">Health & Facility</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Need vs Want</label>
                  <select
                    value={txNeed}
                    onChange={(e: any) => setTxNeed(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  >
                    <option value="Need">Essential Need</option>
                    <option value="Want">Discretionary Want</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF5A1F] hover:bg-[#E04D18] text-white font-medium rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/20"
              >
                <DollarSign className="w-4 h-4" /> Log Transaction
              </button>
            </form>
          )}

          {tab === 'Knowledge' && (
            <form onSubmit={handleSaveKnowledge} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Resource Title</label>
                <input
                  type="text"
                  placeholder="e.g. Neuromuscular Adaptations in Explosive Martial Athletes"
                  value={kTitle}
                  onChange={(e) => setKTitle(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Format / Type</label>
                  <select
                    value={kType}
                    onChange={(e: any) => setKType(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  >
                    <option value="Research">Research Paper</option>
                    <option value="Book">Book</option>
                    <option value="Course">Course</option>
                    <option value="Article">Article</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Author / Source</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Brad Schoenfeld"
                    value={kSource}
                    onChange={(e) => setKSource(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Key Insight / Learning</label>
                <textarea
                  rows={2}
                  placeholder="Key take-away to apply in coaching or personal training..."
                  value={kLearning}
                  onChange={(e) => setKLearning(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF5A1F] hover:bg-[#E04D18] text-white font-medium rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/20"
              >
                <BookOpen className="w-4 h-4" /> Save Knowledge Resource
              </button>
            </form>
          )}

          {tab === 'Journal' && (
            <form onSubmit={handleSaveJournal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Journal Type</label>
                <select
                  value={jType}
                  onChange={(e: any) => setJType(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                >
                  <option value="Night">Night Shutdown Protocol</option>
                  <option value="Morning">Morning Intentions</option>
                  <option value="General">General Reflection</option>
                  <option value="Weekly">Weekly Macro Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">What was accomplished today?</label>
                <input
                  type="text"
                  placeholder="Main wins..."
                  value={jAccomplished}
                  onChange={(e) => setJAccomplished(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">What was challenging?</label>
                <input
                  type="text"
                  placeholder="Friction points..."
                  value={jDifficult}
                  onChange={(e) => setJDifficult(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Key Reflection & Gratitude</label>
                <textarea
                  rows={2}
                  placeholder="Deep reflection..."
                  value={jReflection}
                  onChange={(e) => setJReflection(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF5A1F] hover:bg-[#E04D18] text-white font-medium rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/20"
              >
                <PenTool className="w-4 h-4" /> Save Journal Entry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
