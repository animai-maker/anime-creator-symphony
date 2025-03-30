import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, LogOut, CreditCard } from 'lucide-react';

// Create a context-aware Navbar component
const Navbar = () => {
  const [activeItem, setActiveItem] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Different navigation items based on authentication status
  const publicNavItems = [
    {
      id: 'home',
      label: 'Home',
      path: '/'
    }, 
    {
      id: 'pricing',
      label: 'Pricing',
      path: '/pricing'
    }
  ];
  
  const privateNavItems = [
    {
      id: 'create',
      label: 'Create Project',
      path: '/create'
    }, 
    {
      id: 'plans',
      label: 'Plans & Billing',
      path: '/pricing'
    }
  ];

  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session?.user?.email || "No session");
        if (session?.user) {
          console.log("Setting user from session check", session.user.email);
          setUser(session.user);
        } else {
          console.log("No user found in session check");
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();

    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (session?.user) {
          console.log("Setting user from auth state change", session.user.email);
          setUser(session.user);
        } else {
          console.log("Clearing user from auth state change");
          setUser(null);
        }
        
        // Navigate to dashboard on sign in
        if (event === 'SIGNED_IN' && session) {
          navigate('/create');
          toast.success(`Welcome ${session.user.email?.split('@')[0] || 'back'}!`);
        } else if (event === 'SIGNED_OUT') {
          navigate('/');
          toast.success('Signed out successfully');
        }
      }
    );

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Update activeItem based on current path whenever location changes
  useEffect(() => {
    const path = location.pathname;
    console.log("Current path:", path);
    console.log("Current user:", user ? "Logged in" : "Not logged in");
    
    const navItems = user ? privateNavItems : publicNavItems;
    console.log("Nav items:", navItems.map(item => item.label).join(", "));
    
    const matchingItem = navItems.find(item => item.path === path);
    if (matchingItem) {
      console.log("Setting active item to:", matchingItem.id);
      setActiveItem(matchingItem.id);
    }
  }, [location.pathname, user]);

  const handleSignInWithGoogle = async () => {
    try {
      setAuthLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/create`,
        },
      });

      if (error) {
        toast.error('Failed to sign in with Google: ' + error.message);
        throw error;
      }
      
      // The redirect will happen automatically
      toast.success('Redirecting to Google for authentication...');
      
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast.error('Could not sign in with Google. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setAuthLoading(true);
      console.log("Signing out");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error('Failed to sign out: ' + error.message);
        throw error;
      }
      
      // The redirect will happen in the auth state change handler
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error('Could not sign out. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Get the correct navigation items based on authentication status
  const navItems = user ? privateNavItems : publicNavItems;

  console.log("Auth state in Navbar render:", user ? "Authenticated" : "Not authenticated");
  console.log("Showing nav items in render:", user ? "Private" : "Public");
  console.log("Current nav items:", navItems.map(item => item.label).join(", "));

  return (
    <nav className="w-full flex items-center justify-between py-4 px-8 animai-glass z-10">
      <div className="flex items-center gap-3">
        <img src="/lovable-uploads/2123f088-be33-4104-9220-dea299996ab5.png" alt="Animai Logo" className="h-12 w-12 object-contain" />
        <span className="text-2xl font-bold text-[#78afad]">Animai</span>
      </div>

      <div className="hidden md:flex items-center gap-8 relative">
        <div className="absolute inset-0 h-full rounded-full bg-white/10 backdrop-blur-lg -z-10 tubelight" style={{
          width: `${100 / navItems.length}%`,
          transform: `translateX(${navItems.findIndex(item => item.id === activeItem) * 100}%)`,
          transition: 'transform 0.3s ease'
        }} />
        
        {navItems.map(item => (
          <Link 
            key={item.id} 
            to={item.path} 
            className={`relative px-4 py-2 text-animai-navy font-medium transition-colors z-10 ${activeItem === item.id ? 'text-animai-purple' : 'hover:text-animai-purple'}`} 
            onClick={() => setActiveItem(item.id)}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <Button 
        className="bg-animai-purple hover:bg-animai-lightpurple text-white font-medium hidden md:flex items-center gap-2"
        onClick={user ? handleSignOut : handleSignInWithGoogle}
        disabled={authLoading}
      >
        {authLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {user ? 'Signing out...' : 'Signing in...'}
          </>
        ) : user ? (
          <>
            <LogOut className="h-4 w-4" />
            Sign Out
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Create
          </>
        )}
      </Button>
      
      <Button variant="ghost" className="md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </Button>
    </nav>
  );
};

// Create a wrapper component that can be safely used outside Router context
export const NavbarWrapper = () => {
  return null; // This is a placeholder, it won't render anything outside of Router context
};

export default Navbar;
