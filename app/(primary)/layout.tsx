import '../globals.css';
import Header from '@/components/Header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className="flex min-h-screen flex-col">{children}</main>
    </div>
  );
}
