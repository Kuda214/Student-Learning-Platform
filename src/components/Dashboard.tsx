import React, { useEffect, useState, useMemo } from 'react';
import {
  TrendingUp, Target, Brain, Flame, Share2, BookOpen, Zap, Award,
  ArrowUpRight, Shield, GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------
   Palette
------------------------------------------------------------------- */
const palette = {
  primary: '#4F46E5',
  primaryDark: '#4338CA',
  bg: '#F8FAFC',
  panel: '#FFFFFF',
  line: '#E2E8F0',
  textDim: '#64748B',
  text: '#334155',
  success: '#10B981',
  warn: '#F59E0B',
  danger: '#F43F5E',
  accent: '#ff8800ff'
};

/* ------------------------------------------------------------------
   Types
------------------------------------------------------------------- */
type DashboardStats = {
  avgScore: number;
  totalAssessments: number;
  latestBadge: string | null;
  xp: number;
  level: number;
  xpForNext: number;
  streakDays: number;
  nextBadgeHint: string;
  scoreDistribution: { label: string; value: number; color: string }[];
};

type AssessmentHistoryItem = {
  id: number;
  date: string;
  score: number;
  totalQuestions: number;
  conceptsCovered: string[];
  durationSec: number;
};

type BadgeProgress = {
  id: string;
  name: string;
  earned: boolean;
  icon: string;
  color: string;
  description: string;
  progressPct: number;
};

interface User {
  username: string;
  role?: string;
}
/* ------------------------------------------------------------------
   Mock Fetchers (swap with real API)
------------------------------------------------------------------- */
const mockFetchDashboardStats = async (): Promise<DashboardStats> => {
  await new Promise(r => setTimeout(r, 250));
  return {
    avgScore: 85,
    totalAssessments: 7,
    latestBadge: 'consistency_bronze',
    xp: 1420,
    level: 5,
    xpForNext: 1600,
    streakDays: 4,
    nextBadgeHint: 'Score ≥ 90% twice for Consistency Silver',
    scoreDistribution: [
      { label: 'Creational', value: 22, color: '#6366F1' },
      { label: 'Structural', value: 18, color: '#0EA5E9' },
      { label: 'Behavioral', value: 14, color: '#10B981' },
      { label: 'Concurrency', value: 9, color: '#F59E0B' },
      { label: 'Testing', value: 11, color: '#F43F5E' }
    ]
  };
};
const mockFetchAssessmentHistory = async (): Promise<AssessmentHistoryItem[]> => {
  await new Promise(r => setTimeout(r, 300));
  return [
    { id: 1, date: '2024-10-25', score: 80, totalQuestions: 10, conceptsCovered: ['Creational', 'Structural'], durationSec: 515 },
    { id: 2, date: '2024-10-28', score: 90, totalQuestions: 10, conceptsCovered: ['Behavioral', 'Concurrency'], durationSec: 432 },
    { id: 3, date: '2024-11-04', score: 65, totalQuestions: 10, conceptsCovered: ['Design Principles', 'Testing'], durationSec: 661 },
    { id: 4, date: '2024-11-07', score: 88, totalQuestions: 10, conceptsCovered: ['Creational', 'Design Principles'], durationSec: 498 },
    { id: 5, date: '2024-11-10', score: 92, totalQuestions: 12, conceptsCovered: ['Behavioral', 'Structural'], durationSec: 723 },
    { id: 6, date: '2024-11-13', score: 84, totalQuestions: 10, conceptsCovered: ['Testing', 'Concurrency'], durationSec: 602 },
    { id: 7, date: '2024-11-14', score: 87, totalQuestions: 10, conceptsCovered: ['Creational', 'Behavioral'], durationSec: 577 }
  ];
};
const mockFetchBadgeProgress = async (): Promise<BadgeProgress[]> => {
  await new Promise(r => setTimeout(r, 200));
  return [
    { id: 'pattern_initiate', name: 'Pattern Initiate', earned: true, icon: '🌱', color: '#10B981', description: 'First assessment completed', progressPct: 100 },
    { id: 'pattern_explorer', name: 'Pattern Explorer', earned: true, icon: '🧭', color: '#0EA5E9', description: '3 categories explored', progressPct: 100 },
    { id: 'consistency_bronze', name: 'Consistency Bronze', earned: true, icon: '🥉', color: '#F59E0B', description: 'Avg ≥ 70% last 3', progressPct: 100 },
    { id: 'consistency_silver', name: 'Consistency Silver', earned: false, icon: '🥈', color: '#94A3B8', description: 'Avg ≥ 80% last 5', progressPct: 70 },
    { id: 'consistency_gold', name: 'Consistency Gold', earned: false, icon: '🥇', color: '#FBBF24', description: 'Avg ≥ 90% last 5', progressPct: 40 },
    { id: 'bounce_back', name: 'Bounce Back', earned: true, icon: '⬆️', color: '#10B981', description: 'Recovered after low score', progressPct: 100 },
    { id: 'rapid_growth', name: 'Rapid Growth', earned: false, icon: '⚡', color: '#F43F5E', description: '≥ +15 pts improvement', progressPct: 50 }
  ];
};

/* ------------------------------------------------------------------
   Reusable Components
------------------------------------------------------------------- */
const Panel: React.FC<React.PropsWithChildren<{ style?: React.CSSProperties }>> = ({ children, style }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    style={{
      background: palette.panel,
      border: `1px solid ${palette.line}`,
      borderRadius: 16,
      padding: 18,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      ...style
    }}
  >
    {children}
  </motion.div>
);

const StatTile: React.FC<{
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}> = ({ label, value, icon, color = palette.text }) => (
  <Panel style={{ padding: 14 }}>
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {icon && (
        <div style={{
          width: 38, height: 38, borderRadius: 10, background: palette.bg,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          {icon}
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: palette.textDim, letterSpacing: 0.4, textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
      </div>
    </div>
  </Panel>
);

const ActionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, style, ...rest }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    style={{
      background: palette.primary,
      color: '#FFFFFF',
      border: 'none',
      borderRadius: 12,
      padding: '10px 20px',
      fontWeight: 600,
      fontSize: 14,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      ...style
    }}
    {...rest}
  >
    {children}
  </motion.button>
);

const AnimatedPie: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  return (
    <svg width={220} height={220} viewBox="0 0 220 220">
      {data.map((slice, i) => {
        const startAngle = (cumulative / total) * 2 * Math.PI;
        cumulative += slice.value;
        const endAngle = (cumulative / total) * 2 * Math.PI;
        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
        const R = 95;
        const cx = 110;
        const cy = 110;
        const x1 = cx + R * Math.cos(startAngle);
        const y1 = cy + R * Math.sin(startAngle);
        const x2 = cx + R * Math.cos(endAngle);
        const y2 = cy + R * Math.sin(endAngle);
        const d = `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        return (
          <motion.path
            key={slice.label}
            d={d}
            fill={slice.color}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
          />
        );
      })}
      <circle cx={110} cy={110} r={55} fill={palette.panel} />
      <text x={110} y={106} textAnchor="middle" style={{ fontSize: 16, fontWeight: 600, fill: palette.text }}>Topics</text>
      <text x={110} y={124} textAnchor="middle" style={{ fontSize: 11, fill: palette.textDim }}>Coverage</text>
    </svg>
  );
};

const RadialStat: React.FC<{ pct: number; center: string; label: string }> = ({ pct, center, label }) => {
  const r = 46;
  const stroke = 8;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div style={{ width: 120, height: 120, position: 'relative' }}>
      <svg width={120} height={120}>
        <circle cx={60} cy={60} r={r} stroke={palette.line} strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={60}
          cy={60}
          r={r}
          stroke={palette.primary}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${c}` }}
          animate={{ strokeDasharray: `${dash} ${c - dash}` }}
          transition={{ duration: 1 }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: palette.text }}>{center}</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: palette.textDim, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
};

const BadgeRail: React.FC<{ badges: BadgeProgress[]; coloredCount?: number }> = ({ badges, coloredCount = 3 }) => (
  <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
    {badges.map((b, i) => {
      const colored = i < coloredCount;
      return (
        <div
          key={b.id}
          style={{
            minWidth: 140,
            background: colored ? '#FFFFFF' : '#F1F5F9',
            border: `1px solid ${colored ? b.color : '#CBD5E1'}`,
            borderRadius: 12,
            padding: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}
          title={b.description}
        >
          <div style={{ fontSize: 22, filter: colored ? 'none' : 'grayscale(1) opacity(.7)' }}>{b.icon}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: colored ? palette.text : '#94A3B8' }}>{b.name}</div>
          {colored ? (
            <div style={{ height: 5, background: '#E2E8F0', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: b.color }} />
            </div>
          ) : (
            <>
              <div style={{ height: 5, background: '#E2E8F0', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ width: '0%', height: '100%', background: b.color }} />
              </div>
              <div style={{ fontSize: 10, color: '#94A3B8' }}>Locked</div>
            </>
          )}
        </div>
      );
    })}
  </div>
);

/* ------------------------------------------------------------------
   Main Component
------------------------------------------------------------------- */
export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [history, setHistory] = useState<AssessmentHistoryItem[]>([]);
  const [badges, setBadges] = useState<BadgeProgress[]>([]);
  const [loading, setLoading] = useState(true);
const [localUser, setLocalUser] = useState<User | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const [s, h, b] = await Promise.all([
        mockFetchDashboardStats(),
        mockFetchAssessmentHistory(),
        mockFetchBadgeProgress()
      ]);
      if (!active) return;
      setStats(s);
      setHistory(h);
      setBadges(b);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const avgLast5 = useMemo(() => {
    const slice = history.slice(0, 5);
    return slice.length ? Math.round(slice.reduce((sum, a) => sum + a.score, 0) / slice.length) : 0;
  }, [history]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: palette.bg
      }}>
        <div style={{
          width: 52, height: 52,
          border: `6px solid ${palette.primary}`,
          borderTopColor: palette.accent,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg);} }`}</style>
      </div>
    );
  }

  if (!stats) return null;

  const xpPct = Math.min(100, (stats.xp / stats.xpForNext) * 100);

  return (
    <div style={{
      background: palette.bg,
      minHeight: '100vh',
      padding: '28px 24px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Momentum Heading Banner (replaces generic 'Learning Dashboard') */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: 'linear-gradient(90deg,#4F46E5,#5B54ED)',
          borderRadius: 16,
          padding: '20px 26px',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          boxShadow: '0 4px 14px rgba(79,70,229,0.25)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: '70%'}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <GraduationCap size={28} />
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Hi Kuda!</h1>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Keep Momentum!</h1>
          </div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>
            Complete an assessment today to push your streak to <strong>{stats.streakDays + 1} days</strong> and gain XP toward Level <strong>{stats.level + 1}</strong>.
          </p>
        </div>
        <ActionButton
          style={{
            background: palette.success,
            color: '#fff',
            padding: '10px 20px',
            boxShadow: '0 3px 10px rgba(16,185,129,0.4)'
          }}
        >
          <ArrowUpRight size={16} /> Go
        </ActionButton>
      </motion.div>

      {/* Badges */}
      <Panel style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: palette.text }}>Badges</h3>
          <div style={{ fontSize: 12, color: palette.textDim }}>
            Next Goal: <strong>{stats.nextBadgeHint}</strong>
          </div>
        </div>
        <BadgeRail badges={badges} coloredCount={3} />
      </Panel>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))',
        marginBottom: 24
      }}>
        <StatTile label="Avg Score" value={`${stats.avgScore}%`} icon={<TrendingUp size={20} color={palette.primary} />} color={palette.success} />
        <StatTile label="Assessments Attempts" value={stats.totalAssessments} icon={<Target size={20} color={palette.primary} />} color={palette.primary} />
        <StatTile label="Level" value={stats.level} icon={<Brain size={20} color={palette.primary} />} color={palette.primary} />
        <StatTile label="Streak" value={`${stats.streakDays}d`} icon={<Flame size={20} color={palette.warn} />} color={palette.warn} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px,360px) 1fr', gap: 24 }}>
        {/* LEFT Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Panel>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: palette.text }}>Topic Coverage</h3>
              <Zap size={18} color={palette.accent} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <AnimatedPie data={stats.scoreDistribution} />
            </div>
            <div style={{ display: 'grid', gap: 6, gridTemplateColumns: 'repeat(2,minmax(0,1fr))', fontSize: 12 }}>
              {stats.scoreDistribution.map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 12, background: d.color, borderRadius: 3 }} />
                  <span style={{ fontWeight: 600, color: palette.text }}>{d.label}</span>
                  <span style={{ color: palette.textDim }}>({d.value})</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: palette.text, marginBottom: 12 }}>Level Progress</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <RadialStat pct={xpPct} center={`${stats.xp}/${stats.xpForNext}`} label="XP" />
              <div style={{ flex: 1 }}>
                <div style={{
                  height: 10, background: '#E5E7EB', borderRadius: 6, overflow: 'hidden', marginBottom: 6
                }}>
                  <div style={{
                    width: `${xpPct}%`,
                    background: palette.primary,
                    height: '100%',
                    transition: 'width .8s ease'
                  }} />
                </div>
                <div style={{ fontSize: 12, color: palette.textDim }}>
                  {Math.round(xpPct)}% toward Level {stats.level + 1}
                </div>
                <div style={{
                  marginTop: 8,
                  background: '#F1F5F9',
                  padding: '6px 8px',
                  borderRadius: 8,
                  fontSize: 12,
                  color: palette.textDim
                }}>
                  Earn XP via assessments, improvements & streak continuity.
                </div>
                <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                  <ActionButton  style={{ background: palette.success }}>
                    <BookOpen size={16} /> Assess
                  </ActionButton>
                  <ActionButton  style={{ background: palette.warn }}>
                    <Share2 size={16} /> Share
                  </ActionButton>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* RIGHT Column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Panel style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: palette.text }}>Recent Assessments</h3>
              <ActionButton style={{ background: palette.accent }}>
                <Shield size={16} /> Report
              </ActionButton>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${palette.line}`, textAlign: 'left' }}>
                  <th style={{ padding: '6px 4px', fontWeight: 600, color: palette.textDim }}>Date</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600, color: palette.textDim }}>Score</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600, color: palette.textDim }}>Questions</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600, color: palette.textDim }}>Concepts</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600, color: palette.textDim }}>Time</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {history.map(item => {
                  const pass = item.score >= 70;
                  const minutes = Math.floor(item.durationSec / 60);
                  const seconds = item.durationSec % 60;
                  return (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${palette.line}` }}>
                      <td style={{ padding: '6px 4px' }}>{item.date}</td>
                      <td style={{
                        padding: '6px 4px',
                        fontWeight: 600,
                        color: pass ? palette.success : palette.danger
                      }}>{item.score}%</td>
                      <td style={{ padding: '6px 4px' }}>{item.totalQuestions}</td>
                      <td style={{ padding: '6px 4px' }}>{item.conceptsCovered.join(', ')}</td>
                      <td style={{ padding: '6px 4px', color: palette.textDim }}>{minutes}:{seconds.toString().padStart(2, '0')}</td>
                      <td style={{ padding: '6px 4px' }}>
                        <button
                          style={{
                            background: '#E5E7EB',
                            border: 'none',
                            padding: '4px 8px',
                            fontSize: 11,
                            fontWeight: 600,
                            borderRadius: 6,
                            cursor: 'pointer'
                          }}
                         
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {history.length === 0 && <p style={{ textAlign: 'center', padding: 12, color: palette.textDim }}>No assessments yet.</p>}
            <div style={{ marginTop: 10, fontSize: 12, color: palette.textDim }}>
              Avg (Last 5): <strong>{avgLast5}%</strong>
            </div>
          </Panel>
        </div>
      </div>

      <footer style={{ marginTop: 40, textAlign: 'center', fontSize: 11, color: palette.textDim }}>
        © 2024 Ligame. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;