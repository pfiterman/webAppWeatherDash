import { type FormattedWeather } from "../../types/weather.types";

interface Props {
  weather: FormattedWeather;
}

export const WeatherCard = ({ weather }: Props) => (
  <div className="weather-card">
    <h2>{weather.city}</h2>
    <img src={weather.iconUrl} alt={weather.description} />
    <p className="temperature">{weather.temperature}</p>
    <p className="description">{weather.description}</p>
    <div className="weather-details">
      <span>💧 {weather.humidity}</span>
      <span>💨 {weather.windSpeed}</span>
    </div>
  </div>
);
