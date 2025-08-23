import { type Submission, type InsertSubmission, type MarketplaceAsset, type InsertMarketplaceAsset, type UserCredits, type InsertUserCredits } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Submissions
  getSubmission(id: string): Promise<Submission | undefined>;
  getAllSubmissions(): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  updateSubmissionStatus(id: string, status: string): Promise<Submission | undefined>;
  getSubmissionsByStatus(status: string): Promise<Submission[]>;
  getSubmissionsByPackage(packageType: string): Promise<Submission[]>;
  
  // Marketplace Assets
  getAllAssets(): Promise<MarketplaceAsset[]>;
  getAssetsByCategory(category: string): Promise<MarketplaceAsset[]>;
  getFeaturedAssets(): Promise<MarketplaceAsset[]>;
  getAsset(id: string): Promise<MarketplaceAsset | undefined>;
  createAsset(asset: InsertMarketplaceAsset): Promise<MarketplaceAsset>;
  
  // User Credits
  getUserCredits(email: string): Promise<UserCredits | undefined>;
  createUserCredits(credits: InsertUserCredits): Promise<UserCredits>;
  updateUserCredits(email: string, credits: number): Promise<UserCredits | undefined>;
  addCredits(email: string, amount: number): Promise<UserCredits | undefined>;
}

export class MemStorage implements IStorage {
  private submissions: Map<string, Submission>;
  private assets: Map<string, MarketplaceAsset>;
  private userCredits: Map<string, UserCredits>;

  constructor() {
    this.submissions = new Map();
    this.assets = new Map();
    this.userCredits = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize with some sample marketplace assets
    const sampleAssets: MarketplaceAsset[] = [
      {
        id: "asset-1",
        title: "Modern Office Environment",
        description: "High-quality photogrammetry scan of a modern office space with realistic lighting and textures.",
        category: "environments",
        tags: ["office", "modern", "interior", "corporate"],
        price: 4999,
        creditCost: 50,
        previewUrl: "/preview/office.jpg",
        downloadUrl: "/downloads/office.zip",
        fileSize: 2048000000,
        fileFormat: "FBX, OBJ",
        license: "commercial",
        featured: true,
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "asset-2",
        title: "Urban Alley Photogrammetry",
        description: "Detailed 3D scan of a narrow urban alley with brick walls, fire escapes, and atmospheric details.",
        category: "photogrammetry",
        tags: ["urban", "alley", "brick", "atmospheric"],
        price: 2999,
        creditCost: 30,
        previewUrl: "/preview/alley.jpg",
        downloadUrl: "/downloads/alley.zip",
        fileSize: 1024000000,
        fileFormat: "PLY, OBJ",
        license: "standard",
        featured: false,
        createdAt: new Date("2024-01-10"),
      },
      {
        id: "asset-3",
        title: "Walking Motion Pack",
        description: "Professional mocap data for various walking styles - casual, confident, tired, hurried.",
        category: "mocap",
        tags: ["walking", "motion", "character", "animation"],
        price: 1999,
        creditCost: 20,
        previewUrl: "/preview/walk.mp4",
        downloadUrl: "/downloads/walk.bvh",
        fileSize: 50000000,
        fileFormat: "BVH, FBX",
        license: "commercial",
        featured: true,
        createdAt: new Date("2024-01-12"),
      },
      {
        id: "asset-4",
        title: "Cinematic Sky Collection",
        description: "16K HDRI skies and time-lapse footage perfect for virtual production backgrounds.",
        category: "media-packs",
        tags: ["sky", "hdri", "background", "cinematic"],
        price: 7999,
        creditCost: 80,
        previewUrl: "/preview/sky.jpg",
        downloadUrl: "/downloads/sky-pack.zip",
        fileSize: 8192000000,
        fileFormat: "EXR, MP4",
        license: "extended",
        featured: true,
        createdAt: new Date("2024-01-20"),
      }
    ];
    
    sampleAssets.forEach(asset => this.assets.set(asset.id, asset));
  }

  // Submission methods (existing)
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

  // Marketplace asset methods
  async getAllAssets(): Promise<MarketplaceAsset[]> {
    return Array.from(this.assets.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getAssetsByCategory(category: string): Promise<MarketplaceAsset[]> {
    return Array.from(this.assets.values())
      .filter(asset => asset.category === category)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getFeaturedAssets(): Promise<MarketplaceAsset[]> {
    return Array.from(this.assets.values())
      .filter(asset => asset.featured)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAsset(id: string): Promise<MarketplaceAsset | undefined> {
    return this.assets.get(id);
  }

  async createAsset(insertAsset: InsertMarketplaceAsset): Promise<MarketplaceAsset> {
    const id = randomUUID();
    const asset: MarketplaceAsset = {
      ...insertAsset,
      id,
      createdAt: new Date(),
    };
    this.assets.set(id, asset);
    return asset;
  }

  // User credits methods
  async getUserCredits(email: string): Promise<UserCredits | undefined> {
    return this.userCredits.get(email);
  }

  async createUserCredits(insertCredits: InsertUserCredits): Promise<UserCredits> {
    const id = randomUUID();
    const credits: UserCredits = {
      ...insertCredits,
      id,
      createdAt: new Date(),
    };
    this.userCredits.set(insertCredits.email, credits);
    return credits;
  }

  async updateUserCredits(email: string, newCredits: number): Promise<UserCredits | undefined> {
    const userCredit = this.userCredits.get(email);
    if (userCredit) {
      const updated = { ...userCredit, credits: newCredits };
      this.userCredits.set(email, updated);
      return updated;
    }
    return undefined;
  }

  async addCredits(email: string, amount: number): Promise<UserCredits | undefined> {
    const userCredit = this.userCredits.get(email);
    if (userCredit) {
      const updated = { 
        ...userCredit, 
        credits: userCredit.credits + amount,
        totalPurchased: userCredit.totalPurchased + amount,
        lastPurchase: new Date()
      };
      this.userCredits.set(email, updated);
      return updated;
    } else {
      // Create new user credits record
      return this.createUserCredits({
        email,
        credits: amount,
        totalPurchased: amount,
        lastPurchase: new Date()
      });
    }
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
