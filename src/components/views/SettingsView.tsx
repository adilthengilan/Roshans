import React, { useState } from 'react';
import { usePrimeStore } from '../../lib/store';
import {
  Settings,
  Sliders,
  Download,
  Upload,
  Shield,
  Database,
  RefreshCw,
  Check,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Key,
  Server,
  Zap,
} from 'lucide-react';
import { getStoredFirebaseConfig } from '../../lib/firebase';

export const SettingsView: React.FC = () => {
  const {
    weights,
    updateWeights,
    exportData,
    importData,
    firebaseSyncStatus,
    triggerManualFirestoreSync,
    updateFirebaseConfig,
    resetToDefaults,
  } = usePrimeStore();

  const [weightState, setWeightState] = useState({
    physical: Math.round(weights.physical * 100),
    discipline: Math.round(weights.discipline * 100),
    knowledge: Math.round(weights.knowledge * 100),
    spiritual: Math.round(weights.spiritual * 100),
    finance: Math.round(weights.finance * 100),
    relationships: Math.round(weights.relationships * 100),
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customConfig, setCustomConfig] = useState(() => getStoredFirebaseConfig());
  const [configSavedToast, setConfigSavedToast] = useState(false);

  const totalWeight =
    weightState.physical +
    weightState.discipline +
    weightState.knowledge +
    weightState.spiritual +
    weightState.finance +
    weightState.relationships;

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalWeight !== 100) {
      alert(`Weights must sum to 100%. Currently sums to ${totalWeight}%.`);
      return;
    }
    updateWeights({
      physical: weightState.physical / 100,
      discipline: weightState.discipline / 100,
      knowledge: weightState.knowledge / 100,
      spiritual: weightState.spiritual / 100,
      finance: weightState.finance / 100,
      relationships: weightState.relationships / 100,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExport = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prime_os_firebase_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (importData(content)) {
        alert('Data imported and synced to Firebase successfully!');
      } else {
        alert('Failed to import data. Invalid JSON schema.');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateFirebaseConfig(customConfig);
    setConfigSavedToast(true);
    setTimeout(() => setConfigSavedToast(false), 3000);
    setShowConfigModal(false);
  };

  return (
    <div className="space-y-5 pb-24 max-w-2xl mx-auto px-3 sm:px-6 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#ec2226]" /> System Settings & Cloud Engine
          </h2>
          <p className="text-xs text-neutral-400">Manage cloud database synchronization, scoring weights, and data backups.</p>
        </div>
      </div>

      {/* FIREBASE / FIRESTORE BACKEND STATUS CARD */}
      <div className="bg-[#121319] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Firebase Firestore Database</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Connected
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Project ID: <strong className="text-neutral-200 font-mono">{firebaseSyncStatus.projectId || 'intokine-prime-os'}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => triggerManualFirestoreSync()}
            disabled={firebaseSyncStatus.status === 'syncing'}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${firebaseSyncStatus.status === 'syncing' ? 'animate-spin text-amber-400' : ''}`} />
            <span>{firebaseSyncStatus.status === 'syncing' ? 'Syncing...' : 'Sync Cloud'}</span>
          </button>
        </div>

        {/* Sync telemetry breakdown */}
        <div className="grid grid-cols-3 gap-2 text-xs pt-1">
          <div className="bg-[#0c0d12] border border-white/5 rounded-xl p-2.5">
            <span className="text-[10px] text-neutral-500 block uppercase font-bold">Sync Status</span>
            <span className="font-semibold text-white capitalize flex items-center gap-1.5 mt-0.5">
              {firebaseSyncStatus.status === 'synced' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              {firebaseSyncStatus.status === 'syncing' && <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />}
              {firebaseSyncStatus.status === 'offline' && <AlertCircle className="w-3.5 h-3.5 text-neutral-400" />}
              {firebaseSyncStatus.status}
            </span>
          </div>

          <div className="bg-[#0c0d12] border border-white/5 rounded-xl p-2.5">
            <span className="text-[10px] text-neutral-500 block uppercase font-bold">Last Synced</span>
            <span className="font-semibold text-white mt-0.5 block">
              {firebaseSyncStatus.lastSyncedAt || 'Live Real-time'}
            </span>
          </div>

          <div className="bg-[#0c0d12] border border-white/5 rounded-xl p-2.5">
            <span className="text-[10px] text-neutral-500 block uppercase font-bold">Persistence Mode</span>
            <span className="font-semibold text-cyan-400 mt-0.5 block truncate">
              Firestore Real-Time
            </span>
          </div>
        </div>

        {/* Actions bar for Firebase */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <p className="text-[11px] text-neutral-400">
            All clients, training sessions, exercises, and finance ledgers are automatically synchronized to Firestore.
          </p>
          <button
            type="button"
            onClick={() => setShowConfigModal(!showConfigModal)}
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition whitespace-nowrap pl-2"
          >
            <Key className="w-3 h-3 text-amber-400" />
            <span>Config</span>
          </button>
        </div>

        {/* Expandable Firebase Config Details */}
        {showConfigModal && (
          <form onSubmit={handleSaveFirebaseConfig} className="mt-3 p-3.5 bg-[#0a0b10] border border-white/10 rounded-xl space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" /> Custom Firebase Project Config
              </span>
              <span className="text-[10px] text-neutral-500">Optional custom credentials</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-0.5">Project ID</label>
                <input
                  type="text"
                  value={customConfig.projectId}
                  onChange={(e) => setCustomConfig({ ...customConfig, projectId: e.target.value })}
                  className="w-full bg-[#161820] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  placeholder="your-project-id"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-0.5">API Key</label>
                <input
                  type="text"
                  value={customConfig.apiKey}
                  onChange={(e) => setCustomConfig({ ...customConfig, apiKey: e.target.value })}
                  className="w-full bg-[#161820] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  placeholder="AIzaSy..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs rounded-lg hover:opacity-90 transition"
              >
                Save Firebase Keys
              </button>
            </div>
          </form>
        )}
      </div>

      {/* DIMENSION WEIGHTS TUNING FORM */}
      <form onSubmit={handleSaveWeights} className="bg-[#121319] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#ec2226]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Prime Score Dimension Weights</h3>
          </div>
          <span className={`text-xs font-mono font-bold ${totalWeight === 100 ? 'text-emerald-400' : 'text-red-400'}`}>
            Sum: {totalWeight}% / 100%
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between text-neutral-300 mb-1 font-medium">
              <span>Physical (Athletic Workouts & Readiness)</span>
              <span className="font-mono text-white">{weightState.physical}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={weightState.physical}
              onChange={(e) => setWeightState({ ...weightState, physical: Number(e.target.value) })}
              className="w-full accent-[#ec2226]"
            />
          </div>

          <div>
            <div className="flex justify-between text-neutral-300 mb-1 font-medium">
              <span>Discipline (Tasks & Daily Mission)</span>
              <span className="font-mono text-white">{weightState.discipline}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={weightState.discipline}
              onChange={(e) => setWeightState({ ...weightState, discipline: Number(e.target.value) })}
              className="w-full accent-[#ec2226]"
            />
          </div>

          <div>
            <div className="flex justify-between text-neutral-300 mb-1 font-medium">
              <span>Knowledge (Sports Science & Synthesis)</span>
              <span className="font-mono text-white">{weightState.knowledge}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={weightState.knowledge}
              onChange={(e) => setWeightState({ ...weightState, knowledge: Number(e.target.value) })}
              className="w-full accent-[#ec2226]"
            />
          </div>

          <div>
            <div className="flex justify-between text-neutral-300 mb-1 font-medium">
              <span>Spiritual (Night Shutdown & Gratitude)</span>
              <span className="font-mono text-white">{weightState.spiritual}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={weightState.spiritual}
              onChange={(e) => setWeightState({ ...weightState, spiritual: Number(e.target.value) })}
              className="w-full accent-[#ec2226]"
            />
          </div>

          <div>
            <div className="flex justify-between text-neutral-300 mb-1 font-medium">
              <span>Finance (MRR & Cash Ledger)</span>
              <span className="font-mono text-white">{weightState.finance}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={weightState.finance}
              onChange={(e) => setWeightState({ ...weightState, finance: Number(e.target.value) })}
              className="w-full accent-[#ec2226]"
            />
          </div>

          <div>
            <div className="flex justify-between text-neutral-300 mb-1 font-medium">
              <span>Relationships (Client & Family Alignment)</span>
              <span className="font-mono text-white">{weightState.relationships}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={weightState.relationships}
              onChange={(e) => setWeightState({ ...weightState, relationships: Number(e.target.value) })}
              className="w-full accent-[#ec2226]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-gradient-to-r from-[#ec2226] to-[#f59e0b] hover:opacity-95 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-[#ec2226]/20"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : null}
          <span>{saveSuccess ? 'Weights Saved & Synced!' : 'Save & Re-Index Engine'}</span>
        </button>
      </form>

      {/* DATA BACKUP & RESTORE SECTION */}
      <div className="bg-[#121319] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Database className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Data Portability & Full State Snapshot</h3>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleExport}
            className="py-2.5 px-3 bg-[#0a0b10] border border-white/10 hover:border-[#ec2226] rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition shadow-sm"
          >
            <Download className="w-4 h-4 text-[#ec2226]" /> Export Full Backup
          </button>

          <label className="py-2.5 px-3 bg-[#0a0b10] border border-white/10 hover:border-emerald-400 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition shadow-sm">
            <Upload className="w-4 h-4 text-emerald-400" /> Import State JSON
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-white/5">
          <span className="text-[11px] text-neutral-400">Need to restore original demo seed records?</span>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all databases and records back to clean defaults?')) {
                resetToDefaults();
              }
            }}
            className="text-xs text-neutral-400 hover:text-red-400 transition underline underline-offset-2"
          >
            Reset to Seed State
          </button>
        </div>
      </div>
    </div>
  );
};
