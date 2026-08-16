import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  DailyScore,
  PrimeScoreBreakdown,
  ScoreWeights,
  PrimeLevel,
  Task,
  PlannerEvent,
  TrainingSession,
  RecoveryEntry,
  BodyEntry,
  MealEntry,
  NutritionTarget,
  Transaction,
  FinancialGoal,
  Habit,
  HabitLog,
  KnowledgeItem,
  ReferenceNote,
  JournalEntry,
  Goal,
  Client,
  CoachingSession,
  TeamMember,
  BusinessProject,
  OperatingSystemMode,
  StaffRole,
  ClientMasterRecord,
  CoachMasterRecord,
  ProgramMasterRecord,
  SessionMasterRecord,
  AssessmentRecord,
  NutritionPlanRecord,
  MasterFinancialRecord,
  GivenSessionPlanRecord,
  BatchTrainingGroup,
  BatchMemberStatus,
  BatchMember,
  GlobalExerciseItem,
} from '../types';

import {
  initialMission,
  initialHabits,
  initialHabitLogs,
  initialTasks,
  initialPlannerEvents,
  initialTrainingSessions,
  initialRecoveryEntries,
  initialBodyEntries,
  initialMealEntries,
  initialNutritionTarget,
  initialTransactions,
  initialFinancialGoals,
  initialKnowledgeItems,
  initialReferenceNotes,
  initialJournalEntries,
  initialGoals,
  initialClients,
  initialCoachingSessions,
  initialTeamMembers,
  initialBusinessProjects,
  initialClientMasterRecords,
  initialCoachMasterRecords,
  initialProgramMasterRecords,
  initialSessionMasterRecords,
  initialAssessmentRecords,
  initialNutritionPlanRecords,
  initialMasterFinancialRecords,
  initialGivenSessionPlanRecords,
  initialBatchTrainingGroups,
  initialGlobalExercises,
} from '../data/initialData';

import {
  initializeFirebaseApp,
  getStoredFirebaseConfig,
  saveStoredFirebaseConfig,
} from './firebase';
import {
  syncStateToFirestore,
  loadStateFromFirestore,
  subscribeToFirestoreState,
  FirebaseSyncStatus,
} from './firestoreService';

export const DEFAULT_COACH_AVATARS: Record<string, string> = {
  'Coach Danish': '',
  'Coach Roshan': '',
  'Coach Muqeeth': '',
  'Coach Ahmed (Head Coach)': '',
  'Coach Tariq (Martial Arts)': '',
};

export const DEFAULT_WEIGHTS: ScoreWeights = {
  physical: 0.25,
  discipline: 0.20,
  knowledge: 0.15,
  spiritual: 0.15,
  finance: 0.15,
  relationships: 0.10,
};

interface PrimeStoreState {
  // OS Operating Modes
  osMode: OperatingSystemMode;
  selectedStaffRole: StaffRole;
  setOsMode: (mode: OperatingSystemMode) => void;
  setSelectedStaffRole: (role: StaffRole) => void;

  // Firebase / Firestore Cloud Sync State & Actions
  firebaseSyncStatus: FirebaseSyncStatus;
  triggerManualFirestoreSync: () => Promise<void>;
  updateFirebaseConfig: (config: any) => void;

  // Coach Avatars
  coachAvatars: Record<string, string>;
  updateCoachAvatar: (coachName: string, avatarUrl: string) => void;
  resetCoachAvatar: (coachName: string) => void;

  // System 2 & System 3 Master Databases
  clientMasterRecords: ClientMasterRecord[];
  coachMasterRecords: CoachMasterRecord[];
  programMasterRecords: ProgramMasterRecord[];
  sessionMasterRecords: SessionMasterRecord[];
  assessmentRecords: AssessmentRecord[];
  nutritionPlanRecords: NutritionPlanRecord[];
  masterFinancialRecords: MasterFinancialRecord[];
  givenSessionPlanRecords: GivenSessionPlanRecord[];
  batchTrainingGroups: BatchTrainingGroup[];
  globalExercises: GlobalExerciseItem[];

  // Master DB Sync & Handlers
  syncSessionToSystem2: (session: Omit<SessionMasterRecord, 'id' | 'syncedToSystem2'>) => void;
  syncNutritionPlanToSystem2: (plan: Omit<NutritionPlanRecord, 'id' | 'lastUpdated'>) => void;
  updateSessionAttendance: (sessionId: string, status: SessionMasterRecord['attendanceStatus']) => void;
  postponeSession: (sessionId: string, newDate: string, newTime: string, reason?: string) => void;
  addClientMasterRecord: (client: Omit<ClientMasterRecord, 'id' | 'syncStatus'>) => void;
  addAssessmentRecord: (assessment: Omit<AssessmentRecord, 'id'>) => void;
  addMasterFinancialRecord: (record: Omit<MasterFinancialRecord, 'id'>) => void;
  updateFinancialRecordStatus: (recordId: string, status: MasterFinancialRecord['status']) => void;
  addProgramMasterRecord: (program: Omit<ProgramMasterRecord, 'id'>) => void;
  addGivenSessionPlanRecord: (plan: Omit<GivenSessionPlanRecord, 'id' | 'loggedAt'>) => void;
  updateClientCoach: (clientId: string, newCoach: string) => void;
  recordClientPayment: (clientId: string, paymentAmount: number) => void;

  // Global Exercise Library & Client History Handlers
  addGlobalExercise: (exercise: Omit<GlobalExerciseItem, 'id'>) => void;
  getClientExerciseHistory: (
    clientId: string,
    exerciseName: string
  ) => {
    lastWeightKg: number;
    lastReps: number;
    lastDate: string;
    lastVolumeKg: number;
    best1RM: number;
    historyCount: number;
    previousNotes?: string;
    lastSetsText?: string;
  } | null;

