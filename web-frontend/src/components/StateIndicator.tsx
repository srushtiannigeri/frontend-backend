import { Shield, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StateIndicatorProps {
  state: "draft" | "active" | "pending" | "review" | "verified" | "released" | "rejected" | "revoked";
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface StateConfig {
  icon: typeof Shield;
  label: string;
  color: string;
  bg: string;
  ring: string;
  animate?: boolean;
}

const stateConfig: Record<StateIndicatorProps["state"], StateConfig> = {
  draft: {
    icon: Shield,
    label: "Draft",
    color: "text-muted-foreground",
    bg: "bg-muted",
    ring: "ring-muted-foreground/30",
  },
  active: {
    icon: Lock,
    label: "Active",
    color: "text-primary",
    bg: "bg-primary/10",
    ring: "ring-primary/30",
    animate: true,
  },
  pending: {
    icon: AlertCircle,
    label: "Pending",
    color: "text-pending",
    bg: "bg-pending/10",
    ring: "ring-pending/30",
    animate: true,
  },
  review: {
    icon: AlertCircle,
    label: "Under Review",
    color: "text-warning",
    bg: "bg-warning/10",
    ring: "ring-warning/30",
  },
  verified: {
    icon: CheckCircle2,
    label: "Verified",
    color: "text-success",
    bg: "bg-success/10",
    ring: "ring-success/30",
  },
  released: {
    icon: CheckCircle2,
    label: "Released",
    color: "text-success",
    bg: "bg-success/20",
    ring: "ring-success/50",
  },
  rejected: {
    icon: AlertCircle,
    label: "Rejected",
    color: "text-destructive",
    bg: "bg-destructive/10",
    ring: "ring-destructive/30",
  },
  revoked: {
    icon: AlertCircle,
    label: "Revoked",
    color: "text-destructive",
    bg: "bg-destructive/20",
    ring: "ring-destructive/50",
  },
};

const sizeConfig = {
  sm: { icon: "w-3 h-3", container: "p-1.5", text: "text-xs" },
  md: { icon: "w-4 h-4", container: "p-2", text: "text-sm" },
  lg: { icon: "w-5 h-5", container: "p-2.5", text: "text-base" },
};

export function StateIndicator({
  state,
  showLabel = true,
  size = "md",
  className,
}: StateIndicatorProps) {
  const config = stateConfig[state];
  const sizes = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "rounded-full ring-2 flex items-center justify-center",
          config.bg,
          config.ring,
          sizes.container,
          config.animate && "animate-pulse-glow"
        )}
      >
        <Icon className={cn(sizes.icon, config.color)} />
      </div>
      {showLabel && (
        <span className={cn("font-medium", config.color, sizes.text)}>
          {config.label}
        </span>
      )}
    </div>
  );
}
