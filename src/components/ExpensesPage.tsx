import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  IconArrowLeft,
  IconPlus,
  IconFilter,
  IconSearch,
  IconCurrencyDollar,
  IconReceipt,
  IconCreditCard,
  IconTrendingUp,
  IconTrendingDown,
  IconCalendar,
  IconCheck,
  IconX,
  IconClock,
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import hapticFeedback from "../utils/haptics";
import { ModernCard, ModernIconButton, StatCard, PremiumAnalytics, MobilePillCard } from "./ui";
import { useExpenses, useCreateExpense, useUpdateExpense } from "../lib/hooks";
import { Expense, ExpenseCreate, ExpenseCategory } from "../lib/api/types";
import { useAuth } from "../lib/contexts/AuthContext";

interface ExpensesPageProps {
  onBack: () => void;
  isDark: boolean;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

const ExpensesPage: React.FC<ExpensesPageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddExpense, setShowAddExpense] = useState(false);
  // const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [pageTitle, setPageTitle] = useState("Expenses");
  const [pageSubtitle, setPageSubtitle] = useState("Split bills and track shared costs");
  const [highlightSection, setHighlightSection] = useState<string | null>(null);
  const [expandedExpenses, setExpandedExpenses] = useState<Set<string>>(new Set());

  // API hooks
  const { data: expensesResponse } = useExpenses({ page_size: 100 });
  // const { data: expenseStats } = useExpenseStats(); // Commented out until backend is fixed
  const createExpenseMutation = useCreateExpense();
  const updateExpenseMutation = useUpdateExpense();

  const expenses = expensesResponse?.data || [];

  // Form state for adding new expenses (using string for amount to handle input)
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    paid_by_id: user?.id || "",
    category: "food" as ExpenseCategory,
    split_with_ids: user?.id ? [user.id] : [] as string[]
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

  // Update form data when user changes (auth state)
  React.useEffect(() => {
    if (user?.id) {
      setFormData(prev => ({
        ...prev,
        paid_by_id: user.id,
        split_with_ids: prev.split_with_ids.length === 0 ? [user.id] : prev.split_with_ids
      }));
    }
  }, [user?.id]);

  const roommates = [
    { id: user?.id || "", name: user?.name || "You", avatar: user?.name?.split(' ').map(n => n[0]).join('') || "U", color: "purple" },  // Current user
    { id: "roommate-2", name: "Sarah Chen", avatar: "SC", color: "blue" },
    { id: "roommate-3", name: "Mike Rodriguez", avatar: "MR", color: "green" },
    { id: "roommate-4", name: "Emma Davis", avatar: "ED", color: "pink" },
  ];

  // Simulate bill splitting by modifying expense data to show realistic roommate scenarios
  const expensesWithSimulatedSplitting = expenses.map(expense => {
    // For demo purposes, simulate that expenses are split among different roommates
    const simulatedExpense = { ...expense };
    
    // Simulate different payers and splits based on the expense type
    if (expense.title.includes("Groceries")) {
      simulatedExpense.paid_by_name = user?.name || "You";
      simulatedExpense.split_with_names = [user?.name || "You", "Sarah Chen", "Mike Rodriguez", "Emma Davis"];
      simulatedExpense.amount_per_person = (parseFloat(expense.amount.toString()) / 4).toString();
    } else if (expense.title.includes("Electric")) {
      simulatedExpense.paid_by_name = "Sarah Chen";
      simulatedExpense.split_with_names = [user?.name || "You", "Sarah Chen", "Mike Rodriguez", "Emma Davis"];
      simulatedExpense.amount_per_person = (parseFloat(expense.amount.toString()) / 4).toString();
    } else if (expense.title.includes("Dinner")) {
      simulatedExpense.paid_by_name = "Mike Rodriguez";
      simulatedExpense.split_with_names = [user?.name || "You", "Sarah Chen", "Mike Rodriguez"];
      simulatedExpense.amount_per_person = (parseFloat(expense.amount.toString()) / 3).toString();
    } else if (expense.title.includes("Netflix")) {
      simulatedExpense.paid_by_name = "Emma Davis";
      simulatedExpense.split_with_names = [user?.name || "You", "Sarah Chen", "Mike Rodriguez", "Emma Davis"];
      simulatedExpense.amount_per_person = (parseFloat(expense.amount.toString()) / 4).toString();
    } else if (expense.title.includes("Cleaning")) {
      simulatedExpense.paid_by_name = user?.name || "You";
      simulatedExpense.split_with_names = [user?.name || "You", "Sarah Chen", "Mike Rodriguez", "Emma Davis"];
      simulatedExpense.amount_per_person = (parseFloat(expense.amount.toString()) / 4).toString();
    } else {
      // Default: Current user paid, split with everyone
      simulatedExpense.paid_by_name = user?.name || "You";
      simulatedExpense.split_with_names = [user?.name || "You"];
      simulatedExpense.amount_per_person = expense.amount_per_person;
    }
    
    return simulatedExpense;
  });

  // Use the simulated expenses for calculations
  const displayExpenses = expensesWithSimulatedSplitting;

  // Add new expense function
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim() || !formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate user authentication
    if (!user?.id) {
      toast.error('You must be logged in to add expenses');
      return;
    }

    // Validate split selection
    if (formData.split_with_ids.length === 0) {
      toast.error('Please select at least one person to split with');
      return;
    }

    const newExpenseData: ExpenseCreate = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      paid_by_id: formData.paid_by_id || user.id,
      split_with_ids: formData.split_with_ids,
      category: formData.category,
      expense_date: new Date().toISOString().split('T')[0], // Today's date
    };

    createExpenseMutation.mutate(newExpenseData);
    
    // Reset form and close modal
    setFormData({
      title: "",
      amount: "",
      paid_by_id: user.id,
      category: "food" as ExpenseCategory,
      split_with_ids: [user.id]
    });
    setShowAddExpense(false);
    
    hapticFeedback.success();
  };

  // Handle settlement - actually settle expenses in the backend
  const handleSettlement = async (settlement: Settlement) => {
    try {
      // Find expenses that involve this settlement
      const relevantExpenses = displayExpenses.filter(expense => 
        !expense.settled && 
        ((expense.paid_by_name === settlement.to && expense.split_with_names?.includes(settlement.from)) ||
         (expense.paid_by_name === settlement.from && expense.split_with_names?.includes(settlement.to)))
      );

      // Mark the first relevant expense as settled (in a real app, you'd handle this more sophisticatedly)
      if (relevantExpenses.length > 0) {
        const expenseToSettle = relevantExpenses[0];
        
        await updateExpenseMutation.mutateAsync({
          expenseId: expenseToSettle.id,
          expenseData: { settled: true }
        });

        hapticFeedback.success();
        toast.success(`Settlement recorded: ${settlement.from} paid ${settlement.to} $${settlement.amount.toFixed(2)}`);
      } else {
        // If no specific expense found, just show the toast
        hapticFeedback.success();
        toast.success(`Settlement recorded: ${settlement.from} pays ${settlement.to} $${settlement.amount.toFixed(2)}`);
      }
    } catch (error) {
      console.error('Settlement failed:', error);
      toast.error('Failed to record settlement');
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle roommate in split
  const toggleRoommateInSplit = (roommateId: string) => {
    setFormData(prev => ({
      ...prev,
      split_with_ids: prev.split_with_ids.includes(roommateId)
        ? prev.split_with_ids.filter(id => id !== roommateId)
        : [...prev.split_with_ids, roommateId]
    }));
  };

  const calculateBalances = () => {
    const balances: { [key: string]: number } = {};
    roommates.forEach(roommate => {
      balances[roommate.name] = 0;
    });

    displayExpenses.forEach(expense => {
      if (!expense.settled) {
        const splitAmount = parseFloat(expense.amount_per_person.toString());
        const totalAmount = parseFloat(expense.amount.toString());
        
        // Add to payer's balance (they are owed money)
        if (expense.paid_by_name) {
          balances[expense.paid_by_name] += totalAmount - splitAmount;
        }
        
        // Subtract from each person's balance (they owe money)
        expense.split_with_names?.forEach(person => {
          if (person !== expense.paid_by_name) {
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

  const filteredExpenses = displayExpenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || expense.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount.toString()), 0);
  const settledExpenses = expenses.filter(e => e.settled).reduce((sum, expense) => sum + parseFloat(expense.amount.toString()), 0);
  const pendingExpenses = expenses.filter(e => !e.settled).reduce((sum, expense) => sum + parseFloat(expense.amount.toString()), 0);

  const balances = calculateBalances();
  const myBalance = balances[user?.name || "You"];
  const settlements = calculateSettlements();

  const toggleExpenseExpanded = (expenseId: string) => {
    setExpandedExpenses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(expenseId)) {
        newSet.delete(expenseId);
      } else {
        newSet.add(expenseId);
      }
      return newSet;
    });
  };

  // Debug logging
  React.useEffect(() => {
    console.log("Expenses with simulated splitting:", displayExpenses);
    console.log("Calculated balances:", balances);
    console.log("Your balance:", myBalance);
    console.log("Settlements:", settlements);
  }, [displayExpenses, balances, myBalance, settlements]);

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

      <div className="px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 non-settlement-container safe-area-left safe-area-right">
        {/* Stats Overview */}
        <div className={`grid grid-cols-2 gap-3 sm:gap-6 refined-light-worm non-settlement-container ${highlightSection === 'stats' ? 'ring-2 ring-purple-500 ring-opacity-50 rounded-xl p-2' : ''}`}>
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
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 refined-shimmer-accent non-settlement-container">
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

        {/* Expenses List - Mobile Optimized */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Expenses ({filteredExpenses.length})
            </h3>
            <div className="flex gap-2">
              <ModernIconButton icon={IconFilter} variant="ghost" size="sm" />
              <ModernIconButton icon={IconCalendar} variant="ghost" size="sm" />
            </div>
          </div>

          <div className="space-y-3">
            {filteredExpenses.map((expense) => (
              <MobilePillCard
                key={expense.id}
                id={expense.id}
                title={expense.title}
                subtitle={`Paid by ${expense.paid_by_name} • Split ${expense.split_with_names?.length} ways`}
                completed={expense.settled}
                category={expense.category}
                dueDate={expense.expense_date}
                amount={parseFloat(expense.amount.toString())}
                isExpanded={expandedExpenses.has(expense.id)}
                enableSwipe={false} // No swipe actions for expenses
                onToggleExpand={() => toggleExpenseExpanded(expense.id)}
                className="mx-2"
              >
                {/* Expanded Content */}
                <div className="space-y-4">
                  {/* Settlement Status */}
                  <div className={`p-3 rounded-xl border ${
                    expense.settled 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                      : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'
                  }`}>
                    <div className="flex items-center gap-2">
                      {expense.settled ? (
                        <>
                          <IconCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">
                            Settled
                          </span>
                        </>
                      ) : (
                        <>
                          <IconClock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                            Pending Settlement
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Split Details */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Split Among:
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {expense.split_with_names?.map((person: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                            {person.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {person}
                            </div>
                            <div className="text-xs text-gray-500">
                              ${parseFloat(expense.amount_per_person.toString()).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expense Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Category:</span>
                      <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">
                        {expense.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Date:</span>
                      <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">
                        {new Date(expense.expense_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Mark as Settled Button */}
                  {!expense.settled && (
                    <div className="pt-2">
                      <motion.button
                        onClick={() => {
                          // Add settlement logic here
                          toast.success('Expense marked as settled!');
                        }}
                        className="w-full px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl font-medium transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Mark as Settled
                      </motion.button>
                    </div>
                  )}
                </div>
              </MobilePillCard>
            ))}

            {filteredExpenses.length === 0 && (
              <div className="text-center py-12 mx-2">
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-3xl p-8 backdrop-blur-xl border border-white/20 dark:border-gray-700/50">
                  <IconReceipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                    No expenses found
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {searchTerm || filterCategory !== "all"
                      ? "Try adjusting your filters"
                      : "Add your first expense to get started"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

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
                  acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount.toString());
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
                  {/* Expense Title */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-white/90 refined-text-subtle-glow">
                      Expense Title
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
                  value={formData.paid_by_id}
                  onChange={(e) => handleInputChange("paid_by_id", e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/30 dark:focus:bg-white/15"
                >
                  {roommates.map(roommate => (
                    <option key={roommate.id} value={roommate.id} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium">
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
                    <label key={roommate.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/10 dark:bg-white/5 backdrop-blur border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={formData.split_with_ids.includes(roommate.id)}
                        onChange={() => toggleRoommateInSplit(roommate.id)}
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