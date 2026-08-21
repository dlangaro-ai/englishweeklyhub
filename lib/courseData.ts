// ── HOW TO EDIT THIS FILE ──────────────────────────────────────────────────
// This is the ONLY file you need to touch to update the site each week.
// Find the week you want to change below (look for `number: X`) and edit
// its text. When you're done: save, commit in GitHub Desktop, push to main,
// and Vercel will redeploy automatically.
//
// Field cheat sheet:
//   title      -> short, friendly week title students see on their card
//   unit       -> the topic/unit name shown under the title
//   summary    -> a few sentences telling students what's happening this week
//   books      -> list of books/pages, e.g. "Unlock pages 14-18"
//   bookImage  -> optional path to a cover image, e.g. "/images/my-book.png"
//                 (drop image files into the /public/images folder)
//   homework   -> list of homework items, e.g. "Workbook page 7"
//   published  -> true = students can open this week, false = shows "Soon"
//   extraActivities -> optional bonus links/videos/PDFs for this week
// ────────────────────────────────────────────────────────────────────────────

export type ExtraActivity = {
  id: string;
  title: string;
  description?: string;
  href?: string;
  resourceType?: "link" | "video" | "pdf" | "activity";
};

export type Week = {
  number: number;
  title: string;
  unit: string;
  summary: string;
  books: string[];
  bookImage?: string;
  homework: string[];
  published: boolean;
  extraActivities: ExtraActivity[];
};

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

const placeholders: Week[] = Array.from({ length: 37 }, (_, index) => {
  const number = index + 4;

  return {
    number,
    title: `Week ${number}`,
    unit: "Coming soon",
    summary: "Weekly information will be added here.",
    books: [],
    homework: [],
    published: false,
    extraActivities: []
  };
});

export const weeks: Week[] = [...starterWeeks, ...placeholders];

export function getWeek(number: number) {
  return weeks.find((week) => week.number === number);
}
