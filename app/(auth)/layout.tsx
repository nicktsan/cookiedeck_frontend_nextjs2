import "../globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
        <main className="min-h-screen flex flex-col items-center">
            {children}
        </main>
    </div>
  );
}
