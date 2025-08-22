import { useAuth } from "@/contexts/AuthContext";
import { AuthForms } from "@/components/AuthForms";
import { SimpleSidebar } from "@/components/SimpleSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();

  if (!user) {
    return <AuthForms />;
  }

  return (
    <div className="min-h-screen flex w-full">
      <SimpleSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-border bg-background flex items-center px-4">
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-foreground">Rating Voyage</h2>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
