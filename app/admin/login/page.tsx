"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    setLoading(false);

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      setError(result.error ?? "Incorrect password.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="shell narrow">
      <div className="loginCard">
        <h1>Teacher login</h1>
        <p className="infoText">Enter the edit password to turn on edit mode.</p>
        <form onSubmit={handleSubmit} className="loginForm">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoFocus
          />
          <button type="submit" className="primaryButton" disabled={loading}>
            {loading ? "Checking…" : "Log in"}
          </button>
        </form>
        {error && <p className="loginError">{error}</p>}
      </div>
    </main>
  );
}
