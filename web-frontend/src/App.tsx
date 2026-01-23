import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from './lib/wagmi';
import { AuthProvider } from './contexts/AuthContext';

// Import your pages and components
import Login from "./pages/Login";
import { Dashboard } from "./components/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
// NEW: Import the legal pages you just created
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

// Essential styles for Web3 components
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      {/* Set to "wide" for the larger, more professional sign-in popup */}
      <RainbowKitProvider theme={darkTheme()} modalSize="wide">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* 1. The Authentication Gatekeeper */}
                <Route path="/" element={<Login />} />
                
                {/* 2. The Post-Login Landing Page (Secure Your Legacy) */}
                <Route path="/home" element={<Index />} />
                
                {/* 3. The Secure User Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* 4. NEW: Legal and Compliance Routes */}
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                
                {/* 5. Catch-all: Safety redirect with 'replace' to prevent history loops */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;