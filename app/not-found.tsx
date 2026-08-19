import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell narrow">
      <div className="emptyState">
        <div className="emptyIcon">🔒</div>
        <h1>This lesson is not available yet.</h1>
        <p>Return to the course dashboard and choose a published week.</p>
        <Link href="/" className="primaryButton">Back to all weeks</Link>
      </div>
    </main>
  );
}
