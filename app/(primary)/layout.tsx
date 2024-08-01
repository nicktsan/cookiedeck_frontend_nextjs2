import "../globals.css";
import Header from "@/components/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
        <Header />
        <main className="min-h-screen flex flex-col">
            {children}
        </main>
    </div>
  );
}
