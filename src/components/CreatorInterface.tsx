
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Upload, Mic, Music, Play, Volume2 } from 'lucide-react';

const CreatorInterface = () => {
  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="animai-glass p-8 rounded-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="flex flex-col items-center bg-white/80 p-6 rounded-2xl">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload image
            </h3>
            <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-lg mx-auto">
              <img 
                src="/lovable-uploads/43127aaf-52fa-4f9f-9315-28d7075b3341.png" 
                alt="Anime character" 
                className="w-full h-full object-cover"
              />
            </div>
            <Button className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              Upload Image
            </Button>
          </div>

          {/* Middle Section (Voice and Music) */}
          <div className="flex flex-col space-y-6">
            {/* Voice Section */}
            <div className="bg-white/80 p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Mic className="w-5 h-5 mr-2" />
                Voiceover
              </h3>
              <div className="space-y-4">
                <Input 
                  placeholder="What should the character say or do?" 
                  className="w-full border border-gray-200"
                />
                <div className="flex items-center justify-between">
                  <Button variant="outline" className="flex items-center gap-2">
                    Add
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Music Section */}
            <div className="bg-white/80 p-6 rounded-2xl flex-grow">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Music className="w-5 h-5 mr-2" />
                Music
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between gap-2">
                  <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 h-16 bg-gray-50">
                    <div className="text-animai-purple">♪</div>
                    Pop
                  </Button>
                  <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 h-16 bg-gray-50">
                    <div className="text-animai-pink">♫</div>
                    Epic
                  </Button>
                  <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 h-16 bg-gray-50">
                    <div className="text-animai-purple">♬</div>
                    Calm
                  </Button>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Volume</span>
                    <Volume2 className="w-4 h-4 text-gray-500" />
                  </div>
                  <Slider defaultValue={[60]} max={100} step={1} />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="flex flex-col bg-white/80 p-6 rounded-2xl">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              Preview
            </h3>
            <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-lg mx-auto">
              <img 
                src="/lovable-uploads/43127aaf-52fa-4f9f-9315-28d7075b3341.png" 
                alt="Anime character preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-0 right-0 px-2">
                <div className="bg-black/30 backdrop-blur-sm rounded-full p-1 flex items-center gap-1 scale-75">
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
            <Button className="w-full bg-animai-purple hover:bg-animai-lightpurple text-white">
              Generate Video
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorInterface;
