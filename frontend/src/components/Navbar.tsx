'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, Search, History, Settings, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/detect', label: 'Detect', icon: Search },
  { href: '/history', label: 'History', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 50
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }} className="md:px-6">
        <div style={{ display: 'flex', alignItems: 'center', height: 60, justifyContent: 'space-between', gap: '1rem' }}>
          
          {/* Logo */}
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }} className="md:w-[34px] md:h-[34px]">
              <Shield size={16} color="white" className="md:w-[18px] md:h-[18px]" />
            </div>
            <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }} className="md:text-[17px]">DeepGuard</span>
            <span style={{
              fontSize: 10, padding: '2px 6px', borderRadius: 20,
              background: 'var(--accent-bg)', color: 'var(--accent)',
              border: '1px solid var(--accent-border)', fontWeight: 500
            }} className="md:text-[11px] md:px-[7px]">Beta</span>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'none', gap: 4 }} className="md:flex">
            {navItems.map(item => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '6px 14px', borderRadius: 8, textDecoration: 'none',
                  fontSize: 14, fontWeight: active ? 500 : 400,
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: active ? 'var(--bg-card)' : 'transparent',
                  border: active ? '1px solid var(--border)' : '1px solid transparent',
                  transition: 'all 0.15s'
                }}>
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Profile - Desktop */}
          <div style={{ position: 'relative', display: 'none' }} className="md:block">
            <button onClick={() => setProfileOpen(!profileOpen)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
              background: profileOpen ? 'var(--bg-card)' : 'transparent',
              border: '1px solid var(--border)', color: 'var(--text-secondary)',
              fontSize: 14, transition: 'all 0.15s'
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'var(--accent-bg)', border: '1px solid var(--accent-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <User size={13} color="var(--accent)" />
              </div>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'Account'}
              </span>
            </button>

            {profileOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '110%',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 10, padding: 6, minWidth: 180, zIndex: 100
              }}>
                <Link href="/settings" style={{
                  display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px',
                  borderRadius: 7, textDecoration: 'none', fontSize: 14,
                  color: 'var(--text-secondary)', transition: 'all 0.15s'
                }} onClick={() => setProfileOpen(false)}>
                  <Settings size={15} /> Settings
                </Link>
                <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                <button onClick={() => { logout(); setProfileOpen(false); }} style={{
                  display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px',
                  borderRadius: 7, fontSize: 14, width: '100%', textAlign: 'left',
                  color: 'var(--danger)', transition: 'all 0.15s',
                  background: 'none', border: 'none', cursor: 'pointer'
                }}>
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ 
              display: 'flex', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--text-secondary)',
              padding: '4px'
            }}
            className="md:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ 
            paddingTop: '0.5rem',
            paddingBottom: '1rem', 
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column'
          }} className="md:hidden">
            {navItems.map(item => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 8px', borderRadius: 8, textDecoration: 'none',
                  fontSize: 15, color: active ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: active ? 500 : 400, marginTop: 4
                }}>
                  <Icon size={17} /> {item.label}
                </Link>
              );
            })}
            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
            <Link href="/settings" onClick={() => setMobileOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 8px', borderRadius: 8, textDecoration: 'none',
              fontSize: 15, color: 'var(--text-secondary)'
            }}>
              <Settings size={17} /> Settings
            </Link>
            <button onClick={() => { logout(); setMobileOpen(false); }} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 8px', borderRadius: 8, textAlign: 'left',
              fontSize: 15, color: 'var(--danger)',
              background: 'none', border: 'none', cursor: 'pointer', width: '100%'
            }}>
              <LogOut size={17} /> Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}