import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Dashboard } from "@/components/Dashboard";
import { Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <Dashboard />

        {/* Footer */}
        <footer className="py-12 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-primary">
                  <Shield className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-gradient">Certisure</span>
              </div>

              <nav className="flex items-center gap-6">
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentation
                </a>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Discord
                </a>
              </nav>

              <p className="text-sm text-muted-foreground">
                © 2026 Certisure. Trust through cryptography.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
