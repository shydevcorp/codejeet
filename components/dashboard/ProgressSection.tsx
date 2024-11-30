import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProgressSectionProps {
  stats: {
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    totalSolved: number;
  };
}

export function ProgressSection({ stats }: ProgressSectionProps) {
  const difficulties = [
    { name: "Easy", value: stats.easySolved, color: "green" },
    { name: "Medium", value: stats.mediumSolved, color: "yellow" },
    { name: "Hard", value: stats.hardSolved, color: "red" },
  ];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Problem Solving Progress</CardTitle>
        <CardDescription>Your solved problems by difficulty</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {difficulties.map(({ name, value, color }) => (
            <div key={name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className={`bg-${color}-500/20 text-${color}-700`}
                  >
                    {name}
                  </Badge>
                  <span className="text-sm">{value} solved</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {((value / stats.totalSolved) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress
                value={(value / stats.totalSolved) * 100}
                className={`bg-${color}-500/20`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
