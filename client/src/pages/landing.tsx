import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Bot, Globe, Play } from "lucide-react";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen relative">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-cinema-dark/90 via-cinema-dark/70 to-transparent" />
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 min-h-screen flex items-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Capture Reality.</span><br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Create Worlds.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl leading-relaxed">
            High-end cinematic videos delivered using motion capture, AI, and virtual production — in just a few simple steps.
          </p>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-6">
                <Video className="text-cinema-gold h-8 w-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Motion Capture</h3>
                <p className="text-gray-400 text-sm">
                  Professional mocap technology for realistic character animation
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-6">
                <Bot className="text-cinema-gold h-8 w-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">AI Enhancement</h3>
                <p className="text-gray-400 text-sm">
                  Cutting-edge AI for post-production and visual effects
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-6">
                <Globe className="text-cinema-gold h-8 w-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Virtual Worlds</h3>
                <p className="text-gray-400 text-sm">
                  Immersive virtual environments and digital sets
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Button 
            onClick={() => setLocation("/submit")}
            className="gold-gradient hover:scale-105 transform transition-all duration-300 px-12 py-6 rounded-full text-xl font-semibold text-cinema-dark shadow-2xl"
          >
            <Play className="mr-3 h-6 w-6" />
            Start Your Project
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-cinema-gray border-t border-gray-800 py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Video className="text-cinema-gold" />
                <span className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  VirtualPro Studios
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Creating immersive virtual production experiences with cutting-edge technology.
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
