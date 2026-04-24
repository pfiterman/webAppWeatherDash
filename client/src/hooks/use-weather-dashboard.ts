import { useState, useCallback, useRef, useEffect } from "react";
import type {
  TempUnit,
  GeoCity,
  WeatherState,
  ForecastState,
} from "@/types/weather.types";
import { getCurrentWeather, getForecast } from "@/lib/weather-api";
import { groupForecastByDay } from "@/lib/weather-utils";
import { saveLastCity, loadLastCity } from "@/lib/storage";

export const CITIES: GeoCity[] = [
  { id: 6167865, name: "Toronto", country: "CA", lat: 43.7001, lon: -79.4163 },
  { id: 6094817, name: "Ottawa", country: "CA", lat: 45.4215, lon: -75.6972 },
  { id: 1850147, name: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
];

const getInitialCity = (): GeoCity | null => {
  const lastCity = loadLastCity();
  return lastCity
    ? (CITIES.find((c) => c.name === lastCity.name) ?? null)
    : null;
};

export const useWeatherDashboard = () => {
  const initialCity = getInitialCity();
  const initialized = useRef(false);

  const [selectedCity, setSelectedCity] = useState<GeoCity | null>(initialCity);
  const [unit, setUnit] = useState<TempUnit>("celsius");
  const [showForecast, setShowForecast] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const [weather, setWeather] = useState<WeatherState>({
    data: null,
    loading: false,
    error: null,
  });

  const [forecastState, setForecastState] = useState<ForecastState>({
    data: null,
    dailyForecasts: [],
    loading: false,
    error: null,
  });

  const fetchWeather = useCallback(async (city: GeoCity) => {
    setWeather({ data: null, loading: true, error: null });
    try {
      const data = await getCurrentWeather(city.id);
      setWeather({ data, loading: false, error: null });
    } catch (err) {
      setWeather({
        data: null,
        loading: false,
        error:
          err instanceof Error ? err.message : "Failed to fetch weather data",
      });
    }
  }, []);

  const fetchForecast = useCallback(async (city: GeoCity) => {
    setForecastState({
      data: null,
      dailyForecasts: [],
      loading: true,
      error: null,
    });
    try {
      const data = await getForecast(city.id);
      const dailyForecasts = groupForecastByDay(data.list);
      setForecastState({ data, dailyForecasts, loading: false, error: null });
      setSelectedDayIndex(0);
    } catch (err) {
      setForecastState({
        data: null,
        dailyForecasts: [],
        loading: false,
        error:
          err instanceof Error ? err.message : "Failed to fetch forecast data",
      });
    }
  }, []);

  const handleCitySelect = useCallback(
    (city: GeoCity) => {
      setSelectedCity(city);
      setShowForecast(false);
      setForecastState({
        data: null,
        dailyForecasts: [],
        loading: false,
        error: null,
      });
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
    if (!forecastState.data) fetchForecast(selectedCity);
  }, [selectedCity, forecastState.data, fetchForecast]);

  const handleRetryWeather = useCallback(() => {
    if (selectedCity) fetchWeather(selectedCity);
  }, [selectedCity, fetchWeather]);

  const handleRetryForecast = useCallback(() => {
    if (selectedCity) fetchForecast(selectedCity);
  }, [selectedCity, fetchForecast]);

  // Initial fetch — runs once after mount, ref prevents double-fire in Strict Mode
  useEffect(() => {
    if (initialized.current || !initialCity) return;
    initialized.current = true;
    fetchWeather(initialCity);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // State
    selectedCity,
    unit,
    showForecast,
    selectedDayIndex,
    weather,
    forecastState,
    // Actions
    setUnit,
    setShowForecast,
    setSelectedDayIndex,
    handleCitySelect,
    handleSeeForecast,
    handleRetryWeather,
    handleRetryForecast,
  };
};
