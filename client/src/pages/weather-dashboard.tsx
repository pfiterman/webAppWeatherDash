import { CloudSun, ChevronDown, BarChart2 } from "lucide-react";
import { CurrentWeatherCard } from "@/components/features/weather/current-weather-card";

import { TempUnitToggle } from "@/components/features/dashboard/temp-unit-toggle";
import { CurrentWeatherSkeleton } from "@/components/features/dashboard/loading-skeleton";
import { useWeatherDashboard, CITIES } from "@/hooks/use-weather-dashboard";
import { Spinner } from "@/components/ui/spinner";

import WeatherError from "@/components/features/weather/weather-error";
import ForecastSection from "@/components/features/forecast/forecast-section";

import { ErrorBoundary } from "@/components/core/error-boundary";

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

export function WeatherDashboard() {
  const {
    selectedCity,
    unit,
    showForecast,
    selectedDayIndex,
    weather,
    forecastState,
    setUnit,
    setShowForecast,
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
              WeatherDash
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

            {weather.loading ? (
              <Spinner className="absolute right-3 top-1/2 -translate-y-1/2" />
            ) : (
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}
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
            <ErrorBoundary>
              <CurrentWeatherCard weather={weather.data} unit={unit} />
            </ErrorBoundary>

            {!showForecast && (
              <button
                onClick={handleSeeForecast}
                disabled={forecastState.loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 text-primary font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                data-testid="button-see-forecast"
              >
                {forecastState.loading ? (
                  <>
                    <Spinner />
                    Loading forecast...
                  </>
                ) : (
                  <>
                    <BarChart2 className="h-4 w-4" />
                    See 5-Day Forecast &amp; Hourly Breakdown
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {showForecast && (
          <ErrorBoundary>
            <ForecastSection
              forecastState={forecastState}
              selectedDayIndex={selectedDayIndex}
              unit={unit}
              onSelectDay={setSelectedDayIndex}
              onHide={() => setShowForecast(false)}
              onRetry={handleRetryForecast}
            />
          </ErrorBoundary>
        )}
      </main>
    </div>
  );
}
