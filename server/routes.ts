import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubmissionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all submissions
  app.get("/api/submissions", async (req, res) => {
    try {
      const { status, packageType } = req.query;
      
      let submissions;
      if (status) {
        submissions = await storage.getSubmissionsByStatus(status as string);
      } else if (packageType) {
        submissions = await storage.getSubmissionsByPackage(packageType as string);
      } else {
        submissions = await storage.getAllSubmissions();
      }
      
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  // Get single submission
  app.get("/api/submissions/:id", async (req, res) => {
    try {
      const submission = await storage.getSubmission(req.params.id);
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submission" });
    }
  });

  // Create new submission
  app.post("/api/submissions", async (req, res) => {
    try {
      const validatedData = insertSubmissionSchema.parse(req.body);
      const submission = await storage.createSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid submission data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create submission" });
    }
  });

  // Update submission status
  app.patch("/api/submissions/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const submission = await storage.updateSubmissionStatus(req.params.id, status);
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }
      
      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: "Failed to update submission status" });
    }
  });

  // Export submissions as CSV
  app.get("/api/submissions/export/csv", async (req, res) => {
    try {
      const submissions = await storage.getAllSubmissions();
      
      const csvHeader = "Submission ID,Project Name,Brand,Package,Status,Submission Date\n";
      const csvRows = submissions.map(sub => 
        `${sub.id},"${sub.projectName}","${sub.brandName || ''}","${sub.packageType}","${sub.status}","${sub.submissionDate.toISOString()}"`
      ).join("\n");
      
      const csvContent = csvHeader + csvRows;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="submissions_export.csv"');
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to export submissions" });
    }
  });

  // Marketplace Assets API routes
  
  // Get all marketplace assets
  app.get("/api/marketplace-assets", async (req, res) => {
    try {
      const { category, featured } = req.query;
      
      let assets;
      if (category) {
        assets = await storage.getAssetsByCategory(category as string);
      } else if (featured === 'true') {
        assets = await storage.getFeaturedAssets();
      } else {
        assets = await storage.getAllAssets();
      }
      
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch marketplace assets" });
    }
  });

  // Get single marketplace asset
  app.get("/api/marketplace-assets/:id", async (req, res) => {
    try {
      const asset = await storage.getAsset(req.params.id);
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      res.json(asset);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch asset" });
    }
  });

  // User Credits API routes
  
  // Get user credits
  app.get("/api/user-credits", async (req, res) => {
    try {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      let credits = await storage.getUserCredits(email as string);
      
      // Create default credits if user doesn't exist
      if (!credits) {
        credits = await storage.createUserCredits({
          email: email as string,
          credits: 0,
          totalPurchased: 0,
          lastPurchase: null
        });
      }
      
      res.json(credits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user credits" });
    }
  });

  // Add credits to user account
  app.post("/api/user-credits/purchase", async (req, res) => {
    try {
      const { email, amount } = req.body;
      
      if (!email || !amount || amount <= 0) {
        return res.status(400).json({ message: "Valid email and amount are required" });
      }
      
      const updatedCredits = await storage.addCredits(email, amount);
      
      res.json(updatedCredits);
    } catch (error) {
      res.status(500).json({ message: "Failed to add credits" });
    }
  });

  // Mock credit history endpoint
  app.get("/api/credit-history", async (req, res) => {
    try {
      // Mock data for credit history - in real app this would be stored
      const mockHistory = [
        { date: "2024-01-20", action: "Asset Download", amount: -25, description: "Modern Office Environment", balance: 150 },
        { date: "2024-01-18", action: "Credit Purchase", amount: 500, description: "Pro Pack", balance: 175 },
        { date: "2024-01-15", action: "Motion Capture", amount: -30, description: "Walking Motion Pack", balance: -325 },
        { date: "2024-01-12", action: "Asset Download", amount: -20, description: "Urban Alley Photogrammetry", balance: -295 },
      ];
      
      res.json(mockHistory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
