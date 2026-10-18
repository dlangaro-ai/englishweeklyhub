import Link from "next/link";
import Icon from "@/components/Icon";

export default function NotFound() {
  return (
    <main className="shell narrow">
      <div className="emptyState">
        <div className="emptyIcon"><Icon name="lock" size={64} /></div>
        <h1>This lesson is not available yet.</h1>
        <p>Return to the course dashboard and choose a published week.</p>
        <Link href="/" className="primaryButton">Back to all weeks</Link>
      </div>
    </main>
  );
}
