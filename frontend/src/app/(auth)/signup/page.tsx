'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

const { register } = useAuth();

const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return; }
  if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
  setLoading(true);
  try {
    await register(form.name, form.email, form.password);
  } catch (err: any) {
    setError(err?.response?.data?.detail || 'Registration failed. Try again.');
  } finally {
    setLoading(false);
  }
};

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 9,
    background: 'var(--bg-primary)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', fontSize: 15, outline: 'none',
    transition: 'border-color 0.15s'
  };

  const perks = ['Free 50 scans per month', 'Image, audio & text detection', 'Full history access'];

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <div style={{
        width: '100%', maxWidth: 440,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '2.5rem 2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
          }}>
            <Shield size={24} color="white" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Create your account</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Start detecting AI content for free</p>
        </div>

        <div style={{
          display: 'flex', flexDirection: 'column', gap: 5, marginBottom: '1.5rem',
          padding: '12px 14px', borderRadius: 9,
          background: 'var(--accent-bg)', border: '1px solid var(--accent-border)'
        }}>
          {perks.map(p => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
              <CheckCircle size={14} color="var(--success)" /> {p}
            </div>
          ))}
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 8, fontSize: 13,
              background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', color: 'var(--danger)'
            }}>{error}</div>
          )}

          {[
            { key: 'name', label: 'Full name', type: 'text', placeholder: 'Abu Bakar' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
          ].map(field => (
            <div key={field.key}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                {field.label}
              </label>
              <input
                type={field.type}
                value={(form as any)[field.key]}
                onChange={e => update(field.key, e.target.value)}
                placeholder={field.placeholder}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          ))}

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'} value={form.password}
                onChange={e => update('password', e.target.value)}
                placeholder="At least 8 characters"
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center'
              }}>
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', borderRadius: 9, border: 'none',
            background: loading ? 'var(--border)' : 'var(--accent)',
            color: 'white', fontSize: 15, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginTop: 4, transition: 'all 0.15s'
          }}>
            {loading ? 'Creating account...' : <><span>Create account</span><ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: '1.5rem' }}>
          By signing up you agree to our{' '}
          <Link href="/terms" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Terms</Link>
          {' & '}
          <Link href="/privacy" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Privacy Policy</Link>
        </p>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}