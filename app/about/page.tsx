import Link from "next/link";
import { team } from "@/lib/team";
import Icon from "@/components/Icon";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  return (
    <main className="shell narrow">
      <Link href="/" className="backLink">← Home</Link>

      <header className="weekHero simpleWeekHero heroPurple">
        <div>
          <p className="eyebrow">ABOUT US</p>
          <h1>About TEDANK5</h1>
        </div>
      </header>

      <details className="infoCard aboutCard aboutFold">
        <summary className="aboutFoldSummary">
          <span className="infoIcon"><Icon name="chat" size={48} /></span>
          <div className="infoCardBody">
            <p className="infoLabel">WELCOME</p>
            <h2>Welcome to TED ANK 5, your English 2 Weekly Hub!</h2>
          </div>
          <span className="aboutFoldChevron" aria-hidden="true">▾</span>
        </summary>
        <div className="aboutFoldBody">
          <p className="infoText">
            This page has been created by your English 2 teachers to share what we have been learning
            and doing in our lessons each week.
          </p>
          <p className="infoText">
            As you know, all official information is available on <strong>ETED</strong>. This
            page is designed to give you a simple overview of your English 2 lessons, along with extra
            activities, useful resources, and important reminders.
          </p>
          <p className="aboutClosing">We hope you find it helpful and enjoy exploring! ✨</p>
        </div>
      </details>

      <details className="infoCard aboutCard materialsCard aboutFold">
        <summary className="aboutFoldSummary">
          <span className="infoIcon"><Icon name="backpack" size={48} /></span>
          <div className="infoCardBody">
            <p className="infoLabel">WHAT YOU NEED</p>
            <h2>Our Grade 5 Materials</h2>
          </div>
          <span className="aboutFoldChevron" aria-hidden="true">▾</span>
        </summary>
        <div className="aboutFoldBody">
          <p className="infoText">Please bring these to every English 2 lesson:</p>
          <ul className="materialsList">
            <li className="materialsItem">
              <span className="materialsIcon"><Icon name="books" size={32} /></span>
              <div>
                <h3>Curious Kids books</h3>
                <p>The <strong>Pupil&apos;s Book</strong> and the <strong>Activity Book</strong>.</p>
              </div>
            </li>
            <li className="materialsItem">
              <span className="materialsIcon"><Icon name="notebook" size={32} /></span>
              <div>
                <h3>A lined notebook</h3>
                <p>Just for English 2, so all your work stays together.</p>
              </div>
            </li>
            <li className="materialsItem">
              <span className="materialsIcon"><Icon name="libraryBook" size={32} /></span>
              <div>
                <h3>A library book</h3>
                <p>
                  For reading time, always keep a book from the library with you. When you finish it,
                  get a new one!
                </p>
              </div>
            </li>
            <li className="materialsItem">
              <span className="materialsIcon"><Icon name="review" size={32} /></span>
              <div>
                <h3>Book Report</h3>
                <p>
                  When you finish a library book, you will be asked to write a <strong>book
                  report</strong>. It helps you think about what you read, practise writing in English,
                  and share great books with your classmates.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </details>

      <div className="aboutAvatars">
        {team.map((member) => (
          <a className="aboutAvatar" href={`mailto:${member.email}`} title={member.email} key={member.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={member.image} alt="" className="aboutAvatarImg" />
            <p className="aboutAvatarName">{member.name}</p>
          </a>
        ))}
      </div>
      <Link href="/" className="homepageButton">
        🏠 Homepage
      </Link>
    </main>
  );
}
