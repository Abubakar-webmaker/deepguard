import Link from 'next/link';
import { Shield, Zap, Eye, Lock, ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  { icon: Eye, title: 'Image detection', desc: 'GAN artifacts, facial inconsistencies, and metadata anomalies detected instantly.' },
  { icon: Zap, title: 'Audio analysis', desc: 'Voice clones, synthetic speech, and AI-generated audio identified with high accuracy.' },
  { icon: Shield, title: 'Text verification', desc: 'AI-written content detected across GPT, Claude, Gemini, and other models.' },
  { icon: Lock, title: 'Privacy first', desc: 'Your files are analyzed and immediately deleted. Nothing is stored without consent.' },
];

const stats = [
  { num: '97.3%', label: 'Detection accuracy' },
  { num: '2.1s', label: 'Average analysis time' },
  { num: '4.2M+', label: 'Files analyzed' },
  { num: '99.9%', label: 'Uptime' },
];

export default function LandingPage() {
  return (
    <main style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: 64, maxWidth: 1200, margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Shield size={18} color="white" />
          </div>
          <span style={{ fontWeight: 600, fontSize: 17, color: 'var(--text-primary)' }}>DeepGuard</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/login" style={{
            padding: '8px 18px', borderRadius: 8, textDecoration: 'none',
            fontSize: 14, color: 'var(--text-secondary)',
            border: '1px solid var(--border)', background: 'transparent'
          }}>Log in</Link>
          <Link href="/signup" style={{
            padding: '8px 18px', borderRadius: 8, textDecoration: 'none',
            fontSize: 14, color: 'white', background: 'var(--accent)', fontWeight: 500
          }}>Get started free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '5rem 2rem 4rem', maxWidth: 760, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13,
          color: 'var(--accent)', background: 'var(--accent-bg)',
          border: '1px solid var(--accent-border)', padding: '5px 14px',
          borderRadius: 20, marginBottom: '1.5rem', fontWeight: 500
        }}>
          <Zap size={13} /> Now detecting AI video deepfakes
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 700,
          color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: '1.25rem',
          letterSpacing: '-1px'
        }}>
          Detect deepfakes &<br />
          <span style={{ color: 'var(--accent)' }}>AI-generated content</span><br />
          in seconds
        </h1>

        <p style={{
          fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7,
          marginBottom: '2.5rem', maxWidth: 520, margin: '0 auto 2.5rem'
        }}>
          Upload any image, audio clip, or paste text. Get an instant verdict powered by state-of-the-art detection models.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 28px', borderRadius: 10, textDecoration: 'none',
            fontSize: 15, fontWeight: 600, color: 'white',
            background: 'var(--accent)'
          }}>
            Start detecting free <ArrowRight size={17} />
          </Link>
          <Link href="/detect" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 28px', borderRadius: 10, textDecoration: 'none',
            fontSize: 15, color: 'var(--text-primary)',
            border: '1px solid var(--border)', background: 'var(--bg-secondary)'
          }}>
            Try without account
          </Link>
        </div>

        <div style={{
          display: 'flex', gap: 6, justifyContent: 'center', marginTop: '1.25rem',
          flexWrap: 'wrap'
        }}>
          {['No credit card required', 'Free 50 scans/month', 'Results in under 3 seconds'].map(t => (
            <div key={t} style={{
              display: 'flex', alignItems: 'center', gap: 5, fontSize: 13,
              color: 'var(--text-muted)'
            }}>
              <CheckCircle size={13} color="var(--success)" /> {t}
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{
        maxWidth: 900, margin: '0 auto', padding: '0 2rem 4rem',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16
      }}>
        {stats.map(s => (
          <div key={s.num} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '1.5rem', textAlign: 'center'
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.5px' }}>{s.num}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={{
        maxWidth: 1000, margin: '0 auto', padding: '0 2rem 6rem'
      }}>
        <h2 style={{
          textAlign: 'center', fontSize: 28, fontWeight: 600,
          color: 'var(--text-primary)', marginBottom: '0.75rem'
        }}>Everything you need to verify content</h2>
        <p style={{
          textAlign: 'center', color: 'var(--text-secondary)', fontSize: 16,
          marginBottom: '3rem'
        }}>Three detection modes. One unified platform.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {features.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '1.5rem'
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: 'var(--accent-bg)', border: '1px solid var(--accent-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
                }}>
                  <Icon size={20} color="var(--accent)" />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}