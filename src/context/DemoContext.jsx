import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'ticketnest.demo.v1';
const DEFAULT = { failLoad: false, seatScenario: 'normal' };
const DemoContext = createContext(null);

// Demo-only switches. They live in sessionStorage so a refresh keeps the scenario.
function readSettings() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
    return {
      failLoad: Boolean(parsed.failLoad),
      seatScenario: ['normal', 'sold_out', 'low_seats'].includes(parsed.seatScenario)
        ? parsed.seatScenario
        : 'normal',
    };
  } catch {
    return DEFAULT;
  }
}

export function DemoProvider({ children }) {
  const [settings, setSettings] = useState(readSettings);

  const update = useCallback((patch) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Session storage may be blocked; controls still work in memory.
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => update(DEFAULT), [update]);

  const value = useMemo(() => ({ ...settings, update, reset }), [settings, update, reset]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used inside DemoProvider');
  return context;
}
