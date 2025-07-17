export interface ProgressData {
  [questionSlug: string]: boolean;
}

export async function fetchUserProgress(): Promise<ProgressData> {
  try {
    const response = await fetch("/api/progress", { cache: 'force-cache' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.progress || {};
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return {};
  }
}

export async function updateQuestionProgress(
  questionSlug: string,
  completed: boolean
): Promise<boolean> {
  try {
    const response = await fetch("/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionSlug,
        completed,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error updating question progress:", error);
    return false;
  }
}

export async function syncProgressWithDatabase(localProgress: ProgressData): Promise<ProgressData> {
  try {
    const response = await fetch("/api/progress", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ localProgress }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.progress || localProgress;
  } catch (error) {
    console.error("Error syncing progress:", error);
    return localProgress;
  }
}

export function getLocalProgress(): ProgressData {
  if (typeof window === "undefined") return {};

  try {
    const saved = localStorage.getItem("leetcode-checked-items");
    if (!saved) return {};

    const parsed = JSON.parse(saved);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed;
    } else {
      localStorage.removeItem("leetcode-checked-items");
      return {};
    }
  } catch (error) {
    console.error("Error parsing local progress:", error);
    localStorage.removeItem("leetcode-checked-items");
    return {};
  }
}

export function saveLocalProgress(progress: ProgressData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("leetcode-checked-items", JSON.stringify(progress));
  } catch (error) {
    console.error("Error saving local progress:", error);
  }
}
