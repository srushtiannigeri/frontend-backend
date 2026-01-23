import { Shield, Lock, FileCheck, Zap, Globe, Key } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  style?: React.CSSProperties;
}

function FeatureCard({ icon, title, description, className, style }: FeatureCardProps) {
  return (
    <Card
      style={style}
      variant="glass"
      className={cn(
        "hover:scale-[1.02] hover:glow-primary transition-all duration-300",
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="p-3 rounded-xl bg-primary/10 w-fit mb-3">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

export function Features() {
  const features = [
    {
      icon: <Lock className="w-6 h-6 text-primary" />,
      title: "Client-Side Encryption",
      description:
        "Files are encrypted in your browser. Plaintext never reaches our servers. Only authorized parties can decrypt.",
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Protocol-Enforced Security",
      description:
        "Smart contracts define truth, order, and authority. No single layer can break security.",
    },
    {
      icon: <FileCheck className="w-6 h-6 text-primary" />,
      title: "Multi-Party Verification",
      description:
        "Reviewers, verifiers, and witnesses ensure proper authorization before any release.",
    },
    {
      icon: <Key className="w-6 h-6 text-primary" />,
      title: "Event-Gated Access",
      description:
        "Decryption keys are only available after on-chain authorization events.",
    },
    {
      icon: <Globe className="w-6 h-6 text-primary" />,
      title: "Verifiable Certificates",
      description:
        "Issue tamper-proof certificates that anyone can verify with a simple QR scan.",
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Real-Time State Sync",
      description:
        "UI state is derived from blockchain events via indexer. Always in sync with truth.",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trust Architecture, <span className="text-gradient">Not Promises</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Certisure separates concerns across protocol, crypto, backend, and frontend
            layers—so no single point of failure can compromise security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
