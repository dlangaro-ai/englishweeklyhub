// The centred heading used at the top of the week-list pages: a title, the
// green "weeks open" pill (same as the landing page) and one line of text.
export default function PageIntro({
  title,
  openCount,
  totalCount,
  text
}: {
  title: string;
  openCount: number;
  totalCount: number;
  text: string;
}) {
  return (
    <header className="pageIntro">
      <h1 className="pageTitle">{title}</h1>
      <span className="weeksOpenPill">{openCount} of {totalCount} weeks open</span>
      <p className="pageIntroText">{text}</p>
    </header>
  );
}
