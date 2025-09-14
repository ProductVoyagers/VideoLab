import { Link, useLocation } from "wouter";
import {
  Video,
  Settings,
  Home,
  Store,
  CreditCard,
  Package2,
  LogIn,
  LogOut,
  User,
  Upload,
} from "lucide-react";
import vmpLogo from "@assets/VMPOrangeLogo.png";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const { session, user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocation("/");
  };

  return (
    <nav className="bg-cinema-gray/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <img 
              src={vmpLogo} 
              alt="VMP - Virtual Media Production" 
              className="h-14 w-auto"
            />
          </div>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className={`transition-colors ${location === '/' ? 'text-cinema-gold' : 'text-gray-300 hover:text-cinema-gold'}`}>
            Home
          </Link>
          <Link href="/subscription" className={`transition-colors flex items-center space-x-1 ${location === '/subscription' ? 'text-cinema-gold' : 'text-gray-300 hover:text-cinema-gold'}`}>
            <CreditCard className="w-4 h-4" />
            <span>Subscription</span>
          </Link>
          <Link href="/pay-as-you-go" className={`transition-colors flex items-center space-x-1 ${location === '/pay-as-you-go' ? 'text-cinema-gold' : 'text-gray-300 hover:text-cinema-gold'}`}>
            <Package2 className="w-4 h-4" />
            <span>Pay-As-You-Go</span>
          </Link>
          <Link href="/marketplace" className={`transition-colors flex items-center space-x-1 ${location === '/marketplace' ? 'text-cinema-gold' : 'text-gray-300 hover:text-cinema-gold'}`}>
            <Store className="w-4 h-4" />
            <span>Marketplace</span>
          </Link>
          {session ? (
            <>
              {user?.user_metadata.role === "seller" && (
                <Link href="/upload-product">
                  <button className="bg-cinema-gold text-cinema-dark px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </Link>
              )}
              <Link href="/profile">
                <button className="bg-cinema-slate px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-cinema-slate px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link href="/login">
              <button className="bg-cinema-slate px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2">
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            </Link>
          )}
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