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
import SubscriptionPage from "@/pages/subscription";
import PayAsYouGoPage from "@/pages/pay-as-you-go";
import SubscriptionUploadPage from "@/pages/subscription-upload";
import PayGUploadPage from "@/pages/payg-upload";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import ProfilePage from "@/pages/profile";
import UploadProductPage from "@/pages/upload-product";

function Router() {
  return (
    <div className="min-h-screen bg-cinema-dark text-white">
      <Navigation />
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/submit" component={SubmissionWizard} />
        <Route path="/marketplace" component={MarketplacePage} />
        <Route path="/credits" component={CreditsPage} />
        <Route path="/subscription" component={SubscriptionPage} />
        <Route path="/subscription/upload" component={SubscriptionUploadPage} />
        <Route path="/pay-as-you-go" component={PayAsYouGoPage} />
        <Route path="/pay-as-you-go/upload" component={PayGUploadPage} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/upload-product" component={UploadProductPage} />
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
