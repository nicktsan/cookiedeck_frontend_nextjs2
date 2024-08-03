import '../globals.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main className="flex min-h-screen flex-col items-center">{children}</main>
    </div>
  );
}
