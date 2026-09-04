import Link from "next/link";
import { Week } from "@/lib/courseData";
import EditableSection from "./EditableSection";
import SummaryCard from "./SummaryCard";
import BonusCard from "./BonusCard";
import PublishToggle from "./PublishToggle";
import InlineTextField from "./InlineTextField";
import BookExtraImage from "./BookExtraImage";

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
        <SummaryCard
          weekNumber={week.number}
          summary={week.summary}
          image={week.summaryImage}
          imageWidth={week.summaryImageWidth}
          isEditor={isEditor}
        />

        <EditableSection
          weekNumber={week.number}
          icon="📚"
          label="BOOKS USED"
          heading="Books & Pages"
          field="books"
          imageField="bookImage"
          imageWidthField="bookImageWidth"
          isList={true}
          value={week.books}
          image={week.bookImage}
          imageWidth={week.bookImageWidth}
          emptyText="No book information added yet."
          isEditor={isEditor}
          cardClassName="infoCardBooks"
          extra={
            <BookExtraImage
              weekNumber={week.number}
              image={week.bookImage2}
              imageWidth={week.bookImage2Width}
              isEditor={isEditor}
            />
          }
        />

        <EditableSection
          weekNumber={week.number}
          icon="🏠"
          label="HOMEWORK"
          heading="Homework Pages"
          field="homework"
          imageField="homeworkImage"
          imageWidthField="homeworkImageWidth"
          isList={true}
          value={week.homework}
          image={week.homeworkImage}
          imageWidth={week.homeworkImageWidth}
          emptyText="No homework this week — enjoy the break!"
          isEditor={isEditor}
          cardClassName="infoCardHomework"
        />

        <BonusCard
          weekNumber={week.number}
          text={week.bonusText}
          image={week.bonusImage}
          imageWidth={week.bonusImageWidth}
          isEditor={isEditor}
        />
      </section>
    </main>
  );
}
