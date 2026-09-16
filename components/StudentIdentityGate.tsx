"use client";

import { FormEvent, useState } from "react";
import { useProgress } from "./ProgressProvider";

// Blocks its children behind a one-time "who are you" form (name, class,
// teacher's email) so completed activities can be attributed to a real
// student. Used only on the Eager Learners (extra activities) page — the
// rest of the site stays freely browsable. Pass skip for the teacher (edit
// mode), who has no business filling in a fake identity to manage activities.
export default function StudentIdentityGate({
  children,
  skip = false
}: {
  children: React.ReactNode;
  skip?: boolean;
}) {
  const { identity, identityLoaded, setIdentity } = useProgress();

  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [error, setError] = useState("");

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

  if (skip) return <>{children}</>;
  if (!identityLoaded) return null;
  if (identity) return <>{children}</>;

  return (
    <main className="shell narrow">
      <div className="loginCard">
        <h1>Before you start…</h1>
        <p className="infoText">Please enter your details to access the Eager Learners activities.</p>
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
