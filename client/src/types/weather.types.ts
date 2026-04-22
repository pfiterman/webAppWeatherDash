export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface ForecastData {
  date: string;
  temperature: number;
  description: string;
  icon: string;
}

export interface ApiError {
  error: string;
}

export interface FormattedWeather {
  city: string;
  temperature: string;
  description: string;
  humidity: string;
  windSpeed: string;
  iconUrl: string;
}

export interface FormattedForecast {
  date: string;
  temperature: string;
  description: string;
  iconUrl: string;
}

// Keep this interfaces
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  coord: { lon: number; lat: number };
  weather: WeatherCondition[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: { speed: number; deg: number; gust?: number };
  clouds: { all: number };
  dt: number;
  sys: { country: string; sunrise: number; sunset: number };
  timezone: number;
  id: number;
  name: string;
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  clouds: { all: number };
  wind: { speed: number; deg: number; gust?: number };
  visibility: number;
  pop: number;
  dt_txt: string;
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface DailyForecast {
  date: string;
  dateLabel: string;
  items: ForecastItem[];
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  avgWindSpeed: number;
  dominantWeather: WeatherCondition;
}

export type TempUnit = "celsius" | "fahrenheit";

export interface City {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface GeoCity {
  id: number;
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
