import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { payAsYouGoKits, type PayAsYouGoKit } from "@shared/schema";
import {
  Check,
  CreditCard,
  ArrowRight,
  Package2,
  Clock,
  Zap,
  Star,
  Video,
  Camera,
  Palette,
} from "lucide-react";

export default function PayAsYouGoPage() {
  const [selectedKit, setSelectedKit] = useState<PayAsYouGoKit>("mocapBasic");
  const [activeCategory, setActiveCategory] = useState("mocap");
  const [, setLocation] = useLocation();

  const getKitIcon = (kitKey: PayAsYouGoKit) => {
    if (kitKey.includes("mocap"))
      return <Video className="w-6 h-6 text-cinema-gold" />;
    if (kitKey.includes("photoscan"))
      return <Camera className="w-6 h-6 text-cinema-gold" />;
    if (kitKey.includes("videoBoost"))
      return <Palette className="w-6 h-6 text-cinema-gold" />;
    return <Package2 className="w-6 h-6 text-cinema-gold" />;
  };

  const getKitsByCategory = (category: string) => {
    return Object.entries(payAsYouGoKits).filter(([key]) => {
      if (category === "mocap") return key.includes("mocap");
      if (category === "photoscan") return key.includes("photoscan");
      if (category === "video") return key.includes("videoBoost");
      return false;
    });
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "mocap":
        return "Motion Capture Kits";
      case "photoscan":
        return "Photogrammetry Kits";
      case "video":
        return "AI Video Kit";
      default:
        return "Production Kits";
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case "mocap":
        return "AI-powered motion capture with professional cleanup and processing";
      case "photoscan":
        return "High-quality 3D scanning for objects, environments, and locations";
      case "video":
        return "AI-generated video ads and custom storytelling experiences for brands and projects";
      default:
        return "Professional production services";
    }
  };

  return (
    <div className="min-h-screen bg-cinema-dark">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pay-As-You-Go{" "}
            <span className="text-cinema-gold">Production Kits</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Individual production kits for one-off projects. Fixed pricing, no
            subscription required. Perfect for testing our workflow or handling
            specific project needs.
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="max-w-6xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-sm border border-white/10 p-1">
            <TabsTrigger
              value="mocap"
              className="data-[state=active]:bg-cinema-gold data-[state=active]:text-cinema-dark data-[state=active]:shadow-lg transition-all duration-300 font-semibold text-white hover:bg-white/10"
              data-testid="tab-mocap"
            >
              <Video className="w-4 h-4 mr-2" />
              Motion Capture
            </TabsTrigger>
            <TabsTrigger
              value="photoscan"
              className="data-[state=active]:bg-cinema-gold data-[state=active]:text-cinema-dark data-[state=active]:shadow-lg transition-all duration-300 font-semibold text-white hover:bg-white/10"
              data-testid="tab-photoscan"
            >
              <Camera className="w-4 h-4 mr-2" />
              Photogrammetry
            </TabsTrigger>
            <TabsTrigger
              value="video"
              className="data-[state=active]:bg-cinema-gold data-[state=active]:text-cinema-dark data-[state=active]:shadow-lg transition-all duration-300 font-semibold text-white hover:bg-white/10"
              data-testid="tab-video"
            >
              <Palette className="w-4 h-4 mr-2" />
              AI Video
            </TabsTrigger>
          </TabsList>

          {["mocap", "photoscan", "video"].map((category) => (
            <TabsContent key={category} value={category} className="mt-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {getCategoryTitle(category)}
                </h2>
                <p className="text-gray-300">
                  {getCategoryDescription(category)}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getKitsByCategory(category).map(([key, kit]) => {
                  const isSelected = key === selectedKit;
                  const isPopular =
                    key === "mocapBasic" ||
                    key === "photoscanOutdoor" ||
                    key === "videoBoostPro";

                  return (
                    <Card
                      key={key}
                      className={`relative bg-white/5 backdrop-blur-sm border p-6 cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? "border-cinema-gold ring-2 ring-cinema-gold/50 scale-105"
                          : "border-white/10 hover:border-white/20 hover:scale-102"
                      }`}
                      onClick={() => setSelectedKit(key as PayAsYouGoKit)}
                      data-testid={`card-kit-${key}`}
                    >
                      {isPopular && (
                        <Badge className="absolute -top-2 -right-2 bg-cinema-gold text-cinema-dark px-2 py-1 text-xs">
                          Popular
                        </Badge>
                      )}

                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          {getKitIcon(key as PayAsYouGoKit)}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">
                          {kit.name}
                        </h3>
                        <p className="text-gray-300 text-sm mb-4">
                          {kit.description}
                        </p>

                        <div className="mb-4">
                          <div
                            className="text-3xl font-bold text-white mb-1"
                            data-testid={`text-price-${key}`}
                          >
                            {kit.price}
                          </div>
                          <div className="text-sm text-cinema-gold">
                            {kit.credits} credits equivalent
                          </div>
                        </div>

                        <ul className="text-left space-y-2 mb-6">
                          {kit.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-1" />
                              <span className="text-gray-300 text-xs">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <Button
                          className={`w-full ${
                            isSelected
                              ? "gold-gradient text-cinema-dark font-semibold"
                              : "bg-cinema-slate hover:bg-gray-600 text-white"
                          }`}
                          data-testid={`button-select-${key}`}
                          size="default"
                        >
                          {isSelected ? "Selected" : "Select Kit"}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Purchase Button */}
        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => setLocation("/pay-as-you-go/upload")}
              size="lg"
              className="gold-gradient text-cinema-dark font-semibold text-lg"
              disabled={!selectedKit}
              data-testid="button-purchase"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Purchase {selectedKit ? payAsYouGoKits[selectedKit]?.name : "Kit"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => setLocation("/pay-as-you-go/upload")}
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 text-lg"
              disabled={!selectedKit}
            >
              Submit Project Details
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-cinema-gray py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How Pay-As-You-Go Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 text-center">
              <div className="w-12 h-12 bg-cinema-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Package2 className="w-6 h-6 text-cinema-gold" />
              </div>
              <h3 className="font-semibold text-white mb-2">1. Choose Kit</h3>
              <p className="text-gray-300 text-sm">
                Select the production kit that matches your project needs and
                budget.
              </p>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 text-center">
              <div className="w-12 h-12 bg-cinema-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-cinema-gold" />
              </div>
              <h3 className="font-semibold text-white mb-2">2. Pay Upfront</h3>
              <p className="text-gray-300 text-sm">
                Pay the fixed kit price - no subscription, no hidden costs, no
                surprises.
              </p>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 text-center">
              <div className="w-12 h-12 bg-cinema-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-cinema-gold" />
              </div>
              <h3 className="font-semibold text-white mb-2">3. We Produce</h3>
              <p className="text-gray-300 text-sm">
                Our AI-powered team handles capture, cleanup, and processing to
                specifications.
              </p>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 text-center">
              <div className="w-12 h-12 bg-cinema-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-cinema-gold" />
              </div>
              <h3 className="font-semibold text-white mb-2">
                4. Fast Delivery
              </h3>
              <p className="text-gray-300 text-sm">
                Receive production-ready assets in 3-12 days depending on kit
                complexity.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Pay-As-You-Go vs Subscription
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Package2 className="w-6 h-6 text-cinema-gold mr-2" />
                Pay-As-You-Go
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">
                    Perfect for one-off projects
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">No monthly commitment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Fixed pricing per kit</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Standard delivery times</span>
                </li>
              </ul>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-cinema-gold p-8">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Star className="w-6 h-6 text-cinema-gold mr-2" />
                Subscription
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Lower cost per credit</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Priority scheduling</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">20% credit rollover</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Faster delivery times</span>
                </li>
              </ul>

              <Button
                onClick={() => setLocation("/subscription")}
                size="lg"
                className="w-full mt-6 bg-cinema-gold hover:bg-cinema-gold/90 text-cinema-dark font-semibold"
              >
                View Subscription Plans
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Start Creating?
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Choose the payment model that works best for your project needs. Both
          options deliver the same high-quality Virtual Media Production
          services.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => setLocation("/pay-as-you-go/upload")}
            size="lg"
            className="gold-gradient text-cinema-dark font-semibold"
            disabled={!selectedKit}
          >
            Submit Project & Purchase Kit
          </Button>
          <Button
            onClick={() => setLocation("/marketplace")}
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Browse Asset Marketplace
          </Button>
        </div>
      </section>
    </div>
  );
}
