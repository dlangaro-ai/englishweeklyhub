"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditModeToggle({ isEditor }: { isEditor: boolean }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  if (!isEditor) {
    return (
      <Link href="/admin/login" className="editModeLink" title="Teacher login">
        ⚙️
      </Link>
    );
  }

  return (
    <div className="editModeBadge">
      <span>✏️ Edit mode on</span>
      <Link href="/admin/completions" className="editModeLogout">
        📊 Completions
      </Link>
      <button className="editModeLogout" type="button" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}
