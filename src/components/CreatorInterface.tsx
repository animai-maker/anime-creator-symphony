import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Play } from 'lucide-react';
const CreatorInterface = () => {
  return <div className="w-full max-w-6xl mx-auto py-8">
      <div className="animai-glass p-8 rounded-3xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Upload Section - Polaroid Style */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-3 pb-12 rounded-md shadow-lg transform rotate-[-2deg] transition-transform hover:rotate-0 duration-300">
              <div className="relative w-48 h-48 mb-1 overflow-hidden">
                <img src="/lovable-uploads/43127aaf-52fa-4f9f-9315-28d7075b3341.png" alt="Anime character" className="w-full h-full object-cover" />
              </div>
              <p className="text-center font-handwritten text-lg text-animai-navy -rotate-2 mt-2">
                Uploaded Image
              </p>
            </div>
            <Button className="w-full mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200">
              Upload Image
            </Button>
          </div>

          {/* Cute Arrow */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-animai-purple/20 rounded-full flex items-center justify-center animate-pulse-light">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-animai-purple animate-float">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="absolute -top-8 -right-10 text-animai-pink -rotate-12 text-xl">✨</div>
              <div className="absolute -bottom-8 -left-6 text-animai-purple rotate-12 text-xl">🌟</div>
            </div>
            <p className="text-sm font-medium text-animai-purple mt-3 max-w-[130px] text-center">Transform your image into an animated video with your custom prompts!</p>
          </div>

          {/* Preview Section - Polaroid Style */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-3 pb-12 rounded-md shadow-lg transform rotate-[2deg] transition-transform hover:rotate-0 duration-300">
              <div className="relative w-48 h-48 mb-1 overflow-hidden">
                <img src="/lovable-uploads/43127aaf-52fa-4f9f-9315-28d7075b3341.png" alt="Anime character preview" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-0 right-0 px-2">
                  <div className="bg-black/30 backdrop-blur-sm rounded-full p-1 flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="text-white rounded-full h-6 w-6 flex items-center justify-center">
                      <Play className="w-3 h-3" />
                    </Button>
                    <div className="bg-white/30 h-1 flex-grow rounded-full">
                      <div className="bg-white h-full w-1/3 rounded-full"></div>
                    </div>
                    <span className="text-white text-xs">0:12</span>
                  </div>
                </div>
              </div>
              <p className="text-center font-handwritten text-lg text-animai-navy rotate-2 mt-2">
                Generated Video
              </p>
            </div>
            <Button className="w-full mt-4 bg-animai-purple hover:bg-animai-lightpurple text-white">
              Generate Video
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default CreatorInterface;