import React, { useEffect, useState, useCallback } from 'react';
import {
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Download,
  Brain,
  Target,
  Award,
  TrendingUp,
  Code as CodeIcon,
  Image as ImageIcon,
  Volume2,
  Play,
  Pause
} from 'lucide-react';
import { motion } from 'framer-motion';
import './AssessmentStart.css';
import { DragAndDropQuestion } from './ui/DragAndDropQuestion';

/* ------------------------------------------------------------------
   Types from Edge Function
------------------------------------------------------------------- */
type QuestionOption = {
  id: number;
  text: string;
  is_correct?: boolean;
};

const CATEGORIES = ['Tightly Coupled', 'Loosely Coupled'] as const;

type ObserverQuestion = {
  id: number;
  type: 'multiple_choice' | 'fill_in_blank' | 'code' | 'multi_select_issue' | 'concept' | 'drag_drop';
  text: string;
  image_url: string | null;
  audio_url: string | null;
  code_snippet: string | null;
  learning_objectives: string[];
  options: QuestionOption[];
  correct_answer: string | number | number[] | null; // for drag_drop, correct_answer = number[] (index order)
  created_at: string;
};


type UserAnswer =
  | { type: 'multiple_choice'; selectedIndex: number | null }
  | { type: 'fill_in_blank'; text: string }
  | { type: 'code'; text: string }
  | { type: 'multi_select_issue'; selectedIndices: number[] }
  | { type: 'concept'; selectedIndex: number | null }
  | { type: 'drag_drop'; categories: Record<'source' | 'Tightly Coupled' | 'Loosely Coupled', number[]> };



/* ------------------------------------------------------------------
   Helper Functions (Outside Component Scope)
------------------------------------------------------------------- */
function escapeHTML(str: string) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatUserAnswer(q: ObserverQuestion, ua: UserAnswer | undefined): string {
  if (!ua) return 'Not answered';
  switch (q.type) {
    case 'multiple_choice':
    case 'concept':
      return ua.selectedIndex !== null ? q.options[ua.selectedIndex]?.text || '' : 'Not answered';
    case 'fill_in_blank':
    case 'drag_drop': {
      if (!('categories' in ua)) return 'Not answered';
      const cats = ua.categories;
      const formatCat = (cat: string) =>
        (cats[cat] || [])
          .map(id => {
            const opt = q.options.find(o => o.id === id);
            return opt ? `• ${escapeHTML(opt.text)}` : '';
          })
          .join('<br>') || '<em>None</em>';

      return `
        <strong>Tightly Coupled:</strong><br>${formatCat('Tightly Coupled')}<br><br>
        <strong>Loosely Coupled:</strong><br>${formatCat('Loosely Coupled')}
      `.trim();
    }
    case 'code':
      return ua.text || 'Not answered';
    case 'multi_select_issue':
      return ua.selectedIndices.length
        ? ua.selectedIndices.map(i => q.options[i].text).join(', ')
        : 'Not answered';
  }
}

function formatCorrectAnswer(q: ObserverQuestion): string {
  if (q.correct_answer === null || q.correct_answer === undefined) return 'N/A';
  if (typeof q.correct_answer === 'string') return q.correct_answer;
  if (typeof q.correct_answer === 'number') return q.options[q.correct_answer]?.text || '';
  if (q.type === 'drag_drop' && Array.isArray(q.correct_answer)) {
    const map: Record<string, number[]> = {};
    q.correct_answer.forEach((item: any) => {
      map[item.category] = item.indices;
    });

    const formatCat = (cat: string) =>
      (map[cat] || [])
        .map(i => {
          const opt = q.options[i];
          return opt ? `• ${escapeHTML(opt.text)}` : '';
        })
        .join('<br>') || '<em>None</em>';

    return `
      <strong>Tightly Coupled:</strong><br>${formatCat('Tightly Coupled')}<br><br>
      <strong>Loosely Coupled:</strong><br>${formatCat('Loosely Coupled')}
    `.trim();
  }
  if (Array.isArray(q.correct_answer)) {
    return q.correct_answer.map((i: number) => q.options[i]?.text || '').join(', ');
  }
  return '';
}

function isQuestionCorrect(q: ObserverQuestion, ua: UserAnswer | undefined): boolean {
  if (q.correct_answer === null || q.correct_answer === undefined || !ua) return false;
  switch (q.type) {
    case 'multiple_choice':
    case 'concept':
      return 'selectedIndex' in ua && ua.selectedIndex === q.correct_answer;
    case 'fill_in_blank':
    case 'code':
      return 'text' in ua && typeof q.correct_answer === 'string' &&
        ua.text.trim().toLowerCase() === (q.correct_answer as string).trim().toLowerCase();
    case 'multi_select_issue': {
      if (!('selectedIndices' in ua) || !Array.isArray(q.correct_answer)) return false;
      const userSet = new Set(ua.selectedIndices);
      const correctSet = new Set(q.correct_answer as number[]);
      return userSet.size === correctSet.size && [...correctSet].every(idx => userSet.has(idx));
    }
    
    case 'drag_drop': {
      if (!('categories' in ua) || !Array.isArray(q.correct_answer)) return false;

      const userCats = ua.categories;
      const correctMap = q.correct_answer.reduce((acc: any, item: any) => {
        acc[item.category] = item.indices;
        return acc;
      }, {} as Record<string, number[]>);

      return CATEGORIES.every(cat => {
        const user = (userCats[cat] || []).sort((a: number, b: number) => a - b);
        const correct = (correctMap[cat] || []).sort((a: number, b: number) => a - b);
        return user.length === correct.length && user.every((v, i) => v === correct[i]);
      });
    }

  }
  return false;
}

