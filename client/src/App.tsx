import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Products from "@/pages/Products";
import Orders from "@/pages/Orders";
import Drivers from "@/pages/Drivers";
import Categories from "./pages/Categories";
import Notifications from "./pages/Notifications";
import ShippingAreas from "./pages/ShippingAreas"

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/categories" component={Categories} />
      <Route path="/products" component={Products} />
      <Route path="/orders" component={Orders} />
      <Route path="/drivers" component={Drivers} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/shippingareas" component={ShippingAreas} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
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
