import { AlertCircle } from "lucide-react";

const WeatherError = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div
    className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-2xl px-5 py-4"
    data-testid="error-weather"
  >
    <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
    <div>
      <p className="font-medium text-destructive">Unable to load weather</p>
      <p className="text-sm text-destructive/80 mt-0.5">{message}</p>
      <button
        onClick={onRetry}
        className="mt-2 text-sm text-destructive underline hover:no-underline"
      >
        Try again
      </button>
    </div>
  </div>
);

export default WeatherError;
