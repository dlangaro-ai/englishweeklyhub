import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  return (
    <main className="shell narrow">
      <Link href="/" className="backLink">← All weeks</Link>

      <header className="weekHero simpleWeekHero">
        <div>
          <p className="eyebrow">ABOUT US</p>
          <h1>About TEDANK5</h1>
        </div>
      </header>

      <article className="infoCard">
        <span className="infoIcon">💬</span>
        <div className="infoCardBody">
          <p className="infoText">
            TEDANK5 — My English Hub is a weekly companion for Grade 5 English, built to keep students,
            parents and teachers on the same page: this week&apos;s topic, books, homework, bonus
            activities and resources, all in one place.
          </p>
          <p className="infoText">
            Questions or feedback? Reach out to your English teacher directly.
          </p>
        </div>
      </article>
    </main>
  );
}
