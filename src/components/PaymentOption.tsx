import { cn } from "@/app/utils/cn";

export interface PaymentOptionProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}

export function PaymentOption({
  id,
  title,
  description,
  icon,
  selected,
  onSelect,
}: PaymentOptionProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "relative flex cursor-pointer rounded-lg border bg-card p-4 shadow-sm hover:border-primary",
        selected ? "border-primary ring-1 ring-primary" : "border-border",
      )}
      onClick={onSelect}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          <div className="text-sm">
            <p
              id={`${id}-label`}
              className={cn(
                "font-medium  text-card-foreground",
                selected ? "text-primary " : "text-foreground",
              )}
            >
              {title}
            </p>
            <p
              id={`${id}-description-0`}
              className="text-muted-foreground mt-1"
            >
              {description}
            </p>
          </div>
        </div>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-secondary/50",
            selected ? "bg-primary/20 text-primary" : "text-muted-foreground",
          )}
        >
          {icon}
        </div>
      </div>
      <input
        type="radio"
        name="payment-method"
        id={id}
        className="sr-only"
        checked={selected}
        onChange={onSelect}
      />
    </label>
  );
}
