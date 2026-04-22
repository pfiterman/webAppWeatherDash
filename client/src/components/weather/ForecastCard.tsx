import { type FormattedForecast } from "../../types/weather.types";

interface Props {
  forecast: FormattedForecast[];
}

export const ForecastCard = ({ forecast }: Props) => (
  <div className="forecast-container">
    {forecast.map((item, index) => (
      <div key={index} className="forecast-item">
        <p className="forecast-date">{item.date}</p>
        <img src={item.iconUrl} alt={item.description} />
        <p className="forecast-temp">{item.temperature}</p>
        <p className="forecast-desc">{item.description}</p>
      </div>
    ))}
  </div>
);
