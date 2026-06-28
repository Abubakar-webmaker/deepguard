'use client';
import { useState } from 'react';
import { User, Bell, Shield, Key, Trash2, Save } from 'lucide-react';

export default function SettingsPage() {
  const [name, setName] = useState('Abu Bakar');
  const [email, setEmail] = useState('abubakar@example.com');
  const [notifications, setNotifications] = useState({ email: true, fakeDetected: true, weeklyReport: false });
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputStyle = {
    width: '100%', padding: '10px 13px', borderRadius: 8,
    background: 'var(--bg-primary)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', fontSize: 14, outline: 'none'
  };

  const sectionStyle = {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 12, padding: '1.5rem', marginBottom: 16
  };

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} style={{
      width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
      background: on ? 'var(--accent)' : 'var(--border-strong)',
      position: 'relative', transition: 'background 0.2s', flexShrink: 0
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: 'white',
        position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'left 0.2s'
      }} />
    </button>
  );

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: '1.25rem' }}>
          <User size={17} color="var(--accent)" />
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Profile</h2>
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Full name</label>
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: '1.25rem' }}>
          <Bell size={17} color="var(--accent)" />
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Notifications</h2>
        </div>
        {[
          { key: 'email', label: 'Email notifications', desc: 'Receive scan results via email' },
          { key: 'fakeDetected', label: 'Alert on fake detected', desc: 'Immediate alert when AI content is found' },
          { key: 'weeklyReport', label: 'Weekly report', desc: 'Summary of your scan activity each week' },
        ].map(item => (
          <div key={item.key} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '11px 0', borderBottom: '1px solid var(--border)'
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{item.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
            </div>
            <Toggle
              on={(notifications as any)[item.key]}
              onToggle={() => setNotifications(n => ({ ...n, [item.key]: !(n as any)[item.key] }))}
            />
          </div>
        ))}
      </div>

      {/* Security */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: '1.25rem' }}>
          <Shield size={17} color="var(--accent)" />
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Security</h2>
        </div>
        {[
          { icon: Key, label: 'Change password', desc: 'Update your account password' },
          { icon: Shield, label: 'Two-factor authentication', desc: 'Add extra security to your account' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '11px 0', borderBottom: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Icon size={16} color="var(--text-muted)" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                </div>
              </div>
              <button style={{
                padding: '6px 14px', borderRadius: 7, fontSize: 13,
                border: '1px solid var(--border)', background: 'var(--bg-primary)',
                color: 'var(--text-secondary)', cursor: 'pointer'
              }}>Configure</button>
            </div>
          );
        })}
      </div>

      {/* Danger zone */}
      <div style={{ ...sectionStyle, border: '1px solid var(--danger-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: '1rem' }}>
          <Trash2 size={17} color="var(--danger)" />
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--danger)' }}>Danger zone</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Delete account</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Permanently delete your account and all scan data</div>
          </div>
          <button style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 14, cursor: 'pointer',
            border: '1px solid var(--danger-border)', background: 'var(--danger-bg)',
            color: 'var(--danger)', fontWeight: 500
          }}>Delete account</button>
        </div>
      </div>

      {/* Save */}
      <button onClick={handleSave} style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px',
        borderRadius: 9, border: 'none', cursor: 'pointer',
        background: saved ? 'var(--success)' : 'var(--accent)',
        color: 'white', fontSize: 14, fontWeight: 600, transition: 'all 0.2s'
      }}>
        <Save size={16} />
        {saved ? 'Changes saved!' : 'Save changes'}
      </button>
    </div>
  );
}