"use client";

import { ProgressProvider } from "@/components/ProgressProvider";
import StudentIdentityGate from "@/components/StudentIdentityGate";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <StudentIdentityGate>{children}</StudentIdentityGate>
    </ProgressProvider>
  );
}
