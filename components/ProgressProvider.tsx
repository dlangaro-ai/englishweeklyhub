"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ProgressMap = Record<string, boolean>;

type ProgressContextValue = {
  progress: ProgressMap;
  toggleActivity: (activityId: string) => void;
  isComplete: (activityId: string) => boolean;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);
const STORAGE_KEY = "english-weekly-hub-progress";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProgress(JSON.parse(saved));
    } catch {
      // Ignore malformed local data.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const value = useMemo(
    () => ({
      progress,
      toggleActivity: (activityId: string) =>
        setProgress((current) => ({
          ...current,
          [activityId]: !current[activityId]
        })),
      isComplete: (activityId: string) => Boolean(progress[activityId])
    }),
    [progress]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used inside ProgressProvider");
  return context;
}
