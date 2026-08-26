// ── HOW THIS WORKS ──────────────────────────────────────────────────────────
// This file only holds the STARTING content for each week. Once you use the
// "✏️ Edit" buttons on the live site to change something, your edits are
// saved to Vercel Blob storage and take over as the real content from then
// on — editing this file after that point will no longer change what
// students see. Think of the data below as the factory-reset defaults.
//
// Field cheat sheet:
//   title      -> short, friendly week title students see on their card
//   unit       -> the topic/unit name shown under the title
//   summary      / summaryImage  -> "This week" text + optional picture
//   books        / bookImage     -> "Books used" list + optional picture
//   homework     / homeworkImage -> "Homework" list + optional picture
//   bonusText    / bonusImage    -> "Bonus" teaser text + optional picture
//   published  -> true = students can open this week, false = shows "Soon"
//   extraActivities -> bonus links/videos/PDFs, shown on the Bonus sub-page
// ────────────────────────────────────────────────────────────────────────────

export type ExtraActivity = {
  id: string;
  title: string;
  description?: string;
  href?: string;
  resourceType?: "link" | "video" | "pdf" | "activity" | "image" | "list";
};

export type Week = {
  number: number;
  title: string;
  unit: string;
  summary: string;
  summaryImage?: string;
  books: string[];
  bookImage?: string;
  bookImage2?: string;
  homework: string[];
  homeworkImage?: string;
  bonusText: string;
  bonusImage?: string;
  published: boolean;
  extraActivities: ExtraActivity[];
};

const defaultBonusText = "Fun optional practice, links, videos and PDFs for this week.";

const starterWeeks: Week[] = [
  {
    number: 1,
    title: "Welcome to Grade 5",
    unit: "Getting Started",
    summary:
      "This week we have started our new school year! Please follow this page for more information.",
    books: ["Curious Kids 6 — Pupil's Book"],
    bookImage: "/images/curious-kids-6.png",
    homework: ["No homework information added yet"],
    bonusText: defaultBonusText,
    published: true,
    extraActivities: [
      {
        id: "w1-extra-1",
        title: "Wordwall Practice",
        description: "Click below to practice this week's English.",
        href: "https://wordwall.net/resource/97750997?wwmethod=link",
        resourceType: "link"
      }
    ]
  },

  {
    number: 2,
    title: "Week 2",
    unit: "Unit information coming soon",
    summary: "Weekly information will be added here.",
    books: ["Book pages coming soon"],
    homework: ["Homework coming soon"],
    bonusText: defaultBonusText,
    published: true,
    extraActivities: []
  },

  {
    number: 3,
    title: "Our School Community",
    unit: "School Community",
    summary: "This week we are learning about our school community.",
    books: ["Unlock pages 14–18"],
    homework: ["Workbook page 7"],
    bonusText: defaultBonusText,
    published: true,
    extraActivities: [
      {
        id: "w3-extra-1",
        title: "YouTube resource",
        description: "Add the YouTube link when it is ready.",
        resourceType: "video"
      },
      {
        id: "w3-extra-2",
        title: "Student PDF",
        description: "Add the PDF resource when it is ready.",
        resourceType: "pdf"
      }
    ]
  }
];

const placeholders: Week[] = Array.from({ length: 38 }, (_, index) => {
  const number = index + 4;

  return {
    number,
    title: `Week ${number}`,
    unit: "Coming soon",
    summary: "Weekly information will be added here.",
    books: [],
    homework: [],
    bonusText: defaultBonusText,
    published: false,
    extraActivities: []
  };
});

export const weeks: Week[] = [...starterWeeks, ...placeholders];

export function getWeek(number: number) {
  return weeks.find((week) => week.number === number);
}
