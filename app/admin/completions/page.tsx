import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import { loadCompletions, Completion } from "@/lib/completions";
import { getAllWeeks } from "@/lib/getWeeks";

export const dynamic = "force-dynamic";

export default async function CompletionsPage() {
  const cookieStore = await cookies();
  const isEditor = isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value);
  if (!isEditor) notFound();

  const [completions, weeks] = await Promise.all([loadCompletions(), getAllWeeks()]);

  const byWeek = new Map<number, Completion[]>();
  for (const entry of completions) {
    const list = byWeek.get(entry.weekNumber) ?? [];
    list.push(entry);
    byWeek.set(entry.weekNumber, list);
  }

  const weekNumbers = Array.from(byWeek.keys()).sort((a, b) => a - b);

  return (
    <main className="shell narrow">
      <Link href="/" className="backLink">← All weeks</Link>

      <header className="weekHero simpleWeekHero">
        <div>
          <p className="eyebrow">TEACHER ONLY</p>
          <h1>Completions</h1>
          <p className="unitLabel">Who&apos;s finished which extra activities</p>
        </div>
      </header>

      {weekNumbers.length === 0 ? (
        <div className="emptyState compact">
          <div className="emptyIcon">📊</div>
          <h2>No completions yet</h2>
          <p>As soon as students mark activities complete and enter their name, they&apos;ll show up here.</p>
        </div>
      ) : (
        weekNumbers.map((weekNumber) => {
          const week = weeks.find((item) => item.number === weekNumber);
          const entries = byWeek.get(weekNumber) ?? [];

          const byActivity = new Map<string, Completion[]>();
          for (const entry of entries) {
            const list = byActivity.get(entry.activityTitle) ?? [];
            list.push(entry);
            byActivity.set(entry.activityTitle, list);
          }

          return (
            <section className="termSection" key={weekNumber}>
              <div className="sectionHeading">
                <h2>Week {weekNumber}{week ? ` — ${week.title}` : ""}</h2>
              </div>

              <div className="completionsGrid">
                {Array.from(byActivity.entries()).map(([activityTitle, activityEntries]) => (
                  <article className="infoCard" key={activityTitle}>
                    <span className="infoIcon">✅</span>
                    <div className="infoCardBody">
                      <p className="infoLabel">
                        {activityEntries.length} STUDENT{activityEntries.length === 1 ? "" : "S"}
                      </p>
                      <h2>{activityTitle}</h2>
                      <ul className="simpleList">
                        {activityEntries
                          .slice()
                          .sort((a, b) => a.studentName.localeCompare(b.studentName))
                          .map((entry) => (
                            <li key={entry.studentName}>
                              {entry.studentName}{" "}
                              <span className="completedAt">
                                ({new Date(entry.completedAt).toLocaleDateString()})
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })
      )}
    </main>
  );
}
