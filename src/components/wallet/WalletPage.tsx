import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  CreditCard, DollarSign, TrendingUp, TrendingDown,
  Send, ArrowDownLeft, ArrowUpRight, MoreHorizontal,
  Eye, EyeOff, Plus, History, PieChart, 
  Building, ShoppingCart, GraduationCap, Utensils,
  Car, Gamepad2, Music, Film, Book
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "sonner";

export const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock wallet data
  const walletData = {
    balance: 2450.75,
    monthlySpending: 1247.50,
    savings: 850.25,
    pendingPayments: 125.00,
    recentTransactions: [
      {
        id: "1",
        type: "expense",
        category: "education",
        amount: 250.00,
        description: "Course Materials",
        date: "2024-01-15",
        status: "completed"
      },
      {
        id: "2", 
        type: "income",
        category: "scholarship",
        amount: 500.00,
        description: "Academic Excellence Award",
        date: "2024-01-14",
        status: "completed"
      },
      {
        id: "3",
        type: "expense", 
        category: "food",
        amount: 25.50,
        description: "Campus Cafeteria",
        date: "2024-01-14",
        status: "completed"
      },
      {
        id: "4",
        type: "expense",
        category: "transport",
        amount: 12.00,
        description: "Bus Pass",
        date: "2024-01-13",
        status: "completed"
      },
      {
        id: "5",
        type: "expense",
        category: "books",
        amount: 89.99,
        description: "Digital Textbook",
        date: "2024-01-12",
        status: "pending"
      }
    ],
    spendingCategories: [
      { name: "Education", amount: 750.00, percentage: 60, color: "#7C3AED" },
      { name: "Food", amount: 312.50, percentage: 25, color: "#0EA5E9" },
      { name: "Transport", amount: 125.00, percentage: 10, color: "#FB7185" },
      { name: "Entertainment", amount: 60.00, percentage: 5, color: "#10B981" }
    ]
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "education": return <GraduationCap className="w-4 h-4" />;
      case "food": return <Utensils className="w-4 h-4" />;
      case "transport": return <Car className="w-4 h-4" />;
      case "books": return <Book className="w-4 h-4" />;
      case "entertainment": return <Music className="w-4 h-4" />;
      case "scholarship": return <TrendingUp className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const SendMoneyDialog = () => {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");

    const handleSend = () => {
      if (!recipient || !amount) {
        toast.error("Please fill in all required fields");
        return;
      }
      toast.success(`Sent ${formatCurrency(parseFloat(amount))} to ${recipient}`);
      setRecipient("");
      setAmount("");
      setNote("");
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
            <Send className="w-4 h-4 mr-2" />
            Send Money
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Money</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient</label>
              <Input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter name or student ID"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Note (Optional)</label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's this for?"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSend}>Send Money</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Digital Wallet</h1>
          <p className="text-muted-foreground mt-1">
            Manage your student finances and payments
          </p>
        </div>
        <SendMoneyDialog />
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Balance</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBalanceVisible(!balanceVisible)}
              >
                {balanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-primary">
                {balanceVisible ? formatCurrency(walletData.balance) : "••••••"}
              </div>
              <div className="flex items-center space-x-4">
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Funds
                </Button>
                <Button size="sm" variant="outline">
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Monthly Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(walletData.monthlySpending)}
            </div>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 mr-1 text-destructive" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Savings Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {formatCurrency(walletData.savings)}
            </div>
            <div className="mt-2">
              <Progress value={68} className="h-2" />
              <div className="text-sm text-muted-foreground mt-1">
                68% of $1,250 goal
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              
              <div className="space-y-3">
                {walletData.recentTransactions.slice(0, 5).map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === "income" ? "bg-secondary/10" : "bg-destructive/10"
                          }`}>
                            {transaction.type === "income" ? (
                              <ArrowDownLeft className={`w-5 h-5 ${
                                transaction.type === "income" ? "text-secondary" : "text-destructive"
                              }`} />
                            ) : (
                              <ArrowUpRight className="w-5 h-5 text-destructive" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              {getCategoryIcon(transaction.category)}
                              <span className="ml-1 capitalize">{transaction.category}</span>
                              <span className="mx-2">•</span>
                              <span>{transaction.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${
                            transaction.type === "income" ? "text-secondary" : "text-foreground"
                          }`}>
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </div>
                          <Badge 
                            variant={transaction.status === "completed" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Spending Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Spending by Category</h3>
              
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {walletData.spendingCategories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="text-sm font-medium">{category.name}</span>
                          </div>
                          <span className="text-sm font-semibold">
                            {formatCurrency(category.amount)}
                          </span>
                        </div>
                        <Progress 
                          value={category.percentage} 
                          className="h-2"
                          style={{ 
                            backgroundColor: `${category.color}20`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Building className="w-4 h-4 mr-2" />
                    Pay Tuition
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Book className="w-4 h-4 mr-2" />
                    Buy Textbooks
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Utensils className="w-4 h-4 mr-2" />
                    Meal Plan
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Car className="w-4 h-4 mr-2" />
                    Parking Pass
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">All Transactions</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">Filter</Button>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>

          <div className="space-y-3">
            {walletData.recentTransactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === "income" ? "bg-secondary/10" : "bg-destructive/10"
                      }`}>
                        {getCategoryIcon(transaction.category)}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">
                          <span className="capitalize">{transaction.category}</span>
                          <span className="mx-2">•</span>
                          <span>{transaction.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-3">
                      <div>
                        <div className={`font-semibold ${
                          transaction.type === "income" ? "text-secondary" : "text-foreground"
                        }`}>
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </div>
                        <Badge 
                          variant={transaction.status === "completed" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                          <DropdownMenuItem>Report Issue</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 mx-auto mb-2" />
                    <p>Spending analytics chart would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                    <p>Monthly comparison chart would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm opacity-90">Student ID Card</div>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="space-y-4">
                  <div className="text-lg font-mono">
                    •••• •••• •••• 1234
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <div className="text-xs opacity-75">STUDENT</div>
                      <div className="font-medium">{user?.name}</div>
                    </div>
                    <div>
                      <div className="text-xs opacity-75">EXPIRES</div>
                      <div className="font-medium">06/26</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-muted-foreground/50">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-48">
                <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                <h3 className="font-medium mb-1">Add New Card</h3>
                <p className="text-sm text-muted-foreground">
                  Link a new payment method
                </p>
                <Button variant="outline" className="mt-4">
                  Add Card
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};