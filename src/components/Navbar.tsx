
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [{
    id: 'home',
    label: 'Home',
    path: '/'
  }, {
    id: 'pricing',
    label: 'Pricing',
    path: '/pricing'
  }];

  // Check authentication status when component mounts
  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Update activeItem based on current path whenever location changes
  useEffect(() => {
    const path = location.pathname;
    const matchingItem = navItems.find(item => item.path === path);
    if (matchingItem) {
      setActiveItem(matchingItem.id);
    }
  }, [location.pathname]);

  const handleSignInWithGoogle = async () => {
    try {
      setAuthLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast.error('Failed to sign in with Google: ' + error.message);
        throw error;
      }
      
      // The redirect will happen automatically
      toast.success('Signing in with Google...');
      
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast.error('Could not sign in with Google. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCreateClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      handleSignInWithGoogle();
    }
  };

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
        
        {navItems.map(item => <Link key={item.id} to={item.path} className={`relative px-4 py-2 text-animai-navy font-medium transition-colors z-10 ${activeItem === item.id ? 'text-animai-purple' : 'hover:text-animai-purple'}`} onClick={() => setActiveItem(item.id)}>
          {item.label}
        </Link>)}
      </div>

      <Button 
        className="bg-animai-purple hover:bg-animai-lightpurple text-white font-medium hidden md:flex items-center gap-2"
        onClick={handleCreateClick}
        disabled={authLoading}
      >
        {authLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            Signing in...
          </>
        ) : user ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"></path>
              <path d="M12 8v8"></path>
              <path d="M8 12h8"></path>
            </svg>
            Create
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path>
            </svg>
            Sign In
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

export default Navbar;
