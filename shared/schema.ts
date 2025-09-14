import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRole = pgEnum('user_role', ['buyer', 'seller', 'superadmin']);

export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // Comes from Supabase Auth
  email: text("email").notNull().unique(),
  role: userRole("role").notNull().default("buyer"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // in cents
  zipFileUrl: text("zip_file_url"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const productImages = pgTable("product_images", {
  id: varchar("id").primaryKey(),
  productId: varchar("product_id").notNull().references(() => products.id),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users);
export const insertProductSchema = createInsertSchema(products);
export const insertProductImageSchema = createInsertSchema(productImages);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type ProductImage = typeof productImages.$inferSelect;
export type InsertProductImage = z.infer<typeof insertProductImageSchema>;
