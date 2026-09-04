"use client";

import Link from "next/link";
import { useEditableField } from "./useEditableField";
import EditFormBody from "./EditFormBody";
import { imageWidthStyle } from "@/lib/imageSize";

export default function BonusCard({
  weekNumber,
  text,
  image,
  imageWidth,
  isEditor
}: {
  weekNumber: number;
  text: string;
  image?: string;
  imageWidth?: number;
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
    <div className="infoCard skillsFolder">
      <span className="infoIcon">🎁</span>
      <div className="infoCardBody">
        <div className="infoCardHead">
          <p className="infoLabel">BONUS</p>
          {isEditor && !editable.editing && (
            <button className="editButton" type="button" onClick={editable.startEdit}>
              ✏️ Edit
            </button>
          )}
        </div>

        {editable.editing ? (
          <>
            <h2>Eager Learners</h2>
            <EditFormBody editable={editable} isList={false} />
          </>
        ) : (
          <Link href={`/week/${weekNumber}/skills`} className="skillsFolderLink">
            <h2>Eager Learners</h2>
            <p className="infoText">{text}</p>
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="bookImage"
                src={image}
                alt=""
                style={imageWidthStyle(imageWidth)}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
            <span className="openLabel">Open folder →</span>
          </Link>
        )}
      </div>
    </div>
  );
}
