import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define Resource schema
// Define LinkedPathPreview schema (new)
export const linkedPathPreviewSchema = z.object({
  id: z.string(),
  title: z.string(),
  coverImage: z.string().optional(), // Assuming URL for coverImage if present
  category: z.string().optional(),
  difficulty: z.string().optional(),
});

// Define Resource schema
export const resourceSchema = z.object({
  id: z.string(),
  type: z.enum(['video', 'website', 'pdf', 'image', 'learningPath', 'other']),
  title: z.string(),
  url: z.string(), // Changed from z.string().url()
  description: z.string(),
  linkedPathPreview: linkedPathPreviewSchema.optional(), // Added field
});

// Define LearningPath schema
export const learningPathSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  difficulty: z.string(),
  tags: z.array(z.string()),
  coverImage: z.string().url(),
  resources: z.array(resourceSchema),
  createdAt: z.string(),
  rating: z.number(),
  learners: z.number()
});

// Note: We're not using a database for this application
// These schemas are just provided for reference and type safety

export type Resource = z.infer<typeof resourceSchema>;
export type LearningPath = z.infer<typeof learningPathSchema>;

// If we were using a database, the tables would look like this:
export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  tags: text("tags").array().notNull(),
  coverImage: text("cover_image").notNull(),
  resources: jsonb("resources").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  rating: integer("rating").notNull(),
  learners: integer("learners").notNull()
});

export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({
  id: true
});

export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;
