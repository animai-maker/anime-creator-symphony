
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useStripeCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const initiateCheckout = async (planId: string) => {
    setIsLoading(true);
    
    try {
      const { data: sessionData, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId }
      });

      if (error || !sessionData?.url) {
        console.error("Checkout error:", error || "No checkout URL returned");
        toast.error("Failed to start checkout process. Please try again.");
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = sessionData.url;
    } catch (error) {
      console.error("Checkout process failed:", error);
      toast.error("Something went wrong with the checkout process. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return { initiateCheckout, isLoading };
};
