"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ProgressMap = Record<string, boolean>;

type ProgressContextValue = {
  progress: ProgressMap;
  studentName: string;
  setStudentName: (name: string) => void;
  toggleActivity: (weekNumber: number, activityId: string, activityTitle: string) => void;
  isComplete: (activityId: string) => boolean;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);
const STORAGE_KEY = "english-weekly-hub-progress";
const NAME_STORAGE_KEY = "english-weekly-hub-student-name";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [studentName, setStudentNameState] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProgress(JSON.parse(saved));
      const savedName = localStorage.getItem(NAME_STORAGE_KEY);
      if (savedName) setStudentNameState(savedName);
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
      studentName,
      setStudentName: (name: string) => {
        const trimmed = name.trim();
        setStudentNameState(trimmed);
        localStorage.setItem(NAME_STORAGE_KEY, trimmed);
      },
      toggleActivity: (weekNumber: number, activityId: string, activityTitle: string) => {
        const nowComplete = !progress[activityId];
        setProgress((current) => ({
          ...current,
          [activityId]: nowComplete
        }));

        if (studentName) {
          fetch("/api/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              weekNumber,
              activityId,
              activityTitle,
              studentName,
              completed: nowComplete
            })
          }).catch(() => {
            // Best-effort tracking — the student's own toggle still works locally.
          });
        }
      },
      isComplete: (activityId: string) => Boolean(progress[activityId])
    }),
    [progress, studentName]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used inside ProgressProvider");
  return context;
}
