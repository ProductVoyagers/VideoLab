import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Coins, Zap, Clock, Star, Check, ArrowRight, Package2, TrendingUp } from "lucide-react";
import { payAsYouGoKits, type PayAsYouGoKit } from "@shared/old_schema";

// Mock user credit data
const mockUserCredits = {
  id: "user-1",
  email: "user@example.com", 
  credits: 150,
  totalPurchased: 600,
  lastPurchase: new Date("2024-01-15"),
  createdAt: new Date("2023-12-01"),
};

// Mock credit usage history
const mockCreditHistory = [
  { date: "2024-01-20", action: "Asset Download", amount: -25, description: "Modern Office Environment", balance: 150 },
  { date: "2024-01-18", action: "Credit Purchase", amount: 500, description: "Pro Pack", balance: 175 },
  { date: "2024-01-15", action: "Motion Capture", amount: -30, description: "Walking Motion Pack", balance: -325 },
  { date: "2024-01-12", action: "Asset Download", amount: -20, description: "Urban Alley Photogrammetry", balance: -295 },
];

export default function CreditsPage() {
  const [selectedKit, setSelectedKit] = useState<PayAsYouGoKit>("mocapBasic");

  // Fetch user credits from API (using demo email for now)
  const { data: userCredits = mockUserCredits, isLoading: creditsLoading } = useQuery({
    queryKey: ['/api/user-credits'],
    queryFn: async () => {
      const response = await fetch('/api/user-credits?email=demo@example.com');
      return response.json();
    },
  });

  const { data: creditHistory = mockCreditHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['/api/credit-history'],
    queryFn: async () => {
      const response = await fetch('/api/credit-history');
      return response.json();
    },
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  const creditUsagePercent = Math.min((userCredits.credits / userCredits.totalPurchased) * 100, 100);

  if (creditsLoading) {
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
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Pay-as-you-go <span className="text-cinema-gold">Credits</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Flexible credit system for individual projects and one-off purchases. Scale up or down as needed.
            </p>

            {/* Credit Balance Card */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-cinema-gold mb-2" data-testid="text-credits-balance">
                      {userCredits.credits}
                    </div>
                    <div className="text-sm text-gray-400">Available Credits</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-2" data-testid="text-credits-purchased">
                      {userCredits.totalPurchased}
                    </div>
                    <div className="text-sm text-gray-400">Total Purchased</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-white mb-2" data-testid="text-last-purchase">
                      {formatDate(userCredits.lastPurchase || new Date())}
                    </div>
                    <div className="text-sm text-gray-400">Last Purchase</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Credit Usage</span>
                    <span>{Math.round(creditUsagePercent)}% remaining</span>
                  </div>
                  <Progress value={creditUsagePercent} className="h-2" />
                </div>
                
                <div className="mt-6 flex gap-3">
                  <Button className="gold-gradient text-cinema-dark font-semibold" data-testid="button-buy-credits">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Buy More Credits
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" data-testid="button-view-history">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pay-As-You-Go Kits */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Pay-As-You-Go Kits</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Individual production kits for one-off projects. Pay per kit with fixed pricing. 
            No subscription required - perfect for testing our workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {Object.entries(payAsYouGoKits).map(([key, kit]) => {
            const isSelected = key === selectedKit;
            
            return (
              <Card 
                key={key} 
                className={`bg-white/5 backdrop-blur-sm border-white/10 p-6 flex flex-col cursor-pointer transition-all duration-300 ${
                  isSelected ? 'border-cinema-gold ring-2 ring-cinema-gold/50' : 'hover:border-white/20'
                }`}
                onClick={() => setSelectedKit(key as PayAsYouGoKit)}
                data-testid={`card-kit-${key}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Package2 className="w-5 h-5 text-cinema-gold" />
                  <h3 className="font-semibold text-lg text-white">{kit.name}</h3>
                  {key === "mocapBasic" && (
                    <Badge className="bg-cinema-gold text-cinema-dark ml-auto" data-testid="badge-popular">
                      Popular
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-300 mb-4">{kit.description}</p>
                
                <div className="mb-4">
                  <div className="text-2xl font-bold text-white mb-1" data-testid={`text-price-${key}`}>
                    {kit.price}
                  </div>
                  <div className="text-sm text-cinema-gold">
                    {kit.credits} credits equivalent
                  </div>
                </div>
                
                <ul className="space-y-2 text-sm flex-1 mb-6">
                  {kit.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-1" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={isSelected ? "gold-gradient text-cinema-dark font-semibold" : "bg-cinema-slate hover:bg-gray-600 text-white"}
                  data-testid={`button-select-${key}`}
                  size="sm"
                >
                  {isSelected ? "Selected" : "Select Kit"}
                </Button>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Button 
            size="lg"
            className="gold-gradient text-cinema-dark font-semibold px-8"
            disabled={!selectedKit}
            data-testid="button-purchase-kit"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Purchase {selectedKit ? payAsYouGoKits[selectedKit]?.name : "Kit"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* How Pay-As-You-Go Works */}
      <section className="bg-cinema-gray py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How Pay-As-You-Go Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 text-center">
              <div className="w-12 h-12 bg-cinema-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Package2 className="w-6 h-6 text-cinema-gold" />
              </div>
              <h3 className="font-semibold text-white mb-2">1. Choose Kit</h3>
              <p className="text-gray-300 text-sm">Select the production kit that matches your project needs.</p>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 text-center">
              <div className="w-12 h-12 bg-cinema-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-cinema-gold" />
              </div>
              <h3 className="font-semibold text-white mb-2">2. Pay Fixed Price</h3>
              <p className="text-gray-300 text-sm">Pay the kit price upfront - no subscription, no hidden costs.</p>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 text-center">
              <div className="w-12 h-12 bg-cinema-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-cinema-gold" />
              </div>
              <h3 className="font-semibold text-white mb-2">3. We Produce</h3>
              <p className="text-gray-300 text-sm">Our AI-powered team handles capture, cleanup, and processing.</p>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 text-center">
              <div className="w-12 h-12 bg-cinema-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-cinema-gold" />
              </div>
              <h3 className="font-semibold text-white mb-2">4. Fast Delivery</h3>
              <p className="text-gray-300 text-sm">Receive production-ready assets in 3-12 days depending on kit.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Credit History */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">Recent Activity</h2>
        
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-0">
            <div className="divide-y divide-white/10">
              {creditHistory.map((transaction, index) => (
                <div key={index} className="p-6 flex items-center justify-between" data-testid={`transaction-${index}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      transaction.amount > 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'
                    }`}>
                      {transaction.amount > 0 ? (
                        <CreditCard className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Coins className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    
                    <div>
                      <div className="font-semibold text-white" data-testid={`text-action-${index}`}>
                        {transaction.action}
                      </div>
                      <div className="text-sm text-gray-400" data-testid={`text-description-${index}`}>
                        {transaction.description}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-semibold ${
                      transaction.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                    }`} data-testid={`text-amount-${index}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} credits
                    </div>
                    <div className="text-sm text-gray-400" data-testid={`text-date-${index}`}>
                      {formatDate(new Date(transaction.date))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}