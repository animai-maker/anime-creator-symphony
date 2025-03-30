
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { LogOut, User, Loader2 } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signOutLoading, setSignOutLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log("User in dashboard:", session.user);
        setUser(session.user);
      } else {
        navigate('/');
        toast.error("Please sign in to access the dashboard");
      }
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
          navigate('/');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      setSignOutLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success("Signed out successfully");
      navigate('/');
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error("Error signing out: " + error.message);
    } finally {
      setSignOutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-animai">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-animai-purple" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-animai">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-animai-navy">Creator Dashboard</h1>
            <Button 
              variant="destructive" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
              disabled={signOutLoading}
            >
              {signOutLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut size={18} />
                  Sign Out
                </>
              )}
            </Button>
          </div>
          
          <div className="mb-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-animai-purple flex items-center justify-center text-white">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-animai-navy">
                    Welcome, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Creator'}!
                  </h2>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
              <p className="text-gray-700">
                This is your personal dashboard where you can manage your Animai creations.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-2 text-animai-navy">My Animations</h3>
              <p className="text-gray-600 mb-4">View and manage your created animations.</p>
              <Button variant="outline" className="w-full">View Animations</Button>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-2 text-animai-navy">Create New</h3>
              <p className="text-gray-600 mb-4">Start a new animation project from scratch.</p>
              <Button variant="anime-pink" className="w-full">New Project</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
