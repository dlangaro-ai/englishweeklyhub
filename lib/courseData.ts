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
  image?: string;
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
    books: ["Add your Week 1 book information here"],
    homework: ["No homework information added yet"],
    published: true,
    extraActivities: [
      {
        id: "w1-extra-1",
        title: "Welcome Activity",
        description: "Optional extra activity for Week 1.",
        resourceType: "activity"
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
