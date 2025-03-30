
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Play, Pause } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const CreatorInterface = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleDurationChange = () => {
        setDuration(video.duration);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
      };
      
      video.addEventListener('durationchange', handleDurationChange);
      video.addEventListener('timeupdate', handleTimeUpdate);
      
      return () => {
        video.removeEventListener('durationchange', handleDurationChange);
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, []);

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Format time to MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

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

          {/* Preview Section - Polaroid Style with Video */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-3 pb-12 rounded-md shadow-lg transform rotate-[2deg] transition-transform hover:rotate-0 duration-300">
              <div className="relative w-48 h-48 mb-1 overflow-hidden">
                <video 
                  ref={videoRef}
                  src="/demo-video.mp4" 
                  className="w-full h-full object-cover"
                  loop
                  onClick={togglePlayback}
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      setDuration(videoRef.current.duration);
                    }
                  }}
                />
                <div className="absolute bottom-2 left-0 right-0 px-2">
                  <div className="bg-black/30 backdrop-blur-sm rounded-full p-1 flex items-center gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-white rounded-full h-6 w-6 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayback();
                      }}
                    >
                      {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </Button>
                    <div className="bg-white/30 h-1 flex-grow rounded-full overflow-hidden">
                      <Progress 
                        value={progressPercent} 
                        className="h-full bg-white/30" 
                        indicatorClassName="bg-white"
                      />
                    </div>
                    <span className="text-white text-xs">{formatTime(duration)}</span>
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

        {/* Example Prompts Section - Added as per user request */}
        <div className="mt-12 px-4 text-center max-w-4xl mx-auto">
          <div className="font-handwritten text-lg text-animai-navy space-y-3">
            <p><span className="font-semibold">Animation prompt:</span> featuring a high school girl standing on a hill during sunset. Her long hair flows gently in the wind, and she wears a sailor-style school uniform with a red scarf. The sky behind her is painted in soft gradients of orange, pink, and purple, with clouds slowly drifting by. The girl's expression is calm and reflective, as if she's thinking about her future. Light particles float in the air, adding a touch of magic. The camera slowly pans around her, capturing the golden-hour glow on her face and the breathtaking view of distant mountains. Soft instrumental music plays in the background.</p>
            <p><span className="font-semibold">Sound Effect prompt:</span> Light Piano or Music Box Melody</p>
          </div>
        </div>
      </div>
    </div>;
};

export default CreatorInterface;
