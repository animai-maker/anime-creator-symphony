
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import CreateProject from "./pages/CreateProject";
import React, { useState, useEffect } from "react";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './integrations/supabase/client';

const App = () => {
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simple check to see if Supabase client is initialized
    try {
      // Just checking if we can access the auth object without errors
      if (supabase && supabase.auth) {
        setIsSupabaseReady(true);
      }
    } catch (err) {
      console.error("Error initializing Supabase client:", err);
      setError("Failed to initialize Supabase client. Check console for details.");
    }
  }, []);

  // Create a client
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="p-6 max-w-sm bg-white rounded-lg border border-red-200 shadow-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">Application Error</h2>
          <p className="text-gray-700">{error}</p>
          <p className="mt-4 text-sm text-gray-500">
            Please check your environment variables and refresh the page.
          </p>
        </div>
      </div>
    );
  }

  if (!isSupabaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-animai-purple"></div>
      </div>
    );
  }

  return (
    <React.StrictMode>
      <SessionContextProvider supabaseClient={supabase}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <BrowserRouter>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/how-it-works" element={<Index />} />
                <Route path="/explore" element={<Index />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/create" element={<CreateProject />} />
                <Route path="/about" element={<Index />} />
                <Route path="/contact" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </SessionContextProvider>
    </React.StrictMode>
  );
};

export default App;
