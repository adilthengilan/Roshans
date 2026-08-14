import React, { useState } from 'react';
import { usePrimeStore } from '../../lib/store';
import { Bot, Send, Dumbbell, DollarSign, PenTool, BookOpen, Sparkles, Plus, CheckCircle2, User } from 'lucide-react';

export type AiPersona = 'Coach' | 'CFO' | 'Mentor' | 'Researcher';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  actionProposal?: {
    type: 'task' | 'knowledge' | 'workout';
    title: string;
    priority?: string;
  };
}

export const AiView: React.FC = () => {
  const {
    trainingSessions,
    recoveryEntries,
    transactions,
    getMRR,
    journalEntries,
    scoreHistory,
    knowledgeItems,
    addTask,
    addKnowledgeItem,
  } = usePrimeStore();

  const [activePersona, setActivePersona] = useState<AiPersona>('Coach');
  const [messages, setMessages] = useState<Record<AiPersona, ChatMessage[]>>({
    Coach: [
      {
        id: 'm1',
        sender: 'ai',
        text: "Assalamu Alaikum Muhammed! I'm your INTOKINE AI Coach. I've analyzed your morning calisthenics PR (strict ring muscle-ups) and your 88/100 readiness score. How can I refine your evening kickboxing or tomorrow's athletic program?",
      },
    ],
    CFO: [
      {
        id: 'm2',
        sender: 'ai',
        text: "Muhammed, welcome. I'm your INTOKINE CFO. Current August MRR stands at 62,500 AED (78% of your 80,000 AED target) across 6 active retainers. 3 renewals are due within 14 days. Where shall we optimize cash flow?",
      },
    ],
    Mentor: [
      {
        id: 'm3',
        sender: 'ai',
        text: "G'day Muhammed. I'm your INTOKINE Mentor. Your 14-day streak is holding strong and your performance score averages 88/100. What friction points or mindsets are you reflecting on for tonight's shutdown?",
      },
    ],
    Researcher: [
      {
        id: 'm4',
        sender: 'ai',
        text: "Muhammed, I am ready to assist with sports science, mechanical tension literature, or combat athlete nutrition protocols. What scientific topic or coaching framework shall we synthesize?",
      },
    ],
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate compact contextual data summary for the active persona
  const getContextSummary = (persona: AiPersona) => {
    switch (persona) {
      case 'Coach':
        return {
          recentWorkouts: trainingSessions.slice(0, 3),
          latestRecovery: recoveryEntries[0] || null,
        };
      case 'CFO':
        return {
          mrr: getMRR(),
          recentTransactions: transactions.slice(0, 5),
        };
      case 'Mentor':
        return {
          latestJournal: journalEntries[0] || null,
          primeScoreHistory: scoreHistory.slice(-5),
        };
      case 'Researcher':
        return {
          activeKnowledgeItems: knowledgeItems.slice(0, 3),
        };
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputPrompt.trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text: query,
    };

    setMessages((prev) => ({
      ...prev,
      [activePersona]: [...prev[activePersona], userMsg],
    }));
    setInputPrompt('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: activePersona,
          userMessage: query,
          contextSummary: getContextSummary(activePersona),
        }),
      });

      const data = await response.json();
      let replyText = data.reply || 'I am processing your query.';
      let actionProposal = undefined;

      // Parse ACTION_PROPOSAL if injected by AI
      if (replyText.includes('ACTION_PROPOSAL:')) {
        const parts = replyText.split('ACTION_PROPOSAL:');
        replyText = parts[0].trim();
        try {
          actionProposal = JSON.parse(parts[1].trim());
        } catch (err) {
          console.warn('Could not parse action proposal', err);
        }
      }

      const aiMsg: ChatMessage = {
        id: 'a_' + Date.now(),
        sender: 'ai',
        text: replyText,
        actionProposal,
      };

      setMessages((prev) => ({
        ...prev,
        [activePersona]: [...prev[activePersona], aiMsg],
      }));
    } catch (error) {
      console.error('AI error', error);
      const errorMsg: ChatMessage = {
        id: 'e_' + Date.now(),
        sender: 'ai',
        text: 'I encountered an issue connecting to the Gemini engine. Please check API credentials.',
      };
      setMessages((prev) => ({
        ...prev,
        [activePersona]: [...prev[activePersona], errorMsg],
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteProposal = (proposal: ChatMessage['actionProposal']) => {
    if (!proposal) return;
    if (proposal.type === 'task') {
      addTask({
        name: proposal.title,
        status: (proposal.priority as any) || 'Must Do',
        completed: false,
        category: 'AI Recommendation',
        dueDate: '2026-08-09',
      });
      alert(`Task "${proposal.title}" created in your task list!`);
    } else if (proposal.type === 'knowledge') {
      addKnowledgeItem({
        title: proposal.title,
        type: 'Research',
        source: 'AI Research Synthesis',
        status: 'Active',
        progress: 10,
        keyLearning: 'Generated from Researcher AI Session',
      });
      alert(`Knowledge resource "${proposal.title}" added to your library!`);
    }
  };

  return (
    <div className="space-y-3 pb-20 max-w-xl mx-auto px-3 sm:px-4 pt-3 h-[calc(100vh-120px)] flex flex-col">
      {/* Persona Selector Bar */}
      <div className="grid grid-cols-4 gap-1 bg-[#161618] p-1.5 rounded-2xl border border-[#26262A] shrink-0">
        <button
          onClick={() => setActivePersona('Coach')}
          className={`py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition ${
            activePersona === 'Coach'
              ? 'bg-[#FF5A1F] text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Dumbbell className="w-4 h-4" /> Coach
        </button>

        <button
          onClick={() => setActivePersona('CFO')}
          className={`py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition ${
            activePersona === 'CFO'
              ? 'bg-[#FF5A1F] text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" /> CFO
        </button>

        <button
          onClick={() => setActivePersona('Mentor')}
          className={`py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition ${
            activePersona === 'Mentor'
              ? 'bg-[#FF5A1F] text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <PenTool className="w-4 h-4" /> Mentor
        </button>

        <button
          onClick={() => setActivePersona('Researcher')}
          className={`py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition ${
            activePersona === 'Researcher'
              ? 'bg-[#FF5A1F] text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Researcher
        </button>
      </div>

      {/* Persona Header Indicator */}
      <div className="bg-[#161618] border border-[#26262A] rounded-xl px-3 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF5A1F]" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {activePersona} AI Persona · Grounded in your data
          </span>
        </div>
        <span className="text-[10px] text-neutral-500">Gemini 3.6 Flash</span>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto space-y-3 p-1">
        {messages[activePersona].map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 text-[#FF5A1F] flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-[#FF5A1F] text-white rounded-tr-none shadow-md font-medium'
                  : 'bg-[#161618] border border-[#26262A] text-neutral-200 rounded-tl-none shadow-md'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* One-tap Action Affordance Button */}
              {msg.actionProposal && (
                <div className="mt-2 pt-2 border-t border-[#26262A]">
                  <button
                    onClick={() => handleExecuteProposal(msg.actionProposal)}
                    className="w-full py-1.5 px-2 bg-[#FF5A1F]/20 border border-[#FF5A1F]/50 text-[#FF5A1F] hover:bg-[#FF5A1F] hover:text-white rounded-xl font-bold text-[11px] transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> One-Tap: Create Task "{msg.actionProposal.title}"
                  </button>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-neutral-800 text-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-neutral-400 p-2 italic">
            <Sparkles className="w-4 h-4 text-[#FF5A1F] animate-spin" />
            <span>INTOKINE AI is analyzing your data...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0">
        <input
          type="text"
          placeholder={`Ask AI ${activePersona} (e.g. "Should I train hard today?")...`}
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          className="flex-1 bg-[#161618] border border-[#26262A] rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF5A1F]"
        />
        <button
          type="submit"
          disabled={loading || !inputPrompt.trim()}
          className="px-4 py-2.5 bg-[#FF5A1F] hover:bg-[#E04D18] disabled:opacity-50 text-white rounded-2xl transition font-bold text-xs flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
