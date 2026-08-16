import React, { useState } from 'react';
import { usePrimeStore } from '../../lib/store';
import {
  DollarSign,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Shield,
  CreditCard,
  Building,
} from 'lucide-react';

export const MoneyView: React.FC = () => {
  const { transactions, getMonthFinanceSnapshot, getMRR, addTransaction } = usePrimeStore();
  const money = getMonthFinanceSnapshot();
  const mrr = getMRR();

  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');

  return (
    <div className="space-y-4 pb-20 max-w-xl mx-auto px-3 sm:px-4 pt-4">
      {/* Top Banner (Crisp Bright Surface) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm text-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Wealth Capital & Operating Cash
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight mt-0.5">
              425,000 <span className="text-xs font-semibold text-slate-500 font-sans">AED</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">+12.5% MTD</span>
            <div className="text-[11px] text-slate-500 mt-1">Savings Rate: {money.savingsRate}%</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">MRR</div>
            <div className="text-xs font-bold text-[#0891b2] font-mono mt-0.5">{mrr.toLocaleString()} AED</div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Income</div>
            <div className="text-xs font-bold text-emerald-600 font-mono mt-0.5">+{money.income.toLocaleString()} AED</div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Expenses</div>
            <div className="text-xs font-bold text-[#ec2226] font-mono mt-0.5">-{money.expenses.toLocaleString()} AED</div>
          </div>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex bg-[#14161f] border border-white/[0.08] rounded-2xl p-1 gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
            activeTab === 'overview'
              ? 'bg-white text-[#0d0e12] shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Financial Breakdown
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
            activeTab === 'transactions'
              ? 'bg-white text-[#0d0e12] shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Ledger ({transactions.length})
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-3">
          <div className="bg-[#14161f] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Top Expenditure Categories</h3>
            <div className="space-y-2.5 pt-1">
              {[
                { cat: 'Business & Operations', amount: 5500, color: 'bg-amber-500' },
                { cat: 'Equipment & Supplements', amount: 2800, color: 'bg-[#ec2226]' },
                { cat: 'Living & Facility Rent', amount: 1800, color: 'bg-[#06b6d4]' },
                { cat: 'Subscriptions & Software', amount: 800, color: 'bg-purple-500' },
              ].map((item) => (
                <div key={item.cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-neutral-300">
                    <span>{item.cat}</span>
                    <span className="font-mono font-bold text-white">{item.amount.toLocaleString()} AED</span>
                  </div>
                  <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden border border-white/10">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${(item.amount / 10900) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-[#161618] border border-[#26262A] rounded-2xl p-3.5 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl border ${
                    tx.type === 'Income'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                >
                  {tx.type === 'Income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{tx.category}</div>
                  <div className="text-[10px] text-neutral-400">{tx.description} · {tx.date}</div>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-xs font-mono font-bold ${tx.type === 'Income' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {tx.type === 'Income' ? '+' : '-'}{tx.amount.toLocaleString()} AED
                </div>
                <div className="text-[10px] text-neutral-500">{tx.brand || 'Personal'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
