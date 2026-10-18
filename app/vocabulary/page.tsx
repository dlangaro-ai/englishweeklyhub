import Link from "next/link";
import { cookies } from "next/headers";
import { loadVocabulary } from "@/lib/vocabulary";
import { EDITOR_COOKIE_NAME, isValidSessionCookie } from "@/lib/auth";
import { VocabularyAddBar, VocabularyAdmin } from "@/components/VocabularyAdmin";

export const dynamic = "force-dynamic";

export const metadata = { title: "Vocabulary" };

// Pull the timestamp out of a "vocabulary-<timestamp>" id so newest uploads
// show first.
function idTimestamp(id: string): number {
  const match = /vocabulary-(\d+)/.exec(id);
  return match ? Number(match[1]) : 0;
}

const TINTS = ["resBlue", "resSun", "resPink", "resPurple"];

export default async function VocabularyPage() {
  const vocabulary = await loadVocabulary();
  const cookieStore = await cookies();
  const isEditor = isValidSessionCookie(cookieStore.get(EDITOR_COOKIE_NAME)?.value);

  const items = vocabulary.slice().sort((a, b) => idTimestamp(b.id) - idTimestamp(a.id));

  return (
    <main className="shell narrow">
      <Link href="/" className="backLink">← All weeks</Link>

      <header className="weekHero simpleWeekHero">
        <div>
          <p className="eyebrow">WORD BANK</p>
          <h1>Vocabulary</h1>
          <p className="unitLabel">Vocabulary lists and practice sheets to download and study</p>
        </div>
      </header>

      {isEditor && <VocabularyAddBar />}

      {items.length === 0 ? (
        <div className="emptyState compact">
          <div className="emptyIcon">🔤</div>
          <h2>No vocabulary PDFs yet</h2>
          <p>{isEditor ? "Upload your first PDF above." : "Vocabulary PDFs will show up here."}</p>
        </div>
      ) : (
        <ul className="vocabList">
          {items.map((item, index) => (
            <li key={item.id} className={`vocabRow ${TINTS[index % TINTS.length]}`}>
              <a href={item.href} target="_blank" rel="noreferrer" className="vocabRowLink">
                <span className="vocabRowIcon" aria-hidden="true">📄</span>
                <span className="vocabRowTitle">{item.title}</span>
                <span className="vocabRowBadge">PDF</span>
              </a>
              {isEditor && <VocabularyAdmin item={item} />}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
