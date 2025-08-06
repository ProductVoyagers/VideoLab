import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey(),
  projectName: text("project_name").notNull(),
  brandName: text("brand_name"),
  projectGoals: text("project_goals").notNull(),
  packageType: text("package_type").notNull(), // 'lite', 'signature', 'immersive'
  timeline: text("timeline"),
  additionalNotes: text("additional_notes"),
  files: json("files").$type<Array<{ name: string; size: number; type: string }>>(),
  status: text("status").notNull().default("received"), // 'received', 'in-production', 'delivered'
  submissionDate: timestamp("submission_date").notNull().default(sql`now()`),
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  submissionDate: true,
});

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;

// Package types enum
export const packageTypes = {
  lite: {
    name: "Virtual Ad Lite",
    price: "$2,999",
    description: "Perfect for social media campaigns and promotional content",
    features: [
      "30-60 second video",
      "Basic virtual environment", 
      "1 revision included",
      "3-5 day delivery",
      "HD 1080p output"
    ]
  },
  signature: {
    name: "Signature Scene", 
    price: "$7,999",
    description: "Full production with custom virtual environments and advanced effects",
    features: [
      "2-5 minute video",
      "Custom virtual set design",
      "Motion capture integration", 
      "3 revisions included",
      "5-7 day delivery",
      "4K output available"
    ]
  },
  immersive: {
    name: "Immersive Experience",
    price: "$15,999", 
    description: "Premium immersive content with VR/AR capabilities",
    features: [
      "5-10 minute experience",
      "360° immersive environment",
      "VR/AR compatibility",
      "Unlimited revisions",
      "7-10 day delivery", 
      "8K output available"
    ]
  }
} as const;

export type PackageType = keyof typeof packageTypes;
