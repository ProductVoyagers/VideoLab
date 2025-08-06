import { cn } from "@/lib/utils";

interface ProgressStepsProps {
  currentStep: number;
  steps: string[];
}

export default function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  return (
    <div className="flex justify-center mb-12">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={index} className="flex items-center">
              <div className="flex items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                  isActive 
                    ? "bg-cinema-gold text-cinema-dark" 
                    : "bg-gray-600 text-gray-400"
                )}>
                  {stepNumber}
                </div>
                <span className={cn(
                  "ml-3 font-semibold",
                  isActive ? "text-cinema-gold" : "text-gray-400"
                )}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-16 h-1 ml-4",
                  stepNumber < currentStep ? "bg-cinema-gold" : "bg-gray-600"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
