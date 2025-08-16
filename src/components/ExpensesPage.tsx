import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  IconArrowLeft,
  IconPlus,
  IconFilter,
  IconSearch,
  IconCurrencyDollar,
  IconUsers,
  IconReceipt,
  IconCreditCard,
  IconTrendingUp,
  IconTrendingDown,
  IconCalendar,
  IconCheck,
  IconX,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import hapticFeedback from "../utils/haptics";
import { ModernCard, ModernIconButton, StatCard, PremiumAnalytics } from "./ui";

interface ExpensesPageProps {
  onBack: () => void;
  isDark: boolean;
}

interface Expense {
  id: number;
  title: string;
  amount: number;
  paidBy: string;
  splitWith: string[];
  date: string;
  category: string;
  settled: boolean;
  receipt?: string;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

const ExpensesPage: React.FC<ExpensesPageProps> = ({ onBack, isDark }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [pageTitle, setPageTitle] = useState("Expenses");
  const [pageSubtitle, setPageSubtitle] = useState("Split bills and track shared costs");
  const [highlightSection, setHighlightSection] = useState<string | null>(null);

  // Form state for adding new expenses
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    paidBy: "Alex Johnson",
    category: "food",
    splitWith: ["Alex Johnson", "Sarah Chen", "Mike Rodriguez", "Emma Davis"] as string[]
  });

  // Check for personalized filters from dashboard
  React.useEffect(() => {
    const pageFilter = sessionStorage.getItem('pageFilter');
    if (pageFilter === 'myOwed') {
      setPageTitle("What You Owe");
      setPageSubtitle("Outstanding amounts you need to settle");
      setHighlightSection("settlements");
      sessionStorage.removeItem('pageFilter');
    } else if (pageFilter === 'myShare') {
      setPageTitle("Your Expense Share");
      setPageSubtitle("Track your monthly spending and contributions");
      setHighlightSection("stats");
      sessionStorage.removeItem('pageFilter');
    }
  }, []);

  const roommates = [
    { name: "Alex Johnson", avatar: "AJ", color: "purple" },
    { name: "Sarah Chen", avatar: "SC", color: "blue" },
    { name: "Mike Rodriguez", avatar: "MR", color: "green" },
    { name: "Emma Davis", avatar: "ED", color: "pink" },
  ];

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      title: "Grocery Shopping - Whole Foods",
      amount: 127.50,
      paidBy: "Sarah Chen",
      splitWith: ["Alex Johnson", "Sarah Chen", "Mike Rodriguez", "Emma Davis"],
      date: "2024-12-15",
      category: "Food",
      settled: false,
    },
    {
      id: 2,
      title: "Internet Bill - December",
      amount: 89.99,
      paidBy: "Mike Rodriguez",
      splitWith: ["Alex Johnson", "Sarah Chen", "Mike Rodriguez", "Emma Davis"],
      date: "2024-12-10",
      category: "Utilities",
      settled: true,
    },
    {
      id: 3,
      title: "Cleaning Supplies",
      amount: 45.25,
      paidBy: "Alex Johnson",
      splitWith: ["Alex Johnson", "Sarah Chen", "Emma Davis"],
      date: "2024-12-08",
      category: "Household",
      settled: false,
    },
    {
      id: 4,
      title: "Pizza Night",
      amount: 62.80,
      paidBy: "Emma Davis",
      splitWith: ["Alex Johnson", "Sarah Chen", "Mike Rodriguez", "Emma Davis"],
      date: "2024-12-05",
      category: "Food",
      settled: true,
    },
  ]);

  // Add new expense function
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.amount || parseFloat(formData.amount) <= 0) {
      return; // Don't add invalid expenses
    }

    const newExpense: Expense = {
      id: Math.max(...expenses.map(e => e.id)) + 1,
      title: formData.title,
      amount: parseFloat(formData.amount),
      paidBy: formData.paidBy,
      splitWith: formData.splitWith,
      date: new Date().toISOString().split('T')[0], // Today's date
      category: formData.category,
      settled: false,
    };

    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
    
    // Reset form and close modal
    setFormData({
      title: "",
      amount: "",
      paidBy: "Alex Johnson",
      category: "food",
      splitWith: ["Alex Johnson", "Sarah Chen", "Mike Rodriguez", "Emma Davis"]
    });
    setShowAddExpense(false);
    
    hapticFeedback.expenseAdded();
    toast.success("Expense added successfully!");
  };

  // Mark expense as settled
  const handleSettleExpense = (expenseId: number) => {
    setExpenses(prevExpenses =>
      prevExpenses.map(expense =>
        expense.id === expenseId
          ? { ...expense, settled: true }
          : expense
      )
    );
  };

  // Handle settlement
  const handleSettlement = (settlement: Settlement) => {
    hapticFeedback.success();
    // In a real app, this would create a settlement record
    toast.success(`Settlement recorded: ${settlement.from} pays ${settlement.to} $${settlement.amount.toFixed(2)}`);
    
    // For demo purposes, we'll just show a success message
    // In reality, you'd want to mark related expenses as settled or create settlement records
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle roommate in split
  const toggleRoommateInSplit = (roommateName: string) => {
    setFormData(prev => ({
      ...prev,
      splitWith: prev.splitWith.includes(roommateName)
        ? prev.splitWith.filter(name => name !== roommateName)
        : [...prev.splitWith, roommateName]
    }));
  };

  const calculateBalances = () => {
    const balances: { [key: string]: number } = {};
    roommates.forEach(roommate => {
      balances[roommate.name] = 0;
    });

    expenses.forEach(expense => {
      if (!expense.settled) {
        const splitAmount = expense.amount / expense.splitWith.length;
        
        // Add to payer's balance
        balances[expense.paidBy] += expense.amount - splitAmount;
        
        // Subtract from each person's balance
        expense.splitWith.forEach(person => {
          if (person !== expense.paidBy) {
            balances[person] -= splitAmount;
          }
        });
      }
    });

    return balances;
  };

  const calculateSettlements = (): Settlement[] => {
    const balances = calculateBalances();
    const settlements: Settlement[] = [];
    
    const creditors = Object.entries(balances).filter(([_, amount]) => amount > 0);
    const debtors = Object.entries(balances).filter(([_, amount]) => amount < 0);
    
    creditors.forEach(([creditor, creditAmount]) => {
      debtors.forEach(([debtor, debtAmount]) => {
        if (Math.abs(debtAmount) > 0.01 && creditAmount > 0.01) {
          const settlementAmount = Math.min(creditAmount, Math.abs(debtAmount));
          settlements.push({
            from: debtor,
            to: creditor,
            amount: settlementAmount
          });
          
          balances[creditor] -= settlementAmount;
          balances[debtor] += settlementAmount;
        }
      });
    });
    
    return settlements.filter(s => s.amount > 0.01);
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || expense.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const settledExpenses = expenses.filter(e => e.settled).reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter(e => !e.settled).reduce((sum, expense) => sum + expense.amount, 0);

  const balances = calculateBalances();
  const myBalance = balances["Alex Johnson"];
  const settlements = calculateSettlements();

  const categories = ["All", "Food", "Utilities", "Household", "Entertainment", "Transportation"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-purple-50/20 pb-20 refined-plasma-border holographic" style={{ 
      backgroundColor: "var(--homey-bg)",
      backgroundImage: `
        radial-gradient(circle at 15% 40%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 85% 30%, rgba(59, 130, 246, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 50% 85%, rgba(236, 72, 153, 0.05) 0%, transparent 50%)
      `
    }}>
      {/* Header */}
              <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/[0.08] border-b border-white/[0.12] refined-flowing-border refined-aurora-glow">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ModernIconButton
                icon={IconArrowLeft}
                onClick={onBack}
                variant="ghost"
                tooltip="Back to dashboard"
              />
              <div>
                <h1 className="refined-heading-1 text-gradient streaming-light-text">{pageTitle}</h1>
                <p className="refined-subheading pulsing-glow-text">{pageSubtitle}</p>
              </div>
            </div>
            
            <ModernIconButton
              icon={IconPlus}
              onClick={() => setShowAddExpense(true)}
              variant="primary"
              tooltip="Add new expense"
              className="refined-breathing-glow refined-particle-trail electric-border neon-pulse"
            />
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 space-y-6 non-settlement-container">
        {/* Stats Overview */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 refined-light-worm non-settlement-container ${highlightSection === 'stats' ? 'ring-2 ring-purple-500 ring-opacity-50 rounded-xl p-2' : ''}`}>
          <motion.div 
            className="holographic shiny-overlay rounded-3xl"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <StatCard
              title="Total Expenses"
              value={totalExpenses}
              prefix="$"
              icon={IconCurrencyDollar}
              color="blue"
              change={12}
              trend="up"
              changeLabel="this month"
            />
          </motion.div>
          
          <motion.div 
            className="liquid-glass shiny-overlay rounded-3xl"
            whileHover={{ scale: 1.05, rotateY: -5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <StatCard
              title="Your Balance"
              value={Math.abs(myBalance)}
              prefix={myBalance >= 0 ? "+$" : "-$"}
              icon={myBalance >= 0 ? IconTrendingUp : IconTrendingDown}
              color={myBalance >= 0 ? "green" : "red"}
              change={myBalance >= 0 ? 15 : -8}
              trend={myBalance >= 0 ? "up" : "down"}
              changeLabel={myBalance >= 0 ? "you're owed" : "you owe"}
            />
          </motion.div>
          
          <motion.div 
            className="crystal-glass shiny-overlay rounded-3xl"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <StatCard
              title="Settled"
              value={settledExpenses}
              prefix="$"
              icon={IconCheck}
              color="green"
              change={25}
              trend="up"
              changeLabel="this month"
            />
          </motion.div>
          
          <motion.div 
            className="frosted-glass shiny-overlay rounded-3xl"
            whileHover={{ scale: 1.05, rotateY: -5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <StatCard
              title="Pending"
              value={pendingExpenses}
              prefix="$"
              icon={IconReceipt}
              color="yellow"
              change={-10}
              trend="down"
              changeLabel="to settle"
            />
          </motion.div>
        </div>

        {/* Settlements Section */}
        {settlements.length > 0 && (
          <div className={`settlement-container ${highlightSection === 'settlements' ? 'ring-2 ring-purple-500 ring-opacity-50 rounded-xl p-2' : ''}`}>
            <ModernCard variant="glass" className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <IconCreditCard className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {highlightSection === 'settlements' ? 'What You Need to Settle' : 'Suggested Settlements'}
                </h3>
              </div>
              
              <div className="space-y-3">
                {settlements.map((settlement, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-white text-xs font-bold">
                        {settlement.from.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-gray-600 dark:text-gray-300">owes</span>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white text-xs font-bold">
                        {settlement.to.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${settlement.amount.toFixed(2)}
                      </div>
                      <button 
                        onClick={() => handleSettlement(settlement)}
                        className="text-xs text-green-600 dark:text-green-400 hover:underline hover:text-green-700 dark:hover:text-green-300 transition-colors"
                      >
                        Mark as settled
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ModernCard>
          </div>
        )}



        {/* Search and Filter */}
                  <div className="flex gap-4 refined-shimmer-accent non-settlement-container">
          <div className="flex-1 relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/[0.08] border border-white/[0.12] rounded-xl backdrop-blur-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-white/[0.08] border border-white/[0.12] rounded-xl backdrop-blur-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Expenses List */}
        <ModernCard variant="crystal" className="p-6 refined-hover-glow refined-border-light refined-plasma-border shiny-overlay crawling-light electric-border non-settlement-container">
          <div className="flex items-center justify-between mb-6">
            <h3 className="refined-heading-4 refined-text-stream-glow glass-text-bold">
              Recent Expenses
            </h3>
            <div className="flex gap-2">
              <ModernIconButton icon={IconFilter} variant="ghost" size="sm" />
              <ModernIconButton icon={IconCalendar} variant="ghost" size="sm" />
            </div>
          </div>

          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <motion.div
                key={expense.id}
                className="p-5 border rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden group bg-gradient-to-r from-white to-purple-50/20 dark:from-gray-800 dark:to-purple-900/10 border-purple-200/30 dark:border-purple-700/30 hover:bg-gradient-to-r hover:from-purple-50/40 hover:to-violet-50/40 dark:hover:from-purple-900/15 dark:hover:to-violet-900/15 hover:border-purple-300/50 dark:hover:border-purple-600/50 hover:shadow-lg hover:shadow-purple-100/20 dark:hover:shadow-purple-900/20 refined-breathing-light refined-hover-glow"
                onClick={() => setSelectedExpense(expense)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white refined-text-shimmer-stream glass-text-bold">
                        {expense.title}
                      </h4>
                                              {expense.settled && (
                         <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full border border-green-200 dark:border-green-700 shadow-sm backdrop-blur-sm">
                           ✓ Settled
                         </span>
                       )}
                       {!expense.settled && (
                         <span className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded-full border border-orange-200 dark:border-orange-700 shadow-sm backdrop-blur-sm">
                           ⏳ Pending
                         </span>
                       )}
                    </div>
                    
                                         <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                       <span className="refined-text-wave-glow">Paid by {expense.paidBy}</span>
                      <span>•</span>
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{expense.category}</span>
                      <span>•</span>
                      <span>Split {expense.splitWith.length} ways</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {expense.splitWith.slice(0, 4).map((person, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold"
                        >
                          {person.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                      {expense.splitWith.length > 4 && (
                        <span className="text-xs text-gray-500">
                          +{expense.splitWith.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                                      <div className="text-right">
                     <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-violet-500 transition-all duration-200 refined-text-progressive-glow">
                       ${expense.amount.toFixed(2)}
                     </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ${(expense.amount / expense.splitWith.length).toFixed(2)} per person
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ModernCard>

        {/* Premium Expense Analytics - Only show if we have enough data */}
        {expenses.length >= 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 refined-aurora-glow refined-light-worm">
            {/* Category Breakdown Analytics */}
            <PremiumAnalytics
              title="Category Breakdown"
              subtitle="Spending by category"
              type="distribution"
              icon={<IconReceipt className="w-4 h-4" />}
              accentColor="#3B82F6"
              data={(() => {
                const categoryTotals = expenses.reduce((acc, expense) => {
                  acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
                  return acc;
                }, {} as Record<string, number>);

                const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
                const colorMap: Record<string, string> = {
                  'food': '#10B981',
                  'utilities': '#3B82F6', 
                  'household': '#F59E0B',
                  'groceries': '#8B5CF6',
                  'entertainment': '#EF4444'
                };
                
                return Object.entries(categoryTotals).map(([category, amount]) => {
                  const avgExpense = amount / expenses.filter(e => e.category === category).length;
                  return {
                    name: category.charAt(0).toUpperCase() + category.slice(1),
                    value: Math.round(amount * 100) / 100,
                    trend: (amount > total * 0.4 ? 'up' : amount > total * 0.2 ? 'neutral' : 'down') as 'up' | 'down' | 'neutral',
                    change: Math.round((amount / total) * 100),
                    color: colorMap[category.toLowerCase()] || '#6B7280',
                    details: `Avg: $${Math.round(avgExpense)}, ${expenses.filter(e => e.category === category).length} transactions`
                  };
                });
              })()}
              showInsights={true}
            />

            {/* Settlement Status Analytics */}
            <PremiumAnalytics
              title="Settlement Status" 
              subtitle="Payment progress tracking"
              type="status"
              icon={<IconCreditCard className="w-4 h-4" />}
              accentColor="#10B981"
              data={[
                {
                  name: "Settled",
                  value: Math.round(settledExpenses * 100) / 100,
                  trend: 'up',
                  change: 20,
                  color: '#10B981',
                  details: `${Math.round((settledExpenses / totalExpenses) * 100)}% of total expenses settled`
                },
                {
                  name: "Pending",
                  value: Math.round(pendingExpenses * 100) / 100,
                  trend: pendingExpenses > settledExpenses ? 'down' : 'up',
                  change: pendingExpenses > settledExpenses ? -10 : 5,
                  color: '#F59E0B',
                  details: `${expenses.filter(e => !e.settled).length} unsettled transactions`
                },
                {
                  name: "Your Share",
                  value: Math.round((totalExpenses / 4) * 100) / 100, // Assuming 4 roommates
                  trend: 'neutral',
                  change: 0,
                  color: '#8B5CF6',
                  details: 'Based on equal split among roommates'
                }
              ]}
              showInsights={true}
            />
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <motion.div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setShowAddExpense(false)}
        >
          <motion.div 
            className="absolute top-24 right-6 w-96 max-h-[calc(100vh-8rem)] overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: -20, x: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0, x: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20, x: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Background with Advanced Glassmorphism */}
            <div className="relative bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-gray-900/80 dark:via-gray-800/60 dark:to-gray-900/40 backdrop-blur-2xl border border-white/30 dark:border-white/20 rounded-3xl shadow-2xl overflow-hidden">
              
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10"></div>
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                  backgroundSize: '60px 60px'
                }}></div>
              </div>
              
              {/* Content Container */}
              <div className="relative z-10 p-6">
                {/* Compact Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-green-500/20 border border-green-500/30">
                      <IconCurrencyDollar className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white refined-text-progressive-glow">
                        New Expense
                      </h3>
                      <p className="text-green-200/70 text-xs mt-0.5">Quick add</p>
                    </div>
                  </div>
                  <ModernIconButton
                    icon={IconX}
                    onClick={() => setShowAddExpense(false)}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-white/10 text-white/70 hover:text-white"
                  />
                </div>

                {/* Compact Form */}
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                  {/* Expense Description */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-white/90 refined-text-subtle-glow">
                      Expense Description
                    </label>
                    <input
                      type="text"
                      placeholder="What was this expense for?"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="w-full px-4 py-3.5 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/15 focus:bg-white/15"
                    />
                  </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2 drop-shadow-sm">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-xl text-white font-medium placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/30 dark:focus:bg-white/15"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2 drop-shadow-sm">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/30 dark:focus:bg-white/15"
                >
                  <option value="food" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium">Food</option>
                  <option value="utilities" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium">Utilities</option>
                  <option value="household" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium">Household</option>
                  <option value="entertainment" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium">Entertainment</option>
                  <option value="transportation" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium">Transportation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2 drop-shadow-sm">
                  Paid by
                </label>
                <select
                  value={formData.paidBy}
                  onChange={(e) => handleInputChange("paidBy", e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/30 dark:focus:bg-white/15"
                >
                  {roommates.map(roommate => (
                    <option key={roommate.name} value={roommate.name} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium">
                      {roommate.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2 drop-shadow-sm">
                  Split with
                </label>
                <div className="space-y-2">
                  {roommates.map(roommate => (
                    <label key={roommate.name} className="flex items-center gap-3 p-2 rounded-lg bg-white/10 dark:bg-white/5 backdrop-blur border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={formData.splitWith.includes(roommate.name)}
                        onChange={() => toggleRoommateInSplit(roommate.name)}
                        className="w-4 h-4 text-purple-600 bg-white/30 dark:bg-white/20 border-white/40 dark:border-white/30 rounded focus:ring-purple-500/50 focus:ring-2"
                      />
                      <span className="text-white font-medium">
                        {roommate.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-8 border-t border-white/10">
                    <motion.button
                      type="button"
                      onClick={() => setShowAddExpense(false)}
                      className="flex-1 px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-2xl text-white font-semibold transition-all duration-200 backdrop-blur-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      onClick={handleAddExpense}
                      className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg shadow-green-500/20 border border-green-400/30"
                      whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(34, 197, 94, 0.25)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Add Expense
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ExpensesPage; 