import { env } from "../config/env";
import { ForecastData, WeatherData } from "../types";

const buildUrl = (endpoint: string, params: Record<string, string>) => {
  const url = new URL(`${env.openWeatherMap.baseUrl}/${endpoint}`);
  url.searchParams.set("appid", env.openWeatherMap.apiKey);
  url.searchParams.set("units", "metric");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
};

export const weatherService = {
  async getCurrentWeather(cityId: string): Promise<WeatherData> {
    const url = buildUrl("weather", { id: cityId });
    const res = await fetch(url);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch weather");
    }

    const data = await res.json();

    return {
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
    };
  },

  async getForecast(cityId: string): Promise<ForecastData[]> {
    const url = buildUrl("forecast", { id: cityId, cnt: "5" });
    const res = await fetch(url);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch forecast");
    }

    const data = await res.json();

    return data.list.map((item: any) => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    }));
  },
};
