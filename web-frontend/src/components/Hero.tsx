import { ArrowRight, Shield, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/WalletConnect";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-glow blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-glow blur-3xl opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Trust Protocol for Digital Assets</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            Secure Your Legacy with{" "}
            <span className="text-gradient">Certisure</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
            A blockchain-powered trust protocol with client-side encryption.
            Your assets are protected by cryptography, not promises.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <WalletConnect />
            <Button variant="outline" size="lg" className="gap-2">
              Learn More
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4 text-primary" />
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>Protocol Enforced</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Multi-Party Verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
