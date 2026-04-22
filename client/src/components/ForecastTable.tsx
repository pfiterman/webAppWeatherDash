import { Wind, Droplets, ArrowUp, ArrowDown, Thermometer } from "lucide-react";
import type { DailyForecast, TempUnit } from "@/types/weather";
import { formatTemp, formatWindSpeed, capitalize } from "@/lib/weather-utils";
import { getWeatherIconUrl } from "@/lib/weather-api";

interface ForecastTableProps {
  forecasts: DailyForecast[];
  unit: TempUnit;
  selectedDayIndex: number;
}

export function ForecastTable({ forecasts, unit, selectedDayIndex }: ForecastTableProps) {
  const day = forecasts[selectedDayIndex];
  if (!day) return null;

  return (
    <div className="bg-card border border-card-border rounded-2xl shadow-md overflow-hidden" data-testid="forecast-table">
      <div className="px-6 py-4 border-b border-border/60">
        <h3 className="text-base font-semibold text-foreground">
          {day.dateLabel} — Hourly Breakdown
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {day.items.length} readings throughout the day
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" data-testid="table-forecast">
          <thead>
            <tr className="bg-muted/30 text-muted-foreground text-xs">
              <th className="text-left px-4 py-3 font-medium">Time</th>
              <th className="text-left px-4 py-3 font-medium">Condition</th>
              <th className="text-right px-4 py-3 font-medium">Temp</th>
              <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Min</th>
              <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Max</th>
              <th className="text-right px-4 py-3 font-medium">Wind</th>
              <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Humidity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {day.items.map((item, idx) => {
              const condition = item.weather[0];
              const iconUrl = getWeatherIconUrl(condition.icon);
              const time = item.dt_txt.split(" ")[1].slice(0, 5);
              const [h, m] = time.split(":").map(Number);
              const ampm = h >= 12 ? "PM" : "AM";
              const h12 = h % 12 || 12;
              const displayTime = `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;

              return (
                <tr
                  key={item.dt}
                  className="hover:bg-muted/30 transition-colors"
                  data-testid={`row-forecast-${idx}`}
                >
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                    {displayTime}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={iconUrl} alt={condition.description} className="w-8 h-8" />
                      <span className="text-foreground capitalize hidden sm:block">
                        {capitalize(condition.description)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground whitespace-nowrap">
                    {formatTemp(item.main.temp, unit)}
                  </td>
                  <td className="px-4 py-3 text-right text-blue-500 hidden sm:table-cell whitespace-nowrap">
                    <span className="flex items-center justify-end gap-1">
                      <ArrowDown className="h-3 w-3" />
                      {formatTemp(item.main.temp_min, unit)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-orange-500 hidden sm:table-cell whitespace-nowrap">
                    <span className="flex items-center justify-end gap-1">
                      <ArrowUp className="h-3 w-3" />
                      {formatTemp(item.main.temp_max, unit)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground whitespace-nowrap">
                    <span className="flex items-center justify-end gap-1">
                      <Wind className="h-3 w-3" />
                      {formatWindSpeed(item.wind.speed)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell whitespace-nowrap">
                    <span className="flex items-center justify-end gap-1">
                      <Droplets className="h-3 w-3" />
                      {item.main.humidity}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-muted/20 border-t border-border/40">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <ArrowUp className="h-3.5 w-3.5 text-orange-500" />
            Day high: <strong className="text-foreground">{formatTemp(day.maxTemp, unit)}</strong>
          </span>
          <span className="flex items-center gap-2">
            <ArrowDown className="h-3.5 w-3.5 text-blue-400" />
            Day low: <strong className="text-foreground">{formatTemp(day.minTemp, unit)}</strong>
          </span>
          <span className="flex items-center gap-2">
            <Thermometer className="h-3.5 w-3.5 text-primary" />
            Avg: <strong className="text-foreground">{formatTemp(day.avgTemp, unit)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
