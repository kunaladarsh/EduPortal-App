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
  Award
} from "lucide-react";

interface MobileWalletProps {
  onPageChange: (page: string) => void;
  onBack?: () => void;
}

// Import centralized wallet hook
import { useWallet } from "../../hooks/useSchoolData";

export const MobileWallet: React.FC<MobileWalletProps> = ({ onPageChange, onBack }) => {
  const { user } = useAuth();
  const { balance, currency, transactions, loading, refetch } = useWallet();
  const [showBalance, setShowBalance] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");

  // Add loading state
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

  // Use centralized wallet data
  const getWalletData = useMemo(() => {
    const recentTransactions = transactions.slice(-5);
    const totalChange = recentTransactions.reduce((sum, t) => {
      return sum + (t.type === 'credit' ? t.amount : -t.amount);
    }, 0);
    
    switch (user?.role) {
      case "student":
        return {
          balance: balance.toLocaleString(),
          currency: "USD",
          change: totalChange >= 0 ? `+${totalChange.toFixed(2)}` : totalChange.toFixed(2),
          changePercent: `${totalChange >= 0 ? '+' : ''}${((totalChange / Math.max(balance - totalChange, 1)) * 100).toFixed(1)}%`,
          trend: totalChange >= 0 ? "up" : "down",
          subtitle: "Student Account"
        };
      case "teacher":
        return {
          balance: (balance * 2).toLocaleString(),
          currency: "USD",
          change: `+${(totalChange * 1.5).toFixed(2)}`,
          changePercent: `+${((totalChange * 1.5 / Math.max(balance * 2 - totalChange * 1.5, 1)) * 100).toFixed(1)}%`,
          trend: "up",
          subtitle: "Faculty Account"
        };
      case "admin":
        return {
          balance: "98.5",
          currency: "%",
          change: "+2.1",
          changePercent: "+2.2%",
          trend: "up",
          subtitle: "System Efficiency"
        };
      default:
        return {
          balance: balance.toFixed(2),
          currency: "USD",
          change: totalChange.toFixed(2),
          changePercent: "0%",
          trend: "up",
          subtitle: "Account Balance"
        };
    }
  }, [user?.role, balance, transactions]);

  const getQuickActions = () => {
    switch (user?.role) {
      case "student":
        return [
          { id: "earn", label: "Earn Credits", icon: Plus, gradient: "from-green-500 to-emerald-500" },
          { id: "spend", label: "Redeem", icon: Gift, gradient: "from-purple-500 to-pink-500" },
          { id: "transfer", label: "Share", icon: Send, gradient: "from-blue-500 to-cyan-500" },
          { id: "scan", label: "Scan QR", icon: QrCode, gradient: "from-orange-500 to-red-500" }
        ];
      case "teacher":
        return [
          { id: "reward", label: "Reward", icon: Award, gradient: "from-yellow-500 to-orange-500" },
          { id: "transfer", label: "Transfer", icon: Send, gradient: "from-blue-500 to-indigo-500" },
          { id: "request", label: "Request", icon: Download, gradient: "from-green-500 to-teal-500" },
          { id: "scan", label: "Scan", icon: QrCode, gradient: "from-purple-500 to-violet-500" }
        ];
      case "admin":
        return [
          { id: "monitor", label: "Monitor", icon: TrendingUp, gradient: "from-blue-500 to-cyan-500" },
          { id: "allocate", label: "Allocate", icon: Send, gradient: "from-green-500 to-emerald-500" },
          { id: "analyze", label: "Analyze", icon: Zap, gradient: "from-purple-500 to-pink-500" },
          { id: "secure", label: "Security", icon: Shield, gradient: "from-orange-500 to-red-500" }
        ];
      default:
        return [];
    }
  };

  const getTransactions = () => {
    // Use centralized transaction data
    return transactions.slice(0, 6).map(transaction => ({
      id: transaction.id,
      type: transaction.type,
      title: transaction.description,
      subtitle: transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1),
      amount: `${transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}`,
      time: new Date(transaction.timestamp).toLocaleDateString(),
      status: transaction.status,
      icon: transaction.type === 'credit' ? CheckCircle : ArrowUpRight
    })); 
  };

  const walletData = getWalletData;
  const quickActions = getQuickActions();
  const transactionData = getTransactions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-secondary text-white p-6 pt-12">
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 bg-white/20 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          
          <h1 className="text-lg font-semibold">Wallet</h1>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white/20 rounded-xl"
          >
            <QrCode className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/15 backdrop-blur-lg rounded-3xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/70 text-sm">{walletData.subtitle}</p>
              <div className="flex items-center gap-3 mt-1">
                {showBalance ? (
                  <h1 className="text-3xl font-bold">
                    {walletData.balance} <span className="text-lg">{walletData.currency}</span>
                  </h1>
                ) : (
                  <h1 className="text-3xl font-bold">•••• {walletData.currency}</h1>
                )}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1"
                >
                  {showBalance ? 
                    <EyeOff className="w-4 h-4 text-white/60" /> : 
                    <Eye className="w-4 h-4 text-white/60" />
                  }
                </motion.button>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                walletData.trend === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {walletData.trend === 'up' ? 
                  <TrendingUp className="w-3 h-3 text-green-300" /> :
                  <TrendingDown className="w-3 h-3 text-red-300" />
                }
                <span className={`text-xs font-medium ${
                  walletData.trend === 'up' ? 'text-green-300' : 'text-red-300'
                }`}>
                  {walletData.changePercent}
                </span>
              </div>
              <p className="text-white/60 text-xs mt-1">{selectedPeriod}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/10 rounded-2xl p-3">
              <p className="text-white/60 text-xs">This Month</p>
              <p className="text-white font-semibold">+{walletData.change}</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3">
              <p className="text-white/60 text-xs">Total Earned</p>
              <p className="text-white font-semibold">{parseInt(walletData.balance) * 2}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <div className={`bg-gradient-to-br ${action.gradient} rounded-2xl p-4 shadow-lg mb-2`}>
                  <Icon className="w-6 h-6 text-white mx-auto" />
                </div>
                <p className="text-xs font-medium text-gray-700 text-center">{action.label}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Transactions */}
      <div className="p-6">
        <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {transactions.map((transaction, index) => {
                const Icon = transaction.icon;
                const isCredit = transaction.type === "credit" || transaction.amount.startsWith("+");
                
                return (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isCredit ? 'bg-green-100' : 
                      transaction.status === 'pending' ? 'bg-orange-100' : 'bg-red-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        isCredit ? 'text-green-600' : 
                        transaction.status === 'pending' ? 'text-orange-600' : 'text-red-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm">{transaction.title}</h4>
                      <p className="text-gray-500 text-xs">{transaction.subtitle}</p>
                      <p className="text-gray-400 text-xs mt-1">{transaction.time}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-bold text-sm ${
                        isCredit ? 'text-green-600' : 
                        transaction.status === 'pending' ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {transaction.amount}
                      </p>
                      <Badge 
                        variant={transaction.status === 'completed' ? 'secondary' : 'outline'}
                        className="text-xs mt-1"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileWallet;