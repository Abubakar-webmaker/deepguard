import axios from 'axios';

// ─── Types ──────────────────────────────────────────────
export type DetectionType = 'image' | 'audio' | 'text';
export type Verdict = 'real' | 'fake' | 'uncertain';

export interface Signal {
  name: string;
  value: number;
  description: string;
}

export interface DetectionResult {
  id: string;
  type: DetectionType;
  fileName?: string;
  verdict: Verdict;
  confidence: number;
  aiProbability: number;
  signals: Signal[];
  timestamp: Date;
  analysisTime: number;
}

// ─── Helper Functions ───────────────────────────────────
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

// ─── API Client ─────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000,
});

// Har request mein token auto-attach
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 pe auto-logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ───────────────────────────────────────────────
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  me: () => api.get('/auth/me'),
};

// ─── Detection ──────────────────────────────────────────
export const detectAPI = {
  image: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/detect/image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  audio: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/detect/audio', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  text: (text: string) => {
    const form = new FormData();
    form.append('text', text);
    return api.post('/detect/text', form);
  },
};

// ─── History ────────────────────────────────────────────
export const historyAPI = {
  getAll: (params?: { page?: number; type?: string; verdict?: string }) =>
    api.get('/history/', { params }),

  getStats: () => api.get('/history/stats'),

  delete: (id: string) => api.delete(`/history/${id}`),
};

export default api;