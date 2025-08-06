import { Link, useLocation } from "wouter";
import { Video, Settings, Home } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-cinema-gray/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <Video className="text-cinema-gold text-2xl" />
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              VirtualPro Studios
            </span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className={`transition-colors ${location === '/' ? 'text-cinema-gold' : 'text-gray-300 hover:text-cinema-gold'}`}>
              Home
            </a>
          </Link>
          <span className="text-gray-300">Services</span>
          <span className="text-gray-300">Portfolio</span>
          <Link href="/admin">
            <button className="bg-cinema-slate px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </Link>
        </div>
        
        <button className="md:hidden text-white">
          <div className="w-6 h-1 bg-white mb-1"></div>
          <div className="w-6 h-1 bg-white mb-1"></div>
          <div className="w-6 h-1 bg-white"></div>
        </button>
      </div>
    </nav>
  );
}
