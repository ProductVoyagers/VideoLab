import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { packageTypes, type PackageType } from "@shared/schema";
import { Check, CreditCard, ArrowRight, Star, Zap, Clock, Users, Crown, Rocket, Sparkles, Building2 } from "lucide-react";

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<PackageType>("pro");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "quarterly">("monthly");
  const [, setLocation] = useLocation();

  const getDiscountedPrice = (price: string, cycle: "monthly" | "quarterly") => {
    if (cycle === "quarterly") {
      const numericPrice = parseInt(price.replace(/[^\d]/g, ''));
      const quarterlyPrice = Math.round(numericPrice * 3 * 0.85); // 15% discount
      return `SAR ${quarterlyPrice.toLocaleString()}`;
    }
    return price;
  };

  const getPlanIcon = (planKey: PackageType) => {
    switch (planKey) {
      case 'starter':
        return <Rocket className="w-6 h-6 text-cinema-gold" />;
      case 'pro':
        return <Sparkles className="w-6 h-6 text-cinema-gold" />;
      case 'premium':
        return <Building2 className="w-6 h-6 text-cinema-gold" />;
      default:
        return <Star className="w-6 h-6 text-cinema-gold" />;
    }
  };

  return (
    <div className="min-h-screen bg-cinema-dark">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your <span className="text-cinema-gold">Subscription Plan</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Predictable monthly access to Virtual Media Production services. 
            Subscribe to get priority scheduling, credit rollover, and lower per-unit costs.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1 flex">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-cinema-gold text-cinema-dark"
                  : "text-gray-300 hover:text-white"
              }`}
              data-testid="button-monthly"
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("quarterly")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingCycle === "quarterly"
                  ? "bg-cinema-gold text-cinema-dark"
                  : "text-gray-300 hover:text-white"
              }`}
              data-testid="button-quarterly"
            >
              Quarterly
              <Badge className="ml-2 bg-emerald-500/20 text-emerald-400 text-xs">Save 15%</Badge>
            </button>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(packageTypes).map(([key, plan]) => {
            const isSelected = key === selectedPlan;
            const isPopular = key === "pro";
            
            return (
              <Card 
                key={key}
                className={`relative bg-white/5 backdrop-blur-sm border p-8 cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'border-cinema-gold ring-2 ring-cinema-gold/50 scale-105' 
                    : isPopular
                      ? 'border-cinema-gold'
                      : 'border-white/10 hover:border-white/20 hover:scale-102'
                }`}
                onClick={() => setSelectedPlan(key as PackageType)}
                data-testid={`card-plan-${key}`}
              >
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cinema-gold text-cinema-dark px-4 py-1">
                    Most Popular
                  </Badge>
                )}

                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {getPlanIcon(key as PackageType)}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-300 text-sm mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-white mb-1" data-testid={`text-price-${key}`}>
                      {getDiscountedPrice(plan.price, billingCycle)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {plan.credits} credits • {billingCycle}
                      {billingCycle === "quarterly" && (
                        <div className="text-xs text-emerald-400 mt-1">
                          Save SAR {Math.round(parseInt(plan.price.replace(/[^\d]/g, '')) * 3 * 0.15).toLocaleString()} vs monthly
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <ul className="text-left space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
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
                  >
                    {isSelected ? "Selected" : "Select Plan"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Subscribe Button */}
        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setLocation("/subscription/upload")}
              size="lg"
              className="gold-gradient text-cinema-dark font-semibold px-12 py-4 text-lg"
              disabled={!selectedPlan}
              data-testid="button-subscribe"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Subscribe to {selectedPlan ? packageTypes[selectedPlan]?.name : "Plan"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              onClick={() => setLocation("/subscription/upload")}
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 px-12 py-4 text-lg"
              disabled={!selectedPlan}
            >
              Submit Project
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-cinema-gray py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Subscribe?</h2>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 text-center">
              <div className="w-12 h-12 bg-cinema-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-cinema-gold" />
              </div>
              <h3 className="font-semibold text-white mb-2">Priority Scheduling</h3>
              <p className="text-gray-300 text-sm">Get your projects processed first, ahead of pay-as-you-go customers.</p>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 text-center">
              <div className="w-12 h-12 bg-cinema-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-cinema-gold" />
              </div>
              <h3 className="font-semibold text-white mb-2">Credit Rollover</h3>
              <p className="text-gray-300 text-sm">Unused credits? Up to 20% roll over to your next billing cycle.</p>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 text-center">
              <div className="w-12 h-12 bg-cinema-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-cinema-gold" />
              </div>
              <h3 className="font-semibold text-white mb-2">Predictable Costs</h3>
              <p className="text-gray-300 text-sm">Fixed monthly pricing makes budgeting easy for your production needs.</p>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 text-center">
              <div className="w-12 h-12 bg-cinema-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-cinema-gold" />
              </div>
              <h3 className="font-semibold text-white mb-2">Premium Support</h3>
              <p className="text-gray-300 text-sm">Dedicated account management and faster response times.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Join hundreds of creators, agencies, and brands using Virtual Media Production 
          to streamline their content creation workflow.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => setLocation("/subscription/upload")}
            className="gold-gradient text-cinema-dark font-semibold px-8"
          >
            Start Your Subscription
          </Button>
          <Button 
            onClick={() => setLocation("/pay-as-you-go")}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Try Pay-As-You-Go First
          </Button>
        </div>
      </section>
    </div>
  );
}