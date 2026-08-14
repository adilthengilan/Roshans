import React, { useState, useMemo } from 'react';
import { usePrimeStore } from '../lib/store';
import {
  DollarSign,
  TrendingUp,
  Wallet,
  PiggyBank,
  PieChart as PieChartIcon,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  ShieldCheck,
  Calendar,
  Filter,
  CheckCircle2,
  BarChart2,
  Building,
  Briefcase,
  Sparkles,
  CreditCard,
  Lock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const PersonalMoneyTracker: React.FC = () => {
  const { transactions, addTransaction, financialGoals } = usePrimeStore();

  // Sub-Tab Navigation for Financial Management
  const [finTab, setFinTab] = useState<'overview' | 'ledger' | 'assets' | 'goals'>('overview');

  // Currency Selector
  const [currency, setCurrency] = useState<'AED' | 'USD'>('AED');
  const currencySymbol = currency === 'AED' ? 'AED ' : '$';

  // Transaction Filter
  const [txFilter, setTxFilter] = useState<'ALL' | 'income' | 'expense' | 'investment'>('ALL');

  // Add Transaction Modal State
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [txType, setTxType] = useState<'income' | 'expense'>('income');
  const [txCat, setTxCat] = useState('Personal Coaching');
  const [txAmount, setTxAmount] = useState<number>(5000);
  const [txDesc, setTxDesc] = useState('');
  const [txDate, setTxDate] = useState('2026-08-09');

  // Net Worth Historical Data for Financial Growth Tracking (12 Months)
  const netWorthGrowthData = [
    { month: 'Sep 25', NetWorth: 145000, LiquidCash: 42000, Investments: 68000, BusinessEquity: 35000, MonthlySavings: 12000 },
    { month: 'Oct 25', NetWorth: 154000, LiquidCash: 45000, Investments: 71000, BusinessEquity: 38000, MonthlySavings: 14000 },
    { month: 'Nov 25', NetWorth: 162500, LiquidCash: 48000, Investments: 74500, BusinessEquity: 40000, MonthlySavings: 15500 },
    { month: 'Dec 25', NetWorth: 173000, LiquidCash: 52000, Investments: 78000, BusinessEquity: 43000, MonthlySavings: 18000 },
    { month: 'Jan 26', NetWorth: 184500, LiquidCash: 55000, Investments: 84500, BusinessEquity: 45000, MonthlySavings: 16500 },
    { month: 'Feb 26', NetWorth: 196000, LiquidCash: 58000, Investments: 90000, BusinessEquity: 48000, MonthlySavings: 17200 },
    { month: 'Mar 26', NetWorth: 208000, LiquidCash: 62000, Investments: 96000, BusinessEquity: 50000, MonthlySavings: 19000 },
    { month: 'Apr 26', NetWorth: 219500, LiquidCash: 65000, Investments: 101500, BusinessEquity: 53000, MonthlySavings: 18500 },
    { month: 'May 26', NetWorth: 231000, LiquidCash: 68000, Investments: 108000, BusinessEquity: 55000, MonthlySavings: 20000 },
    { month: 'Jun 26', NetWorth: 242500, LiquidCash: 72000, Investments: 112500, BusinessEquity: 58000, MonthlySavings: 21000 },
    { month: 'Jul 26', NetWorth: 254000, LiquidCash: 75000, Investments: 119000, BusinessEquity: 60000, MonthlySavings: 22500 },
    { month: 'Aug 26', NetWorth: 268500, LiquidCash: 81000, Investments: 125500, BusinessEquity: 62000, MonthlySavings: 24000 },
  ];

  // Asset Allocation Pie Breakdown
  const assetAllocationData = [
    { name: 'Liquid Cash & Emergency Fund', value: 81000, color: '#10b981' },
    { name: 'Global Index Funds & Stocks', value: 85500, color: '#3b82f6' },
    { name: 'Digital & Crypto Assets', value: 40000, color: '#8b5cf6' },
    { name: 'Intokine Coaching Business Capital', value: 62000, color: '#ff5a1f' },
  ];

  // Financial Metrics Calculations
  const currentNetWorth = netWorthGrowthData[netWorthGrowthData.length - 1].NetWorth;
  const previousNetWorth = netWorthGrowthData[netWorthGrowthData.length - 2].NetWorth;
  const momGrowthAmount = currentNetWorth - previousNetWorth;
  const momGrowthPercentage = ((momGrowthAmount / previousNetWorth) * 100).toFixed(1);

  // Compute total monthly income vs expense from transactions store
  const monthlyStats = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach((tx) => {
      if (tx.type === 'income') income += tx.amount;
      else expense += tx.amount;
    });
    const netSavings = Math.max(0, income - expense);
    const savingsRate = income > 0 ? Math.round((netSavings / income) * 100) : 0;

    return { income, expense, netSavings, savingsRate };
  }, [transactions]);

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (txAmount <= 0) return;

    addTransaction({
      date: txDate,
      category: txCat,
      amount: Number(txAmount),
      type: txType,
      description: txDesc || `${txCat} transaction`,
    });

    setShowAddTxModal(false);
    setTxAmount(5000);
    setTxDesc('');
  };

  const filteredTransactions = useMemo(() => {
    if (txFilter === 'ALL') return transactions;
    return transactions.filter((t) => t.type === txFilter);
  }, [transactions, txFilter]);

  return (
    <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-4 sm:p-5 shadow-xl space-y-5">
      {/* Header & Main Toggle Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#26262A] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                Personal Money Management & Growth Engine
              </h2>
              <p className="text-xs text-neutral-400">
                Track Net Worth Expansion, Personal Cash Flow, Investments & Wealth Milestones
              </p>
            </div>
          </div>
        </div>

        {/* Currency Switcher & Add Transaction Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0A0A0B] p-1 rounded-xl border border-[#26262A]">
            <button
              onClick={() => setCurrency('AED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                currency === 'AED' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              AED
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                currency === 'USD' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              USD ($)
            </button>
          </div>

          <button
            onClick={() => setShowAddTxModal(true)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow"
          >
            <Plus className="w-4 h-4" /> Log Cash Flow
          </button>
        </div>
      </div>

      {/* Financial Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0A0A0B] p-1.5 rounded-xl border border-[#26262A]">
        <button
          onClick={() => setFinTab('overview')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            finTab === 'overview'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-neutral-400 hover:text-white hover:bg-[#161618]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>1. Net Worth Growth</span>
        </button>

        <button
          onClick={() => setFinTab('ledger')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            finTab === 'ledger'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-neutral-400 hover:text-white hover:bg-[#161618]'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>2. Cash Flow Ledger ({transactions.length})</span>
        </button>

        <button
          onClick={() => setFinTab('assets')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            finTab === 'assets'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-neutral-400 hover:text-white hover:bg-[#161618]'
          }`}
        >
          <PieChartIcon className="w-3.5 h-3.5" />
          <span>3. Asset Allocation Matrix</span>
        </button>

        <button
          onClick={() => setFinTab('goals')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            finTab === 'goals'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-neutral-400 hover:text-white hover:bg-[#161618]'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>4. Wealth Milestones ({financialGoals.length})</span>
        </button>
      </div>

      {/* TOP SUMMARY KPIS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0A0A0B] border border-[#26262A] p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
            Current Net Worth
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-black font-mono text-emerald-400">
              {currencySymbol}{currentNetWorth.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-emerald-500/20">
              <ArrowUpRight className="w-3 h-3" /> +{momGrowthPercentage}% MoM
            </span>
          </div>
        </div>

        <div className="bg-[#0A0A0B] border border-[#26262A] p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
            Monthly Inflow (Income)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-black font-mono text-white">
              {currencySymbol}{monthlyStats.income.toLocaleString()}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">Gross Revenue</span>
          </div>
        </div>

        <div className="bg-[#0A0A0B] border border-[#26262A] p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
            Monthly Outflow (Expense)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-black font-mono text-amber-400">
              {currencySymbol}{monthlyStats.expense.toLocaleString()}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">Living & Ops</span>
          </div>
        </div>

        <div className="bg-[#0A0A0B] border border-[#26262A] p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
            Savings / Re-Investment Rate
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-black font-mono text-blue-400">
              {monthlyStats.savingsRate}%
            </span>
            <span className="text-[10px] font-bold text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
              {currencySymbol}{monthlyStats.netSavings.toLocaleString()} Retained
            </span>
          </div>
        </div>
      </div>

      {/* VIEW 1: NET WORTH GROWTH CHART & ANALYTICS */}
      {finTab === 'overview' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-[#0A0A0B] border border-[#26262A] p-4 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#26262A] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Financial Growth Statistics (12-Month Curve)
                </span>
                <h3 className="text-sm font-bold text-white mt-1">
                  Compound Net Worth & Asset Expansion Trajectory
                </h3>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-neutral-400">
                  Annualized Growth: <strong className="text-emerald-400">+85.1% YoY</strong>
                </span>
              </div>
            </div>

            {/* Recharts Composed Area Chart */}
            <div className="h-64 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={netWorthGrowthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#26262A" vertical={false} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={10} tickLine={false} axisLine={{ stroke: '#26262A' }} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={{ stroke: '#26262A' }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#161618] border border-[#26262A] p-3 rounded-xl shadow-xl text-xs space-y-1">
                            <p className="font-bold text-white border-b border-[#26262A] pb-1">{data.month}</p>
                            <p className="text-emerald-400 font-bold">
                              Net Worth: {currencySymbol}{data.NetWorth.toLocaleString()}
                            </p>
                            <p className="text-neutral-300">
                              Liquid Cash: {currencySymbol}{data.LiquidCash.toLocaleString()}
                            </p>
                            <p className="text-blue-400">
                              Investments: {currencySymbol}{data.Investments.toLocaleString()}
                            </p>
                            <p className="text-amber-400">
                              Business Equity: {currencySymbol}{data.BusinessEquity.toLocaleString()}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="NetWorth" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#netWorthGrad)" />
                  <Line type="monotone" dataKey="Investments" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Bar dataKey="MonthlySavings" fill="#34d399" maxBarSize={16} radius={[4, 4, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Growth Drivers & Wealth Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#0A0A0B] border border-[#26262A] p-3.5 rounded-xl space-y-1.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-400" /> Coaching & High Ticket Income
              </span>
              <p className="text-xs text-neutral-400">
                Primary cash flow driver. High margin performance coaching & client retainer revenue.
              </p>
              <span className="text-xs font-mono font-bold text-emerald-400 block pt-1">
                +AED 38,000 / Month Target
              </span>
            </div>

            <div className="bg-[#0A0A0B] border border-[#26262A] p-3.5 rounded-xl space-y-1.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-400" /> Portfolio Compounding
              </span>
              <p className="text-xs text-neutral-400">
                Monthly dollar-cost averaging into low-cost broad index ETFs and tech assets.
              </p>
              <span className="text-xs font-mono font-bold text-blue-400 block pt-1">
                +12.4% Annual Yield Forecast
              </span>
            </div>

            <div className="bg-[#0A0A0B] border border-[#26262A] p-3.5 rounded-xl space-y-1.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-400" /> Capital Preservation
              </span>
              <p className="text-xs text-neutral-400">
                6-Month liquid reserve maintained in high-yield account to hedge against shocks.
              </p>
              <span className="text-xs font-mono font-bold text-amber-400 block pt-1">
                AED 81,000 Fully Funded
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CASH FLOW TRANSACTION LEDGER */}
      {finTab === 'ledger' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Filters & Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0A0A0B] p-3 rounded-xl border border-[#26262A]">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] text-neutral-500 font-bold uppercase mr-1">Filter Type:</span>
              {['ALL', 'income', 'expense'].map((typeKey) => (
                <button
                  key={typeKey}
                  onClick={() => setTxFilter(typeKey as any)}
                  className={`px-3 py-1 rounded-lg font-bold transition text-[11px] ${
                    txFilter === typeKey
                      ? 'bg-emerald-600 text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-[#161618]'
                  }`}
                >
                  {typeKey.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddTxModal(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Log Income / Expense
            </button>
          </div>

          {/* Transaction Ledger Table */}
          <div className="bg-[#0A0A0B] border border-[#26262A] rounded-xl overflow-hidden">
            <div className="p-3 border-b border-[#26262A] flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Recent Financial Activity Log
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                Showing {filteredTransactions.length} Transactions
              </span>
            </div>

            <div className="divide-y divide-[#1C1C20] text-xs">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 hover:bg-[#121215] transition flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`p-2 rounded-xl border ${
                        tx.type === 'income'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{tx.description}</span>
                        <span className="text-[10px] font-mono text-neutral-400 bg-[#161618] px-1.5 py-0.5 rounded border border-[#26262A]">
                          {tx.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono">{tx.date}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-black font-mono text-sm block ${
                        tx.type === 'income' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}{currencySymbol}{tx.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: ASSET ALLOCATION MATRIX */}
      {finTab === 'assets' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Pie Chart Card */}
            <div className="lg:col-span-6 bg-[#0A0A0B] border border-[#26262A] p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-[#26262A] pb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <PieChartIcon className="w-4 h-4 text-emerald-400" /> Asset Portfolio Matrix
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Total: {currencySymbol}{currentNetWorth.toLocaleString()}
                </span>
              </div>

              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetAllocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {assetAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#161618] border border-[#26262A] p-2.5 rounded-xl shadow-xl text-xs space-y-1">
                              <p className="font-bold text-white border-b border-[#26262A] pb-1">{data.name}</p>
                              <p className="text-emerald-400 font-mono font-bold">
                                {currencySymbol}{data.value.toLocaleString()}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                {assetAllocationData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-neutral-300">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assets Breakdown Table */}
            <div className="lg:col-span-6 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Portfolio Holdings Breakdown
              </span>

              <div className="space-y-2">
                {assetAllocationData.map((asset, idx) => {
                  const pct = Math.round((asset.value / currentNetWorth) * 100);

                  return (
                    <div
                      key={idx}
                      className="bg-[#0A0A0B] border border-[#26262A] p-3 rounded-xl space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: asset.color }} />
                          {asset.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {currencySymbol}{asset.value.toLocaleString()} ({pct}%)
                        </span>
                      </div>

                      <div className="w-full bg-[#1A1A1E] h-1.5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ backgroundColor: asset.color, width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: FINANCIAL GOALS & WEALTH MILESTONES */}
      {finTab === 'goals' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Wealth Expansion Target Milestones ({financialGoals.length})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {financialGoals.map((fg) => {
              const pct = Math.min(100, Math.round((fg.currentAmount / fg.targetAmount) * 100));

              return (
                <div
                  key={fg.id}
                  className="bg-[#0A0A0B] border border-[#26262A] hover:border-emerald-500/40 p-4 rounded-xl space-y-3 transition shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {fg.category}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1.5">{fg.title}</h3>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black font-mono text-emerald-400">{pct}%</span>
                      <span className="text-[10px] text-neutral-500 block">Achieved</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-neutral-400">Current: {currencySymbol}{fg.currentAmount.toLocaleString()}</span>
                      <span className="text-white font-bold">Target: {currencySymbol}{fg.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-[#1A1A1E] h-2 rounded-full overflow-hidden border border-[#26262A]">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 border-t border-[#1C1C20]">
                    <span>Target Date: <strong className="text-white">{fg.targetDate}</strong></span>
                    <span className="text-emerald-400 font-bold">On Track ✓</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: LOG CASH FLOW / TRANSACTION */}
      {showAddTxModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161618] border border-[#26262A] rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#26262A] pb-3">
              <h3 className="text-sm font-bold text-white">Log Financial Cash Flow Transaction</h3>
              <button onClick={() => setShowAddTxModal(false)} className="text-neutral-400 hover:text-white text-xs font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Transaction Type</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as any)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="income">Income (+ Revenue)</option>
                    <option value="expense">Expense (- Cost)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Category</label>
                  <select
                    value={txCat}
                    onChange={(e) => setTxCat(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Personal Coaching">Personal Coaching</option>
                    <option value="Business Dividend">Business Dividend</option>
                    <option value="Investments">Investments / Dividends</option>
                    <option value="Athletic Equipment">Athletic Equipment & Tech</option>
                    <option value="Nutrition & Health">Nutrition & Health</option>
                    <option value="Living Expenses">Living Expenses</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                  Amount ({currency})
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={txAmount}
                  onChange={(e) => setTxAmount(Number(e.target.value))}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Description / Client Note</label>
                <input
                  type="text"
                  placeholder="e.g. 1-on-1 Fight Coaching Retainer"
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#26262A] p-2.5 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTxModal(false)}
                  className="px-3 py-2 bg-[#0A0A0B] border border-[#26262A] text-neutral-400 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow">
                  Record Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
