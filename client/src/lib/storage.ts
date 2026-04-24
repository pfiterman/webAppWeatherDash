import type { City } from "@/types/weather.types";

const LAST_CITY_KEY = "weather_last_city";

export function saveLastCity(city: City): void {
  try {
    localStorage.setItem(LAST_CITY_KEY, JSON.stringify(city));
  } catch {
    // ignore storage errors
  }
}

export function loadLastCity(): City | null {
  try {
    const raw = localStorage.getItem(LAST_CITY_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as City;
  } catch {
    return null;
  }
}