function performanceMessageText(pct: number) {
  if (pct >= 80) return 'Excellent mastery of Observer Pattern core mechanics! 🎉';
  if (pct >= 50) return 'Solid foundations. Review push vs pull & participant roles to improve.';
  return 'Focus on Subject <-> Observer relationships and notification flow. Revisit fundamentals.';
}

function buildStudyBlocks(all: ObserverQuestion[], answers: Record<number, UserAnswer>, pct: number) {
  const incorrectConcepts: Set<string> = new Set();
  all.forEach(q => {
    const ua = answers[q.id];
    if (!isQuestionCorrect(q, ua)) {
      q.learning_objectives.forEach(obj => incorrectConcepts.add(obj));
    }
  });

  const baseVideos = [
    { title: 'Refactoring Guru: Observer Pattern', url: 'https://refactoring.guru/design-patterns/observer' },
    { title: 'Observer Pattern - JavaScript Example (YouTube)', url: 'https://www.youtube.com/watch?v=YwP_bm5Qhxw' },
    { title: 'Push vs Pull Models Explained (YouTube)', url: 'https://www.youtube.com/watch?v=H-9MfHqQ3YI' },
    { title: 'Design Patterns in C++ - Observer (YouTube)', url: 'https://www.youtube.com/watch?v=_BpmfnqjgzQ' }
  ];

  const advancedVideos = [
    { title: 'Event Aggregator vs Observer', url: 'https://www.youtube.com/watch?v=3t3JHswP7Gs' },
    { title: 'Reactive Streams Concepts', url: 'https://www.youtube.com/watch?v=8fenTR3NXn4' }
  ];

  const recommendation =
    pct >= 80
      ? 'Explore event-driven architectures and compare Observer with Pub/Sub & Mediator.'
      : pct >= 50
        ? 'Reinforce fundamentals: identify Subject, Observer interface, Concrete Observers. Practice dynamic attach/detach.'
        : 'Start with a simple implementation: a Subject holding an array of observers & a notify loop. Build from there before advanced variants.';

  const list = (items: { title: string; url: string }[]) =>
    `<ul>${items.map(v => `<li><a href="${v.url}" target="_blank" rel="noopener">${escapeHTML(v.title)}</a></li>`).join('')}</ul>`;

  const objectivesHTML = incorrectConcepts.size
    ? `<div class="sub">
        <h3>Focus Areas (based on missed items):</h3>
        <ul>${[...incorrectConcepts].map(c => `<li>${escapeHTML(c)}</li>`).join('')}</ul>
      </div>`
    : '<p>You answered all learning objectives correctly. Consider exploring related patterns for deeper mastery.</p>';

  return `<div class="section resources">
    <h2>Study Resources & Next Steps</h2>
    <p>${recommendation}</p>
    ${objectivesHTML}
    <h3>Core Resources:</h3>
    ${list(baseVideos)}
    ${pct >= 80 ? `<h3>Advanced Exploration:</h3>${list(advancedVideos)}` : ''}
    <h3>Practice Ideas:</h3>
    <ul>
      <li>Implement a news feed Subject with dynamic Observer subscription.</li>
      <li>Convert push model to pull model and measure payload reduction.</li>
      <li>Refactor an existing event listener code base to showcase Observer participants explicitly.</li>
    </ul>
  </div>`;
}

const getFocusAreas = (qs: ObserverQuestion[], ans: Record<number, UserAnswer>) => {
  const map = new Map<string, number>();
  qs.forEach(q => {
    if (!isQuestionCorrect(q, ans[q.id])) {
      q.learning_objectives.forEach(o => map.set(o, (map.get(o) ?? 0) + 1));
    }
  });
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([o, c]) => `${o} <em>(missed ${c} time${c > 1 ? 's' : ''})</em>`);
};