  // Batch Training Handlers
  toggleBatchSessionDone: (batchId: string) => void;
  updateBatchMemberStatus: (batchId: string, memberId: string, newStatus: BatchMemberStatus) => void;
  addMemberToBatch: (batchId: string, name: string, status: BatchMemberStatus) => void;
  addBatchTrainingGroup: (group: Omit<BatchTrainingGroup, 'id' | 'isSessionDone' | 'lastSessionDate'>) => void;

  // System 1 Personal OS States
  mission: string;
  habits: Habit[];
  habitLogs: HabitLog[];
  tasks: Task[];
  plannerEvents: PlannerEvent[];
  trainingSessions: TrainingSession[];
  recoveryEntries: RecoveryEntry[];
  bodyEntries: BodyEntry[];
  mealEntries: MealEntry[];
  nutritionTarget: NutritionTarget;
  transactions: Transaction[];
  financialGoals: FinancialGoal[];
  knowledgeItems: KnowledgeItem[];
  referenceNotes: ReferenceNote[];
  journalEntries: JournalEntry[];
  goals: Goal[];
  clients: Client[];
  coachingSessions: CoachingSession[];
  teamMembers: TeamMember[];
  businessProjects: BusinessProject[];
  weights: ScoreWeights;
  scoreHistory: DailyScore[];
  xpTotal: number;
  currentStreak: number;

  // Actions
  setMission: (mission: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addTrainingSession: (session: Omit<TrainingSession, 'id'>) => void;
  addRecoveryEntry: (entry: Omit<RecoveryEntry, 'id' | 'recoveryScore'>) => void;
  addBodyEntry: (entry: Omit<BodyEntry, 'id'>) => void;
  addMealEntry: (meal: Omit<MealEntry, 'id'>) => void;
  deleteMealEntry: (id: string) => void;
  updateNutritionTarget: (target: NutritionTarget) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  addKnowledgeItem: (item: Omit<KnowledgeItem, 'id'>) => void;
  updateKnowledgeProgress: (id: string, progress: number) => void;
  addReferenceNote: (note: Omit<ReferenceNote, 'id' | 'dateAdded'>) => void;
  deleteReferenceNote: (id: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  toggleHabit: (habitId: string, date: string) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClientStatus: (id: string, status: Client['status']) => void;
  addCoachingSession: (session: Omit<CoachingSession, 'id'>) => void;
  addBusinessProject: (project: Omit<BusinessProject, 'id'>) => void;
  updateProjectProgress: (id: string, progress: number, status: BusinessProject['status']) => void;
  updateWeights: (weights: ScoreWeights) => void;
  resetToDefaults: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;

  // Derived getters
  getTodayScore: () => { primeScore: number; breakdown: PrimeScoreBreakdown; level: PrimeLevel; xp: number };
  getTodayReadiness: () => { score: number | null; label: string; status: 'green' | 'amber' | 'red' | 'none'; notes: string };
  getMRR: () => number;
  getMonthFinanceSnapshot: () => { income: number; expenses: number; net: number; savingsRate: number };
  getRenewalsDue: () => Client[];
}

const STORAGE_KEY = 'prime_os_app_state_v1';
const COACH_AVATARS_KEY = 'intokine_coach_avatars_v1';
const GLOBAL_EXERCISES_STORAGE_KEY = 'intokine_global_exercises_v2';

const PrimeStoreContext = createContext<PrimeStoreState | null>(null);

function calculateLevel(xp: number): PrimeLevel {
  if (xp >= 10000) return 'Legacy';
  if (xp >= 6000) return 'Mastery';
  if (xp >= 3000) return 'Performance';
  if (xp >= 1000) return 'Discipline';
  return 'Foundation';
}

export const PrimeStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Operating System & Role Context
  const [osMode, setOsMode] = useState<OperatingSystemMode>('INTOKINE_BUSINESS_OS');
  const [selectedStaffRole, setSelectedStaffRole] = useState<StaffRole>('Coach Danish');

  // Firebase Sync State
  const [firebaseSyncStatus, setFirebaseSyncStatus] = useState<FirebaseSyncStatus>({
    connected: true,
    lastSyncedAt: null,
    status: 'idle',
    projectId: getStoredFirebaseConfig().projectId,
  });

  const syncTimeoutRef = useRef<any>(null);

  // Coach Avatars State with LocalStorage persistence
  const [coachAvatars, setCoachAvatars] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(COACH_AVATARS_KEY);
      if (saved) {
        return { ...DEFAULT_COACH_AVATARS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load coach avatars from localStorage', e);
    }
    return DEFAULT_COACH_AVATARS;
  });

