import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  ArrowLeft,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Send,
  Download,
  QrCode,
  CreditCard,
  Smartphone,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Gift,
  Star,
  Zap,
  Shield,
  Award,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner@2.0.3";

// Use centralized wallet hook
import { useWallet } from "../../hooks/useSchoolData";

interface MobileWalletProps {
  onPageChange: (page: string) => void;
  onBack?: () => void;
}

export const MobileWalletWithMockData: React.FC<MobileWalletProps> = ({ 
  onPageChange, 
  onBack 
}) => {
  const { user } = useAuth();
  const { balance, currency, transactions, loading, refetch, addTransaction } = useWallet();
  
  const [showBalance, setShowBalance] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addAmount, setAddAmount] = useState("");

  // Calculate spending analytics from transactions
  const spendingAnalytics = useMemo(() => {
    const thisMonth = transactions.filter(t => {
      const transactionDate = new Date(t.timestamp);
      const now = new Date();
      return transactionDate.getMonth() === now.getMonth() && 
             transactionDate.getFullYear() === now.getFullYear();
    });

    const totalSpent = thisMonth
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalAdded = thisMonth
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);

    const categorySpending = thisMonth
      .filter(t => t.type === 'debit')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalSpent,
      totalAdded,
      netChange: totalAdded - totalSpent,
      categorySpending,
      transactionCount: thisMonth.length
    };
  }, [transactions]);

  const handleAddFunds = async () => {
    const amount = parseFloat(addAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await addTransaction({
        type: 'credit',
        amount,
        description: `Added funds - $${amount.toFixed(2)}`,
        category: 'fees'
      });
      
      setShowAddFunds(false);
      setAddAmount("");
      toast.success(`$${amount.toFixed(2)} added to your wallet!`);
    } catch (error) {
      toast.error("Failed to add funds. Please try again.");
    }
  };

  const handleQuickSpend = async (amount: number, category: string, description: string) => {
    if (balance < amount) {
      toast.error("Insufficient balance for this purchase");
      return;
    }

    try {
      await addTransaction({
        type: 'debit',
        amount,
        description,
        category
      });
      
      toast.success(`$${amount.toFixed(2)} spent on ${description}`);
    } catch (error) {
      toast.error("Transaction failed. Please try again.");
    }
  };

  const getTransactionIcon = (type: string, category: string) => {
    if (type === 'credit') return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
    
    switch (category) {
      case 'cafeteria': return <DollarSign className="w-4 h-4 text-orange-600" />;
      case 'library': return <Shield className="w-4 h-4 text-purple-600" />;
      case 'transport': return <Zap className="w-4 h-4 text-blue-600" />;
      case 'supplies': return <Award className="w-4 h-4 text-cyan-600" />;
      default: return <ArrowUpRight className="w-4 h-4 text-red-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getBalanceColor = () => {
    if (balance > 100) return "text-green-600";
    if (balance > 50) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
          <h3 className="text-lg font-semibold mb-2">Loading Wallet</h3>
          <p className="text-muted-foreground">Fetching your balance and transactions...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <motion.div
        className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border/50 px-4 py-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack || (() => onPageChange("dashboard"))}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Digital Wallet</h1>
              <p className="text-sm text-muted-foreground">
                {user?.role === 'student' ? 'Student Account' : 'Account Balance'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="p-4 space-y-6">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                  <div className={`text-3xl font-bold ${getBalanceColor()}`}>
                    {showBalance ? formatCurrency(balance) : "••••••"}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">This Month</p>
                  <div className={`flex items-center gap-1 ${spendingAnalytics.netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {spendingAnalytics.netChange >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-semibold">
                      {formatCurrency(Math.abs(spendingAnalytics.netChange))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Spent</p>
                  <p className="font-semibold text-red-600">
                    {formatCurrency(spendingAnalytics.totalSpent)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Added</p>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(spendingAnalytics.totalAdded)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Transactions</p>
                  <p className="font-semibold">
                    {spendingAnalytics.transactionCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => setShowAddFunds(true)}
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm">Add Funds</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => handleQuickSpend(5.00, 'cafeteria', 'Cafeteria lunch')}
            >
              <DollarSign className="w-5 h-5" />
              <span className="text-sm">Quick Lunch</span>
            </Button>
          </div>
        </motion.div>

        {/* Category Spending */}
        {Object.keys(spendingAnalytics.categorySpending).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {Object.entries(spendingAnalytics.categorySpending)
                    .sort(([,a], [,b]) => b - a)
                    .map(([category, amount]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getTransactionIcon('debit', category)}
                          <span className="capitalize font-medium">{category}</span>
                        </div>
                        <span className="font-semibold text-red-600">
                          {formatCurrency(amount)}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <Badge variant="outline">
              {transactions.length} total
            </Badge>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {transactions.slice(0, 10).map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getTransactionIcon(transaction.type, transaction.category)}
                          <div>
                            <p className="font-medium text-sm">
                              {transaction.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>
                                {new Date(transaction.timestamp).toLocaleDateString()}
                              </span>
                              <Badge variant="outline" className="text-xs capitalize">
                                {transaction.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CheckCircle className="w-3 h-3" />
                            <span>{transaction.status}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {transactions.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Transactions Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Your transaction history will appear here.
                </p>
                <Button onClick={() => setShowAddFunds(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Funds
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Funds Modal */}
      <AnimatePresence>
        {showAddFunds && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddFunds(false)}
          >
            <motion.div
              className="w-full bg-card rounded-t-2xl p-6"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Add Funds</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddFunds(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Amount ($)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-background text-lg text-center"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[10, 25, 50].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setAddAmount(amount.toString())}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    className="flex-1"
                    onClick={handleAddFunds}
                    disabled={!addAmount || parseFloat(addAmount) <= 0}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Funds
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddFunds(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};