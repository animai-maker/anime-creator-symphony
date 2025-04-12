
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Check, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchUserCredits = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is logged in
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          toast.error("Please sign in to view your credits");
          navigate('/');
          return;
        }
        
        // Get user credits from database
        const { data: creditsData, error } = await supabase
          .from('user_credits')
          .select('credits')
          .eq('id', sessionData.session.user.id)
          .single();
          
        if (error) {
          console.error("Error fetching user credits:", error);
          toast.error("Could not retrieve your credits. Please try again later.");
        } else if (creditsData) {
          setCredits(creditsData.credits);
        }
      } catch (error) {
        console.error("Error in fetchUserCredits:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserCredits();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-animai flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-6 text-animai-navy">
              Payment Successful!
            </h1>
            
            <p className="text-center text-gray-600 mb-6">
              Thank you for your purchase. Your account has been credited.
            </p>
            
            {isLoading ? (
              <div className="flex justify-center mb-6">
                <Loader2 className="h-6 w-6 animate-spin text-animai-purple" />
              </div>
            ) : (
              credits !== null && (
                <div className="text-center mb-6">
                  <p className="text-gray-600">Your current balance:</p>
                  <p className="text-2xl font-bold text-animai-purple">{credits} credits</p>
                </div>
              )
            )}
            
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => navigate('/create')} 
                className="bg-animai-purple hover:bg-animai-lightpurple flex items-center gap-2"
              >
                Start Creating <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
