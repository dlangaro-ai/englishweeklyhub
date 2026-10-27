import { Week } from "./courseData";

// Searching every week's content: shared by the /api/search route (which does
// the work on the server) and the search panel in the top bar (which shows it).

export type SearchHit = {
  week: number;
  where: string;
  snippet: string;
  href: string;
};

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const SNIPPET_PAD = 44;
const MAX_HITS = 40;

function snippetAround(text: string, at: number, length: number): string {
  const start = Math.max(0, at - SNIPPET_PAD);
  const end = Math.min(text.length, at + length + SNIPPET_PAD);
  return (
    (start > 0 ? "… " : "") +
    text.slice(start, end).trim() +
    (end < text.length ? " …" : "")
  );
}

// Walk a week's content for the query and report each place it turns up — the
// section, a snippet of the text, and a link that lands on that spot.
function weekHits(week: Week, query: string): SearchHit[] {
  const hits: SearchHit[] = [];
  const weekHref = `/week/${week.number}`;

  const add = (where: string, raw: string, href: string) => {
    const text = raw.trim();
    if (!text) return;
    const at = text.toLowerCase().indexOf(query);
    if (at === -1) return;
    hits.push({ week: week.number, where, snippet: snippetAround(text, at, query.length), href });
  };

  add("Title", `Week ${week.number} — ${week.title}`, weekHref);
  add("Topic", week.unit, weekHref);
  add("This week", stripHtml(week.summary), `${weekHref}/this-week`);
  add("Books", stripHtml(week.books), `${weekHref}#books`);
  add("Homework", stripHtml(week.homework), `${weekHref}#homework`);
  add("Extra Activities", week.bonusText, `${weekHref}#bonus`);
  add("Resources & Library", stripHtml(week.libraryText), `${weekHref}#library`);
  (week.libraryLinks ?? []).forEach((link) => add("Resources & Library", link.title, `${weekHref}#library`));
  week.extraActivities.forEach((activity) => {
    add("Extra Activities", activity.title, `${weekHref}/skills`);
    add("Extra Activities", stripHtml(activity.description ?? ""), `${weekHref}/skills`);
  });

  return hits;
}

// Students only search published weeks; the teacher searches every week.
export function searchWeeks(weeks: Week[], rawQuery: string, isEditor: boolean): SearchHit[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const seen = new Set<string>();
  return weeks
    .filter((week) => week.published || isEditor)
    .flatMap((week) => weekHits(week, query))
    .filter((hit) => {
      const key = `${hit.week}|${hit.where}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_HITS);
}
