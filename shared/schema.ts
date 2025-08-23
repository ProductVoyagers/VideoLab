import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, integer, boolean } from "drizzle-orm/pg-core";
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

// Marketplace Assets Schema
export const marketplaceAssets = pgTable("marketplace_assets", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'photogrammetry', 'environments', 'mocap', 'media-packs'
  tags: json("tags").$type<string[]>(),
  price: integer("price").notNull(), // price in cents
  creditCost: integer("credit_cost"), // alternative credit pricing
  previewUrl: text("preview_url"),
  downloadUrl: text("download_url"),
  fileSize: integer("file_size"), // in bytes
  fileFormat: text("file_format"),
  license: text("license").notNull().default("standard"), // 'standard', 'commercial', 'extended'
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertMarketplaceAssetSchema = createInsertSchema(marketplaceAssets).omit({
  id: true,
  createdAt: true,
});

export type InsertMarketplaceAsset = z.infer<typeof insertMarketplaceAssetSchema>;
export type MarketplaceAsset = typeof marketplaceAssets.$inferSelect;

// User Credits Schema (for pay-as-you-go)
export const userCredits = pgTable("user_credits", {
  id: varchar("id").primaryKey(),
  email: text("email").notNull(),
  credits: integer("credits").notNull().default(0),
  totalPurchased: integer("total_purchased").notNull().default(0),
  lastPurchase: timestamp("last_purchase"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserCreditsSchema = createInsertSchema(userCredits).omit({
  id: true,
  createdAt: true,
});

export type InsertUserCredits = z.infer<typeof insertUserCreditsSchema>;
export type UserCredits = typeof userCredits.$inferSelect;

// Credit Packages for Pay-as-you-go
export const creditPackages = {
  starter: {
    name: "Starter Pack",
    credits: 100,
    price: 99, // $99 for 100 credits
    description: "Perfect for trying individual services",
    features: [
      "100 production credits",
      "Basic asset downloads",
      "Standard processing priority",
      "6 month expiry"
    ]
  },
  pro: {
    name: "Pro Pack", 
    credits: 500,
    price: 399, // $399 for 500 credits (20% discount)
    description: "Great for regular project needs",
    features: [
      "500 production credits",
      "Premium asset access",
      "Priority processing",
      "12 month expiry"
    ]
  },
  studio: {
    name: "Studio Pack",
    credits: 1500,
    price: 999, // $999 for 1500 credits (33% discount)
    description: "Maximum flexibility for agencies",
    features: [
      "1500 production credits", 
      "All premium assets included",
      "Fastest processing priority",
      "No expiry"
    ]
  }
} as const;

export type CreditPackage = keyof typeof creditPackages;

// Asset Categories
export const assetCategories = {
  photogrammetry: {
    name: "3D Scanned Objects",
    description: "High-quality photogrammetry assets",
    icon: "Cube"
  },
  environments: {
    name: "VP Environments", 
    description: "Virtual production ready environments",
    icon: "Mountain"
  },
  mocap: {
    name: "Motion Capture",
    description: "Pre-recorded motion capture data",
    icon: "Activity"
  },
  "media-packs": {
    name: "Media Packs",
    description: "Curated video and image collections", 
    icon: "Package"
  }
} as const;

export type AssetCategory = keyof typeof assetCategories;
