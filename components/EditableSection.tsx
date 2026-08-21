"use client";

import { useEditableField } from "./useEditableField";
import EditFormBody from "./EditFormBody";

type EditableSectionProps = {
  weekNumber: number;
  icon: string;
  label: string;
  heading: string;
  field: string;
  imageField: string;
  isList: boolean;
  value: string | string[];
  image?: string;
  emptyText: string;
  isEditor: boolean;
  cardClassName?: string;
};

export default function EditableSection({
  weekNumber,
  icon,
  label,
  heading,
  field,
  imageField,
  isList,
  value,
  image,
  emptyText,
  isEditor,
  cardClassName
}: EditableSectionProps) {
  const initialText = isList ? (value as string[]).join("\n") : (value as string);
  const editable = useEditableField({
    weekNumber,
    field,
    imageField,
    isList,
    initialText,
    initialImage: image
  });
  const listValue = Array.isArray(value) ? value : [];

  return (
    <article className={`infoCard ${cardClassName ?? ""}`}>
      <span className="infoIcon">{icon}</span>
      <div className="infoCardBody">
        <div className="infoCardHead">
          <p className="infoLabel">{label}</p>
          {isEditor && !editable.editing && (
            <button className="editButton" type="button" onClick={editable.startEdit}>
              ✏️ Edit
            </button>
          )}
        </div>
        <h2>{heading}</h2>

        {editable.editing ? (
          <EditFormBody editable={editable} isList={isList} />
        ) : (
          <>
            {isList ? (
              listValue.length ? (
                <ul className="simpleList">
                  {listValue.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="infoText">{emptyText}</p>
              )
            ) : (
              <p className="infoText">{(value as string) || emptyText}</p>
            )}
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="bookImage"
                src={image}
                alt=""
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
          </>
        )}
      </div>
    </article>
  );
}
