import { useState, useCallback } from "react";
import { weatherService } from "../services/weather.service";
import { type FormattedForecast } from "../types/weather.types";

interface UseForecastState {
  data: FormattedForecast[];
  loading: boolean;
  error: string | null;
}

export const useForecast = () => {
  const [state, setState] = useState<UseForecastState>({
    data: [],
    loading: false,
    error: null,
  });

  const fetchForecast = useCallback(async (city: string) => {
    setState({ data: [], loading: true, error: null });
    try {
      const data = await weatherService.getForecast(city);
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({
        data: [],
        loading: false,
        error: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  }, []);

  return { ...state, fetchForecast };
};
