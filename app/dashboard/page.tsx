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
        <div className="space-y-6">
          <div className="w-48 h-8 bg-muted animate-pulse rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
          <div className="h-[600px] bg-muted animate-pulse rounded-lg" />
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
