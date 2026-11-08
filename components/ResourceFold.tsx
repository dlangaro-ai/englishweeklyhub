import { LibraryLink } from "@/lib/courseData";
import { normalizeUrl } from "@/lib/normalizeUrl";
import Icon, { IconName } from "./Icon";
import { ResourceAdmin, WeekOption } from "./ResourceAdmin";

const TYPES: Record<"link" | "image" | "pdf", { icon: IconName; label: string }> = {
  link: { icon: "link", label: "Website" },
  image: { icon: "picture", label: "Picture" },
  pdf: { icon: "pdf", label: "PDF" }
};

// One resource on the Resources page as a clickable bar, the same as the
// activities on an Extra Activities page: click it and it opens to show the
// picture, which weeks use it and a button to open it. Colours come from
// .activityCard, so the bars cycle pink, blue, teal… like the activities.
export default function ResourceFold({
  link,
  weekNumbers,
  isEditor,
  weekOptions
}: {
  link: LibraryLink;
  weekNumbers: number[];
  isEditor: boolean;
  weekOptions: WeekOption[];
}) {
  const type = TYPES[link.resourceType ?? "link"];
  const title = link.title.replace(/^📄\s*/, "");
  const href = normalizeUrl(link.href);

  return (
    <details className="activityCard activityFold resourceFold">
      <summary className="activityFoldSummary">
        <span className="activityIndex"><Icon name={type.icon} size={30} /></span>
        <span className="activityType activityTypeButton">{type.label}</span>
        <span className="activityFoldTitle">{title}</span>
        <span className="aboutFoldChevron" aria-hidden="true">▾</span>
      </summary>
      <div className="activityFoldBody">
        <p className="resourceFoldWeeks">
          {weekNumbers.length > 0 ? `Used in week ${weekNumbers.join(", ")}` : "In our library"}
        </p>
        {link.image && (
          <a href={href} target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={link.image} alt={title} className="activityThumbnail" />
          </a>
        )}
        <a href={href} target="_blank" rel="noreferrer" className="textLink">
          Open {type.label.toLowerCase()} ↗
        </a>
        {isEditor && <ResourceAdmin item={link} weeks={weekOptions} />}
      </div>
    </details>
  );
}
