import { type Submission, type InsertSubmission } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getSubmission(id: string): Promise<Submission | undefined>;
  getAllSubmissions(): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  updateSubmissionStatus(id: string, status: string): Promise<Submission | undefined>;
  getSubmissionsByStatus(status: string): Promise<Submission[]>;
  getSubmissionsByPackage(packageType: string): Promise<Submission[]>;
}

export class MemStorage implements IStorage {
  private submissions: Map<string, Submission>;

  constructor() {
    this.submissions = new Map();
  }

  async getSubmission(id: string): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async getAllSubmissions(): Promise<Submission[]> {
    return Array.from(this.submissions.values()).sort(
      (a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
    );
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = `VP-${new Date().getFullYear()}-${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}`;
    const submission: Submission = {
      ...insertSubmission,
      id,
      submissionDate: new Date(),
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async updateSubmissionStatus(id: string, status: string): Promise<Submission | undefined> {
    const submission = this.submissions.get(id);
    if (submission) {
      const updatedSubmission = { ...submission, status };
      this.submissions.set(id, updatedSubmission);
      return updatedSubmission;
    }
    return undefined;
  }

  async getSubmissionsByStatus(status: string): Promise<Submission[]> {
    return Array.from(this.submissions.values())
      .filter(submission => submission.status === status)
      .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
  }

  async getSubmissionsByPackage(packageType: string): Promise<Submission[]> {
    return Array.from(this.submissions.values())
      .filter(submission => submission.packageType === packageType)
      .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
  }
}

export const storage = new MemStorage();
