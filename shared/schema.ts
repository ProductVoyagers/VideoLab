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
  starter: {
    name: "Starter Kit",
    price: "SAR 15,000",
    credits: 10,
    description: "Ideal for small agencies and freelancers testing virtual production",
    features: [
      "10 credits per month",
      "5 MoCap Basic sessions OR 2 outdoor photogrammetry scans",
      "Priority scheduling",
      "20% credit rollover",
      "3-5 day delivery"
    ]
  },
  pro: {
    name: "Pro Kit", 
    price: "SAR 35,000",
    credits: 25,
    description: "Perfect for mid-size agencies and production companies",
    features: [
      "25 credits per month",
      "8 MoCap Basic + 2 outdoor photogrammetry scans",
      "Priority scheduling",
      "20% credit rollover",
      "Advanced cleanup included",
      "3-5 day delivery"
    ]
  },
  premium: {
    name: "Premium Kit",
    price: "SAR 65,000",
    credits: 50,
    description: "Ideal for large brands, government projects, and high-volume productions",
    features: [
      "50 credits per month",
      "10 MoCap Basic + 4 outdoor photogrammetry scans",
      "Priority scheduling",
      "20% credit rollover",
      "All advanced features",
      "Fastest delivery (3-5 days)"
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

// Pay-As-You-Go Individual Kits
export const payAsYouGoKits = {
  mocapBasic: {
    name: "MotionCapture+ Basic Kit",
    price: "SAR 3,000", // 2 credits × SAR 1,500
    description: "1hr AI mocap with basic cleanup",
    features: [
      "1 hour AI motion capture session",
      "Basic cleanup and processing",
      "FBX + OBJ output formats",
      "3-5 business day delivery"
    ],
    credits: 2
  },
  mocapPro: {
    name: "MotionCapture+ Pro Kit", 
    price: "SAR 6,000", // 4 credits × SAR 1,500
    description: "2hr AI mocap with advanced cleanup",
    features: [
      "2 hour AI motion capture session",
      "Advanced cleanup and processing",
      "Multiple output formats",
      "3-5 business day delivery"
    ],
    credits: 4
  },
  photoscanIndoor: {
    name: "PhotoScan360 Indoor",
    price: "SAR 1,500", // 1 credit × SAR 1,500
    description: "Single prop/object photogrammetry scan",
    features: [
      "1 prop/object scan",
      "PBR 4K textures included",
      "Multiple output formats",
      "7 day delivery"
    ],
    credits: 1
  },
  photoscanOutdoor: {
    name: "PhotoScan360 Outdoor",
    price: "SAR 7,500", // 5 credits × SAR 1,500
    description: "Full-day location photogrammetry",
    features: [
      "Full-day location scan",
      "HDRI capture included",
      "High-resolution textures",
      "10-12 day delivery"
    ],
    credits: 5
  },
  photoscanHybrid: {
    name: "PhotoScan360 Hybrid",
    price: "SAR 9,000", // 6 credits × SAR 1,500
    description: "Indoor + outdoor integrated assets",
    features: [
      "Combined indoor/outdoor scanning",
      "Integrated asset delivery",
      "Premium processing",
      "10-12 day delivery"
    ],
    credits: 6
  },
  videoBoostStandard: {
    name: "VideoBoostAI Standard",
    price: "SAR 1,500", // 1 credit × SAR 1,500
    description: "AI 4K upscale and stabilization",
    features: [
      "AI 4K upscaling",
      "Video stabilization",
      "Up to 2 minutes footage",
      "3-5 day delivery"
    ],
    credits: 1
  },
  videoBoostPro: {
    name: "VideoBoostAI Pro",
    price: "SAR 4,500", // 3 credits × SAR 1,500
    description: "8K upscale with color grading",
    features: [
      "AI 8K upscaling",
      "Color grading included",
      "Style transfer options",
      "3-5 day delivery"
    ],
    credits: 3
  }
} as const;

export type PayAsYouGoKit = keyof typeof payAsYouGoKits;

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
