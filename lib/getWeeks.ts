import { Week } from "./courseData";
import { loadWeeks } from "./blob";

export async function getAllWeeks(): Promise<Week[]> {
  return loadWeeks();
}

export async function getWeekByNumber(number: number): Promise<Week | undefined> {
  const weeks = await loadWeeks();
  return weeks.find((week) => week.number === number);
}
