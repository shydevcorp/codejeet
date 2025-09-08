import {
  pgTable,
  serial,
  text,
  integer,
  decimal,
  timestamp,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  difficulty: text("difficulty", { enum: ["Easy", "Medium", "Hard"] }).notNull(),
  acceptanceRate: decimal("acceptance_rate", { precision: 5, scale: 4 }).notNull(),
  link: text("link").notNull(),
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const companyQuestions = pgTable(
  "company_questions",
  {
    companyId: integer("company_id")
      .notNull()
      .references(() => companies.id),
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id),
    timeframe: text("timeframe", {
      enum: ["30_days", "3_months", "6_months", "more_than_6m", "all"],
    }).notNull(),
    frequency: decimal("frequency", { precision: 10, scale: 4 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.companyId, table.questionId, table.timeframe] }),
  })
);

export const questionTopics = pgTable(
  "question_topics",
  {
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id),
    topicId: integer("topic_id")
      .notNull()
      .references(() => topics.id),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.questionId, table.topicId] }),
  })
);

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  questionSlug: text("question_slug").notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const companiesRelations = relations(companies, ({ many }) => ({
  companyQuestions: many(companyQuestions),
}));

export const questionsRelations = relations(questions, ({ many }) => ({
  companyQuestions: many(companyQuestions),
  questionTopics: many(questionTopics),
}));

export const topicsRelations = relations(topics, ({ many }) => ({
  questionTopics: many(questionTopics),
}));

export const companyQuestionsRelations = relations(companyQuestions, ({ one }) => ({
  company: one(companies, {
    fields: [companyQuestions.companyId],
    references: [companies.id],
  }),
  question: one(questions, {
    fields: [companyQuestions.questionId],
    references: [questions.id],
  }),
}));

export const questionTopicsRelations = relations(questionTopics, ({ one }) => ({
  question: one(questions, {
    fields: [questionTopics.questionId],
    references: [questions.id],
  }),
  topic: one(topics, {
    fields: [questionTopics.topicId],
    references: [topics.id],
  }),
}));

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;

export type Topic = typeof topics.$inferSelect;
export type NewTopic = typeof topics.$inferInsert;

export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;

export type CompanyQuestion = typeof companyQuestions.$inferSelect;
export type NewCompanyQuestion = typeof companyQuestions.$inferInsert;

export type QuestionTopic = typeof questionTopics.$inferSelect;
export type NewQuestionTopic = typeof questionTopics.$inferInsert;

export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;
