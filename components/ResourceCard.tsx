import { LibraryLink } from "@/lib/courseData";
import { normalizeUrl } from "@/lib/normalizeUrl";
import { ResourceAdmin, WeekOption } from "./ResourceAdmin";

const TYPE_LABELS = {
  link: { icon: "🌐", label: "Website" },
  image: { icon: "🖼️", label: "Image" },
  pdf: { icon: "📄", label: "PDF" }
} as const;

// Colours cycle with the card's position so neighbours always differ.
const TINTS = ["resBlue", "resSun", "resPink", "resPurple"];

// One resource (website, picture or PDF) as a candy-coloured card, shared by
// the Resources page and each week's resources page. The teacher also gets the
// edit / put-on-a-week / delete controls underneath.
export default function ResourceCard({
  link,
  index,
  weekNumbers,
  isEditor,
  weekOptions
}: {
  link: LibraryLink;
  index: number;
  weekNumbers: number[];
  isEditor: boolean;
  weekOptions: WeekOption[];
}) {
  const type = TYPE_LABELS[link.resourceType ?? "link"];
  const title = link.title.replace(/^📄\s*/, "");

  return (
    <li>
      <div className={`resourceCard ${TINTS[index % TINTS.length]}`}>
        <a href={normalizeUrl(link.href)} target="_blank" rel="noreferrer" className="resourceCardLink">
          <div className="resourceCardTop">
            <span className="resourceBadge">
              <span aria-hidden="true">{type.icon}</span> {type.label}
            </span>
            <span className="resourceWeek">
              {weekNumbers.length > 0 ? `WEEK ${weekNumbers.join(", ")}` : "LIBRARY"}
            </span>
          </div>
          {link.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={link.image} alt="" className="resourceThumb" />
          ) : (
            <div className="resourceIcon" aria-hidden="true">{type.icon}</div>
          )}
          <h3 className="resourceTitle">{title}</h3>
        </a>
        {isEditor && <ResourceAdmin item={link} weeks={weekOptions} />}
      </div>
    </li>
  );
}
