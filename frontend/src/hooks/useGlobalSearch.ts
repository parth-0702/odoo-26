import { useEffect, useState } from "react";
import { searchService } from "@/services";
import { useDebounce } from "./useDebounce";
import type { SearchResults } from "@/types";

const EMPTY: SearchResults = { vehicles: [], drivers: [], trips: [], documents: [] };

export function useGlobalSearch(query: string) {
  const debounced = useDebounce(query, 250);
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (!debounced.trim()) {
      setResults(EMPTY);
      setLoading(false);
      return;
    }
    setLoading(true);
    searchService
      .search(debounced)
      .then((r) => active && setResults(r))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [debounced]);

  const count =
    results.vehicles.length + results.drivers.length + results.trips.length + results.documents.length;

  return { results, loading, count };
}