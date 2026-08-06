import { Users } from "lucide-react";
import { crowdLabelHi, crowdTone, type CrowdLevel } from "@/data/zoo-data";
import { useAppPrefs } from "@/lib/app-context";
import { cn } from "@/lib/utils";

export function CrowdBadge({
  level,
  className,
}: {
  level?: CrowdLevel;
  className?: string;
}) {
  const { lang } = useAppPrefs();
  if (!level) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
        crowdTone[level],
        className,
      )}
    >
      <Users className="h-3 w-3" />
      {lang === "hi" ? crowdLabelHi[level] : level}
    </span>
  );
}