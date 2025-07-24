import { supabase, type QuestionWithDetails, type Company, type UserProgress } from "./supabase";

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

export interface QuestionsResponse {
  questions: QuestionWithDetails[];
  companies: string[];
  totalCount: number;
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
    let query = supabase.from("company_questions").select(
      `
        frequency,
        timeframe,
        companies!inner(id, name),
        questions!inner(
          id,
          slug,
          title,
          difficulty,
          acceptance_rate,
          link,
          question_topics(
            topics(name)
          )
        )
      `,
      { count: "exact" }
    );

    if (filters.companies && filters.companies.length > 0) {
      query = query.in("companies.name", filters.companies);
    }

    if (filters.difficulties && filters.difficulties.length > 0) {
      const dbDifficulties = filters.difficulties.map((d) => d.toUpperCase());
      query = query.in("questions.difficulty", dbDifficulties);
    }

    if (filters.timeframes && filters.timeframes.length > 0) {
      query = query.in("timeframe", filters.timeframes);
    }

    if (filters.search) {
      query = query.or(
        `questions.title.ilike.%${filters.search}%,companies.name.ilike.%${filters.search}%`
      );
    }

    // Apply pagination if specified
    if (filters.limit) {
      query = query.limit(filters.limit);
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + filters.limit - 1);
      }
    }

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    if (!data) {
      return { questions: [], companies: [], totalCount: 0 };
    }

    const transformedQuestions: QuestionWithDetails[] = data.map((item: any) => {
      const question = item.questions;
      const company = item.companies;

      const topics = question.question_topics?.map((qt: any) => qt.topics.name) || [];

      const urlPath = `/problems/${question.slug}/`;

      return {
        id: question.id,
        slug: question.slug,
        title: question.title,
        difficulty: mapDifficulty(question.difficulty),
        Difficulty: mapDifficulty(question.difficulty),
        acceptance_rate: question.acceptance_rate,
        link: question.link,

        company: company.name,
        frequency: item.frequency,
        timeframe: item.timeframe,
        topics: topics,

        "Acceptance %": `${(question.acceptance_rate * 100).toFixed(1)}%`,
        "Frequency %": `${item.frequency.toFixed(1)}%`,
        "Is Premium": "N",
        Topics: topics.join(", "),
        ID: question.slug,
        Title: question.title,
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
        const existingRank =
          precedenceRank[existing.timeframe as string] ?? Number.MAX_SAFE_INTEGER;
        const newRank = precedenceRank[q.timeframe as string] ?? Number.MAX_SAFE_INTEGER;
        if (newRank < existingRank) {
          dedupedMap.set(key, q);
        }
      }
    }

    const dedupedQuestions = Array.from(dedupedMap.values());

    let filteredQuestions = dedupedQuestions;
    if (filters.topics && filters.topics.length > 0) {
      filteredQuestions = dedupedQuestions.filter((q) =>
        filters.topics!.some((topic) => q.topics.includes(topic))
      );
    }

    if (filters.isPremium !== undefined) {
      filteredQuestions = filteredQuestions.filter(
        (q) =>
          (filters.isPremium && q["Is Premium"] === "Y") ||
          (!filters.isPremium && q["Is Premium"] === "N")
      );
    }

    const uniqueCompanies = [...new Set(filteredQuestions.map((q) => q.company))];

    return {
      questions: filteredQuestions,
      companies: uniqueCompanies,
      totalCount: count || filteredQuestions.length,
    };
  } catch (error) {
    console.error("Error fetching questions from database:", error);
    return { questions: [], companies: [], totalCount: 0 };
  }
}

export async function getCompanies(): Promise<Company[]> {
  try {
    const { data, error } = await supabase.from("companies").select("id, name").order("name");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}

export async function getTopics(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from("topics").select("name").order("name");

    if (error) throw error;
    return data?.map((t) => t.name) || [];
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

export async function getUserProgress(userId: string): Promise<Record<string, boolean>> {
  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select("question_slug, completed")
      .eq("user_id", userId)
      .eq("completed", true);

    if (error) throw error;

    const progressMap: Record<string, boolean> = {};
    data?.forEach((item) => {
      progressMap[item.question_slug] = item.completed;
    });

    return progressMap;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return {};
  }
}

export async function updateUserProgress(
  userId: string,
  questionSlug: string,
  completed: boolean
): Promise<void> {
  try {
    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: userId,
        question_slug: questionSlug,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,question_slug",
      }
    );

    if (error) {
      console.error("Supabase error details:", error);
      if (error.message?.includes('relation "user_progress" does not exist')) {
        throw new Error(
          "Database table 'user_progress' does not exist. Please run the database setup SQL script."
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error updating user progress:", error);
    throw error;
  }
}

export async function syncUserProgress(
  userId: string,
  localProgress: Record<string, boolean>
): Promise<Record<string, boolean>> {
  try {
    const remoteProgress = await getUserProgress(userId);
    const mergedProgress = { ...remoteProgress, ...localProgress };

    const updates = Object.entries(localProgress).map(([questionSlug, completed]) => ({
      user_id: userId,
      question_slug: questionSlug,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }));

    if (updates.length > 0) {
      const { error } = await supabase.from("user_progress").upsert(updates, {
        onConflict: "user_id,question_slug",
      });

      if (error) throw error;
    }

    return mergedProgress;
  } catch (error) {
    console.error("Error syncing user progress:", error);
    throw error;
  }
}
