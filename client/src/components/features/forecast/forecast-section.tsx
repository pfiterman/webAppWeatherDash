import { ForecastTable } from "@/components/features/forecast/forecast-table";
import { DateNavigator } from "@/components/features/forecast/date-navigator";
import {
  ForecastSkeleton,
  DateNavigatorSkeleton,
} from "@/components/features/dashboard/loading-skeleton";
import { ForecastState, TempUnit } from "@/types/weather.types";
import { AlertCircle } from "lucide-react";

const ForecastSection = ({
  forecastState,
  selectedDayIndex,
  unit,
  onSelectDay,
  onHide,
  onRetry,
}: {
  forecastState: ForecastState;
  selectedDayIndex: number;
  unit: TempUnit;
  onSelectDay: (i: number) => void;
  onHide: () => void;
  onRetry: () => void;
}) => (
  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold text-foreground">5-Day Forecast</h2>
      <button
        onClick={onHide}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        data-testid="button-hide-forecast"
      >
        Hide
      </button>
    </div>

    {forecastState.loading && (
      <>
        <DateNavigatorSkeleton />
        <ForecastSkeleton />
      </>
    )}

    {forecastState.error && !forecastState.loading && (
      <div
        className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-2xl px-5 py-4"
        data-testid="error-forecast"
      >
        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-destructive">
            Unable to load forecast
          </p>
          <p className="text-sm text-destructive/80 mt-0.5">
            {forecastState.error}
          </p>
          <button
            onClick={onRetry}
            className="mt-2 text-sm text-destructive underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    )}

    {!forecastState.loading && forecastState.dailyForecasts.length > 0 && (
      <>
        <DateNavigator
          forecasts={forecastState.dailyForecasts}
          selectedIndex={selectedDayIndex}
          onSelect={onSelectDay}
          unit={unit}
        />
        <ForecastTable
          forecasts={forecastState.dailyForecasts}
          unit={unit}
          selectedDayIndex={selectedDayIndex}
        />
      </>
    )}
  </div>
);

export default ForecastSection;
