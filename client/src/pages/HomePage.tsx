import { useCallback } from "react";
import { useWeather } from "../hooks/useWeather";
import { useForecast } from "../hooks/useForecast";
import { SearchBar } from "../components/weather/SearchBar";
import { WeatherCard } from "../components/weather/WeatherCard";
import { ForecastCard } from "../components/weather/ForecastCard";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ErrorMessage } from "../components/ui/ErrorMessage";

export const HomePage = () => {
  const weather = useWeather();
  const forecast = useForecast();

  const handleSearch = useCallback(
    (city: string) => {
      weather.fetchWeather(city);
      forecast.fetchForecast(city);
    },
    [weather.fetchWeather, forecast.fetchForecast],
  );

  const isLoading = weather.loading || forecast.loading;
  const error = weather.error || forecast.error;

  return (
    <main className="home-page">
      <h1>Weather Dashboard</h1>
      <SearchBar onSearch={handleSearch} loading={isLoading} />
      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {weather.data && <WeatherCard weather={weather.data} />}
      {forecast.data.length > 0 && <ForecastCard forecast={forecast.data} />}
    </main>
  );
};
