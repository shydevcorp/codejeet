interface QuestionTrackingData {
  questionId: string;
  solvedAt: string;
  companies: string[];
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastSolvedDate: string | null;
}

export function markQuestionAsSolved(questionId: string, companies: string[]) {
  const tracking = localStorage.getItem("leetcode-tracking") || "{}";
  const trackingData: Record<string, QuestionTrackingData> = JSON.parse(tracking);

  if (!trackingData[questionId]) {
    trackingData[questionId] = {
      questionId,
      solvedAt: new Date().toISOString(),
      companies,
    };

    localStorage.setItem("leetcode-tracking", JSON.stringify(trackingData));
    updateStreak();

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("questionSolved", {
          detail: { questionId, companies },
        })
      );
    }
  }
}

export function getQuestionTrackingData() {
  if (typeof window === "undefined") return {};

  const data = localStorage.getItem("leetcode-checked-items");
  if (!data) return {};

  try {
    const parsed = JSON.parse(data);
    const enhanced = Object.entries(parsed).reduce(
      (acc, [id, value]) => {
        if (typeof value === "boolean" && value === true) {
          acc[id] = { solvedAt: new Date().toISOString() };
        } else if (
          typeof value === "object" &&
          value !== null &&
          "solvedAt" in value &&
          typeof (value as any).solvedAt === "string"
        ) {
          acc[id] = value as { solvedAt: string };
        }
        return acc;
      },
      {} as Record<string, { solvedAt: string }>
    );

    return enhanced;
  } catch (err) {
    console.error("Error parsing question tracking data:", err);
    return {};
  }
}

export function calculateStreak(): StreakData {
  const tracking = getQuestionTrackingData();
  const dates = Object.values(tracking)
    .map((item) => new Date(item.solvedAt).toLocaleDateString())
    .sort();

  if (dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastSolvedDate: null };
  }

  let currentStreak = 1;
  let longestStreak = 1;
  let lastDate = new Date(dates[dates.length - 1]);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastDate < yesterday) {
    currentStreak = 0;
  }

  for (let i = dates.length - 2; i >= 0; i--) {
    const currentDate = new Date(dates[i]);
    const diffDays = Math.floor(
      (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      break;
    }

    lastDate = currentDate;
  }

  return {
    currentStreak,
    longestStreak,
    lastSolvedDate: dates[dates.length - 1],
  };
}

function updateStreak() {
  const streakData = calculateStreak();
  localStorage.setItem("leetcode-streak", JSON.stringify(streakData));
}
