import { useState, FormEvent } from "react";

interface Props {
  onSearch: (city: string) => void;
  loading: boolean;
}

export const SearchBar = ({ onSearch, loading }: Props) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = city.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name..."
        disabled={loading}
        aria-label="City name"
      />
      <button type="submit" disabled={loading || !city.trim()}>
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};
