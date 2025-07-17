"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { capitalizeWords } from "@/utils/utils";
import { VideoDialog } from "@/components/VideoDialog";
import { SolutionDialog } from "@/components/SolutionDialog";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import TopicDropdown from "@/components/TopicDropdown";

interface Question {
  id: number;
  slug: string;
  title: string;
  difficulty: string;
  acceptance_rate: number;
  link: string;
  company: string;
  frequency: number;
  timeframe: string;
  topics: string[];
  ID: string;
  Title: string;
  URL: string;
  Difficulty: string;
  "Acceptance %": string;
  "Frequency %": string;
  "Is Premium": string;
  Topics: string;
}

interface LeetCodeDashboardProps {
  questions: Question[];
  companies: string[];
}

const ITEMS_PER_PAGE = 10;

const LeetCodeDashboard: React.FC<LeetCodeDashboardProps> = ({
  questions = [],
  companies = [],
}) => {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleDashboardClick = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/sign-in");
    }
  };

  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [selectedCompany] = useState("");
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [goToPage, setGoToPage] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [timeframeFilter, setTimeframeFilter] = useState("all");
  const [progressLoading, setProgressLoading] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    setIsClient(true);

    const loadUserProgress = async () => {
      if (!userId) {
        const savedItems = localStorage.getItem("leetcode-checked-items");
        if (savedItems) {
          try {
            const parsed = JSON.parse(savedItems);
            setCheckedItems(parsed);
          } catch (err) {
            console.error("Error parsing localStorage data:", err);
          }
        }
        return;
      }

      setProgressLoading(true);
      try {
        const savedItems = localStorage.getItem("leetcode-checked-items");
        const localProgress = savedItems ? JSON.parse(savedItems) : {};
        const response = await fetch("/api/progress", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ localProgress }),
        });

        if (response.ok) {
          const data = await response.json();
          setCheckedItems(data.progress);
          localStorage.setItem("leetcode-checked-items", JSON.stringify(data.progress));
        } else {
          setCheckedItems(localProgress);
        }
      } catch (error) {
        console.error("Error loading user progress:", error);
        const savedItems = localStorage.getItem("leetcode-checked-items");
        if (savedItems) {
          try {
            const parsed = JSON.parse(savedItems);
            setCheckedItems(parsed);
          } catch (err) {
            console.error("Error parsing localStorage data:", err);
          }
        }
      } finally {
        setProgressLoading(false);
      }
    };

    loadUserProgress();
  }, [userId]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("leetcode-checked-items", JSON.stringify(checkedItems));
    }
  }, [checkedItems, isClient]);

  const handleCheckboxChange = async (id: string, value: boolean) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (userId) {
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionSlug: id,
            completed: value,
          }),
        });
      } catch (error) {
        console.error("Error updating progress:", error);
      }
    }
  };

  const totalQuestions = questions.length;

  const companyStats = useMemo(() => {
    return companies
      .map((company) => ({
        name: company,
        count: questions.filter((q) => q.company === company).length,
      }))
      .sort((a, b) => b.count - a.count);
  }, [questions, companies]);

  const uniqueTopics = useMemo(() => {
    const topicsSet = new Set<string>();
    questions.forEach((question) => {
      question.Topics.split(",").forEach((topic) => {
        const trimmedTopic = topic.trim();
        if (trimmedTopic) {
          topicsSet.add(trimmedTopic);
        }
      });
    });
    return Array.from(topicsSet);
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    const queryWords = searchQuery.trim().toLowerCase().split(/\s+/);
    return questions.filter((question) => {
      const matchesSearch = queryWords.every(
        (word) =>
          question.Title.toLowerCase().includes(word) ||
          question.company.toLowerCase().includes(word) ||
          question.Topics.toLowerCase()
            .split(",")
            .some((topic) => topic.trim().includes(word))
      );
      const matchesDifficulty =
        difficultyFilter === "all" || question.Difficulty === difficultyFilter;
      const matchesCompany = !selectedCompany || question.company === selectedCompany;
      const matchesTopic =
        selectedTopics.length === 0 ||
        selectedTopics.every((topic) =>
          question.Topics.split(",")
            .map((t) => t.trim())
            .includes(topic)
        );
      const matchesTimeframe = timeframeFilter === "all" || question.timeframe === timeframeFilter;

      return (
        matchesSearch && matchesDifficulty && matchesCompany && matchesTopic && matchesTimeframe
      );
    });
  }, [questions, searchQuery, difficultyFilter, selectedCompany, selectedTopics, timeframeFilter]);

  const filteredAndSortedQuestions = useMemo(() => {
    let result = filteredQuestions;

    if (sortDirection) {
      result = [...result].sort((a, b) => {
        const freqA = parseFloat(a["Frequency %"]);
        const freqB = parseFloat(b["Frequency %"]);
        return sortDirection === "asc" ? freqA - freqB : freqB - freqA;
      });
    }

    return result;
  }, [filteredQuestions, sortDirection]);

  const handleFrequencySort = () => {
    setSortDirection((prev) => {
      if (prev === null) return "desc";
      if (prev === "desc") return "asc";
      return null;
    });
  };

  const statistics = useMemo(() => {
    const uniqueQuestions = Array.from(new Set(filteredQuestions.map((q) => q.ID)));
    const total = uniqueQuestions.length;

    const solvedQuestions = new Set(
      filteredQuestions.filter((q) => checkedItems[q.ID]).map((q) => q.ID)
    );

    const totalSolved = solvedQuestions.size;

    const easyQuestions = new Set(
      filteredQuestions.filter((q) => q.Difficulty === "Easy").map((q) => q.ID)
    );
    const mediumQuestions = new Set(
      filteredQuestions.filter((q) => q.Difficulty === "Medium").map((q) => q.ID)
    );
    const hardQuestions = new Set(
      filteredQuestions.filter((q) => q.Difficulty === "Hard").map((q) => q.ID)
    );

    const easySolved = new Set(
      filteredQuestions
        .filter((q) => q.Difficulty === "Easy" && checkedItems[q.ID])
        .map((q) => q.ID)
    ).size;

    const mediumSolved = new Set(
      filteredQuestions
        .filter((q) => q.Difficulty === "Medium" && checkedItems[q.ID])
        .map((q) => q.ID)
    ).size;

    const hardSolved = new Set(
      filteredQuestions
        .filter((q) => q.Difficulty === "Hard" && checkedItems[q.ID])
        .map((q) => q.ID)
    ).size;

    return {
      total,
      totalSolved,
      easy: easyQuestions.size,
      easySolved,
      medium: mediumQuestions.size,
      mediumSolved,
      hard: hardQuestions.size,
      hardSolved,
    };
  }, [filteredQuestions, checkedItems]);

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedQuestions.slice(startIndex, endIndex);
  }, [filteredAndSortedQuestions, currentPage, itemsPerPage]);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  const handleGoToPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const pageNumber = parseInt(goToPage);
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
        setGoToPage("");
      }
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => {
      const nextPage = Math.min(prev + 1, totalPages);
      return nextPage > totalPages ? totalPages : nextPage;
    });
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredQuestions]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Practice Questions</CardTitle>
          <CardDescription>
            Browse through {totalQuestions.toLocaleString()} DSA questions asked in technical
            interviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-background/50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-baseline">
                    <div className="text-2xl font-bold">{statistics.totalSolved}</div>
                    <div className="text-sm text-muted-foreground">/ {statistics.total}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Total Solved</div>
                  <div className="mt-2">
                    <Progress
                      value={(statistics.totalSolved / statistics.total) * 100}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background/50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-baseline">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {statistics.easySolved}
                    </div>
                    <div className="text-sm text-muted-foreground">/ {statistics.easy}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Easy</div>
                  <div className="mt-2">
                    <Progress
                      value={(statistics.easySolved / statistics.easy) * 100}
                      className="h-2 [&>div]:bg-green-600 dark:[&>div]:bg-green-400 bg-green-200 dark:bg-green-950"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background/50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-baseline">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {statistics.mediumSolved}
                    </div>
                    <div className="text-sm text-muted-foreground">/ {statistics.medium}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Medium</div>
                  <div className="mt-2">
                    <Progress
                      value={(statistics.mediumSolved / statistics.medium) * 100}
                      className="h-2 [&>div]:bg-yellow-600 dark:[&>div]:bg-yellow-400 bg-yellow-200 dark:bg-yellow-950"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background/50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-baseline">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {statistics.hardSolved}
                    </div>
                    <div className="text-sm text-muted-foreground">/ {statistics.hard}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Hard</div>
                  <div className="mt-2">
                    <Progress
                      value={(statistics.hardSolved / statistics.hard) * 100}
                      className="h-2 [&>div]:bg-red-600 dark:[&>div]:bg-red-400 bg-red-200 dark:bg-red-950"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-[200px]">
                <Input
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full"
                />
              </div>

              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full md:w-52">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              <Select value={timeframeFilter} onValueChange={setTimeframeFilter}>
                <SelectTrigger className="w-full md:w-56">
                  <SelectValue placeholder="Last Appeared" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Timeframes</SelectItem>
                  <SelectItem value="30_days">Last 30 Days</SelectItem>
                  <SelectItem value="3_months">Last 3 Months</SelectItem>
                  <SelectItem value="6_months">Last 6 Months</SelectItem>
                  <SelectItem value="more_than_6m">More than 6 Months</SelectItem>
                </SelectContent>
              </Select>

              <TopicDropdown
                options={uniqueTopics}
                selectedOptions={selectedTopics}
                setSelectedOptions={setSelectedTopics}
              />
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No questions found , try some other filters?
              </div>
            ) : (
              <>
                <div className="rounded-md border hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-4"></TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Topics</TableHead>
                        <TableHead className="text-right">Acceptance</TableHead>
                        <TableHead
                          className="text-right cursor-pointer hover:text-primary transition-colors"
                          onClick={handleFrequencySort}
                        >
                          Frequency
                        </TableHead>
                        <TableHead className="text-center">Premium</TableHead>
                        <TableHead className="text-left">Solution</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((question) => (
                        <TableRow
                          key={`${question.id}-${question.company}-${question.timeframe || "unknown"}`}
                        >
                          <TableCell className="w-4">
                            <Checkbox
                              checked={checkedItems[question.ID] || false}
                              onCheckedChange={(value: boolean) =>
                                handleCheckboxChange(question.ID, value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <a
                              href={`https://leetcode.com${question.URL}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground hover:text-primary hover:underline"
                            >
                              {question.Title}
                            </a>
                          </TableCell>
                          <TableCell>
                            <div className="capitalize">{capitalizeWords(question.company)}</div>
                          </TableCell>
                          <TableCell>
                            <DifficultyBadge
                              difficulty={question.Difficulty as "Easy" | "Medium" | "Hard"}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {question.Topics.split(",").map((topic, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-700 dark:text-blue-400"
                                >
                                  {topic.trim()}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{question["Acceptance %"]}</TableCell>
                          <TableCell className="text-right">{question["Frequency %"]}</TableCell>
                          <TableCell className="text-center">
                            {question["Is Premium"] === "Y" ? (
                              <Check className="h-4 w-4 mx-auto text-green-600 dark:text-green-400" />
                            ) : (
                              <X className="h-4 w-4 mx-auto text-red-600 dark:text-red-400" />
                            )}
                          </TableCell>
                          <TableCell className="flex items-center gap-2">
                            <VideoDialog id={question.ID} title={question.Title} />
                            <SolutionDialog questionId={question.ID} title={question.Title} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="hidden md:flex flex-col sm:flex-row items-center justify-between py-4 px-2 gap-4">
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <p className="text-sm text-muted-foreground whitespace-nowrap">
                        Items per page
                      </p>
                      <Select
                        value={itemsPerPage.toString()}
                        onValueChange={handleItemsPerPageChange}
                      >
                        <SelectTrigger className="w-[70px]">
                          <SelectValue placeholder={itemsPerPage} />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 10, 20, 50, 100].map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline ml-2">Previous</span>
                      </Button>
                      <div className="text-sm font-medium whitespace-nowrap">
                        {currentPage} / {totalPages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                      >
                        <span className="hidden sm:inline mr-2">Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:hidden">
                  {currentItems.map((question) => (
                    <Card
                      key={`${question.id}-${question.company}-${question.timeframe || "unknown"}`}
                      className="p-4 bg-background/50 border"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <Checkbox
                            checked={checkedItems[question.ID] || false}
                            onCheckedChange={(value: boolean) =>
                              handleCheckboxChange(question.ID, value)
                            }
                          />
                          <div>
                            <a
                              href={`https://leetcode.com${question.URL}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium hover:underline"
                            >
                              {question.Title}
                            </a>
                            <div className="capitalize text-xs text-muted-foreground">
                              {capitalizeWords(question.company)}
                            </div>
                          </div>
                        </div>
                        <DifficultyBadge
                          difficulty={question.Difficulty as "Easy" | "Medium" | "Hard"}
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {question.Topics.split(",").map((topic, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-700 dark:text-blue-400"
                          >
                            {topic.trim()}
                          </span>
                        ))}
                      </div>

                      <div className="mt-3 flex gap-2">
                        <VideoDialog id={question.ID} title={question.Title} />
                        <SolutionDialog questionId={question.ID} title={question.Title} />
                      </div>
                    </Card>
                  ))}

                  <div className="flex md:hidden flex-col sm:flex-row items-center justify-between py-4 px-2 gap-4 w-full">
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <p className="text-sm text-muted-foreground whitespace-nowrap">
                        Items per page
                      </p>
                      <Select
                        value={itemsPerPage.toString()}
                        onValueChange={handleItemsPerPageChange}
                      >
                        <SelectTrigger className="w-[70px]">
                          <SelectValue placeholder={itemsPerPage} />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 10, 20, 50, 100].map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="text-sm font-medium whitespace-nowrap">
                        {currentPage} / {totalPages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeetCodeDashboard;
