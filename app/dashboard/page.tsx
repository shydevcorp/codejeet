"use client";

import { useEffect, useState } from "react";
import LeetCodeDashboard from "@/components/LeetCodeDashboard";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { userId } = useAuth();
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetch("/api/questions")
        .then((res) => res.json())
        .then((data) => {
          setQuestions(data.questions);
          setCompanies(data.companies);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error loading questions:", error);
          setLoading(false);
        });
    }
  }, [userId]);

  useEffect(() => {
    if (!userId && !loading) {
      router.push("/");
    }
  }, [userId, loading, router]);

  if (loading || !userId) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="w-48 h-8 bg-muted animate-pulse rounded" />
              <div className="w-80 h-5 bg-muted animate-pulse rounded" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-4 rounded-lg bg-muted/50">
                  <div className="space-y-3">
                    <div className="w-8 h-8 bg-muted animate-pulse rounded" />
                    <div className="w-20 h-4 bg-muted animate-pulse rounded" />
                    <div className="w-full h-2 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="w-64 h-10 bg-muted animate-pulse rounded" />
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-32 h-10 bg-muted animate-pulse rounded" />
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-9 gap-4 pb-2 text-sm text-muted-foreground border-b">
                {[
                  "Title",
                  "Company",
                  "Difficulty",
                  "Topics",
                  "Acceptance",
                  "Frequency",
                  "Premium",
                  "Solution",
                ].map((header) => (
                  <div key={header} className="w-16 h-4 bg-muted animate-pulse rounded" />
                ))}
              </div>

              {/* Table Rows */}
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-9 gap-4 py-3 border-b border-border/50 items-center"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted animate-pulse rounded" />
                    <div className="w-20 h-4 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="w-16 h-4 bg-muted animate-pulse rounded" />
                  <div className="w-12 h-6 bg-muted animate-pulse rounded-full" />
                  <div className="flex gap-1">
                    <div className="w-12 h-5 bg-muted animate-pulse rounded" />
                    <div className="w-16 h-5 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="w-12 h-4 bg-muted animate-pulse rounded" />
                  <div className="w-12 h-4 bg-muted animate-pulse rounded" />
                  <div className="w-4 h-4 bg-muted animate-pulse rounded" />
                  <div className="flex gap-2">
                    <div className="w-4 h-4 bg-muted animate-pulse rounded" />
                    <div className="w-4 h-4 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div className="flex justify-between items-center pt-4">
                <div className="w-24 h-8 bg-muted animate-pulse rounded" />
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-muted animate-pulse rounded" />
                  <div className="w-8 h-8 bg-muted animate-pulse rounded" />
                  <div className="w-8 h-8 bg-muted animate-pulse rounded" />
                  <div className="w-8 h-8 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <LeetCodeDashboard questions={questions} companies={companies} />
    </div>
  );
}
