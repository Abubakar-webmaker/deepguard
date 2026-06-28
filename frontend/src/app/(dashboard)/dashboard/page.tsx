'use client';
import Link from 'next/link';
import { Shield, Search, TrendingUp, AlertTriangle, CheckCircle, Clock, ArrowRight, Image, Mic, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { historyAPI } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const chartData = [
  { day: 'Mon', scans: 4 }, { day: 'Tue', scans: 9 }, { day: 'Wed', scans: 6 },
  { day: 'Thu', scans: 14 }, { day: 'Fri', scans: 11 }, { day: 'Sat', scans: 7 },
  { day: 'Sun', scans: 16 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, fake: 0, real: 0, avg_analysis_time: 0, fake_percentage: 0 });
  const [recentScans, setRecentScans] = useState<any[]>([]);

  useEffect(() => {
    historyAPI.getStats().then(r => setStats(r.data)).catch(() => {});
    historyAPI.getAll({ page: 1, limit: 4 }).then(r => {
      const scans = r.data.scans.map((scan: any) => ({
        name: scan.file_name || 'Text scan',
        type: scan.type,
        verdict: scan.verdict,
        confidence: scan.confidence,
        time: new Date(scan.timestamp).toLocaleString(),
        icon: scan.type === 'image' ? Image : scan.type === 'audio' ? Mic : FileText
      }));
      setRecentScans(scans);
    }).catch(() => {});
  }, []);

  const statCards = [
    { label: 'Total scans', value: stats.total.toString(), icon: Search, trend: 'All time' },
    { label: 'Fakes detected', value: stats.fake.toString(), icon: AlertTriangle, trend: `${stats.fake_percentage ?? 0}% of total`, danger: true },
    { label: 'Real confirmed', value: stats.real.toString(), icon: CheckCircle, trend: 'Verified authentic', success: true },
    { label: 'Avg. scan time', value: `${stats.avg_analysis_time}s`, icon: Clock, trend: 'Per analysis' },
  ];
  return (
    <div>
      {/* Header */}
      <div style={{ 
        marginBottom: '1.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        flexWrap: 'wrap', 
        gap: 12 
      }} className="md:mb-8">
        <div>
          <h1 style={{ 
            fontSize: 20, 
            fontWeight: 600, 
            color: 'var(--text-primary)', 
            marginBottom: 4 
          }} className="md:text-2xl">
            Good morning, {user?.name || 'User'}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }} className="md:text-[15px]">
            Here's your detection overview.
          </p>
        </div>
        <Link href="/detect" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '9px 16px', borderRadius: 9, textDecoration: 'none',
          background: 'var(--accent)', color: 'white', fontSize: 13, fontWeight: 500
        }} className="md:px-5 md:py-[10px] md:text-sm">
          <Shield size={14} className="md:w-[15px] md:h-[15px]" /> 
          <span className="hidden sm:inline">New scan</span>
          <span className="sm:hidden">Scan</span>
          <ArrowRight size={13} className="md:w-[14px] md:h-[14px]" />
        </Link>
      </div>

      {/* Stat cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: 10, 
        marginBottom: '1.5rem' 
      }} className="sm:grid-cols-2 md:grid-cols-4 md:gap-[14px] md:mb-7">
        {statCards.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '1rem'
            }} className="md:rounded-xl md:p-5">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                marginBottom: '0.6rem' 
              }} className="md:mb-3">
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }} className="md:text-[13px]">
                  {s.label}
                </span>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: s.danger ? 'var(--danger-bg)' : s.success ? 'var(--success-bg)' : 'var(--accent-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} className="md:w-8 md:h-8 md:rounded-lg">
                  <Icon size={13} color={s.danger ? 'var(--danger)' : s.success ? 'var(--success)' : 'var(--accent)'} className="md:w-[15px] md:h-[15px]" />
                </div>
              </div>
              <div style={{ 
                fontSize: 22, 
                fontWeight: 700, 
                color: 'var(--text-primary)', 
                letterSpacing: '-0.5px' 
              }} className="md:text-[26px]">
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }} className="md:text-xs">
                {s.trend}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Recent */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr', 
        gap: 12 
      }} className="md:grid-cols-2 md:gap-4 grid-responsive">

        {/* Chart */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '1rem'
        }} className="md:rounded-xl md:p-5">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }} className="md:mb-5">
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }} className="md:text-[15px]">
                Scans this week
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }} className="md:text-[13px]">
                67 total scans
              </div>
            </div>
            <TrendingUp size={16} color="var(--accent)" className="md:w-[18px] md:h-[18px]" />
          </div>
          <ResponsiveContainer width="100%" height={160} className="md:h-[180px]">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'var(--text-secondary)' }}
                itemStyle={{ color: 'var(--accent)' }}
              />
              <Area type="monotone" dataKey="scans" stroke="var(--accent)" strokeWidth={2} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent scans */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '1rem'
        }} className="md:rounded-xl md:p-5">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1rem' 
          }} className="md:mb-5">
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }} className="md:text-[15px]">
              Recent scans
            </div>
            <Link href="/history" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }} className="md:text-[13px]">
              View all
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }} className="md:gap-2">
            {recentScans.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem 1rem', 
                color: 'var(--text-muted)', 
                fontSize: 13 
              }}>
                No scans yet. Start by analyzing content!
              </div>
            ) : (
              recentScans.slice(0, 4).map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px',
                    borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border)'
                  }} className="md:gap-[11px] md:p-[10px] md:rounded-[9px]">
                    <div style={{
                      width: 32, height: 32, borderRadius: 7,
                      background: s.verdict === 'fake' ? 'var(--danger-bg)' : 'var(--success-bg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }} className="md:w-[34px] md:h-[34px] md:rounded-lg">
                      <Icon size={15} color={s.verdict === 'fake' ? 'var(--danger)' : 'var(--success)'} className="md:w-4 md:h-4" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        fontSize: 12, 
                        fontWeight: 500, 
                        color: 'var(--text-primary)', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis' 
                      }} className="md:text-[13px]">
                        {s.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }} className="md:text-xs">
                        {s.time}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 500, padding: '3px 7px', borderRadius: 5,
                      background: s.verdict === 'fake' ? 'var(--danger-bg)' : 'var(--success-bg)',
                      color: s.verdict === 'fake' ? 'var(--danger)' : 'var(--success)',
                      border: `1px solid ${s.verdict === 'fake' ? 'var(--danger-border)' : 'var(--success-border)'}`,
                      whiteSpace: 'nowrap'
                    }} className="md:text-xs md:px-[9px] md:rounded-md">
                      {s.verdict === 'fake' ? 'AI' : 'Real'} · {s.confidence}%
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}