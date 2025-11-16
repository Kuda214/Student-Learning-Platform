// TeacherDashboard.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Target,
  TrendingUp,
  BookOpen,
  Shield,
  LogOut,
  BarChart as BarChartIcon,
  Zap, 
  Brain
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

/* ------------------------------------------------------------------
   Palette (aligned with student dashboard)
-------------------------------------------------------------------*/
const palette = {
  primary: '#4F46E5',
  accent: '#ff8800',
  bg: '#F8FAFC',
  panel: '#FFFFFF',
  line: '#E2E8F0',
  text: '#334155',
  dim: '#64748B',
  success: '#10B981',
  warn: '#F59E0B',
  danger: '#F43F5E',
};

/* ------------------------------------------------------------------
   MenuBar (the one you asked for: same as we worked on, only logout)
-------------------------------------------------------------------*/
const MenuBar: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 20px', minHeight: 64 }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: 12, margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
        <Brain size={30} color={palette.primary} />
        Pattern Learning Platform
      </h1>

      <nav style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          onClick={() => onLogout?.()}
          style={{
            padding: '8px 12px',
            borderRadius: 10,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: '1px solid #e6eefc',
            cursor: 'pointer',
            color: palette.dim,
            fontWeight: 700
          }}
          title="Logout"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </nav>
    </header>
  );
};

/* ------------------------------------------------------------------
   Types & Mock Data
-------------------------------------------------------------------*/
type StudentProgress = {
  id: string;
  name: string;
  score: number;
  totalQuestions: number;
  status: 'Completed' | 'In Progress';
  lastAttempt: string;
  concepts: string[];
};

type Analytics = {
  totalStudents: number;
  completionRate: number;
  averageScore: number;
  questionBreakdown: { concept: string; correct: number }[];
  recentAssessments: {
    id: number;
    date: string;
    score: number;
    totalQuestions: number;
    conceptsCovered: string[];
    durationSec: number;
  }[];
};

const MOCK_STUDENTS: StudentProgress[] = [
  { id: '1', name: 'Alex Johnson', score: 8, totalQuestions: 10, status: 'Completed', lastAttempt: '2025-11-10', concepts: ['Push vs Pull', 'Observer Update'] },
  { id: '2', name: 'Maria Garcia', score: 6, totalQuestions: 10, status: 'Completed', lastAttempt: '2025-11-12', concepts: ['Decoupling', 'Subject Registration'] },
  { id: '3', name: 'James Lee', score: 4, totalQuestions: 10, status: 'In Progress', lastAttempt: '2025-11-14', concepts: ['Push vs Pull'] },
  { id: '4', name: 'Sarah Chen', score: 9, totalQuestions: 10, status: 'Completed', lastAttempt: '2025-11-09', concepts: ['Observer Update', 'Decoupling'] },
  { id: '5', name: 'David Kim', score: 5, totalQuestions: 10, status: 'In Progress', lastAttempt: '2025-11-13', concepts: ['Subject Registration'] },
];

const MOCK_ANALYTICS: Analytics = {
  totalStudents: MOCK_STUDENTS.length,
  completionRate: Math.round((MOCK_STUDENTS.filter(s => s.status === 'Completed').length / MOCK_STUDENTS.length) * 100),
  averageScore: Math.round((MOCK_STUDENTS.reduce((s, i) => s + i.score, 0) / (MOCK_STUDENTS.length * 10)) * 100),
  questionBreakdown: [
    { concept: 'Subject Registration', correct: 4 },
    { concept: 'Push vs Pull', correct: 2 },
    { concept: 'Observer Update', correct: 3 },
    { concept: 'Decoupling', correct: 5 },
  ],
  recentAssessments: [
    { id: 101, date: '2025-11-14', score: 78, totalQuestions: 10, conceptsCovered: ['Push vs Pull'], durationSec: 420 },
    { id: 102, date: '2025-11-12', score: 92, totalQuestions: 10, conceptsCovered: ['Decoupling'], durationSec: 360 },
    { id: 103, date: '2025-11-10', score: 64, totalQuestions: 10, conceptsCovered: ['Observer Update'], durationSec: 540 },
  ]
};

