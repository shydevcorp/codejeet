"use client";

import { useEffect, useState } from "react";
import LeetCodeDashboard from "@/components/LeetCodeDashboard";
import { ClipLoader } from "react-spinners";
import { useAuth } from "@clerk/nextjs";

export default function DashboardPage() {
  const { userId } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

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
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader size={35} color="#FFFFFF" loading={true} />
        <div className="text-lg ml-2">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <LeetCodeDashboard questions={questions} companies={companies} />
    </div>
  );
}
