export const skillMeta = {
  reading: { label: "Reading", icon: "📖", description: "Texts, stories and comprehension" },
  listening: { label: "Listening", icon: "🎧", description: "Audio, video and listening tasks" },
  vocabulary: { label: "Vocabulary", icon: "🔤", description: "Words, phrases and review" },
  grammar: { label: "Grammar", icon: "🧩", description: "Grammar explanations and practice" },
  speaking: { label: "Speaking", icon: "🗣️", description: "Prompts, challenges and discussion" },
  writing: { label: "Writing", icon: "✍️", description: "Guided and creative writing" }
} as const;

export type SkillKey = keyof typeof skillMeta;

export type Activity = {
  id: string;
  title: string;
  type: "learn" | "practice" | "challenge" | "external";
  description?: string;
  href?: string;
};

export type Week = {
  number: number;
  title: string;
  theme: string;
  published: boolean;
  skills: Partial<Record<SkillKey, Activity[]>>;
};

const starterWeeks: Week[] = [
  {
    number: 1,
    title: "Getting Started",
    theme: "Welcome & Everyday English",
    published: true,
    skills: {
      reading: [
        { id: "w1-r1", title: "A New School Year", type: "learn", description: "Read a short welcome text and identify key information." },
        { id: "w1-r2", title: "Quick Check", type: "practice", description: "Answer five comprehension questions." }
      ],
      listening: [
        { id: "w1-l1", title: "Meet the Students", type: "practice", description: "Listen and match each speaker to the correct detail." }
      ],
      vocabulary: [
        { id: "w1-v1", title: "Classroom & Routine", type: "learn", description: "Review useful words for school and everyday routines." },
        { id: "w1-v2", title: "Vocabulary Challenge", type: "challenge", description: "Use the new words in short sentences." }
      ],
      grammar: [
        { id: "w1-g1", title: "Present Simple Review", type: "learn", description: "Review form, use and common time expressions." },
        { id: "w1-g2", title: "Choose the Correct Form", type: "practice", description: "Complete a short interactive-style practice task." }
      ],
      speaking: [
        { id: "w1-s1", title: "About Me", type: "challenge", description: "Answer six prompts about your interests and routines." }
      ],
      writing: [
        { id: "w1-w1", title: "My Week", type: "challenge", description: "Write a short paragraph about a typical week." }
      ]
    }
  },
  {
    number: 2,
    title: "Stories in Progress",
    theme: "Past Simple & Past Continuous",
    published: true,
    skills: {
      reading: [{ id: "w2-r1", title: "The Unexpected Visitor", type: "practice", description: "Read a short story and notice how past tenses work together." }],
      vocabulary: [{ id: "w2-v1", title: "Storytelling Verbs", type: "learn", description: "Build vocabulary for narrating events." }],
      grammar: [
        { id: "w2-g1", title: "Past Simple vs Past Continuous", type: "learn", description: "Compare completed actions and actions in progress." },
        { id: "w2-g2", title: "Funny Burglary", type: "challenge", description: "Complete a dialogue using both past tenses." }
      ],
      speaking: [{ id: "w2-s1", title: "What Were You Doing?", type: "challenge", description: "Tell a short story using both past tenses." }]
    }
  },
  {
    number: 3,
    title: "Discover & Investigate",
    theme: "Phrasal Verbs",
    published: true,
    skills: {
      vocabulary: [
        { id: "w3-v1", title: "Phrasal Verb Set", type: "learn", description: "come across, come up with, find out, look for, look into, look up, turn up, work out" },
        { id: "w3-v2", title: "Detective Challenge", type: "practice", description: "Choose the correct phrasal verb to solve each clue." }
      ],
      speaking: [{ id: "w3-s1", title: "Mystery Questions", type: "challenge", description: "Use the target phrasal verbs in conversation." }]
    }
  }
];

const placeholders: Week[] = Array.from({ length: 37 }, (_, index) => {
  const number = index + 4;
  return {
    number,
    title: `Week ${number}`,
    theme: "Content coming soon",
    published: false,
    skills: {}
  };
});

export const weeks: Week[] = [...starterWeeks, ...placeholders];

export function getWeek(number: number) {
  return weeks.find((week) => week.number === number);
}
