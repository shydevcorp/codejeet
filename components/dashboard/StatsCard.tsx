import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import NumberTicker from "@/components/magic-ui/number-ticker";

interface StatsCardProps {
  title: string;
  value: number;
  description?: string;
  icon: LucideIcon;
  className?: string;
  valueClassName?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  className,
  valueClassName,
}: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueClassName}`}>
          <NumberTicker value={value} />
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
