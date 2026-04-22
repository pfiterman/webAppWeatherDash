import { env } from "../config/env";
import type { WeatherData, ForecastData } from "../types/weather.types";

const get = async <T>(endpoint: string): Promise<T> => {
  const res = await fetch(`${env.apiBaseUrl}${endpoint}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
};

export const weatherApi = {
  getCurrentWeather: (city: string): Promise<WeatherData> =>
    get<WeatherData>(`/api/weather?id=${encodeURIComponent(city)}`),

  getForecast: (city: string): Promise<ForecastData[]> =>
    get<ForecastData[]>(`/api/forecast?id=${encodeURIComponent(city)}`),
};
