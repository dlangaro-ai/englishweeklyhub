import Link from "next/link";
import { Week } from "@/lib/courseData";
import EditableSection from "./EditableSection";
import BonusCard from "./BonusCard";
import PublishToggle from "./PublishToggle";
import InlineTextField from "./InlineTextField";

export default function WeekView({ week, isEditor }: { week: Week; isEditor: boolean }) {
  return (
    <main className="shell narrow">
      <Link href="/" className="backLink">← All weeks</Link>

      <header className="weekHero simpleWeekHero">
        <div>
          <p className="eyebrow">WEEK {week.number}</p>
          <InlineTextField weekNumber={week.number} field="title" value={week.title} isEditor={isEditor} tag="h1" />
          <InlineTextField
            weekNumber={week.number}
            field="unit"
            value={week.unit}
            isEditor={isEditor}
            tag="p"
            className="unitLabel"
          />
          <PublishToggle weekNumber={week.number} published={week.published} isEditor={isEditor} />
        </div>
      </header>

      <section className="weekInfoGrid">
        <EditableSection
          weekNumber={week.number}
          icon="✨"
          label="THIS WEEK"
          heading="What we're doing"
          field="summary"
          imageField="summaryImage"
          isList={false}
          value={week.summary}
          image={week.summaryImage}
          emptyText="Nothing added yet."
          isEditor={isEditor}
          cardClassName="summaryCard"
          richText
          maxWords={300}
        />

        <EditableSection
          weekNumber={week.number}
          icon="📚"
          label="BOOKS USED"
          heading="Books & Pages"
          field="books"
          imageField="bookImage"
          isList={true}
          value={week.books}
          image={week.bookImage}
          emptyText="No book information added yet."
          isEditor={isEditor}
          cardClassName="infoCardBooks"
        />

        <EditableSection
          weekNumber={week.number}
          icon="🏠"
          label="HOMEWORK"
          heading="Homework Pages"
          field="homework"
          imageField="homeworkImage"
          isList={true}
          value={week.homework}
          image={week.homeworkImage}
          emptyText="No homework this week — enjoy the break!"
          isEditor={isEditor}
          cardClassName="infoCardHomework"
        />

        <BonusCard
          weekNumber={week.number}
          text={week.bonusText}
          image={week.bonusImage}
          isEditor={isEditor}
        />
      </section>
    </main>
  );
}
