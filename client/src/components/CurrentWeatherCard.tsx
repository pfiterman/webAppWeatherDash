import {
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type {
  CurrentWeather as CurrentWeatherType,
  TempUnit,
} from "@/types/weather.types";
import {
  formatTemp,
  formatWindSpeed,
  formatVisibility,
  getWindDirection,
  formatTime,
  capitalize,
} from "@/lib/weather-utils";
import { getWeatherIconUrl } from "@/lib/weather-api";

interface CurrentWeatherCardProps {
  weather: CurrentWeatherType;
  unit: TempUnit;
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-muted/40 rounded-xl p-3.5">
      <div className="text-primary">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className="text-sm font-semibold text-foreground truncate"
          data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export function CurrentWeatherCard({ weather, unit }: CurrentWeatherCardProps) {
  const condition = weather.weather?.[0];

  if (!condition) {
    console.warn(
      "[CurrentWeatherCard] Missing weather condition data:",
      weather,
    );
    return null;
  }

  const iconUrl = getWeatherIconUrl(condition.icon, "4x");
  const sunrise = formatTime(weather.sys.sunrise, weather.timezone);
  const sunset = formatTime(weather.sys.sunset, weather.timezone);

  return (
    <div
      className="bg-card border border-card-border rounded-2xl shadow-md overflow-hidden"
      data-testid="current-weather-card"
    >
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2
                className="text-2xl font-bold text-foreground"
                data-testid="text-city-name"
              >
                {weather.name}
              </h2>
              <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {weather.sys.country}
              </span>
            </div>
            <p
              className="text-sm text-muted-foreground capitalize"
              data-testid="text-weather-description"
            >
              {capitalize(condition.description)}
            </p>
          </div>
          <img
            src={iconUrl}
            alt={condition.description}
            className="w-20 h-20 -mt-2 -mr-2 drop-shadow-md"
            data-testid="img-weather-icon"
          />
        </div>

        <div className="mt-2 flex items-end gap-4">
          <span
            className="text-6xl font-bold tracking-tight text-foreground"
            data-testid="text-temperature"
          >
            {formatTemp(weather.main.temp, unit)}
          </span>
          <div className="mb-2 flex flex-col gap-0.5">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3 text-orange-500" />
              {formatTemp(weather.main.temp_max, unit)}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowDown className="h-3 w-3 text-blue-400" />
              {formatTemp(weather.main.temp_min, unit)}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Feels like {formatTemp(weather.main.feels_like, unit)}
        </p>
      </div>

      <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatTile
          icon={<Wind className="h-4 w-4" />}
          label="Wind"
          value={`${formatWindSpeed(weather.wind.speed)} ${getWindDirection(weather.wind.deg)}`}
        />
        <StatTile
          icon={<Droplets className="h-4 w-4" />}
          label="Humidity"
          value={`${weather.main.humidity}%`}
        />
        <StatTile
          icon={<Eye className="h-4 w-4" />}
          label="Visibility"
          value={formatVisibility(weather.visibility)}
        />
        <StatTile
          icon={<Gauge className="h-4 w-4" />}
          label="Pressure"
          value={`${weather.main.pressure} hPa`}
        />
        <StatTile
          icon={<Sunrise className="h-4 w-4" />}
          label="Sunrise"
          value={sunrise}
        />
        <StatTile
          icon={<Sunset className="h-4 w-4" />}
          label="Sunset"
          value={sunset}
        />
      </div>
    </div>
  );
}
