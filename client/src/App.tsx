import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import LandingPage from "@/pages/landing";
import SubmissionWizard from "@/pages/submission-wizard";
import AdminDashboard from "@/pages/admin-dashboard";
import MarketplacePage from "@/pages/marketplace";
import CreditsPage from "@/pages/credits";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-cinema-dark text-white">
      <Navigation />
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/submit" component={SubmissionWizard} />
        <Route path="/marketplace" component={MarketplacePage} />
        <Route path="/credits" component={CreditsPage} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
