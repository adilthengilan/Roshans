import React, { useState, useEffect } from 'react';
import { usePrimeStore } from '../../lib/store';
import { BatchMemberStatus, BatchTrainingGroup } from '../../types';
import { TrainerizeSessionPlanner } from './TrainerizeSessionPlanner';
import coachDanishImg from '../../assets/images/coach_danish_portrait_1786654260335.jpg';
import coachRoshanImg from '../../assets/images/coach_roshan_portrait_1786654271869.jpg';
import coachMuqeethImg from '../../assets/images/coach_muqeeth_portrait_1786654282250.jpg';
import facilityGymImg from '../../assets/images/luxury_athletic_facility_1786654293401.jpg';
import {
  Users,
  Calendar,
  AlertCircle,
  Plus,
  Search,
  CheckCircle2,
  X,
  Clock,
  Dumbbell,
  Apple,
  Activity,
  ArrowRightLeft,
  FileCheck,
  ShieldAlert,
  ChevronRight,
  UserCheck,
  Sparkles,
  Flame,
  MapPin,
  Layers,
  Zap,
  Check,
  Filter,
  Play,
  Pause,
  UserX,
  FileText,
  Trash2,
} from 'lucide-react';

export const isClientAssignedToCoach = (assignedCoach?: string, currentCoachName?: string): boolean => {
  if (!assignedCoach || !currentCoachName) return false;
  const a = assignedCoach.toLowerCase().trim();
  const b = currentCoachName.toLowerCase().trim();
  if (a === b) return true;

  // Clean prefixes like 'coach '
  const cleanA = a.replace(/^coach\s+/i, '').trim();
  const cleanB = b.replace(/^coach\s+/i, '').trim();

  if (cleanA === cleanB) return true;

  // Check first token (e.g. "danish", "roshan", "muqeeth", "ahmed", "tariq")
  const tokenA = cleanA.split(/[\s(]/)[0];
  const tokenB = cleanB.split(/[\s(]/)[0];

  if (tokenA && tokenB && tokenA.length >= 3 && tokenB.length >= 3) {
    if (tokenA === tokenB || cleanA.includes(tokenB) || cleanB.includes(tokenA)) {
      return true;
    }
  }

  return cleanA.includes(cleanB) || cleanB.includes(cleanA);
};

export const CoachView: React.FC = () => {
  const {
    selectedStaffRole,
    setSelectedStaffRole,
    coachAvatars,
    clientMasterRecords,
    sessionMasterRecords,
    assessmentRecords,
    givenSessionPlanRecords,
    batchTrainingGroups,
    syncSessionToSystem2,
    updateSessionAttendance,
    postponeSession,
    addAssessmentRecord,
    addGivenSessionPlanRecord,
    toggleBatchSessionDone,
    updateBatchMemberStatus,
    addMemberToBatch,
    addBatchTrainingGroup,
  } = usePrimeStore();

  const [activeTab, setActiveTab] = useState<'schedule' | 'batch_training' | 'log_and_plan' | 'assessments' | 'my_clients'>('schedule');

  // Batch Training Local Component State
  const [batchCategoryFilter, setBatchCategoryFilter] = useState<string>('ALL');
  const [batchCoachFilter, setBatchCoachFilter] = useState<string>('AUTO');
  const [batchSearchQuery, setBatchSearchQuery] = useState<string>('');

  // Add Member inline form state
  const [addMemberBatchId, setAddMemberBatchId] = useState<string | null>(null);
  const [newMemberNameInput, setNewMemberNameInput] = useState<string>('');
  const [newMemberStatusInput, setNewMemberStatusInput] = useState<BatchMemberStatus>('Active');

  // Create New Batch Modal state
  const [showNewBatchModal, setShowNewBatchModal] = useState<boolean>(false);
  const [newBatchName, setNewBatchName] = useState<string>('');
  const [newBatchTime, setNewBatchTime] = useState<string>('06:30 AM - 07:30 AM');
  const [newBatchDays, setNewBatchDays] = useState<string>('Mon / Wed / Fri');
  const [newBatchCategory, setNewBatchCategory] = useState<'Combat & Striking' | 'Calisthenics' | 'Strength & Athleticism' | 'Conditioning' | 'General Batch'>('Combat & Striking');
  const [newBatchLocation, setNewBatchLocation] = useState<string>('INTOKINE Combat Ring');
  const [newBatchDesc, setNewBatchDesc] = useState<string>('');
  const [newBatchMembersInput, setNewBatchMembersInput] = useState<string>('Tariq Said, Faisal Al-Nuaimi');

  // Assessment Form State
  const [assClient, setAssClient] = useState('CLI-101');
  const [assWeight, setAssWeight] = useState('84.5');
  const [assBodyFat, setAssBodyFat] = useState('11.2');
  const [assVo2, setAssVo2] = useState('58.4');
  const [assNotes, setAssNotes] = useState('Solid recovery and increased anaerobic capacity.');
  const [assSuccessMsg, setAssSuccessMsg] = useState(false);

  // Weekly Schedule State (Organized by Day, Date & Time)
  const [scheduleSelectedDate, setScheduleSelectedDate] = useState<string>('2026-08-12');
  const [scheduleViewMode, setScheduleViewMode] = useState<'day_list' | 'week_grid'>('day_list');
  const [scheduleCoachFilter, setScheduleCoachFilter] = useState<string>('AUTO');
  const [scheduleSearchQuery, setScheduleSearchQuery] = useState<string>('');
  const [scheduleDayTypeFilter, setScheduleDayTypeFilter] = useState<'ALL' | 'WEEKENDS_ONLY' | 'WEEKDAYS_ONLY'>('ALL');

  // Schedule Slot for Clients State (1-Week Scheduling Capability)
  const [showScheduleSlotModal, setShowScheduleSlotModal] = useState<boolean>(false);
  const [schedClient, setSchedClient] = useState<string>('CLI-101');
  const [schedCoach, setSchedCoach] = useState<string>('Coach Danish');
  const [schedMode, setSchedMode] = useState<'week_recurrence' | 'single'>('week_recurrence');
  const [schedStartDate, setSchedStartDate] = useState<string>('2026-08-12');
  const [schedSelectedDays, setSchedSelectedDays] = useState<string[]>(['2026-08-12', '2026-08-14', '2026-08-16']);
  const [schedTime, setSchedTime] = useState<string>('07:30 AM');
  const [schedProgram, setSchedProgram] = useState<string>('1:1 Elite Athletic Transformation');
  const [schedSessionType, setSchedSessionType] = useState<string>('Strength & Conditioning');
  const [schedLocation, setSchedLocation] = useState<string>('INTOKINE HQ Private Studio');
  const [schedNotes, setSchedNotes] = useState<string>('Pre-session dynamic warmup & target power lifts.');
  const [schedToast, setSchedToast] = useState<string | null>(null);

  // Postpone / Reschedule Modal State
  const [postponeModalSession, setPostponeModalSession] = useState<any | null>(null);
  const [postponeNewDate, setPostponeNewDate] = useState<string>('');
  const [postponeNewTime, setPostponeNewTime] = useState<string>('09:30 AM');
  const [postponeReason, setPostponeReason] = useState<string>('Client requested postponement due to travel / conflict');
  const [postponeToast, setPostponeToast] = useState<string | null>(null);

  const getCoachAvatar = (coachName: string) => {
    if (coachAvatars?.[coachName]) return coachAvatars[coachName];
    if (coachName.toLowerCase().includes('danish')) return coachAvatars?.['Coach Danish'] || coachDanishImg;
    if (coachName.toLowerCase().includes('roshan')) return coachAvatars?.['Coach Roshan'] || coachRoshanImg;
    if (coachName.toLowerCase().includes('muqeeth')) return coachAvatars?.['Coach Muqeeth'] || coachMuqeethImg;
    return coachAvatars?.['Coach Danish'] || coachDanishImg;
  };

  // Helper: Get 7 Days of Active Week around scheduleSelectedDate
  const getWeekDates = (baseDateStr: string) => {
    const base = new Date(baseDateStr || '2026-08-12');
    const dayOfWeek = base.getDay(); // 0 is Sun, 1 is Mon...
    const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(base);
    monday.setDate(base.getDate() + distanceToMon);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days.push({ dateStr, dayName, monthDayStr });
    }
    return days;
  };

  // Helper: Get 7 Consecutive Days starting exactly from a specific Start Date (for 1-Week Schedule Range)
  const getWeekDaysFromDate = (startDateStr: string) => {
    const start = new Date(startDateStr || '2026-08-12');
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const fullDayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      const monthDayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days.push({ dateStr, dayName, fullDayName, monthDayStr, index: i });
    }
    return days;
  };

  const currentWeekDates = getWeekDates(scheduleSelectedDate);

  // Active Coach Room Detection
  const isCoachDanish = selectedStaffRole === 'Coach Danish';
  const isCoachRoshan = selectedStaffRole === 'Coach Roshan';
  const isCoachMuqeeth = selectedStaffRole === 'Coach Muqeeth';

  const currentCoachName = isCoachDanish
    ? 'Coach Danish'
    : isCoachRoshan
    ? 'Coach Roshan'
    : isCoachMuqeeth
    ? 'Coach Muqeeth'
    : selectedStaffRole;

  // Batch Filter & Submit Handlers
  const handleCreateNewBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchName.trim()) return;

    const initialMembers = newBatchMembersInput
      .split(',')
      .map((m) => m.trim())
      .filter((m) => m.length > 0)
      .map((m, idx) => ({
        id: `BM-NEW-${idx}-${Date.now().toString().slice(-3)}`,
        name: m,
        status: 'Active' as BatchMemberStatus,
        joinedDate: new Date().toISOString().split('T')[0],
      }));

    addBatchTrainingGroup({
      coachName: currentCoachName,
      batchName: newBatchName,
      batchTime: newBatchTime,
      days: newBatchDays,
      category: newBatchCategory,
      location: newBatchLocation,
      description: newBatchDesc,
      members: initialMembers.length > 0 ? initialMembers : [
        { id: `BM-01`, name: 'Sample Member', status: 'Active', joinedDate: new Date().toISOString().split('T')[0] }
      ],
    });

    setNewBatchName('');
    setNewBatchDesc('');
    setShowNewBatchModal(false);
  };

  const handleAddMemberToBatchSubmit = (batchId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberNameInput.trim()) return;
    addMemberToBatch(batchId, newMemberNameInput.trim(), newMemberStatusInput);
    setNewMemberNameInput('');
    setAddMemberBatchId(null);
  };

  const visibleBatches = batchTrainingGroups.filter((b) => {
    // Coach Filter
    if (batchCoachFilter === 'AUTO') {
      const coachFirstName = currentCoachName.split(' ')[1] || currentCoachName;
      if (!b.coachName.toLowerCase().includes(coachFirstName.toLowerCase())) {
        return false;
      }
    } else if (batchCoachFilter !== 'ALL') {
      if (b.coachName !== batchCoachFilter) return false;
    }

    // Category Filter
    if (batchCategoryFilter !== 'ALL' && b.category !== batchCategoryFilter) {
      return false;
    }

    // Search Query
    if (batchSearchQuery.trim()) {
      const q = batchSearchQuery.toLowerCase();
      const matchBatch = b.batchName.toLowerCase().includes(q);
      const matchCat = b.category.toLowerCase().includes(q);
      const matchCoach = b.coachName.toLowerCase().includes(q);
      const matchMember = b.members.some((m) => m.name.toLowerCase().includes(q));
      if (!matchBatch && !matchCat && !matchCoach && !matchMember) return false;
    }

    return true;
  });

  // Filter clients assigned strictly to active coach room
  const myAssignedClients = clientMasterRecords.filter((c) =>
    isClientAssignedToCoach(c.assignedCoach, currentCoachName)
  );

  // Keep client selections and active coach in sync when switching coach rooms
  useEffect(() => {
    if (myAssignedClients.length > 0) {
      const isAssInAssigned = myAssignedClients.some((c) => c.id === assClient);
      if (!isAssInAssigned) {
        setAssClient(myAssignedClients[0].id);
      }
      const isSchedInAssigned = myAssignedClients.some((c) => c.id === schedClient);
      if (!isSchedInAssigned) {
        setSchedClient(myAssignedClients[0].id);
      }
    }
    setSchedCoach(currentCoachName);
  }, [currentCoachName, clientMasterRecords]);

  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clientMasterRecords.find((c) => c.id === assClient) || clientMasterRecords[0];

    addAssessmentRecord({
      clientId: client.id,
      clientName: client.name,
      date: new Date().toISOString().split('T')[0],
      weightKg: Number(assWeight),
      bodyFatPercentage: Number(assBodyFat),
      vo2Max: Number(assVo2),
      notes: assNotes,
      assessedBy: currentCoachName,
    });

    setAssSuccessMsg(true);
    setTimeout(() => setAssSuccessMsg(false), 3000);
  };

  const handleConfirmPostpone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postponeModalSession) return;

    postponeSession(postponeModalSession.id, postponeNewDate, postponeNewTime, postponeReason);
    setPostponeToast(
      `Session for ${postponeModalSession.clientName} successfully postponed to ${postponeNewDate} at ${postponeNewTime}!`
    );
    setPostponeModalSession(null);

    setTimeout(() => {
      setPostponeToast(null);
    }, 6000);
  };

  // 1-Week Schedule Slot Handlers
  const openScheduleSlotModal = (dateStr?: string, clientId?: string) => {
    const targetDate = dateStr || scheduleSelectedDate || '2026-08-12';
    setSchedStartDate(targetDate);

    // Compute week days starting from this date and pick 3 balanced days by default
    const weekDays = getWeekDaysFromDate(targetDate);
    const defaultDates = [weekDays[0]?.dateStr, weekDays[2]?.dateStr, weekDays[4]?.dateStr].filter(Boolean) as string[];
    setSchedSelectedDays(defaultDates.length > 0 ? defaultDates : [targetDate]);

    if (clientId) {
      setSchedClient(clientId);
      const cl = clientMasterRecords.find((c) => c.id === clientId);
      if (cl) {
        setSchedProgram(cl.program || '1:1 Elite Athletic Transformation');
      }
    } else {
      const preferredClient =
        myAssignedClients.find((c) => c.id === schedClient) ||
        myAssignedClients[0] ||
        clientMasterRecords.find((c) => c.id === schedClient) ||
        clientMasterRecords[0];
      if (preferredClient) {
        setSchedClient(preferredClient.id);
        setSchedProgram(preferredClient.program || '1:1 Elite Athletic Transformation');
      }
    }

    setSchedCoach(currentCoachName || 'Coach Danish');
    setShowScheduleSlotModal(true);
  };

  const toggleSelectDayInWeek = (dateStr: string) => {
    setSchedSelectedDays((prev) =>
      prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
    );
  };

  const setWeekDayPreset = (preset: 'mwf' | 'tts' | 'all' | 'weekdays' | 'weekends') => {
    const weekDays = getWeekDaysFromDate(schedStartDate);
    let chosenDates: string[] = [];

    if (preset === 'mwf') {
      // Day 0, Day 2, Day 4
      chosenDates = [weekDays[0]?.dateStr, weekDays[2]?.dateStr, weekDays[4]?.dateStr].filter(Boolean) as string[];
    } else if (preset === 'tts') {
      // Day 1, Day 3, Day 5
      chosenDates = [weekDays[1]?.dateStr, weekDays[3]?.dateStr, weekDays[5]?.dateStr].filter(Boolean) as string[];
    } else if (preset === 'all') {
      chosenDates = weekDays.map((d) => d.dateStr);
    } else if (preset === 'weekdays') {
      chosenDates = weekDays
        .filter((d) => !['Sat', 'Sun'].includes(d.dayName))
        .map((d) => d.dateStr);
    } else if (preset === 'weekends') {
      chosenDates = weekDays
        .filter((d) => ['Sat', 'Sun'].includes(d.dayName))
        .map((d) => d.dateStr);
    }

    setSchedSelectedDays(chosenDates.length > 0 ? chosenDates : [schedStartDate]);
  };

  const handleConfirmScheduleSlots = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clientMasterRecords.find((c) => c.id === schedClient) || {
      id: schedClient,
      name: 'Client ' + schedClient,
      program: schedProgram,
    };

    const datesToSchedule = schedMode === 'single' ? [schedStartDate] : schedSelectedDays;

    if (datesToSchedule.length === 0) {
      alert('Please select at least one day or date to schedule.');
      return;
    }

    // Schedule each session across the target dates in System 2
    datesToSchedule.forEach((targetDate) => {
      syncSessionToSystem2({
        clientId: client.id,
        clientName: client.name,
        coachName: schedCoach,
        date: targetDate,
        time: schedTime,
        program: schedProgram,
        sessionType: schedSessionType,
        location: schedLocation,
        status: 'Scheduled',
        attendanceStatus: 'Scheduled',
        notes: schedNotes,
        loggedByStaff: currentCoachName,
      });
    });

    setScheduleSelectedDate(schedStartDate);
    setShowScheduleSlotModal(false);
    setSchedToast(
      `Successfully scheduled ${datesToSchedule.length} session slot(s) for ${client.name} across the 1-week schedule!`
    );
    setTimeout(() => {
      setSchedToast(null);
    }, 6000);
  };

  return (
    <div className="space-y-5 pb-20 max-w-5xl mx-auto px-3 sm:px-6 pt-4">
      {/* Sleek Coach Header & Room Switcher */}
      <div className="bg-[#14161f] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="shrink-0">
              <img
                src={getCoachAvatar(currentCoachName)}
                alt={currentCoachName}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#06b6d4]/40 shadow-md"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#06b6d4]" />
                <span className="text-[11px] font-semibold text-[#06b6d4] uppercase tracking-wider">
                  Coach Workspace
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                {currentCoachName}'s Room
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                Schedule sessions, manage batch training, log workouts, and monitor assigned clients.
              </p>
            </div>
          </div>

          {/* Quick Schedule Button */}
          <button
            type="button"
            onClick={() => openScheduleSlotModal(scheduleSelectedDate)}
            className="px-3.5 py-2 bg-gradient-to-r from-[#ec2226] to-[#06b6d4] hover:opacity-95 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Schedule Slot</span>
          </button>
        </div>

        {/* 3 Coach Room Selector Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 border-t border-white/[0.06]">
          {/* Room 1: Coach Danish */}
          <div
            onClick={() => setSelectedStaffRole('Coach Danish')}
            className={`p-2.5 sm:p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
              isCoachDanish
                ? 'bg-white text-slate-900 border-blue-500 shadow-md ring-2 ring-blue-500/20 font-medium'
                : 'bg-white/[0.03] border-white/[0.08] text-neutral-300 hover:bg-white/[0.07] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={getCoachAvatar('Coach Danish')}
                alt="Coach Danish"
                referrerPolicy="no-referrer"
                className={`w-10 h-10 rounded-xl object-cover shrink-0 border ${
                  isCoachDanish ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-white/10 opacity-85'
                }`}
              />
              <div className="min-w-0">
                <div className={`font-bold text-xs flex items-center gap-1.5 truncate ${isCoachDanish ? 'text-slate-900' : 'text-white'}`}>
                  <span>Coach Danish</span>
                  {isCoachDanish && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                </div>
                <span className={`text-[11px] block truncate ${isCoachDanish ? 'text-slate-600 font-bold' : 'text-neutral-400'}`}>
                  Head Performance • {clientMasterRecords.filter((c) => isClientAssignedToCoach(c.assignedCoach, 'Coach Danish')).length} Assigned
                </span>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 shrink-0 ml-1 ${isCoachDanish ? 'text-blue-600' : 'text-neutral-500'}`} />
          </div>

          {/* Room 2: Coach Roshan */}
          <div
            onClick={() => setSelectedStaffRole('Coach Roshan')}
            className={`p-2.5 sm:p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
              isCoachRoshan
                ? 'bg-white text-slate-900 border-indigo-500 shadow-md ring-2 ring-indigo-500/20 font-medium'
                : 'bg-white/[0.03] border-white/[0.08] text-neutral-300 hover:bg-white/[0.07] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={getCoachAvatar('Coach Roshan')}
                alt="Coach Roshan"
                referrerPolicy="no-referrer"
                className={`w-10 h-10 rounded-xl object-cover shrink-0 border ${
                  isCoachRoshan ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-white/10 opacity-85'
                }`}
              />
              <div className="min-w-0">
                <div className={`font-bold text-xs flex items-center gap-1.5 truncate ${isCoachRoshan ? 'text-slate-900' : 'text-white'}`}>
                  <span>Coach Roshan</span>
                  {isCoachRoshan && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                </div>
                <span className={`text-[11px] block truncate ${isCoachRoshan ? 'text-slate-600 font-bold' : 'text-neutral-400'}`}>
                  Elite Hybrid • {clientMasterRecords.filter((c) => isClientAssignedToCoach(c.assignedCoach, 'Coach Roshan')).length} Assigned
                </span>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 shrink-0 ml-1 ${isCoachRoshan ? 'text-indigo-600' : 'text-neutral-500'}`} />
          </div>

          {/* Room 3: Coach Muqeeth */}
          <div
            onClick={() => setSelectedStaffRole('Coach Muqeeth')}
            className={`p-2.5 sm:p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
              isCoachMuqeeth
                ? 'bg-white text-slate-900 border-[#ec2226] shadow-md ring-2 ring-[#ec2226]/20 font-medium'
                : 'bg-white/[0.03] border-white/[0.08] text-neutral-300 hover:bg-white/[0.07] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={getCoachAvatar('Coach Muqeeth')}
                alt="Coach Muqeeth"
                referrerPolicy="no-referrer"
                className={`w-10 h-10 rounded-xl object-cover shrink-0 border ${
                  isCoachMuqeeth ? 'border-[#ec2226] ring-2 ring-[#ec2226]/30' : 'border-white/10 opacity-85'
                }`}
              />
              <div className="min-w-0">
                <div className={`font-bold text-xs flex items-center gap-1.5 truncate ${isCoachMuqeeth ? 'text-slate-900' : 'text-white'}`}>
                  <span>Coach Muqeeth</span>
                  {isCoachMuqeeth && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                </div>
                <span className={`text-[11px] block truncate ${isCoachMuqeeth ? 'text-slate-600 font-bold' : 'text-neutral-400'}`}>
                  Combat & Movement • {clientMasterRecords.filter((c) => isClientAssignedToCoach(c.assignedCoach, 'Coach Muqeeth')).length} Assigned
                </span>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 shrink-0 ml-1 ${isCoachMuqeeth ? 'text-[#ec2226]' : 'text-neutral-500'}`} />
          </div>
        </div>
      </div>

      {/* Sub-Tab Segmented Pill Navigation */}
      <div className="flex bg-[#14161f] border border-white/[0.08] rounded-2xl p-1 gap-1 overflow-x-auto no-scrollbar whitespace-nowrap">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
            activeTab === 'schedule'
              ? 'bg-white text-[#0d0e12] shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('batch_training')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
            activeTab === 'batch_training'
              ? 'bg-white text-[#0d0e12] shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Batches ({batchTrainingGroups.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('log_and_plan')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
            activeTab === 'log_and_plan'
              ? 'bg-white text-[#0d0e12] shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5" />
          <span>Log & Plan</span>
        </button>

        <button
          onClick={() => setActiveTab('assessments')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
            activeTab === 'assessments'
              ? 'bg-white text-[#0d0e12] shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Assessments</span>
        </button>

        <button
          onClick={() => setActiveTab('my_clients')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
            activeTab === 'my_clients'
              ? 'bg-white text-[#0d0e12] shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Roster ({myAssignedClients.length})</span>
        </button>
      </div>

      {/* TAB 2: BATCH TRAINING CATEGORY & MANAGEMENT */}
      {activeTab === 'batch_training' && (
        <div className="space-y-4">
          {/* Header Banner & Summary Stats */}
          <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#26262A]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Layers className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <span>INTOKINE BATCH TRAINING MANAGEMENT</span>
                      <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {currentCoachName}
                      </span>
                    </h3>
                    <p className="text-[11px] text-neutral-400">
                      Manage batch training schedules, member statuses (Active / In Break / Non Active), & session logs.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowNewBatchModal(!showNewBatchModal)}
                className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-cyan-600/15 transition self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Batch Group</span>
              </button>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">Total Batches</span>
                <span className="text-lg font-black text-white">{visibleBatches.length}</span>
              </div>

              <div className="bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">Active Members</span>
                <span className="text-lg font-black text-emerald-400">
                  {visibleBatches.reduce((acc, b) => acc + b.members.filter((m) => m.status === 'Active').length, 0)}
                </span>
              </div>

              <div className="bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">In Break</span>
                <span className="text-lg font-black text-amber-400">
                  {visibleBatches.reduce((acc, b) => acc + b.members.filter((m) => m.status === 'In Break').length, 0)}
                </span>
              </div>

              <div className="bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">Sessions Completed</span>
                <span className="text-lg font-black text-cyan-400">
                  {visibleBatches.filter((b) => b.isSessionDone).length} / {visibleBatches.length}
                </span>
              </div>
            </div>

            {/* Category & Filter Navigation Controls */}
            <div className="space-y-2.5 pt-1">
              {/* Filter 1: Coach Portal Filter */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1 shrink-0">
                  <Filter className="w-3.5 h-3.5 text-neutral-500" /> Coach:
                </span>
                <button
                  type="button"
                  onClick={() => setBatchCoachFilter('AUTO')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition ${
                    batchCoachFilter === 'AUTO'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-[#0A0A0B] text-neutral-400 hover:text-white border border-[#26262A]'
                  }`}
                >
                  ⚡ Active Room ({currentCoachName})
                </button>
                <button
                  type="button"
                  onClick={() => setBatchCoachFilter('Coach Muqeeth')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition ${
                    batchCoachFilter === 'Coach Muqeeth'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-[#0A0A0B] text-neutral-400 hover:text-white border border-[#26262A]'
                  }`}
                >
                  Coach Muqeeth
                </button>
                <button
                  type="button"
                  onClick={() => setBatchCoachFilter('Coach Danish')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition ${
                    batchCoachFilter === 'Coach Danish'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-[#0A0A0B] text-neutral-400 hover:text-white border border-[#26262A]'
                  }`}
                >
                  Coach Danish
                </button>
                <button
                  type="button"
                  onClick={() => setBatchCoachFilter('Coach Roshan')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition ${
                    batchCoachFilter === 'Coach Roshan'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'bg-[#0A0A0B] text-neutral-400 hover:text-white border border-[#26262A]'
                  }`}
                >
                  Coach Roshan
                </button>
                <button
                  type="button"
                  onClick={() => setBatchCoachFilter('ALL')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition ${
                    batchCoachFilter === 'ALL'
                      ? 'bg-neutral-200 text-black font-extrabold'
                      : 'bg-[#0A0A0B] text-neutral-400 hover:text-white border border-[#26262A]'
                  }`}
                >
                  All Coaches
                </button>
              </div>

              {/* Filter 2: Category Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                <span className="text-[11px] font-bold text-neutral-400 shrink-0">Category:</span>
                {['ALL', 'Combat & Striking', 'Calisthenics', 'Strength & Athleticism', 'Conditioning', 'General Batch'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setBatchCategoryFilter(cat)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition ${
                      batchCategoryFilter === cat
                        ? 'bg-blue-600 text-white font-extrabold'
                        : 'bg-[#0A0A0B] text-neutral-400 hover:text-white border border-[#26262A]'
                    }`}
                  >
                    {cat === 'ALL' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search batch name, category, coach, or member name..."
                  value={batchSearchQuery}
                  onChange={(e) => setBatchSearchQuery(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Modal / Form: Create New Batch Group */}
          {showNewBatchModal && (
            <div className="bg-[#161618] border border-cyan-500/30 rounded-2xl p-4 shadow-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-[#26262A]">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Create New Batch Training Group</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewBatchModal(false)}
                  className="text-neutral-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateNewBatch} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Batch Group Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Muay Thai Morning Striking Squad"
                      value={newBatchName}
                      onChange={(e) => setNewBatchName(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Batch Category</label>
                    <select
                      value={newBatchCategory}
                      onChange={(e) => setNewBatchCategory(e.target.value as any)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Combat & Striking">Combat & Striking</option>
                      <option value="Calisthenics">Calisthenics</option>
                      <option value="Strength & Athleticism">Strength & Athleticism</option>
                      <option value="Conditioning">Conditioning</option>
                      <option value="General Batch">General Batch</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Batch Time (e.g. 06:30 AM - 07:30 AM)</label>
                    <input
                      type="text"
                      required
                      value={newBatchTime}
                      onChange={(e) => setNewBatchTime(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Days Schedule</label>
                    <input
                      type="text"
                      required
                      value={newBatchDays}
                      onChange={(e) => setNewBatchDays(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Studio / Arena Location</label>
                    <input
                      type="text"
                      value={newBatchLocation}
                      onChange={(e) => setNewBatchLocation(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Assigned Coach</label>
                    <input
                      type="text"
                      readOnly
                      value={currentCoachName}
                      className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-neutral-400 cursor-not-allowed font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Initial Members (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Tariq Said, Saif Al-Ameri, Zaid Farooq"
                    value={newBatchMembersInput}
                    onChange={(e) => setNewBatchMembersInput(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Batch Description / Target Focus</label>
                  <textarea
                    rows={2}
                    placeholder="Describe batch conditioning protocols, equipment, or striking goals..."
                    value={newBatchDesc}
                    onChange={(e) => setNewBatchDesc(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setShowNewBatchModal(false)}
                    className="px-4 py-2 bg-[#0A0A0B] text-neutral-400 hover:text-white rounded-xl text-xs font-bold border border-[#26262A]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-cyan-600/20"
                  >
                    Save & Create Batch
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* LIST OF BATCH CARDS */}
          <div className="space-y-4">
            {visibleBatches.length === 0 ? (
              <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-8 text-center space-y-2">
                <Layers className="w-8 h-8 text-neutral-600 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Batch Training Groups Found</h4>
                <p className="text-xs text-neutral-400">
                  Try adjusting filters or create a new batch group for {currentCoachName}.
                </p>
                <button
                  type="button"
                  onClick={() => setShowNewBatchModal(true)}
                  className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-600 text-white font-bold text-xs rounded-xl"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Batch Group</span>
                </button>
              </div>
            ) : (
              visibleBatches.map((batch) => {
                const activeCount = batch.members.filter((m) => m.status === 'Active').length;
                const inBreakCount = batch.members.filter((m) => m.status === 'In Break').length;
                const nonActiveCount = batch.members.filter((m) => m.status === 'Non Active').length;

                return (
                  <div
                    key={batch.id}
                    className="bg-[#161618] border border-[#26262A] hover:border-[#383840] rounded-2xl p-4 space-y-4 shadow-xl transition relative overflow-hidden"
                  >
                    {/* Top Row: Category + Coach + Location */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#26262A] pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-2.5 py-1 rounded-lg">
                          {batch.category}
                        </span>
                        <span className="text-[10px] font-bold text-neutral-300 bg-[#0A0A0B] border border-[#26262A] px-2 py-1 rounded-lg flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-blue-400" />
                          <span>{batch.coachName}</span>
                        </span>
                        <span className="text-[10px] text-neutral-400 bg-[#0A0A0B] border border-[#26262A] px-2 py-1 rounded-lg flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{batch.location}</span>
                        </span>
                      </div>

                      <span className="text-[10px] font-mono text-neutral-500">{batch.id}</span>
                    </div>

                    {/* Batch Title & Schedule Box */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                      <div className="md:col-span-2 space-y-1.5">
                        <h3 className="text-base font-black text-white tracking-wide">{batch.batchName}</h3>
                        {batch.description && (
                          <p className="text-xs text-neutral-400 line-clamp-2">{batch.description}</p>
                        )}

                        {/* Explicit Batch Time Box */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <div className="inline-flex items-center gap-1.5 bg-blue-600/20 border border-blue-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-300">
                            <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                            <span>Batch Time: <strong className="text-white font-mono">{batch.batchTime}</strong></span>
                          </div>

                          <div className="inline-flex items-center gap-1.5 bg-[#0A0A0B] border border-[#26262A] px-2.5 py-1.5 rounded-xl text-xs text-neutral-300">
                            <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span>Days: <strong className="text-neutral-200">{batch.days}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* SESSION DONE / NOT DONE ACTION BUTTON */}
                      <div className="bg-[#0A0A0B] border border-[#26262A] rounded-2xl p-3 text-center space-y-2">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                          Today's Session Status
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleBatchSessionDone(batch.id)}
                          className={`w-full py-2.5 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg ${
                            batch.isSessionDone
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-amber-500/20 animate-pulse'
                          }`}
                        >
                          {batch.isSessionDone ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <span>SESSION DONE</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 shrink-0 fill-current" />
                              <span>MARK SESSION DONE</span>
                            </>
                          )}
                        </button>

                        <span className="text-[10px] text-neutral-500 block font-mono">
                          {batch.isSessionDone ? `Logged: ${batch.lastSessionDate}` : 'Session Not Completed Today'}
                        </span>
                      </div>
                    </div>

                    {/* MEMBERS SECTION */}
                    <div className="border-t border-[#26262A] pt-3 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-cyan-400" />
                          <h4 className="text-xs font-black text-white uppercase tracking-wider">
                            Members Names & Statuses ({batch.members.length})
                          </h4>
                        </div>

                        {/* Member Status Breakdown Pill Badge */}
                        <div className="flex items-center gap-1.5 text-[10px] font-bold">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                            {activeCount} Active
                          </span>
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
                            {inBreakCount} In Break
                          </span>
                          <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded">
                            {nonActiveCount} Non Active
                          </span>
                        </div>
                      </div>

                      {/* Members List Cards/Rows */}
                      <div className="space-y-2">
                        {batch.members.map((member) => (
                          <div
                            key={member.id}
                            className="bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                                  member.status === 'Active'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : member.status === 'In Break'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                {member.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white flex items-center gap-2">
                                  <span>{member.name}</span>
                                  {member.phone && (
                                    <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">{member.phone}</span>
                                  )}
                                </div>
                                <span className="text-[10px] text-neutral-400 block">
                                  Joined: {member.joinedDate || '2026-01-01'}
                                </span>
                              </div>
                            </div>

                            {/* Active / In Break / Non Active Status Selector Buttons */}
                            <div className="flex items-center gap-1 self-end sm:self-auto">
                              {/* 1. Active Button */}
                              <button
                                type="button"
                                onClick={() => updateBatchMemberStatus(batch.id, member.id, 'Active')}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition flex items-center gap-1 ${
                                  member.status === 'Active'
                                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                                    : 'bg-[#161618] text-neutral-400 hover:text-white border border-[#26262A]'
                                }`}
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>Active</span>
                              </button>

                              {/* 2. In Break Button */}
                              <button
                                type="button"
                                onClick={() => updateBatchMemberStatus(batch.id, member.id, 'In Break')}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition flex items-center gap-1 ${
                                  member.status === 'In Break'
                                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                                    : 'bg-[#161618] text-neutral-400 hover:text-white border border-[#26262A]'
                                }`}
                              >
                                <Pause className="w-2.5 h-2.5 fill-current" />
                                <span>In Break</span>
                              </button>

                              {/* 3. Non Active Button */}
                              <button
                                type="button"
                                onClick={() => updateBatchMemberStatus(batch.id, member.id, 'Non Active')}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition flex items-center gap-1 ${
                                  member.status === 'Non Active'
                                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                                    : 'bg-[#161618] text-neutral-400 hover:text-white border border-[#26262A]'
                                }`}
                              >
                                <UserX className="w-2.5 h-2.5" />
                                <span>Non Active</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Member Inline Toggle/Form */}
                      {addMemberBatchId === batch.id ? (
                        <form
                          onSubmit={(e) => handleAddMemberToBatchSubmit(batch.id, e)}
                          className="bg-[#0A0A0B] border border-cyan-500/30 rounded-xl p-3 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-cyan-400 uppercase">Add Member to {batch.batchName}</span>
                            <button
                              type="button"
                              onClick={() => setAddMemberBatchId(null)}
                              className="text-neutral-400 hover:text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Member full name..."
                              value={newMemberNameInput}
                              onChange={(e) => setNewMemberNameInput(e.target.value)}
                              className="sm:col-span-2 bg-[#161618] border border-[#26262A] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                            />

                            <select
                              value={newMemberStatusInput}
                              onChange={(e) => setNewMemberStatusInput(e.target.value as BatchMemberStatus)}
                              className="bg-[#161618] border border-[#26262A] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                            >
                              <option value="Active">Active</option>
                              <option value="In Break">In Break</option>
                              <option value="Non Active">Non Active</option>
                            </select>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg"
                          >
                            + Confirm Add Member
                          </button>
                        </form>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setAddMemberBatchId(batch.id);
                            setNewMemberNameInput('');
                          }}
                          className="w-full py-2 bg-[#0A0A0B] hover:bg-[#111113] border border-dashed border-[#26262A] hover:border-cyan-500/50 rounded-xl text-neutral-400 hover:text-cyan-400 text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add New Member to Batch</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 1: WEEKLY SESSION SCHEDULE BY DAY, DATE & TIME */}
      {activeTab === 'schedule' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Header Controls Bar */}
          <div className="bg-[#14161f] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#06b6d4]" />
                  <span>Weekly Schedule</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Manage assigned client slots, daily timetables, and attendance check-ins.
                </p>
              </div>

              {/* Action Buttons: Schedule Slot + Jump to Today + View Mode */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => openScheduleSlotModal(scheduleSelectedDate)}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#ec2226] to-[#06b6d4] hover:opacity-95 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Schedule Slot</span>
                </button>

                <button
                  onClick={() => setScheduleSelectedDate('2026-08-12')}
                  className="px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-medium rounded-xl border border-white/10 transition flex items-center gap-1"
                  title="Jump to today's date"
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Today</span>
                </button>

                <div className="bg-white/[0.04] p-0.5 rounded-xl border border-white/10 flex items-center text-xs">
                  <button
                    onClick={() => setScheduleViewMode('day_list')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition ${
                      scheduleViewMode === 'day_list'
                        ? 'bg-white text-[#0d0e12] font-semibold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setScheduleViewMode('week_grid')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition ${
                      scheduleViewMode === 'week_grid'
                        ? 'bg-white text-[#0d0e12] font-semibold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    7-Day Matrix
                  </button>
                </div>
              </div>
            </div>

            {/* Filters & Search Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Select Date Picker */}
              <div>
                <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                  Selected Date
                </label>
                <input
                  type="date"
                  value={scheduleSelectedDate}
                  onChange={(e) => setScheduleSelectedDate(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono font-medium text-white focus:outline-none focus:border-[#06b6d4]"
                />
              </div>

              {/* Coach Filter */}
              <div>
                <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                  Coach Filter
                </label>
                <select
                  value={scheduleCoachFilter}
                  onChange={(e) => setScheduleCoachFilter(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#06b6d4]"
                >
                  <option value="AUTO" className="bg-[#14161f] text-white">⚡ My Assigned Clients ({currentCoachName})</option>
                  <option value="ALL" className="bg-[#14161f] text-white">All Staff Coaches</option>
                  <option value="Coach Danish" className="bg-[#14161f] text-white">Coach Danish</option>
                  <option value="Coach Roshan" className="bg-[#14161f] text-white">Coach Roshan</option>
                  <option value="Coach Muqeeth" className="bg-[#14161f] text-white">Coach Muqeeth</option>
                  <option value="Coach Ahmed (Head Coach)" className="bg-[#14161f] text-white">Coach Ahmed (Head Coach)</option>
                  <option value="Coach Tariq (Martial Arts)" className="bg-[#14161f] text-white">Coach Tariq (Martial Arts)</option>
                  <option value="Sara Al-Mansoori (Lead Nutritionist)" className="bg-[#14161f] text-white">Sara Al-Mansoori (Nutritionist)</option>
                  <option value="Dr. Zeyad (Physiotherapy)" className="bg-[#14161f] text-white">Dr. Zeyad (Physio)</option>
                </select>
              </div>

              {/* Search Client / Session */}
              <div>
                <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                  Search Schedule
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2" />
                  <input
                    type="text"
                    placeholder="Client, program, location..."
                    value={scheduleSearchQuery}
                    onChange={(e) => setScheduleSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>
              </div>
            </div>

            {/* Weekend / Day Type Schedule Quick Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white/[0.02] p-2 rounded-xl border border-white/[0.06] text-xs">
              <span className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                <Filter className="w-3 h-3 text-[#06b6d4]" />
                <span>Filter Days:</span>
              </span>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setScheduleDayTypeFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-xs transition ${
                    scheduleDayTypeFilter === 'ALL'
                      ? 'bg-white text-[#0d0e12] font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  All Days
                </button>

                <button
                  onClick={() => setScheduleDayTypeFilter('WEEKENDS_ONLY')}
                  className={`px-2.5 py-1 rounded-lg text-xs transition flex items-center gap-1 ${
                    scheduleDayTypeFilter === 'WEEKENDS_ONLY'
                      ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                      : 'text-neutral-400 hover:text-amber-300'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Weekends</span>
                </button>

                <button
                  onClick={() => setScheduleDayTypeFilter('WEEKDAYS_ONLY')}
                  className={`px-2.5 py-1 rounded-lg text-xs transition ${
                    scheduleDayTypeFilter === 'WEEKDAYS_ONLY'
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Weekdays
                </button>
              </div>
            </div>

            {/* Weekly Day Selector Strip (Mon - Sun) */}
            <div className="pt-2 border-t border-[#26262A]">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Active Week Day Strip (Click Day to View / Schedule)</span>
                <button
                  type="button"
                  onClick={() => openScheduleSlotModal(scheduleSelectedDate)}
                  className="text-[#6ccbde] hover:underline flex items-center gap-1 text-[11px] font-bold"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add 1-Week Slots</span>
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {currentWeekDates.map((day) => {
                  const isSelected = day.dateStr === scheduleSelectedDate;
                  const daySessionsCount = sessionMasterRecords.filter((s) => {
                    const matchDate = s.date === day.dateStr;
                    const isAssigned =
                      isClientAssignedToCoach(s.coachName, currentCoachName) ||
                      myAssignedClients.some((c) => c.name.toLowerCase() === s.clientName.toLowerCase() || c.id === s.clientId);

                    const matchCoach =
                      scheduleCoachFilter === 'AUTO'
                        ? isAssigned
                        : scheduleCoachFilter === 'ALL'
                        ? true
                        : s.coachName === scheduleCoachFilter;
                    return matchDate && matchCoach;
                  }).length;

                  return (
                    <button
                      key={day.dateStr}
                      onClick={() => setScheduleSelectedDate(day.dateStr)}
                      className={`p-2 rounded-xl text-center border transition flex flex-col items-center justify-center space-y-1 relative group ${
                        isSelected
                          ? 'bg-[#6ccbde]/20 border-[#6ccbde] text-white shadow-md ring-1 ring-[#6ccbde]'
                          : 'bg-[#0A0A0B] border-[#26262A] text-neutral-400 hover:border-neutral-500 hover:text-white'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold uppercase">{day.dayName}</span>
                      <span className={`text-xs font-black ${isSelected ? 'text-[#6ccbde]' : 'text-white'}`}>
                        {day.monthDayStr}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                          daySessionsCount > 0
                            ? isSelected
                              ? 'bg-[#6ccbde] text-black'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-neutral-800 text-neutral-500'
                        }`}
                      >
                        {daySessionsCount} {daySessionsCount === 1 ? 'sess' : 'sess'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: DAY LIST SCHEDULE */}
          {scheduleViewMode === 'day_list' && (
            <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#26262A]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#6ccbde]" />
                  <h4 className="text-sm font-bold text-white">
                    Scheduled Sessions for <span className="text-[#6ccbde] font-mono">{scheduleSelectedDate}</span>
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openScheduleSlotModal(scheduleSelectedDate)}
                    className="px-3 py-1 bg-[#6ccbde]/15 hover:bg-[#6ccbde]/25 text-[#6ccbde] border border-[#6ccbde]/30 rounded-xl text-xs font-bold transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Schedule Slot for This Date</span>
                  </button>

                  <div className="text-xs font-mono text-neutral-400 bg-[#0A0A0B] px-3 py-1 rounded-xl border border-[#26262A]">
                    Filter: <strong className="text-white">{scheduleCoachFilter === 'AUTO' ? `Assigned to ${currentCoachName}` : scheduleCoachFilter}</strong>
                  </div>
                </div>
              </div>

              {/* Render Sessions for Selected Date */}
              {(() => {
                const daySessions = sessionMasterRecords
                  .filter((s) => {
                    const matchDate =
                      scheduleDayTypeFilter === 'WEEKENDS_ONLY'
                        ? [0, 6].includes(new Date(s.date).getDay())
                        : scheduleDayTypeFilter === 'WEEKDAYS_ONLY'
                        ? ![0, 6].includes(new Date(s.date).getDay())
                        : s.date === scheduleSelectedDate;

                    const isAssigned =
                      isClientAssignedToCoach(s.coachName, currentCoachName) ||
                      myAssignedClients.some((c) => c.name.toLowerCase() === s.clientName.toLowerCase() || c.id === s.clientId);

                    const matchCoach =
                      scheduleCoachFilter === 'AUTO'
                        ? isAssigned
                        : scheduleCoachFilter === 'ALL'
                        ? true
                        : s.coachName === scheduleCoachFilter;

                    const matchQuery =
                      !scheduleSearchQuery.trim() ||
                      s.clientName.toLowerCase().includes(scheduleSearchQuery.toLowerCase()) ||
                      s.program.toLowerCase().includes(scheduleSearchQuery.toLowerCase()) ||
                      s.sessionType.toLowerCase().includes(scheduleSearchQuery.toLowerCase()) ||
                      s.coachName.toLowerCase().includes(scheduleSearchQuery.toLowerCase());
                    return matchDate && matchCoach && matchQuery;
                  })
                  .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

                if (daySessions.length === 0) {
                  return (
                    <div className="p-8 text-center bg-[#0A0A0B] border border-[#26262A] rounded-xl space-y-3">
                      <Calendar className="w-8 h-8 text-neutral-600 mx-auto" />
                      <div className="text-xs font-bold text-white">
                        {scheduleDayTypeFilter === 'WEEKENDS_ONLY'
                          ? 'No Scheduled Weekend Sessions (Sat / Sun)'
                          : scheduleDayTypeFilter === 'WEEKDAYS_ONLY'
                          ? 'No Scheduled Weekday Sessions'
                          : `No Scheduled Client Sessions for ${scheduleSelectedDate}`}
                      </div>
                      <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
                        No client sessions found under the active filter. You can book a single slot or schedule multiple days for the 1-week cycle!
                      </p>
                      <button
                        type="button"
                        onClick={() => openScheduleSlotModal(scheduleSelectedDate)}
                        className="px-4 py-2 bg-gradient-to-r from-[#6ccbde] to-cyan-400 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 hover:opacity-95 transition inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Schedule Slot for {scheduleSelectedDate}</span>
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {daySessions.map((session) => (
                      <div
                        key={session.id}
                        className="bg-[#0A0A0B] border border-[#26262A] hover:border-[#3e3e42] rounded-xl p-4 transition space-y-3 shadow-md"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-black text-black bg-[#6ccbde] px-2.5 py-0.5 rounded shadow">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {session.time}
                            </span>
                            <span className="text-xs font-bold text-white">{session.clientName}</span>
                            <span className="text-[10px] font-mono text-neutral-400 bg-[#161618] px-2 py-0.5 rounded border border-[#26262A]">
                              Date: {session.date}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {session.status === 'Postponed' || session.attendanceStatus === 'Postponed' ? (
                              <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Postponed
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono font-bold bg-black/40 text-neutral-300 border border-white/10 px-2 py-0.5 rounded">
                                {session.status}
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                              <ArrowRightLeft className="w-3 h-3" /> Synced System 2
                            </span>
                          </div>
                        </div>

                        {/* Session Body Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase">Program / Package:</span>
                            <div className="font-bold text-white truncate">{session.program}</div>
                          </div>

                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase">Session Focus:</span>
                            <div className="font-semibold text-[#6ccbde] truncate">{session.sessionType}</div>
                          </div>

                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase">Assigned Coach & Venue:</span>
                            <div className="font-semibold text-neutral-300 flex items-center gap-1 truncate">
                              <UserCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>{session.coachName}</span> • <span className="text-neutral-400">{session.location}</span>
                            </div>
                          </div>
                        </div>

                        {session.notes && (
                          <div className="text-[11px] text-neutral-300 bg-[#161618] p-2 rounded-lg border border-[#26262A] font-mono">
                            {session.notes}
                          </div>
                        )}

                        {/* Attendance & Postpone Actions */}
                        <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                            <span>Logged By:</span>
                            <strong className="text-white">{session.loggedByStaff}</strong>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            {/* Postpone Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setPostponeModalSession(session);
                                setPostponeNewDate(session.date);
                                setPostponeNewTime(session.time || '09:30 AM');
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition flex items-center gap-1 mr-1"
                              title="Postpone session date & time"
                            >
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              <span>Postpone / Reschedule</span>
                            </button>

                            <span className="text-[10px] font-bold text-neutral-500 mr-1">Mark:</span>
                            <button
                              onClick={() => updateSessionAttendance(session.id, 'Present')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                                session.attendanceStatus === 'Present'
                                  ? 'bg-emerald-500 text-black shadow'
                                  : 'bg-[#161618] text-neutral-400 hover:text-white border border-[#26262A]'
                              }`}
                            >
                              ✓ Present
                            </button>

                            <button
                              onClick={() => updateSessionAttendance(session.id, 'Absent')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                                session.attendanceStatus === 'Absent'
                                  ? 'bg-rose-500 text-white shadow'
                                  : 'bg-[#161618] text-neutral-400 hover:text-white border border-[#26262A]'
                              }`}
                            >
                              ✕ Absent
                            </button>

                            <button
                              onClick={() => updateSessionAttendance(session.id, 'Late')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                                session.attendanceStatus === 'Late'
                                  ? 'bg-amber-500 text-black shadow'
                                  : 'bg-[#161618] text-neutral-400 hover:text-white border border-[#26262A]'
                              }`}
                            >
                              ⏱ Late
                            </button>

                            <button
                              onClick={() => updateSessionAttendance(session.id, 'No Show')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                                session.attendanceStatus === 'No Show'
                                  ? 'bg-purple-600 text-white shadow'
                                  : 'bg-[#161618] text-neutral-400 hover:text-white border border-[#26262A]'
                              }`}
                            >
                              ⚠ No Show
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* VIEW MODE 2: 7-DAY WEEKLY MATRIX VIEW */}
          {scheduleViewMode === 'week_grid' && (
            <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 space-y-3 shadow-xl overflow-x-auto">
              <div className="flex items-center justify-between pb-2 border-b border-[#26262A]">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#6ccbde]" /> 7-Day Complete Weekly Session Schedule
                  </h4>
                  <button
                    type="button"
                    onClick={() => openScheduleSlotModal(scheduleSelectedDate)}
                    className="px-2.5 py-0.5 bg-[#6ccbde]/20 hover:bg-[#6ccbde]/30 text-[#6ccbde] border border-[#6ccbde]/40 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Schedule 1-Week Slots</span>
                  </button>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">
                  Showing sessions across all 7 days for {scheduleCoachFilter === 'AUTO' ? `Assigned to ${currentCoachName}` : scheduleCoachFilter}
                </span>
              </div>

              <div className="grid grid-cols-7 gap-2 min-w-[900px]">
                {currentWeekDates.map((day) => {
                  const daySessions = sessionMasterRecords.filter((s) => {
                    const matchDate = s.date === day.dateStr;
                    const isAssigned =
                      isClientAssignedToCoach(s.coachName, currentCoachName) ||
                      myAssignedClients.some((c) => c.name.toLowerCase() === s.clientName.toLowerCase() || c.id === s.clientId);

                    const matchCoach =
                      scheduleCoachFilter === 'AUTO'
                        ? isAssigned
                        : scheduleCoachFilter === 'ALL'
                        ? true
                        : s.coachName === scheduleCoachFilter;
                    return matchDate && matchCoach;
                  });

                  return (
                    <div
                      key={day.dateStr}
                      className={`bg-[#0A0A0B] border rounded-xl p-2 space-y-2 min-h-[220px] flex flex-col justify-between ${
                        day.dateStr === scheduleSelectedDate
                          ? 'border-[#6ccbde]/50 ring-1 ring-[#6ccbde]/30'
                          : 'border-[#26262A]'
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Day Header */}
                        <div className="text-center pb-1.5 border-b border-[#26262A] flex items-center justify-between px-1">
                          <div className="text-left">
                            <div className="text-[10px] font-mono font-bold text-[#6ccbde] uppercase">{day.dayName}</div>
                            <div className="text-xs font-black text-white">{day.monthDayStr}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => openScheduleSlotModal(day.dateStr)}
                            className="w-5 h-5 rounded-md bg-[#161618] hover:bg-[#6ccbde] text-neutral-400 hover:text-black flex items-center justify-center border border-[#26262A] transition"
                            title={`Schedule session on ${day.dayName} (${day.dateStr})`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Sessions List */}
                        {daySessions.length === 0 ? (
                          <div className="text-[10px] text-neutral-600 text-center py-6 font-mono">No sessions</div>
                        ) : (
                          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-0.5">
                            {daySessions.map((s) => (
                              <div
                                key={s.id}
                                className="bg-[#161618] border border-[#26262A] rounded-lg p-2 space-y-1 text-left hover:border-neutral-500 transition"
                              >
                                <div className="flex items-center justify-between text-[10px] font-mono">
                                  <span className="font-bold text-[#6ccbde]">{s.time}</span>
                                  <span className="text-neutral-500 text-[9px]">{s.status}</span>
                                </div>
                                <div className="text-xs font-bold text-white truncate">{s.clientName}</div>
                                <div className="text-[10px] text-neutral-400 truncate">{s.sessionType}</div>
                                <div className="text-[9px] text-emerald-400 font-mono truncate">{s.coachName}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quick Add Button at bottom of column */}
                      <button
                        type="button"
                        onClick={() => openScheduleSlotModal(day.dateStr)}
                        className="w-full py-1 text-[10px] font-bold bg-[#161618] hover:bg-[#26262A] text-neutral-300 hover:text-white rounded-lg border border-[#26262A] flex items-center justify-center gap-1 transition"
                      >
                        <Plus className="w-3 h-3 text-[#6ccbde]" />
                        <span>Book Slot</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TRAINERIZE STYLE LOG SESSION & WORKOUT PLANNER */}
      {activeTab === 'log_and_plan' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Trainerize Pro Session Planner */}
          <TrainerizeSessionPlanner
            currentCoachName={currentCoachName}
            myAssignedClients={myAssignedClients}
          />

          {/* Recent Activity Stream */}
          <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
            {(() => {
              const mySessionPlans = givenSessionPlanRecords.filter(
                (plan) =>
                  isClientAssignedToCoach(plan.coachName, currentCoachName) ||
                  myAssignedClients.some(
                    (c) => c.name.toLowerCase() === plan.clientName.toLowerCase() || c.id === plan.clientId
                  )
              );

              return (
                <>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between pb-2 border-b border-[#26262A]">
                    <span>{currentCoachName}'s Prescribed Plan & Overload Log ({mySessionPlans.length})</span>
                    <span className="text-[10px] font-normal text-neutral-400">Assigned Clients</span>
                  </h4>

                  {mySessionPlans.length === 0 ? (
                    <div className="p-4 text-center bg-[#0A0A0B] border border-[#26262A] rounded-xl text-neutral-500 text-xs">
                      No session plans recorded yet for {currentCoachName}'s clients.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {mySessionPlans.slice(0, 5).map((plan) => (
                        <div key={plan.id} className="bg-[#0A0A0B] border border-[#26262A] p-3.5 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{plan.planTitle}</span>
                              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-medium">
                                {plan.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {plan.totalVolumeKg ? (
                                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                                  {plan.totalVolumeKg.toLocaleString()} kg Vol
                                </span>
                              ) : null}
                              <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                {plan.date}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-neutral-400">
                            <span>Client: <strong className="text-white">{plan.clientName}</strong></span>
                            <span>RPE {plan.rpeTarget} · {plan.durationMinutes} mins · Coach: {plan.coachName}</span>
                          </div>
                          <pre className="text-[10px] text-neutral-300 font-mono bg-[#161618] p-2.5 rounded-xl border border-[#202024] whitespace-pre-wrap max-h-28 overflow-y-auto no-scrollbar leading-relaxed">
                            {plan.planDetails}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 4: ASSESSMENTS */}
      {activeTab === 'assessments' && (
        <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-[#26262A]">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" /> Physical Assessment & Biomarker Tracking
              </h3>
              <p className="text-[11px] text-neutral-400">
                Track assessments for clients assigned to <strong className="text-purple-300">{currentCoachName}</strong>.
              </p>
            </div>
          </div>

          {assSuccessMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Assessment record added to System 2!
            </div>
          )}

          <form onSubmit={handleSaveAssessment} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                Select Client ({myAssignedClients.length} Assigned)
              </label>
              <select
                value={assClient}
                onChange={(e) => setAssClient(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                {myAssignedClients.length > 0 ? (
                  myAssignedClients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  ))
                ) : (
                  <option value="">No clients assigned to {currentCoachName} in Business OS</option>
                )}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={assWeight}
                  onChange={(e) => setAssWeight(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Body Fat %</label>
                <input
                  type="number"
                  step="0.1"
                  value={assBodyFat}
                  onChange={(e) => setAssBodyFat(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">VO2 Max</label>
                <input
                  type="number"
                  step="0.1"
                  value={assVo2}
                  onChange={(e) => setAssVo2(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Assessment Observations</label>
              <textarea
                rows={2}
                value={assNotes}
                onChange={(e) => setAssNotes(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-[#26262A] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl hover:bg-purple-500 transition"
            >
              Record Assessment to System 2
            </button>
          </form>

          {/* Assessment History */}
          <div className="space-y-2 pt-2 border-t border-[#26262A]">
            {(() => {
              const myAssessments = assessmentRecords.filter(
                (ass) =>
                  isClientAssignedToCoach(ass.assessedBy, currentCoachName) ||
                  myAssignedClients.some(
                    (c) => c.name.toLowerCase() === ass.clientName.toLowerCase() || c.id === ass.clientId
                  )
              );

              return (
                <>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {currentCoachName}'s Assessment Ledger ({myAssessments.length})
                  </h4>
                  {myAssessments.length === 0 ? (
                    <div className="p-4 text-center bg-[#0A0A0B] border border-[#26262A] rounded-xl text-neutral-500 text-xs">
                      No assessment records found for {currentCoachName}'s clients.
                    </div>
                  ) : (
                    myAssessments.map((ass) => (
                      <div key={ass.id} className="p-3 bg-[#0A0A0B] border border-[#26262A] rounded-xl text-xs space-y-1">
                        <div className="flex justify-between items-center font-bold text-white">
                          <span>{ass.clientName}</span>
                          <span className="font-mono text-purple-400">{ass.weightKg} kg | {ass.bodyFatPercentage}% BF</span>
                        </div>
                        <div className="text-[10px] text-neutral-400">VO2 Max: {ass.vo2Max} · Notes: {ass.notes}</div>
                        <div className="text-[10px] text-neutral-500">Assessed on {ass.date} by {ass.assessedBy}</div>
                      </div>
                    ))
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 5: MY ASSIGNED ROSTER */}
      {activeTab === 'my_clients' && (
        <div className="space-y-3">
          <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#26262A]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-[#6ccbde]/20 text-[#6ccbde] border border-[#6ccbde]/30 px-2 py-0.5 rounded uppercase">
                    Coach Room Roster
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                    {myAssignedClients.length} Assigned {myAssignedClients.length === 1 ? 'Client' : 'Clients'}
                  </span>
                </div>
                <h3 className="text-base font-black text-white mt-1 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#6ccbde]" />
                  <span>{currentCoachName}'s Assigned Client Profiles</span>
                </h3>
              </div>

              <div className="text-xs font-mono text-neutral-400 bg-[#0A0A0B] px-3 py-1.5 rounded-xl border border-[#26262A] self-start sm:self-auto">
                <span className="hidden sm:inline">Assigned in Business OS · </span>Active in <strong className="text-white">{currentCoachName}</strong>
              </div>
            </div>

            {myAssignedClients.length === 0 ? (
              <div className="p-8 text-center bg-[#0A0A0B] border border-[#26262A] rounded-xl space-y-3">
                <Users className="w-10 h-10 text-neutral-600 mx-auto" />
                <div className="text-sm font-bold text-white">
                  No Clients Currently Assigned to {currentCoachName}
                </div>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  When a client is assigned to <strong>{currentCoachName}</strong> from Business OS, their full profile, schedule, and workout history will appear here in this room exclusively.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myAssignedClients.map((client) => (
                  <div
                    key={client.id}
                    className="bg-[#0A0A0B] border border-[#26262A] hover:border-[#3e3e42] rounded-xl p-4 space-y-3 text-xs transition shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {client.id}
                        </span>
                        <h4 className="text-sm font-black text-white">{client.name}</h4>
                        <span className="text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                          <UserCheck className="w-3 h-3" /> Assigned: {client.assignedCoach}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-black/40 text-neutral-300 border border-white/10 px-2 py-0.5 rounded">
                          {client.status}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                          {client.attendancePercentage}% Attendance
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase">Program:</span>
                        <div className="font-bold text-white truncate">{client.program}</div>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase">Package & Payment:</span>
                        <div className="font-semibold text-neutral-300 truncate">
                          {client.package} • {client.paymentPlan}
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase">Contact:</span>
                        <div className="font-mono text-neutral-300 truncate">{client.contact}</div>
                      </div>
                    </div>

                    {client.healthNotes && (
                      <div className="text-[11px] text-neutral-300 bg-[#161618] p-2.5 rounded-lg border border-[#26262A]">
                        <strong className="text-neutral-400">Health & Training Notes:</strong> {client.healthNotes}
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] font-mono text-neutral-400">
                        Start: {client.startDate} • Renewal: {client.renewalDate}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            openScheduleSlotModal(scheduleSelectedDate, client.id);
                          }}
                          className="px-3 py-1.5 bg-[#6ccbde]/20 hover:bg-[#6ccbde]/30 text-[#6ccbde] border border-[#6ccbde]/40 rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Schedule Slots</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('log_and_plan');
                          }}
                          className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <Dumbbell className="w-3.5 h-3.5" />
                          <span>Log Workout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* POSTPONE / RESCHEDULE SESSION MODAL */}
      {postponeModalSession && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded uppercase">
                  Schedule Postponement / Reschedule
                </span>
                <h3 className="text-sm font-black text-white uppercase tracking-wider mt-1 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" /> Postpone Client Session
                </h3>
              </div>
              <button onClick={() => setPostponeModalSession(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPostpone} className="space-y-3 text-xs">
              <div className="bg-[#161618] border border-[#2e2e32] p-3 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-white">
                  {postponeModalSession.clientName} ({postponeModalSession.clientId})
                </div>
                <div className="text-[10px] text-neutral-400">
                  Current Scheduled Date: <strong className="text-neutral-200">{postponeModalSession.date} at {postponeModalSession.time}</strong>
                </div>
                <div className="text-[10px] text-[#6ccbde]">
                  Coach: {postponeModalSession.coachName} • {postponeModalSession.program}
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-bold block mb-1">New Session Date *</label>
                <input
                  type="date"
                  required
                  value={postponeNewDate}
                  onChange={(e) => setPostponeNewDate(e.target.value)}
                  className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-bold block mb-1">New Session Time *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 11:00 AM"
                  value={postponeNewTime}
                  onChange={(e) => setPostponeNewTime(e.target.value)}
                  className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-bold block mb-1">Reason / Notes for Postponement</label>
                <textarea
                  rows={2}
                  value={postponeReason}
                  onChange={(e) => setPostponeReason(e.target.value)}
                  className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  placeholder="e.g. Client requested postponement due to travel / personal delay..."
                />
              </div>

              <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  The session date will be updated instantly and marked as <strong>Postponed</strong> across Business OS and Coach Workspace.
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPostponeModalSession(null)}
                  className="w-1/2 py-2.5 bg-[#28282c] text-neutral-300 font-bold rounded-xl text-xs hover:bg-[#3e3e42] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black rounded-xl text-xs hover:opacity-90 transition shadow-lg shadow-amber-500/20"
                >
                  Confirm Postpone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POSTPONE TOAST */}
      {postponeToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-amber-500 text-black p-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-bottom duration-200 border border-amber-400">
          <CheckCircle2 className="w-5 h-5 shrink-0 fill-black text-amber-500" />
          <span>{postponeToast}</span>
        </div>
      )}

      {/* SCHEDULE CLIENT SLOTS MODAL (1-WEEK HORIZON & MULTI-DAY CAPABILITY) */}
      {showScheduleSlotModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-[#141416] border border-[#2c2c34] rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl my-auto text-white">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#26262e] pb-4">
              <div className="flex items-center gap-3">
                <span className="p-3 rounded-2xl bg-gradient-to-br from-[#6ccbde] to-cyan-500 text-black shadow-lg">
                  <Calendar className="w-6 h-6 stroke-[2.5]" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-[#6ccbde]/20 text-[#6ccbde] border border-[#6ccbde]/30 px-2 py-0.5 rounded uppercase">
                      Coach Workspace • 1-Week Planner
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                      System 2 Auto-Sync
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                    Schedule Client Session Slots
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Allocate slots across the 1-week cycle by selecting specific dates and days.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleSlotModal(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-[#26262A] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmScheduleSlots} className="space-y-4 text-xs">
              {/* Scheduling Mode Switcher */}
              <div className="bg-[#0A0A0B] p-1.5 rounded-2xl border border-[#26262e] grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSchedMode('week_recurrence')}
                  className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                    schedMode === 'week_recurrence'
                      ? 'bg-[#6ccbde] text-black shadow-md font-black'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>1-Week Multi-Day Scheduler</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSchedMode('single')}
                  className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                    schedMode === 'single'
                      ? 'bg-[#6ccbde] text-black shadow-md font-black'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Single Date Slot</span>
                </button>
              </div>

              {/* 1-Week Schedule Range & Multi-Day Selector */}
              <div className="bg-[#1b1b20] border border-[#2c2c36] rounded-2xl p-4 space-y-3.5 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2c2c36] pb-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-200 uppercase tracking-wider block">
                      1. Schedule Starting Date & 1-Week Horizon
                    </label>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {(() => {
                        const days = getWeekDaysFromDate(schedStartDate);
                        const first = days[0];
                        const last = days[6];
                        return `Week Range: ${first?.dayName} (${first?.monthDayStr}) → ${last?.dayName} (${last?.monthDayStr})`;
                      })()}
                    </span>
                  </div>

                  <input
                    type="date"
                    required
                    value={schedStartDate}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      setSchedStartDate(newStart);
                      const days = getWeekDaysFromDate(newStart);
                      // Preserve or re-populate selected days
                      const defaultDates = [days[0]?.dateStr, days[2]?.dateStr, days[4]?.dateStr].filter(Boolean) as string[];
                      setSchedSelectedDays(defaultDates);
                    }}
                    className="bg-[#0A0A0B] border border-[#3a3a46] rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#6ccbde]"
                  />
                </div>

                {schedMode === 'week_recurrence' && (
                  <div className="space-y-2.5">
                    {/* Quick Day Presets */}
                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Quick Presets:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setWeekDayPreset('mwf')}
                          className="px-2 py-0.5 rounded-lg bg-[#26262e] hover:bg-[#34343e] text-neutral-300 text-[10px] font-bold border border-[#3a3a46]"
                        >
                          Mon / Wed / Fri
                        </button>
                        <button
                          type="button"
                          onClick={() => setWeekDayPreset('tts')}
                          className="px-2 py-0.5 rounded-lg bg-[#26262e] hover:bg-[#34343e] text-neutral-300 text-[10px] font-bold border border-[#3a3a46]"
                        >
                          Tue / Thu / Sat
                        </button>
                        <button
                          type="button"
                          onClick={() => setWeekDayPreset('weekdays')}
                          className="px-2 py-0.5 rounded-lg bg-[#26262e] hover:bg-[#34343e] text-neutral-300 text-[10px] font-bold border border-[#3a3a46]"
                        >
                          Weekdays (5 Days)
                        </button>
                        <button
                          type="button"
                          onClick={() => setWeekDayPreset('weekends')}
                          className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold border border-amber-500/30"
                        >
                          Weekends (Sat & Sun)
                        </button>
                        <button
                          type="button"
                          onClick={() => setWeekDayPreset('all')}
                          className="px-2 py-0.5 rounded-lg bg-[#6ccbde]/20 hover:bg-[#6ccbde]/30 text-[#6ccbde] text-[10px] font-bold border border-[#6ccbde]/40"
                        >
                          All 7 Days
                        </button>
                      </div>
                    </div>

                    {/* 7-Day Interactive Matrix Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 pt-1">
                      {getWeekDaysFromDate(schedStartDate).map((d) => {
                        const isDaySelected = schedSelectedDays.includes(d.dateStr);
                        return (
                          <button
                            type="button"
                            key={d.dateStr}
                            onClick={() => toggleSelectDayInWeek(d.dateStr)}
                            className={`p-2 rounded-xl text-center border transition flex flex-col items-center justify-center space-y-1 relative ${
                              isDaySelected
                                ? 'bg-[#6ccbde] border-[#6ccbde] text-black shadow-md font-bold'
                                : 'bg-[#0A0A0B] border-[#30303a] text-neutral-400 hover:border-neutral-500 hover:text-white'
                            }`}
                          >
                            <span className="text-[10px] font-mono uppercase tracking-wider">{d.dayName}</span>
                            <span className="text-xs font-black">{d.monthDayStr}</span>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-extrabold ${
                                isDaySelected
                                  ? 'bg-black text-[#6ccbde]'
                                  : 'bg-[#1e1e24] text-neutral-500'
                              }`}
                            >
                              {isDaySelected ? '✓ Active' : '+ Add'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Client & Assigned Coach */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Client Select */}
                <div>
                  <label className="text-neutral-300 font-bold block mb-1">
                    2. Select Client ({myAssignedClients.length} Assigned) *
                  </label>
                  <select
                    value={schedClient}
                    onChange={(e) => {
                      const clId = e.target.value;
                      setSchedClient(clId);
                      const cl = clientMasterRecords.find((c) => c.id === clId);
                      if (cl) {
                        setSchedProgram(cl.program || '1:1 Elite Athletic Transformation');
                      }
                    }}
                    className="w-full bg-[#0A0A0B] border border-[#2c2c34] rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-[#6ccbde]"
                  >
                    {myAssignedClients.length > 0 ? (
                      myAssignedClients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.id}) • {c.program}
                        </option>
                      ))
                    ) : (
                      clientMasterRecords.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.id}) • {c.program}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Assigned Coach */}
                <div>
                  <label className="text-neutral-300 font-bold block mb-1">
                    3. Assigned Coach *
                  </label>
                  <select
                    value={schedCoach}
                    onChange={(e) => setSchedCoach(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#2c2c34] rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-[#6ccbde]"
                  >
                    <option value={currentCoachName}>⚡ {currentCoachName} (Active Coach Room)</option>
                    <option value="Coach Danish">Coach Danish</option>
                    <option value="Coach Roshan">Coach Roshan</option>
                    <option value="Coach Muqeeth">Coach Muqeeth</option>
                    <option value="Coach Ahmed (Head Coach)">Coach Ahmed (Head Coach)</option>
                    <option value="Coach Tariq (Martial Arts)">Coach Tariq (Martial Arts)</option>
                    <option value="Sara Al-Mansoori (Lead Nutritionist)">Sara Al-Mansoori (Lead Nutritionist)</option>
                    <option value="Dr. Zeyad (Physiotherapy)">Dr. Zeyad (Physiotherapy)</option>
                  </select>
                </div>
              </div>

              {/* Time Slot Picker & Quick Chips */}
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-bold block">
                  4. Session Time Slot *
                </label>
                <div className="flex items-center gap-1.5 flex-wrap pb-1">
                  {['06:00 AM', '07:30 AM', '09:00 AM', '10:30 AM', '04:00 PM', '05:30 PM', '07:00 PM', '08:30 PM'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSchedTime(t)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition ${
                        schedTime === t
                          ? 'bg-[#6ccbde] text-black shadow'
                          : 'bg-[#1b1b20] text-neutral-300 hover:text-white border border-[#2c2c34]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. 07:30 AM"
                  value={schedTime}
                  onChange={(e) => setSchedTime(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#2c2c34] rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-[#6ccbde]"
                />
              </div>

              {/* Program & Session Focus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-bold block mb-1">
                    5. Program / Package
                  </label>
                  <input
                    type="text"
                    value={schedProgram}
                    onChange={(e) => setSchedProgram(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#2c2c34] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6ccbde]"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 font-bold block mb-1">
                    6. Session Focus / Type
                  </label>
                  <select
                    value={schedSessionType}
                    onChange={(e) => setSchedSessionType(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#2c2c34] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#6ccbde]"
                  >
                    <option value="Strength & Conditioning">Strength & Conditioning</option>
                    <option value="Hypertrophy & Power">Hypertrophy & Power</option>
                    <option value="VO2 Max & Aerobic Engine">VO2 Max & Aerobic Engine</option>
                    <option value="Combat Striking & Pads">Combat Striking & Pads</option>
                    <option value="Calisthenics & Ring Work">Calisthenics & Ring Work</option>
                    <option value="Mobility & Active Recovery">Mobility & Active Recovery</option>
                  </select>
                </div>
              </div>

              {/* Venue & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-bold block mb-1">
                    7. Venue / Location
                  </label>
                  <select
                    value={schedLocation}
                    onChange={(e) => setSchedLocation(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#2c2c34] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#6ccbde]"
                  >
                    <option value="INTOKINE HQ Private Studio">INTOKINE HQ Private Studio</option>
                    <option value="Combat Ring">Combat Ring</option>
                    <option value="Calisthenics Outdoor Rig">Calisthenics Outdoor Rig</option>
                    <option value="Recovery & Mobility Suite">Recovery & Mobility Suite</option>
                    <option value="Online Live 1:1">Online Live 1:1</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 font-bold block mb-1">
                    8. Coach Session Notes / Target Focus
                  </label>
                  <input
                    type="text"
                    value={schedNotes}
                    onChange={(e) => setSchedNotes(e.target.value)}
                    placeholder="e.g. Dynamic warmup + heavy pull triples"
                    className="w-full bg-[#0A0A0B] border border-[#2c2c34] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6ccbde]"
                  />
                </div>
              </div>

              {/* Summary Card & Confirm */}
              <div className="bg-[#191920] border border-[#2c2c38] p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="font-black text-white">
                      Scheduling {schedMode === 'single' ? '1 Slot' : `${schedSelectedDays.length} Slot(s)`} for {clientMasterRecords.find((c) => c.id === schedClient)?.name || schedClient}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono">
                      Time: {schedTime} • Coach: {schedCoach}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowScheduleSlotModal(false)}
                    className="px-4 py-2.5 bg-[#26262e] text-neutral-300 font-bold rounded-xl text-xs hover:bg-[#34343e] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-[#6ccbde] to-cyan-400 text-black font-black rounded-xl text-xs hover:opacity-90 transition shadow-xl shadow-cyan-500/20 active:scale-95 flex items-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4 text-black stroke-[3]" />
                    <span>Confirm & Schedule Slots</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE SUCCESS TOAST */}
      {schedToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#6ccbde] text-black p-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-bottom duration-200 border border-cyan-300">
          <CheckCircle2 className="w-5 h-5 shrink-0 fill-black text-[#6ccbde]" />
          <span>{schedToast}</span>
        </div>
      )}
    </div>
  );
};
