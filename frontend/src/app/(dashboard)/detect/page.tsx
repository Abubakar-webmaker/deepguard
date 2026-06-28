'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Shield, Upload, FileText, Mic, Image, X, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { formatFileSize, DetectionResult, DetectionType, detectAPI } from '@/lib/utils';

type Tab = 'image' | 'audio' | 'text';

const mockResults: Record<Tab, DetectionResult> = {
  image: {
    id: '1', type: 'image', fileName: 'test.jpg', verdict: 'fake',
    confidence: 94, aiProbability: 91,
    signals: [
      { name: 'Facial inconsistency', value: 91, description: 'Unnatural skin texture patterns detected around the eye region' },
      { name: 'GAN artifacts', value: 87, description: 'Characteristic GAN-generated noise patterns in background' },
      { name: 'Metadata anomaly', value: 74, description: 'EXIF data inconsistent with claimed camera source' },
      { name: 'Compression pattern', value: 68, description: 'Unusual JPEG compression artifacts suggesting AI post-processing' },
    ],
    timestamp: new Date(), analysisTime: 1.8
  },
  audio: {
    id: '2', type: 'audio', fileName: 'voice.mp3', verdict: 'real',
    confidence: 88, aiProbability: 12,
    signals: [
      { name: 'Voice naturalness', value: 8, description: 'Natural micro-variations in pitch and tone consistent with human speech' },
      { name: 'Breath patterns', value: 5, description: 'Organic breathing patterns detected between sentences' },
      { name: 'Background noise', value: 14, description: 'Consistent ambient noise floor matching real environment' },
      { name: 'Formant structure', value: 11, description: 'Natural formant transitions typical of authentic human voice' },
    ],
    timestamp: new Date(), analysisTime: 2.3
  },
  text: {
    id: '3', type: 'text', verdict: 'fake',
    confidence: 79, aiProbability: 82,
    signals: [
      { name: 'Repetition patterns', value: 82, description: 'Repeated phrase structures common in LLM outputs' },
      { name: 'Perplexity score', value: 78, description: 'Low perplexity indicating predictable token generation' },
      { name: 'Burstiness', value: 71, description: 'Unusually uniform sentence length — humans vary more' },
      { name: 'Vocabulary distribution', value: 65, description: 'Word choice distribution matches GPT-4 output profile' },
    ],
    timestamp: new Date(), analysisTime: 0.9
  }
};

export default function DetectPage() {
  const [tab, setTab] = useState<Tab>('image');
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [result, setResult] = useState<DetectionResult | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) { setFile(accepted[0]); setResult(null); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: tab === 'image' ? { 'image/*': [] } : { 'audio/*': [] },
    multiple: false
  });

  const switchTab = (t: Tab) => {
    setTab(t); setFile(null); setText(''); setResult(null);
  };



