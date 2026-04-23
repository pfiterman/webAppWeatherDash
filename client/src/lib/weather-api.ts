import type { CurrentWeather, Forecast, GeoCity } from "@/types/weather.types";

const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

async function apiFetch<T>(path: string): Promise<T> {
  const url = `${BASE_PATH}/api${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = (await res.clone().json()) as { message?: string };
      if (body.message) detail = body.message;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(`HTTP ${res.status}: ${detail}`);
  }
  return res.json() as Promise<T>;
}

export async function searchCities(query: string): Promise<GeoCity[]> {
  if (!query || query.length < 2) return [];
  return apiFetch<GeoCity[]>(`/weather/search?q=${encodeURIComponent(query)}`);
}

export async function getCurrentWeather(id: number): Promise<CurrentWeather> {
  return apiFetch<CurrentWeather>(`/weather/current?id=${id}`);
}

export async function getForecast(id: number): Promise<Forecast> {
  return apiFetch<Forecast>(`/weather/forecast?id=${id}`);
}

export function getWeatherIconUrl(
  icon: string,
  size: "2x" | "4x" = "2x",
): string {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
}
