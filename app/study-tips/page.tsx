import Link from "next/link";
import Icon from "@/components/Icon";
import TipCard from "@/components/TipCard";

export const dynamic = "force-dynamic";

export const metadata = { title: "Study Tips" };

const QUOTES = [
  { text: "Success doesn’t come to you, you go to it.", by: "Marva Collins" },
  { text: "Learning a little every day adds up to a lot over time.", by: "" },
  { text: "You don’t have to be great to start, but you have to start to be great.", by: "Zig Ziglar" }
];

export default function StudyTipsPage() {
  return (
    <main className="shell narrow">
      <Link href="/" className="backLink">← Home</Link>

      <header className="weekHero simpleWeekHero heroTeal">
        <div>
          <p className="eyebrow">A FRIENDLY REMINDER FOR OUR FIFTH GRADE TEAM</p>
          <h1>Study Tips</h1>
          <p className="unitLabel">How to study English effectively</p>
        </div>
      </header>

      <TipCard as="section" id="tips-intro" nextId="tip-1" nextLabel="First tip" className="tipsIntro">
        <span className="tipsIntroIcon"><Icon name="bulb" size={56} /></span>
        <div>
          <p><strong>Dear Grade 5 Students,</strong></p>
          <p>
            Learning English is a process, and success doesn’t happen overnight! It takes time,
            patience, and, most importantly, regular revision.
          </p>
          <p>
            Here are a few simple habits that will help you become more confident and successful
            English learners.
          </p>
        </div>
      </TipCard>

      <ol className="tipsList">
        <TipCard id="tip-1" nextId="tip-2" className="tipCard">
          <span className="tipNumber">1</span>
          <div className="tipBody">
            <h2>Your Books Need to Go Home!</h2>
            <p>
              We learn many things during our lessons, but listening in class is not enough. To
              remember and truly understand what we learn, we need to revise it at home.
            </p>
            <p>
              When your parents tell you to bring your books home, please do so! No excuses, no “I
              forgot,” and no “I didn’t hear you.” Taking responsibility for your learning is part
              of growing up.
            </p>
          </div>
        </TipCard>

        <TipCard id="tip-2" nextId="tip-3" className="tipCard">
          <span className="tipNumber">2</span>
          <div className="tipBody">
            <h2>Just 15 Minutes Every Other Day!</h2>
            <p>
              You don’t need to study for hours. Fifteen minutes every other day can make a big
              difference when you use that time wisely.
            </p>
            <div className="tipSteps">
              <div className="tipStep">
                <p className="tipStepTime">First 7½ minutes</p>
                <h3>Read, Understand, and Learn</h3>
                <ul>
                  <li>
                    Choose something from your lesson that you need to practise. It could be a short
                    text, ten sentences, vocabulary, grammar, or instructions.
                  </li>
                  <li>Read it carefully and quietly.</li>
                  <li>Make sure you understand what you are reading.</li>
                  <li>Look up unfamiliar words or ask for help if something is unclear.</li>
                </ul>
              </div>
              <div className="tipStep tipStepTwo">
                <p className="tipStepTime">Next 7½ minutes</p>
                <h3>Read and Practise Out Loud</h3>
                <ul>
                  <li>Go over the same material again, but this time, read it aloud.</li>
                  <li>Listen to yourself as you speak.</li>
                  <li>
                    Pay attention to pronunciation and practise until the words and sentences become
                    more familiar.
                  </li>
                </ul>
              </div>
            </div>
            <p>This helps you develop your reading, speaking, and understanding skills.</p>
          </div>
        </TipCard>

        <TipCard id="tip-3" nextId="tip-4" className="tipCard">
          <span className="tipNumber">3</span>
          <div className="tipBody">
            <h2>Pay Attention to What Your Teacher Teaches!</h2>
            <p>Everything we practise in class has a purpose.</p>
            <p>
              When your teacher explains how to write a paragraph, organise a text, use a
              grammatical structure, or complete a particular type of task, pay close attention and
              follow the instructions.
            </p>
            <p>
              In quizzes and exams, you are expected to apply what you have been taught and
              practised in class.
            </p>
            <p>
              For example, if we learn a particular structure for writing a paragraph, that is the
              structure you should use when completing a similar writing task in your exam.
            </p>
            <p>
              <strong>Don’t just write whatever comes to mind. Show what you have learned!</strong>
            </p>
          </div>
        </TipCard>

        <TipCard id="tip-4" nextId="tips-remember" nextLabel="Remember!" className="tipCard">
          <span className="tipNumber">4</span>
          <div className="tipBody">
            <h2>Learning Takes Time – Be Patient and Consistent!</h2>
            <p>Nobody masters a language in a single lesson.</p>
            <p>
              Learning takes time, and regular practice helps information stay in your long-term
              memory.
            </p>
            <p>
              When you revise throughout the term, you won’t have to learn everything just before an
              exam. You will already know much of the material!
            </p>
            <p>
              Even better, what you learn won’t simply disappear after the exam, because you have
              practised it regularly.
            </p>
          </div>
        </TipCard>
      </ol>

      <section id="tips-remember" className="tipsRemember">
        <p className="tipsRememberLabel">REMEMBER!</p>
        <h2>Little and often is better than a lot at the last minute!</h2>
        <p>
          Bring your books home. Listen carefully. Understand what you learn. Practise regularly.
          Take responsibility for your progress.
        </p>
        <p className="tipsRememberClosing">Your success starts with your everyday habits! ✨</p>
      </section>

      <div className="tipsQuotes">
        {QUOTES.map((quote) => (
          <figure className="tipQuote" key={quote.text}>
            <blockquote>{quote.text}</blockquote>
            {quote.by && <figcaption>— {quote.by}</figcaption>}
          </figure>
        ))}
      </div>

      <Link href="/" className="homepageButton">
        🏠 Homepage
      </Link>
    </main>
  );
}
