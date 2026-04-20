import { useState } from 'react';
import { useRouter } from 'next/router';
import { Ship, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { signIn } from '@/lib/supabase';
import toast from 'react-hot-toast';

const userRoles = ['Admin', 'Crewing Manager', 'Operator'] as const;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('ahmadmabrur.lasshipping@gmail.com');
  const [password, setPassword] = useState('Adminoperation77');
  const [selectedRole, setSelectedRole] = useState<typeof userRoles[number]>('Admin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await signIn(email, password);

      if (signInError) {
        setError('Email atau password salah. Silakan coba lagi.');
        setLoading(false);
        return;
      }

      if (data.user) {
        toast.success('Login berhasil! Mengalihkan...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-5 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80% 60% at 20% 10%, rgba(0, 100, 200, 0.15) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 80% 80%, rgba(255, 107, 53, 0.08) 0%, transparent 50%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 180, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 180, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Login Box */}
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="glass-card p-10">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Ship className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-base font-bold tracking-wide text-text-100">
              PT. PELAYARAN LESTARI ABADI SERASI
            </h1>
            <p className="text-[10px] text-text-400 tracking-widest uppercase mt-1">
              Fleet Monitoring System v2.0
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger mb-4 animate-slide-down">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold tracking-wider uppercase text-text-400 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@lasshipping.co.id"
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold tracking-wider uppercase text-text-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10 pr-10"
                  required
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-400 hover:text-text-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-[10px] font-bold tracking-wider uppercase text-text-400 mb-2">
                Role
              </label>
              <div className="flex gap-2">
                {userRoles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`
                      flex-1 py-2 text-xs font-medium rounded-lg border transition-all
                      ${
                        selectedRole === role
                          ? 'bg-neon/12 border-neon/30 text-neon'
                          : 'bg-black/30 border-glass-border2 text-text-400 hover:border-neon/20'
                      }
                    `}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-6 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Masuk ke Sistem</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Hint */}
          <div className="text-center mt-6 text-xs text-text-600">
            LAS Fleet Monitoring System · v2.0.0 · © 2024 LAS Shipping Lines
          </div>
        </div>

        {/* Quick Login Hints */}
        <div className="mt-4 p-4 glass-card-sm">
          <p className="text-[10px] font-bold tracking-wider uppercase text-text-600 mb-2">
            Demo Accounts
          </p>
          <div className="space-y-1 text-xs text-text-400">
            <div className="flex justify-between">
              <span className="font-mono text-[10px]">Admin:</span>
              <span className="font-mono text-[10px]">ahmadmabrur@...gmail.com</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[10px]">Crewing:</span>
              <span className="font-mono text-[10px]">rudi@lasshipping.co.id</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[10px]">Operator:</span>
              <span className="font-mono text-[10px]">dewi@lasshipping.co.id</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
