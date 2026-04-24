import { Switch, Route, Router as WouterRouter } from "wouter";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { WeatherDashboard } from "@/pages/weather-dashboard";
import NotFound from "@/pages/not-found";

import { ErrorBoundary } from "@/components/core/error-boundary";

function Router() {
  return (
    <Switch>
      <Route path="/">
        <ErrorBoundary>
          <WeatherDashboard />
        </ErrorBoundary>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;
