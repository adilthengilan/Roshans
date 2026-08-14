import React, { useState } from 'react';
import { usePrimeStore } from '../../lib/store';
import { GivenSessionPlanRecord } from '../../types';
import coachDanishImg from '../../assets/images/coach_danish_portrait_1786654260335.jpg';
import coachRoshanImg from '../../assets/images/coach_roshan_portrait_1786654271869.jpg';
import coachMuqeethImg from '../../assets/images/coach_muqeeth_portrait_1786654282250.jpg';
import {
  TrendingUp,
  DollarSign,
  Users,
  Plus,
  CheckCircle2,
  X,
  Database,
  Activity,
  Search,
  Filter,
  Check,
  Briefcase,
  AlertCircle,
  UserCheck,
  ShieldCheck,
  ArrowUpRight,
  PieChart,
  Award,
  Layers,
  Building,
  CreditCard,
  Send,
  Calendar,
  ClipboardList,
  Eye,
  Clock,
  Target,
  FileText,
  RotateCcw,
  GitCommit,
  ArrowRight,
  History,
  Sparkles,
  ChevronRight,
  Apple,
  RefreshCw,
  HeartPulse,
  Dumbbell
} from 'lucide-react';

export const BusinessView: React.FC = () => {
  const {
    getMRR,
    getMonthFinanceSnapshot,
    coachAvatars,
    clientMasterRecords,
    coachMasterRecords,
    programMasterRecords,
    sessionMasterRecords,
    masterFinancialRecords,
    givenSessionPlanRecords,
    nutritionPlanRecords,
    assessmentRecords,
    addClientMasterRecord,
    addMasterFinancialRecord,
    updateFinancialRecordStatus,
    syncSessionToSystem2,
    addProgramMasterRecord,
    updateClientCoach,
    recordClientPayment,
  } = usePrimeStore();

  // Core Business OS Tabs
  const [activeTab, setActiveTab] = useState<'financials_and_fees' | 'coach_assignment_and_stats' | 'session_plans_history' | 'nutrition_and_assessments' | 'master_packages'>('financials_and_fees');

  // Search & Filter States
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [pendingFeesFilter, setPendingFeesFilter] = useState<'All' | 'Pending' | 'Paid'>('Pending');
  const [coachFilter, setCoachFilter] = useState<string>('All');
  const [financialSectionView, setFinancialSectionView] = useState<'fees_and_growth' | 'staff_payments_and_credits'>('staff_payments_and_credits');

  // Given Session Plan Search & Filter States
  const [sessionPlanClientSearch, setSessionPlanClientSearch] = useState('');
  const [sessionPlanDateSearch, setSessionPlanDateSearch] = useState('');
  const [sessionPlanCoachFilter, setSessionPlanCoachFilter] = useState('All');
  const [sessionPlanCategoryFilter, setSessionPlanCategoryFilter] = useState('All');
  const [selectedSessionPlanModal, setSelectedSessionPlanModal] = useState<GivenSessionPlanRecord | null>(null);

  // Nutrition & Assessments Tab States
  const [nutritionSubView, setNutritionSubView] = useState<'nutrition' | 'assessments'>('nutrition');
  const [nutSearchTerm, setNutSearchTerm] = useState('');
  const [selectedClientNutritionModal, setSelectedClientNutritionModal] = useState<any | null>(null);
  const [selectedClientAssessmentsModal, setSelectedClientAssessmentsModal] = useState<any | null>(null);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Client Timeline Modal State (Starting Date -> Last Session Plan)
  const [clientTimelineModalName, setClientTimelineModalName] = useState<string | null>(null);
  const [timelineSortOrder, setTimelineSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showAddFinModal, setShowAddFinModal] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [paymentModalClient, setPaymentModalClient] = useState<any | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('1000');
  const [assignCoachModalClient, setAssignCoachModalClient] = useState<any | null>(null);
  const [selectedCoachToAssign, setSelectedCoachToAssign] = useState<string>('Coach Danish');

  // Schedule Client to Coach Modal State (Business OS -> Coach Workspace)
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedClientId, setSchedClientId] = useState('CLI-101');
  const [schedCoachName, setSchedCoachName] = useState('Coach Ahmed (Head Coach)');
  const [schedDate, setSchedDate] = useState('2026-08-12');
  const [schedTime, setSchedTime] = useState('09:30 AM');
  const [schedProgram, setSchedProgram] = useState('KATBA Elite Performance Package');
  const [schedSessionType, setSchedSessionType] = useState('1:1 Personal Athletic Training');
  const [schedLocation, setSchedLocation] = useState('Downtown Private Gym');
  const [schedNotes, setSchedNotes] = useState('High intensity athletic conditioning');
  const [scheduleSuccessToast, setScheduleSuccessToast] = useState<string | null>(null);

  // Recurring 1-Month Schedule Options
  const [schedMode, setSchedMode] = useState<'recurring_1month' | 'single'>('recurring_1month');
  const [schedPresetPattern, setSchedPresetPattern] = useState<string>('3_days_mwf');
  const [schedCustomDays, setSchedCustomDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);

  // Staff Payment & Pending Credit Modal State
  const [showStaffPayoutModal, setShowStaffPayoutModal] = useState(false);
  const [payoutStaffName, setPayoutStaffName] = useState('Coach Tariq (Martial Arts)');
  const [payoutCategory, setPayoutCategory] = useState('Coach Payout');
  const [payoutAmount, setPayoutAmount] = useState('7920');
  const [payoutStatus, setPayoutStatus] = useState<'Cleared' | 'Pending'>('Cleared');
  const [payoutDesc, setPayoutDesc] = useState('Staff session payout settlement');
  const [payoutSuccessToast, setPayoutSuccessToast] = useState<string | null>(null);

  // Form: Add Master Client
  const [newClientName, setNewClientName] = useState('');
  const [newClientProgram, setNewClientProgram] = useState('KATBA Elite Performance Package');
  const [newClientCoach, setNewClientCoach] = useState('Coach Danish');
  const [newClientVal, setNewClientVal] = useState('24000');
  const [newClientPaid, setNewClientPaid] = useState('12000');
  const [newClientContact, setNewClientContact] = useState('+971 50 ');

  // Form: Add Financial Record
  const [finType, setFinType] = useState<'Revenue' | 'Expense'>('Revenue');
  const [finCategory, setFinCategory] = useState('Client Package Fee');
  const [finDesc, setFinDesc] = useState('');
  const [finAmount, setFinAmount] = useState('12000');

  // Form: Add Master Package
  const [planTitle, setPlanTitle] = useState('');
  const [planCategory, setPlanCategory] = useState<'Athletics' | 'Wellness' | '1:1 Personal' | 'Group Batch'>('1:1 Personal');
  const [planDesc, setPlanDesc] = useState('');
  const [planWeeks, setPlanWeeks] = useState('12');
  const [planPrice, setPlanPrice] = useState('18000');
  const [planCoach, setPlanCoach] = useState('Coach Ahmed (Head Coach)');

  // Financial Computations
  const mrr = getMRR();
  const financeSnap = getMonthFinanceSnapshot();

  const masterRevenue = masterFinancialRecords
    .filter((f) => f.type === 'Revenue')
    .reduce((acc, f) => acc + (f.amount || 0), 0);
  const masterExpenses = masterFinancialRecords
    .filter((f) => f.type === 'Expense')
    .reduce((acc, f) => acc + (f.amount || 0), 0);

  const totalRevenue = masterRevenue > 0 ? masterRevenue : (financeSnap?.income || 0);
  const totalExpenses = masterExpenses > 0 ? masterExpenses : (financeSnap?.expenses || 0);
  const netOperatingProfit = totalRevenue - totalExpenses;
  const netProfitMargin = totalRevenue > 0 ? Math.round((netOperatingProfit / totalRevenue) * 100) : (financeSnap?.savingsRate || 0);

  const totalOutstandingFees = clientMasterRecords.reduce(
    (acc, client) => acc + (client.amountOutstanding || 0),
    0
  );

  const totalPackageValueSum = clientMasterRecords.reduce(
    (acc, client) => acc + (client.totalPackageValue || 0),
    0
  );

  const totalCollectedFeesSum = clientMasterRecords.reduce(
    (acc, client) => acc + (client.amountPaid || 0),
    0
  );

  // Coach Workspace Stats Calculations
  const availableCoaches = [
    'Coach Danish',
    'Coach Roshan',
    'Coach Muqeeth',
    'Coach Ahmed (Head Coach)',
    'Coach Tariq (Martial Arts)',
    'Sara Al-Mansoori (Lead Nutritionist)',
    'Dr. Zeyad (Physiotherapy)',
  ];

  // Derived Session Plans History filtering
  const availablePlanCoaches = Array.from(
    new Set([
      ...availableCoaches,
      ...(givenSessionPlanRecords || []).map((p) => p.coachName),
    ])
  ).filter(Boolean);

  const availablePlanCategories = Array.from(
    new Set((givenSessionPlanRecords || []).map((p) => p.category))
  ).filter(Boolean);

  const filteredGivenPlans = (givenSessionPlanRecords || []).filter((plan) => {
    const q = sessionPlanClientSearch.trim().toLowerCase();
    const matchesClient =
      !q ||
      plan.clientName.toLowerCase().includes(q) ||
      plan.clientId.toLowerCase().includes(q) ||
      plan.planTitle.toLowerCase().includes(q) ||
      plan.targetFocus.toLowerCase().includes(q);

    const matchesDate =
      !sessionPlanDateSearch.trim() ||
      plan.date === sessionPlanDateSearch.trim();

    const matchesCoach =
      sessionPlanCoachFilter === 'All' ||
      plan.coachName === sessionPlanCoachFilter;

    const matchesCategory =
      sessionPlanCategoryFilter === 'All' ||
      plan.category === sessionPlanCategoryFilter;

    return matchesClient && matchesDate && matchesCoach && matchesCategory;
  });

  // Derived Client Session Plan Journey Timeline (Starting Date -> Last Plan)
  const availableTimelineClients = Array.from(
    new Set([
      ...(givenSessionPlanRecords || []).map((p) => p.clientName),
      ...(clientMasterRecords || []).map((c) => c.name),
    ])
  ).filter(Boolean);

  const selectedClientTimelinePlans = (givenSessionPlanRecords || [])
    .filter((p) =>
      clientTimelineModalName
        ? p.clientName.toLowerCase() === clientTimelineModalName.toLowerCase() ||
          p.clientId.toLowerCase() === clientTimelineModalName.toLowerCase()
        : false
    )
    .sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return timelineSortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

  const chronologicallySortedPlans = [...selectedClientTimelinePlans].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const startingPlan = chronologicallySortedPlans[0];
  const lastPlan = chronologicallySortedPlans[chronologicallySortedPlans.length - 1];

  const coachStats = availableCoaches.map((coachName) => {
    const clientsForCoach = clientMasterRecords.filter(
      (c) => c.assignedCoach === coachName || c.assignedCoach?.includes(coachName.split(' ')[1])
    );
    const sessionsForCoach = sessionMasterRecords.filter(
      (s) => s.coach === coachName || s.coach?.includes(coachName.split(' ')[1])
    );
    const totalRevenueGenerated = clientsForCoach.reduce((acc, c) => acc + (c.totalPackageValue || 0), 0);
    const totalOutstanding = clientsForCoach.reduce((acc, c) => acc + (c.amountOutstanding || 0), 0);

    return {
      coachName,
      clientCount: clientsForCoach.length,
      sessionCount: sessionsForCoach.length,
      revenue: totalRevenueGenerated,
      pendingFees: totalOutstanding,
      clients: clientsForCoach,
    };
  });

  // Filtered Clients for Pending Fees & Coach Assignment
  const filteredClients = clientMasterRecords.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
      client.program.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(clientSearchTerm.toLowerCase());

    const matchesCoach =
      coachFilter === 'All' || client.assignedCoach === coachFilter;

    if (pendingFeesFilter === 'Pending') {
      return matchesSearch && matchesCoach && (client.amountOutstanding || 0) > 0;
    }
    if (pendingFeesFilter === 'Paid') {
      return matchesSearch && matchesCoach && (client.amountOutstanding || 0) === 0;
    }
    return matchesSearch && matchesCoach;
  });

  // Handlers
  const handleAddMasterClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const val = Number(newClientVal) || 24000;
    const paid = Number(newClientPaid) || 12000;
    const outstanding = Math.max(0, val - paid);

    addClientMasterRecord({
      name: newClientName.trim(),
      status: 'Active',
      program: newClientProgram,
      assignedCoach: newClientCoach,
      assignedNutritionist: 'Sara Al-Mansoori (Lead Nutritionist)',
      package: newClientProgram,
      totalPackageValue: val,
      amountPaid: paid,
      amountOutstanding: outstanding,
      paymentPlan: outstanding > 0 ? 'Milestone Installments' : 'Full Clean',
      attendancePercentage: 100,
      contact: newClientContact.trim() || '+971 50 000 0000',
      startDate: new Date().toISOString().split('T')[0],
      renewalDate: '2027-02-01',
      leadSource: 'Business OS Intake',
      healthNotes: 'Registered in Business OS Master DB.',
    });

    setShowAddClientModal(false);
    setNewClientName('');
  };

  const handleAddFinancialTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finDesc.trim()) return;

    addMasterFinancialRecord({
      date: new Date().toISOString().split('T')[0],
      type: finType,
      category: finCategory,
      description: finDesc.trim(),
      amount: Number(finAmount) || 0,
      status: 'Cleared',
      sourceSystem: 'Business OS Financials',
    });

    setShowAddFinModal(false);
    setFinDesc('');
  };

  const handleAddMasterProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planTitle.trim()) return;

    addProgramMasterRecord({
      title: planTitle.trim(),
      category: planCategory,
      description: planDesc.trim() || 'Custom athletic transformation protocol.',
      durationWeeks: Number(planWeeks) || 12,
      priceAED: Number(planPrice) || 18000,
      assignedLeadCoach: planCoach,
      subscriberCount: 1,
    });

    setShowAddPlanModal(false);
    setPlanTitle('');
    setPlanDesc('');
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalClient) return;

    const amt = Number(paymentAmount) || 0;
    if (amt <= 0) return;

    recordClientPayment(paymentModalClient.id, amt);

    // Also record transaction in Financials
    addMasterFinancialRecord({
      date: new Date().toISOString().split('T')[0],
      type: 'Revenue',
      category: 'Fee Collection',
      description: `Pending Fee Payment from ${paymentModalClient.name} (${paymentModalClient.id})`,
      amount: amt,
      status: 'Cleared',
      sourceSystem: 'Pending Fee Tracker',
    });

    setPaymentModalClient(null);
  };

  const handleConfirmCoachAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignCoachModalClient) return;

    updateClientCoach(assignCoachModalClient.id, selectedCoachToAssign);
    setAssignCoachModalClient(null);
  };

  const handleScheduleClientToCoach = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClient = clientMasterRecords.find((c) => c.id === schedClientId);
    const clientName = targetClient ? targetClient.name : 'Selected Client';

    if (schedMode === 'single') {
      syncSessionToSystem2({
        clientId: schedClientId,
        clientName: clientName,
        coachName: schedCoachName,
        date: schedDate,
        time: schedTime,
        sessionType: schedSessionType,
        program: schedProgram,
        status: 'Scheduled',
        attendanceStatus: 'Scheduled',
        location: schedLocation,
        notes: schedNotes,
        loggedByStaff: 'Business OS Admin',
      });

      setScheduleSuccessToast(
        `Single session scheduled for ${clientName} with ${schedCoachName} on ${schedDate} at ${schedTime}! Synced to Coach Workspace.`
      );
    } else {
      // 1-Month Auto-Schedule (4 Weeks Recurring)
      const selectedDays =
        schedPresetPattern === '3_days_mwf'
          ? ['Mon', 'Wed', 'Fri']
          : schedPresetPattern === '2_days_tt'
          ? ['Tue', 'Thu']
          : schedPresetPattern === '4_days_mttf'
          ? ['Mon', 'Tue', 'Thu', 'Fri']
          : schedPresetPattern === 'weekends'
          ? ['Sat', 'Sun']
          : schedPresetPattern === '5_days_weekdays'
          ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
          : schedCustomDays;

      const startDate = new Date(schedDate || '2026-08-12');
      let createdCount = 0;

      // Generate 28 days (4 weeks = 1 month) from start date
      for (let i = 0; i < 28; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
        if (selectedDays.includes(dayName)) {
          const dateStr = currentDate.toISOString().split('T')[0];
          syncSessionToSystem2({
            clientId: schedClientId,
            clientName: clientName,
            coachName: schedCoachName,
            date: dateStr,
            time: schedTime,
            sessionType: schedSessionType,
            program: schedProgram,
            status: 'Scheduled',
            attendanceStatus: 'Scheduled',
            location: schedLocation,
            notes: `[1-Month Auto-Package: ${selectedDays.join('/')}] ${schedNotes}`,
            loggedByStaff: 'Business OS Admin',
          });
          createdCount++;
        }
      }

      setScheduleSuccessToast(
        `1-Month Package Generated! ${createdCount} sessions scheduled for ${clientName} with ${schedCoachName} across 4 weeks (${selectedDays.join(', ')}). Synced to Coach Workspace!`
      );
    }

    setShowScheduleModal(false);

    setTimeout(() => {
      setScheduleSuccessToast(null);
    }, 7000);
  };

  const handleIssueStaffPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(payoutAmount) || 0;
    if (amt <= 0) return;

    addMasterFinancialRecord({
      date: new Date().toISOString().split('T')[0],
      type: 'Expense',
      category: payoutCategory,
      description: `${payoutDesc || 'Staff Payout Settlement'} - ${payoutStaffName}`,
      amount: amt,
      status: payoutStatus,
      sourceSystem: 'Business OS Staff Payroll',
    });

    setPayoutSuccessToast(
      `Payout transaction of ${amt.toLocaleString()} AED recorded for ${payoutStaffName} (${payoutStatus})!`
    );
    setShowStaffPayoutModal(false);

    setTimeout(() => {
      setPayoutSuccessToast(null);
    }, 6000);
  };

  return (
    <div className="space-y-4 pb-20 max-w-5xl mx-auto px-3 sm:px-4 pt-3">
      {/* Toast Alert Banners */}
      {scheduleSuccessToast && (
        <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-2xl p-4 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{scheduleSuccessToast}</span>
          </div>
          <button onClick={() => setScheduleSuccessToast(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {payoutSuccessToast && (
        <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-2xl p-4 text-cyan-300 text-xs font-bold flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>{payoutSuccessToast}</span>
          </div>
          <button onClick={() => setPayoutSuccessToast(null)} className="text-cyan-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Business OS Header */}
      <div className="bg-[#14161f] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ec2226]" />
              <span className="text-[11px] font-semibold text-[#ec2226] uppercase tracking-wider">
                Management OS
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Business Operations
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Financial performance, client enrollment, coach assignments, and program management.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setSyncToast('Workspaces verified and synchronized.');
                setTimeout(() => setSyncToast(null), 3000);
              }}
              className="px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 hover:text-white font-medium text-xs rounded-xl border border-white/10 transition flex items-center gap-1.5"
              title="Sync workspaces"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sync</span>
            </button>

            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-white font-medium text-xs rounded-xl border border-white/10 transition flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-[#06b6d4]" />
              <span>Schedule</span>
            </button>

            <button
              onClick={() => setShowAddClientModal(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#ec2226] to-[#06b6d4] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm hover:opacity-95 transition"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New Client</span>
            </button>
          </div>
        </div>

        {/* 4 Clean Balanced Bright & Dark Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1 border-t border-white/[0.06]">
          {/* Card 1: MRR (Crisp Bright Card) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 space-y-1.5 shadow-sm hover:shadow transition">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
              <span>Monthly Revenue (MRR)</span>
              <span className="p-1 rounded-lg bg-cyan-50 text-[#0891b2]">
                <DollarSign className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tracking-tight">
              {mrr.toLocaleString()} <span className="text-xs text-slate-500 font-sans font-normal">AED</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.2% MoM</span>
            </div>
          </div>

          {/* Card 2: Pending Fees (Crisp Bright Card with Beet Highlight) */}
          <div className="bg-white border border-rose-200/90 rounded-2xl p-3.5 space-y-1.5 shadow-sm hover:shadow transition">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
              <span>Pending Unpaid Fees</span>
              <span className="p-1 rounded-lg bg-rose-50 text-[#ec2226]">
                <AlertCircle className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#ec2226] font-mono tracking-tight">
              {totalOutstandingFees.toLocaleString()} <span className="text-xs text-slate-500 font-sans font-normal">AED</span>
            </div>
            <div className="text-[11px] text-slate-600 font-medium">
              {clientMasterRecords.filter((c) => (c.amountOutstanding || 0) > 0).length} clients pending
            </div>
          </div>

          {/* Card 3: Collected Capital (Crisp Bright Card with Emerald Highlight) */}
          <div className="bg-white border border-emerald-200/90 rounded-2xl p-3.5 space-y-1.5 shadow-sm hover:shadow transition">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
              <span>Collected Capital</span>
              <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tracking-tight">
              {totalCollectedFeesSum.toLocaleString()} <span className="text-xs text-slate-500 font-sans font-normal">AED</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold">
              {Math.round((totalCollectedFeesSum / (totalPackageValueSum || 1)) * 100)}% collection rate
            </div>
          </div>

          {/* Card 4: Active Clients (Crisp Bright Card) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 space-y-1.5 shadow-sm hover:shadow transition">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
              <span>Enrolled Clients</span>
              <span className="p-1 rounded-lg bg-indigo-50 text-indigo-600">
                <Users className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tracking-tight">
              {clientMasterRecords.length} <span className="text-xs text-slate-500 font-sans font-normal">Active</span>
            </div>
            <div className="text-[11px] text-slate-600 font-medium">
              Across {availableCoaches.length} staff coaches
            </div>
          </div>
        </div>
      </div>

      {syncToast && (
        <div className="bg-emerald-950/80 border border-emerald-500/30 rounded-xl p-3 text-emerald-300 text-xs font-medium flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncToast}</span>
          </div>
          <button onClick={() => setSyncToast(null)} className="text-emerald-400 hover:text-white transition">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Core Business OS Tabs Bar */}
      <div className="flex bg-[#14161f] border border-white/[0.08] rounded-2xl p-1 gap-1 overflow-x-auto no-scrollbar whitespace-nowrap">
        <button
          onClick={() => setActiveTab('financials_and_fees')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
            activeTab === 'financials_and_fees'
              ? 'bg-white text-[#0d0e12] shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Financials</span>
        </button>

        <button
          onClick={() => setActiveTab('coach_assignment_and_stats')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
            activeTab === 'coach_assignment_and_stats'
              ? 'bg-white text-[#0d0e12] shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Coach Roster & Assign</span>
        </button>

        <button
          onClick={() => setActiveTab('session_plans_history')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
            activeTab === 'session_plans_history'
              ? 'bg-white text-[#0d0e12] shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Session Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('nutrition_and_assessments')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
            activeTab === 'nutrition_and_assessments'
              ? 'bg-white text-[#0d0e12] shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Apple className="w-3.5 h-3.5" />
          <span>Nutrition & Assessments</span>
        </button>

        <button
          onClick={() => setActiveTab('master_packages')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition flex items-center justify-center gap-1.5 ${
            activeTab === 'master_packages'
              ? 'bg-white text-[#0d0e12] shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Programs ({programMasterRecords.length})</span>
        </button>
      </div>

      {/* TAB 1: FINANCIALS, STAFF PAYMENTS & PENDING CREDITS */}
      {activeTab === 'financials_and_fees' && (
        <div className="space-y-4">
          {/* Subtab Toggle: Staff Payments & Credits vs Pending Client Fees */}
          <div className="bg-[#1c1c1c] border border-[#2e2e32] p-1.5 rounded-2xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 w-full sm:w-auto">
              <button
                onClick={() => setFinancialSectionView('staff_payments_and_credits')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                  financialSectionView === 'staff_payments_and_credits'
                    ? 'bg-[#6ccbde] text-black shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-[#28282c]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Staff Payments, History & Pending Credits</span>
                <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-mono font-bold">
                  {masterFinancialRecords.filter((f) => f.category === 'Coach Payout' || f.category === 'Staff Salary').length} Tx
                </span>
              </button>

              <button
                onClick={() => setFinancialSectionView('fees_and_growth')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                  financialSectionView === 'fees_and_growth'
                    ? 'bg-[#ec2226] text-white shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-[#28282c]'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Pending Fees & Revenue Ledger</span>
              </button>
            </div>

            <button
              onClick={() => setShowStaffPayoutModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-[#6ccbde] text-black font-extrabold text-xs rounded-xl shadow hover:opacity-90 transition shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Issue Staff Payment / Clear Credit
            </button>
          </div>

          {/* VIEW A: STAFF PAYMENTS HISTORY, STATISTICS & PENDING CREDITS */}
          {financialSectionView === 'staff_payments_and_credits' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Staff Financial KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                <div className="bg-[#1c1c1c] border border-emerald-500/40 rounded-2xl p-3.5 space-y-1 bg-gradient-to-b from-emerald-500/10 to-transparent">
                  <div className="flex items-center justify-between text-neutral-400 text-[10px] font-bold uppercase tracking-wider">
                    <span>Total Cleared Staff Payouts</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-extrabold text-emerald-400 font-mono tracking-tight">
                    {masterFinancialRecords
                      .filter((f) => (f.category === 'Coach Payout' || f.category === 'Staff Salary') && f.status === 'Cleared')
                      .reduce((acc, f) => acc + f.amount, 0)
                      .toLocaleString()}{' '}
                    <span className="text-xs font-normal text-neutral-400">AED</span>
                  </div>
                  <div className="text-[10px] text-neutral-400">Settled salaries & session fees</div>
                </div>

                <div className="bg-[#1c1c1c] border border-amber-500/40 rounded-2xl p-3.5 space-y-1 bg-gradient-to-b from-amber-500/10 to-transparent">
                  <div className="flex items-center justify-between text-neutral-300 text-[10px] font-bold uppercase tracking-wider">
                    <span>Pending Staff Credits</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl font-extrabold text-amber-400 font-mono tracking-tight">
                    {masterFinancialRecords
                      .filter((f) => (f.category === 'Coach Payout' || f.category === 'Staff Salary') && f.status === 'Pending')
                      .reduce((acc, f) => acc + f.amount, 0)
                      .toLocaleString()}{' '}
                    <span className="text-xs font-normal text-neutral-400">AED</span>
                  </div>
                  <div className="text-[10px] text-amber-400 font-medium">Accrued pending settlement</div>
                </div>

                <div className="bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-neutral-400 text-[10px] font-bold uppercase tracking-wider">
                    <span>Average Staff Payout</span>
                    <CreditCard className="w-4 h-4 text-[#6ccbde]" />
                  </div>
                  <div className="text-xl font-extrabold text-white font-mono tracking-tight">
                    {Math.round(
                      coachMasterRecords.reduce((acc, c) => acc + c.amountEarned, 0) / (coachMasterRecords.length || 1)
                    ).toLocaleString()}{' '}
                    <span className="text-xs font-normal text-neutral-400">AED/Coach</span>
                  </div>
                  <div className="text-[10px] text-neutral-400">Based on monthly session volume</div>
                </div>

                <div className="bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-neutral-400 text-[10px] font-bold uppercase tracking-wider">
                    <span>Active Coaches on Payroll</span>
                    <Users className="w-4 h-4 text-[#6ccbde]" />
                  </div>
                  <div className="text-xl font-extrabold text-white font-mono tracking-tight">
                    {coachMasterRecords.length}{' '}
                    <span className="text-xs font-normal text-neutral-400">Staff Members</span>
                  </div>
                  <div className="text-[10px] text-[#6ccbde] font-medium">Head coaches, nutrition & physio</div>
                </div>
              </div>

              {/* Staff Credits & Monthly Payout Accrual Matrix Table */}
              <div className="bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2e2e32] pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#6ccbde]" /> Coach Credits & Accruals
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Real-time session earnings, rate per session, total earned, and credit clearance controls.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowStaffPayoutModal(true)}
                    className="sm:hidden px-3 py-1.5 bg-[#6ccbde] text-black font-extrabold text-xs rounded-xl"
                  >
                    + Settle
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#2e2e32] text-neutral-400 text-[10px] uppercase font-mono">
                        <th className="py-2 px-3">Coach / Staff</th>
                        <th className="py-2 px-3">Role</th>
                        <th className="py-2 px-3 text-center">Sessions</th>
                        <th className="py-2 px-3 text-right">Rate</th>
                        <th className="py-2 px-3 text-right">Earned</th>
                        <th className="py-2 px-3 text-center">Status</th>
                        <th className="py-2 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2e2e32]">
                      {coachMasterRecords.map((coach) => {
                        const hasPendingCredit = coach.amountEarned > 7000;
                        return (
                          <tr key={coach.id} className="hover:bg-[#28282c]/50 transition">
                            <td className="py-3 px-3">
                              <div className="font-bold text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#6ccbde]" />
                                <span>{coach.name}</span>
                              </div>
                              <div className="text-[10px] font-mono text-neutral-500">ID: {coach.id}</div>
                            </td>
                            <td className="py-3 px-3 text-neutral-300 font-medium">{coach.specialty}</td>
                            <td className="py-3 px-3 text-center font-mono font-bold text-white">
                              {coach.sessionsCompletedThisMonth} sessions
                            </td>
                            <td className="py-3 px-3 text-right font-mono text-neutral-300">
                              {coach.payoutRatePerSession} AED
                            </td>
                            <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-400">
                              {coach.amountEarned.toLocaleString()} AED
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                                  hasPendingCredit
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}
                              >
                                {hasPendingCredit ? 'Pending' : 'Cleared'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => {
                                  setPayoutStaffName(coach.name);
                                  setPayoutAmount(coach.amountEarned.toString());
                                  setPayoutCategory('Coach Payout');
                                  setPayoutDesc(`Monthly session payout settlement for ${coach.name}`);
                                  setShowStaffPayoutModal(true);
                                }}
                                className="px-2.5 py-1 bg-[#28282c] hover:bg-[#323236] text-white hover:text-[#6ccbde] border border-[#3e3e42] rounded-lg text-[11px] font-bold transition flex items-center gap-1 ml-auto"
                              >
                                <DollarSign className="w-3 h-3 text-emerald-400" />
                                <span>Settle</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Staff Payment History Ledger */}
              <div className="bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                      <History className="w-4 h-4 text-[#6ccbde]" /> Staff Payment History
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Chronological history of coach payouts, salaries, and staff credits.
                    </p>
                  </div>

                  <span className="text-xs font-mono text-neutral-400 bg-[#28282c] px-3 py-1 rounded-xl border border-[#3e3e42]">
                    Total Records:{' '}
                    <strong className="text-white">
                      {masterFinancialRecords.filter((f) => f.category === 'Coach Payout' || f.category === 'Staff Salary').length}
                    </strong>
                  </span>
                </div>

                <div className="space-y-2">
                  {masterFinancialRecords
                    .filter((f) => f.category === 'Coach Payout' || f.category === 'Staff Salary')
                    .map((fin) => (
                      <div
                        key={fin.id}
                        className="p-3.5 bg-[#161618] border border-[#2e2e32] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white">{fin.description}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#28282c] text-neutral-300 border border-[#3e3e42]">
                              {fin.category}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                                fin.status === 'Cleared'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {fin.status}
                            </span>
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono">
                            Date: {fin.date} • Source: {fin.sourceSystem} • Ledger ID: {fin.id}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center font-mono">
                          <div className="text-right">
                            <div className="text-sm font-black text-[#ec2226]">-{fin.amount.toLocaleString()} AED</div>
                            <div className="text-[10px] text-neutral-500">{fin.status === 'Cleared' ? 'Cleared' : 'Pending'}</div>
                          </div>

                          {fin.status === 'Pending' && (
                            <button
                              onClick={() => updateFinancialRecordStatus(fin.id, 'Cleared')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-xs rounded-xl transition shadow"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW B: PENDING CLIENT FEES & FINANCIAL GROWTH LEDGER */}
          {financialSectionView === 'fees_and_growth' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Section 1: Pending Fees Tracker */}
              <div className="bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2e2e32] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-[#ec2226]" />
                      <h3 className="text-sm font-extrabold text-white tracking-wide uppercase">
                        Pending Fees & Collection Ledger
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Track client fee installments, outstanding package balances, and record payments directly.
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="flex items-center gap-2">
                    <div className="flex bg-[#28282c] p-1 rounded-xl border border-[#3e3e42] text-xs">
                      <button
                        onClick={() => setPendingFeesFilter('Pending')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition ${
                          pendingFeesFilter === 'Pending'
                            ? 'bg-[#ec2226] text-white shadow'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Pending Only ({clientMasterRecords.filter((c) => (c.amountOutstanding || 0) > 0).length})
                      </button>
                      <button
                        onClick={() => setPendingFeesFilter('All')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition ${
                          pendingFeesFilter === 'All'
                            ? 'bg-[#ec2226] text-white shadow'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        All Clients ({clientMasterRecords.length})
                      </button>
                      <button
                        onClick={() => setPendingFeesFilter('Paid')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition ${
                          pendingFeesFilter === 'Paid'
                            ? 'bg-emerald-600 text-white shadow'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Fully Paid ({clientMasterRecords.filter((c) => (c.amountOutstanding || 0) === 0).length})
                      </button>
                    </div>
                  </div>
                </div>

                {/* Client Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search pending client by name, package or client ID..."
                    value={clientSearchTerm}
                    onChange={(e) => setClientSearchTerm(e.target.value)}
                    className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#6ccbde]"
                  />
                </div>

                {/* Pending Fees Client List */}
                <div className="space-y-2">
                  {filteredClients.length === 0 ? (
                    <div className="text-center py-8 text-xs text-neutral-500">
                      No clients match the selected fee filter.
                    </div>
                  ) : (
                    filteredClients.map((client) => {
                      const isPending = (client.amountOutstanding || 0) > 0;
                      const percentPaid = Math.round(
                        ((client.amountPaid || 0) / (client.totalPackageValue || 1)) * 100
                      );

                      return (
                        <div
                          key={client.id}
                          className="p-3.5 rounded-xl border border-[#2e2e32] bg-[#161618] hover:border-[#3e3e42] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-white">{client.name}</span>
                              <span className="text-[10px] text-neutral-400 font-mono">({client.id})</span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                  isPending
                                    ? 'bg-[#ec2226]/20 text-[#ec2226] border border-[#ec2226]/40'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                }`}
                              >
                                {isPending ? `Pending ${client.amountOutstanding.toLocaleString()} AED` : 'Fully Paid'}
                              </span>
                            </div>

                            <div className="text-xs text-neutral-400 flex flex-wrap items-center gap-3">
                              <span>Package: <strong className="text-neutral-200">{client.program}</strong></span>
                              <span>Coach: <strong className="text-[#6ccbde]">{client.assignedCoach}</strong></span>
                              <span>Contact: <strong className="text-neutral-200">{client.contact}</strong></span>
                            </div>

                            {/* Progress Bar for Fee Collection */}
                            <div className="w-full max-w-md bg-[#28282c] rounded-full h-1.5 overflow-hidden flex items-center mt-1">
                              <div
                                className={`h-full ${isPending ? 'bg-gradient-to-r from-[#ec2226] to-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min(100, percentPaid)}%` }}
                              />
                            </div>
                          </div>

                          {/* Right Amount & Actions */}
                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center font-mono">
                            <div className="text-right">
                              <div className="text-xs font-extrabold text-white">
                                {client.amountPaid.toLocaleString()} / {client.totalPackageValue.toLocaleString()} AED
                              </div>
                              <div className="text-[10px] text-neutral-400">
                                {percentPaid}% Paid ({client.paymentPlan})
                              </div>
                            </div>

                            {isPending && (
                              <button
                                onClick={() => {
                                  setPaymentModalClient(client);
                                  setPaymentAmount(client.amountOutstanding.toString());
                                }}
                                className="px-3 py-1.5 bg-[#ec2226] hover:bg-[#c9181c] text-white font-extrabold text-xs rounded-xl flex items-center gap-1 transition shadow"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Record Payment</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Section 2: Financial Growth & Income/Expense Transactions */}
              <div className="bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#6ccbde]" /> Financial Growth Ledger
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Master revenue, operating expenses, and cash flow history.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddFinModal(true)}
                    className="px-3 py-1.5 bg-gradient-to-r from-[#ec2226] to-[#6ccbde] text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow transition hover:opacity-90"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Transaction
                  </button>
                </div>

                {/* Income vs Expense Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#28282c] border border-[#3e3e42] p-3 rounded-xl space-y-1">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold">Total Gross Revenue</span>
                    <div className="text-lg font-black text-emerald-400 font-mono">
                      +{totalRevenue.toLocaleString()} AED
                    </div>
                    <span className="text-[10px] text-neutral-500">From package fees & coaching</span>
                  </div>

                  <div className="bg-[#28282c] border border-[#3e3e42] p-3 rounded-xl space-y-1">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold">Total Expenses</span>
                    <div className="text-lg font-black text-[#ec2226] font-mono">
                      -{totalExpenses.toLocaleString()} AED
                    </div>
                    <span className="text-[10px] text-neutral-500">Coach payouts & operations</span>
                  </div>

                  <div className="bg-[#28282c] border border-[#3e3e42] p-3 rounded-xl space-y-1">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold">Net Operating Profit</span>
                    <div className="text-lg font-black text-[#6ccbde] font-mono">
                      +{netOperatingProfit.toLocaleString()} AED
                    </div>
                    <span className="text-[10px] text-emerald-400">
                      {netProfitMargin}% Net Profit Margin
                    </span>
                  </div>
                </div>

                {/* Financial Transaction History Table */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Recent Master Transactions
                  </h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {masterFinancialRecords.map((fin) => (
                      <div
                        key={fin.id}
                        className="p-3 bg-[#161618] border border-[#2e2e32] rounded-xl flex items-center justify-between text-xs font-mono"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white">{fin.description}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#28282c] text-neutral-400">
                              {fin.category}
                            </span>
                          </div>
                          <div className="text-[10px] text-neutral-500">
                            {fin.date} • Source: {fin.sourceSystem}
                          </div>
                        </div>

                        <div
                          className={`font-black text-sm ${
                            fin.type === 'Revenue' ? 'text-emerald-400' : 'text-[#ec2226]'
                          }`}
                        >
                          {fin.type === 'Revenue' ? '+' : '-'}{fin.amount.toLocaleString()} AED
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COACH WORKSPACE STATS & CLIENT ASSIGNMENT */}
      {activeTab === 'coach_assignment_and_stats' && (
        <div className="space-y-4">
          {/* Section 1: Coach Workspace Statistics per Coach */}
          <div className="bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-4 space-y-3">
            <div className="border-b border-[#2e2e32] pb-3">
              <h3 className="text-sm font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                <Users className="w-4 h-4 text-[#6ccbde]" /> Coach Workspace Statistics & Capacity
              </h3>
              <p className="text-xs text-neutral-400">
                Executive statistics across all coach rooms, client allocations, and active workloads.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {coachStats.map((st) => {
                const portrait =
                  coachAvatars?.[st.coachName] ||
                  (st.coachName.toLowerCase().includes('danish')
                    ? coachAvatars?.['Coach Danish'] || coachDanishImg
                    : st.coachName.toLowerCase().includes('roshan')
                    ? coachAvatars?.['Coach Roshan'] || coachRoshanImg
                    : st.coachName.toLowerCase().includes('muqeeth')
                    ? coachAvatars?.['Coach Muqeeth'] || coachMuqeethImg
                    : null);

                return (
                  <div
                    key={st.coachName}
                    className="bg-[#161618] border border-[#2e2e32] rounded-xl p-3.5 space-y-2 hover:border-white/20 transition"
                  >
                    <div className="flex items-center justify-between border-b border-[#2e2e32] pb-2">
                      <div className="flex items-center gap-2.5">
                        {portrait ? (
                          <img
                            src={portrait}
                            alt={st.coachName}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ec2226]/30 to-[#6ccbde]/30 text-white font-black text-xs flex items-center justify-center shrink-0">
                            {st.coachName.split(' ')[1]?.[0] || 'C'}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-black text-white">{st.coachName}</div>
                          <div className="text-[10px] text-neutral-400">Head Performance Staff</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#6ccbde] bg-[#6ccbde]/10 border border-[#6ccbde]/20 px-2 py-0.5 rounded font-mono">
                        {st.clientCount} Clients
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                      <div className="bg-[#28282c] p-2 rounded-lg">
                        <span className="text-[9px] text-neutral-400 uppercase block">Sessions Done</span>
                        <span className="text-sm font-extrabold text-white">{st.sessionCount} Sessions</span>
                      </div>

                      <div className="bg-[#28282c] p-2 rounded-lg">
                        <span className="text-[9px] text-neutral-400 uppercase block">Pkg Revenue</span>
                        <span className="text-sm font-extrabold text-emerald-400">{st.revenue.toLocaleString()} AED</span>
                      </div>
                    </div>

                    {st.pendingFees > 0 && (
                      <div className="text-[10px] text-[#ec2226] font-mono bg-[#ec2226]/10 p-1.5 rounded text-center font-bold">
                        Pending Unpaid Fees: {st.pendingFees.toLocaleString()} AED
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Head Coach / Management Client-Coach Assignment Matrix */}
          <div className="bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2e2e32] pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#ec2226]" /> Client - Coach Assignment Matrix
                </h3>
                <p className="text-xs text-neutral-400">
                  Assign or re-assign clients to specific coaches. Changes reflect instantly in Coach Workspace rooms.
                </p>
              </div>

              {/* Filter by Coach */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Filter Coach:</span>
                <select
                  value={coachFilter}
                  onChange={(e) => setCoachFilter(e.target.value)}
                  className="bg-[#28282c] border border-[#3e3e42] rounded-xl px-2.5 py-1.5 text-xs text-[#6ccbde] font-bold focus:outline-none"
                >
                  <option value="All">All Coaches</option>
                  {availableCoaches.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Client List with Re-assign Buttons */}
            <div className="space-y-2">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="p-3.5 rounded-xl border border-[#2e2e32] bg-[#161618] hover:border-[#3e3e42] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">{client.name}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">({client.id})</span>
                      <span className="text-[10px] bg-[#6ccbde]/20 text-[#6ccbde] border border-[#6ccbde]/30 px-1.5 py-0.5 rounded font-mono">
                        {client.program}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-400 flex items-center gap-3">
                      <span>Currently Assigned Coach: <strong className="text-white font-bold">{client.assignedCoach}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      onClick={() => {
                        const nut = nutritionPlanRecords.find((p) => p.clientId === client.id) || {
                          clientId: client.id,
                          clientName: client.name,
                          caloriesTarget: 3100,
                          proteinGrams: 210,
                          carbsGrams: 320,
                          fatsGrams: 85,
                          waterLiters: 4.5,
                          notes: 'High-Protein Athletic Performance — Standard protocol',
                          assignedNutritionist: 'Sara Al-Mansoori (Lead Nutritionist)',
                          lastUpdated: new Date().toISOString().split('T')[0],
                        };
                        setSelectedClientNutritionModal(nut);
                      }}
                      className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-xl border border-emerald-500/30 flex items-center gap-1 transition"
                      title="View Client Diet & Macro Plan from Nutrition OS"
                    >
                      <Apple className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Nutrition</span>
                    </button>

                    <button
                      onClick={() => {
                        const ass = assessmentRecords.filter((a) => a.clientId === client.id);
                        setSelectedClientAssessmentsModal({ client, assessments: ass });
                      }}
                      className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 flex items-center gap-1 transition"
                      title="View Coach Athletic Assessment records"
                    >
                      <HeartPulse className="w-3.5 h-3.5 text-amber-400" />
                      <span>Assessments</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('session_plans_history');
                        setClientTimelineModalName(client.name);
                      }}
                      className="px-2.5 py-1.5 bg-[#6ccbde]/10 hover:bg-[#6ccbde]/20 text-[#6ccbde] font-bold text-xs rounded-xl border border-[#6ccbde]/30 flex items-center gap-1 transition"
                      title="View complete session plan timeline from starting date to last plan"
                    >
                      <GitCommit className="w-3.5 h-3.5" />
                      <span>Timeline</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('session_plans_history');
                        setSessionPlanClientSearch(client.name);
                      }}
                      className="px-2.5 py-1.5 bg-[#28282c] hover:bg-[#3e3e42] text-white font-bold text-xs rounded-xl border border-[#3e3e42] flex items-center gap-1 transition"
                      title="View complete session plan history for this client"
                    >
                      <ClipboardList className="w-3.5 h-3.5 text-[#6ccbde]" />
                      <span>Plans List</span>
                    </button>

                    <button
                      onClick={() => {
                        setAssignCoachModalClient(client);
                        setSelectedCoachToAssign(client.assignedCoach);
                      }}
                      className="px-3 py-1.5 bg-[#28282c] hover:bg-[#3e3e42] text-white font-bold text-xs rounded-xl border border-[#3e3e42] flex items-center gap-1.5 transition"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#6ccbde]" />
                      <span>Re-Assign</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GIVEN SESSION PLANS HISTORY & SEARCH */}
      {activeTab === 'session_plans_history' && (
        <div className="bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-4 space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2e32] pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-[#6ccbde]" /> Given Session Plans History
              </h3>
              <p className="text-xs text-neutral-400">
                Search by client name, client ID, or date to view full workout prescriptions history.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono font-bold text-[#6ccbde] bg-[#6ccbde]/10 border border-[#6ccbde]/20 px-2.5 py-1 rounded-xl">
                {filteredGivenPlans.length} / {(givenSessionPlanRecords || []).length} Plans Found
              </span>
            </div>
          </div>

          {/* Quick Client Session Plan Journey Bar */}
          <div className="bg-gradient-to-r from-[#161618] via-[#222226] to-[#161618] border border-[#6ccbde]/30 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-[#6ccbde]/10 border border-[#6ccbde]/20 rounded-xl text-[#6ccbde] shrink-0">
                <GitCommit className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2 flex-wrap">
                  <span>Client Plan Timeline</span>
                  <span className="text-[10px] bg-[#6ccbde]/20 text-[#6ccbde] px-2 py-0.5 rounded font-mono font-bold whitespace-nowrap">Start to Latest</span>
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Inspect client workout plan progression from Day 1 to latest prescribed plan.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <select
                value={clientTimelineModalName || ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setClientTimelineModalName(e.target.value);
                  }
                }}
                className="bg-[#1c1c1c] border border-[#3e3e42] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#6ccbde] font-extrabold w-full sm:w-64"
              >
                <option value="">-- Select Client Timeline --</option>
                {availableTimelineClients.map((name) => (
                  <option key={name} value={name}>
                    👤 {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search & Filter Controls Grid */}
          <div className="bg-[#161618] border border-[#2e2e32] p-3.5 rounded-xl space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search by Client Name / Keyword */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-300 flex items-center gap-1">
                  <Search className="w-3 h-3 text-[#6ccbde]" /> Client Name / Keyword:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={sessionPlanClientSearch}
                    onChange={(e) => setSessionPlanClientSearch(e.target.value)}
                    placeholder="Search client name, ID, title..."
                    className="w-full bg-[#242428] border border-[#3e3e42] rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#6ccbde]"
                  />
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
                  {sessionPlanClientSearch && (
                    <button
                      onClick={() => setSessionPlanClientSearch('')}
                      className="absolute right-2 top-2 text-neutral-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter by Date */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#ec2226]" /> Session Date:
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={sessionPlanDateSearch}
                    onChange={(e) => setSessionPlanDateSearch(e.target.value)}
                    className="w-full bg-[#242428] border border-[#3e3e42] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#6ccbde]"
                  />
                  {sessionPlanDateSearch && (
                    <button
                      onClick={() => setSessionPlanDateSearch('')}
                      className="absolute right-7 top-2 text-neutral-400 hover:text-white"
                      title="Clear date filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter by Coach */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-300 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-emerald-400" /> Assigned Coach:
                </label>
                <select
                  value={sessionPlanCoachFilter}
                  onChange={(e) => setSessionPlanCoachFilter(e.target.value)}
                  className="w-full bg-[#242428] border border-[#3e3e42] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#6ccbde]"
                >
                  <option value="All">All Coaches</option>
                  {availablePlanCoaches.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Filter by Category */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-300 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-amber-400" /> Category:
                </label>
                <select
                  value={sessionPlanCategoryFilter}
                  onChange={(e) => setSessionPlanCategoryFilter(e.target.value)}
                  className="w-full bg-[#242428] border border-[#3e3e42] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#6ccbde]"
                >
                  <option value="All">All Categories</option>
                  {availablePlanCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Clear Row */}
            {(sessionPlanClientSearch || sessionPlanDateSearch || sessionPlanCoachFilter !== 'All' || sessionPlanCategoryFilter !== 'All') && (
              <div className="flex items-center justify-between pt-1 border-t border-[#2e2e32] text-xs">
                <div className="flex items-center gap-2 flex-wrap text-neutral-400 text-[11px]">
                  <span>Active Filters:</span>
                  {sessionPlanClientSearch && (
                    <span className="bg-[#28282c] border border-[#3e3e42] px-2 py-0.5 rounded text-white font-mono">
                      Client/Keyword: "{sessionPlanClientSearch}"
                    </span>
                  )}
                  {sessionPlanDateSearch && (
                    <span className="bg-[#28282c] border border-[#3e3e42] px-2 py-0.5 rounded text-[#6ccbde] font-mono">
                      Date: {sessionPlanDateSearch}
                    </span>
                  )}
                  {sessionPlanCoachFilter !== 'All' && (
                    <span className="bg-[#28282c] border border-[#3e3e42] px-2 py-0.5 rounded text-emerald-400 font-mono">
                      Coach: {sessionPlanCoachFilter}
                    </span>
                  )}
                  {sessionPlanCategoryFilter !== 'All' && (
                    <span className="bg-[#28282c] border border-[#3e3e42] px-2 py-0.5 rounded text-amber-400 font-mono">
                      Category: {sessionPlanCategoryFilter}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSessionPlanClientSearch('');
                    setSessionPlanDateSearch('');
                    setSessionPlanCoachFilter('All');
                    setSessionPlanCategoryFilter('All');
                  }}
                  className="text-[11px] font-bold text-[#ec2226] hover:underline flex items-center gap-1 shrink-0"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Given Session Plans Cards List */}
          {filteredGivenPlans.length === 0 ? (
            <div className="p-8 text-center bg-[#161618] border border-[#2e2e32] rounded-xl space-y-2">
              <ClipboardList className="w-8 h-8 text-neutral-500 mx-auto" />
              <div className="text-sm font-bold text-white">No Given Session Plans Found</div>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                No session plan history matches your search query. Try adjusting the client name keyword or clearing the date filter.
              </p>
              <button
                onClick={() => {
                  setSessionPlanClientSearch('');
                  setSessionPlanDateSearch('');
                  setSessionPlanCoachFilter('All');
                  setSessionPlanCategoryFilter('All');
                }}
                className="mt-2 px-3 py-1.5 bg-[#28282c] hover:bg-[#3e3e42] text-xs font-bold text-white rounded-xl border border-[#3e3e42] inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#6ccbde]" /> Show All Session Plans
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredGivenPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-4 rounded-xl border border-[#2e2e32] bg-[#161618] hover:border-[#3e3e42] transition space-y-3 relative overflow-hidden"
                >
                  {/* Top Bar: Client Name, ID, Date, Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2e2e32] pb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setClientTimelineModalName(plan.clientName)}
                        className="text-sm font-black text-white hover:text-[#6ccbde] underline decoration-dotted decoration-[#6ccbde]/60 flex items-center gap-1.5 transition text-left cursor-pointer group"
                        title="Click client name to view full session plan history from starting date to last plan"
                      >
                        <span>{plan.clientName}</span>
                        <GitCommit className="w-3.5 h-3.5 text-[#6ccbde] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition" />
                      </button>
                      <span className="text-xs font-mono text-neutral-400 bg-[#242428] px-1.5 py-0.5 rounded border border-[#3e3e42]">
                        {plan.clientId}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-[#6ccbde]/20 text-[#6ccbde] border border-[#6ccbde]/30 px-2 py-0.5 rounded">
                        {plan.category}
                      </span>
                      {plan.totalVolumeKg ? (
                        <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                          {plan.totalVolumeKg.toLocaleString()} kg Vol
                        </span>
                      ) : null}
                      {plan.overloadStatus && (
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          plan.overloadStatus === 'Progressing'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : plan.overloadStatus === 'Baseline'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}>
                          {plan.overloadStatus === 'Progressing' ? `Overload Active (+${plan.overloadDeltaPercent || 8}%) 🟢` : plan.overloadStatus}
                        </span>
                      )}
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        plan.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : plan.status === 'Active'
                          ? 'bg-[#6ccbde]/20 text-[#6ccbde] border-[#6ccbde]/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>
                        {plan.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
                      <span className="flex items-center gap-1 text-[#6ccbde] font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        {plan.date}
                      </span>
                      <span className="text-neutral-500 text-[10px]">
                        Logged: {plan.loggedAt}
                      </span>
                    </div>
                  </div>

                  {/* Coach & Plan Title Header */}
                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-sm font-black text-white tracking-wide">{plan.planTitle}</h4>
                      <span className="text-xs text-neutral-400">
                        Assigned Coach: <strong className="text-emerald-400">{plan.coachName}</strong>
                      </span>
                    </div>
                    <p className="text-xs text-[#6ccbde] font-medium flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-[#6ccbde] shrink-0" />
                      <span>Target Focus: <strong>{plan.targetFocus}</strong></span>
                    </p>
                  </div>

                  {/* Statistics Note Strip */}
                  {plan.statisticsNote && (
                    <div className="bg-emerald-950/20 border border-emerald-500/30 p-2.5 rounded-xl text-xs space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                        <Activity className="w-3 h-3" /> Progressive Overload & Performance Statistics Note:
                      </div>
                      <pre className="text-[11px] font-mono text-emerald-200/90 whitespace-pre-wrap leading-relaxed font-sans">
                        {plan.statisticsNote}
                      </pre>
                    </div>
                  )}

                  {/* Complete Plan Details Box */}
                  <div className="bg-[#202023] p-3 rounded-xl border border-[#2e2e32] space-y-1.5">
                    <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1">
                      <FileText className="w-3 h-3 text-[#6ccbde]" /> Full Prescription & Exercise Breakdown:
                    </div>
                    <pre className="text-xs font-mono text-neutral-200 whitespace-pre-wrap leading-relaxed font-sans">
                      {plan.planDetails}
                    </pre>
                  </div>

                  {/* Footer Metrics & Detail View Modal Launcher */}
                  <div className="flex items-center justify-between pt-1 text-xs text-neutral-400 font-mono">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Clock className="w-3.5 h-3.5" /> {plan.durationMinutes} Mins
                      </span>
                      <span className="bg-[#28282c] border border-[#3e3e42] px-2 py-0.5 rounded text-white font-bold">
                        Target RPE {plan.rpeTarget}/10
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setClientTimelineModalName(plan.clientName)}
                        className="px-2.5 py-1 bg-[#6ccbde]/10 hover:bg-[#6ccbde]/20 text-[#6ccbde] text-xs font-bold rounded-lg border border-[#6ccbde]/30 flex items-center gap-1 transition"
                        title="See complete session plan history from start date to last plan"
                      >
                        <GitCommit className="w-3.5 h-3.5" />
                        <span>Timeline</span>
                      </button>

                      <button
                        onClick={() => setSelectedSessionPlanModal(plan)}
                        className="px-3 py-1 bg-[#28282c] hover:bg-[#3e3e42] text-white text-xs font-bold rounded-lg border border-[#3e3e42] flex items-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#6ccbde]" />
                        <span>Full Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: NUTRITION PLANS & ATHLETIC ASSESSMENTS SYNC */}
      {activeTab === 'nutrition_and_assessments' && (
        <div className="bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-4 space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2e32] pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                <Apple className="w-4 h-4 text-emerald-400" /> Workspaces Sync: Nutrition Plans & Assessments
              </h3>
              <p className="text-xs text-neutral-400">
                Live updates received automatically from Nutrition OS and Coach Workspace.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setNutritionSubView('nutrition')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                  nutritionSubView === 'nutrition'
                    ? 'bg-emerald-500 text-black shadow font-black'
                    : 'bg-[#28282c] text-neutral-400 hover:text-white border border-[#3e3e42]'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>Nutrition Plans ({nutritionPlanRecords.length})</span>
              </button>

              <button
                onClick={() => setNutritionSubView('assessments')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                  nutritionSubView === 'assessments'
                    ? 'bg-amber-500 text-black shadow font-black'
                    : 'bg-[#28282c] text-neutral-400 hover:text-white border border-[#3e3e42]'
                }`}
              >
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Athletic Assessments ({assessmentRecords.length})</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-[#161618] border border-[#2e2e32] p-3 rounded-xl flex items-center justify-between gap-3">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={nutSearchTerm}
                onChange={(e) => setNutSearchTerm(e.target.value)}
                placeholder="Search by client name, nutritionist, or coach..."
                className="w-full bg-[#242428] border border-[#3e3e42] rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-400 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
              {nutSearchTerm && (
                <button onClick={() => setNutSearchTerm('')} className="absolute right-2 top-2 text-neutral-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl hidden sm:flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Synced System 2 DB</span>
            </div>
          </div>

          {/* SUBTAB 1: NUTRITION PLANS */}
          {nutritionSubView === 'nutrition' && (
            <div className="space-y-3">
              {nutritionPlanRecords
                .filter((p) => !nutSearchTerm.trim() || p.clientName.toLowerCase().includes(nutSearchTerm.toLowerCase()) || p.assignedNutritionist.toLowerCase().includes(nutSearchTerm.toLowerCase()))
                .length === 0 ? (
                <div className="p-8 text-center bg-[#161618] border border-[#2e2e32] rounded-xl space-y-2">
                  <Apple className="w-8 h-8 text-neutral-500 mx-auto" />
                  <div className="text-xs font-bold text-white">No Nutrition Plans Found</div>
                  <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
                    No nutrition plans match your active filter. Plans created in Nutrition OS sync here instantly!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {nutritionPlanRecords
                    .filter((p) => !nutSearchTerm.trim() || p.clientName.toLowerCase().includes(nutSearchTerm.toLowerCase()) || p.assignedNutritionist.toLowerCase().includes(nutSearchTerm.toLowerCase()))
                    .map((plan) => (
                      <div
                        key={plan.id}
                        className="p-4 rounded-xl border border-[#2e2e32] bg-[#161618] hover:border-emerald-500/40 transition space-y-3 relative overflow-hidden"
                      >
                        <div className="flex items-start justify-between border-b border-[#2e2e32] pb-2.5">
                          <div>
                            <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded uppercase">
                              Active Diet Protocol
                            </span>
                            <h4 className="text-sm font-black text-white mt-1 flex items-center gap-2">
                              <span>{plan.clientName}</span>
                              <span className="text-[10px] font-mono text-neutral-400">({plan.clientId})</span>
                            </h4>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 font-mono block">
                              🔥 {plan.caloriesTarget} kcal
                            </span>
                            <span className="text-[9px] font-mono text-neutral-400 mt-0.5 block">Updated: {plan.lastUpdated}</span>
                          </div>
                        </div>

                        {/* Macros Breakdown Pills */}
                        <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-mono">
                          <div className="bg-[#242428] p-1.5 rounded-lg border border-[#3e3e42]">
                            <span className="text-[9px] text-neutral-400 block uppercase">Protein</span>
                            <span className="font-extrabold text-cyan-400">{plan.proteinGrams}g</span>
                          </div>
                          <div className="bg-[#242428] p-1.5 rounded-lg border border-[#3e3e42]">
                            <span className="text-[9px] text-neutral-400 block uppercase">Carbs</span>
                            <span className="font-extrabold text-amber-400">{plan.carbsGrams}g</span>
                          </div>
                          <div className="bg-[#242428] p-1.5 rounded-lg border border-[#3e3e42]">
                            <span className="text-[9px] text-neutral-400 block uppercase">Fats</span>
                            <span className="font-extrabold text-rose-400">{plan.fatsGrams}g</span>
                          </div>
                          <div className="bg-[#242428] p-1.5 rounded-lg border border-[#3e3e42]">
                            <span className="text-[9px] text-neutral-400 block uppercase">Water</span>
                            <span className="font-extrabold text-sky-400">{plan.waterLiters}L</span>
                          </div>
                        </div>

                        <div className="text-xs text-neutral-300 line-clamp-2 bg-[#242428] p-2 rounded-lg border border-[#3e3e42] font-mono">
                          {plan.notes}
                        </div>

                        <div className="pt-2 border-t border-[#2e2e32] flex items-center justify-between text-xs text-neutral-400">
                          <span className="text-[10px] font-mono">By: {plan.assignedNutritionist}</span>
                          <button
                            onClick={() => setSelectedClientNutritionModal(plan)}
                            className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs rounded-lg border border-emerald-500/40 transition flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-400" /> Inspect Diet Plan
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* SUBTAB 2: ATHLETIC ASSESSMENTS */}
          {nutritionSubView === 'assessments' && (
            <div className="space-y-3">
              {assessmentRecords
                .filter((a) => !nutSearchTerm.trim() || a.clientName.toLowerCase().includes(nutSearchTerm.toLowerCase()) || a.assessedBy.toLowerCase().includes(nutSearchTerm.toLowerCase()))
                .length === 0 ? (
                <div className="p-8 text-center bg-[#161618] border border-[#2e2e32] rounded-xl space-y-2">
                  <HeartPulse className="w-8 h-8 text-neutral-500 mx-auto" />
                  <div className="text-xs font-bold text-white">No Assessment Records Found</div>
                  <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
                    No physical assessments match your search query. Assessments saved in Coach Workspace sync here automatically.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {assessmentRecords
                    .filter((a) => !nutSearchTerm.trim() || a.clientName.toLowerCase().includes(nutSearchTerm.toLowerCase()) || a.assessedBy.toLowerCase().includes(nutSearchTerm.toLowerCase()))
                    .map((ass) => (
                      <div
                        key={ass.id}
                        className="p-4 rounded-xl border border-[#2e2e32] bg-[#161618] hover:border-amber-500/40 transition space-y-3 relative overflow-hidden"
                      >
                        <div className="flex items-start justify-between border-b border-[#2e2e32] pb-2.5">
                          <div>
                            <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded uppercase">
                              Physical Assessment Record
                            </span>
                            <h4 className="text-sm font-black text-white mt-1 flex items-center gap-2">
                              <span>{ass.clientName}</span>
                              <span className="text-[10px] font-mono text-neutral-400">({ass.clientId})</span>
                            </h4>
                          </div>

                          <span className="text-xs font-mono text-neutral-400 bg-[#242428] px-2 py-1 rounded-lg border border-[#3e3e42]">
                            {ass.date}
                          </span>
                        </div>

                        {/* Assessment Metrics */}
                        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                          <div className="bg-[#242428] p-2 rounded-lg border border-[#3e3e42]">
                            <span className="text-[9px] text-neutral-400 block uppercase">Weight</span>
                            <span className="font-extrabold text-white text-sm">{ass.weightKg} kg</span>
                          </div>

                          <div className="bg-[#242428] p-2 rounded-lg border border-[#3e3e42]">
                            <span className="text-[9px] text-neutral-400 block uppercase">Body Fat</span>
                            <span className="font-extrabold text-amber-400 text-sm">{ass.bodyFatPercentage}%</span>
                          </div>

                          <div className="bg-[#242428] p-2 rounded-lg border border-[#3e3e42]">
                            <span className="text-[9px] text-neutral-400 block uppercase">VO2 Max</span>
                            <span className="font-extrabold text-cyan-400 text-sm">{ass.vo2Max}</span>
                          </div>
                        </div>

                        {ass.notes && (
                          <div className="text-xs text-neutral-300 bg-[#242428] p-2 rounded-lg border border-[#3e3e42] font-mono">
                            {ass.notes}
                          </div>
                        )}

                        <div className="pt-2 border-t border-[#2e2e32] flex items-center justify-between text-xs text-neutral-400">
                          <span className="text-[10px] font-mono">Assessed By: {ass.assessedBy}</span>
                          <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> System 2 Synced
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: MASTER PACKAGES & CATALOGUE */}
      {activeTab === 'master_packages' && (
        <div className="bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#6ccbde]" /> Master Programs & Package Pricing
              </h3>
              <p className="text-xs text-neutral-400">
                Official package catalogue offered across Intokine Athletics & Coaching.
              </p>
            </div>

            <button
              onClick={() => setShowAddPlanModal(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-[#ec2226] to-[#6ccbde] text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow transition hover:opacity-90"
            >
              <Plus className="w-3.5 h-3.5" /> Create Master Package
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {programMasterRecords.map((prog) => (
              <div
                key={prog.id}
                className="p-4 rounded-xl border border-[#2e2e32] bg-[#161618] space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#6ccbde] bg-[#6ccbde]/10 border border-[#6ccbde]/20 px-2 py-0.5 rounded font-mono">
                      {prog.category}
                    </span>
                    <h4 className="text-sm font-black text-white mt-1">{prog.title}</h4>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-base font-black text-emerald-400">{prog.priceAED.toLocaleString()} AED</span>
                    <span className="text-[10px] text-neutral-400 block">{prog.durationWeeks} Weeks</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-300">{prog.description}</p>

                <div className="pt-2 border-t border-[#2e2e32] flex items-center justify-between text-xs text-neutral-400">
                  <span>Lead Coach: <strong className="text-white">{prog.assignedLeadCoach}</strong></span>
                  <span>Active Subscribers: <strong className="text-emerald-400 font-mono">{prog.subscriberCount}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: RECORD PENDING FEE PAYMENT */}
      {paymentModalClient && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
              <h3 className="text-sm font-extrabold text-white uppercase flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#ec2226]" /> Record Pending Fee Payment
              </h3>
              <button onClick={() => setPaymentModalClient(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#28282c] p-3 rounded-xl space-y-1 text-xs">
              <div className="text-white font-bold">{paymentModalClient.name} ({paymentModalClient.id})</div>
              <div className="text-neutral-400">Package: {paymentModalClient.program}</div>
              <div className="text-[#ec2226] font-mono font-bold">
                Current Pending Outstanding: {paymentModalClient.amountOutstanding.toLocaleString()} AED
              </div>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Payment Amount Collected (AED):
                </label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#6ccbde]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalClient(null)}
                  className="w-1/2 py-2.5 bg-[#28282c] text-neutral-300 font-bold rounded-xl text-xs hover:bg-[#3e3e42] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#ec2226] hover:bg-[#c9181c] text-white font-extrabold rounded-xl text-xs transition shadow"
                >
                  Confirm Fee Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RE-ASSIGN COACH MODAL */}
      {assignCoachModalClient && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
              <h3 className="text-sm font-extrabold text-white uppercase flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#6ccbde]" /> Assign / Re-Assign Coach
              </h3>
              <button onClick={() => setAssignCoachModalClient(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#28282c] p-3 rounded-xl space-y-1 text-xs">
              <div className="text-white font-bold">{assignCoachModalClient.name} ({assignCoachModalClient.id})</div>
              <div className="text-neutral-400">Current Coach: {assignCoachModalClient.assignedCoach}</div>
            </div>

            <form onSubmit={handleConfirmCoachAssign} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Select New Coach:
                </label>
                <select
                  value={selectedCoachToAssign}
                  onChange={(e) => setSelectedCoachToAssign(e.target.value)}
                  className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none"
                >
                  {availableCoaches.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignCoachModalClient(null)}
                  className="w-1/2 py-2.5 bg-[#28282c] text-neutral-300 font-bold rounded-xl text-xs hover:bg-[#3e3e42] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-gradient-to-r from-[#ec2226] to-[#6ccbde] text-white font-extrabold rounded-xl text-xs transition shadow"
                >
                  Assign Coach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: NEW CLIENT INTAKE MODAL */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
              <h3 className="text-sm font-extrabold text-white uppercase flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#6ccbde]" /> New Client Intake (Business OS DB)
              </h3>
              <button onClick={() => setShowAddClientModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMasterClient} className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Al-Hashimi"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6ccbde]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Assigned Coach *</label>
                  <select
                    value={newClientCoach}
                    onChange={(e) => setNewClientCoach(e.target.value)}
                    className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-2.5 py-2 text-white focus:outline-none"
                  >
                    {availableCoaches.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Master Program</label>
                  <input
                    type="text"
                    value={newClientProgram}
                    onChange={(e) => setNewClientProgram(e.target.value)}
                    className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Total Package Value (AED)</label>
                  <input
                    type="number"
                    value={newClientVal}
                    onChange={(e) => setNewClientVal(e.target.value)}
                    className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Initial Amount Paid (AED)</label>
                  <input
                    type="number"
                    value={newClientPaid}
                    onChange={(e) => setNewClientPaid(e.target.value)}
                    className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Contact Number</label>
                <input
                  type="text"
                  value={newClientContact}
                  onChange={(e) => setNewClientContact(e.target.value)}
                  className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="w-1/2 py-2.5 bg-[#28282c] text-neutral-300 font-bold rounded-xl text-xs hover:bg-[#3e3e42] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-gradient-to-r from-[#ec2226] to-[#6ccbde] text-white font-extrabold rounded-xl text-xs transition shadow"
                >
                  Complete Intake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD FINANCIAL TRANSACTION */}
      {showAddFinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
              <h3 className="text-sm font-extrabold text-white uppercase flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#6ccbde]" /> Log Financial Transaction
              </h3>
              <button onClick={() => setShowAddFinModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFinancialTransaction} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Type</label>
                  <select
                    value={finType}
                    onChange={(e) => setFinType(e.target.value as any)}
                    className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-2.5 py-2 text-white focus:outline-none"
                  >
                    <option value="Revenue">Revenue (+)</option>
                    <option value="Expense">Expense (-)</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Amount (AED)</label>
                  <input
                    type="number"
                    required
                    value={finAmount}
                    onChange={(e) => setFinAmount(e.target.value)}
                    className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Category</label>
                <input
                  type="text"
                  value={finCategory}
                  onChange={(e) => setFinCategory(e.target.value)}
                  className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Personal Training Retainer"
                  value={finDesc}
                  onChange={(e) => setFinDesc(e.target.value)}
                  className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFinModal(false)}
                  className="w-1/2 py-2.5 bg-[#28282c] text-neutral-300 font-bold rounded-xl text-xs hover:bg-[#3e3e42] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-gradient-to-r from-[#ec2226] to-[#6ccbde] text-white font-extrabold rounded-xl text-xs transition shadow"
                >
                  Log Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD MASTER PROGRAM */}
      {showAddPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
              <h3 className="text-sm font-extrabold text-white uppercase flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#6ccbde]" /> Create Master Package
              </h3>
              <button onClick={() => setShowAddPlanModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMasterProgram} className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Intokine Hybrid Combat & Performance"
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Price (AED)</label>
                  <input
                    type="number"
                    value={planPrice}
                    onChange={(e) => setPlanPrice(e.target.value)}
                    className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Duration (Weeks)</label>
                  <input
                    type="number"
                    value={planWeeks}
                    onChange={(e) => setPlanWeeks(e.target.value)}
                    className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Lead Coach</label>
                <select
                  value={planCoach}
                  onChange={(e) => setPlanCoach(e.target.value)}
                  className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-2.5 py-2 text-white focus:outline-none"
                >
                  {availableCoaches.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={planDesc}
                  onChange={(e) => setPlanDesc(e.target.value)}
                  className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPlanModal(false)}
                  className="w-1/2 py-2.5 bg-[#28282c] text-neutral-300 font-bold rounded-xl text-xs hover:bg-[#3e3e42] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-gradient-to-r from-[#ec2226] to-[#6ccbde] text-white font-extrabold rounded-xl text-xs transition shadow"
                >
                  Create Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW COMPLETE SESSION PLAN DETAILS */}
      {selectedSessionPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold bg-[#6ccbde]/20 text-[#6ccbde] border border-[#6ccbde]/30 px-2 py-0.5 rounded">
                  {selectedSessionPlanModal.category} • {selectedSessionPlanModal.status}
                </span>
                <h3 className="text-base font-black text-white mt-1">
                  {selectedSessionPlanModal.planTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSessionPlanModal(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#161618] p-3 rounded-xl border border-[#2e2e32] text-xs">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Client Name</span>
                <span className="text-white font-extrabold">{selectedSessionPlanModal.clientName}</span>
                <span className="text-[10px] text-neutral-400 block font-mono">({selectedSessionPlanModal.clientId})</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Assigned Coach</span>
                <span className="text-emerald-400 font-extrabold">{selectedSessionPlanModal.coachName}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Date Assigned</span>
                <span className="text-[#6ccbde] font-mono font-extrabold">{selectedSessionPlanModal.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Target Duration</span>
                <span className="text-white font-mono font-bold">{selectedSessionPlanModal.durationMinutes} Minutes</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Target Intensity</span>
                <span className="text-amber-400 font-mono font-bold">RPE {selectedSessionPlanModal.rpeTarget} / 10</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Log Timestamp</span>
                <span className="text-neutral-400 font-mono text-[11px]">{selectedSessionPlanModal.loggedAt}</span>
              </div>
            </div>

            {/* Target Focus & Volume Statistics Note */}
            <div className="space-y-2">
              <div className="bg-[#242428] p-3 rounded-xl border border-[#3e3e42] space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Target Athletic Focus</span>
                <p className="text-xs text-[#6ccbde] font-bold">{selectedSessionPlanModal.targetFocus}</p>
              </div>

              {/* Progressive Overload & Performance Statistics Note */}
              {(selectedSessionPlanModal.statisticsNote || selectedSessionPlanModal.totalVolumeKg) && (
                <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5" /> Performance & Overload Statistics Note
                    </span>
                    {selectedSessionPlanModal.totalVolumeKg ? (
                      <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {selectedSessionPlanModal.totalVolumeKg.toLocaleString()} kg Tonnage
                      </span>
                    ) : null}
                  </div>
                  {selectedSessionPlanModal.statisticsNote && (
                    <pre className="text-xs font-mono text-emerald-200/90 whitespace-pre-wrap leading-relaxed font-sans">
                      {selectedSessionPlanModal.statisticsNote}
                    </pre>
                  )}
                </div>
              )}
            </div>

            {/* Detailed Prescription */}
            <div className="space-y-1.5">
              <span className="text-xs font-extrabold text-white uppercase tracking-wider block">Prescription & Exercise Blueprint</span>
              <div className="bg-[#161618] p-4 rounded-xl border border-[#2e2e32] text-xs font-mono text-neutral-200 whitespace-pre-wrap leading-relaxed">
                {selectedSessionPlanModal.planDetails}
              </div>
            </div>

            {/* Footer Close Button */}
            <div className="pt-2 border-t border-[#2e2e32] flex justify-end">
              <button
                onClick={() => setSelectedSessionPlanModal(null)}
                className="px-4 py-2 bg-[#28282c] hover:bg-[#3e3e42] text-white font-bold rounded-xl text-xs transition"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE CLIENT TO COACH (BUSINESS OS -> COACH WORKSPACE SYNC) */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold bg-[#6ccbde]/20 text-[#6ccbde] border border-[#6ccbde]/30 px-2 py-0.5 rounded">
                  System 2 Direct Sync
                </span>
                <h3 className="text-sm font-black text-white uppercase tracking-wider mt-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#6ccbde]" /> Schedule Client Session to Coach
                </h3>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleClientToCoach} className="space-y-3 text-xs">
              {/* Schedule Mode Selector: 1-Month Recurring vs Single Session */}
              <div className="bg-[#161618] border border-[#2e2e32] p-2.5 rounded-xl space-y-2">
                <label className="text-neutral-300 font-bold block text-[11px] uppercase tracking-wider">
                  Scheduling Mode *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSchedMode('recurring_1month')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                      schedMode === 'recurring_1month'
                        ? 'bg-[#6ccbde] text-black shadow-lg font-black'
                        : 'bg-[#28282c] text-neutral-400 hover:text-white border border-[#3e3e42]'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>1-Month Package (4 Wks)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSchedMode('single')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                      schedMode === 'single'
                        ? 'bg-[#6ccbde] text-black shadow-lg font-black'
                        : 'bg-[#28282c] text-neutral-400 hover:text-white border border-[#3e3e42]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Single Session</span>
                  </button>
                </div>

                {/* 1-Month Weekly Frequency Selection */}
                {schedMode === 'recurring_1month' && (
                  <div className="pt-2 border-t border-[#2e2e32] space-y-2 animate-fadeIn">
                    <label className="text-[#6ccbde] font-bold block text-[11px]">
                      Weekly Frequency (Days in Package) *
                    </label>
                    <select
                      value={schedPresetPattern}
                      onChange={(e) => setSchedPresetPattern(e.target.value)}
                      className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#6ccbde]"
                    >
                      <option value="3_days_mwf">3 Days / Week (Mon, Wed, Fri) • ~12 Sessions</option>
                      <option value="2_days_tt">2 Days / Week (Tue, Thu) • ~8 Sessions</option>
                      <option value="4_days_mttf">4 Days / Week (Mon, Tue, Thu, Fri) • ~16 Sessions</option>
                      <option value="weekends">All Weekends Package (Sat, Sun) • ~8 Sessions</option>
                      <option value="5_days_weekdays">5 Days / Week (Mon - Fri) • ~20 Sessions</option>
                      <option value="custom">Custom Days Selection</option>
                    </select>

                    {/* Custom Checkboxes if Custom selected */}
                    {schedPresetPattern === 'custom' && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                          const isChecked = schedCustomDays.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                if (isChecked) {
                                  setSchedCustomDays(schedCustomDays.filter((d) => d !== day));
                                } else {
                                  setSchedCustomDays([...schedCustomDays, day]);
                                }
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                                isChecked
                                  ? 'bg-emerald-500 text-black'
                                  : 'bg-[#28282c] text-neutral-400 border border-[#3e3e42]'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                      ⚡ System will automatically generate 4 full weeks of recurring sessions on the assigned coach's calendar starting from the Start Date below.
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-neutral-300 font-bold block mb-1">Select Client *</label>
                <select
                  value={schedClientId}
                  onChange={(e) => {
                    setSchedClientId(e.target.value);
                    const selected = clientMasterRecords.find((c) => c.id === e.target.value);
                    if (selected) {
                      setSchedProgram(selected.program || 'KATBA Elite Performance Package');
                      setSchedCoachName(selected.assignedCoach || 'Coach Ahmed (Head Coach)');
                    }
                  }}
                  className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#6ccbde]"
                >
                  {clientMasterRecords.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id}) • Coach: {c.assignedCoach}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Assign Coach *</label>
                  <select
                    value={schedCoachName}
                    onChange={(e) => setSchedCoachName(e.target.value)}
                    className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-[#6ccbde]"
                  >
                    {availableCoaches.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Session Date *</label>
                  <input
                    type="date"
                    required
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-[#6ccbde]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Session Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 09:30 AM"
                    value={schedTime}
                    onChange={(e) => setSchedTime(e.target.value)}
                    className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#6ccbde]"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Facility / Venue</label>
                  <select
                    value={schedLocation}
                    onChange={(e) => setSchedLocation(e.target.value)}
                    className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-[#6ccbde]"
                  >
                    <option value="Downtown Private Gym">Downtown Private Gym</option>
                    <option value="DIFC Studio">DIFC Studio</option>
                    <option value="VIP Recovery Lab">VIP Recovery Lab</option>
                    <option value="INTOKINE Combat Ring">INTOKINE Combat Ring</option>
                    <option value="Main Arena">Main Arena</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-bold block mb-1">Session Focus / Type</label>
                <input
                  type="text"
                  value={schedSessionType}
                  onChange={(e) => setSchedSessionType(e.target.value)}
                  className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6ccbde]"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-bold block mb-1">Program Package</label>
                <input
                  type="text"
                  value={schedProgram}
                  onChange={(e) => setSchedProgram(e.target.value)}
                  className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6ccbde]"
                />
              </div>

              <div className="p-2.5 bg-[#161618] rounded-xl border border-[#2e2e32] text-[11px] text-neutral-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  This session will immediately appear under <strong>Today's Schedule / Weekly Schedule</strong> in the assigned coach's workspace.
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="w-1/2 py-2.5 bg-[#28282c] text-neutral-300 font-bold rounded-xl text-xs hover:bg-[#3e3e42] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#6ccbde] hover:bg-[#5bb8cb] text-black font-extrabold rounded-xl text-xs transition shadow"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ISSUE STAFF PAYMENT / CLEAR PENDING CREDIT */}
      {showStaffPayoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#1c1c1c] border border-[#2e2e32] rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Staff Payroll Ledger
                </span>
                <h3 className="text-sm font-black text-white uppercase tracking-wider mt-1 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Settle Staff Payout / Clear Credit
                </h3>
              </div>
              <button onClick={() => setShowStaffPayoutModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueStaffPayment} className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-300 font-bold block mb-1">Staff Member / Coach *</label>
                <select
                  value={payoutStaffName}
                  onChange={(e) => {
                    setPayoutStaffName(e.target.value);
                    const coach = coachMasterRecords.find((c) => c.name === e.target.value);
                    if (coach) {
                      setPayoutAmount(coach.amountEarned.toString());
                    }
                  }}
                  className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-2.5 py-2 text-white font-bold focus:outline-none focus:border-[#6ccbde]"
                >
                  {availableCoaches.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Category</label>
                  <select
                    value={payoutCategory}
                    onChange={(e) => setPayoutCategory(e.target.value)}
                    className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-[#6ccbde]"
                  >
                    <option value="Coach Payout">Coach Payout</option>
                    <option value="Staff Salary">Staff Salary</option>
                    <option value="Bonus Commission">Bonus Commission</option>
                    <option value="Operating Expense">Operating Expense</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 font-bold block mb-1">Payout Status</label>
                  <select
                    value={payoutStatus}
                    onChange={(e) => setPayoutStatus(e.target.value as 'Cleared' | 'Pending')}
                    className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-2.5 py-2 text-white font-mono font-bold focus:outline-none focus:border-[#6ccbde]"
                  >
                    <option value="Cleared">Cleared (Paid)</option>
                    <option value="Pending">Pending Approval</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-bold block mb-1">Amount (AED) *</label>
                <input
                  type="number"
                  required
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white font-mono font-extrabold focus:outline-none focus:border-[#6ccbde]"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-bold block mb-1">Payment Description / Notes</label>
                <input
                  type="text"
                  value={payoutDesc}
                  onChange={(e) => setPayoutDesc(e.target.value)}
                  className="w-full bg-[#28282c] border border-[#3e3e42] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6ccbde]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStaffPayoutModal(false)}
                  className="w-1/2 py-2.5 bg-[#28282c] text-neutral-300 font-bold rounded-xl text-xs hover:bg-[#3e3e42] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-xs transition shadow"
                >
                  Record Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CLIENT SESSION PLAN JOURNEY TIMELINE (STARTING DATE -> LAST PLAN) */}
      {clientTimelineModalName && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-[#161618] border border-[#2e2e32] rounded-2xl p-5 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            
            {/* Top Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2e32] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#6ccbde]/20 via-[#1c1c1c] to-[#ec2226]/20 border border-[#6ccbde]/40 flex items-center justify-center shrink-0">
                  <GitCommit className="w-6 h-6 text-[#6ccbde]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold bg-[#6ccbde]/20 text-[#6ccbde] border border-[#6ccbde]/30 px-2 py-0.5 rounded uppercase whitespace-nowrap">
                      Plan Timeline
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded whitespace-nowrap">
                      {selectedClientTimelinePlans.length} Prescribed Plans
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-0.5 flex items-center gap-2 flex-wrap">
                    <span>{clientTimelineModalName}</span>
                    <span className="text-xs font-normal text-neutral-400">
                      (Plan Timeline)
                    </span>
                  </h3>
                </div>
              </div>

              {/* Close Button & Client Dropdown Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={clientTimelineModalName}
                  onChange={(e) => setClientTimelineModalName(e.target.value)}
                  className="bg-[#242428] border border-[#3e3e42] rounded-xl px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-[#6ccbde]"
                >
                  {availableTimelineClients.map((cName) => (
                    <option key={cName} value={cName}>
                      Switch Client: {cName}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setClientTimelineModalName(null)}
                  className="text-neutral-400 hover:text-white p-1.5 bg-[#242428] border border-[#3e3e42] rounded-xl"
                  title="Close timeline view"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Overview Banner: First Plan ➔ Latest Plan */}
            {selectedClientTimelinePlans.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 bg-[#1c1c1c] border border-[#2e2e32] p-3 rounded-xl sm:rounded-2xl">
                {/* First Session Plan Card */}
                <div className="p-2.5 sm:p-3 bg-[#161618] border border-emerald-500/30 rounded-xl flex sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" /> Day 1 Start
                    </span>
                    <span className="text-[10px] font-mono font-bold text-white bg-emerald-500/20 px-1.5 py-0.2 rounded sm:hidden">
                      {startingPlan?.date}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-full">
                    {startingPlan?.planTitle}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono hidden sm:flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    <span>Start: <strong className="text-emerald-400">{startingPlan?.date}</strong></span>
                  </div>
                </div>

                {/* Journey Progression Arrow Indicator */}
                <div className="p-2 sm:p-3 bg-[#161618] border border-[#2e2e32] rounded-xl flex items-center justify-between sm:flex-col sm:justify-center text-center gap-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                    Plan Span ({selectedClientTimelinePlans.length})
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-black text-[#6ccbde]">
                    <span className="whitespace-nowrap">{startingPlan?.date}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#6ccbde] shrink-0" />
                    <span className="whitespace-nowrap">{lastPlan?.date}</span>
                  </div>
                </div>

                {/* Latest Session Plan Card */}
                <div className="p-2.5 sm:p-3 bg-[#161618] border border-[#6ccbde]/30 rounded-xl flex sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-extrabold text-[#6ccbde] uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#6ccbde]" /> Latest
                    </span>
                    <span className="text-[10px] font-mono font-bold text-white bg-[#6ccbde]/20 px-1.5 py-0.2 rounded sm:hidden">
                      {lastPlan?.date}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-full">
                    {lastPlan?.planTitle}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono hidden sm:flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#6ccbde]" />
                    <span>Latest: <strong className="text-[#6ccbde]">{lastPlan?.date}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Sort & Filter Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs bg-[#1c1c1c] px-3.5 py-2 rounded-xl border border-[#2e2e32]">
              <span className="text-neutral-400 font-mono">
                Showing {selectedClientTimelinePlans.length} session plan(s) for {clientTimelineModalName}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-neutral-500 text-[11px] font-bold">Sort:</span>
                <button
                  onClick={() => setTimelineSortOrder(timelineSortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-2.5 py-1 bg-[#242428] hover:bg-[#3e3e42] text-white font-mono font-bold text-xs rounded-lg border border-[#3e3e42] flex items-center gap-1 transition"
                >
                  <History className="w-3.5 h-3.5 text-[#6ccbde]" />
                  <span>{timelineSortOrder === 'asc' ? 'Oldest First' : 'Newest First'}</span>
                </button>
              </div>
            </div>

            {/* Timeline Stream */}
            {selectedClientTimelinePlans.length === 0 ? (
              <div className="p-8 text-center bg-[#1c1c1c] border border-[#2e2e32] rounded-xl space-y-2">
                <ClipboardList className="w-8 h-8 text-neutral-500 mx-auto" />
                <div className="text-sm font-bold text-white">No Prescribed Session Plans Found for {clientTimelineModalName}</div>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  No session plan history has been logged under this client name yet.
                </p>
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-[#6ccbde] before:to-purple-500">
                {selectedClientTimelinePlans.map((plan, index) => {
                  const isStarting = plan.id === startingPlan?.id;
                  const isLast = plan.id === lastPlan?.id;

                  return (
                    <div key={plan.id} className="relative group">
                      {/* Timeline Node Bullet */}
                      <div
                        className={`absolute -left-[27px] top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-[#161618] z-10 ${
                          isStarting
                            ? 'border-emerald-400 text-emerald-400 ring-2 ring-emerald-500/20'
                            : isLast
                            ? 'border-[#6ccbde] text-[#6ccbde] ring-2 ring-[#6ccbde]/20'
                            : 'border-[#3e3e42] text-neutral-400'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${isStarting ? 'bg-emerald-400' : isLast ? 'bg-[#6ccbde]' : 'bg-neutral-500'}`} />
                      </div>

                      {/* Timeline Plan Card */}
                      <div
                        className={`p-4 rounded-xl border transition space-y-3 ${
                          isStarting
                            ? 'bg-[#18241c] border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                            : isLast
                            ? 'bg-[#182228] border-[#6ccbde]/40 shadow-lg shadow-cyan-950/20'
                            : 'bg-[#1c1c1c] border-[#2e2e32] hover:border-[#3e3e42]'
                        }`}
                      >
                        {/* Header Badge & Date */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {isStarting && (
                              <span className="text-[10px] font-mono font-extrabold bg-emerald-500 text-black px-2 py-0.5 rounded shadow flex items-center gap-1 whitespace-nowrap">
                                🚀 FIRST PLAN
                              </span>
                            )}
                            {isLast && (
                              <span className="text-[10px] font-mono font-extrabold bg-[#6ccbde] text-black px-2 py-0.5 rounded shadow flex items-center gap-1 whitespace-nowrap">
                                🏁 LATEST PLAN
                              </span>
                            )}
                            {!isStarting && !isLast && (
                              <span className="text-[10px] font-mono font-bold bg-[#28282c] text-neutral-300 border border-[#3e3e42] px-2 py-0.5 rounded whitespace-nowrap">
                                PLAN #{index + 1}
                              </span>
                            )}

                            <span className="text-[10px] font-mono font-bold bg-[#28282c] text-[#6ccbde] border border-[#3e3e42] px-2 py-0.5 rounded">
                              {plan.category}
                            </span>
                            <span className="text-[10px] font-mono font-bold bg-black/40 text-neutral-300 border border-white/10 px-2 py-0.5 rounded">
                              {plan.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-mono">
                            <span className="text-white font-black bg-black/40 border border-white/10 px-2.5 py-0.5 rounded flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#6ccbde]" />
                              {plan.date}
                            </span>
                          </div>
                        </div>

                        {/* Title & Coach */}
                        <div className="space-y-1">
                          <h4 className="text-base font-black text-white">{plan.planTitle}</h4>
                          <div className="flex items-center justify-between text-xs text-neutral-300 flex-wrap gap-2">
                            <span>Assigned Coach: <strong className="text-emerald-400">{plan.coachName}</strong></span>
                            <span className="text-amber-400 font-mono font-bold">Target RPE: {plan.rpeTarget}/10 ({plan.durationMinutes} mins)</span>
                          </div>
                          <p className="text-xs text-[#6ccbde] font-medium flex items-center gap-1">
                            <Target className="w-3.5 h-3.5 text-[#6ccbde] shrink-0" />
                            <span>Target Focus: <strong>{plan.targetFocus}</strong></span>
                          </p>
                        </div>

                        {/* Exercise Protocol */}
                        <div className="bg-black/30 p-3 rounded-xl border border-white/10 space-y-1">
                          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                            <FileText className="w-3 h-3 text-[#6ccbde]" /> Prescribed Workout Blueprint:
                          </div>
                          <pre className="text-xs font-mono text-neutral-200 whitespace-pre-wrap leading-relaxed font-sans">
                            {plan.planDetails}
                          </pre>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Footer Close */}
            <div className="pt-3 border-t border-[#2e2e32] flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-mono">
                {clientTimelineModalName} • Full Session Plan History
              </span>

              <button
                onClick={() => setClientTimelineModalName(null)}
                className="px-5 py-2 bg-[#28282c] hover:bg-[#3e3e42] text-white font-bold rounded-xl text-xs transition border border-[#3e3e42]"
              >
                Close Timeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLIENT NUTRITION PLAN MODAL */}
      {selectedClientNutritionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#1c1c1c] border border-emerald-500/40 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded uppercase">
                  Nutrition OS Sync
                </span>
                <h3 className="text-base font-black text-white mt-1 flex items-center gap-2">
                  <Apple className="w-5 h-5 text-emerald-400" />
                  <span>{selectedClientNutritionModal.clientName}'s Nutrition Protocol</span>
                </h3>
              </div>
              <button onClick={() => setSelectedClientNutritionModal(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-[#161618] border border-[#2e2e32] p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Assigned Lead Nutritionist</span>
                  <span className="text-xs font-bold text-white">{selectedClientNutritionModal.assignedNutritionist}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block">Last Updated</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{selectedClientNutritionModal.lastUpdated}</span>
                </div>
              </div>

              {/* Target Calories */}
              <div className="bg-gradient-to-r from-emerald-500/20 via-[#161618] to-emerald-500/20 border border-emerald-500/30 p-3.5 rounded-xl text-center">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">Daily Caloric Intake Target</span>
                <span className="text-2xl font-black text-white font-mono">{selectedClientNutritionModal.caloriesTarget} <span className="text-xs font-normal text-neutral-400">kcal/day</span></span>
              </div>

              {/* Macros Breakdown */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                <div className="bg-[#242428] p-2.5 rounded-xl border border-[#3e3e42]">
                  <span className="text-[9px] text-neutral-400 block uppercase">Protein</span>
                  <span className="text-base font-black text-cyan-400">{selectedClientNutritionModal.proteinGrams}g</span>
                </div>
                <div className="bg-[#242428] p-2.5 rounded-xl border border-[#3e3e42]">
                  <span className="text-[9px] text-neutral-400 block uppercase">Carbs</span>
                  <span className="text-base font-black text-amber-400">{selectedClientNutritionModal.carbsGrams}g</span>
                </div>
                <div className="bg-[#242428] p-2.5 rounded-xl border border-[#3e3e42]">
                  <span className="text-[9px] text-neutral-400 block uppercase">Fats</span>
                  <span className="text-base font-black text-rose-400">{selectedClientNutritionModal.fatsGrams}g</span>
                </div>
                <div className="bg-[#242428] p-2.5 rounded-xl border border-[#3e3e42]">
                  <span className="text-[9px] text-neutral-400 block uppercase">Water</span>
                  <span className="text-base font-black text-sky-400">{selectedClientNutritionModal.waterLiters}L</span>
                </div>
              </div>

              {/* Protocol Notes & Meal Plan */}
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Prescribed Meal Protocol & Notes:</label>
                <div className="bg-[#161618] border border-[#2e2e32] p-3 rounded-xl text-xs text-neutral-200 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                  {selectedClientNutritionModal.notes}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#2e2e32] flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Synced across System 2 DB
              </span>
              <button
                onClick={() => setSelectedClientNutritionModal(null)}
                className="px-5 py-2 bg-emerald-500 text-black font-extrabold rounded-xl text-xs hover:bg-emerald-400 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLIENT ATHLETIC ASSESSMENTS MODAL */}
      {selectedClientAssessmentsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#1c1c1c] border border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2e2e32] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded uppercase">
                  Coach Workspace Sync
                </span>
                <h3 className="text-base font-black text-white mt-1 flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-amber-400" />
                  <span>{selectedClientAssessmentsModal.client.name}'s Physical Assessments</span>
                </h3>
              </div>
              <button onClick={() => setSelectedClientAssessmentsModal(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {selectedClientAssessmentsModal.assessments.length === 0 ? (
                <div className="p-6 text-center bg-[#161618] border border-[#2e2e32] rounded-xl space-y-1">
                  <HeartPulse className="w-6 h-6 text-neutral-500 mx-auto" />
                  <div className="text-xs font-bold text-white">No Physical Assessment Logged Yet</div>
                  <p className="text-[11px] text-neutral-400">
                    Assessments saved by coaches in Coach Workspace will appear here automatically.
                  </p>
                </div>
              ) : (
                selectedClientAssessmentsModal.assessments.map((ass: any) => (
                  <div key={ass.id} className="bg-[#161618] border border-[#2e2e32] p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs border-b border-[#2e2e32] pb-2">
                      <span className="font-bold text-white">Assessed By: {ass.assessedBy}</span>
                      <span className="font-mono text-neutral-400 bg-[#242428] px-2 py-0.5 rounded border border-[#3e3e42] text-[10px]">
                        {ass.date}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      <div className="bg-[#242428] p-2 rounded-lg">
                        <span className="text-[9px] text-neutral-400 block uppercase">Weight</span>
                        <span className="font-extrabold text-white">{ass.weightKg} kg</span>
                      </div>
                      <div className="bg-[#242428] p-2 rounded-lg">
                        <span className="text-[9px] text-neutral-400 block uppercase">Body Fat</span>
                        <span className="font-extrabold text-amber-400">{ass.bodyFatPercentage}%</span>
                      </div>
                      <div className="bg-[#242428] p-2 rounded-lg">
                        <span className="text-[9px] text-neutral-400 block uppercase">VO2 Max</span>
                        <span className="font-extrabold text-cyan-400">{ass.vo2Max}</span>
                      </div>
                    </div>

                    {ass.notes && (
                      <div className="text-xs text-neutral-300 font-mono bg-[#242428] p-2 rounded-lg">
                        {ass.notes}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-[#2e2e32] flex items-center justify-between">
              <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Live Synced from Coach Workspace
              </span>
              <button
                onClick={() => setSelectedClientAssessmentsModal(null)}
                className="px-5 py-2 bg-amber-500 text-black font-extrabold rounded-xl text-xs hover:bg-amber-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
