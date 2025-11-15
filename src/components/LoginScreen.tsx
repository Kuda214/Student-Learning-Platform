import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { BookOpen, ArrowRight, Eye } from 'lucide-react';
import { TeacherDashboard } from './TeacherDashboard';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

interface User {
  username: string;
  role?: string;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localUser, setLocalUser] = useState<User | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'instructor') {
      setLocalUser({ username: trimmed, role: 'instructor' });
    } else {
      onLogin(trimmed); // Normal student flow
    }
  };

  // Show Teacher Dashboard if logged in as instructor
  if (localUser?.username.toLowerCase() === 'instructor') {
    return <TeacherDashboard user={localUser} />;
  }

  // Otherwise, show login form
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center md:text-left space-y-6 p-8">
          <div className="inline-flex items-center gap-3 bg-blue-900 text-white px-6 py-3 rounded-lg">
            <Eye className="w-8 h-8" />
            <span className="text-2xl">Observer</span>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl text-blue-900 mb-4">
              Learn Design Patterns
            </h1>
            <p className="text-xl text-slate-600 mb-6">
              Master the Observer pattern through interactive visualizations and hands-on assessments
            </p>
            <div className="space-y-3 text-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p>Interactive pattern visualization</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p>Code and visual toggle views</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p>Comprehensive assessment reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="shadow-2xl">
          <CardHeader className="text-center space-y-2 pb-8">
            <div className="mx-auto w-16 h-16 bg-blue-900 rounded-xl flex items-center justify-center mb-2">
              <BookOpen className="w-9 h-9 text-white" />
            </div>
            <CardTitle className="text-2xl text-blue-900">Welcome Back</CardTitle>
            <CardDescription className="text-base">
              Sign in to continue your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-blue-900">Username</Label>
                <Input
                  id="username"
                  type="text"
                  // placeholder="Try 'student1' or 'instructor'"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12 border-slate-300 focus:border-blue-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-900">Password</Label>
                <Input
                  id="password"
                  type="password"
                  // placeholder="Any password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 border-slate-300 focus:border-blue-900"
                />
              </div>
              <Button type="submit" className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white text-base">
                Start Learning
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-center text-sm text-slate-500 pt-2">
                Use <code className="bg-slate-200 px-1 rounded">instructor</code> to see Teacher Dashboard
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}