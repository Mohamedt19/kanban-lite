import { useEffect, useState } from "react";

/*
  A small reusable hook that syncs state with localStorage.

  Why use this?
  • persists data across page refreshes
  • keeps React state and storage in sync
  • removes repetitive storage logic from components
*/
export function useLocalStorage<T>(key: string, initialValue: T) {
  /*
    Initialize state from localStorage.

    - runs only once (lazy initializer)
    - safely parses stored JSON
    - falls back to initialValue if:
        • key doesn't exist
        • JSON is invalid
        • storage is unavailable
  */
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  /*
    Persist value whenever it changes.

    We stringify because localStorage stores strings only.
  */
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore storage errors (private mode, quota exceeded, etc.)
    }
  }, [key, value]);

  /*
    Return tuple like useState:
    const [value, setValue] = useLocalStorage(...)
  */
  return [value, setValue] as const;
}