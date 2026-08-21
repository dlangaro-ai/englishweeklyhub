# English Weekly Hub

Each week contains:
- Unit
- Weekly summary (with an optional picture)
- Books used / pages (with an optional picture)
- Homework pages (with an optional picture)
- A Bonus card linking to Extra Activities (with an optional picture)

## Editing content — day to day

Once edit mode is set up (see below), just visit the live site, log in with
the edit password, and use the **✏️ Edit** button on any card to change its
text or add/remove a picture. Changes save immediately and are visible to
students right away — no GitHub or Vercel steps needed for this.

## One-time setup (only needs doing once)

1. In your Vercel project, go to **Storage → Create Database → Blob** and
   connect it to this project. This automatically adds a
   `BLOB_READ_WRITE_TOKEN` environment variable — that's where week content
   and uploaded pictures are stored.
2. In your Vercel project's **Settings → Environment Variables**, add
   `EDIT_PASSWORD` set to whatever password you want to use to log in and
   edit. Keep this private — anyone with it can edit the site.
3. Redeploy once after adding these so they take effect.

## Changing code (not content)

`lib/courseData.ts` only holds the *starting* content for each week — the
40-week list, titles, and units. Once you start using the Edit buttons on
the live site, your edits live in Blob storage and take over; editing
`lib/courseData.ts` afterwards won't change what students see anymore.

For actual code changes:
1. Open GitHub Desktop
2. Commit to `main`
3. Push origin
4. Vercel redeploys automatically
