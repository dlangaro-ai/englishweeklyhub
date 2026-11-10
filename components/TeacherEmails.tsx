import { team } from "@/lib/team";

// The English 2 teachers' avatars; each one opens an email to that teacher.
// Used at the bottom of the Extra Activities pages.
export default function TeacherEmails({ id }: { id?: string }) {
  return (
    <div id={id} className="activityFootnote">
      <p className="activityFootnoteText">
        📧 Some activities ask you to send your work by email.{" "}
        <strong>Click your teacher&apos;s avatar to email them:</strong>
      </p>
      <div className="aboutAvatars">
        {team.map((member) => (
          <a className="aboutAvatar" href={`mailto:${member.email}`} title={member.email}
            aria-label={`Email ${member.name}`}
            key={member.email}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={member.image} alt="" className="aboutAvatarImg" />
            <p className="aboutAvatarName">{member.name}</p>
            <span className="teacherEmailPill"><span aria-hidden="true">✉️ </span>Email</span>
          </a>
        ))}
      </div>
    </div>
  );
}
