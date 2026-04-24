import { env } from "../config/env";
import type { CurrentWeather, Forecast } from "../types/weather.types";

const get = async <T>(endpoint: string): Promise<T> => {
  const res = await fetch(`${env.apiBaseUrl}${endpoint}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
};

export const weatherApi = {
  getCurrentWeather: (cityId: string): Promise<CurrentWeather> =>
    get<CurrentWeather>(
      `/api/weather/current?id=${encodeURIComponent(cityId)}`,
    ),

  getForecast: (cityId: string): Promise<Forecast[]> =>
    get<Forecast[]>(`/api/weather/forecast?id=${encodeURIComponent(cityId)}`),
};
