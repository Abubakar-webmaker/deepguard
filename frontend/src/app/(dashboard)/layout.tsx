import Navbar from '@/components/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 1rem' }} className="md:p-8 lg:px-6">
        {children}
      </main>
    </div>
  );
}