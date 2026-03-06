"use client";

import { motion } from "framer-motion";
import { cn } from "@/app/utils/cn";

interface SegmentedControlProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps) {
  return (
    <div
      className={cn(
        "relative inline-flex h-12 rounded-full bg-secondary p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]",
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "relative flex h-full items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors z-10",
            value === option.value
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {value === option.value && (
            <motion.div
              layoutId="segmented-control-active"
              className="absolute inset-0 rounded-full bg-white shadow-sm"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{ zIndex: -1 }}
            />
          )}
          {option.label}
        </button>
      ))}
    </div>
  );
}
