
import React from 'react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between py-4 px-8 animai-glass z-10">
      <div className="flex items-center gap-3">
        <img 
          src="/lovable-uploads/2123f088-be33-4104-9220-dea299996ab5.png" 
          alt="Animai Logo" 
          className="h-12 w-12"
        />
        <span className="text-2xl font-bold text-animai-navy">Animai</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <Button variant="link" className="text-animai-navy font-medium">Home</Button>
        <Button variant="link" className="text-animai-navy font-medium">How it Works</Button>
        <Button variant="link" className="text-animai-navy font-medium">Explore</Button>
        <Button variant="link" className="text-animai-navy font-medium">Pricing</Button>
        <Button variant="link" className="text-animai-navy font-medium">About</Button>
        <Button variant="link" className="text-animai-navy font-medium">Contact</Button>
      </div>

      <Button className="bg-animai-purple hover:bg-animai-lightpurple text-white font-medium hidden md:block">
        Create
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
