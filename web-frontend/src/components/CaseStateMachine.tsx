import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CaseState =
  | "draft"
  | "active"
  | "trigger_submitted"
  | "under_review"
  | "verified"
  | "release_authorized"
  | "released";

interface CaseStateMachineProps {
  currentState: CaseState;
  className?: string;
}

const states: { key: CaseState; label: string }[] = [
  { key: "draft", label: "Draft" },
  { key: "active", label: "Active" },
  { key: "trigger_submitted", label: "Trigger Submitted" },
  { key: "under_review", label: "Under Review" },
  { key: "verified", label: "Verified" },
  { key: "release_authorized", label: "Release Authorized" },
  { key: "released", label: "Released" },
];

const stateIndex = (state: CaseState) =>
  states.findIndex((s) => s.key === state);

export function CaseStateMachine({
  currentState,
  className,
}: CaseStateMachineProps) {
  const currentIndex = stateIndex(currentState);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between relative">
        {/* Connection line */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-border -translate-y-1/2" />
        <div
          className="absolute left-0 top-1/2 h-0.5 bg-primary -translate-y-1/2 transition-all duration-500"
          style={{
            width: `${(currentIndex / (states.length - 1)) * 100}%`,
          }}
        />

        {states.map((state, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div
              key={state.key}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2 transition-all duration-300",
                  isCompleted && "bg-primary border-primary",
                  isCurrent &&
                    "bg-primary border-primary ring-4 ring-primary/20 animate-pulse-glow",
                  isPending && "bg-background border-muted-foreground/50"
                )}
              />
              <span
                className={cn(
                  "absolute -bottom-6 text-xs font-medium whitespace-nowrap transition-colors",
                  isCompleted && "text-primary",
                  isCurrent && "text-primary",
                  isPending && "text-muted-foreground"
                )}
              >
                {state.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground">Current State:</span>
        <Badge
          variant={
            currentState === "released"
              ? "released"
              : currentState === "release_authorized"
              ? "verified"
              : currentState === "verified"
              ? "verified"
              : currentState === "under_review"
              ? "review"
              : "active"
          }
        >
          {states.find((s) => s.key === currentState)?.label}
        </Badge>
      </div>
    </div>
  );
}
