import type { Express } from "express";
import { createServer, type Server } from "http";
// We will replace this with Supabase calls later
// import { storage } from "./storage";
// import { insertSubmissionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // All the old routes related to submissions, marketplace assets, and user credits
  // have been removed as they are no longer compatible with the new schema.
  // We will build new Supabase-based routes as we add features.

  const httpServer = createServer(app);
  return httpServer;
}