/* ------------------------------------------------------------------
   UI Stubs
------------------------------------------------------------------- */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }
const Card: React.FC<CardProps> = ({ children, className = '', ...rest }) => (
  <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`} {...rest}>
    {children}
  </div>
);
const CardHeader: React.FC<CardProps> = ({ children, className = '', ...rest }) => (
  <div className={`p-5 border-b border-slate-100 ${className}`} {...rest}>{children}</div>
);
const CardContent: React.FC<CardProps> = ({ children, className = '', ...rest }) => (
  <div className={`p-5 ${className}`} {...rest}>{children}</div>
);
const CardTitle: React.FC<CardProps> = ({ children, className = '', ...rest }) => (
  <h3 className={`font-semibold text-lg ${className}`} {...rest}>{children}</h3>
);
const CardDescription: React.FC<CardProps> = ({ children, className = '', ...rest }) => (
  <p className={`text-sm text-slate-500 ${className}`} {...rest}>{children}</p>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}
const Button: React.FC<ButtonProps> = ({
  children, className = '', variant = 'default', size = 'md', ...rest
}) => {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes: Record<string, string> = { sm: 'text-xs px-2 py-1', md: 'text-sm px-4 py-2', lg: 'text-base px-6 py-3' };
  const variants: Record<string, string> = {
    default: 'bg-orange-500 hover:bg-orange-600 text-white shadow',
    outline: 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50',
    ghost: 'text-slate-600 hover:bg-slate-100'
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
};

const Progress: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => (
  <div className={`h-3 w-full bg-slate-200 rounded-full overflow-hidden ${className}`}>
    <div className="h-full bg-orange-500 transition-all" style={{ width: `${value}%` }} />
  </div>
);

/* ------------------------------------------------------------------
   Assessment Component
------------------------------------------------------------------- */
interface AssessmentProps {
  username: string;
}

export const Assessment: React.FC<AssessmentProps> = ({ username }) => {
  const [started, setStarted] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [grading, setGrading] = useState(false);
  const [questions, setQuestions] = useState<ObserverQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, UserAnswer>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [timeStarted, setTimeStarted] = useState<number | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [audioPlayingId, setAudioPlayingId] = useState<number | null>(null);
  const [questionAdvice, setQuestionAdvice] = useState<Record<number, string>>({});

  const fetchQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    setFetchError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/list_observer_questions-ts`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );
      if (!res.ok) throw new Error(`Failed to load questions (${res.status})`);
      const data = await res.json();
      const loaded: ObserverQuestion[] = data.questions;
      setQuestions(loaded);
      const init: Record<number, UserAnswer> = {};
      loaded.forEach(q => {
        switch (q.type) {
          case 'multiple_choice':
          case 'concept':
            init[q.id] = { type: q.type, selectedIndex: null };
            break;
          case 'fill_in_blank':
          case 'code':
            init[q.id] = { type: q.type, text: '' };
            break;
          case 'multi_select_issue':
            init[q.id] = { type: q.type, selectedIndices: [] };
            break;
          case 'drag_drop':
          init[q.id] = {
            type: 'drag_drop',
            categories: {
              source: q.options.map(o => o.id),
              'Tightly Coupled': [],
              'Loosely Coupled': []
            }
          };
          break;

        }
      });
      setUserAnswers(init);
    } catch (e: any) {
      setFetchError(e.message);
    } finally {
      setLoadingQuestions(false);
    }
  }, []);

  const handleStart = async () => {
    setStarted(true);
    setTimeStarted(Date.now());
    await fetchQuestions();
  };

  const updateAnswer = (question: ObserverQuestion, payload: Partial<UserAnswer>) => {
    setUserAnswers(prev => ({ ...prev, [question.id]: { ...prev[question.id], ...payload } as UserAnswer }));
  };

  const toggleMulti = (question: ObserverQuestion, idx: number) => {
    setUserAnswers(prev => {
      const existing = prev[question.id] as { type: 'multi_select_issue'; selectedIndices: number[] };
      const set = new Set(existing.selectedIndices);
      set.has(idx) ? set.delete(idx) : set.add(idx);
      return { ...prev, [question.id]: { type: 'multi_select_issue', selectedIndices: [...set] } };
    });
  };

  const handleSubmitAssessment = () => {
    setGrading(true);

    try {
      let correctCount = 0;
      const adviceMap: Record<number, string> = {};

      questions.forEach(q => {
        const ua = userAnswers[q.id];
        let isCorrect = false;

        if (q.correct_answer === null || q.correct_answer === undefined) {
          adviceMap[q.id] = 'Correct answer not available — this question could not be automatically graded.';
          return;
        }

        if (q.type === 'multiple_choice' || q.type === 'concept') {
          if (ua && 'selectedIndex' in ua && typeof ua.selectedIndex === 'number') {
            isCorrect = ua.selectedIndex === q.correct_answer;
            adviceMap[q.id] = isCorrect
              ? 'Great job! Your answer was correct.'
              : `Incorrect. Correct answer: ${q.options[q.correct_answer as number]?.text || ''}`;
          } else {
            adviceMap[q.id] = 'No answer provided.';
          }
        } else if (q.type === 'fill_in_blank' || q.type === 'code') {
          if (ua && 'text' in ua && typeof q.correct_answer === 'string') {
            isCorrect = ua.text.trim().toLowerCase() === (q.correct_answer as string).trim().toLowerCase();
            adviceMap[q.id] = isCorrect
              ? 'Correct! Good understanding of the core concept.'
              : `Incorrect. Expected: "${q.correct_answer}"`;
          } else {
            adviceMap[q.id] = 'No answer provided.';
          }
        } else if (q.type === 'multi_select_issue') {
          if (ua && 'selectedIndices' in ua && Array.isArray(q.correct_answer)) {
            const userSet = new Set(ua.selectedIndices);
            const correctSet = new Set(q.correct_answer as number[]);
            isCorrect =
              userSet.size === correctSet.size &&
              [...correctSet].every(idx => userSet.has(idx));
            adviceMap[q.id] = isCorrect
              ? 'Perfect selection!'
              : `Mismatch. Correct selections: ${(q.correct_answer as number[])
                .map((i: number) => q.options[i]?.text || '')
                .join(', ')}`;
          } else {
            adviceMap[q.id] = 'No answer provided.';
          }
        } else {
          adviceMap[q.id] = 'Cannot auto-grade this item (unsupported type).';
        }

        if (isCorrect) correctCount++;
      });

      const total = questions.length;
      const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
      const elapsed = timeStarted
        ? Math.floor((Date.now() - timeStarted) / 1000)
        : 0;
      setScore(correctCount);
      setPercentage(pct);
      setTimeSpent(elapsed);
      setQuestionAdvice(adviceMap);
      setShowSummary(true);
    } catch (e: any) {
    } finally {
      setGrading(false);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setQuestions([]);
    setUserAnswers({});
    setCurrentIndex(0);
    setShowSummary(false);
    setScore(0);
    setPercentage(0);
    setTimeSpent(0);
    setTimeStarted(null);
    setAudioPlayingId(null);
    setFetchError(null);
    setQuestionAdvice({});
  };

  const handleToggleAudio = (id: number) => {
    setAudioPlayingId(prev => (prev === id ? null : id));
  };

  const downloadReport = () => {
  const date = new Date().toLocaleDateString();

  // === NEW: Compute focus areas for PDF ===
  const focusMap = new Map<string, number>();
  questions.forEach(q => {
    const ua = userAnswers[q.id];
    if (!isQuestionCorrect(q, ua)) {
      q.learning_objectives.forEach(obj => {
        focusMap.set(obj, (focusMap.get(obj) ?? 0) + 1);
      });
    }
  });
  const focusItems = [...focusMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([obj, cnt]) => `<li><strong>${escapeHTML(obj)}</strong> (missed ${cnt} time${cnt > 1 ? 's' : ''})</li>`)
    .join('');
  const focusHTML = focusItems
    ? `<div class="sub"><h3>Focus on</h3><ul>${focusItems}</ul></div>`
    : '';

  const detailedRows = questions.map((q, idx) => {
    const ua = userAnswers[q.id];
    const userAns = formatUserAnswer(q, ua);
    const correctDisp = formatCorrectAnswer(q);
    const correct = isQuestionCorrect(q, ua);
    const advice = questionAdvice[q.id] || (correct ? 'Correct.' : 'Review this concept.');
    return `<tr class="${correct ? 'correct-row' : 'incorrect-row'}">
      <td>${idx + 1}</td>
      <td>${escapeHTML(q.text)}</td>
      <td>${escapeHTML(userAns)}</td>
      <td>${escapeHTML(correctDisp)}</td>
      <td>${correct ? 'Correct' : 'Incorrect'}</td>
      <td>${escapeHTML(advice)}</td>
    </tr>`;
  }).join('');

  const studyBlocks = buildStudyBlocks(questions, userAnswers, percentage);

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8" />
<title>Observer Pattern Assessment Report</title>
<style>
body{font-family:System-ui,Segoe UI,Roboto,sans-serif;background:#f8fafc;color:#1f2937;margin:40px;}
h1{margin:0 0 4px;font-size:28px;}
table{width:100%;border-collapse:collapse;font-size:13px;margin-top:12px;}
th,td{border:1px solid #e2e8f0;padding:8px;vertical-align:top;}
th{background:#1e3a8a;color:#fff;}
tr.correct-row{background:#ecfdf5;}
tr.incorrect-row{background:#fef2f2;}
.section{background:#fff;padding:20px;border-radius:12px;box-shadow:0 2px 6px rgba(0,0,0,0.06);margin-bottom:28px;}
.metric-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin:16px 0;}
.metric{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:14px;text-align:center;}
.metric .v{font-size:22px;font-weight:700;color:#4F46E5;}
.resources ul{padding-left:18px;margin:8px 0;}
.footer{text-align:center;margin-top:40px;font-size:12px;color:#64748b;}
a{color:#1e3a8a;text-decoration:none;}
a:hover{text-decoration:underline;}
.sub h3{margin:16px 0 8px;font-size:16px;color:#1e40af;}
.sub ul{margin:0;padding-left:20px;}
</style>
</head>
<body>
<div class="section">
  <h1>Observer Pattern Assessment Report</h1>
  <p><strong>Student:</strong> ${escapeHTML(username)} | <strong>Date:</strong> ${date}</p>
  <div class="metric-grid">
    <div class="metric"><div class="v">${percentage}%</div><div>Score</div></div>
    <div class="metric"><div class="v">${score}/${questions.length}</div><div>Correct</div></div>
    <div class="metric"><div class="v">${Math.floor(timeSpent / 60)}m ${timeSpent % 60}s</div><div>Time</div></div>
    <div class="metric"><div class="v">${questions.length}</div><div>Questions</div></div>
  </div>
  <p>${performanceMessageText(percentage)}</p>
</div>
<div class="section">
  <h2>Detailed Question Analysis & Advice</h2>
  <table>
    <thead><tr><th>#</th><th>Question</th><th>Your Answer</th><th>Correct Answer(s)</th><th>Status</th><th>Advice</th></tr></thead>
    <tbody>${detailedRows}</tbody>
  </table>
</div>

${focusHTML}

${studyBlocks}
<div class="footer">
 Generated ${new Date().toLocaleString()} • Observer Pattern Learning Platform
</div>
</body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Observer_Assessment_Report_${username}_${date.replace(/\//g, '-')}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

  const currentQuestion = questions[currentIndex];
  const progress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const allAnswered = questions.every(q => {
    const ua = userAnswers[q.id];
    if (!ua) return false;
    switch (ua.type) {
      case 'multiple_choice':
      case 'concept':
        return ua.selectedIndex !== null;
      case 'fill_in_blank':
      case 'code':
        return ua.text.trim().length > 0;
      case 'multi_select_issue':
        return ua.selectedIndices.length > 0;
      case 'drag_drop':
        return 'categories' in ua && ua.categories.source.length === 0; // All items moved
    }
  });

  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div className="start-card">
          <div className="start-card__halo" aria-hidden="true" />
          <header className="start-card__header">
            <div className="start-card__medallion">
              <Trophy className="start-card__medallion-icon" />
            </div>
            <h1 className="start-card__title">Observer Pattern Assessment</h1>
            <p className="start-card__subtitle">
              Welcome <span className="start-card__username">{username}</span>. You will
              answer dynamically loaded questions and receive a personalized learning
              report with targeted resources.
            </p>
            {fetchError && (
              <div className="start-card__error">
                <XCircle className="start-card__error-icon" />
                <span>{fetchError}</span>
              </div>
            )}
          </header>
          <div className="start-card__actions">
            <button
              onClick={handleStart}
              disabled={loadingQuestions}
              className="start-button"
            >
              <span className="start-button__sheen" aria-hidden="true" />
              {loadingQuestions ? (
                <span className="start-button__content">
                  <svg
                    className="start-button__spinner"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" className="spinner-track" />
                    <path d="M4 12a8 8 0 0 1 8-8" />
                  </svg>
                  Loading…
                </span>
              ) : (
                <span className="start-button__content">
                  <Play className="start-button__icon" />
                  Start Assessment
                </span>
              )}
            </button>
            <p className="start-card__footnote">
              Your responses are processed locally first; grading occurs only after submission.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (loadingQuestions) {
    return <div className="flex items-center justify-center h-64 text-slate-600">Loading questions…</div>;
  }

  if (fetchError) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <Card>
          <CardContent>
            <p className="text-red-600 font-semibold">Failed to load questions.</p>
            <p className="text-sm text-slate-600">{fetchError}</p>
            <div className="mt-4 flex gap-2">
              <Button onClick={fetchQuestions}>Retry</Button>
              <Button onClick={handleRestart} variant="outline">Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showSummary) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <Card className="bg-white shadow-lg border-t-4 border-orange-500 overflow-hidden">
          <div className="bg-blue-900 text-white px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-orange-400 to-yellow-300 flex items-center justify-center shadow">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="text-sm text-blue-200">Assessment</div>
                <div className="text-2xl md:text-3xl font-extrabold tracking-tight">Observer Pattern — Final Report</div>
                <div className="text-xs text-blue-200 mt-1">Review your performance and targeted study guidance below</div>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <div className="px-3 py-2 bg-white/10 rounded-md flex flex-col items-center text-center">
                <div className="text-xs text-blue-100">Accuracy</div>
                <div className="text-xl font-bold text-white">{percentage}%</div>
              </div>
              <div className="px-3 py-2 bg-white/10 rounded-md flex flex-col items-center text-center">
                <div className="text-xs text-blue-100">Score</div>
                <div className="text-xl font-bold text-white">{score}/{questions.length}</div>
              </div>
              <div className="px-3 py-2 bg-white/10 rounded-md flex flex-col items-center text-center">
                <div className="text-xs text-blue-100">Time</div>
                <div className="text-xl font-bold text-white">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</div>
              </div>
            </div>
          </div>

          <CardContent className="px-6 py-6">
            <div className="flex gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-orange-50 border-orange-100">
                <Target className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="text-xs text-slate-500">Accuracy</div>
                  <div className="font-semibold text-orange-600">{percentage}%</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg bg-white">
                <Award className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="text-xs text-slate-500">Correct</div>
                  <div className="font-semibold text-slate-800">{score}/{questions.length}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg bg-white">
                <TrendingUp className="w-5 h-5 text-blue-900" />
                <div>
                  <div className="text-xs text-slate-500">Time Spent</div>
                  <div className="font-semibold text-slate-800">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</div>
                </div>
              </div>
            </div>

            <PerformanceMessage percentage={percentage} />

            <section className="mt-6">
              <h3 className="text-blue-900 font-semibold mb-3">Question Results</h3>

              <div className="overflow-x-auto">
                <table className="min-w-full border rounded-lg overflow-hidden">
                  <thead className="bg-blue-600">
                    <tr>
                      <th style={{ backgroundColor: '#1e40af', color: '#fff' }} className="text-left text-xs uppercase px-4 py-3 text-white">#</th>
                      <th style={{ backgroundColor: '#1e40af', color: '#fff' }} className="text-left text-xs uppercase px-4 py-3 text-white">Question</th>
                      <th style={{ backgroundColor: '#1e40af', color: '#fff' }} className="text-left text-xs uppercase px-4 py-3 text-white">Your Answer</th>
                      <th style={{ backgroundColor: '#1e40af', color: '#fff' }} className="text-left text-xs uppercase px-4 py-3 text-white">Correct</th>
                      <th style={{ backgroundColor: '#1e40af', color: '#fff' }} className="text-left text-xs uppercase px-4 py-3 text-white">Status</th>
                      <th style={{ backgroundColor: '#1e40af', color: '#fff' }} className="text-left text-xs uppercase px-4 py-3 text-white">Advice</th>
                    </tr>
                  </thead>

                  <tbody>
                    {questions.map((q, idx) => {
                      const ua = userAnswers[q.id];
                      const correct = isQuestionCorrect(q, ua);
                      const userDisp = formatUserAnswer(q, ua);
                      const correctDisp = formatCorrectAnswer(q);
                      const advice = questionAdvice[q.id] || (correct ? 'Nice work.' : 'Review this concept.');

                      return (
                        <tr key={q.id} className="bg-white border-b">
                          <td className="px-4 py-3 align-top text-sm text-slate-700 w-12">{idx + 1}</td>

                          <td className="px-4 py-3 align-top text-sm text-blue-900 max-w-xl">
                            <div className="font-medium truncate" title={q.text}>{q.text}</div>
                            {q.learning_objectives?.length ? (
                              <div className="text-xs text-slate-400 mt-1">{q.learning_objectives.join(' • ')}</div>
                            ) : null}
                          </td>

                          <td className="px-4 py-3 align-top text-sm text-slate-700 max-w-xs">
                            <div className={correct ? 'text-green-700 font-medium' : 'text-rose-600 font-medium'}>{userDisp}</div>
                          </td>

                          <td className="px-4 py-3 align-top text-sm text-slate-700 max-w-xs">
                            <div className="text-slate-800">{correctDisp}</div>
                          </td>

                          <td className="px-4 py-3 align-top text-sm w-32">
                            {correct ? (
                              <div className="inline-flex items-center gap-2 text-green-700">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>Correct</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-2 text-rose-600">
                                <XCircle className="w-5 h-5" />
                                <span>Incorrect</span>
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-3 align-top text-sm text-slate-700 max-w-md">
                            <div>{advice}</div>
                            {q.code_snippet && (
                              <pre className="mt-2 p-2 bg-slate-100 text-xs rounded font-mono overflow-x-auto">{q.code_snippet}</pre>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="gap-4 items-start mt-8">
              <div className="">
                <StudyResources percentage={percentage} questions={questions} userAnswers={userAnswers} />
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={downloadReport} size="lg" className="w-full flex items-center justify-center bg-orange-500 hover:bg-orange-600">
                  <Download className="w-4 h-4 mr-2" /> Download Report
                </Button>
                <Button onClick={handleRestart} variant="outline" size="lg" className="w-full flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 mr-2" /> Retake Assessment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!currentQuestion) {
    return <div className="text-center text-slate-600">No questions loaded.</div>;
  }

  const ua = userAnswers[currentQuestion.id];
  const answeredCount = Object.values(userAnswers).filter(a => {
    switch (a.type) {
      case 'multiple_choice':
      case 'concept':
        return a.selectedIndex !== null;
      case 'fill_in_blank':
      case 'code':
        return a.text.trim().length > 0;
      case 'multi_select_issue':
        return a.selectedIndices.length > 0;
      case 'drag_drop':
        return 'categories' in a && a.categories.source.length === 0;
      default:
        return false;
    }
  }).length;

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
    <div className="assessment-question-wrapper max-w-3xl mx-auto px-10 py-10 space-y-8">
      <Card className="shadow">
        <CardHeader className="pb-4 px-6 pt-6">
          <div className="flex items-center justify-between mb-3">
            <CardTitle className="text-blue-900 text-lg font-semibold">
              Question {currentIndex + 1} / {questions.length}
            </CardTitle>
            <span className="text-xs px-6 py-3 bg-orange-100 text-orange-700 rounded-full">
              {answeredCount} answered
            </span>
          </div>
          <Progress value={progress} />
        </CardHeader>
        <CardContent className="space-y-6 px-6 pb-8 pt-2">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {currentQuestion.learning_objectives.map((obj, i) => (
                <span
                  key={i}
                  className="px-6 py-3 bg-blue-100 text-blue-700 rounded-full text-xs"
                >
                  {obj}
                </span>
              ))}
              {currentQuestion.type === 'code' && <Badge icon={<CodeIcon className="w-3 h-3" />} text="Code" />}
              {currentQuestion.image_url && <Badge icon={<ImageIcon className="w-3 h-3" />} text="Image" />}
              {currentQuestion.audio_url && <Badge icon={<Volume2 className="w-3 h-3" />} text="Audio" />}
            </div>

            <div className="flex items-start gap-4">
              <h3 className="flex-1 text-blue-900 font-medium leading-relaxed">
                {currentQuestion.text}
              </h3>
              {currentQuestion.audio_url && (
                <AudioButton
                  playing={audioPlayingId === currentQuestion.id}
                  onToggle={() => handleToggleAudio(currentQuestion.id)}
                  src={currentQuestion.audio_url}
                  id={currentQuestion.id}
                />
              )}
            </div>

            {currentQuestion.image_url && (
              <img
                src={currentQuestion.image_url}
                alt="Question reference"
                className="rounded border max-h-64 object-contain"
              />
            )}
            {currentQuestion.code_snippet && (
              <pre className="p-4 bg-slate-100 text-slate-800 text-sm rounded border border-slate-200 overflow-x-auto font-mono">
                {currentQuestion.code_snippet}
              </pre>
            )}
          </div>

          {['multiple_choice', 'concept'].includes(currentQuestion.type) && (
            <div className="space-y-2">
              {currentQuestion.options.map((opt, idx) => {
                const selected =
                  ua &&
                  (ua.type === 'multiple_choice' || ua.type === 'concept') &&
                  ua.selectedIndex === idx;
                return (
                  <OptionRow
                    key={opt.id}
                    letter={`${letters[idx]})`}
                    text={opt.text}
                    selected={selected}
                    onClick={() => updateAnswer(currentQuestion, { selectedIndex: idx })}
                  />
                );
              })}
            </div>
          )}

          {['fill_in_blank', 'code'].includes(currentQuestion.type) && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                {currentQuestion.type === 'fill_in_blank'
                  ? 'Enter answer:'
                  : 'Provide method / answer:'}
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={(ua as any)?.text || ''}
                onChange={e => updateAnswer(currentQuestion, { text: e.target.value })}
                placeholder="Type your answer…"
              />
            </div>
          )}

          {currentQuestion.type === 'multi_select_issue' && (
            <div className="space-y-2">
              {currentQuestion.options.map((opt, idx) => {
                const selected =
                  ua &&
                  ua.type === 'multi_select_issue' &&
                  ua.selectedIndices.includes(idx);
                return (
                  <OptionRow
                    key={opt.id}
                    letter={`${letters[idx]})`}
                    text={opt.text}
                    selected={selected}
                    multi
                    onClick={() => toggleMulti(currentQuestion, idx)}
                  />
                );
              })}
              <p className="text-xs text-slate-500 mt-1">Select all that apply.</p>
            </div>
          )}

          {currentQuestion.type === 'drag_drop' && (
            <DragAndDropQuestion
              question={currentQuestion}
              answer={ua}
              updateAnswer={(payload) => updateAnswer(currentQuestion, payload)}
            />
          )}


          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex(i => i - 1)}
              disabled={currentIndex === 0}
              className="border-blue-900 text-blue-900 hover:bg-blue-50"
            >
              Previous
            </Button>
            {currentIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmitAssessment}
                disabled={!allAnswered || grading}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {grading ? 'Grading…' : 'Submit & View Report'}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentIndex(i => i + 1)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-50 border border-slate-200">
        <CardContent className="p-5">
          <p className="text-sm mb-3 text-blue-900 font-medium">Quick Navigation</p>
          <div className="flex gap-2 flex-wrap">
            {questions.map((q, idx) => {
              const a = userAnswers[q.id];
              const answered = (() => {
                if (!a) return false;
                switch (a.type) {
                  case 'multiple_choice':
                  case 'concept':
                    return a.selectedIndex !== null;
                  case 'fill_in_blank':
                  case 'code':
                    return a.text.trim().length > 0;
                  case 'multi_select_issue':
                    return a.selectedIndices.length > 0;
                  case 'drag_drop':
                    return 'categories' in a && a.categories.source.length === 0;
                  default:
                    return false;
                }
              })();
              return (
                <Button
                  key={q.id}
                  size="sm"
                  variant={currentIndex === idx ? 'default' : 'outline'}
                  onClick={() => setCurrentIndex(idx)}
                  className={`rounded-full w-9 h-9 p-0 ${currentIndex === idx
                    ? 'bg-orange-500 text-white'
                    : answered
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : ''
                    }`}
                >
                  {idx + 1}
                  {answered && currentIndex !== idx && (
                    <CheckCircle2 className="w-3 h-3 ml-1" />
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/* ------------------------------------------------------------------
   Subcomponents
------------------------------------------------------------------- */
const OptionRow: React.FC<{
  letter: string;
  text: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
}> = ({ letter, text, selected, onClick, multi = false }) => (
  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    type="button"
    onClick={onClick}
    className={`w-full text-left flex gap-3 items-start rounded-lg border px-3.5 py-2 text-sm leading-relaxed transition ${selected
      ? 'border-orange-500 bg-orange-50 shadow-sm'
      : 'border-slate-300 hover:border-blue-300 hover:bg-slate-50'
      }`}
  >
    <span
      className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-md border text-xs font-semibold ${selected ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-700'
        }`}
    >
      {letter}
    </span>
    <span className="flex-1">{text}</span>
    {multi && (
      <span
        className={`mt-0.5 text-xs font-semibold ${selected ? 'text-orange-600' : 'text-slate-400'
          }`}
      >
        {selected ? '✓' : ''}
      </span>
    )}
  </motion.button>
);

const PerformanceMessage: React.FC<{ percentage: number }> = ({ percentage }) => {
  if (percentage >= 80)
    return (
      <Card className="border border-green-500 bg-green-50">
        <CardContent className="p-4 text-center">
          <h3 className="text-green-700 font-semibold mb-1">Excellent Work! 🎉</h3>
          <p className="text-green-600 text-sm">
            Strong grasp of Observer pattern fundamentals—consider exploring Event Aggregator & Reactive Streams.
          </p>
        </CardContent>
      </Card>
    );
  if (percentage >= 50)
    return (
      <Card className="border border-yellow-500 bg-yellow-50">
        <CardContent className="p-4 text-center">
          <h3 className="text-yellow-700 font-semibold mb-1">Good Effort! 👍</h3>
          <p className="text-yellow-600 text-sm">
            Strengthen understanding of notification flow and push vs pull distinctions.
          </p>
        </CardContent>
      </Card>
    );
  return (
    <Card className="border border-red-500 bg-red-50">
      <CardContent className="p-4 text-center" style={{ backgroundColor: '#fff', color: '#ffffffff', border: '2px solid #ffa601ff' }}>
        <h3 className="text-red-700 font-semibold mb-1">Keep Going! 📚</h3>
        <p className="text-red-600 text-sm">
          Revisit Subject responsibilities and Observer update mechanics before retaking.
        </p>
      </CardContent>
    </Card>
  );
};

const Badge: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <span className="inline-flex items-center gap-1 px-4 py-2 bg-slate-100 text-slate-700 rounded text-xs">
    {icon}{text}
  </span>
);

const StudyResources: React.FC<{
  percentage: number;
  questions: ObserverQuestion[];
  userAnswers: Record<number, UserAnswer>;
}> = ({ percentage, questions, userAnswers }) => {
  const incorrectObjectives: Set<string> = new Set();
  questions.forEach(q => {
    const ua = userAnswers[q.id];
    if (!isQuestionCorrect(q, ua)) {
      q.learning_objectives.forEach(o => incorrectObjectives.add(o));
    }
  });

  const baseLinks = [
    { title: 'Refactoring Guru – Observer', url: 'https://refactoring.guru/design-patterns/observer' },
    { title: 'JavaScript Observer Pattern Tutorial (YouTube)', url: 'https://www.youtube.com/watch?v=YwP_bm5Qhxw' },
    { title: 'Push vs Pull Explained (YouTube)', url: 'https://www.youtube.com/watch?v=H-9MfHqQ3YI' }
  ];
  const deeperLinks = [
    { title: 'Observer vs Pub/Sub vs Mediator', url: 'https://www.youtube.com/watch?v=3t3JHswP7Gs' },
    { title: 'Reactive Extensions Intro', url: 'https://www.youtube.com/watch?v=4KqJlHkT6i4' }
  ];

  const rec = percentage >= 80
    ? 'Explore architectural patterns (Event Aggregator, Reactive Streams) to broaden your design toolkit.'
    : percentage >= 50
      ? 'Focus on differentiating Subject responsibilities from Observer update methods. Practice refactoring a UI event system.'
      : 'Start by coding a minimal Subject with attach/detach and notify, then layer push and pull models to compare trade-offs.';

  return (
  <div className="border border-slate-200 px-8 py-8">
      <CardHeader>
        <CardTitle className="text-blue-900 text-2xl">
          Study Resources & Recommendations
        </CardTitle>
        <CardDescription>
          Targeted links and practice tasks based on your performance.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 text-sm">

        {/* === NEW: What to focus on === */}
        {(() => {
          const map = new Map<string, number>();
          questions.forEach(q => {
            if (!isQuestionCorrect(q, userAnswers[q.id])) {
              q.learning_objectives.forEach(o => map.set(o, (map.get(o) ?? 0) + 1));
            }
          });
          const top = [...map.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([obj, cnt]) => `${obj} (missed ${cnt}x)`);
          return top.length > 0 ? (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="font-bold text-orange-800 flex items-center gap-2">
                <Target className="w-5 h-5" /> What to focus on:
              </p>
              <ul className="mt-2 ml-6 list-disc text-orange-700">
                {top.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          ) : null;
        })()}

        {/* === Existing recommendation === */}
        <p className="font-medium">{rec}</p>

        <div>
          <p className="font-semibold mb-1">Key Resources:</p>
          <ul className="list-disc list-inside space-y-1">
            {baseLinks.map(l => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener" className="text-blue-700 hover:underline">
                  {l.title}
                </a>
              </li>
            ))}
            {percentage >= 80 && deeperLinks.map(l => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener" className="text-blue-700 hover:underline">
                  {l.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-1">Practice Ideas:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Implement both push and pull variants for the same scenario and profile payload sizes.</li>
            <li>Refactor an existing event listener set into explicit Subject/Observer participants.</li>
            <li>Add dynamic observer detachment & verify no memory leaks.</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-1">Concepts to Reinforce:</p>
          {incorrectObjectives.size ? (
            <ul className="list-disc list-inside space-y-1">
              {[...incorrectObjectives].map(obj => <li key={obj}>{obj}</li>)}
            </ul>
          ) : <p className="text-green-600">All learning objectives answered correctly—great job!</p>}
        </div>
      </CardContent>
    </div>
  );
};

const AudioButton: React.FC<{ playing: boolean; onToggle: () => void; src: string; id: number }> = ({ playing, onToggle, src, id }) => {
  useEffect(() => {
    const audio = document.getElementById(`audio-${id}`) as HTMLAudioElement | null;
    if (!audio) return;
    if (playing) audio.play().catch(() => { });
    else audio.pause();
  }, [playing, id]);

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onToggle}
        className={`border px-3 py-2 ${playing
          ? 'border-green-500 bg-green-50 text-green-700'
          : 'border-slate-300'
          }`}
      >
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        <span className="ml-2">{playing ? 'Pause' : 'Play'}</span>
      </Button>
      <audio id={`audio-${id}`} src={src} preload="metadata" />
    </div>
  );
};

export default Assessment;