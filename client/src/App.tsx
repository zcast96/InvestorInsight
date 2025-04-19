// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/animations";
import { NotificationProvider } from "@/context/NotificationContext";
import AppShell from "@/components/layout/AppShell";
import Dashboard from "@/pages/Dashboard";
import Holdings from "@/pages/Holdings";
import HoldingDetail from "@/pages/HoldingDetail";
import AddTransaction from "@/pages/AddTransaction";
import AddManualAsset from "@/pages/AddManualAsset";
import ImportCSV from "@/pages/ImportCSV";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  // Get current location for AnimatePresence to track route changes
  const [location] = useLocation();

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <PageTransition key={location}>
          <Switch location={location}>
            <Route path="/" component={Dashboard} />
            <Route path="/holdings" component={Holdings} />
            <Route path="/holdings/:id" component={HoldingDetail} />
            <Route path="/add-transaction" component={AddTransaction} />
            <Route path="/add-manual-asset" component={AddManualAsset} />
            <Route path="/import-csv" component={ImportCSV} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </PageTransition>
      </AnimatePresence>
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NotificationProvider>
          <Toaster />
          <Router />
        </NotificationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