/* ------------------------------------------------------------------
   Small presentational helpers (use card components you already have)
-------------------------------------------------------------------*/
const StatTile: React.FC<{ label: string; value: string | number; icon?: React.ReactNode; color?: string }> = ({ label, value, icon, color = palette.text }) => (
  <Card className="rounded-xl">
    <CardHeader className="flex items-center justify-between pb-3">
      <div className="flex items-center gap-3">
        <div style={{ width: 44, height: 44, borderRadius: 10, background: '#FBFAFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 12, color: palette.dim, fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
        </div>
      </div>
    </CardHeader>
    <CardContent />
  </Card>
);

/* ------------------------------------------------------------------
   Main Teacher Dashboard
-------------------------------------------------------------------*/
interface TeacherDashboardProps {
  user?: { name?: string };
  onLogout?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, onLogout }) => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress'>('all');

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setStudents(MOCK_STUDENTS);
      setAnalytics(MOCK_ANALYTICS);
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return students;
    if (filter === 'completed') return students.filter(s => s.status === 'Completed');
    return students.filter(s => s.status === 'In Progress');
  }, [students, filter]);

  const avgScore = useMemo(() => {
    if (!students.length) return 0;
    return Math.round((students.reduce((a, b) => a + b.score, 0) / (students.length * students[0].totalQuestions)) * 100);
  }, [students]);

  if (loading || !analytics) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: palette.bg }}>
        <div style={{
          width: 56,
          height: 56,
          border: `6px solid ${palette.primary}`,
          borderTopColor: palette.accent,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg);} }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: palette.bg, padding: '0', fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
      {/* Sticky MenuBar: exactly as we worked on but only logout */}
      <div style={{ position: 'sticky', top: 0, zIndex: 60, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', borderBottom: '1px solid #EEF2FF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <MenuBar onLogout={onLogout} />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 40px' }}>
        {/* Header banner */}
        <motion.div initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'linear-gradient(90deg,#4F46E5,#5B54ED)', color: '#fff', padding: 12, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 22px rgba(79,70,229,0.16)' }}>
              <BarChartIcon size={22} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>Instructor Dashboard</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>{user?.name ? `Welcome, ${user.name}` : 'Welcome back'}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button title="Export class report" style={{ background: '#fff', border: '1px solid #E6E9F2', padding: '10px 12px', borderRadius: 10, display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
              <Shield size={16} /> Export
            </button>
          </div>
        </motion.div>

        {/* Top stats */}
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', marginBottom: 20 }}>
          <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 220 }}>
            <StatTile label="Total students" value={analytics.totalStudents} icon={<Users size={18} color={palette.primary} />} color={palette.primary} />
          </motion.div>
          <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 220 }}>
            <StatTile label="Avg class score" value={`${analytics.averageScore}%`} icon={<TrendingUp size={18} color={palette.success} />} color={palette.success} />
          </motion.div>
          <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 220 }}>
            <StatTile label="Completion rate" value={`${analytics.completionRate}%`} icon={<Target size={18} color={palette.warn} />} color={palette.warn} />
          </motion.div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 20 }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card className="rounded-xl">
              <CardHeader className="flex items-center justify-between pb-3">
                <CardTitle>Students</CardTitle>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 8, background: '#fff', borderRadius: 8, padding: 6 }}>
                    <button onClick={() => setFilter('all')} style={{ padding: '6px 10px', borderRadius: 8, background: filter === 'all' ? palette.primary : 'transparent', color: filter === 'all' ? '#fff' : palette.dim, fontWeight: 700 }}>All</button>
                    <button onClick={() => setFilter('completed')} style={{ padding: '6px 10px', borderRadius: 8, background: filter === 'completed' ? palette.primary : 'transparent', color: filter === 'completed' ? '#fff' : palette.dim, fontWeight: 700 }}>Completed</button>
                    <button onClick={() => setFilter('in-progress')} style={{ padding: '6px 10px', borderRadius: 8, background: filter === 'in-progress' ? palette.primary : 'transparent', color: filter === 'in-progress' ? '#fff' : palette.dim, fontWeight: 700 }}>In progress</button>
                  </div>
                  <button style={{ padding: 8, borderRadius: 8, background: '#FBFAFF', border: '1px solid #EEF2FF' }} title="Quick action"><Zap size={16} /></button>
                </div>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'grid', gap: 12 }}>
                  {filtered.map(s => (
                    <motion.div key={s.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: 12, background: '#fff', borderRadius: 12, border: `1px solid ${palette.line}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: palette.primary }}>
                            {s.name.split(' ').map(p => p[0]).slice(0,2).join('')}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: palette.text }}>{s.name}</div>
                            <div style={{ fontSize: 12, color: palette.dim }}>{s.concepts.join(' • ')} • last: {s.lastAttempt}</div>
                          </div>
                        </div>

                        <div style={{ width: 220 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <div style={{ fontSize: 12, color: palette.dim }}>Score</div>
                            <div style={{ fontSize: 12, fontWeight: 700 }}>{s.score}/{s.totalQuestions}</div>
                          </div>
                          <Progress value={(s.score / s.totalQuestions) * 100} className="h-2" />
                          <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
                            <button style={{ borderRadius: 8, padding: '6px 8px', background: '#fff', border: '1px solid #EEF2FF', fontSize: 12 }}>View</button>
                            <button style={{ borderRadius: 8, padding: '6px 8px', background: palette.primary, color: '#fff', fontSize: 12 }}>Message</button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {filtered.length === 0 && <div style={{ padding: 16, color: palette.dim }}>No students match this filter.</div>}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader className="flex items-center justify-between pb:3">
                <CardTitle>Recent Assessments</CardTitle>
                <div style={{ fontSize: 12, color: palette.dim }}>Latest activity</div>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'grid', gap: 10 }}>
                  {analytics.recentAssessments.map(a => {
                    const pass = a.score >= 70;
                    const mins = Math.floor(a.durationSec / 60);
                    const secs = a.durationSec % 60;
                    return (
                      <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: 10, borderRadius: 10, border: `1px solid ${palette.line}`, background: '#fff' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: palette.text }}>{a.date}</div>
                          <div style={{ fontSize: 12, color: palette.dim }}>{a.conceptsCovered.join(', ')}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: pass ? palette.success : palette.danger }}>{a.score}%</div>
                          <div style={{ fontSize: 12, color: palette.dim }}>{mins}:{secs.toString().padStart(2,'0')}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card className="rounded-xl">
              <CardHeader className="flex items-center justify-between pb-3">
                <CardTitle>Concept Mastery</CardTitle>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ fontSize: 12, color: palette.dim }}>{analytics.questionBreakdown.length} topics</div>
                  <div style={{ fontSize: 12, color: palette.dim, background: '#fff', padding: '6px 8px', borderRadius: 8 }}>Out of {analytics.totalStudents}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.questionBreakdown} margin={{ top: 12, right: 8, left: 0, bottom: 38 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={palette.line} />
                      <XAxis dataKey="concept" angle={-45} textAnchor="end" interval={0} height={54} tick={{ fontSize: 12, fill: palette.dim }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: palette.dim }} />
                      <Tooltip wrapperStyle={{ borderRadius: 8 }} />
                      <Legend />
                      <Bar dataKey="correct" fill={palette.accent} radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader className="flex items-center justify-between pb-3">
                <CardTitle>Quick Class Actions</CardTitle>
                <div style={{ fontSize: 12, color: palette.dim }}>One-click tools</div>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button style={{ flex: '1 1 150px', padding: '12px 14px', borderRadius: 12, border: 'none', background: palette.primary, color: '#fff', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    <BookOpen size={16} /> Create Assessment
                  </button>
                  <button style={{ flex: '1 1 150px', padding: '12px 14px', borderRadius: 12, border: '1px solid #EEF2FF', background: '#fff', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    <Shield size={16} /> Export Report
                  </button>
                  <button style={{ flex: '1 1 150px', padding: '12px 14px', borderRadius: 12, border: '1px dashed #E6E9F2', background: '#fff', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    <Zap size={16} /> Send Reminder
                  </button>
                </div>
              </CardContent>
            </Card>

            <div style={{ display: 'flex', gap: 12 }}>
              <Card className="rounded-xl" style={{ flex: 1 }}>
                <CardHeader className="pb-3"><CardTitle>Class Snapshot</CardTitle></CardHeader>
                <CardContent>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                    <div style={{ background: '#FBFAFF', padding: 10, borderRadius: 8, border: `1px solid ${palette.line}` }}>
                      <div style={{ fontSize: 12, color: palette.dim }}>Students</div>
                      <div style={{ fontSize: 20, fontWeight: 800 }}>{analytics.totalStudents}</div>
                    </div>
                    <div style={{ background: '#FBFAFF', padding: 10, borderRadius: 8, border: `1px solid ${palette.line}` }}>
                      <div style={{ fontSize: 12, color: palette.dim }}>Avg Score</div>
                      <div style={{ fontSize: 20, fontWeight: 800 }}>{analytics.averageScore}%</div>
                    </div>
                    <div style={{ background: '#FBFAFF', padding: 10, borderRadius: 8, border: `1px solid ${palette.line}` }}>
                      <div style={{ fontSize: 12, color: palette.dim }}>Completion</div>
                      <div style={{ fontSize: 20, fontWeight: 800 }}>{analytics.completionRate}%</div>
                    </div>
                    <div style={{ background: '#FBFAFF', padding: 10, borderRadius: 8, border: `1px solid ${palette.line}` }}>
                      <div style={{ fontSize: 12, color: palette.dim }}>Class avg</div>
                      <div style={{ fontSize: 20, fontWeight: 800 }}>{avgScore}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl" style={{ width: 240 }}>
                <CardHeader className="pb-3"><CardTitle>Notifications</CardTitle></CardHeader>
                <CardContent>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ padding: 10, borderRadius: 8, background: '#fff', border: `1px solid ${palette.line}` }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>3 students need help</div>
                      <div style={{ fontSize: 12, color: palette.dim }}>Low scores or incomplete assessments</div>
                    </div>
                    <div style={{ padding: 10, borderRadius: 8, background: '#fff', border: `1px solid ${palette.line}` }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>New question flagged</div>
                      <div style={{ fontSize: 12, color: palette.dim }}>Review flagged item in question bank</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <footer style={{ marginTop: 36, textAlign: 'center', color: palette.dim, fontSize: 12 }}>
          © {new Date().getFullYear()} Your Institution — Instructor tools
        </footer>
      </div>
    </div>
  );
};

export default TeacherDashboard;
