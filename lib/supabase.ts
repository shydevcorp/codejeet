import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Company {
  id: number;
  name: string;
}

export interface Question {
  id: number;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  acceptance_rate: number;
  link: string;
}

export interface Topic {
  id: number;
  name: string;
}

export interface UserProgress {
  id: number;
  user_id: string;
  question_slug: string;
  completed: boolean;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyQuestion {
  company_id: number;
  question_id: number;
  timeframe: "30_days" | "3_months" | "6_months" | "more_than_6m" | "all";
  frequency: number;
  companies?: Company;
  questions?: Question;
}

export interface QuestionTopic {
  question_id: number;
  topic_id: number;
  questions?: Question;
  topics?: Topic;
}

export interface QuestionWithDetails extends Question {
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
