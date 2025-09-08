import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Bot, Globe, Play, CreditCard, Store, Check, Rocket, Sparkles, Building2, Cpu, ShoppingBag, Film, Library, Trophy, Mail, MessageCircle } from "lucide-react";
import vmpLogo from "@assets/new_vmp_logo.png";

function LandingPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen relative">
      {/* Hero Video Background */}
      <video 
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadStart={() => console.log('Video loading started')}
        onCanPlay={() => console.log('Video can play')}
        onError={(e) => console.log('Video error:', e)}
        onLoadedData={() => console.log('Video loaded successfully')}
      >
        <source src="/attached_assets/VMP.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-cinema-dark/90 via-cinema-dark/70 to-transparent" />
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 min-h-screen flex items-center">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-xs mb-4">
            <Bot className="w-3.5 h-3.5 text-cinema-gold" />
            AI-driven production • We do the work
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">Virtual Media Production</span><br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>
          {/* Tagline */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 italic tracking-wide">
            Capture Reality. <span className="text-cinema-gold">Create Worlds.</span>
          </p>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl leading-relaxed">
            We produce your ads and media using AI-enhanced motion capture, photogrammetry, and video generation. You subscribe. You send inputs. <span className="font-semibold text-cinema-gold">We deliver.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-start mb-6">
            <Button 
              onClick={() => setLocation("/subscription")}
              size="lg"
              className="gold-gradient hover:scale-105 transform transition-all duration-300 text-lg font-semibold text-cinema-dark shadow-2xl"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              View Subscriptions
            </Button>
            <Button 
              onClick={() => setLocation("/marketplace")}
              variant="outline"
              size="lg"
              className="border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-lg font-semibold"
            >
              <Store className="mr-2 h-5 w-5" />
              Explore Marketplace
            </Button>
          </div>
          
          <ul className="grid gap-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              AI as production engine (not DIY)
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              Predictable subscriptions + flexible credits
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              Curated assets: photogrammetry, VP environments, media packs
            </li>
          </ul>
        </div>
      </div>

      {/* Offering Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 bg-cinema-gray">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Subscriptions */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cinema-gold/90 grid place-items-center text-cinema-dark mb-4">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Subscriptions</h3>
              <p className="text-gray-300 mb-4">
                Predictable monthly access to production capacity and deliverables. We scope, schedule, and deliver on cadence.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">AI-enhanced ad creation</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Motion capture cleanup</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Photogrammetry processing</span>
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <Button
                onClick={() => setLocation("/subscription")}
                size="sm"
                className="w-full gold-gradient text-cinema-dark font-semibold"
              >
                View Plans
              </Button>
            </div>
          </Card>

          {/* Pay-as-you-go Kits */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cinema-gold/90 grid place-items-center text-cinema-dark mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Pay-as-you-go Kits</h3>
              <p className="text-gray-300 mb-4">
                Individual production kits for one-off projects. Fixed pricing, no subscription required.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Outdoor scans</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Pro video variants</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Priority delivery</span>
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <Button
                onClick={() => setLocation("/pay-as-you-go")}
                variant="outline"
                size="sm"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Browse Kits
              </Button>
            </div>
          </Card>

          {/* Marketplace */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cinema-gold/90 grid place-items-center text-cinema-dark mb-4">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Marketplace</h3>
              <p className="text-gray-300 mb-4">
                Curated photogrammetry assets, VP-ready environments, and AI media packs. Start with first-party, open to creators later.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Smart tagging & search</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">License clarity</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Instant previews</span>
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <Button
                onClick={() => setLocation("/marketplace")}
                variant="outline"
                size="sm"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Browse Assets
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 bg-cinema-gray">
        <h3 className="text-2xl font-bold text-white mb-6">How it works</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
            <div className="text-sm text-gray-400 mb-2">Step 1</div>
            <h4 className="font-semibold text-white mb-2">Subscribe</h4>
            <p className="text-sm text-gray-300">Choose a plan that fits your monthly output.</p>
          </Card>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
            <div className="text-sm text-gray-400 mb-2">Step 2</div>
            <h4 className="font-semibold text-white mb-2">Send Inputs</h4>
            <p className="text-sm text-gray-300">Footage, products, references, brand guides.</p>
          </Card>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
            <div className="text-sm text-gray-400 mb-2">Step 3</div>
            <h4 className="font-semibold text-white mb-2">AI + Team Produce</h4>
            <p className="text-sm text-gray-300">Mocap cleanup, photogrammetry, AI video & VFX.</p>
          </Card>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
            <div className="text-sm text-gray-400 mb-2">Step 4</div>
            <h4 className="font-semibold text-white mb-2">Deliver</h4>
            <p className="text-sm text-gray-300">Cinematic ads and assets on time, every month.</p>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 bg-cinema-gray">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">Pricing</h3>
          <p className="text-gray-300">Choose the plan that fits your production needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Starter Kit */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="w-5 h-5 text-cinema-gold" />
              <h4 className="font-semibold text-lg text-white">Starter Kit</h4>
            </div>
            <p className="text-sm text-gray-300 mb-4">Ideal for small agencies and freelancers testing virtual production.</p>
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">SAR 15,000</span>
              <span className="text-gray-400"> / mo</span>
              <div className="text-sm text-cinema-gold">10 credits</div>
            </div>
            <ul className="space-y-3 text-sm flex-1 mb-6">
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">5 MoCap Basic sessions OR 2 outdoor scans</span>
              </li>
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Priority scheduling</span>
              </li>
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">20% credit rollover</span>
              </li>
            </ul>
            <Button 
              onClick={() => setLocation("/submit")}
              size="lg"
              className="w-full bg-cinema-slate hover:bg-gray-600 text-white"
            >
              Select Plan
            </Button>
          </Card>

          {/* Pro Kit */}
          <Card className="bg-white/5 backdrop-blur-sm border-cinema-gold p-8 flex flex-col relative">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cinema-gold text-cinema-dark">
              Popular
            </Badge>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-cinema-gold" />
              <h4 className="font-semibold text-lg text-white">Pro Kit</h4>
            </div>
            <p className="text-sm text-gray-300 mb-4">Perfect for mid-size agencies and production companies.</p>
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">SAR 35,000</span>
              <span className="text-gray-400"> / mo</span>
              <div className="text-sm text-cinema-gold">25 credits</div>
            </div>
            <ul className="space-y-3 text-sm flex-1 mb-6">
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">8 MoCap Basic + 2 outdoor scans</span>
              </li>
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Advanced cleanup included</span>
              </li>
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Priority scheduling</span>
              </li>
            </ul>
            <Button 
              onClick={() => setLocation("/submit")}
              size="lg"
              className="w-full gold-gradient text-cinema-dark font-semibold"
            >
              Select Plan
            </Button>
          </Card>

          {/* Premium Kit */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-cinema-gold" />
              <h4 className="font-semibold text-lg text-white">Premium Kit</h4>
            </div>
            <p className="text-sm text-gray-300 mb-4">Ideal for large brands, government projects, and high-volume productions.</p>
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">SAR 65,000</span>
              <span className="text-gray-400"> / mo</span>
              <div className="text-sm text-cinema-gold">50 credits</div>
            </div>
            <ul className="space-y-3 text-sm flex-1 mb-6">
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">10 MoCap Basic + 4 outdoor scans</span>
              </li>
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">All advanced features</span>
              </li>
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Fastest delivery (3-5 days)</span>
              </li>
            </ul>
            <Button 
              onClick={() => setLocation("/submit")}
              variant="outline"
              size="lg"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              Select Plan
            </Button>
          </Card>
        </div>
      </section>

      {/* Who we help */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 bg-cinema-gray">
        <h3 className="text-2xl font-bold text-white mb-6">Who we help</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
            <ShoppingBag className="w-5 h-5 text-cinema-gold mb-3" />
            <h4 className="font-semibold text-white mb-2">Brands & Marketing</h4>
            <p className="text-gray-300 text-sm">Always-on ad content, faster cycles.</p>
          </Card>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
            <Film className="w-5 h-5 text-cinema-gold mb-3" />
            <h4 className="font-semibold text-white mb-2">Film & Streaming</h4>
            <p className="text-gray-300 text-sm">Virtual sets, mocap, previz.</p>
          </Card>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
            <Library className="w-5 h-5 text-cinema-gold mb-3" />
            <h4 className="font-semibold text-white mb-2">Culture & Heritage</h4>
            <p className="text-gray-300 text-sm">Digitization & immersive exhibits.</p>
          </Card>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
            <Trophy className="w-5 h-5 text-cinema-gold mb-3" />
            <h4 className="font-semibold text-white mb-2">Sports</h4>
            <p className="text-gray-300 text-sm">High-impact promos, motion analysis.</p>
          </Card>
        </div>
      </section>

      {/* Contact */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 bg-cinema-gray">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 md:p-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Ready to ship cinematic content on a subscription?</h3>
              <p className="text-gray-300 mb-6">Tell us about your brand and monthly goals. We'll propose the right plan.</p>
              <div className="space-y-3">
                <a className="inline-flex items-center gap-2 text-cinema-gold hover:text-yellow-300 transition-colors" href="mailto:hello@virtualproduction.com">
                  <Mail className="w-4 h-4" />
                  hello@virtualproduction.com
                </a>
                <br />
                <a className="inline-flex items-center gap-2 text-cinema-gold hover:text-yellow-300 transition-colors" href="#" target="_blank">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp us
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <Button 
                onClick={() => setLocation("/submit")}
                size="lg"
                className="w-full gold-gradient text-cinema-dark font-semibold"
              >
                Request Proposal
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </Card>
      </section>
      
      {/* Footer */}
      <footer className="bg-cinema-gray border-t border-gray-800 py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src={vmpLogo} 
                  alt="VMP - Virtual Media Production" 
                  className="h-20 w-auto"
                />
              </div>
              <p className="text-gray-400 text-sm">
                Capture Reality. Create Worlds.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Motion Capture</li>
                <li>Virtual Sets</li>
                <li>AI Enhancement</li>
                <li>Post Production</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>About Us</li>
                <li>Portfolio</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4 text-gray-400">
                <span>Twitter</span>
                <span>LinkedIn</span>
                <span>Instagram</span>
                <span>YouTube</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 VirtualPro Studios. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;