import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DailyForecast, TempUnit } from "@/types/weather";
import { formatTemp } from "@/lib/weather-utils";
import { getWeatherIconUrl } from "@/lib/weather-api";
import { cn } from "@/lib/utils";

interface DateNavigatorProps {
  forecasts: DailyForecast[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  unit: TempUnit;
}

export function DateNavigator({ forecasts, selectedIndex, onSelect, unit }: DateNavigatorProps) {
  const canPrev = selectedIndex > 0;
  const canNext = selectedIndex < forecasts.length - 1;

  const scrollRef = (el: HTMLDivElement | null) => {
    if (el) {
      const activeBtn = el.querySelector<HTMLButtonElement>("[data-active='true']");
      activeBtn?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
  };

  return (
    <div className="bg-card border border-card-border rounded-2xl shadow-md p-4" data-testid="date-navigator">
      <div className="flex items-center gap-2">
        <button
          onClick={() => canPrev && onSelect(selectedIndex - 1)}
          disabled={!canPrev}
          className={cn(
            "shrink-0 rounded-lg p-2 transition-colors",
            canPrev
              ? "hover:bg-muted text-foreground"
              : "text-muted-foreground/30 cursor-not-allowed"
          )}
          data-testid="button-prev-day"
          aria-label="Previous day"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto flex gap-2 scrollbar-hide pb-1"
          data-testid="day-tabs-scroll"
          style={{ scrollbarWidth: "none" }}
        >
          {forecasts.map((day, idx) => {
            const isActive = idx === selectedIndex;
            const iconUrl = getWeatherIconUrl(day.dominantWeather.icon);
            const [weekday, ...rest] = day.dateLabel.split(", ");

            return (
              <button
                key={day.date}
                data-active={isActive}
                onClick={() => onSelect(idx)}
                className={cn(
                  "shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all duration-200 min-w-[80px] border",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "hover:bg-muted/60 text-foreground border-transparent hover:border-border"
                )}
                data-testid={`day-tab-${idx}`}
              >
                <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
                  {weekday}
                </span>
                <img src={iconUrl} alt={day.dominantWeather.description} className="w-8 h-8" />
                <span className="text-sm font-bold">
                  {formatTemp(day.avgTemp, unit)}
                </span>
                <span className="text-[10px] opacity-70 text-center leading-tight">
                  {rest.join(", ")}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => canNext && onSelect(selectedIndex + 1)}
          disabled={!canNext}
          className={cn(
            "shrink-0 rounded-lg p-2 transition-colors",
            canNext
              ? "hover:bg-muted text-foreground"
              : "text-muted-foreground/30 cursor-not-allowed"
          )}
          data-testid="button-next-day"
          aria-label="Next day"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
