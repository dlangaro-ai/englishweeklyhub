"use client";

import Link from "next/link";
import { useEditableField } from "./useEditableField";
import EditFormBody from "./EditFormBody";
import { imageWidthStyle } from "@/lib/imageSize";
import Icon from "./Icon";

export default function BonusCard({
  weekNumber,
  text,
  image,
  imageWidth,
  activityCount,
  isEditor
}: {
  weekNumber: number;
  text: string;
  image?: string;
  imageWidth?: number;
  activityCount: number;
  isEditor: boolean;
}) {
  const editable = useEditableField({
    weekNumber,
    field: "bonusText",
    imageField: "bonusImage",
    imageWidthField: "bonusImageWidth",
    isList: false,
    initialText: text,
    initialImage: image,
    initialImageWidth: imageWidth
  });

  return (
    <div id="bonus" className="infoCard skillsFolder">
      <span className="infoIcon"><Icon name="gift" size={48} /></span>
      <div className="infoCardBody">
        <div className="infoCardHead">
          <p className="infoLabel">EXTRA ACTIVITIES</p>
          {isEditor && !editable.editing && (
            <button className="editButton" type="button" onClick={editable.startEdit}>
              ✏️ Edit
            </button>
          )}
        </div>

        {editable.editing ? (
          <>
            <h2>Extra Activities</h2>
            <EditFormBody editable={editable} isList={false} />
          </>
        ) : (
          <>
            <Link href={`/week/${weekNumber}/skills`} className="skillsFolderLink">
              <h2>Extra Activities</h2>
              <p className="infoText">{text}</p>
              {image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="bookImage"
                  src={image}
                  alt="Picture for this week's extra activities"
                  style={imageWidthStyle(imageWidth)}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              )}
              {activityCount > 0 ? (
                <span className="activityCountButton">
                  <span className="activityCountNumber">{activityCount}</span>
                  <span>{activityCount === 1 ? "activity" : "activities"}</span>
                  <span className="activityCountArrow" aria-hidden="true">→</span>
                </span>
              ) : (
                <span className="openLabel">See the activities →</span>
              )}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