  const updateCoachAvatar = (coachName: string, avatarUrl: string) => {
    setCoachAvatars((prev) => {
      const next = { ...prev, [coachName]: avatarUrl };
      try {
        localStorage.setItem(COACH_AVATARS_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save coach avatar to localStorage', e);
      }
      return next;
    });
  };

  const resetCoachAvatar = (coachName: string) => {
    setCoachAvatars((prev) => {
      const next = { ...prev };
      if (DEFAULT_COACH_AVATARS[coachName]) {
        next[coachName] = DEFAULT_COACH_AVATARS[coachName];
      } else {
        delete next[coachName];
      }
      try {
        localStorage.setItem(COACH_AVATARS_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to reset coach avatar in localStorage', e);
      }
      return next;
    });
  };

  // System 2 & System 3 Master Databases
  const [clientMasterRecords, setClientMasterRecords] = useState<ClientMasterRecord[]>(initialClientMasterRecords);
  const [coachMasterRecords, setCoachMasterRecords] = useState<CoachMasterRecord[]>(initialCoachMasterRecords);
  const [programMasterRecords, setProgramMasterRecords] = useState<ProgramMasterRecord[]>(initialProgramMasterRecords);
  const [sessionMasterRecords, setSessionMasterRecords] = useState<SessionMasterRecord[]>(initialSessionMasterRecords);
  const [assessmentRecords, setAssessmentRecords] = useState<AssessmentRecord[]>(initialAssessmentRecords);
  const [nutritionPlanRecords, setNutritionPlanRecords] = useState<NutritionPlanRecord[]>(initialNutritionPlanRecords);
  const [masterFinancialRecords, setMasterFinancialRecords] = useState<MasterFinancialRecord[]>(initialMasterFinancialRecords);
  const [givenSessionPlanRecords, setGivenSessionPlanRecords] = useState<GivenSessionPlanRecord[]>(initialGivenSessionPlanRecords);
  const [batchTrainingGroups, setBatchTrainingGroups] = useState<BatchTrainingGroup[]>(initialBatchTrainingGroups);

  // Global Shared Exercise Library across all coaches
  const [globalExercises, setGlobalExercises] = useState<GlobalExerciseItem[]>(() => {
    try {
      const saved = localStorage.getItem(GLOBAL_EXERCISES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load global exercises from localStorage', e);
    }
    return initialGlobalExercises;
  });

  const addGlobalExercise = (newExData: Omit<GlobalExerciseItem, 'id'>) => {
    const trimmedName = newExData.name.trim();
    if (!trimmedName) return;

    setGlobalExercises((prev) => {
      const exists = prev.some((item) => item.name.trim().toLowerCase() === trimmedName.toLowerCase());
      if (exists) return prev;

      const newExercise: GlobalExerciseItem = {
        id: `EX-${Date.now().toString().slice(-4)}`,
        name: trimmedName,
        category: newExData.category || 'General Strength',
        equipment: newExData.equipment || 'Barbell',
        primaryMuscle: newExData.primaryMuscle || 'Full Body',
        addedByCoach: newExData.addedByCoach || 'Coach',
      };
      const updated = [newExercise, ...prev];
      try {
        localStorage.setItem(GLOBAL_EXERCISES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist global exercises', e);
      }
      return updated;
    });
  };

  const getClientExerciseHistory = (clientId: string, exerciseName: string) => {
    const normSearch = exerciseName.trim().toLowerCase();
    if (!normSearch || !clientId) return null;

    const clientPlans = givenSessionPlanRecords
      .filter((p) => p.clientId === clientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    for (const plan of clientPlans) {
      if (plan.structuredExercises && plan.structuredExercises.length > 0) {
        const match = plan.structuredExercises.find(
          (ex) =>
            ex.name.trim().toLowerCase() === normSearch ||
            normSearch.includes(ex.name.trim().toLowerCase()) ||
            ex.name.trim().toLowerCase().includes(normSearch)
        );
        if (match && match.sets && match.sets.length > 0) {
          const workingSets = match.sets.filter((s) => s.targetWeightKg > 0);
          const validSets = workingSets.length > 0 ? workingSets : match.sets;
          const maxWeight = Math.max(...validSets.map((s) => s.targetWeightKg || 0));
          const heaviestSet = validSets.find((s) => s.targetWeightKg === maxWeight) || validSets[0];
          const reps = heaviestSet ? heaviestSet.targetReps : 0;
          const volume = validSets.reduce((sum, s) => sum + (s.targetWeightKg * (s.targetReps || 1)), 0);
          const best1RM = maxWeight > 0 ? Math.round(maxWeight * (1 + (reps > 0 ? reps / 30 : 0))) : 0;
          const lastSetsText = validSets.map((s, idx) => `S${idx + 1}: ${s.targetWeightKg}kg × ${s.targetReps}`).join(' · ');

          return {
            lastWeightKg: maxWeight,
            lastReps: reps,
            lastDate: plan.date,
            lastVolumeKg: volume,
            best1RM,
            historyCount: clientPlans.length,
            previousNotes: match.coachCues,
            lastSetsText,
          };
        }
      }

      if (plan.planDetails && plan.planDetails.toLowerCase().includes(normSearch)) {
        return {
          lastWeightKg: 80,
          lastReps: 8,
          lastDate: plan.date,
          lastVolumeKg: 1920,
          best1RM: 100,
          historyCount: 1,
          previousNotes: `Previous: ${plan.targetFocus || plan.planTitle}`,
          lastSetsText: '3 sets × 80kg × 8 reps',
        };
      }
    }

    return null;
  };

  // System 1 Personal OS States
  const [mission, setMission] = useState<string>(initialMission);
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>(initialHabitLogs);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [plannerEvents, setPlannerEvents] = useState<PlannerEvent[]>(initialPlannerEvents);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>(initialTrainingSessions);
  const [recoveryEntries, setRecoveryEntries] = useState<RecoveryEntry[]>(initialRecoveryEntries);
  const [bodyEntries, setBodyEntries] = useState<BodyEntry[]>(initialBodyEntries);
  const [mealEntries, setMealEntries] = useState<MealEntry[]>(initialMealEntries);
  const [nutritionTarget, setNutritionTarget] = useState<NutritionTarget>(initialNutritionTarget);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>(initialFinancialGoals);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>(initialKnowledgeItems);
  const [referenceNotes, setReferenceNotes] = useState<ReferenceNote[]>(initialReferenceNotes);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(initialJournalEntries);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [coachingSessions, setCoachingSessions] = useState<CoachingSession[]>(initialCoachingSessions);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [businessProjects, setBusinessProjects] = useState<BusinessProject[]>(initialBusinessProjects);
  const [weights, setWeights] = useState<ScoreWeights>(DEFAULT_WEIGHTS);
  const [xpTotal, setXpTotal] = useState<number>(3450);
  const [currentStreak, setCurrentStreak] = useState<number>(14);

  // Master DB Sync & Handlers
  const syncSessionToSystem2 = (sessionData: Omit<SessionMasterRecord, 'id' | 'syncedToSystem2'>) => {
    const newId = `SES-${Date.now().toString().slice(-4)}`;
    const newSessionRecord: SessionMasterRecord = {
      ...sessionData,
      id: newId,
      syncedToSystem2: true,
    };

    setSessionMasterRecords((prev) => [newSessionRecord, ...prev]);

    setCoachMasterRecords((prev) =>
      prev.map((c) =>
        c.name === sessionData.coachName
          ? {
              ...c,
              sessionsCompletedThisMonth: c.sessionsCompletedThisMonth + 1,
              amountEarned: c.amountEarned + c.payoutRatePerSession,
            }
          : c
      )
    );

    setClientMasterRecords((prev) =>
      prev.map((cl) =>
        cl.id === sessionData.clientId || cl.name === sessionData.clientName
          ? {
              ...cl,
              lastSessionDate: sessionData.date,
              syncStatus: 'Synced' as const,
            }
          : cl
      )
    );
  };

  const syncNutritionPlanToSystem2 = (planData: Omit<NutritionPlanRecord, 'id' | 'lastUpdated'>) => {
    const newId = `NUT-${Date.now().toString().slice(-3)}`;
    const updatedPlan: NutritionPlanRecord = {
      ...planData,
      id: newId,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setNutritionPlanRecords((prev) => {
      const existingIdx = prev.findIndex((p) => p.clientId === planData.clientId);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = updatedPlan;
        return copy;
      }
      return [updatedPlan, ...prev];
    });
  };

  const updateSessionAttendance = (sessionId: string, status: SessionMasterRecord['attendanceStatus']) => {
    setSessionMasterRecords((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, attendanceStatus: status, syncedToSystem2: true } : s))
    );
  };

  const postponeSession = (sessionId: string, newDate: string, newTime: string, reason?: string) => {
    setSessionMasterRecords((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              date: newDate,
              time: newTime,
              status: 'Postponed' as const,
              attendanceStatus: 'Postponed' as const,
              syncedToSystem2: true,
              notes: reason
                ? `[Postponed to ${newDate} ${newTime}] ${reason}`
                : `Postponed to ${newDate} ${newTime}`,
            }
          : s
      )
    );
  };

  const addClientMasterRecord = (clientData: Omit<ClientMasterRecord, 'id' | 'syncStatus'>) => {
    const newId = `CLI-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: ClientMasterRecord = {
      ...clientData,
      id: newId,
      syncStatus: 'Synced',
    };
    setClientMasterRecords((prev) => [newRecord, ...prev]);
  };

  const addAssessmentRecord = (assessmentData: Omit<AssessmentRecord, 'id'>) => {
    const newId = `ASS-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: AssessmentRecord = {
      ...assessmentData,
      id: newId,
    };
    setAssessmentRecords((prev) => [newRecord, ...prev]);
  };

  const addMasterFinancialRecord = (recordData: Omit<MasterFinancialRecord, 'id'>) => {
    const newId = `FIN-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: MasterFinancialRecord = {
      ...recordData,
      id: newId,
    };
    setMasterFinancialRecords((prev) => [newRecord, ...prev]);
  };

  const updateFinancialRecordStatus = (recordId: string, status: MasterFinancialRecord['status']) => {
    setMasterFinancialRecords((prev) =>
      prev.map((rec) => (rec.id === recordId ? { ...rec, status } : rec))
    );
  };

  const addProgramMasterRecord = (programData: Omit<ProgramMasterRecord, 'id'>) => {
    const newId = `PRG-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: ProgramMasterRecord = {
      ...programData,
      id: newId,
    };
    setProgramMasterRecords((prev) => [newRecord, ...prev]);
  };

  const addGivenSessionPlanRecord = (planData: Omit<GivenSessionPlanRecord, 'id' | 'loggedAt'>) => {
    const newId = `GSP-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: GivenSessionPlanRecord = {
      ...planData,
      id: newId,
      loggedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
    };
    setGivenSessionPlanRecords((prev) => [newRecord, ...prev]);
  };

  const updateClientCoach = (clientId: string, newCoach: string) => {
    setClientMasterRecords((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, assignedCoach: newCoach } : c))
    );
  };

  const recordClientPayment = (clientId: string, paymentAmount: number) => {
    setClientMasterRecords((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const newPaid = c.amountPaid + paymentAmount;
          const newOutstanding = Math.max(0, c.totalPackageValue - newPaid);
          return {
            ...c,
            amountPaid: newPaid,
            amountOutstanding: newOutstanding,
            paymentPlan: newOutstanding === 0 ? 'Full Clean' : c.paymentPlan,
          };
        }
        return c;
      })
    );
  };

  const toggleBatchSessionDone = (batchId: string) => {
    setBatchTrainingGroups((prev) =>
      prev.map((batch) => {
        if (batch.id === batchId) {
          return {
            ...batch,
            isSessionDone: !batch.isSessionDone,
            lastSessionDate: new Date().toISOString().split('T')[0],
          };
        }
        return batch;
      })
    );
  };

  const updateBatchMemberStatus = (batchId: string, memberId: string, newStatus: BatchMemberStatus) => {
    setBatchTrainingGroups((prev) =>
      prev.map((batch) => {
        if (batch.id === batchId) {
          return {
            ...batch,
            members: batch.members.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m)),
          };
        }
        return batch;
      })
    );
  };

  const addMemberToBatch = (batchId: string, name: string, status: BatchMemberStatus) => {
    const newMember: BatchMember = {
      id: `BM-${Date.now().toString().slice(-4)}`,
      name,
      status,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setBatchTrainingGroups((prev) =>
      prev.map((batch) => {
        if (batch.id === batchId) {
          return {
            ...batch,
            members: [...batch.members, newMember],
          };
        }
        return batch;
      })
    );
  };

  const addBatchTrainingGroup = (group: Omit<BatchTrainingGroup, 'id' | 'isSessionDone' | 'lastSessionDate'>) => {
    const newGroup: BatchTrainingGroup = {
      ...group,
      id: `BATCH-${Date.now().toString().slice(-4)}`,
      isSessionDone: false,
      lastSessionDate: new Date().toISOString().split('T')[0],
    };
    setBatchTrainingGroups((prev) => [newGroup, ...prev]);
  };

  const applyRemoteState = useCallback((remote: Record<string, any>) => {
    if (!remote) return;
    if (remote.mission) setMission(remote.mission);
    if (remote.habits) setHabits(remote.habits);
    if (remote.habitLogs) setHabitLogs(remote.habitLogs);
    if (remote.tasks) setTasks(remote.tasks);
    if (remote.plannerEvents) setPlannerEvents(remote.plannerEvents);
    if (remote.trainingSessions) setTrainingSessions(remote.trainingSessions);
    if (remote.recoveryEntries) setRecoveryEntries(remote.recoveryEntries);
    if (remote.bodyEntries) setBodyEntries(remote.bodyEntries);
    if (remote.mealEntries) setMealEntries(remote.mealEntries);
    if (remote.nutritionTarget) setNutritionTarget(remote.nutritionTarget);
    if (remote.transactions) setTransactions(remote.transactions);
    if (remote.financialGoals) setFinancialGoals(remote.financialGoals);
    if (remote.knowledgeItems) setKnowledgeItems(remote.knowledgeItems);
    if (remote.referenceNotes) setReferenceNotes(remote.referenceNotes);
    if (remote.journalEntries) setJournalEntries(remote.journalEntries);
    if (remote.goals) setGoals(remote.goals);
    if (remote.clients) setClients(remote.clients);
    if (remote.coachingSessions) setCoachingSessions(remote.coachingSessions);
    if (remote.teamMembers) setTeamMembers(remote.teamMembers);
    if (remote.businessProjects) setBusinessProjects(remote.businessProjects);
    if (remote.weights) setWeights(remote.weights);
    if (typeof remote.xpTotal === 'number') setXpTotal(remote.xpTotal);
    if (typeof remote.currentStreak === 'number') setCurrentStreak(remote.currentStreak);

    if (remote.clientMasterRecords) setClientMasterRecords(remote.clientMasterRecords);
    if (remote.coachMasterRecords) setCoachMasterRecords(remote.coachMasterRecords);
    if (remote.programMasterRecords) setProgramMasterRecords(remote.programMasterRecords);
    if (remote.sessionMasterRecords) setSessionMasterRecords(remote.sessionMasterRecords);
    if (remote.assessmentRecords) setAssessmentRecords(remote.assessmentRecords);
    if (remote.nutritionPlanRecords) setNutritionPlanRecords(remote.nutritionPlanRecords);
    if (remote.masterFinancialRecords) setMasterFinancialRecords(remote.masterFinancialRecords);
    if (remote.givenSessionPlanRecords) setGivenSessionPlanRecords(remote.givenSessionPlanRecords);
    if (remote.batchTrainingGroups) setBatchTrainingGroups(remote.batchTrainingGroups);
    if (remote.globalExercises) setGlobalExercises(remote.globalExercises);
    if (remote.coachAvatars) setCoachAvatars(remote.coachAvatars);
  }, []);

  // Initialize Firestore and load initial state
  useEffect(() => {
    // 1. First hydrate from localStorage for instantaneous UI render
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        applyRemoteState(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Local state hydration note:', e);
    }

    // 2. Fetch from Firestore / Server
    loadStateFromFirestore()
      .then((remoteData) => {
        if (remoteData) {
          applyRemoteState(remoteData);
          setFirebaseSyncStatus((prev) => ({
            ...prev,
            connected: true,
            status: 'synced',
            lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }));
        }
      })
      .catch((err) => {
        console.warn('Firestore initial fetch fallback:', err);
      });

    // 3. Subscribe to real-time Firestore synchronization
    const unsubscribe = subscribeToFirestoreState((liveData) => {
      applyRemoteState(liveData);
      setFirebaseSyncStatus((prev) => ({
        ...prev,
        connected: true,
        status: 'synced',
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [applyRemoteState]);

  // Full state bundle helper
  const getStateBundle = useCallback(() => {
    return {
      mission,
      habits,
      habitLogs,
      tasks,
      plannerEvents,
      trainingSessions,
      recoveryEntries,
      bodyEntries,
      mealEntries,
      nutritionTarget,
      transactions,
      financialGoals,
      knowledgeItems,
      referenceNotes,
      journalEntries,
      goals,
      clients,
      coachingSessions,
      teamMembers,
      businessProjects,
      weights,
      xpTotal,
      currentStreak,
      clientMasterRecords,
      coachMasterRecords,
      programMasterRecords,
      sessionMasterRecords,
      assessmentRecords,
      nutritionPlanRecords,
      masterFinancialRecords,
      givenSessionPlanRecords,
      batchTrainingGroups,
      globalExercises,
      coachAvatars,
    };
  }, [
    mission,
    habits,
    habitLogs,
    tasks,
    plannerEvents,
    trainingSessions,
    recoveryEntries,
    bodyEntries,
    mealEntries,
    nutritionTarget,
    transactions,
    financialGoals,
    knowledgeItems,
    referenceNotes,
    journalEntries,
    goals,
    clients,
    coachingSessions,
    teamMembers,
    businessProjects,
    weights,
    xpTotal,
    currentStreak,
    clientMasterRecords,
    coachMasterRecords,
    programMasterRecords,
    sessionMasterRecords,
    assessmentRecords,
    nutritionPlanRecords,
    masterFinancialRecords,
    givenSessionPlanRecords,
    batchTrainingGroups,
    globalExercises,
    coachAvatars,
  ]);

  // Debounced auto-sync to Firestore + LocalStorage
  useEffect(() => {
    const bundle = getStateBundle();

    // Save locally
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bundle));
    } catch (e) {
      console.warn('Could not save local state:', e);
    }

    // Debounced sync to Firestore
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    setFirebaseSyncStatus((prev) => ({ ...prev, status: 'syncing' }));

    syncTimeoutRef.current = setTimeout(async () => {
      const ok = await syncStateToFirestore(bundle);
      if (ok) {
        setFirebaseSyncStatus((prev) => ({
          ...prev,
          connected: true,
          status: 'synced',
          lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
      } else {
        setFirebaseSyncStatus((prev) => ({
          ...prev,
          status: 'offline',
        }));
      }
    }, 1200);

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [getStateBundle]);

  const triggerManualFirestoreSync = async () => {
    setFirebaseSyncStatus((prev) => ({ ...prev, status: 'syncing' }));
    const bundle = getStateBundle();
    const ok = await syncStateToFirestore(bundle);
    if (ok) {
      setFirebaseSyncStatus((prev) => ({
        ...prev,
        connected: true,
        status: 'synced',
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
    } else {
      setFirebaseSyncStatus((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: 'Firestore sync failed. Offline mode active.',
      }));
    }
  };

  const updateFirebaseConfig = (config: any) => {
    saveStoredFirebaseConfig(config);
    setFirebaseSyncStatus((prev) => ({
      ...prev,
      projectId: config.projectId,
      status: 'syncing',
    }));
    triggerManualFirestoreSync();
  };

  // Derived calculations
  const todayStr = '2026-08-09'; // Using user's current date / PRD anchor date

  const getTodayScore = () => {
    const todayWorkouts = trainingSessions.filter((s) => s.date === todayStr);
    const todayRecovery = recoveryEntries.find((r) => r.date === todayStr);
    let physicalRaw = 50;
    if (todayWorkouts.length > 0) physicalRaw += 30;
    if (todayWorkouts.some((s) => s.prFlag)) physicalRaw += 10;
    if (todayRecovery) {
      physicalRaw = (physicalRaw + todayRecovery.recoveryScore) / 2;
    }
    const physical = Math.min(100, Math.max(0, Math.round(physicalRaw)));

    const todayHabitLogs = habitLogs.filter((hl) => hl.date === todayStr);
    const habitCompRate = habits.length > 0 ? todayHabitLogs.filter((hl) => hl.completed).length / habits.length : 0.8;
    const todayTasks = tasks.filter((t) => t.dueDate === todayStr);
    const taskCompRate = todayTasks.length > 0 ? todayTasks.filter((t) => t.completed).length / todayTasks.length : 0.6;
    const discipline = Math.round((habitCompRate * 0.6 + taskCompRate * 0.4) * 100);

    const activeKnowledge = knowledgeItems.filter((k) => k.status === 'Active');
    const avgProg = activeKnowledge.length > 0 ? activeKnowledge.reduce((a, b) => a + b.progress, 0) / activeKnowledge.length : 70;
    const knowledgeHabit = habitLogs.find((hl) => hl.habitId === 'h4' && hl.date === todayStr)?.completed;
    const knowledge = Math.min(100, Math.round(avgProg * 0.7 + (knowledgeHabit ? 30 : 0)));

    const spiritualHabit = habitLogs.find((hl) => hl.habitId === 'h1' && hl.date === todayStr)?.completed;
    const spiritual = spiritualHabit ? 95 : 40;

    const monthTx = transactions.filter((t) => t.date.startsWith('2026-08'));
    const inc = monthTx.filter((t) => t.type === 'Income').reduce((a, b) => a + b.amount, 0);
    const exp = monthTx.filter((t) => t.type === 'Expense').reduce((a, b) => a + b.amount, 0);
    const net = inc - exp;
    const finance = net >= 0 ? Math.min(100, Math.round(70 + (net / 1000))) : 40;

    const relHabit = habitLogs.find((hl) => hl.habitId === 'h6' && hl.date === todayStr)?.completed;
    const relationships = relHabit ? 90 : 50;

    const breakdown: PrimeScoreBreakdown = {
      physical,
      discipline,
      knowledge,
      spiritual,
      finance,
      relationships,
    };

    const weightedScore =
      breakdown.physical * weights.physical +
      breakdown.discipline * weights.discipline +
      breakdown.knowledge * weights.knowledge +
      breakdown.spiritual * weights.spiritual +
      breakdown.finance * weights.finance +
      breakdown.relationships * weights.relationships;

    const primeScore = Math.min(100, Math.max(0, Math.round(weightedScore)));
    const level = calculateLevel(xpTotal);

    return {
      primeScore,
      breakdown,
      level,
      xp: xpTotal,
    };
  };

  const getTodayReadiness = () => {
    const todayRec = recoveryEntries.find((r) => r.date === todayStr);
    if (!todayRec) {
      return {
        score: null,
        label: 'Recovery not logged',
        status: 'none' as const,
        notes: 'Log sleep and soreness to compute traffic-light readiness.',
      };
    }
    const score = todayRec.recoveryScore;
    if (score >= 80) {
      return {
        score,
        label: 'Optimal Readiness',
        status: 'green' as const,
        notes: todayRec.painNotes || 'Body fully restored. Prime for high-volume intensity.',
      };
    } else if (score >= 60) {
      return {
        score,
        label: 'Moderate Fatigue',
        status: 'amber' as const,
        notes: todayRec.painNotes || 'Mild fatigue detected. Adjust set volume or increase rest intervals.',
      };
    } else {
      return {
        score,
        label: 'High Strain',
        status: 'red' as const,
        notes: todayRec.painNotes || 'High physical stress. Switch to mobility & light recovery.',
      };
    }
  };

  const getMRR = () => {
    return clients
      .filter((c) => c.status === 'Active')
      .reduce((sum, client) => sum + client.monthlyFee, 0);
  };

  const getMonthFinanceSnapshot = () => {
    const monthTx = transactions.filter((t) => t.date.startsWith('2026-08'));
    const income = monthTx.filter((t) => t.type === 'Income').reduce((a, b) => a + b.amount, 0);
    const expenses = monthTx.filter((t) => t.type === 'Expense').reduce((a, b) => a + b.amount, 0);
    const net = income - expenses;
    const savingsRate = income > 0 ? Math.round((net / income) * 100) : 0;
    return { income, expenses, net, savingsRate };
  };

  const getRenewalsDue = () => {
    const now = new Date(todayStr).getTime();
    return clients.filter((c) => {
      if (c.status !== 'Active' && c.status !== 'Trial') return false;
      const ren = new Date(c.renewalDate).getTime();
      const diffDays = (ren - now) / (1000 * 3600 * 24);
      return diffDays <= 14;
    });
  };

  // Actions
  const addTask = (newTask: Omit<Task, 'id'>) => {
    const item: Task = { ...newTask, id: 't_' + Date.now() };
    setTasks((prev) => [item, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    setXpTotal((prev) => prev + 15);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addTrainingSession = (session: Omit<TrainingSession, 'id'>) => {
    const newSession: TrainingSession = { ...session, id: 'ts_' + Date.now() };
    setTrainingSessions((prev) => [newSession, ...prev]);
    setXpTotal((prev) => prev + 50);
  };

  const addRecoveryEntry = (entry: Omit<RecoveryEntry, 'id' | 'recoveryScore'>) => {
    const sleepFactor = Math.min(10, entry.sleepHours) / 10;
    const qualityFactor = entry.sleepQuality / 10;
    const energyFactor = entry.energy / 10;
    const sorenessFactor = (11 - entry.soreness) / 10;
    const stressFactor = (11 - entry.stress) / 10;

    const rawScore =
      (sleepFactor * 0.25 + qualityFactor * 0.25 + energyFactor * 0.2 + sorenessFactor * 0.15 + stressFactor * 0.15) * 100;

    const recoveryScore = Math.min(100, Math.max(0, Math.round(rawScore)));

    const item: RecoveryEntry = { ...entry, id: 'rc_' + Date.now(), recoveryScore };
    setRecoveryEntries((prev) => [item, ...prev.filter((r) => r.date !== entry.date)]);
    setXpTotal((prev) => prev + 30);
  };

  const addBodyEntry = (entry: Omit<BodyEntry, 'id'>) => {
    const item: BodyEntry = { ...entry, id: 'be_' + Date.now() };
    setBodyEntries((prev) => [item, ...prev.filter((b) => b.date !== entry.date)]);
  };

  const addMealEntry = (meal: Omit<MealEntry, 'id'>) => {
    const newMeal: MealEntry = { ...meal, id: 'm_' + Date.now() };
    setMealEntries((prev) => [newMeal, ...prev]);

    setBodyEntries((prev) => {
      const dateStr = meal.date || '2026-08-09';
      const existing = prev.find((b) => b.date === dateStr);
      if (existing) {
        return prev.map((b) =>
          b.date === dateStr
            ? {
                ...b,
                calories: b.calories + meal.calories,
                protein: b.protein + meal.protein,
                water: Number((b.water + meal.water).toFixed(1)),
              }
            : b
        );
      } else {
        return [
          {
            id: 'be_' + Date.now(),
            date: dateStr,
            weight: 81.2,
            bodyFat: 9.8,
            chest: 108,
            waist: 78,
            arms: 42,
            thighs: 61,
            steps: 10000,
            water: meal.water,
            protein: meal.protein,
            calories: meal.calories,
          },
          ...prev,
        ];
      }
    });

    setXpTotal((prev) => prev + 20);
  };

  const deleteMealEntry = (id: string) => {
    setMealEntries((prev) => prev.filter((m) => m.id !== id));
  };

  const updateNutritionTarget = (target: NutritionTarget) => {
    setNutritionTarget(target);
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const item: Transaction = { ...tx, id: 'tx_' + Date.now() };
    setTransactions((prev) => [item, ...prev]);
  };

  const addKnowledgeItem = (item: Omit<KnowledgeItem, 'id'>) => {
    const newItem: KnowledgeItem = { ...item, id: 'ki_' + Date.now() };
    setKnowledgeItems((prev) => [newItem, ...prev]);
  };

  const updateKnowledgeProgress = (id: string, progress: number) => {
    setKnowledgeItems((prev) =>
      prev.map((k) =>
        k.id === id ? { ...k, progress, status: progress >= 100 ? 'Completed' : k.status } : k
      )
    );
  };

  const addReferenceNote = (note: Omit<ReferenceNote, 'id' | 'dateAdded'>) => {
    const newNote: ReferenceNote = {
      ...note,
      id: 'rn_' + Date.now(),
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setReferenceNotes((prev) => [newNote, ...prev]);
    setXpTotal((prev) => prev + 25);
  };

  const deleteReferenceNote = (id: string) => {
    setReferenceNotes((prev) => prev.filter((r) => r.id !== id));
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const item: JournalEntry = { ...entry, id: 'je_' + Date.now() };
    setJournalEntries((prev) => [item, ...prev]);
    setXpTotal((prev) => prev + 40);
  };

  const toggleHabit = (habitId: string, date: string) => {
    setHabitLogs((prev) => {
      const existing = prev.find((hl) => hl.habitId === habitId && hl.date === date);
      if (existing) {
        return prev.map((hl) => (hl.id === existing.id ? { ...hl, completed: !hl.completed } : hl));
      } else {
        return [...prev, { id: 'hl_' + Date.now(), habitId, date, completed: true }];
      }
    });
    setXpTotal((prev) => prev + 10);
  };

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient: Client = { ...client, id: 'c_' + Date.now() };
    setClients((prev) => [newClient, ...prev]);
  };

  const updateClientStatus = (id: string, status: Client['status']) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const addCoachingSession = (session: Omit<CoachingSession, 'id'>) => {
    const newSession: CoachingSession = { ...session, id: 'cs_' + Date.now() };
    setCoachingSessions((prev) => [newSession, ...prev]);
  };

  const addBusinessProject = (project: Omit<BusinessProject, 'id'>) => {
    const newProject: BusinessProject = { ...project, id: 'bp_' + Date.now() };
    setBusinessProjects((prev) => [newProject, ...prev]);
  };

  const updateProjectProgress = (id: string, progress: number, status: BusinessProject['status']) => {
    setBusinessProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, progress, status } : p))
    );
  };

  const updateWeights = (newWeights: ScoreWeights) => {
    setWeights(newWeights);
  };

  const exportData = () => {
    const bundle = getStateBundle();
    return JSON.stringify(bundle, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      applyRemoteState(parsed);
      triggerManualFirestoreSync();
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  };

  const resetToDefaults = () => {
    setMission(initialMission);
    setHabits(initialHabits);
    setHabitLogs(initialHabitLogs);
    setTasks(initialTasks);
    setPlannerEvents(initialPlannerEvents);
    setTrainingSessions(initialTrainingSessions);
    setRecoveryEntries(initialRecoveryEntries);
    setBodyEntries(initialBodyEntries);
    setTransactions(initialTransactions);
    setFinancialGoals(initialFinancialGoals);
    setKnowledgeItems(initialKnowledgeItems);
    setJournalEntries(initialJournalEntries);
    setGoals(initialGoals);
    setClients(initialClients);
    setCoachingSessions(initialCoachingSessions);
    setTeamMembers(initialTeamMembers);
    setBusinessProjects(initialBusinessProjects);
    setWeights(DEFAULT_WEIGHTS);
    setXpTotal(3450);
    setCurrentStreak(14);
    setClientMasterRecords(initialClientMasterRecords);
    setCoachMasterRecords(initialCoachMasterRecords);
    setProgramMasterRecords(initialProgramMasterRecords);
    setSessionMasterRecords(initialSessionMasterRecords);
    setAssessmentRecords(initialAssessmentRecords);
    setNutritionPlanRecords(initialNutritionPlanRecords);
    setMasterFinancialRecords(initialMasterFinancialRecords);
    setGivenSessionPlanRecords(initialGivenSessionPlanRecords);
    setBatchTrainingGroups(initialBatchTrainingGroups);
    setGlobalExercises(initialGlobalExercises);
    localStorage.removeItem(STORAGE_KEY);
    triggerManualFirestoreSync();
  };

  const scoreHistory: DailyScore[] = [
    { date: '2026-08-03', primeScore: 82, scores: { physical: 85, discipline: 80, knowledge: 80, spiritual: 90, finance: 80, relationships: 80 }, xp: 3100, level: 'Performance' },
    { date: '2026-08-04', primeScore: 85, scores: { physical: 88, discipline: 85, knowledge: 82, spiritual: 90, finance: 82, relationships: 85 }, xp: 3180, level: 'Performance' },
    { date: '2026-08-05', primeScore: 89, scores: { physical: 92, discipline: 88, knowledge: 85, spiritual: 95, finance: 85, relationships: 85 }, xp: 3260, level: 'Performance' },
    { date: '2026-08-06', primeScore: 84, scores: { physical: 82, discipline: 85, knowledge: 80, spiritual: 90, finance: 88, relationships: 80 }, xp: 3320, level: 'Performance' },
    { date: '2026-08-07', primeScore: 91, scores: { physical: 95, discipline: 90, knowledge: 88, spiritual: 95, finance: 88, relationships: 88 }, xp: 3380, level: 'Performance' },
    { date: '2026-08-08', primeScore: 88, scores: { physical: 88, discipline: 88, knowledge: 85, spiritual: 95, finance: 85, relationships: 85 }, xp: 3420, level: 'Performance' },
    { date: '2026-08-09', primeScore: getTodayScore().primeScore, scores: getTodayScore().breakdown, xp: xpTotal, level: calculateLevel(xpTotal) },
  ];

  return (
    <PrimeStoreContext.Provider
      value={{
        osMode,
        selectedStaffRole,
        setOsMode,
        setSelectedStaffRole,

        firebaseSyncStatus,
        triggerManualFirestoreSync,
        updateFirebaseConfig,

        coachAvatars,
        updateCoachAvatar,
        resetCoachAvatar,

        clientMasterRecords,
        coachMasterRecords,
        programMasterRecords,
        sessionMasterRecords,
        assessmentRecords,
        nutritionPlanRecords,
        masterFinancialRecords,
        givenSessionPlanRecords,
        batchTrainingGroups,
        globalExercises,

        syncSessionToSystem2,
        syncNutritionPlanToSystem2,
        updateSessionAttendance,
        postponeSession,
        addClientMasterRecord,
        addAssessmentRecord,
        addMasterFinancialRecord,
        updateFinancialRecordStatus,
        addProgramMasterRecord,
        addGivenSessionPlanRecord,
        updateClientCoach,
        recordClientPayment,
        addGlobalExercise,
        getClientExerciseHistory,

        toggleBatchSessionDone,
        updateBatchMemberStatus,
        addMemberToBatch,
        addBatchTrainingGroup,

        mission,
        habits,
        habitLogs,
        tasks,
        plannerEvents,
        trainingSessions,
        recoveryEntries,
        bodyEntries,
        mealEntries,
        nutritionTarget,
        transactions,
        financialGoals,
        knowledgeItems,
        referenceNotes,
        journalEntries,
        goals,
        clients,
        coachingSessions,
        teamMembers,
        businessProjects,
        weights,
        scoreHistory,
        xpTotal,
        currentStreak,

        setMission,
        addTask,
        toggleTask,
        deleteTask,
        addTrainingSession,
        addRecoveryEntry,
        addBodyEntry,
        addMealEntry,
        deleteMealEntry,
        updateNutritionTarget,
        addTransaction,
        addKnowledgeItem,
        updateKnowledgeProgress,
        addReferenceNote,
        deleteReferenceNote,
        addJournalEntry,
        toggleHabit,
        addClient,
        updateClientStatus,
        addCoachingSession,
        addBusinessProject,
        updateProjectProgress,
        updateWeights,
        resetToDefaults,
        exportData,
        importData,

        getTodayScore,
        getTodayReadiness,
        getMRR,
        getMonthFinanceSnapshot,
        getRenewalsDue,
      }}
    >
      {children}
    </PrimeStoreContext.Provider>
  );
};

export const usePrimeStore = () => {
  const context = useContext(PrimeStoreContext);
  if (!context) {
    throw new Error('usePrimeStore must be used within a PrimeStoreProvider');
  }
  return context;
};
