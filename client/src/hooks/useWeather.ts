import { useState, useCallback } from "react";
import { weatherService } from "../services/weather.service";
import { type FormattedWeather } from "../types/weather.types";

interface UseWeatherState {
  data: FormattedWeather | null;
  loading: boolean;
  error: string | null;
}

export const useWeather = () => {
  const [state, setState] = useState<UseWeatherState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchWeather = useCallback(async (city: string) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await weatherService.getWeather(city);
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  }, []);

  return { ...state, fetchWeather };
};
