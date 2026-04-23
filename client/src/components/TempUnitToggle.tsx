import type { TempUnit } from "@/types/weather.types";
import { cn } from "@/lib/utils";

interface TempUnitToggleProps {
  unit: TempUnit;
  onChange: (unit: TempUnit) => void;
}

export function TempUnitToggle({ unit, onChange }: TempUnitToggleProps) {
  return (
    <div
      className="flex items-center bg-muted rounded-lg p-1 gap-1"
      role="group"
      aria-label="Temperature unit"
      data-testid="temp-unit-toggle"
    >
      <button
        onClick={() => onChange("celsius")}
        className={cn(
          "px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200",
          unit === "celsius"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
        data-testid="button-celsius"
        aria-pressed={unit === "celsius"}
      >
        °C
      </button>
      <button
        onClick={() => onChange("fahrenheit")}
        className={cn(
          "px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200",
          unit === "fahrenheit"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
        data-testid="button-fahrenheit"
        aria-pressed={unit === "fahrenheit"}
      >
        °F
      </button>
    </div>
  );
}
