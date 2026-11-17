import { useCallback, useEffect, useState } from 'react';
import { loadEvents } from './events.js';

// Shared loading/error state for the listing and details pages.
export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    let ignore = false; // avoids setting state after unmount or after a newer request starts
    setLoading(true);
    setError(null);

    loadEvents()
      .then((data) => {
        if (!ignore) setEvents(data);
      })
      .catch((err) => {
        if (!ignore) setError(err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [attempt]);

  return { events, loading, error, reload };
}
