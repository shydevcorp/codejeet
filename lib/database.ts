import "server-only";
import { db, companies, questions, topics, companyQuestions, questionTopics } from "./db";
import { eq, inArray, asc } from "drizzle-orm";

export interface QuestionFilters {
  companies?: string[];
  difficulties?: ("Easy" | "Medium" | "Hard")[];
  topics?: string[];
  timeframes?: ("30_days" | "3_months" | "6_months" | "more_than_6m" | "all")[];
  isPremium?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface QuestionWithDetails {
  id: number;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  Difficulty: "Easy" | "Medium" | "Hard";
  acceptance_rate: number;
  link: string;
  company: string;
  frequency: number;
  timeframe: string;
  topics: string[];
  "Acceptance %": string;
  "Frequency %": string;
  Topics: string;
  ID: string;
  Title: string;
  URL: string;
}

export interface QuestionsResponse {
  questions: QuestionWithDetails[];
  companies: string[];
  totalCount: number;
}

export interface Company {
  id: number;
  name: string;
}

const mapDifficulty = (difficulty: string): "Easy" | "Medium" | "Hard" => {
  const upperDifficulty = difficulty.toUpperCase();
  if (upperDifficulty === "EASY") return "Easy";
  if (upperDifficulty === "MEDIUM") return "Medium";
  if (upperDifficulty === "HARD") return "Hard";
  return "Easy";
};

export async function getQuestionsFromDatabase(
  filters: QuestionFilters = {}
): Promise<QuestionsResponse> {
  try {
    const results = await db
      .select({
        frequency: companyQuestions.frequency,
        timeframe: companyQuestions.timeframe,
        companyId: companies.id,
        companyName: companies.name,
        questionId: questions.id,
        questionSlug: questions.slug,
        questionTitle: questions.title,
        questionDifficulty: questions.difficulty,
        questionAcceptanceRate: questions.acceptanceRate,
        questionLink: questions.link,
        questionIsPremium: questions.isPremium,
      })
      .from(companyQuestions)
      .innerJoin(companies, eq(companyQuestions.companyId, companies.id))
      .innerJoin(questions, eq(companyQuestions.questionId, questions.id));

    let filteredResults = results;

    if (filters.companies && filters.companies.length > 0) {
      filteredResults = filteredResults.filter((r) => filters.companies!.includes(r.companyName));
    }

    if (filters.difficulties && filters.difficulties.length > 0) {
      filteredResults = filteredResults.filter((r) =>
        filters.difficulties!.includes(r.questionDifficulty as "Easy" | "Medium" | "Hard")
      );
    }

    if (filters.timeframes && filters.timeframes.length > 0) {
      filteredResults = filteredResults.filter((r) =>
        filters.timeframes!.includes(r.timeframe as any)
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredResults = filteredResults.filter(
        (r) =>
          r.questionTitle.toLowerCase().includes(searchLower) ||
          r.companyName.toLowerCase().includes(searchLower)
      );
    }

    if (filters.limit) {
      const offset = filters.offset || 0;
      filteredResults = filteredResults.slice(offset, offset + filters.limit);
    }

    const questionIds = [...new Set(filteredResults.map((r) => r.questionId))];
    const questionTopicsData = await db
      .select({
        questionId: questionTopics.questionId,
        topicName: topics.name,
      })
      .from(questionTopics)
      .innerJoin(topics, eq(questionTopics.topicId, topics.id))
      .where(inArray(questionTopics.questionId, questionIds));

    const topicsByQuestion = questionTopicsData.reduce(
      (acc, item) => {
        if (!acc[item.questionId]) {
          acc[item.questionId] = [];
        }
        acc[item.questionId].push(item.topicName);
        return acc;
      },
      {} as Record<number, string[]>
    );

    const transformedQuestions: QuestionWithDetails[] = filteredResults.map((item) => {
      const questionTopics = topicsByQuestion[item.questionId] || [];
      const urlPath = `/problems/${item.questionSlug}/`;

      return {
        id: item.questionId,
        slug: item.questionSlug,
        title: item.questionTitle,
        difficulty: mapDifficulty(item.questionDifficulty),
        Difficulty: mapDifficulty(item.questionDifficulty),
        acceptance_rate: parseFloat(item.questionAcceptanceRate),
        link: item.questionLink,
        company: item.companyName,
        frequency: parseFloat(item.frequency),
        timeframe: item.timeframe,
        topics: questionTopics,
        "Acceptance %": `${(parseFloat(item.questionAcceptanceRate) * 100).toFixed(1)}%`,
        "Frequency %": `${parseFloat(item.frequency).toFixed(1)}%`,
        Topics: questionTopics.join(", "),
        ID: item.questionSlug,
        Title: item.questionTitle,
        URL: urlPath,
      };
    });

    const precedence = ["30_days", "3_months", "6_months", "more_than_6m", "all"] as const;
    const precedenceRank: Record<string, number> = precedence.reduce(
      (acc, tf, idx) => {
        acc[tf] = idx;
        return acc;
      },
      {} as Record<string, number>
    );

    const dedupedMap = new Map<string, QuestionWithDetails>();
    for (const q of transformedQuestions) {
      const key = `${q.company}|${q.id}`;
      const existing = dedupedMap.get(key);
      if (!existing) {
        dedupedMap.set(key, q);
      } else {
        const existingRank = precedenceRank[existing.timeframe] ?? Number.MAX_SAFE_INTEGER;
        const newRank = precedenceRank[q.timeframe] ?? Number.MAX_SAFE_INTEGER;
        if (newRank < existingRank) {
          dedupedMap.set(key, q);
        }
      }
    }

    let filteredQuestions = Array.from(dedupedMap.values());

    if (filters.topics && filters.topics.length > 0) {
      filteredQuestions = filteredQuestions.filter((q) =>
        filters.topics!.some((topic) => q.topics.includes(topic))
      );
    }

    const uniqueCompanies = [...new Set(filteredQuestions.map((q) => q.company))];

    return {
      questions: filteredQuestions,
      companies: uniqueCompanies,
      totalCount: filteredQuestions.length,
    };
  } catch (error) {
    console.error("Error fetching questions from database:", error);
    return { questions: [], companies: [], totalCount: 0 };
  }
}

export async function getCompanies(): Promise<Company[]> {
  try {
    const result = await db
      .select({
        id: companies.id,
        name: companies.name,
      })
      .from(companies)
      .orderBy(asc(companies.name));

    return result;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}

export async function getTopics(): Promise<string[]> {
  try {
    const result = await db
      .select({
        name: topics.name,
      })
      .from(topics)
      .orderBy(asc(topics.name));

    return result.map((t) => t.name);
  } catch (error) {
    console.error("Error fetching topics:", error);
    return [];
  }
}

export async function getCompanyQuestions(
  companyName: string,
  timeframe?: "30_days" | "3_months" | "6_months" | "more_than_6m" | "all"
): Promise<QuestionWithDetails[]> {
  const filters: QuestionFilters = {
    companies: [companyName],
  };

  if (timeframe) {
    filters.timeframes = [timeframe];
  }

  const result = await getQuestionsFromDatabase(filters);
  return result.questions;
}
