import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  Brain,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Award,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  Zap,
  Star,
  Filter,
  Search,
  Edit,
  Trash2,
  Share2,
  BarChart3,
  Users,
  Calendar,
  Settings,
  Trophy
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // in minutes
  questions: Question[];
  creator: string;
  createdAt: string;
  attempts: number;
  averageScore: number;
  tags: string[];
  isPublic: boolean;
  category: 'practice' | 'assessment' | 'review';
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalPoints: number;
  timeSpent: number;
  answers: { [questionId: string]: string };
  completedAt: string;
  correctAnswers: number;
  totalQuestions: number;
}

interface QuizSession {
  quiz: Quiz;
  currentQuestionIndex: number;
  answers: { [questionId: string]: string };
  startTime: number;
  timeRemaining: number;
  isCompleted: boolean;
}

const QuizSystem: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('take-quiz');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizResults, setQuizResults] = useState<QuizAttempt[]>([]);

  // Mock data
  useEffect(() => {
    setQuizzes([
      {
        id: '1',
        title: 'Calculus Fundamentals',
        description: 'Test your understanding of basic calculus concepts including derivatives and integrals.',
        subject: 'Mathematics',
        difficulty: 'medium',
        duration: 30,
        questions: [
          {
            id: '1',
            type: 'multiple-choice',
            question: 'What is the derivative of x²?',
            options: ['x', '2x', 'x²', '2x²'],
            correctAnswer: '2x',
            explanation: 'Using the power rule: d/dx(x²) = 2x¹ = 2x',
            points: 5,
            difficulty: 'easy'
          },
          {
            id: '2',
            type: 'multiple-choice',
            question: 'What is ∫2x dx?',
            options: ['x²', 'x² + C', '2x²', '2x² + C'],
            correctAnswer: 'x² + C',
            explanation: 'The integral of 2x is x² plus the constant of integration C',
            points: 5,
            difficulty: 'medium'
          }
        ],
        creator: 'Dr. Smith',
        createdAt: '2024-01-01',
        attempts: 245,
        averageScore: 85.5,
        tags: ['calculus', 'derivatives', 'integrals'],
        isPublic: true,
        category: 'practice'
      },
      {
        id: '2',
        title: 'Physics Mechanics Quiz',
        description: 'Comprehensive quiz covering Newton\'s laws, motion, and energy.',
        subject: 'Physics',
        difficulty: 'hard',
        duration: 45,
        questions: [
          {
            id: '3',
            type: 'multiple-choice',
            question: 'What is Newton\'s second law?',
            options: ['F = ma', 'E = mc²', 'v = u + at', 'W = mg'],
            correctAnswer: 'F = ma',
            explanation: 'Newton\'s second law states that Force equals mass times acceleration',
            points: 10,
            difficulty: 'medium'
          }
        ],
        creator: 'Prof. Johnson',
        createdAt: '2024-01-02',
        attempts: 189,
        averageScore: 78.2,
        tags: ['mechanics', 'newton', 'motion'],
        isPublic: true,
        category: 'assessment'
      }
    ]);

    setQuizResults([
      {
        id: '1',
        quizId: '1',
        userId: user?.id || '1',
        score: 90,
        totalPoints: 100,
        timeSpent: 25,
        answers: { '1': '2x', '2': 'x² + C' },
        completedAt: '2024-01-15T10:30:00',
        correctAnswers: 9,
        totalQuestions: 10
      }
    ]);
  }, [user?.id]);

  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    subject: '',
    difficulty: 'medium' as const,
    duration: 30,
    category: 'practice' as const,
    isPublic: true,
    tags: ''
  });

  const [newQuestion, setNewQuestion] = useState({
    type: 'multiple-choice' as const,
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    points: 5,
    difficulty: 'medium' as const
  });

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English', 'History'];
  const difficulties = ['easy', 'medium', 'hard'];
  const categories = ['practice', 'assessment', 'review'];

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };

  const categoryColors = {
    practice: 'bg-blue-100 text-blue-800',
    assessment: 'bg-purple-100 text-purple-800',
    review: 'bg-orange-100 text-orange-800'
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = filterDifficulty === 'all' || quiz.difficulty === filterDifficulty;
    const matchesSubject = filterSubject === 'all' || quiz.subject === filterSubject;
    return matchesSearch && matchesDifficulty && matchesSubject;
  });

  const startQuiz = (quiz: Quiz) => {
    const session: QuizSession = {
      quiz,
      currentQuestionIndex: 0,
      answers: {},
      startTime: Date.now(),
      timeRemaining: quiz.duration * 60 * 1000, // Convert to milliseconds
      isCompleted: false
    };
    setCurrentSession(session);
  };

  const answerQuestion = (answer: string) => {
    if (!currentSession) return;

    const currentQuestion = currentSession.quiz.questions[currentSession.currentQuestionIndex];
    const updatedAnswers = {
      ...currentSession.answers,
      [currentQuestion.id]: answer
    };

    setCurrentSession({
      ...currentSession,
      answers: updatedAnswers
    });
  };

  const nextQuestion = () => {
    if (!currentSession) return;

    if (currentSession.currentQuestionIndex < currentSession.quiz.questions.length - 1) {
      setCurrentSession({
        ...currentSession,
        currentQuestionIndex: currentSession.currentQuestionIndex + 1
      });
    } else {
      completeQuiz();
    }
  };

  const previousQuestion = () => {
    if (!currentSession) return;

    if (currentSession.currentQuestionIndex > 0) {
      setCurrentSession({
        ...currentSession,
        currentQuestionIndex: currentSession.currentQuestionIndex - 1
      });
    }
  };

  const completeQuiz = () => {
    if (!currentSession) return;

    const timeSpent = Math.floor((Date.now() - currentSession.startTime) / 1000 / 60); // minutes
    let score = 0;
    let correctAnswers = 0;
    let totalPoints = 0;

    currentSession.quiz.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = currentSession.answers[question.id];
      if (userAnswer === question.correctAnswer) {
        score += question.points;
        correctAnswers++;
      }
    });

    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      quizId: currentSession.quiz.id,
      userId: user?.id || '1',
      score,
      totalPoints,
      timeSpent,
      answers: currentSession.answers,
      completedAt: new Date().toISOString(),
      correctAnswers,
      totalQuestions: currentSession.quiz.questions.length
    };

    setQuizResults(prev => [...prev, attempt]);
    setCurrentSession({ ...currentSession, isCompleted: true });
    
    toast.success(`Quiz completed! You scored ${score}/${totalPoints} points.`);
  };

  const restartQuiz = () => {
    if (!currentSession) return;
    startQuiz(currentSession.quiz);
  };

  const exitQuiz = () => {
    setCurrentSession(null);
  };

  // Timer effect
  useEffect(() => {
    if (!currentSession || currentSession.isCompleted) return;

    const timer = setInterval(() => {
      setCurrentSession(prev => {
        if (!prev) return prev;
        
        const newTimeRemaining = prev.timeRemaining - 1000;
        
        if (newTimeRemaining <= 0) {
          completeQuiz();
          return { ...prev, timeRemaining: 0, isCompleted: true };
        }
        
        return { ...prev, timeRemaining: newTimeRemaining };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSession]);

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const QuizCard = ({ quiz }: { quiz: Quiz }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedQuiz(quiz)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2">{quiz.title}</CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{quiz.subject}</Badge>
                <Badge className={difficultyColors[quiz.difficulty]}>
                  {quiz.difficulty}
                </Badge>
                <Badge className={categoryColors[quiz.category]}>
                  {quiz.category}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{quiz.averageScore.toFixed(1)}%</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {quiz.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{quiz.questions.length} questions</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{quiz.duration}min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{quiz.attempts} attempts</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {quiz.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {quiz.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{quiz.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="pt-2 border-t flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Created by {quiz.creator}
            </span>
            
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                startQuiz(quiz);
              }}
            >
              <Play className="w-4 h-4 mr-1" />
              Start Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Quiz taking interface
  if (currentSession && !currentSession.isCompleted) {
    const currentQuestion = currentSession.quiz.questions[currentSession.currentQuestionIndex];
    const progress = ((currentSession.currentQuestionIndex + 1) / currentSession.quiz.questions.length) * 100;
    const userAnswer = currentSession.answers[currentQuestion.id];

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{currentSession.quiz.title}</h1>
              <p className="text-muted-foreground">
                Question {currentSession.currentQuestionIndex + 1} of {currentSession.quiz.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-lg">
                  {formatTime(currentSession.timeRemaining)}
                </span>
              </div>
              <Button variant="outline" onClick={exitQuiz}>
                Exit Quiz
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          {/* Question */}
          <Card>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Badge className={difficultyColors[currentQuestion.difficulty]}>
                    {currentQuestion.difficulty}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {currentQuestion.points} points
                  </span>
                </div>

                <h2 className="text-xl font-medium leading-relaxed">
                  {currentQuestion.question}
                </h2>

                <div className="space-y-3">
                  {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant={userAnswer === option ? "default" : "outline"}
                            className="w-full p-4 h-auto text-left justify-start"
                            onClick={() => answerQuestion(option)}
                          >
                            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm mr-3">
                              {String.fromCharCode(65 + index)}
                            </span>
                            {option}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === 'true-false' && (
                    <div className="flex gap-4">
                      <Button
                        variant={userAnswer === 'true' ? "default" : "outline"}
                        className="flex-1 p-4"
                        onClick={() => answerQuestion('true')}
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        True
                      </Button>
                      <Button
                        variant={userAnswer === 'false' ? "default" : "outline"}
                        className="flex-1 p-4"
                        onClick={() => answerQuestion('false')}
                      >
                        <XCircle className="w-5 h-5 mr-2" />
                        False
                      </Button>
                    </div>
                  )}

                  {currentQuestion.type === 'short-answer' && (
                    <Input
                      placeholder="Enter your answer..."
                      value={userAnswer || ''}
                      onChange={(e) => answerQuestion(e.target.value)}
                      className="text-lg p-4"
                    />
                  )}

                  {currentQuestion.type === 'essay' && (
                    <Textarea
                      placeholder="Enter your essay answer..."
                      value={userAnswer || ''}
                      onChange={(e) => answerQuestion(e.target.value)}
                      rows={6}
                      className="text-base"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentSession.currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {currentSession.currentQuestionIndex === currentSession.quiz.questions.length - 1 ? (
                <Button
                  onClick={completeQuiz}
                  disabled={!userAnswer}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Quiz
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  disabled={!userAnswer}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz results interface
  if (currentSession && currentSession.isCompleted) {
    const latestResult = quizResults[quizResults.length - 1];
    const percentage = Math.round((latestResult.score / latestResult.totalPoints) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Award className="w-24 h-24 mx-auto text-yellow-500" />
            </motion.div>
            
            <h1 className="text-3xl font-bold">Quiz Completed!</h1>
            <p className="text-xl text-muted-foreground">
              You scored {latestResult.score} out of {latestResult.totalPoints} points
            </p>
            
            <div className="text-4xl font-bold text-primary">
              {percentage}%
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{latestResult.correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-secondary" />
                <div className="text-2xl font-bold">{latestResult.timeSpent}m</div>
                <div className="text-sm text-muted-foreground">Time Spent</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold">{percentage}%</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={restartQuiz}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
            <Button variant="outline" onClick={exitQuiz}>
              <BookOpen className="w-4 h-4 mr-2" />
              Browse Quizzes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main quiz interface
  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Quiz System
          </h1>
          <p className="text-muted-foreground">
            Test your knowledge with interactive quizzes and track your progress
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Quiz</DialogTitle>
            </DialogHeader>
            {/* Quiz creation form would go here */}
            <div className="p-4">
              <p className="text-muted-foreground">Quiz creation form coming soon...</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="take-quiz">Take Quiz</TabsTrigger>
          <TabsTrigger value="my-results">My Results</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>

        <TabsContent value="take-quiz" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search quizzes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quizzes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredQuizzes.map(quiz => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </AnimatePresence>
          </div>

          {filteredQuizzes.length === 0 && (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No quizzes found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or create a new quiz
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Quiz
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-results" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{quizResults.length}</div>
                <div className="text-sm text-muted-foreground">Quizzes Completed</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">
                  {quizResults.length > 0 
                    ? Math.round(quizResults.reduce((acc, result) => acc + (result.score / result.totalPoints) * 100, 0) / quizResults.length)
                    : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">
                  {quizResults.reduce((acc, result) => acc + result.timeSpent, 0)}m
                </div>
                <div className="text-sm text-muted-foreground">Total Study Time</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {quizResults.map(result => {
              const quiz = quizzes.find(q => q.id === result.quizId);
              if (!quiz) return null;
              
              const percentage = Math.round((result.score / result.totalPoints) * 100);
              
              return (
                <Card key={result.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{quiz.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Completed on {new Date(result.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{percentage}%</div>
                        <div className="text-sm text-muted-foreground">
                          {result.correctAnswers}/{result.totalQuestions} correct
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={percentage} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {quizResults.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No quiz results yet</h3>
              <p className="text-muted-foreground mb-4">
                Take some quizzes to see your results here
              </p>
              <Button onClick={() => setActiveTab('take-quiz')}>
                <Play className="w-4 h-4 mr-2" />
                Take a Quiz
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground">
              Detailed analytics and insights coming soon
            </p>
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <div className="text-center py-12">
            <Plus className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Quiz Creation</h3>
            <p className="text-muted-foreground">
              Create your own quizzes with our intuitive quiz builder
            </p>
            <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Start Creating
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuizSystem;