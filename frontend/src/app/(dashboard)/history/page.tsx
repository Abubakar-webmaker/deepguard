'use client';
import { useState, useEffect } from 'react';
import { Search, Image, Mic, FileText, AlertTriangle, CheckCircle, Filter, Download } from 'lucide-react';
import { historyAPI } from '@/lib/utils';

export default function HistoryPage() {
  const [allHistory, setAllHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'audio' | 'text'>('all');
  const [filterVerdict, setFilterVerdict] = useState<'all' | 'real' | 'fake'>('all');

  // Fetch history from backend
  useEffect(() => {
    setHistoryLoading(true);
    historyAPI.getAll({ type: filterType === 'all' ? undefined : filterType, verdict: filterVerdict === 'all' ? undefined : filterVerdict })
      .then(r => setAllHistory(r.data.scans))
      .catch(() => setAllHistory([]))
      .finally(() => setHistoryLoading(false));
  }, [filterType, filterVerdict]);

  const typeIcon: Record<string, any> = { image: Image, audio: Mic, text: FileText };

  const filtered = (historyLoading ? [] : allHistory).filter(h => {
    const matchSearch = (h.file_name || 'Text scan').toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || h.type === filterType;
    const matchVerdict = filterVerdict === 'all' || h.verdict === filterVerdict;
    return matchSearch && matchType && matchVerdict;
  });

  const btnStyle = (active: boolean) => ({
    padding: '6px 14px', borderRadius: 7, fontSize: 13, cursor: 'pointer',
    border: `1px solid ${active ? 'var(--accent-border)' : 'var(--border)'}`,
    background: active ? 'var(--accent-bg)' : 'var(--bg-card)',
    color: active ? 'var(--accent)' : 'var(--text-secondary)',
    fontWeight: active ? 500 : 400, transition: 'all 0.15s'
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Scan history</h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
            {historyLoading ? 'Loading...' : `${allHistory.length} scans total`}
          </p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '9px 16px', borderRadius: 8, fontSize: 14,
          border: '1px solid var(--border)', background: 'var(--bg-card)',
          color: 'var(--text-secondary)', cursor: 'pointer'
        }}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search scans..."
            style={{
              width: '100%', padding: '8px 12px 8px 36px', borderRadius: 8,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-primary)', fontSize: 14, outline: 'none'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <Filter size={14} color="var(--text-muted)" />
          {(['all', 'image', 'audio', 'text'] as const).map(t => (
            <button key={t} onClick={() => setFilterType(t)} style={btnStyle(filterType === t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {(['all', 'real', 'fake'] as const).map(v => (
            <button key={v} onClick={() => setFilterVerdict(v)} style={btnStyle(filterVerdict === v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {historyLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: 15 }}>
            Loading history...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: 15 }}>
            No results found
          </div>
        ) : (
          filtered.map((h, i) => {
            const Icon = typeIcon[h.type];
            const isReal = h.verdict === 'real';
            return (
              <div key={h.id} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '13px 1.25rem',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer', transition: 'background 0.1s'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                  background: isReal ? 'var(--success-bg)' : 'var(--danger-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={17} color={isReal ? 'var(--success)' : 'var(--danger)'} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {h.file_name || 'Text scan'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {h.type.charAt(0).toUpperCase() + h.type.slice(1)} · {new Date(h.timestamp).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isReal
                    ? <CheckCircle size={15} color="var(--success)" />
                    : <AlertTriangle size={15} color="var(--danger)" />
                  }
                  <span style={{
                    fontSize: 13, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
                    background: isReal ? 'var(--success-bg)' : 'var(--danger-bg)',
                    color: isReal ? 'var(--success)' : 'var(--danger)',
                    border: `1px solid ${isReal ? 'var(--success-border)' : 'var(--danger-border)'}`
                  }}>
                    {isReal ? 'Real' : 'AI'} · {h.confidence}%
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}