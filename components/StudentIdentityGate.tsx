"use client";

import { FormEvent, useEffect, useState } from "react";
import { useProgress } from "./ProgressProvider";

// Blocks the whole site behind a one-time "who are you" form (name, class,
// teacher's email) so completed activities can be attributed to a real
// student. Skipped for the teacher (edit mode) and for anyone who's already
// filled it in on this device — checked in that order so a returning
// student never pays for the extra /api/admin/status round trip.
export default function StudentIdentityGate({ children }: { children: React.ReactNode }) {
  const { identity, identityLoaded, setIdentity } = useProgress();
  const [checkingEditor, setCheckingEditor] = useState(true);
  const [isEditor, setIsEditor] = useState(false);

  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!identityLoaded || identity) {
      setCheckingEditor(false);
      return;
    }

    fetch("/api/admin/status")
      .then((response) => response.json())
      .then((data) => setIsEditor(Boolean(data?.isEditor)))
      .catch(() => {
        // If the check fails, fall through to showing the form — worst
        // case the teacher fills it in once too.
      })
      .finally(() => setCheckingEditor(false));
  }, [identityLoaded, identity]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedClass = studentClass.trim();
    const trimmedEmail = teacherEmail.trim();

    if (!trimmedName || !trimmedClass || !trimmedEmail) {
      setError("Please fill in all three fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setIdentity({ name: trimmedName, studentClass: trimmedClass, teacherEmail: trimmedEmail });
  }

  if (!identityLoaded || checkingEditor) return null;
  if (identity || isEditor) return <>{children}</>;

  return (
    <main className="shell narrow">
      <div className="loginCard">
        <h1>Welcome!</h1>
        <p className="infoText">Please enter your details before you start — this only takes a moment.</p>
        <form onSubmit={handleSubmit} className="identityForm">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            autoFocus
          />
          <input
            type="text"
            value={studentClass}
            onChange={(event) => setStudentClass(event.target.value)}
            placeholder="Your class (e.g. 5B)"
          />
          <input
            type="email"
            value={teacherEmail}
            onChange={(event) => setTeacherEmail(event.target.value)}
            placeholder="Your English 2 teacher's email"
          />
          <button type="submit" className="primaryButton">
            Continue
          </button>
        </form>
        {error && <p className="loginError">{error}</p>}
      </div>
    </main>
  );
}
