import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import BrowseStores from "./pages/BrowseStores";
import AdminUsers from "./pages/AdminUsers";
import AdminStores from "./pages/AdminStores";
import AddUser from "./pages/AddUser";
import Analytics from "./pages/Analytics";
import MyRatings from "./pages/MyRatings";
import Profile from "./pages/Profile";
import StoreDashboard from "./pages/StoreDashboard";
import StoreRatings from "./pages/StoreRatings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/browse" element={<BrowseStores />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/stores" element={<AdminStores />} />
              <Route path="/add-user" element={<AddUser />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/my-ratings" element={<MyRatings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/store-dashboard" element={<StoreDashboard />} />
              <Route path="/store-ratings" element={<StoreRatings />} />
              <Route path="/" element={<Dashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