const analyze = async () => {
  if (tab !== 'text' && !file) return;
  if (tab === 'text' && text.length < 20) return;

  const msgs = ['Extracting features...', 'Running detection models...', 'Cross-referencing signals...', 'Generating report...'];
  setLoading(true); setResult(null);

  let msgIdx = 0;
  setLoadingMsg(msgs[0]);
  const interval = setInterval(() => {
    msgIdx = (msgIdx + 1) % msgs.length;
    setLoadingMsg(msgs[msgIdx]);
  }, 700);

  try {
    let res;
    if (tab === 'image' && file) res = await detectAPI.image(file);
    else if (tab === 'audio' && file) res = await detectAPI.audio(file);
    else res = await detectAPI.text(text);

    const d = res.data;
    setResult({
      id: d.id,
      type: d.type,
      fileName: d.file_name,
      verdict: d.verdict,
      confidence: d.confidence,
      aiProbability: d.ai_probability,
      signals: d.signals,
      timestamp: new Date(d.timestamp),
      analysisTime: d.analysis_time,
    });
  } catch (err: any) {
    alert(err?.response?.data?.detail || 'Analysis failed. Try again.');
  } finally {
    clearInterval(interval);
    setLoading(false);
  }
};

  const canAnalyze = tab === 'text' ? text.length >= 20 : !!file;
  const isReal = result?.verdict === 'real';

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'image', label: 'Image', icon: Image },
    { key: 'audio', label: 'Audio', icon: Mic },
    { key: 'text', label: 'Text', icon: FileText },
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Analyze content</h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Upload a file or paste text to detect AI-generated content.</p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, padding: 4, borderRadius: 10,
        background: 'var(--bg-card)', border: '1px solid var(--border)', marginBottom: '1.5rem'
      }}>
        {tabs.map(t => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={() => switchTab(t.key)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '10px 16px', borderRadius: 7, border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: active ? 500 : 400,
              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: active ? 'var(--bg-primary)' : 'transparent',
              transition: 'all 0.15s'
            }}>
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Upload zone */}
      {tab !== 'text' ? (
        <div>
          {!file ? (
            <div {...getRootProps()} style={{
              border: `1.5px dashed ${isDragActive ? 'var(--accent)' : 'var(--border-strong)'}`,
              borderRadius: 12, padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer',
              background: isDragActive ? 'var(--accent-bg)' : 'var(--bg-card)',
              transition: 'all 0.2s'
            }}>
              <input {...getInputProps()} />
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
              }}>
                <Upload size={22} color="var(--text-secondary)" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>
                {isDragActive ? 'Drop it here' : `Drop ${tab === 'image' ? 'an image' : 'an audio file'} here`}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>or click to browse</p>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
                {(tab === 'image' ? ['JPG', 'PNG', 'WEBP', 'GIF'] : ['MP3', 'WAV', 'M4A', 'OGG']).map(fmt => (
                  <span key={fmt} style={{
                    fontSize: 11, padding: '3px 9px', borderRadius: 4,
                    background: 'var(--bg-primary)', border: '1px solid var(--border)',
                    color: 'var(--text-muted)', fontFamily: 'monospace'
                  }}>{fmt}</span>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '1rem 1.25rem',
              background: 'var(--bg-card)', border: '1px solid var(--accent-border)',
              borderRadius: 10
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 9, flexShrink: 0,
                background: 'var(--accent-bg)', border: '1px solid var(--accent-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {tab === 'image' ? <Image size={20} color="var(--accent)" /> : <Mic size={20} color="var(--accent)" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{formatFileSize(file.size)}</div>
              </div>
              <button onClick={() => { setFile(null); setResult(null); }} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', padding: 4, borderRadius: 6
              }}>
                <X size={18} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <textarea
            value={text} onChange={e => setText(e.target.value)}
            placeholder="Paste any text here — article, email, essay — to check if it was written by AI..."
            style={{
              width: '100%', minHeight: 180, resize: 'vertical', padding: '1rem',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, color: 'var(--text-primary)', fontSize: 15,
              fontFamily: 'inherit', outline: 'none', lineHeight: 1.6, transition: 'border-color 0.15s'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right', marginTop: 6 }}>
            {text.length.toLocaleString()} / 10,000 characters
          </div>
        </div>
      )}

      {/* Analyze button */}
      <button onClick={analyze} disabled={!canAnalyze || loading} style={{
        width: '100%', marginTop: '1rem', padding: '13px',
        borderRadius: 10, border: 'none', cursor: canAnalyze && !loading ? 'pointer' : 'not-allowed',
        background: canAnalyze && !loading ? 'var(--accent)' : 'var(--border)',
        color: canAnalyze && !loading ? 'white' : 'var(--text-muted)',
        fontSize: 15, fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
        transition: 'all 0.15s'
      }}>
        {loading ? (
          <><Loader2 size={18} style={{ animation: 'spin 0.7s linear infinite' }} />{loadingMsg}</>
        ) : (
          <><Shield size={17} />Analyze now</>
        )}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Result */}
      {result && (
        <div style={{
          marginTop: '1.5rem', borderRadius: 12, overflow: 'hidden',
          border: `1px solid ${isReal ? 'var(--success-border)' : 'var(--danger-border)'}`,
          background: 'var(--bg-card)'
        }}>
          {/* Header */}
          <div style={{
            padding: '1.25rem 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: isReal ? 'var(--success-bg)' : 'var(--danger-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {isReal
                  ? <CheckCircle size={22} color="var(--success)" />
                  : <AlertTriangle size={22} color="var(--danger)" />
                }
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {isReal ? 'Likely authentic' : 'AI-generated detected'}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {isReal ? 'No significant AI markers found' : 'High probability this is synthetic content'}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
                {result.confidence}%
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>confidence</div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '1.25rem 1.5rem' }}>
            {/* AI probability bar */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                <span>AI probability</span>
                <span style={{ fontWeight: 500 }}>{result.aiProbability}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: 'var(--bg-primary)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 4, width: `${result.aiProbability}%`,
                  background: isReal ? 'var(--success)' : 'var(--danger)',
                  transition: 'width 0.8s cubic-bezier(.22,.68,0,1.2)'
                }} />
              </div>
            </div>

            {/* Signals */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
              {result.signals.map((sig, i) => {
                const level = sig.value > 70 ? 'high' : sig.value > 40 ? 'mid' : 'low';
                const color = level === 'high' ? 'var(--danger)' : level === 'mid' ? 'var(--warning)' : 'var(--success)';
                return (
                  <div key={i} style={{
                    padding: 12, borderRadius: 9, background: 'var(--bg-primary)',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sig.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color }}>{sig.value}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: 'var(--border)', overflow: 'hidden', marginBottom: 8 }}>
                      <div style={{ height: '100%', width: `${sig.value}%`, background: color, borderRadius: 2 }} />
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{sig.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '0.9rem 1.5rem', borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'var(--bg-primary)', flexWrap: 'wrap', gap: 8
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Analyzed in {result.analysisTime}s
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Copy report', 'Download PDF'].map(label => (
                <button key={label} style={{
                  padding: '6px 13px', borderRadius: 7, fontSize: 13,
                  border: '1px solid var(--border)', background: 'var(--bg-card)',
                  color: 'var(--text-secondary)', cursor: 'pointer'
                }}>{label}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}