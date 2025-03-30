import React from 'react';
import { Button } from '@/components/ui/button';
const Hero = () => {
  return <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-animai-navy mb-6">AI-Powered Animation Builder</h1>
      <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mb-12">Create Cinematic Anime Films from Images and Prompts — Powered by AI</p>
      <Button className="text-white bg-gradient-to-r from-animai-purple to-animai-pink hover:opacity-90 transition-all px-12 py-6 text-lg rounded-full">
        Create
      </Button>
    </div>;
};
export default Hero;