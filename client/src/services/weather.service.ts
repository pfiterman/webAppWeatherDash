import { weatherApi } from "../api/weather.api";
import type {
  WeatherData,
  ForecastData,
  FormattedWeather,
  FormattedForecast,
} from "../types/weather.types";

const getWeatherIconUrl = (icon: string) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;

const formatTemperature = (temp: number): string => `${Math.round(temp)}°C`;

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const weatherService = {
  async getWeather(city: string): Promise<FormattedWeather> {
    const data: WeatherData = await weatherApi.getCurrentWeather(city);
    return {
      city: data.city,
      temperature: formatTemperature(data.temperature),
      description: capitalize(data.description),
      humidity: `${data.humidity}%`,
      windSpeed: `${data.windSpeed} m/s`,
      iconUrl: getWeatherIconUrl(data.icon),
    };
  },

  async getForecast(city: string): Promise<FormattedForecast[]> {
    const data: ForecastData[] = await weatherApi.getForecast(city);
    return data.map((item) => ({
      date: formatDate(item.date),
      temperature: formatTemperature(item.temperature),
      description: capitalize(item.description),
      iconUrl: getWeatherIconUrl(item.icon),
    }));
  },
};
