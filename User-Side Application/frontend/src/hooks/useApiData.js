import { useEffect, useState, useCallback } from "react";

/**
 * Runs an async fetcher, tracking loading/error/data state the same way
 * across every page. `deps` re-runs the fetch when e.g. a route :id
 * changes.
 *
 * const { data, loading, error, reload } = useApiData(() => getProject(id), [id]);
 */
export function useApiData(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => load(), [load]);

  return { data, loading, error, reload: load };
}
