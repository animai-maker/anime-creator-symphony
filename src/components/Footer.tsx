
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-8 mt-16 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/2123f088-be33-4104-9220-dea299996ab5.png" 
              alt="Animai Logo" 
              className="h-8 w-8"
            />
            <span className="text-lg font-bold text-animai-navy">Animai</span>
          </div>
          <div className="text-sm text-gray-500">
            © 2023 Animai. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
