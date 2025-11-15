import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Brain,
  LogOutIcon,
  Radio,
  BookOpen,
  User,
} from 'lucide-react';

// --- UI Button Component (UNCHANGED) ---
const Button = ({
  children,
  onClick,
  className = '',
  size = 'md',
  disabled = false,
}) => {
  let padding;
  switch (size) {
    case 'sm':
      padding = 'px-3 py-1 text-sm';
      break;
    case 'lg':
      padding = 'px-8 py-3 text-lg';
      break;
    case 'md':
    default:
      padding = 'px-4 py-2 text-base';
      break;
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer ${padding} ${className}`}
    >
      {children}
    </button>
  );
};

// --- Menu Bar Component (UNCHANGED EXCEPT REMOVED NAV BUTTONS) ---
const MenuBar = ({ onLogout }) => {
  return (
    <header>
      <h1 className="text-2xl font-extrabold text-blue-800 flex items-center">
        <Brain className="w-7 h-7 mr-2 text-blue-500" />
        Pattern Learning Platform
      </h1>

      <nav>
        <Button
          onClick={onLogout}
          className="flex items-center text-gray-500 bg-transparent hover:bg-blue-50"
        >
          <LogOutIcon className="w-5 h-5 mr-2 hidden sm:inline" />
          Logout
        </Button>
      </nav>
    </header>
  );
};

// --- Types & Mock Data (UNCHANGED) ---
interface TeacherDashboardProps {
  user: any;
  onLogout: () => void;
}

interface StudentProgress {
  id: string;
  name: string;
  score: number;
  totalQuestions: number;
  status: 'Completed' | 'In Progress';
}

interface ClassAnalytics {
  totalStudents: number;
  completionRate: number;
  averageScore: number;
  questionBreakdown: {
    concept: string;
    correct: number;
  }[];
}

const mockProgressData: StudentProgress[] = [
  { id: 'u123', name: 'Student One', score: 2, totalQuestions: 2, status: 'Completed' },
  { id: 'u456', name: 'Student Two', score: 1, totalQuestions: 2, status: 'Completed' },
  { id: 'u789', name: 'Student Three', score: 1, totalQuestions: 2, status: 'In Progress' },
];

const mockAnalyticsData: ClassAnalytics = {
  totalStudents: 3,
  completionRate: 66,
  averageScore: 1.33,
  questionBreakdown: [
    { concept: 'Pattern Purpose', correct: 2 },
    { concept: 'Notification Mechanism', correct: 1 },
  ],
};

// --- Teacher Dashboard Component ---
export function TeacherDashboard({ user, onLogout }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<'progress' | 'analytics'>('progress');
  const [isLoading, setIsLoading] = useState(true);
  const [progressData, setProgressData] = useState<StudentProgress[]>([]);
  const [analyticsData, setAnalyticsData] = useState<ClassAnalytics | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setProgressData(mockProgressData);
      setAnalyticsData(mockAnalyticsData);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <div className="p-8">Loading dashboard data...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* --- Sticky MenuBar (UNCHANGED) --- */}
      <div
        className="menubar-fix"
        style={{
          backgroundColor: '#fff',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <style>{`
          .menubar-fix header {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 1rem !important;
            padding: 12px 20px !important;
            min-height: 64px !important;
          }
          .menubar-fix header h1 { margin: 0 !important; display: flex !important; align-items: center !important; gap: 0.6rem !important; font-size: 1.375rem !important; }
          .menubar-fix header nav { margin-left: auto !important; display: flex !important; gap: 0.5rem !important; align-items: center !important; }
          .menubar-fix header nav button { padding: 8px 12px !important; border-radius: 8px !important; }
          @media (max-width: 640px) {
            .menubar-fix header { flex-direction: column !important; align-items: stretch !important; gap: 8px !important; padding: 10px !important; }
            .menubar-fix header nav { justify-content: flex-end !important; }
          }
        `}</style>

        <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
          <MenuBar onLogout={onLogout} />
        </div>
      </div>

      {/* --- CONTENT WRAPPER: SAME WIDTH & PADDING AS GRID --- */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        
        {/* --- Welcome Banner: SAME WIDTH AS GRID --- */}
        <div
          style={{
            backgroundColor: '#1c398e',
            color: 'white',
            borderRadius: 16,
            padding: 32,
            margin: '32px 0',
            boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
          }}
        >
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, textAlign: 'center' }}>
            Welcome Back to your Instructor Dashboard
          </h1>
          <p style={{ fontSize: 18, fontWeight: 400, opacity: 0.9, textAlign: 'center' }}>
            Track your students' progress and help them conquer new challenges!
          </p>
        </div>

        {/* --- Tab Buttons: ALIGNED WITH GRID LEFT EDGE --- */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setActiveTab('progress')}
            className={activeTab === 'progress' ? 'bg-orange-500 text-white' : 'text-gray-700'}
          >
            Student Progress
          </Button>
          <Button
            onClick={() => setActiveTab('analytics')}
            className={activeTab === 'analytics' ? 'bg-orange-500 text-white' : 'text-gray-700'}
          >
            Class Analytics
          </Button>
        </div>

        {/* --- Tab Content (UNCHANGED) --- */}
        <div className="pb-8">
          {activeTab === 'progress' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {progressData.map((student) => (
                <Card key={student.id}>
                  <CardHeader>
                    <CardTitle>{student.name}</CardTitle>
                    <span
                      className={`text-sm ${
                        student.status === 'Completed'
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {student.status}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Score: {student.score} / {student.totalQuestions}
                    </p>
                    <Progress
                      value={(student.score / student.totalQuestions) * 100}
                      className="mt-2"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'analytics' && analyticsData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader><CardTitle>Total Students</CardTitle></CardHeader>
                  <CardContent><p className="text-3xl font-bold">{analyticsData.totalStudents}</p></CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Completion Rate</CardTitle></CardHeader>
                  <CardContent><p className="text-3xl font-bold">{analyticsData.completionRate}%</p></CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Average Score</CardTitle></CardHeader>
                  <CardContent><p className="text-3xl font-bold">{analyticsData.averageScore.toFixed(2)}</p></CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader><CardTitle>Correct Answers by Concept</CardTitle></CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart
                        data={analyticsData.questionBreakdown}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="concept" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="correct" fill="#f97316" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}