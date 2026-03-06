"use client";

import { cn } from "@/app/utils/cn";

interface StepperProps {
  count: number;
  activeStep: number;
  onStepChange: (step: number) => void;
  className?: string;
}

export function VisitorStepper({
  count,
  activeStep,
  onStepChange,
  className,
}: StepperProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {Array.from({ length: count }).map((_, index) => {
        const isActive = activeStep === index;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onStepChange(index)}
            className={cn(
              "flex h-10 items-center justify-center rounded-full px-4 text-sm font-bold transition-all",
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "border-2 border-[#f0f0f0] bg-[#fafafa]/50 text-muted-foreground hover:border-input hover:bg-background",
            )}
          >
            <div
              className={cn(
                "mr-2 h-4 w-4 rounded-full border-2",
                isActive
                  ? "border-primary-foreground bg-primary-foreground"
                  : "border-muted-foreground",
              )}
            />
            Visitor {index + 1}
          </button>
        );
      })}

      {/* Visual Add Button stub to match reference style */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#f0f0f0] bg-[#fafafa]/50" />
    </div>
  );
}
