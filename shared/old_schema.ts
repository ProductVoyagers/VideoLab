import { z } from "zod";

// This file contains constants from the old schema to allow legacy components to compile.

export const insertSubmissionSchema = z.object({});

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

export const payAsYouGoKits = {
  mocapBasic: {
    name: "MotionCapture+ Basic Kit",
    price: "SAR 3,000",
    description: " 1hr AI mocap with auto-cleanup (noise + foot fixes). Perfect for prototypes or quick tests.",
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
    price: "SAR 6,000",
    description: "2hr AI mocap with full cleanup + retargeting. Ideal for film, games, and production use.",
    features: [
      "2 hour AI motion capture session",
      "Advanced cleanup and processing",
      "Multiple output formats",
      "5-10 business day delivery"
    ],
    credits: 4
  },
  photoscanIndoor: {
    name: "PhotoScan360 Indoor",
    price: "SAR 1,500",
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
    price: "SAR 7,500",
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
    price: "SAR 9,000",
    description: "Indoor + outdoor integrated assets",
    features: [
      "Combined indoor/outdoor scanning",
      "Integrated asset delivery",
      "Premium processing",
      "10-12 day delivery"
    ],
    credits: 6
  },
  videoBoostPro: {
    name: "AI Video Ad",
    price: "SAR 4,500",
    description: "A 30–60s AI-generated ad customized for your brand, ready to share on social media or campaigns.",
    features: [
      "30–60 second AI-generated video ad",
      "Custom script, visuals, and branding",
      "Delivery in 4K resolution (8K upgrade optional)",
      "5 - 10 day delivery"
    ],
    credits: 3
  }
} as const;

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
