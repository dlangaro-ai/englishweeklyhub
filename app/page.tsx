import CourseDashboard from "@/components/CourseDashboard";
import { weeks } from "@/lib/courseData";

export default function Home() {
  return <CourseDashboard weeks={weeks} />;
}
