import type { DailyForecast, ForecastItem, TempUnit } from "@/types/weather";

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function formatTemp(tempC: number, unit: TempUnit): string {
  if (unit === "fahrenheit") {
    return `${Math.round(celsiusToFahrenheit(tempC))}°F`;
  }
  return `${Math.round(tempC)}°C`;
}

export function rawTemp(tempC: number, unit: TempUnit): number {
  if (unit === "fahrenheit") return Math.round(celsiusToFahrenheit(tempC));
  return Math.round(tempC);
}

export function formatWindSpeed(mps: number): string {
  return `${Math.round(mps * 3.6)} km/h`;
}

export function formatVisibility(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${meters} m`;
}

export function groupForecastByDay(items: ForecastItem[]): DailyForecast[] {
  const groups = new Map<string, ForecastItem[]>();

  for (const item of items) {
    const date = item.dt_txt.split(" ")[0];
    if (!groups.has(date)) groups.set(date, []);
    groups.get(date)!.push(item);
  }

  const result: DailyForecast[] = [];

  for (const [date, dayItems] of groups) {
    const temps = dayItems.map((i) => i.main.temp);
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    const minTemp = Math.min(...dayItems.map((i) => i.main.temp_min));
    const maxTemp = Math.max(...dayItems.map((i) => i.main.temp_max));
    const avgWindSpeed =
      dayItems.reduce((a, b) => a + b.wind.speed, 0) / dayItems.length;

    const weatherCounts = new Map<string, number>();
    for (const item of dayItems) {
      const key = item.weather[0].icon;
      weatherCounts.set(key, (weatherCounts.get(key) ?? 0) + 1);
    }
    let dominantIcon = dayItems[0].weather[0].icon;
    let maxCount = 0;
    for (const [icon, count] of weatherCounts) {
      if (count > maxCount) {
        maxCount = count;
        dominantIcon = icon;
      }
    }
    const dominantWeather =
      dayItems.find((i) => i.weather[0].icon === dominantIcon)?.weather[0] ??
      dayItems[0].weather[0];

    const dateObj = new Date(date + "T12:00:00");
    const dateLabel = dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    result.push({
      date,
      dateLabel,
      items: dayItems,
      avgTemp,
      minTemp,
      maxTemp,
      avgWindSpeed,
      dominantWeather,
    });
  }

  return result;
}

export function getWindDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatTime(unixTs: number, timezoneOffsetSeconds: number): string {
  const utcMs = unixTs * 1000;
  const localMs = utcMs + timezoneOffsetSeconds * 1000;
  const d = new Date(localMs);
  const hours = d.getUTCHours();
  const minutes = d.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${minutes} ${ampm}`;
}
