import React, { useState } from 'react';
import { usePrimeStore } from '../lib/store';
import { TrainingSession } from '../types';
import {
  Dumbbell,
  Plus,
  CheckCircle2,
  Circle,
  Trophy,
  History,
  Zap,
  Filter,
  Layers,
  Repeat,
  Trash2,
  PlusCircle,
  MinusCircle,
  Link2,
  Unlink2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Edit3,
  Check,
  Copy,
  Info,
  Eye,
  Maximize2,
  RotateCcw,
  FileText,
  X,
  Bookmark
} from 'lucide-react';

// ==========================================
// DATA TYPES
// ==========================================
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

export interface PresetProtocol {
  id: string;
  categoryGroup: 'Calisthenics' | 'Strength & Conditioning' | 'CrossFit' | 'Hyrox' | 'Combat' | 'Weapon Skills' | 'Creative Skills';
  subCategory: string;
  title: string;
  type: string;
  slot: string;
  goal: string;
  defaultBlocks: SetBlock[];
}

// ==========================================
// PRESET WORKOUT PROTOCOLS (DEFAULT TEMPLATES)
// ==========================================
const PRESET_WORKOUTS: PresetProtocol[] = [
  // --- 1. CALISTHENICS ---
  {
    id: 'cal-upper',
    categoryGroup: 'Calisthenics',
    subCategory: 'Upper Body',
    title: 'Upper Body Calisthenics & Ring Flow',
    type: 'Calisthenics - Upper Body',
    slot: 'Morning',
    goal: 'Ring muscle-ups, dips, and pulling power',
    defaultBlocks: [
      {
        id: 'block-1',
        title: 'Primary Skill Block (1 Exercise)',
        exercises: [
          {
            id: 'ex-1',
            name: 'Strict Ring Muscle-Ups',
            category: 'Skill / Rings',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 5, completed: false, notes: 'BW clean form' },
              { setNumber: 2, weightKg: 0, reps: 4, completed: false, notes: 'BW clean form' },
              { setNumber: 3, weightKg: 0, reps: 3, completed: false, notes: 'False grip hold' },
            ],
          },
        ],
      },
      {
        id: 'block-2',
        title: 'Paired Push-Pull Block (2 Exercises)',
        exercises: [
          {
            id: 'ex-2',
            name: 'Weighted Ring Dips',
            category: 'Push',
            sets: [
              { setNumber: 1, weightKg: 15, reps: 8, completed: false },
              { setNumber: 2, weightKg: 20, reps: 6, completed: false },
              { setNumber: 3, weightKg: 20, reps: 6, completed: false },
            ],
          },
          {
            id: 'ex-3',
            name: 'Weighted Neutral Pull-Ups',
            category: 'Pull',
            sets: [
              { setNumber: 1, weightKg: 15, reps: 8, completed: false },
              { setNumber: 2, weightKg: 20, reps: 6, completed: false },
              { setNumber: 3, weightKg: 20, reps: 6, completed: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cal-push',
    categoryGroup: 'Calisthenics',
    subCategory: 'Push',
    title: 'Calisthenics Push Protocol',
    type: 'Calisthenics - Push',
    slot: 'Morning',
    goal: 'Handstands, parallel bar dips, and push-up drops',
    defaultBlocks: [
      {
        id: 'block-p1',
        title: 'Overhead Push Block',
        exercises: [
          {
            id: 'ex-p1',
            name: 'Wall Handstand Push-Ups',
            category: 'Vertical Push',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 8, completed: false },
              { setNumber: 2, weightKg: 0, reps: 7, completed: false },
              { setNumber: 3, weightKg: 0, reps: 6, completed: false },
            ],
          },
        ],
      },
      {
        id: 'block-p2',
        title: 'Grouped Dips & Push-Ups Block (2 Exercises)',
        exercises: [
          {
            id: 'ex-p2',
            name: 'Weighted Bar Dips',
            category: 'Dips',
            sets: [
              { setNumber: 1, weightKg: 25, reps: 8, completed: false },
              { setNumber: 2, weightKg: 25, reps: 8, completed: false },
            ],
          },
          {
            id: 'ex-p3',
            name: 'Pseudo Planche Push-Ups',
            category: 'Floor Push',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 10, completed: false },
              { setNumber: 2, weightKg: 0, reps: 10, completed: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cal-pull',
    categoryGroup: 'Calisthenics',
    subCategory: 'Pull',
    title: 'Calisthenics Pulling & Lever Power',
    type: 'Calisthenics - Pull',
    slot: 'Morning',
    goal: 'Heavy weighted pull-ups and front lever progressions',
    defaultBlocks: [
      {
        id: 'block-pl1',
        title: 'Heavy Pulling Block',
        exercises: [
          {
            id: 'ex-pl1',
            name: 'Weighted Chin-Ups',
            category: 'Vertical Pull',
            sets: [
              { setNumber: 1, weightKg: 25, reps: 6, completed: false },
              { setNumber: 2, weightKg: 30, reps: 5, completed: false },
              { setNumber: 3, weightKg: 35, reps: 3, completed: false },
            ],
          },
        ],
      },
      {
        id: 'block-pl2',
        title: 'Horizontal & Front Lever Group (2 Exercises)',
        exercises: [
          {
            id: 'ex-pl2',
            name: 'Front Lever Tuck Raises',
            category: 'Lever',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 6, completed: false },
              { setNumber: 2, weightKg: 0, reps: 5, completed: false },
            ],
          },
          {
            id: 'ex-pl3',
            name: 'Inverted Ring Rows',
            category: 'Horizontal Pull',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 12, completed: false },
              { setNumber: 2, weightKg: 0, reps: 10, completed: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cal-posterior',
    categoryGroup: 'Calisthenics',
    subCategory: 'Posterior Chain',
    title: 'Calisthenics Posterior Chain & Nordics',
    type: 'Calisthenics - Posterior',
    slot: 'Evening',
    goal: 'Nordic hamstring curls, reverse hyperextensions, glute bridges',
    defaultBlocks: [
      {
        id: 'block-post1',
        title: 'Posterior Group (3 Exercises Combined)',
        exercises: [
          {
            id: 'ex-[#1]',
            name: 'Nordic Hamstring Curls',
            category: 'Hamstrings',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 6, completed: false },
              { setNumber: 2, weightKg: 0, reps: 6, completed: false },
            ],
          },
          {
            id: 'ex-[#2]',
            name: 'Reverse Hyperextensions',
            category: 'Lower Back/Glutes',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 15, completed: false },
              { setNumber: 2, weightKg: 0, reps: 15, completed: false },
            ],
          },
          {
            id: 'ex-[#3]',
            name: 'Single-Leg Glute Bridge Holds',
            category: 'Glutes',
            sets: [
              { setNumber: 1, weightKg: 10, reps: 10, completed: false },
              { setNumber: 2, weightKg: 10, reps: 10, completed: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cal-anterior',
    categoryGroup: 'Calisthenics',
    subCategory: 'Anterior Chain',
    title: 'Anterior Chain & Hollow Body Core',
    type: 'Calisthenics - Anterior',
    slot: 'Evening',
    goal: 'Dragon flags, L-sit holds, hollow body compression',
    defaultBlocks: [
      {
        id: 'block-ant1',
        title: 'Anterior Core Block (2 Exercises)',
        exercises: [
          {
            id: 'ex-a1',
            name: 'Dragon Flags',
            category: 'Anterior Core',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 6, completed: false },
              { setNumber: 2, weightKg: 0, reps: 5, completed: false },
            ],
          },
          {
            id: 'ex-a2',
            name: 'Parallette L-Sit Hold',
            category: 'Compression Hold',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 20, completed: false, notes: '20 Seconds Hold' },
              { setNumber: 2, weightKg: 0, reps: 15, completed: false, notes: '15 Seconds Hold' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cal-lower-core',
    categoryGroup: 'Calisthenics',
    subCategory: 'Lower Body & Core',
    title: 'Calisthenics Lower Body & Core Fusion',
    type: 'Calisthenics - Lower & Core',
    slot: 'Evening',
    goal: 'Weighted pistols, sissy squats, hanging leg raises',
    defaultBlocks: [
      {
        id: 'block-lc1',
        title: 'Lower & Core Combination Block',
        exercises: [
          {
            id: 'ex-lc1',
            name: 'Weighted Pistol Squats',
            category: 'Single Leg Quad',
            sets: [
              { setNumber: 1, weightKg: 12, reps: 8, completed: false },
              { setNumber: 2, weightKg: 16, reps: 6, completed: false },
            ],
          },
          {
            id: 'ex-lc2',
            name: 'Strict Toes-to-Bar',
            category: 'Hanging Core',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 12, completed: false },
              { setNumber: 2, weightKg: 0, reps: 10, completed: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cal-skills',
    categoryGroup: 'Calisthenics',
    subCategory: 'Skills',
    title: 'Gymnastic Skill Static Holds & Planche',
    type: 'Calisthenics - Skills',
    slot: 'Morning',
    goal: 'Handstands, straddle planche, front lever static holds',
    defaultBlocks: [
      {
        id: 'block-sk1',
        title: 'Balance & Planche Hold Group',
        exercises: [
          {
            id: 'ex-sk1',
            name: 'Freestanding Handstand Hold',
            category: 'Balance',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 30, completed: false, notes: '30s Hold' },
              { setNumber: 2, weightKg: 0, reps: 30, completed: false, notes: '30s Hold' },
            ],
          },
          {
            id: 'ex-sk2',
            name: 'Straddle Planche Band Hold',
            category: 'Planche',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 8, completed: false, notes: '8s Hold' },
              { setNumber: 2, weightKg: 0, reps: 6, completed: false, notes: '6s Hold' },
            ],
          },
        ],
      },
    ],
  },

  // --- 2. STRENGTH & CONDITIONING ---
  {
    id: 'sc-main',
    categoryGroup: 'Strength & Conditioning',
    subCategory: 'Compound Power',
    title: 'Barbell Compound Power & Explosive Plyos',
    type: 'Strength & Conditioning',
    slot: 'Morning',
    goal: 'Heavy trap bar deadlifts paired with explosive box jumps',
    defaultBlocks: [
      {
        id: 'block-sc1',
        title: 'Heavy Strength Block',
        exercises: [
          {
            id: 'ex-sc1',
            name: 'Trap Bar Deadlift',
            category: 'Deadlift',
            sets: [
              { setNumber: 1, weightKg: 140, reps: 5, completed: false },
              { setNumber: 2, weightKg: 160, reps: 5, completed: false },
              { setNumber: 3, weightKg: 180, reps: 3, completed: false },
            ],
          },
        ],
      },
      {
        id: 'block-sc2',
        title: 'Heavy Squat + Explosive Jump Block (2 Exercises)',
        exercises: [
          {
            id: 'ex-sc2',
            name: 'Barbell Back Squat',
            category: 'Heavy Lower',
            sets: [
              { setNumber: 1, weightKg: 120, reps: 3, completed: false },
              { setNumber: 2, weightKg: 125, reps: 3, completed: false },
            ],
          },
          {
            id: 'ex-sc3',
            name: 'Plyometric Box Jumps',
            category: 'Explosive Power',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 5, completed: false },
              { setNumber: 2, weightKg: 0, reps: 5, completed: false },
            ],
          },
        ],
      },
    ],
  },

  // --- 3. CROSSFIT ---
  {
    id: 'cf-freestyle',
    categoryGroup: 'CrossFit',
    subCategory: 'Freestyle',
    title: 'CrossFit Gymnastics & Engine Circuit',
    type: 'CrossFit - Freestyle',
    slot: 'Evening',
    goal: 'Bar muscle-ups, double unders, and wall balls',
    defaultBlocks: [
      {
        id: 'block-cf1',
        title: 'Multi-Exercise Metcon Block (3 Exercises)',
        exercises: [
          {
            id: 'ex-cf1',
            name: 'Bar Muscle-Ups',
            category: 'Gymnastics',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 7, completed: false },
              { setNumber: 2, weightKg: 0, reps: 6, completed: false },
            ],
          },
          {
            id: 'ex-cf2',
            name: 'Heavy Wall Balls (9kg)',
            category: 'Full Body Push',
            sets: [
              { setNumber: 1, weightKg: 9, reps: 20, completed: false },
              { setNumber: 2, weightKg: 9, reps: 20, completed: false },
            ],
          },
          {
            id: 'ex-cf3',
            name: 'Double Unders',
            category: 'Jump Rope',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 50, completed: false },
              { setNumber: 2, weightKg: 0, reps: 50, completed: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cf-weightlifting',
    categoryGroup: 'CrossFit',
    subCategory: 'Weightlifting',
    title: 'Olympic Weightlifting Complex & Clean & Jerk',
    type: 'CrossFit - Weightlifting',
    slot: 'Morning',
    goal: 'Snatch technique and clean & jerk singles',
    defaultBlocks: [
      {
        id: 'block-wl1',
        title: 'Olympic Snatch Complex',
        exercises: [
          {
            id: 'ex-wl1',
            name: 'Hang Power Snatch + Overhead Squat',
            category: 'Oly Complex',
            sets: [
              { setNumber: 1, weightKg: 60, reps: 3, completed: false },
              { setNumber: 2, weightKg: 70, reps: 2, completed: false },
            ],
          },
        ],
      },
      {
        id: 'block-wl2',
        title: 'Clean & Jerk Work',
        exercises: [
          {
            id: 'ex-wl2',
            name: 'Clean & Jerk',
            category: 'Oly Singles',
            sets: [
              { setNumber: 1, weightKg: 85, reps: 1, completed: false },
              { setNumber: 2, weightKg: 95, reps: 1, completed: false },
              { setNumber: 3, weightKg: 100, reps: 1, completed: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cf-metcon',
    categoryGroup: 'CrossFit',
    subCategory: 'Metcon',
    title: 'Echo Bike Sprint & Lactate Metcon',
    type: 'CrossFit - Metcon',
    slot: 'Evening',
    goal: 'Echo bike calorie sprints & kettlebell burpee combos',
    defaultBlocks: [
      {
        id: 'block-mc1',
        title: 'Bike & Burpee Metcon Block (2 Exercises)',
        exercises: [
          {
            id: 'ex-mc1',
            name: 'Echo Bike Calorie Sprint',
            category: 'Cardio Engine',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 15, completed: false, notes: '15 Cals Sprint' },
              { setNumber: 2, weightKg: 0, reps: 15, completed: false, notes: '15 Cals Sprint' },
            ],
          },
          {
            id: 'ex-mc2',
            name: 'Kettlebell Snatch & Burpee Over Bar',
            category: 'Lactate Metcon',
            sets: [
              { setNumber: 1, weightKg: 24, reps: 12, completed: false },
              { setNumber: 2, weightKg: 24, reps: 12, completed: false },
            ],
          },
        ],
      },
    ],
  },

  // --- 4. HYROX ---
  {
    id: 'hyrox-race',
    categoryGroup: 'Hyrox',
    subCategory: 'Race Simulation',
    title: 'Hyrox Erg & Sled Hybrid Engine Block',
    type: 'Hyrox',
    slot: 'Morning',
    goal: 'SkiErg, Sled push/pull, and kettlebell carry',
    defaultBlocks: [
      {
        id: 'block-[#hy1]',
        title: 'Hyrox Race Block (3 Exercises Combined)',
        exercises: [
          {
            id: 'ex-h1',
            name: 'SkiErg 1000m Pace Sprint',
            category: 'Ergometer',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 1, completed: false, notes: '3:30 Pace / 1000m' },
              { setNumber: 2, weightKg: 0, reps: 1, completed: false, notes: '3:35 Pace / 1000m' },
            ],
          },
          {
            id: 'ex-h2',
            name: 'Heavy Sled Push & Pull (125kg)',
            category: 'Sled Power',
            sets: [
              { setNumber: 1, weightKg: 125, reps: 50, completed: false, notes: '50m Push' },
              { setNumber: 2, weightKg: 125, reps: 50, completed: false, notes: '50m Pull' },
            ],
          },
          {
            id: 'ex-h3',
            name: 'Kettlebell Farmers Carry (2x24kg)',
            category: 'Grip & Core',
            sets: [
              { setNumber: 1, weightKg: 48, reps: 100, completed: false, notes: '100m Distance' },
              { setNumber: 2, weightKg: 48, reps: 100, completed: false, notes: '100m Distance' },
            ],
          },
        ],
      },
    ],
  },

  // --- 5. COMBAT ---
  {
    id: 'combat-kickboxing',
    categoryGroup: 'Combat',
    subCategory: 'Kickboxing',
    title: 'Kickboxing Heavy Bag & Mitt Combinations',
    type: 'Combat - Kickboxing',
    slot: 'Evening',
    goal: 'Dutch heavy bag combinations & pad work drills',
    defaultBlocks: [
      {
        id: 'block-kb1',
        title: 'Striking Bag & Mitt Block (2 Exercises)',
        exercises: [
          {
            id: 'ex-kb1',
            name: 'Heavy Bag 3-Min Power Rounds',
            category: 'Heavy Bag',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 1, completed: false, notes: 'Round 1 (High Tempo)' },
              { setNumber: 2, weightKg: 0, reps: 1, completed: false, notes: 'Round 2 (High Tempo)' },
              { setNumber: 3, weightKg: 0, reps: 1, completed: false, notes: 'Round 3 (Power Finish)' },
            ],
          },
          {
            id: 'ex-kb2',
            name: 'Speed Mitt Punch-Kick Combos',
            category: 'Pad Work',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 15, completed: false, notes: '15 Combos' },
              { setNumber: 2, weightKg: 0, reps: 15, completed: false, notes: '15 Combos' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'combat-boxing',
    categoryGroup: 'Combat',
    subCategory: 'Boxing',
    title: 'Boxing Footwork & Double End Bag Reflex',
    type: 'Combat - Boxing',
    slot: 'Evening',
    goal: 'Jab precision, slip rope, and reflex timing',
    defaultBlocks: [
      {
        id: 'block-bx1',
        title: 'Footwork & Reflex Block',
        exercises: [
          {
            id: 'ex-bx1',
            name: 'Slip Rope & Shadow Boxing Footwork',
            category: 'Footwork',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 3, completed: false, notes: '3 Rounds Shadow Boxing' },
              { setNumber: 2, weightKg: 0, reps: 3, completed: false, notes: '3 Rounds Slip Line' },
            ],
          },
          {
            id: 'ex-bx2',
            name: 'Double End Bag Reflex & Timing',
            category: 'Reflex',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 3, completed: false, notes: '3 Rounds Speed' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'combat-mma',
    categoryGroup: 'Combat',
    subCategory: 'MMA',
    title: 'MMA Cage Wall Walks & Ground Control',
    type: 'Combat - MMA',
    slot: 'Evening',
    goal: 'Takedown defense, wall wrestling, ground & pound',
    defaultBlocks: [
      {
        id: 'block-mma1',
        title: 'MMA Cage & Ground Block',
        exercises: [
          {
            id: 'ex-mma1',
            name: 'Cage Wall Walks & Get-Ups',
            category: 'Cage Work',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 5, completed: false },
              { setNumber: 2, weightKg: 0, reps: 5, completed: false },
            ],
          },
          {
            id: 'ex-mma2',
            name: 'Heavy Bag Ground & Pound Strikes',
            category: 'Ground Striking',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 3, completed: false, notes: '3-Min Round' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'combat-wrestling',
    categoryGroup: 'Combat',
    subCategory: 'Wrestling',
    title: 'Wrestling Sprawls & Penetration Shots',
    type: 'Combat - Wrestling',
    slot: 'Evening',
    goal: 'Level change penetration shots & sprawl reactions',
    defaultBlocks: [
      {
        id: 'block-wr1',
        title: 'Shooting & Sprawl Block',
        exercises: [
          {
            id: 'ex-wr1',
            name: 'Penetration Shots & Sprawls',
            category: 'Takedowns',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 20, completed: false, notes: '20 Reps' },
              { setNumber: 2, weightKg: 0, reps: 20, completed: false, notes: '20 Reps' },
            ],
          },
        ],
      },
    ],
  },

  // --- 6. WEAPON SKILLS ---
  {
    id: 'weapon-nunchaku',
    categoryGroup: 'Weapon Skills',
    subCategory: 'Nunchaku',
    title: 'Nunchaku Freestyle Flow & Hand Switch Transitions',
    type: 'Weapon Skills - Nunchaku',
    slot: 'Morning',
    goal: 'Figure-8s, hand switches, shoulder bounces',
    defaultBlocks: [
      {
        id: 'block-[#nun1]',
        title: 'Nunchaku Flow Block (2 Exercises)',
        exercises: [
          {
            id: 'ex-n1',
            name: 'Figure-8 Swings & Underarm Bounces',
            category: 'Flow Swings',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 50, completed: false, notes: '50 Clean Swings' },
              { setNumber: 2, weightKg: 0, reps: 50, completed: false, notes: '50 Clean Swings' },
            ],
          },
          {
            id: 'ex-n2',
            name: 'Behind-the-Back Hand Switch Transitions',
            category: 'Hand Switches',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 20, completed: false, notes: '20 Switches' },
              { setNumber: 2, weightKg: 0, reps: 20, completed: false, notes: '20 Switches' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'weapon-stick',
    categoryGroup: 'Weapon Skills',
    subCategory: 'Kali Stick',
    title: 'Kali Stick (Escrima) 12 Striking Angles & Sinawali',
    type: 'Weapon Skills - Stick',
    slot: 'Morning',
    goal: '12 angles of attack & double stick Sinawali flow',
    defaultBlocks: [
      {
        id: 'block-stk1',
        title: 'Kali Stick Matrix Block',
        exercises: [
          {
            id: 'ex-st1',
            name: '12 Striking Angles Speed Matrix',
            category: 'Angles of Attack',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 10, completed: false, notes: '10 Cycles' },
              { setNumber: 2, weightKg: 0, reps: 10, completed: false, notes: '10 Cycles' },
            ],
          },
          {
            id: 'ex-st2',
            name: 'Double Stick Sinawali Flow',
            category: 'Sinawali Flow',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 3, completed: false, notes: '3-Min Flow' },
            ],
          },
        ],
      },
    ],
  },

  // --- 7. CREATIVE SKILLS ---
  {
    id: 'creative-movement',
    categoryGroup: 'Creative Skills',
    subCategory: 'Movement & Acrobatics',
    title: 'Creative Movement Locomotion & Acrobatics',
    type: 'Creative Skills - Movement',
    slot: 'Morning',
    goal: 'Floor locomotion, lizard crawls, macaco, kip-ups',
    defaultBlocks: [
      {
        id: 'block-cr1',
        title: 'Locomotion & Acro Block (2 Exercises)',
        exercises: [
          {
            id: 'ex-cr1',
            name: 'Floor Locomotion & Lizard Crawls',
            category: 'Locomotion',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 20, completed: false, notes: '20m Crawl' },
              { setNumber: 2, weightKg: 0, reps: 20, completed: false, notes: '20m Crawl' },
            ],
          },
          {
            id: 'ex-cr2',
            name: 'Macaco & Kip-Up Landings',
            category: 'Acrobatics',
            sets: [
              { setNumber: 1, weightKg: 0, reps: 5, completed: false, notes: '5 Landings' },
              { setNumber: 2, weightKg: 0, reps: 5, completed: false, notes: '5 Landings' },
            ],
          },
        ],
      },
    ],
  },
];

// ==========================================
// COMPONENT IMPLEMENTATION
// ==========================================
export const WorkoutSessionTracker: React.FC = () => {
  const { trainingSessions, addTrainingSession } = usePrimeStore();

  // Mode View Navigation
  const [activeSubTab, setActiveSubTab] = useState<'planner' | 'history' | 'prs'>('planner');

  // Discipline Category Selection
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<string>('Calisthenics');

  const availablePresets = PRESET_WORKOUTS.filter(
    (p) => p.categoryGroup === selectedCategoryGroup
  );

  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_WORKOUTS[0].id);

  const currentPreset =
    PRESET_WORKOUTS.find((p) => p.id === selectedPresetId) || PRESET_WORKOUTS[0];

  // ACTIVE DYNAMIC WORKOUT BLOCKS STATE
  const [workoutBlocks, setWorkoutBlocks] = useState<SetBlock[]>(currentPreset.defaultBlocks);
  const [sessionDuration, setSessionDuration] = useState<number>(50);
  const [sessionRpe, setSessionRpe] = useState<number>(8);
  const [isNewPR, setIsNewPR] = useState<boolean>(false);

  // History Filter
  const [historyFilter, setHistoryFilter] = useState<string>('ALL');

  // Modal / Quick Add Exercise State
  const [activeBlockForAdd, setActiveBlockForAdd] = useState<string | null>(null);
  const [customExName, setCustomExName] = useState<string>('');
  const [customExCategory, setCustomExCategory] = useState<string>('General');

  // Switch Preset Handler
  const handleSelectPreset = (preset: PresetProtocol) => {
    setSelectedPresetId(preset.id);
    setWorkoutBlocks(preset.defaultBlocks);
  };

  // Switch Category Group Handler
  const handleCategoryGroupChange = (cat: string) => {
    setSelectedCategoryGroup(cat);
    const firstInCat = PRESET_WORKOUTS.find((p) => p.categoryGroup === cat);
    if (firstInCat) {
      setSelectedPresetId(firstInCat.id);
      setWorkoutBlocks(firstInCat.defaultBlocks);
    }
  };

  // Toggle Set Complete (1-tap toggle)
  const toggleSetComplete = (blockId: string, exId: string, setNum: number) => {
    setWorkoutBlocks((prevBlocks) =>
      prevBlocks.map((block) => {
        if (block.id === blockId) {
          const updatedExercises = block.exercises.map((ex) => {
            if (ex.id === exId) {
              const updatedSets = ex.sets.map((s) => {
                if (s.setNumber === setNum) {
                  return { ...s, completed: !s.completed };
                }
                return s;
              });
              return { ...ex, sets: updatedSets };
            }
            return ex;
          });
          return { ...block, exercises: updatedExercises };
        }
        return block;
      })
    );
  };

  // Add a Set row to an exercise
  const handleAddSetToExercise = (blockId: string, exId: string) => {
    setWorkoutBlocks((prevBlocks) =>
      prevBlocks.map((block) => {
        if (block.id === blockId) {
          const updatedExercises = block.exercises.map((ex) => {
            if (ex.id === exId) {
              const lastSet = ex.sets[ex.sets.length - 1];
              const newSetNum = ex.sets.length + 1;
              const newSet: SetLog = {
                setNumber: newSetNum,
                weightKg: lastSet ? lastSet.weightKg : 0,
                reps: lastSet ? lastSet.reps : 10,
                completed: false,
                notes: lastSet ? lastSet.notes : '',
              };
              return { ...ex, sets: [...ex.sets, newSet] };
            }
            return ex;
          });
          return { ...block, exercises: updatedExercises };
        }
        return block;
      })
    );
  };

  // Remove last Set row from an exercise
  const handleRemoveSetFromExercise = (blockId: string, exId: string) => {
    setWorkoutBlocks((prevBlocks) =>
      prevBlocks.map((block) => {
        if (block.id === blockId) {
          const updatedExercises = block.exercises.map((ex) => {
            if (ex.id === exId && ex.sets.length > 1) {
              return { ...ex, sets: ex.sets.slice(0, ex.sets.length - 1) };
            }
            return ex;
          });
          return { ...block, exercises: updatedExercises };
        }
        return block;
      })
    );
  };

  // Update set weight / reps / notes inline
  const handleUpdateSetData = (
    blockId: string,
    exId: string,
    setNum: number,
    field: 'weightKg' | 'reps' | 'notes',
    value: any
  ) => {
    setWorkoutBlocks((prevBlocks) =>
      prevBlocks.map((block) => {
        if (block.id === blockId) {
          const updatedExercises = block.exercises.map((ex) => {
            if (ex.id === exId) {
              const updatedSets = ex.sets.map((s) => {
                if (s.setNumber === setNum) {
                  return { ...s, [field]: value };
                }
                return s;
              });
              return { ...ex, sets: updatedSets };
            }
            return ex;
          });
          return { ...block, exercises: updatedExercises };
        }
        return block;
      })
    );
  };

  // Combine Block with Next Block (Merges exercises into a single multi-exercise block)
  const handleCombineWithNextBlock = (blockIndex: number) => {
    if (blockIndex >= workoutBlocks.length - 1) return;

    setWorkoutBlocks((prevBlocks) => {
      const currentBlock = prevBlocks[blockIndex];
      const nextBlock = prevBlocks[blockIndex + 1];

      const combinedExercises = [...currentBlock.exercises, ...nextBlock.exercises];
      const combinedTitle = `Grouped Block (${combinedExercises.length} Exercises)`;

      const newMergedBlock: SetBlock = {
        id: currentBlock.id,
        title: combinedTitle,
        exercises: combinedExercises,
      };

      const newBlocksList = [...prevBlocks];
      newBlocksList.splice(blockIndex, 2, newMergedBlock);
      return newBlocksList;
    });
  };

  // Ungroup / Split an exercise out into its own separate block
  const handleSplitExerciseFromBlock = (blockId: string, exIndex: number) => {
    setWorkoutBlocks((prevBlocks) => {
      const targetBlock = prevBlocks.find((b) => b.id === blockId);
      if (!targetBlock || targetBlock.exercises.length <= 1) return prevBlocks;

      const remainingExercises = [...targetBlock.exercises];
      const extractedExercise = remainingExercises.splice(exIndex, 1)[0];

      const updatedTargetBlock: SetBlock = {
        ...targetBlock,
        title: `Grouped Block (${remainingExercises.length} Exercises)`,
        exercises: remainingExercises,
      };

      const extractedBlock: SetBlock = {
        id: `block-split-${Date.now()}`,
        title: `Single Block (${extractedExercise.name})`,
        exercises: [extractedExercise],
      };

      const blockIdx = prevBlocks.findIndex((b) => b.id === blockId);
      const newBlocksList = [...prevBlocks];
      newBlocksList.splice(blockIdx, 1, updatedTargetBlock, extractedBlock);
      return newBlocksList;
    });
  };

  // Add New Empty Block to Session
  const handleAddNewBlock = () => {
    const newBlock: SetBlock = {
      id: `block-custom-${Date.now()}`,
      title: 'New Set Block',
      exercises: [
        {
          id: `ex-new-${Date.now()}`,
          name: 'Custom Exercise',
          category: 'Strength',
          sets: [
            { setNumber: 1, weightKg: 0, reps: 10, completed: false },
            { setNumber: 2, weightKg: 0, reps: 10, completed: false },
            { setNumber: 3, weightKg: 0, reps: 10, completed: false },
          ],
        },
      ],
    };
    setWorkoutBlocks((prev) => [...prev, newBlock]);
  };

  // Add New Exercise directly into an existing Block
  const handleAddExerciseToBlock = (blockId: string) => {
    if (!customExName.trim()) return;

    const newEx: ActiveExercise = {
      id: `ex-${Date.now()}`,
      name: customExName.trim(),
      category: customExCategory || 'General',
      sets: [
        { setNumber: 1, weightKg: 0, reps: 10, completed: false },
        { setNumber: 2, weightKg: 0, reps: 10, completed: false },
        { setNumber: 3, weightKg: 0, reps: 10, completed: false },
      ],
    };

    setWorkoutBlocks((prevBlocks) =>
      prevBlocks.map((block) => {
        if (block.id === blockId) {
          const updatedExercises = [...block.exercises, newEx];
          const updatedTitle =
            updatedExercises.length > 1
              ? `Grouped Block (${updatedExercises.length} Exercises)`
              : `Single Block (${newEx.name})`;
          return {
            ...block,
            title: updatedTitle,
            exercises: updatedExercises,
          };
        }
        return block;
      })
    );

    setCustomExName('');
    setActiveBlockForAdd(null);
  };

  // Delete an Exercise from a Block
  const handleDeleteExercise = (blockId: string, exId: string) => {
    setWorkoutBlocks((prevBlocks) =>
      prevBlocks
        .map((block) => {
          if (block.id === blockId) {
            const remaining = block.exercises.filter((ex) => ex.id !== exId);
            return { ...block, exercises: remaining };
          }
          return block;
        })
        .filter((block) => block.exercises.length > 0)
    );
  };

  // Delete an entire Block
  const handleDeleteBlock = (blockId: string) => {
    setWorkoutBlocks((prev) => prev.filter((b) => b.id !== blockId));
  };

  // History & Preview States
  const [protocolSource, setProtocolSource] = useState<'presets' | 'saved_plans'>('presets');
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [previewModalSession, setPreviewModalSession] = useState<TrainingSession | null>(null);
  const [loadedNotification, setLoadedNotification] = useState<string | null>(null);

  // Load Previous Session Plan into Live Planner
  const handleLoadPreviousSessionPlan = (session: TrainingSession) => {
    if (session.blocks && session.blocks.length > 0) {
      const clonedBlocks: SetBlock[] = JSON.parse(JSON.stringify(session.blocks));
      // Reset completion status for fresh session training
      clonedBlocks.forEach((block) => {
        block.exercises.forEach((ex) => {
          ex.sets.forEach((s) => {
            s.completed = false;
          });
        });
      });
      setWorkoutBlocks(clonedBlocks);
    } else if (session.exercises && session.exercises.length > 0) {
      // Reconstruct blocks from legacy or string exercise list
      const reconstructedBlock: SetBlock = {
        id: `block-recon-${Date.now()}`,
        title: `${session.type} Protocol`,
        exercises: session.exercises.map((ex, idx) => {
          if (typeof ex === 'string') {
            return {
              id: `ex-recon-${idx}-${Date.now()}`,
              name: ex.replace(/^\[Block:\s*/, '').replace(/\]$/, ''),
              category: 'General',
              sets: [
                { setNumber: 1, weightKg: 0, reps: 10, completed: false },
                { setNumber: 2, weightKg: 0, reps: 10, completed: false },
                { setNumber: 3, weightKg: 0, reps: 10, completed: false },
              ],
            };
          } else {
            return {
              id: `ex-recon-${idx}-${Date.now()}`,
              name: ex.name,
              category: 'Strength',
              sets: Array.from({ length: ex.sets || 3 }).map((_, sIdx) => ({
                setNumber: sIdx + 1,
                weightKg: ex.weightKg || 0,
                reps: parseInt(ex.reps) || 10,
                completed: false,
              })),
            };
          }
        }),
      };
      setWorkoutBlocks([reconstructedBlock]);
    }
    setLoadedNotification(`✓ Loaded session plan from ${session.date} ("${session.type}") into Live Workout Planner!`);
    setActiveSubTab('planner');
    if (previewModalSession) setPreviewModalSession(null);
    setTimeout(() => setLoadedNotification(null), 5000);
  };

  // Save Complete Session to History
  const handleSaveLiveSession = () => {
    const totalExercisesCount = workoutBlocks.reduce((acc, b) => acc + b.exercises.length, 0);
    const totalSetsCount = workoutBlocks.reduce(
      (acc, b) => acc + b.exercises.reduce((exAcc, ex) => exAcc + ex.sets.length, 0),
      0
    );
    const totalRepsCount = workoutBlocks.reduce(
      (acc, b) =>
        acc +
        b.exercises.reduce(
          (exAcc, ex) => exAcc + ex.sets.reduce((sAcc, s) => sAcc + (s.reps || 0), 0),
          0
        ),
      0
    );

    const formattedSummary = workoutBlocks.map((block) => {
      const exSummary = block.exercises
        .map((ex) => {
          const doneSets = ex.sets.filter((s) => s.completed).length;
          return `${ex.name} (${doneSets}/${ex.sets.length} sets)`;
        })
        .join(' + ');
      return `[Block: ${exSummary}]`;
    });

    const newSession: Omit<TrainingSession, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      type: `${currentPreset.type} (${workoutBlocks.length} Blocks, ${totalExercisesCount} Ex)`,
      slot: (currentPreset.slot as any) || 'Morning',
      goal: currentPreset.goal,
      rpe: sessionRpe,
      duration: sessionDuration,
      sets: totalSetsCount,
      reps: totalRepsCount,
      intensity: sessionRpe,
      exercises: formattedSummary,
      prFlag: isNewPR,
      blocks: JSON.parse(JSON.stringify(workoutBlocks)), // SAVE EXACT WORKOUT BLOCKS & SET STRUCTURE
      performanceNotes: `Saved complete workout session plan. ${completedSets}/${totalSetsCount} sets finished across ${workoutBlocks.length} blocks. ${
        isNewPR ? '★ Personal Record!' : ''
      }`,
      nextImprovement: 'Session plan stored in Previous Sessions. Re-load anytime into live planner.',
    };

    addTrainingSession(newSession);
    setLoadedNotification(`✓ Saved complete session plan with ${totalExercisesCount} exercises & ${totalSetsCount} sets to Previous Sessions!`);
    setActiveSubTab('history');
    setTimeout(() => setLoadedNotification(null), 5000);
  };

  // Total Completed Sets Math
  const totalSets = workoutBlocks.reduce(
    (acc, b) => acc + b.exercises.reduce((exAcc, ex) => exAcc + ex.sets.length, 0),
    0
  );
  const completedSets = workoutBlocks.reduce(
    (acc, b) =>
      acc +
      b.exercises.reduce(
        (exAcc, ex) => exAcc + ex.sets.filter((s) => s.completed).length,
        0
      ),
    0
  );

  const filteredSessions =
    historyFilter === 'ALL'
      ? trainingSessions
      : trainingSessions.filter((s) =>
          s.type.toLowerCase().includes(historyFilter.toLowerCase())
        );

  return (
    <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 sm:p-5 shadow-xl space-y-5">
      {/* Toast / Notification Banner for Plan Actions */}
      {loadedNotification && (
        <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs font-bold flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{loadedNotification}</span>
          </div>
          <button
            onClick={() => setLoadedNotification(null)}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Sub-Tab Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#26262A] pb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2.5 bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 text-[#FF5A1F] rounded-xl shrink-0">
            <Dumbbell className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              Flexible Live Workout Session Planner
            </h2>
            <p className="text-xs text-neutral-400">
              Save complete session plans · View, inspect, or reload past exercises & set breakdowns anytime
            </p>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0A0A0B] p-1.5 rounded-xl border border-[#26262A]">
          <button
            onClick={() => setActiveSubTab('planner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'planner'
                ? 'bg-[#FF5A1F] text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-[#161618]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Live Workout Planner
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-[#FF5A1F] text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-[#161618]'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Previous Sessions ({trainingSessions.length})
          </button>

          <button
            onClick={() => setActiveSubTab('prs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'prs'
                ? 'bg-[#FF5A1F] text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-[#161618]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" /> Personal Records
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: LIVE WORKOUT PLANNER */}
      {activeSubTab === 'planner' && (
        <div className="space-y-5 animate-fadeIn">
          {/* STEP 1: Discipline Category Selection / Saved Plan Loader */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                1. Choose Discipline Category or Load Previous Session Plan
              </span>

              {/* Source Selector Pills */}
              <div className="flex items-center gap-1 bg-[#0A0A0B] p-1 rounded-lg border border-[#26262A]">
                <button
                  onClick={() => setProtocolSource('presets')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                    protocolSource === 'presets'
                      ? 'bg-[#FF5A1F] text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Built-in Presets
                </button>
                <button
                  onClick={() => setProtocolSource('saved_plans')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1 ${
                    protocolSource === 'saved_plans'
                      ? 'bg-[#FF5A1F] text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3 h-3" /> Saved Session Plans ({trainingSessions.length})
                </button>
              </div>
            </div>

            {protocolSource === 'presets' ? (
              <>
                {/* Discipline Pills */}
                <div className="flex items-center gap-1.5 bg-[#0A0A0B] p-1.5 rounded-xl border border-[#26262A] overflow-x-auto no-scrollbar text-xs">
                  {[
                    'Calisthenics',
                    'Strength & Conditioning',
                    'CrossFit',
                    'Hyrox',
                    'Combat',
                    'Weapon Skills',
                    'Creative Skills',
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryGroupChange(cat)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap text-xs ${
                        selectedCategoryGroup === cat
                          ? 'bg-[#FF5A1F] text-white shadow-md shadow-[#FF5A1F]/20'
                          : 'text-neutral-400 hover:text-white hover:bg-[#161618]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Protocol Selector Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                  {availablePresets.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPreset(p)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer select-none space-y-1.5 ${
                        selectedPresetId === p.id
                          ? 'bg-[#FF5A1F]/10 border-[#FF5A1F] shadow-lg'
                          : 'bg-[#0A0A0B] border-[#26262A] hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{p.title}</span>
                        <span className="text-[10px] font-mono text-[#FF5A1F] bg-[#FF5A1F]/10 px-2 py-0.5 rounded">
                          {p.subCategory}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-2">{p.goal}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* MY PREVIOUS SAVED SESSION PLANS */
              <div className="space-y-2 bg-[#0A0A0B] border border-[#26262A] p-3 rounded-xl">
                <span className="text-xs font-bold text-white block">
                  Select a Previous Session Plan to re-load into Live Planner:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {trainingSessions.map((s) => (
                    <div
                      key={s.id}
                      className="bg-[#161618] border border-[#26262A] hover:border-[#FF5A1F] p-3 rounded-xl flex items-center justify-between gap-2 transition"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{s.type}</span>
                          <span className="text-[10px] font-mono text-neutral-400">{s.date}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 line-clamp-1">{s.goal}</p>
                      </div>

                      <button
                        onClick={() => handleLoadPreviousSessionPlan(s)}
                        className="px-2.5 py-1.5 bg-[#FF5A1F]/10 hover:bg-[#FF5A1F] text-[#FF5A1F] hover:text-white border border-[#FF5A1F]/30 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
                      >
                        <RotateCcw className="w-3 h-3" /> Load Plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: LIVE SET STRUCTURES & DYNAMIC EXERCISE BLOCKS */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#0A0A0B] p-3 rounded-xl border border-[#26262A]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FF5A1F]" />
                <div>
                  <span className="text-xs font-black text-white uppercase tracking-wider block">
                    2. Live Exercise Set Blocks ({workoutBlocks.length} Blocks)
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Grouping freedom: Combine 2, 3, or more exercises into a set block or split them anytime
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleAddNewBlock}
                  className="px-3 py-1.5 bg-[#FF5A1F]/10 hover:bg-[#FF5A1F]/20 text-[#FF5A1F] border border-[#FF5A1F]/30 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Set Block
                </button>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {completedSets} / {totalSets} Sets Completed
                </span>
              </div>
            </div>

            {/* RENDER EACH WORKOUT SET BLOCK */}
            <div className="space-y-4">
              {workoutBlocks.map((block, blockIdx) => {
                const exCount = block.exercises.length;
                const isGroupedBlock = exCount > 1;

                return (
                  <div
                    key={block.id}
                    className={`bg-[#0A0A0B] border p-4 rounded-xl space-y-4 transition ${
                      isGroupedBlock
                        ? 'border-[#FF5A1F]/40 shadow-lg shadow-[#FF5A1F]/5'
                        : 'border-[#26262A]'
                    }`}
                  >
                    {/* Block Header Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#26262A] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white font-mono bg-[#161618] border border-[#26262A] px-2.5 py-1 rounded-lg">
                          Block #{blockIdx + 1}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded border font-mono ${
                            isGroupedBlock
                              ? 'bg-[#FF5A1F]/10 text-[#FF5A1F] border-[#FF5A1F]/30'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          }`}
                        >
                          {isGroupedBlock
                            ? `Grouped Block (${exCount} Exercises Combined)`
                            : `Single Exercise Block`}
                        </span>
                      </div>

                      {/* Block Quick Actions */}
                      <div className="flex items-center gap-1.5">
                        {/* Combine with Next Block */}
                        {blockIdx < workoutBlocks.length - 1 && (
                          <button
                            onClick={() => handleCombineWithNextBlock(blockIdx)}
                            title="Combine with next block into a multi-exercise set block"
                            className="px-2.5 py-1 bg-[#161618] hover:bg-[#26262A] text-neutral-300 hover:text-white border border-[#26262A] rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                          >
                            <Link2 className="w-3 h-3 text-[#FF5A1F]" /> Group With Block #{blockIdx + 2}
                          </button>
                        )}

                        {/* Add Exercise to this Block */}
                        <button
                          onClick={() =>
                            setActiveBlockForAdd(
                              activeBlockForAdd === block.id ? null : block.id
                            )
                          }
                          className="px-2.5 py-1 bg-[#161618] hover:bg-[#26262A] text-[#FF5A1F] border border-[#26262A] rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Exercise To Block
                        </button>

                        {/* Delete Block */}
                        <button
                          onClick={() => handleDeleteBlock(block.id)}
                          className="p-1.5 hover:bg-red-500/10 text-neutral-500 hover:text-red-400 rounded-lg transition"
                          title="Delete Block"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Inline Form to Add Exercise to this Block */}
                    {activeBlockForAdd === block.id && (
                      <div className="bg-[#161618] border border-[#26262A] p-3 rounded-xl space-y-2 animate-fadeIn">
                        <span className="text-[11px] font-bold text-[#FF5A1F] uppercase block">
                          Add Exercise to Block #{blockIdx + 1}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Exercise Name (e.g. Ring Pull-Up)"
                            value={customExName}
                            onChange={(e) => setCustomExName(e.target.value)}
                            className="bg-[#0A0A0B] border border-[#26262A] px-3 py-1.5 rounded-lg text-white text-xs outline-none focus:border-[#FF5A1F]"
                          />
                          <input
                            type="text"
                            placeholder="Category (e.g. Pull)"
                            value={customExCategory}
                            onChange={(e) => setCustomExCategory(e.target.value)}
                            className="bg-[#0A0A0B] border border-[#26262A] px-3 py-1.5 rounded-lg text-white text-xs outline-none focus:border-[#FF5A1F]"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddExerciseToBlock(block.id)}
                              className="px-3 py-1.5 bg-[#FF5A1F] hover:bg-[#E04D18] text-white font-bold rounded-lg text-xs transition shrink-0"
                            >
                              Add To Block
                            </button>
                            <button
                              onClick={() => setActiveBlockForAdd(null)}
                              className="px-2 py-1.5 bg-[#0A0A0B] text-neutral-400 hover:text-white rounded-lg text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* EXERCISES INSIDE THIS BLOCK */}
                    <div className="space-y-3">
                      {block.exercises.map((ex, exIdx) => (
                        <div
                          key={ex.id}
                          className="bg-[#161618] border border-[#26262A] p-3.5 rounded-xl space-y-3"
                        >
                          {/* Exercise Header */}
                          <div className="flex items-center justify-between border-b border-[#26262A] pb-2">
                            <div className="flex items-center gap-2">
                              {isGroupedBlock && (
                                <span className="text-[11px] font-mono font-bold text-[#FF5A1F] bg-[#FF5A1F]/10 px-2 py-0.5 rounded">
                                  Ex #{exIdx + 1}
                                </span>
                              )}
                              <h4 className="text-xs font-bold text-white">{ex.name}</h4>
                              <span className="text-[10px] font-mono text-neutral-400 bg-[#0A0A0B] px-2 py-0.5 rounded">
                                {ex.category}
                              </span>
                            </div>

                            {/* Exercise Actions (Increase/Decrease Sets & Split) */}
                            <div className="flex items-center gap-2">
                              {/* Set Count Controls */}
                              <div className="flex items-center gap-1 bg-[#0A0A0B] p-1 rounded-lg border border-[#26262A]">
                                <span className="text-[10px] text-neutral-400 font-mono px-1">
                                  Sets:
                                </span>
                                <button
                                  onClick={() => handleRemoveSetFromExercise(block.id, ex.id)}
                                  title="Decrease total sets"
                                  className="p-1 hover:bg-[#161618] text-neutral-400 hover:text-white rounded"
                                >
                                  <MinusCircle className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-mono font-bold text-white px-1">
                                  {ex.sets.length}
                                </span>
                                <button
                                  onClick={() => handleAddSetToExercise(block.id, ex.id)}
                                  title="Increase total sets"
                                  className="p-1 hover:bg-[#161618] text-[#FF5A1F] rounded"
                                >
                                  <PlusCircle className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Ungroup/Split exercise if in grouped block */}
                              {isGroupedBlock && (
                                <button
                                  onClick={() => handleSplitExerciseFromBlock(block.id, exIdx)}
                                  title="Split this exercise out into its own standalone block"
                                  className="px-2 py-1 bg-[#0A0A0B] hover:bg-[#26262A] text-neutral-300 border border-[#26262A] rounded text-[10px] font-bold transition flex items-center gap-1"
                                >
                                  <Unlink2 className="w-3 h-3 text-amber-400" /> Split Out
                                </button>
                              )}

                              {/* Delete Exercise */}
                              <button
                                onClick={() => handleDeleteExercise(block.id, ex.id)}
                                className="p-1 text-neutral-500 hover:text-red-400 transition"
                                title="Remove Exercise"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* SET ROWS LOGGING LIST */}
                          <div className="space-y-2">
                            {ex.sets.map((set) => (
                              <div
                                key={set.setNumber}
                                className={`p-2.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                                  set.completed
                                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                                    : 'bg-[#0A0A0B] border-[#26262A] hover:border-neutral-700'
                                }`}
                              >
                                {/* Left: Set Number & Check Toggle */}
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() =>
                                      toggleSetComplete(block.id, ex.id, set.setNumber)
                                    }
                                    className="flex items-center gap-2 font-bold text-xs shrink-0 cursor-pointer"
                                  >
                                    {set.completed ? (
                                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-neutral-500 shrink-0" />
                                    )}
                                    <span
                                      className={
                                        set.completed
                                          ? 'text-emerald-400 font-mono'
                                          : 'text-neutral-300 font-mono'
                                      }
                                    >
                                      Set #{set.setNumber}
                                    </span>
                                  </button>
                                </div>

                                {/* Center: Weight & Reps Inputs */}
                                <div className="flex items-center gap-2 text-xs">
                                  <div className="flex items-center gap-1 bg-[#161618] border border-[#26262A] px-2 py-1 rounded-lg">
                                    <span className="text-[10px] text-neutral-400">Weight:</span>
                                    <input
                                      type="number"
                                      value={set.weightKg}
                                      onChange={(e) =>
                                        handleUpdateSetData(
                                          block.id,
                                          ex.id,
                                          set.setNumber,
                                          'weightKg',
                                          Number(e.target.value)
                                        )
                                      }
                                      className="w-12 bg-transparent text-white font-mono font-bold text-xs outline-none text-right"
                                    />
                                    <span className="text-[10px] text-neutral-400">kg</span>
                                  </div>

                                  <span className="text-neutral-500 font-bold">×</span>

                                  <div className="flex items-center gap-1 bg-[#161618] border border-[#26262A] px-2 py-1 rounded-lg">
                                    <span className="text-[10px] text-neutral-400">Reps:</span>
                                    <input
                                      type="number"
                                      value={set.reps}
                                      onChange={(e) =>
                                        handleUpdateSetData(
                                          block.id,
                                          ex.id,
                                          set.setNumber,
                                          'reps',
                                          Number(e.target.value)
                                        )
                                      }
                                      className="w-12 bg-transparent text-white font-mono font-bold text-xs outline-none text-right"
                                    />
                                  </div>
                                </div>

                                {/* Right: Notes Input & Status Pill */}
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="Notes / Drop load / Tempo..."
                                    value={set.notes || ''}
                                    onChange={(e) =>
                                      handleUpdateSetData(
                                        block.id,
                                        ex.id,
                                        set.setNumber,
                                        'notes',
                                        e.target.value
                                      )
                                    }
                                    className="bg-[#161618] border border-[#26262A] px-2 py-1 rounded-lg text-neutral-300 text-[11px] outline-none w-full sm:w-44 focus:border-[#FF5A1F]"
                                  />

                                  <span
                                    onClick={() =>
                                      toggleSetComplete(block.id, ex.id, set.setNumber)
                                    }
                                    className={`text-[10px] font-bold px-2.5 py-1 rounded cursor-pointer select-none shrink-0 ${
                                      set.completed
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        : 'bg-[#161618] text-neutral-400 border border-[#26262A] hover:text-white'
                                    }`}
                                  >
                                    {set.completed ? 'DONE' : 'LOG'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: SESSION SUMMARY & SAVE ACTION */}
          <div className="bg-[#0A0A0B] border border-[#26262A] p-4 rounded-xl space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              3. Complete & Save Session Ledger
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                  Session Intensity RPE (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={sessionRpe}
                  onChange={(e) => setSessionRpe(Number(e.target.value))}
                  className="w-full bg-[#161618] border border-[#26262A] p-2.5 rounded-xl text-white font-mono font-bold text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="10"
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(Number(e.target.value))}
                  className="w-full bg-[#161618] border border-[#26262A] p-2.5 rounded-xl text-white font-mono font-bold text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
                  <input
                    type="checkbox"
                    checked={isNewPR}
                    onChange={(e) => setIsNewPR(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#FF5A1F]"
                  />
                  <span>Mark as Personal Record (PR)</span>
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSaveLiveSession}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#FF5A1F] hover:bg-[#E04D18] text-white font-bold rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Complete Workout Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PREVIOUS HISTORY LOGS */}
      {activeSubTab === 'history' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Filter Bar */}
          <div className="flex items-center justify-between bg-[#0A0A0B] p-2.5 rounded-xl border border-[#26262A]">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#FF5A1F]" /> Filter History:
            </span>

            <div className="flex items-center gap-1 text-xs">
              {['ALL', 'Calisthenics', 'Combat', 'CrossFit', 'Hyrox', 'Weapon'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setHistoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                    historyFilter === cat
                      ? 'bg-[#FF5A1F] text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-[#161618]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* History List */}
          <div className="space-y-3">
            {filteredSessions.map((session) => {
              const isExpanded = expandedSessionId === session.id;
              const hasBlocks = session.blocks && session.blocks.length > 0;

              return (
                <div
                  key={session.id}
                  className="bg-[#0A0A0B] border border-[#26262A] hover:border-neutral-700 p-4 rounded-xl space-y-3 transition"
                >
                  {/* Session Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-sm font-bold text-white">{session.type}</span>
                        <span className="text-[10px] font-mono text-[#FF5A1F] bg-[#FF5A1F]/10 px-2 py-0.5 rounded">
                          {session.slot}
                        </span>
                        {session.prFlag && (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                            <Trophy className="w-3 h-3" /> PR SET
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">{session.goal}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-[#FF5A1F] block">
                          RPE {session.rpe}/10 · {session.duration}m
                        </span>
                        <span className="text-[10px] text-neutral-500">{session.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Badges & Quick Action Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#1C1C20]">
                    {/* Badges */}
                    <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                      <span className="bg-[#161618] px-2 py-1 rounded border border-[#26262A]">
                        {hasBlocks ? session.blocks!.length : 1} Block(s)
                      </span>
                      <span className="bg-[#161618] px-2 py-1 rounded border border-[#26262A]">
                        {hasBlocks
                          ? session.blocks!.reduce((acc, b) => acc + b.exercises.length, 0)
                          : session.exercises.length}{' '}
                        Exercise(s)
                      </span>
                      {session.sets ? (
                        <span className="bg-[#161618] px-2 py-1 rounded border border-[#26262A]">
                          {session.sets} Sets
                        </span>
                      ) : null}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <button
                        onClick={() => handleLoadPreviousSessionPlan(session)}
                        className="px-2.5 py-1 bg-[#FF5A1F] hover:bg-[#E04D18] text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow"
                      >
                        <RotateCcw className="w-3 h-3" /> Load Plan into Planner
                      </button>

                      <button
                        onClick={() =>
                          setExpandedSessionId(isExpanded ? null : session.id)
                        }
                        className="px-2.5 py-1 bg-[#161618] hover:bg-[#202024] text-neutral-200 border border-[#26262A] rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-[#FF5A1F]" />
                        {isExpanded ? 'Hide Plan' : 'Preview Plan'}
                        {isExpanded ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>

                      <button
                        onClick={() => setPreviewModalSession(session)}
                        className="p-1 bg-[#161618] hover:bg-[#202024] text-neutral-400 hover:text-white border border-[#26262A] rounded-lg text-xs font-bold transition"
                        title="Full Screen Modal Preview"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* INLINE EXPANDED SESSION PLAN PREVIEW */}
                  {isExpanded && (
                    <div className="mt-3 bg-[#121214] border border-[#26262A] p-3.5 rounded-xl space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-[#26262A] pb-2">
                        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#FF5A1F]" /> Full Saved Protocol & Exercise Breakdown
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          Saved Session Log
                        </span>
                      </div>

                      {hasBlocks ? (
                        <div className="space-y-3">
                          {session.blocks!.map((block, bIdx) => (
                            <div
                              key={block.id || bIdx}
                              className="bg-[#0A0A0B] border border-[#26262A] p-3 rounded-lg space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#FF5A1F]">
                                  {block.title || `Set Block #${bIdx + 1}`}
                                </span>
                                <span className="text-[10px] text-neutral-400 font-mono">
                                  {block.exercises.length} Exercise(s) in Block
                                </span>
                              </div>

                              <div className="space-y-2">
                                {block.exercises.map((ex, exIdx) => (
                                  <div
                                    key={ex.id || exIdx}
                                    className="bg-[#161618] p-2.5 rounded-lg border border-[#26262A] space-y-1.5"
                                  >
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="font-bold text-white">{ex.name}</span>
                                      <span className="text-[10px] font-mono text-neutral-400 bg-[#0A0A0B] px-2 py-0.5 rounded">
                                        {ex.category}
                                      </span>
                                    </div>

                                    {/* Set Breakdown Rows */}
                                    <div className="space-y-1">
                                      {ex.sets.map((s) => (
                                        <div
                                          key={s.setNumber}
                                          className="flex items-center justify-between text-[11px] font-mono text-neutral-300 bg-[#0A0A0B] px-2.5 py-1 rounded"
                                        >
                                          <span>
                                            Set #{s.setNumber}:{' '}
                                            <strong className="text-white">
                                              {s.weightKg > 0 ? `${s.weightKg} kg × ` : ''}
                                              {s.reps} reps
                                            </strong>
                                          </span>
                                          <div className="flex items-center gap-2">
                                            {s.notes && (
                                              <span className="text-[10px] text-neutral-400 italic">
                                                "{s.notes}"
                                              </span>
                                            )}
                                            <span
                                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                                s.completed
                                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                  : 'bg-neutral-800 text-neutral-400'
                                              }`}
                                            >
                                              {s.completed ? 'COMPLETED' : 'PLANNED'}
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Flat exercise list fallback */
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {session.exercises.map((exStr, idx) => (
                            <div
                              key={idx}
                              className="bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-lg text-xs font-mono text-neutral-200"
                            >
                              {exStr}
                            </div>
                          ))}
                        </div>
                      )}

                      {session.performanceNotes && (
                        <div className="bg-[#0A0A0B] p-2.5 rounded-lg border border-[#26262A] text-xs text-neutral-300 space-y-1">
                          <span className="font-bold text-[#FF5A1F] text-[10px] uppercase block">
                            Performance Log & Notes:
                          </span>
                          <p>{session.performanceNotes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

      {/* FULL SESSION PLAN PREVIEW MODAL */}
      {previewModalSession && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161618] border border-[#26262A] rounded-2xl max-w-2xl w-full p-5 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-fadeIn">
            <div className="flex items-start justify-between border-b border-[#26262A] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#FF5A1F] bg-[#FF5A1F]/10 px-2 py-0.5 rounded">
                  {previewModalSession.slot} Protocol
                </span>
                <h3 className="text-base font-black text-white mt-1">
                  {previewModalSession.type}
                </h3>
                <p className="text-xs text-neutral-400">{previewModalSession.goal}</p>
              </div>

              <button
                onClick={() => setPreviewModalSession(null)}
                className="p-1 text-neutral-400 hover:text-white bg-[#0A0A0B] rounded-lg border border-[#26262A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-300 bg-[#0A0A0B] p-3 rounded-xl border border-[#26262A]">
                <span>Date: {previewModalSession.date}</span>
                <span>RPE: {previewModalSession.rpe}/10</span>
                <span>Duration: {previewModalSession.duration}m</span>
              </div>

              {previewModalSession.blocks && previewModalSession.blocks.length > 0 ? (
                <div className="space-y-3">
                  {previewModalSession.blocks.map((b, bIdx) => (
                    <div
                      key={b.id || bIdx}
                      className="bg-[#0A0A0B] border border-[#26262A] p-3 rounded-xl space-y-2"
                    >
                      <span className="text-xs font-bold text-[#FF5A1F] block">
                        {b.title || `Set Block #${bIdx + 1}`}
                      </span>
                      {b.exercises.map((ex, exIdx) => (
                        <div
                          key={ex.id || exIdx}
                          className="bg-[#161618] p-3 rounded-lg border border-[#26262A] space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white">{ex.name}</span>
                            <span className="text-[10px] text-neutral-400">{ex.category}</span>
                          </div>

                          <div className="space-y-1">
                            {ex.sets.map((s) => (
                              <div
                                key={s.setNumber}
                                className="flex items-center justify-between text-xs font-mono bg-[#0A0A0B] px-3 py-1.5 rounded text-neutral-200"
                              >
                                <span>
                                  Set #{s.setNumber}:{' '}
                                  <strong className="text-white">
                                    {s.weightKg > 0 ? `${s.weightKg} kg × ` : ''}
                                    {s.reps} reps
                                  </strong>
                                </span>
                                <span
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                    s.completed
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : 'bg-neutral-800 text-neutral-400'
                                  }`}
                                >
                                  {s.completed ? 'COMPLETED' : 'PLANNED'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1.5">
                  {previewModalSession.exercises.map((exStr, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0A0A0B] p-2.5 rounded-lg border border-[#26262A] text-xs font-mono text-neutral-200"
                    >
                      {exStr}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-3 border-t border-[#26262A] flex items-center justify-between gap-3">
              <button
                onClick={() => setPreviewModalSession(null)}
                className="px-4 py-2 bg-[#0A0A0B] hover:bg-[#161618] text-neutral-400 hover:text-white rounded-xl text-xs font-bold transition"
              >
                Close
              </button>

              <button
                onClick={() => handleLoadPreviousSessionPlan(previewModalSession)}
                className="px-5 py-2 bg-[#FF5A1F] hover:bg-[#E04D18] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" /> Load This Session Plan Into Live Planner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )}

      {/* SUB-TAB 3: PERSONAL RECORDS */}
      {activeSubTab === 'prs' && (
        <div className="space-y-4 animate-fadeIn">
          <span className="text-xs font-bold text-white uppercase tracking-wider block">
            All-Time Athletic Personal Records (PRs)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#0A0A0B] border border-[#26262A] p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Ring Muscle-Ups</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  PR SET
                </span>
              </div>
              <span className="text-xl font-black font-mono text-emerald-400">5 Strict Reps (Bodyweight)</span>
              <p className="text-xs text-neutral-400">Full lock-out at bottom & false grip transition</p>
            </div>

            <div className="bg-[#0A0A0B] border border-[#26262A] p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Weighted Pull-Up</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  PR SET
                </span>
              </div>
              <span className="text-xl font-black font-mono text-emerald-400">+20 kg (8 Reps)</span>
              <p className="text-xs text-neutral-400">Neutral grip chin over bar clean reps</p>
            </div>

            <div className="bg-[#0A0A0B] border border-[#26262A] p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Hyrox SkiErg 1000m</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  RACE PR
                </span>
              </div>
              <span className="text-xl font-black font-mono text-amber-400">3:30 Pace</span>
              <p className="text-xs text-neutral-400">High efficiency cadence engine</p>
            </div>

            <div className="bg-[#0A0A0B] border border-[#26262A] p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Heavy Bag Strike Volume</span>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                  STRIKING PR
                </span>
              </div>
              <span className="text-xl font-black font-mono text-blue-400">300 Reps / 12 Rounds</span>
              <p className="text-xs text-neutral-400">High cadence punch-kick combinations</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
