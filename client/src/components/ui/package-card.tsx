import { cn } from "@/lib/utils";
import { Check, CheckCircle } from "lucide-react";
import { packageTypes, type PackageType } from "@shared/old_schema";

interface PackageCardProps {
  packageKey: PackageType;
  isSelected: boolean;
  onSelect: (packageKey: PackageType) => void;
  isPopular?: boolean;
}

export default function PackageCard({ packageKey, isSelected, onSelect, isPopular }: PackageCardProps) {
  const packageData = packageTypes[packageKey];
  
  if (!packageData) {
    return null; // Handle missing package data gracefully
  }
  
  const getIcon = () => {
    switch (packageKey) {
      case 'starter':
        return '🚀';
      case 'pro':
        return '✨';
      case 'premium':
        return '🏢';
      default:
        return '🚀';
    }
  };

  return (
    <div 
      className={cn(
        "bg-white/5 border rounded-2xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer relative",
        isSelected 
          ? "border-cinema-gold" 
          : isPopular 
            ? "border-cinema-gold" 
            : "border-white/10 hover:border-cinema-gold/50"
      )}
      onClick={() => onSelect(packageKey)}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cinema-gold text-cinema-dark px-4 py-1 rounded-full text-sm font-bold">
          POPULAR
        </div>
      )}
      
      <div className="text-center">
        <div className="text-4xl mb-4">{getIcon()}</div>
        <h3 className="text-2xl font-bold mb-2">{packageData.name}</h3>
        <p className="text-cinema-gold text-xl font-semibold mb-4">{packageData.price}</p>
        <p className="text-gray-300 mb-6">{packageData.description}</p>
        
        <ul className="text-left text-gray-400 space-y-2 mb-8">
          {packageData.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="text-cinema-gold mr-2 h-4 w-4 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        {isSelected && (
          <div className="flex flex-col items-center">
            <CheckCircle className="text-green-400 h-8 w-8 mb-2" />
            <p className="text-green-400">Selected</p>
          </div>
        )}
      </div>
    </div>
  );
}
