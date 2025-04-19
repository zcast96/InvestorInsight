// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/holdings" component={Holdings} />
        <Route path="/holdings/:id" component={HoldingDetail} />
        <Route path="/add-transaction" component={AddTransaction} />
        <Route path="/add-manual-asset" component={AddManualAsset} />
        <Route path="/import-csv" component={ImportCSV} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AppShell>
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
