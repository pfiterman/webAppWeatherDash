import { useState, useRef, useEffect, useCallback } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { searchCities } from "@/lib/weather-api";
import type { GeoCity } from "@/types/weather.types";
import { cn } from "@/lib/utils";

interface CitySelectorProps {
  onCitySelect: (city: GeoCity) => void;
  selectedCityName?: string;
}

export function CitySelector({
  onCitySelect,
  selectedCityName,
}: CitySelectorProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoCity[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const cities = await searchCities(value);
        setResults(cities);
        setOpen(true);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to search cities.";
        setError(msg);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, []);

  const handleSelect = (city: GeoCity) => {
    setQuery("");
    setResults([]);
    setOpen(false);
    onCitySelect(city);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-lg"
      data-testid="city-selector"
    >
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl border bg-card shadow-sm transition-all duration-200",
          "focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/60",
          open ? "rounded-b-none border-b-transparent" : "",
        )}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 text-muted-foreground animate-spin shrink-0" />
        ) : (
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={
            selectedCityName
              ? `Change city (current: ${selectedCityName})`
              : "Search for a city..."
          }
          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground min-w-0"
          data-testid="input-city-search"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            data-testid="button-clear-search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && (
        <p
          className="mt-2 text-xs text-destructive px-1"
          data-testid="text-search-error"
        >
          {error}
        </p>
      )}

      {open && results.length > 0 && (
        <div
          className="absolute left-0 right-0 z-50 bg-card border border-t-0 rounded-b-xl shadow-lg overflow-hidden"
          data-testid="city-results-dropdown"
        >
          <ul className="max-h-64 overflow-y-auto divide-y divide-border/50">
            {results.map((city, idx) => (
              <li key={`${city.lat}-${city.lon}-${idx}`}>
                <button
                  onClick={() => handleSelect(city)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/60 transition-colors text-sm"
                  data-testid={`city-option-${idx}`}
                >
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span className="flex-1 min-w-0">
                    <span className="font-medium text-foreground">
                      {city.name}
                    </span>
                    {city.state && (
                      <span className="text-muted-foreground">
                        , {city.state}
                      </span>
                    )}
                    <span className="text-muted-foreground">
                      , {city.country}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {open && results.length === 0 && !loading && query.length >= 2 && (
        <div
          className="absolute left-0 right-0 z-50 bg-card border border-t-0 rounded-b-xl shadow-lg px-4 py-3 text-sm text-muted-foreground"
          data-testid="city-no-results"
        >
          No cities found for "{query}"
        </div>
      )}
    </div>
  );
}
