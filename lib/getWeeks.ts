import { Week } from "./courseData";
import { loadWeeks } from "./blob";
import { loadLibrary, weekResourceIds } from "./library";
import type { LibraryLink } from "./courseData";

// Pages read weeks through here: each week's libraryLinks is replaced by the
// shared-library items it points at, so the rest of the app can keep treating
// week.libraryLinks as "what this week shows".
function withResources(week: Week, library: LibraryLink[]): Week {
  const byId = new Map(library.map((item) => [item.id, item]));
  const ids = weekResourceIds(week);
  return {
    ...week,
    resourceIds: ids,
    libraryLinks: ids.flatMap((id) => {
      const item = byId.get(id);
      return item ? [item] : [];
    })
  };
}

export async function getAllWeeks(): Promise<Week[]> {
  const [weeks, library] = await Promise.all([loadWeeks(), loadLibrary()]);
  return weeks.map((week) => withResources(week, library));
}

export async function getWeekByNumber(number: number): Promise<Week | undefined> {
  const weeks = await getAllWeeks();
  return weeks.find((week) => week.number === number);
}
