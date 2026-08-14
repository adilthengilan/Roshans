export type PrimeLevel = 'Foundation' | 'Discipline' | 'Performance' | 'Mastery' | 'Legacy';

export interface PrimeScoreBreakdown {
  physical: number;
  discipline: number;
  knowledge: number;
  spiritual: number;
  finance: number;
  relationships: number;
}

export interface ScoreWeights {
  physical: number;     // 0.25
  discipline: number;   // 0.20
  knowledge: number;    // 0.15
  spiritual: number;    // 0.15
  finance: number;      // 0.15
  relationships: number;// 0.10
}

export interface DailyScore {
  date: string; // YYYY-MM-DD
  scores: PrimeScoreBreakdown;
  primeScore: number;
  xp: number;
  level: PrimeLevel;
}

export interface Task {
  id: string;
  name: string;
  status: 'Must Do' | 'Important' | 'Growth';
  completed: boolean;
  category: string;
  dueDate: string;
  reminder?: boolean;
}

export interface PlannerEvent {
  id: string;
  activity: string;
  date: string;
  time: string;
  category: 'Training' | 'Client Session' | 'Business' | 'Personal' | 'Rest';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export type TrainingType =
  | 'Calisthenics'
  | 'Boxing'
  | 'Kickboxing'
  | 'CrossFit'
  | 'Wrestling'
  | 'Acrobatics'
  | 'Weapon Skills'
  | 'Running'
  | 'Strength'
  | 'Mobility'
  | 'Recovery';

export interface SetLog {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
  notes?: string;
}

export interface ActiveExercise {
  id: string;
  name: string;
  category: string;
  sets: SetLog[];
}

export interface SetBlock {
  id: string;
  title?: string;
  exercises: ActiveExercise[];
}

export interface ExerciseSet {
  name: string;
  sets: number;
  reps: string;
  weightKg?: number;
  completed: boolean;
}

export interface TrainingSession {
  id: string;
  date: string;
  slot: 'Morning' | 'Evening' | 'Single';
  type: TrainingType | string;
  goal: string;
  intensity?: number; // 1-10
  sets: number;
  reps: number;
  rpe: number; // 1-10
  duration: number; // minutes
  prFlag: boolean;
  exercises: (ExerciseSet | string)[];
  performanceNotes?: string;
  nextImprovement?: string;
  blocks?: SetBlock[];
}

export interface RecoveryEntry {
  id: string;
  date: string;
  sleepHours: number;
  sleepQuality: number; // 1-10
  energy: number; // 1-10
  soreness: number; // 1-10
  stress: number; // 1-10
  restingHr: number; // bpm
  painNotes: string;
  recoveryAction: string;
  recoveryScore: number; // 0-100 derived
}

export interface BodyEntry {
  id: string;
  date: string;
  weight: number; // kg
  bodyFat: number; // %
  chest: number; // cm
  waist: number; // cm
  arms: number; // cm
  thighs: number; // cm
  steps: number;
  water: number; // Liters
  protein: number; // grams
  calories: number; // kcal
}

export interface MealEntry {
  id: string;
  date: string;
  time: string;
  name: string;
  mealType: 'Breakfast' | 'Lunch' | 'Post-Workout' | 'Dinner' | 'Snack' | 'Hydration';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  water: number;
  notes?: string;
}

export interface NutritionTarget {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  water: number;
}

export interface Transaction {
  id: string;
  name: string;
  amount: number; // AED
  type: 'Income' | 'Expense';
  category: 'Coaching' | 'Brand' | 'Living' | 'Gear' | 'Travel' | 'Health' | 'Education' | 'Other';
  date: string;
  needOrWant: 'Need' | 'Want';
  goalId?: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
}

export interface Habit {
  id: string;
  name: string;
  category: 'Physical' | 'Discipline' | 'Knowledge' | 'Spiritual' | 'Relationships' | 'Finance';
  cadence: 'Daily' | 'Weekly';
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  type: 'Book' | 'Research' | 'Course' | 'Article';
  source: string;
  status: 'Inbox' | 'Active' | 'Completed';
  progress: number; // 0-100
  keyLearning: string;
}

export interface ReferenceNote {
  id: string;
  subject: string;
  topic: string;
  book?: string;
  paragraph?: string;
  note: string;
  source?: string;
  dateAdded: string;
  keyTakeaway?: string;
  tags?: string[];
  diagramUrl?: string;
  diagramCaption?: string;
  diagramCode?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  type: 'Morning' | 'Night' | 'General' | 'Weekly';
  accomplished?: string;
  difficult?: string;
  learned?: string;
  trained?: string;
  money?: string;
  spiritual?: string;
  tomorrowMission?: string;
  reflection: string;
}

export interface Goal {
  id: string;
  name: string;
  area: 'Physical' | 'Business' | 'Finance' | 'Growth' | 'Spiritual';
  target: string;
  deadline: string;
  progress: number; // 0-100
}

export type ClientStatus = 'Lead' | 'Trial' | 'Active' | 'Paused' | 'Churned';

export interface Client {
  id: string;
  name: string;
  status: ClientStatus;
  service: string;
  disciplines: string[];
  brand: 'INTOKINE' | 'Zaki Wellness' | 'KATBA Athletics';
  assignedCoach: string;
  monthlyFee: number; // AED
  startDate: string;
  renewalDate: string; // YYYY-MM-DD
  contact: string;
  healthNotes: string;
}

export interface CoachingSession {
  id: string;
  date: string;
  time: string;
  clientName: string;
  coachName: string;
  type: string;
  discipline: string;
  location: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  plan: string;
  notes: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'Head Coach' | 'Coach' | 'Nutritionist' | 'Psychologist' | 'Admin';
  brand: string;
  specialties: string[];
  status: 'Active' | 'On Leave';
  contact: string;
  monthlySessionsDelivered?: number;
}

export interface BusinessProject {
  id: string;
  name: string;
  status: 'Idea' | 'Planning' | 'Active' | 'Review' | 'Done';
  priority: 'P0' | 'P1' | 'P2';
  area: 'Operations' | 'Marketing' | 'Finance' | 'Team' | 'Product' | 'Partnerships';
  brand: 'INTOKINE' | 'Zaki Wellness' | 'KATBA Athletics';
  owner: string;
  timeline: string;
  progress: number; // 0-100
  nextStep: string;
  notes: string;
}

export type OperatingSystemMode = 'INTOKINE_BUSINESS_OS' | 'INTOKINE_WORKSPACE' | 'NUTRITION_OS';

export type StaffRole = 
  | 'Coach Danish'
  | 'Coach Roshan'
  | 'Coach Muqeeth'
  | 'Coach Ahmed (Head Coach)'
  | 'Coach Tariq (Martial Arts)'
  | 'Sara Al-Mansoori (Lead Nutritionist)'
  | 'Dr. Zeyad (Physiotherapy)';

export interface ClientMasterRecord {
  id: string;
  name: string;
  status: ClientStatus;
  program: string;
  assignedCoach: string;
  assignedNutritionist: string;
  package: string;
  totalPackageValue: number; // AED
  amountPaid: number; // AED
  amountOutstanding: number; // AED
  paymentPlan: 'Upfront' | 'Monthly' | 'Quarterly';
  attendancePercentage: number; // e.g. 94%
  contact: string;
  startDate: string;
  renewalDate: string;
  leadSource: string;
  healthNotes: string;
  lastSessionDate?: string;
  syncStatus: 'Synced' | 'Pending Sync';
}

export interface CoachMasterRecord {
  id: string;
  name: string;
  role: string;
  specialization: string;
  contact: string;
  assignedClientsCount: number;
  sessionsCompletedThisMonth: number;
  payoutRatePerSession: number; // AED
  amountEarned: number; // AED
  payoutStatus: 'Paid' | 'Pending Approval' | 'Processing';
  performanceRating: number; // 1-5
  status: 'Active' | 'On Leave';
}

export interface TrainerizeSet {
  id: string;
  setNumber: number;
  setType: 'Working' | 'Warmup' | 'Drop' | 'AMRAP' | 'Cooldown';
  previousPerformance?: string;
  previousWeightKg?: number;
  previousReps?: number;
  targetWeightKg: number;
  targetReps: number;
  rpe?: number;
  restSeconds?: number;
  tempo?: string;
  completed: boolean;
  notes?: string;
}

export interface TrainerizeExercise {
  id: string;
  name: string;
  category: string;
  equipment?: string;
  targetMuscle?: string;
  supersetTag?: string; // e.g. "A1", "A2", "B1"
  sets: TrainerizeSet[];
  coachCues?: string;
  previousBestPerformance?: string;
  previousVolumeKg?: number;
}

export interface GlobalExerciseItem {
  id: string;
  name: string;
  category: string;
  equipment: string;
  primaryMuscle: string;
  addedByCoach?: string;
}

export interface GivenSessionPlanRecord {
  id: string;
  date: string; // YYYY-MM-DD
  clientId: string;
  clientName: string;
  coachName: string;
  planTitle: string;
  category: 'Athletics' | 'Wellness' | '1:1 Personal' | 'Group Batch' | 'Combat' | 'Calisthenics';
  planDetails: string;
  targetFocus: string;
  durationMinutes: number;
  rpeTarget: number;
  status: 'Assigned' | 'Active' | 'Completed' | 'Archived';
  loggedAt: string;
  totalVolumeKg?: number;
  totalSets?: number;
  totalReps?: number;
  overloadDeltaPercent?: number;
  overloadStatus?: 'Progressing' | 'Maintained' | 'Baseline' | 'Deload';
  structuredExercises?: TrainerizeExercise[];
  statisticsNote?: string;
}

export type BatchMemberStatus = 'Active' | 'In Break' | 'Non Active';

export interface BatchMember {
  id: string;
  name: string;
  status: BatchMemberStatus;
  attendanceToday?: 'Present' | 'Absent' | 'Late' | 'Pending';
  joinedDate?: string;
  phone?: string;
}

export interface BatchTrainingGroup {
  id: string;
  coachName: string;
  batchName: string;
  batchTime: string; // e.g. "06:30 AM - 07:30 AM"
  days: string; // e.g. "Mon / Wed / Fri"
  category: 'Combat & Striking' | 'Calisthenics' | 'Strength & Athleticism' | 'Conditioning' | 'General Batch';
  location: string;
  isSessionDone: boolean;
  lastSessionDate: string; // YYYY-MM-DD
  members: BatchMember[];
  description?: string;
}

export interface ProgramMasterRecord {
  id: string;
  name: string;
  category: 'Athletics' | 'Wellness' | '1:1 Personal' | 'Group Batch' | 'Online';
  description: string;
  durationWeeks: number;
  priceAED: number;
  capacity: number;
  assignedCoaches: string[];
  activeClientsCount: number;
  status: 'Active' | 'Upcoming';
}

export interface SessionMasterRecord {
  id: string;
  date: string;
  time: string;
  clientId: string;
  clientName: string;
  coachName: string;
  program: string;
  sessionType: string;
  location: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Postponed';
  attendanceStatus: 'Present' | 'Absent' | 'Late' | 'Cancelled' | 'No Show' | 'Scheduled' | 'Postponed';
  exercisesCompleted?: ExerciseSet[];
  rpe?: number;
  notes?: string;
  statisticsNote?: string;
  totalVolumeKg?: number;
  overloadSummary?: string;
  loggedByStaff: string;
  syncedToSystem2: boolean;
}

export interface AssessmentRecord {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  coachName: string;
  bodyFatPercentage: number;
  postureScore: number; // 1-10
  mobilityScore: number; // 1-10
  benchPress1RM: number; // kg
  squat1RM: number; // kg
  deadlift1RM: number; // kg
  aerobicCapacityScore: number; // 1-100
  powerOutputWatt: number;
  coachObservations: string;
}

export interface NutritionPlanRecord {
  id: string;
  clientId: string;
  clientName: string;
  nutritionistName: string;
  dietType: string;
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  hydrationLiters: number;
  compliancePercentage: number; // 0-100
  notes: string;
  lastUpdated: string;
}

export interface MasterFinancialRecord {
  id: string;
  date: string;
  category: 'Client Payment' | 'Coach Payout' | 'Operating Expense' | 'Equipment' | 'Facility Rent' | 'Software & Tech';
  description: string;
  amount: number; // AED
  type: 'Revenue' | 'Expense' | 'Payout';
  status: 'Cleared' | 'Pending' | 'Overdue';
  clientOrStaffName?: string;
}

export type ViewTab = 'Today' | 'Train' | 'Progress' | 'Coach' | 'More';
export type SubView = 'Money' | 'Grow' | 'Reflect' | 'Business' | 'AI' | 'Settings';
