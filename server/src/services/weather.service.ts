import { env } from "../config/env";
import { Forecast, CurrentWeather } from "../types";

const buildUrl = (endpoint: string, params: Record<string, string>) => {
  const url = new URL(`${env.openWeatherMap.baseUrl}/${endpoint}`);
  url.searchParams.set("appid", env.openWeatherMap.apiKey);
  url.searchParams.set("units", "metric");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
};

export const weatherService = {
  async getCurrentWeather(cityId: string): Promise<CurrentWeather> {
    const url = buildUrl("weather", { id: cityId });
    const res = await fetch(url);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch weather");
    }

    const data = await res.json();

    return data;
  },

  async getForecast(cityId: string): Promise<Forecast[]> {
    const url = buildUrl("forecast", {
      id: cityId,
      units: "metric",
      cnt: "40",
    });
    const res = await fetch(url);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch forecast");
    }

    const data = await res.json();

    return data;
  },
};
