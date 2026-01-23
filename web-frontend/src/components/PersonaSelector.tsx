import {
  User,
  Users,
  Eye,
  FileCheck,
  Award,
  Shield,
  LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Persona = "owner" | "nominee" | "access_nominee" | "reviewer" | "verifier" | "issuer";

interface PersonaCardProps {
  persona: Persona;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const personaConfig: Record<
  Persona,
  {
    icon: LucideIcon;
    title: string;
    description: string;
    color: string;
    bgColor: string;
  }
> = {
  owner: {
    icon: User,
    title: "Owner",
    description: "Create and manage cases, assign nominees, control assets",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  nominee: {
    icon: Users,
    title: "Nominee",
    description: "Receive authorized assets after release approval",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  access_nominee: {
    icon: Eye,
    title: "Access Nominee",
    description: "Submit triggers and upload evidence for cases",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  reviewer: {
    icon: FileCheck,
    title: "Reviewer",
    description: "Review evidence and accept or reject submissions",
    color: "text-pending",
    bgColor: "bg-pending/10",
  },
  verifier: {
    icon: Shield,
    title: "Verifier",
    description: "Verify reviews and authorize asset release",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  issuer: {
    icon: Award,
    title: "Issuer",
    description: "Issue and manage verifiable certificates",
    color: "text-success",
    bgColor: "bg-success/10",
  },
};

export function PersonaCard({
  persona,
  isActive = false,
  onClick,
  className,
}: PersonaCardProps) {
  const config = personaConfig[persona];
  const Icon = config.icon;

  return (
    <Card
      variant={isActive ? "glow" : "glass"}
      className={cn(
        "cursor-pointer hover:scale-[1.02] transition-all duration-300",
        isActive && "ring-2 ring-primary",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", config.bgColor)}>
            <Icon className={cn("w-5 h-5", config.color)} />
          </div>
          <CardTitle className="text-lg">{config.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">
          {config.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

interface PersonaSelectorProps {
  selectedPersona?: Persona;
  onSelect?: (persona: Persona) => void;
  className?: string;
}

export function PersonaSelector({
  selectedPersona,
  onSelect,
  className,
}: PersonaSelectorProps) {
  const personas: Persona[] = [
    "owner",
    "nominee",
    "access_nominee",
    "reviewer",
    "verifier",
    "issuer",
  ];

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {personas.map((persona) => (
        <PersonaCard
          key={persona}
          persona={persona}
          isActive={selectedPersona === persona}
          onClick={() => onSelect?.(persona)}
        />
      ))}
    </div>
  );
}
