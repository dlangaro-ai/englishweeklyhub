import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  return (
    <main className="shell narrow">
      <Link href="/" className="backLink">← All weeks</Link>

      <header className="weekHero simpleWeekHero">
        <div>
          <p className="eyebrow">ABOUT US</p>
          <h1>About TEDANK5</h1>
        </div>
      </header>

      <article className="infoCard aboutCard">
        <span className="infoIcon">💬</span>
        <div className="infoCardBody">
          <p className="infoLabel">WELCOME</p>
          <h2>Welcome to TED ANK 5, your English 2 Weekly Hub!</h2>
          <p className="infoText">
            This page has been created by your English 2 teachers to share what we have been learning
            and doing in our lessons each week.
          </p>
          <p className="infoText">
            As you know, all official information is available on the <strong>TED PORTAL</strong>. This
            page is designed to give you a simple overview of your English 2 lessons, along with extra
            activities for eager learners, useful resources, and important reminders.
          </p>
          <p className="aboutClosing">We hope you find it helpful and enjoy exploring! ✨</p>
        </div>
      </article>

      <div className="aboutAvatars">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/about-avatar-1.png" alt="" className="aboutAvatarImg" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/about-avatar-2.png" alt="" className="aboutAvatarImg" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/about-avatar-3.png" alt="" className="aboutAvatarImg" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/about-avatar-4.png" alt="" className="aboutAvatarImg" />
      </div>
    </main>
  );
}
