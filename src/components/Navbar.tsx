
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('home');
  
  useEffect(() => {
    // Set active item based on current path
    const path = location.pathname;
    if (path === '/') {
      setActiveItem('home');
    } else if (path === '/pricing') {
      setActiveItem('pricing');
    }
  }, [location.pathname]);

  const navItems = [{
    id: 'home',
    label: 'Home',
    path: '/'
  }, {
    id: 'pricing',
    label: 'Pricing',
    path: '/pricing'
  }];

  return <nav className="w-full flex items-center justify-between py-4 px-8 animai-glass z-10">
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

      <Link to="/create">
        <Button className="bg-animai-purple hover:bg-animai-lightpurple text-white font-medium hidden md:block">
          Create
        </Button>
      </Link>
      
      <Button variant="ghost" className="md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </Button>
    </nav>;
};

export default Navbar;
