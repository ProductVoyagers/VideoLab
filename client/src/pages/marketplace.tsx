import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Download, Eye, Star, Box, Mountain, Activity, Package2, CreditCard, Coins } from "lucide-react";
import { assetCategories, type AssetCategory, type MarketplaceAsset } from "@shared/schema";

// Mock data for demonstration - in real app this would come from API
const mockAssets: MarketplaceAsset[] = [
  {
    id: "asset-1",
    title: "Modern Office Environment",
    description: "High-quality photogrammetry scan of a modern office space with realistic lighting and textures.",
    category: "environments",
    tags: ["office", "modern", "interior", "corporate"],
    price: 4999, // $49.99
    creditCost: 50,
    previewUrl: "/preview/office.jpg",
    downloadUrl: "/downloads/office.zip",
    fileSize: 2048000000, // 2GB
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
    price: 2999, // $29.99
    creditCost: 30,
    previewUrl: "/preview/alley.jpg",
    downloadUrl: "/downloads/alley.zip",
    fileSize: 1024000000, // 1GB
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
    price: 1999, // $19.99
    creditCost: 20,
    previewUrl: "/preview/walk.mp4",
    downloadUrl: "/downloads/walk.bvh",
    fileSize: 50000000, // 50MB
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
    price: 7999, // $79.99
    creditCost: 80,
    previewUrl: "/preview/sky.jpg",
    downloadUrl: "/downloads/sky-pack.zip",
    fileSize: 8192000000, // 8GB
    fileFormat: "EXR, MP4",
    license: "extended",
    featured: true,
    createdAt: new Date("2024-01-20"),
  }
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | "all">("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch marketplace assets from API
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['/api/marketplace-assets', selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      const response = await fetch(`/api/marketplace-assets?${params}`);
      return response.json();
    },
  });

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024000000) return `${(bytes / 1024000000).toFixed(1)}GB`;
    if (bytes >= 1024000) return `${(bytes / 1024000).toFixed(1)}MB`;
    return `${(bytes / 1024).toFixed(1)}KB`;
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cinema-dark flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-cinema-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cinema-dark">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cinema-dark to-cinema-gray py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Virtual Production <span className="text-cinema-gold">Marketplace</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Curated 3D assets, environments, and motion capture data ready for virtual production workflows.
            </p>
            
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search assets, environments, motion capture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  data-testid="input-search-assets"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as AssetCategory | "all")}>
                <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white" data-testid="select-category">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(assetCategories).map(([key, category]) => (
                    <SelectItem key={key} value={key}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white" data-testid="select-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="container mx-auto px-4 py-8">
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as AssetCategory | "all")} className="mb-8">
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger value="all" data-testid="tab-all">All Assets</TabsTrigger>
            {Object.entries(assetCategories).map(([key, category]) => (
              <TabsTrigger key={key} value={key} data-testid={`tab-${key}`}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => {
            const categoryInfo = assetCategories[asset.category as AssetCategory];
            const IconComponent = asset.category === 'photogrammetry' ? Box :
                                 asset.category === 'environments' ? Mountain :
                                 asset.category === 'mocap' ? Activity : Package2;
            
            return (
              <Card key={asset.id} className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-cinema-gold/50 transition-all duration-300 flex flex-col" data-testid={`card-asset-${asset.id}`}>
                <div className="aspect-video bg-cinema-gray relative overflow-hidden">
                  {asset.featured && (
                    <Badge className="absolute top-3 left-3 bg-cinema-gold text-cinema-dark" data-testid={`badge-featured-${asset.id}`}>
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <IconComponent className="w-16 h-16" />
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button size="sm" variant="outline" className="border-white/20 text-white" data-testid={`button-preview-${asset.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="border-white/20 text-white text-xs" data-testid={`badge-category-${asset.id}`}>
                      {categoryInfo?.name}
                    </Badge>
                    <Badge variant="outline" className="border-white/20 text-white text-xs" data-testid={`badge-license-${asset.id}`}>
                      {asset.license}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2" data-testid={`text-title-${asset.id}`}>{asset.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2" data-testid={`text-description-${asset.id}`}>{asset.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {asset.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-white/5 text-gray-300 text-xs" data-testid={`badge-tag-${tag}`}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span data-testid={`text-format-${asset.id}`}>{asset.fileFormat}</span>
                    <span data-testid={`text-size-${asset.id}`}>{formatFileSize(asset.fileSize || 0)}</span>
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-white" data-testid={`text-price-${asset.id}`}>
                          {formatPrice(asset.price)}
                        </span>
                        {asset.creditCost && (
                          <span className="text-sm text-cinema-gold flex items-center" data-testid={`text-credits-${asset.id}`}>
                            <Coins className="w-3 h-3 mr-1" />
                            {asset.creditCost} credits
                          </span>
                        )}
                      </div>
                      <Button 
                        size="default"
                        className="gold-gradient text-cinema-dark font-semibold shrink-0" 
                        data-testid={`button-download-${asset.id}`}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Package2 className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No assets found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}