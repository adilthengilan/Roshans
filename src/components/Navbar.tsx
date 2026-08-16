import React, { useState } from 'react';
import { SubView } from '../types';
import { usePrimeStore } from '../lib/store';
import {
  Briefcase,
  Users,
  Apple,
  DollarSign,
  Bot,
  Settings,
  Plus,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface Props {
  activeSubView: SubView | null;
  onSelectSubView: (sub: SubView | null) => void;
  onOpenQuickAction: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeSubView,
  onSelectSubView,
  onOpenQuickAction,
}) => {
  const {
    osMode,
    setOsMode,
    selectedStaffRole,
    setSelectedStaffRole,
  } = usePrimeStore();

  const [coachMenuOpen, setCoachMenuOpen] = useState(false);

  const handleNavClick = (mode: 'INTOKINE_BUSINESS_OS' | 'INTOKINE_WORKSPACE' | 'NUTRITION_OS') => {
    setOsMode(mode);
    onSelectSubView(null);
  };

  const handleSubViewClick = (sub: SubView | null) => {
    onSelectSubView(sub);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0d0e12]/90 backdrop-blur-xl border-b border-white/[0.07] px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Active System Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ec2226] to-[#f59e0b] flex items-center justify-center text-white shadow-sm font-black text-xs">
              IK
            </div>
            <span className="font-bold tracking-tight text-sm text-white hidden sm:inline">
              INTOKINE
            </span>
          </div>

          {/* Quick Coach Selector Pill when in Coach Workspace */}
          {osMode === 'INTOKINE_WORKSPACE' && !activeSubView && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setCoachMenuOpen(!coachMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-white transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{selectedStaffRole}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {coachMenuOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-60 bg-[#161820] border border-white/10 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                  <div className="px-2 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Switch Coach Room
                  </div>
                  {[
                    'Coach Danish',
                    'Coach Roshan',
                    'Coach Muqeeth',
                    'Coach Ahmed (Head Coach)',
                    'Coach Tariq (Martial Arts)',
                  ].map((coach) => (
                    <button
                      key={coach}
                      type="button"
                      onClick={() => {
                        setSelectedStaffRole(coach as any);
                        setCoachMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl transition flex items-center justify-between ${
                        selectedStaffRole === coach
                          ? 'bg-[#06b6d4]/20 text-[#06b6d4] font-semibold'
                          : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{coach}</span>
                      {selectedStaffRole === coach && <span className="text-[10px]">●</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Primary Segmented Controller Navigation */}
        <div className="flex items-center gap-1 bg-[#14161e] p-1 rounded-full border border-white/[0.08] overflow-x-auto no-scrollbar max-w-full">
          <button
            type="button"
            onClick={() => handleNavClick('INTOKINE_BUSINESS_OS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
              osMode === 'INTOKINE_BUSINESS_OS' && !activeSubView
                ? 'bg-white text-[#0d0e12] shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Business</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('INTOKINE_WORKSPACE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
              osMode === 'INTOKINE_WORKSPACE' && !activeSubView
                ? 'bg-white text-[#0d0e12] shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Coaches</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('NUTRITION_OS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
              osMode === 'NUTRITION_OS' && !activeSubView
                ? 'bg-white text-[#0d0e12] shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>Nutrition</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubViewClick('Money')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
              activeSubView === 'Money'
                ? 'bg-white text-[#0d0e12] shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Finance</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubViewClick('AI')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
              activeSubView === 'AI'
                ? 'bg-white text-[#0d0e12] shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI</span>
          </button>
        </div>

        {/* Right Utility Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSubViewClick('Settings')}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${
              activeSubView === 'Settings'
                ? 'bg-white text-[#0d0e12] border-white'
                : 'bg-white/[0.04] border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.08]'
            }`}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenQuickAction}
            className="h-8 px-3 rounded-full bg-gradient-to-r from-[#ec2226] to-[#06b6d4] text-white text-xs font-bold flex items-center gap-1 shadow-sm hover:opacity-90 transition active:scale-95"
            title="Quick Log"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Log</span>
          </button>
        </div>
      </div>
    </header>
  );
};
