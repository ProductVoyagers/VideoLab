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

  const httpServer = createServer(app);
  return httpServer;
}
