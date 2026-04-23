import { CloudSun, AlertCircle, ChevronDown, BarChart2 } from "lucide-react";
import { CurrentWeatherCard } from "@/components/CurrentWeatherCard";
import { ForecastTable } from "@/components/ForecastTable";
import { DateNavigator } from "@/components/DateNavigator";
import { TempUnitToggle } from "@/components/TempUnitToggle";
import {
  CurrentWeatherSkeleton,
  ForecastSkeleton,
  DateNavigatorSkeleton,
} from "@/components/LoadingSkeleton";
import { useWeatherDashboard, CITIES } from "@/hooks/useWeatherDashboard";
import { ForecastState, TempUnit } from "@/types/weather.types";

const EmptyState = () => (
  <div className="text-center py-20 space-y-4" data-testid="empty-state">
    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
      <CloudSun className="h-10 w-10 text-primary" />
    </div>
    <h2 className="text-2xl font-bold text-foreground">
      Your Weather Dashboard
    </h2>
    <p className="text-muted-foreground max-w-xs mx-auto">
      Select a city from the dropdown above to see current conditions and the
      5-day forecast.
    </p>
  </div>
);

const WeatherError = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div
    className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-2xl px-5 py-4"
    data-testid="error-weather"
  >
    <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
    <div>
      <p className="font-medium text-destructive">Unable to load weather</p>
      <p className="text-sm text-destructive/80 mt-0.5">{message}</p>
      <button
        onClick={onRetry}
        className="mt-2 text-sm text-destructive underline hover:no-underline"
      >
        Try again
      </button>
    </div>
  </div>
);

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

export function WeatherDashboard() {
  const {
    selectedCity,
    unit,
    showForecast,
    selectedDayIndex,
    weather,
    forecastState,
    setUnit,
    setSelectedDayIndex,
    handleCitySelect,
    handleSeeForecast,
    handleRetryWeather,
    handleRetryForecast,
  } = useWeatherDashboard();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = CITIES.find((c) => c.name === e.target.value);
    if (city) handleCitySelect(city);
  };

  return (
    <div className="min-h-screen bg-background" data-testid="weather-dashboard">
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <CloudSun className="h-6 w-6 text-primary" />
            <span className="font-bold text-foreground text-lg hidden sm:block">
              WeatherForecast
            </span>
          </div>

          <div className="relative shrink-0">
            <select
              value={selectedCity?.name ?? ""}
              onChange={handleSelectChange}
              disabled={weather.loading}
              data-testid="select-city"
              className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium shadow-sm cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
            >
              <option value="" disabled>
                Select a city...
              </option>
              {CITIES.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}, {city.country}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <TempUnitToggle unit={unit} onChange={setUnit} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {!selectedCity && !weather.loading && <EmptyState />}

        {weather.loading && <CurrentWeatherSkeleton />}

        {weather.error && !weather.loading && (
          <WeatherError message={weather.error} onRetry={handleRetryWeather} />
        )}

        {weather.data && !weather.loading && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CurrentWeatherCard weather={weather.data} unit={unit} />
            {!showForecast && (
              <button
                onClick={handleSeeForecast}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 text-primary font-semibold text-sm transition-all duration-200"
                data-testid="button-see-forecast"
              >
                <BarChart2 className="h-4 w-4" />
                See 5-Day Forecast &amp; Hourly Breakdown
                <ChevronDown className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {showForecast && (
          <ForecastSection
            forecastState={forecastState}
            selectedDayIndex={selectedDayIndex}
            unit={unit}
            onSelectDay={setSelectedDayIndex}
            onHide={() => useWeatherDashboard}
            onRetry={handleRetryForecast}
          />
        )}
      </main>

      <footer className="border-t border-border/40 mt-12 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by{" "}
          <a
            href="https://openweathermap.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            OpenWeatherMap
          </a>
        </p>
      </footer>
    </div>
  );
}
