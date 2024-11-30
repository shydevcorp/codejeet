"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export function SolvingPatternChart() {
  // Get solved questions data from localStorage
  const getTrackingData = () => {
    const tracking = localStorage.getItem("leetcode-tracking") || "{}";
    return JSON.parse(tracking);
  };

  // Process data for the last 7 days
  const getLast7DaysData = () => {
    const trackingData = getTrackingData();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString();
    }).reverse();

    return last7Days.map((date) => ({
      date,
      solved: Object.values(trackingData).filter(
        (q: any) => new Date(q.solvedAt).toLocaleDateString() === date
      ).length,
    }));
  };

  const chartData = getLast7DaysData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solving Pattern</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="solved" fill="#8884d8" name="Problems Solved" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
