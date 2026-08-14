import React, { useState } from 'react';
import { PrimeStoreProvider, usePrimeStore } from './lib/store';
import { SubView } from './types';
import { Navbar } from './components/Navbar';
import { CoachView } from './components/views/CoachView';
import { NutritionOsView } from './components/views/NutritionOsView';
import { BusinessView } from './components/views/BusinessView';
import { AiView } from './components/views/AiView';
import { SettingsView } from './components/views/SettingsView';
import { MoneyView } from './components/views/MoneyView';
import { QuickActionModal, QuickActionType } from './components/QuickActionModal';

function AppContent() {
  const { osMode } = usePrimeStore();
  const [activeSubView, setActiveSubView] = useState<SubView | null>(null);

  const [quickActionModalOpen, setQuickActionModalOpen] = useState(false);
  const [quickActionInitialType, setQuickActionInitialType] = useState<QuickActionType>('Task');

  const handleOpenQuickAction = (type: QuickActionType = 'Task') => {
    setQuickActionInitialType(type);
    setQuickActionModalOpen(true);
  };

  const handleSelectSubView = (subView: SubView | null) => {
    setActiveSubView(subView);
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-neutral-100 font-sans selection:bg-[#ec2226] selection:text-white antialiased pb-16 relative overflow-x-hidden">
      {/* Canvas Grain Layer (Warm Titanium & Solar Amber Micro-Texture) */}
      <div className="canvas-grain-layer" />

      {/* Ambient Premium Athletic Crimson & Solar Amber Canvas Glow Spots */}
      <div className="pointer-events-none fixed top-[-10%] left-[20%] w-[550px] h-[550px] bg-[#ec2226]/10 rounded-full blur-[140px] -z-10" />
      <div className="pointer-events-none fixed top-[35%] right-[8%] w-[500px] h-[500px] bg-[#f59e0b]/9 rounded-full blur-[150px] -z-10" />
      <div className="pointer-events-none fixed bottom-[5%] left-[10%] w-[450px] h-[450px] bg-[#fbbf24]/5 rounded-full blur-[130px] -z-10" />

      {/* Top Header & Navigation Shell */}
      <Navbar
        activeSubView={activeSubView}
        onSelectSubView={handleSelectSubView}
        onOpenQuickAction={() => handleOpenQuickAction('Task')}
      />

      {/* Main View Display Area */}
      <main className="w-full">
        {activeSubView === 'Money' ? (
          <MoneyView />
        ) : activeSubView === 'AI' ? (
          <AiView />
        ) : activeSubView === 'Settings' ? (
          <SettingsView />
        ) : osMode === 'INTOKINE_BUSINESS_OS' ? (
          <BusinessView />
        ) : osMode === 'INTOKINE_WORKSPACE' ? (
          <CoachView />
        ) : osMode === 'NUTRITION_OS' ? (
          <NutritionOsView />
        ) : (
          <BusinessView />
        )}
      </main>

      {/* Global Quick Action Log Modal */}
      <QuickActionModal
        isOpen={quickActionModalOpen}
        onClose={() => setQuickActionModalOpen(false)}
        initialType={quickActionInitialType}
      />
    </div>
  );
}

export default function App() {
  return (
    <PrimeStoreProvider>
      <AppContent />
    </PrimeStoreProvider>
  );
}
