"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ProgressMap = Record<string, boolean>;

export type StudentIdentity = {
  name: string;
  studentClass: string;
  teacherEmail: string;
};

type ProgressContextValue = {
  progress: ProgressMap;
  identity: StudentIdentity | null;
  identityLoaded: boolean;
  setIdentity: (identity: StudentIdentity) => void;
  toggleActivity: (weekNumber: number, activityId: string, activityTitle: string) => void;
  isComplete: (activityId: string) => boolean;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);
const STORAGE_KEY = "english-weekly-hub-progress";
const IDENTITY_STORAGE_KEY = "english-weekly-hub-student-identity";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [identity, setIdentityState] = useState<StudentIdentity | null>(null);
  // Distinguishes "haven't checked localStorage yet" from "checked, found
  // nothing" — the identity gate needs this to avoid flashing its form for
  // a split second before a returning student's saved identity loads.
  const [identityLoaded, setIdentityLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProgress(JSON.parse(saved));

      const savedIdentity = localStorage.getItem(IDENTITY_STORAGE_KEY);
      if (savedIdentity) {
        const parsed = JSON.parse(savedIdentity) as Partial<StudentIdentity>;
        if (parsed?.name && parsed?.studentClass && parsed?.teacherEmail) {
          setIdentityState(parsed as StudentIdentity);
        }
      }
    } catch {
      // Ignore malformed local data.
    } finally {
      setIdentityLoaded(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const value = useMemo(
    () => ({
      progress,
      identity,
      identityLoaded,
      setIdentity: (next: StudentIdentity) => {
        setIdentityState(next);
        localStorage.setItem(IDENTITY_STORAGE_KEY, JSON.stringify(next));
      },
      toggleActivity: (weekNumber: number, activityId: string, activityTitle: string) => {
        const nowComplete = !progress[activityId];
        setProgress((current) => ({
          ...current,
          [activityId]: nowComplete
        }));

        if (identity) {
          fetch("/api/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              weekNumber,
              activityId,
              activityTitle,
              studentName: identity.name,
              studentClass: identity.studentClass,
              teacherEmail: identity.teacherEmail,
              completed: nowComplete
            })
          }).catch(() => {
            // Best-effort tracking — the student's own toggle still works locally.
          });
        }
      },
      isComplete: (activityId: string) => Boolean(progress[activityId])
    }),
    [progress, identity, identityLoaded]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used inside ProgressProvider");
  return context;
}
