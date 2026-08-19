# English Weekly Hub

A simple 40-week English learning app built with Next.js.

## What is included

- 40-week dashboard
- Week 1–3 starter content
- Six skill categories: Reading, Listening, Vocabulary, Grammar, Speaking, Writing
- Reusable dynamic routes (you do not need 40 separate page files)
- Activity completion buttons
- Progress stored in the student's browser with localStorage
- Responsive design for desktop and mobile
- Ready for GitHub + Vercel

## Edit your weeks

Open:

`lib/courseData.ts`

Each week is a data object. Change titles, themes, skills and activities there.

For example:

```ts
{
  number: 4,
  title: "My New Week",
  theme: "Food & Culture",
  published: true,
  skills: {
    reading: [
      {
        id: "w4-r1",
        title: "A Taste of the World",
        type: "practice",
        description: "Read and answer the questions."
      }
    ]
  }
}
```

Set `published: true` when you want the week to become clickable.

## Run locally

You need Node.js 20.9 or newer for Next.js 16.

```bash
npm install
npm run dev
```

Then open:

`http://localhost:3000`

## Put it on GitHub

### Easiest: GitHub Desktop

1. Unzip this folder.
2. Open GitHub Desktop.
3. Choose **Add an Existing Repository from your Hard Drive**.
4. Select the `english-weekly-hub` folder.
5. If prompted, create a Git repository there.
6. Click **Publish repository**.

### Terminal alternative

```bash
git init
git add .
git commit -m "Initial English Weekly Hub"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Deploy to Vercel

1. Sign in to Vercel.
2. Create a new project.
3. Import the GitHub repository.
4. Vercel should detect Next.js automatically.
5. Click **Deploy**.

After GitHub is connected, future pushes can trigger new deployments automatically.

## Next development step

This prototype intentionally stores progress only in the current browser.

For a real student system, the next version should add:

- teacher login
- student login
- Supabase database
- editable teacher dashboard
- persistent progress across devices
- interactive question types
- scores / feedback
