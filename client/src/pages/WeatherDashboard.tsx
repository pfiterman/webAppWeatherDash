import { useState, useEffect, useCallback } from "react";
import { CloudSun, AlertCircle, ChevronDown, BarChart2 } from "lucide-react";
import type {
  CurrentWeather,
  ForecastResponse,
  DailyForecast,
  TempUnit,
  GeoCity,
} from "@/types/weather.types";
import { getCurrentWeather, getForecast } from "@/lib/weather-api";
import { groupForecastByDay } from "@/lib/weather-utils";
import { saveLastCity, loadLastCity } from "@/lib/storage";
import { CurrentWeatherCard } from "@/components/CurrentWeatherCard";
import { ForecastTable } from "@/components/ForecastTable";
import { DateNavigator } from "@/components/DateNavigator";
import { TempUnitToggle } from "@/components/TempUnitToggle";
import {
  CurrentWeatherSkeleton,
  ForecastSkeleton,
  DateNavigatorSkeleton,
} from "@/components/LoadingSkeleton";

const CITIES: GeoCity[] = [
  { id: 6167865, name: "Toronto", country: "CA", lat: 43.7001, lon: -79.4163 },
  { id: 6094817, name: "Ottawa", country: "CA", lat: 45.4215, lon: -75.6972 },
  { id: 1850147, name: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
];

export function WeatherDashboard() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null,
  );
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [dailyForecasts, setDailyForecasts] = useState<DailyForecast[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedCity, setSelectedCity] = useState<GeoCity | null>(null);
  const [unit, setUnit] = useState<TempUnit>("celsius");
  const [showForecast, setShowForecast] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [forecastError, setForecastError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (city: GeoCity) => {
    setLoadingWeather(true);
    setWeatherError(null);
    setCurrentWeather(null);
    try {
      const data = await getCurrentWeather(city.id);
      setCurrentWeather(data);
    } catch (err) {
      setWeatherError(
        err instanceof Error ? err.message : "Failed to fetch weather data",
      );
    } finally {
      setLoadingWeather(false);
    }
  }, []);

  const fetchForecast = useCallback(async (city: GeoCity) => {
    setLoadingForecast(true);
    setForecastError(null);
    setForecast(null);
    setDailyForecasts([]);
    try {
      const data = await getForecast(city.id);
      setForecast(data);
      const grouped = groupForecastByDay(data.list);
      setDailyForecasts(grouped);
      setSelectedDayIndex(0);
    } catch (err) {
      setForecastError(
        err instanceof Error ? err.message : "Failed to fetch forecast data",
      );
    } finally {
      setLoadingForecast(false);
    }
  }, []);

  const handleCitySelect = useCallback(
    (city: GeoCity) => {
      setSelectedCity(city);
      setShowForecast(false);
      setForecast(null);
      setDailyForecasts([]);
      saveLastCity({
        name: city.name,
        country: city.country,
        lat: city.lat,
        lon: city.lon,
      });
      fetchWeather(city);
    },
    [fetchWeather],
  );

  const handleSeeForecast = useCallback(() => {
    if (!selectedCity) return;
    setShowForecast(true);
    if (!forecast) fetchForecast(selectedCity);
  }, [selectedCity, forecast, fetchForecast]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = CITIES.find((c) => c.name === e.target.value);
    if (city) handleCitySelect(city);
  };

  useEffect(() => {
    const lastCity = loadLastCity();
    const match = lastCity
      ? CITIES.find((c) => c.name === lastCity.name)
      : null;
    if (match) {
      setSelectedCity(match);
      fetchWeather(match);
    }
  }, [fetchWeather]);

  const isLoading = loadingWeather;

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
              disabled={isLoading}
              data-testid="select-city"
              className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium shadow-sm cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
            >
              <option value="" disabled>
                Select a city...
              </option>
              {CITIES.map((city) => (
                <option key={city.name} value={city.name}>
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
        {!selectedCity && !isLoading && (
          <div
            className="text-center py-20 space-y-4"
            data-testid="empty-state"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
              <CloudSun className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Your Weather Dashboard
            </h2>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Select a city from the dropdown above to see current conditions
              and the 5-day forecast.
            </p>
          </div>
        )}

        {loadingWeather && <CurrentWeatherSkeleton />}

        {weatherError && !loadingWeather && (
          <div
            className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-2xl px-5 py-4"
            data-testid="error-weather"
          >
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">
                Unable to load weather
              </p>
              <p className="text-sm text-destructive/80 mt-0.5">
                {weatherError}
              </p>
              <button
                onClick={() => selectedCity && fetchWeather(selectedCity)}
                className="mt-2 text-sm text-destructive underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {currentWeather && !loadingWeather && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CurrentWeatherCard weather={currentWeather} unit={unit} />

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
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                5-Day Forecast
              </h2>
              <button
                onClick={() => setShowForecast(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-hide-forecast"
              >
                Hide
              </button>
            </div>

            {loadingForecast && (
              <>
                <DateNavigatorSkeleton />
                <ForecastSkeleton />
              </>
            )}

            {forecastError && !loadingForecast && (
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
                    {forecastError}
                  </p>
                  <button
                    onClick={() => selectedCity && fetchForecast(selectedCity)}
                    className="mt-2 text-sm text-destructive underline hover:no-underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {!loadingForecast && dailyForecasts.length > 0 && (
              <>
                <DateNavigator
                  forecasts={dailyForecasts}
                  selectedIndex={selectedDayIndex}
                  onSelect={setSelectedDayIndex}
                  unit={unit}
                />
                <ForecastTable
                  forecasts={dailyForecasts}
                  unit={unit}
                  selectedDayIndex={selectedDayIndex}
                />
              </>
            )}
          </div>
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
