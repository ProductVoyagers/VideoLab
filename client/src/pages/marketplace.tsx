import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Download, Eye, Star, Box, Mountain, Activity, Package2, CreditCard, Coins } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { type Product } from "@shared/schema";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type ProductWithImages = Product & {
  product_images: { url: string }[];
};

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const { data: products = [], isLoading } = useQuery<ProductWithImages[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_images(url)");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  const filteredAssets = products.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const formatPrice = (cents: number) => `SAR ${(cents / 100).toFixed(2)}`;

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

      {/* Assets Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-cinema-gold/50 transition-all duration-300 flex flex-col" data-testid={`card-asset-${asset.id}`}>
              <Carousel className="w-full">
                <CarouselContent>
                  {asset.product_images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-video bg-cinema-gray relative overflow-hidden">
                        <img src={image.url} alt={asset.name} className="w-full h-full object-cover" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              
              <CardContent className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-white mb-2" data-testid={`text-title-${asset.id}`}>{asset.name}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2" data-testid={`text-description-${asset.id}`}>{asset.description}</p>
                
                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">
                      {formatPrice(asset.price)}
                    </span>
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
          ))}
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