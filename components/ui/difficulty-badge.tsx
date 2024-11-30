import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: "Easy" | "Medium" | "Hard";
  count?: number;
  showCount?: boolean;
}

export function DifficultyBadge({
  difficulty,
  count,
  showCount = false,
}: DifficultyBadgeProps) {
  const baseStyles = "px-2 py-1 rounded-full text-xs font-semibold";

  const difficultyStyles = {
    Easy: "bg-green-500/20 text-green-700 dark:text-green-400",
    Medium: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    Hard: "bg-red-500/20 text-red-700 dark:text-red-400",
  };

  return (
    <span className={cn(baseStyles, difficultyStyles[difficulty])}>
      {difficulty}
      {showCount && count !== undefined && ` (${count})`}
    </span>
  );
}
