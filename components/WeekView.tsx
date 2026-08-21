"use client";

import Link from "next/link";
import { Week } from "@/lib/courseData";

export default function WeekView({ week }: { week: Week }) {
  return (
    <main className="shell narrow">
      <Link href="/" className="backLink">← All weeks</Link>

      <header className="weekHero simpleWeekHero">
        <div>
          <p className="eyebrow">WEEK {week.number}</p>
          <h1>{week.title}</h1>
          <p className="unitLabel">{week.unit}</p>
        </div>
      </header>

      <section className="weekInfoGrid">
        <article className="infoCard summaryCard">
          <span className="infoIcon">✨</span>
          <div>
            <p className="infoLabel">THIS WEEK</p>
            <h2>What we're doing</h2>
            <p className="infoText">{week.summary}</p>
          </div>
        </article>

        <article className="infoCard infoCardBooks">
          <span className="infoIcon">📚</span>
          <div>
            <p className="infoLabel">BOOKS USED</p>
            <h2>Books & Pages</h2>
            {week.books.length ? (
              <ul className="simpleList">
                {week.books.map((book) => <li key={book}>{book}</li>)}
              </ul>
            ) : (
              <p className="infoText">No book information added yet.</p>
            )}
            {week.bookImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="bookImage"
                src={week.bookImage}
                alt={week.books[0] ?? "Book cover"}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
        </article>

        <article className="infoCard infoCardHomework">
          <span className="infoIcon">🏠</span>
          <div>
            <p className="infoLabel">HOMEWORK</p>
            <h2>Homework Pages</h2>
            {week.homework.length ? (
              <ul className="simpleList">
                {week.homework.map((item) => <li key={item}>{item}</li>)}
              </ul>
            ) : (
              <p className="infoText">No homework this week — enjoy the break!</p>
            )}
          </div>
        </article>

        <Link href={`/week/${week.number}/skills`} className="infoCard skillsFolder">
          <span className="infoIcon">🎁</span>
          <div>
            <p className="infoLabel">BONUS</p>
            <h2>Extra Activities</h2>
            <p className="infoText">
              Fun optional practice, links, videos and PDFs for this week.
            </p>
            <span className="openLabel">Open folder →</span>
          </div>
        </Link>
      </section>
    </main>
  );
}
