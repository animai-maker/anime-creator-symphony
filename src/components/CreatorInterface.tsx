import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Play, Pause, Info, Download } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { generateVideoFromImage } from '@/services/falAiService';
import { toast } from 'sonner';

const CreatorInterface = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>("/demo-video.mp4");
  const [animationPrompt, setAnimationPrompt] = useState<string>("A high school girl stands on a hill at sunset, her hair gently swaying in the breeze as she gazes into the distance, calm and thoughtful. The sky glows in warm hues with drifting clouds and floating light particles, while the camera slowly pans around her, capturing the golden-hour magic.");
  const [soundEffectPrompt, setSoundEffectPrompt] = useState<string>("Light Piano or Music Box Melody");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const generateVideo = async () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    if (!animationPrompt) {
      toast.error("Please provide an animation prompt");
      return;
    }

    setIsGenerating(true);
    setGenerationStatus("Preparing to generate video...");

    try {
      const videoUrl = await generateVideoFromImage(
        {
          prompt: animationPrompt,
          imageUrl: uploadedImage,
          aspectRatio: "16:9",
          resolution: "540p",
          duration: "5s",
        },
        setGenerationStatus
      );

      setGeneratedVideoUrl(videoUrl);
      toast.success("Video generated successfully!");
    } catch (error) {
      console.error("Failed to generate video:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadVideo = () => {
    if (!generatedVideoUrl) return;
    
    const link = document.createElement('a');
    link.href = generatedVideoUrl;
    link.download = 'generated-animation.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <div className="flex flex-col items-center">
            <div className="bg-white p-3 pb-12 rounded-md shadow-lg transform rotate-[-2deg] transition-transform hover:rotate-0 duration-300">
              <div className="relative w-48 h-48 mb-1 overflow-hidden">
                <img 
                  src={uploadedImage || "/lovable-uploads/43127aaf-52fa-4f9f-9315-28d7075b3341.png"} 
                  alt="Anime character" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <p className="text-center font-handwritten text-lg text-animai-navy -rotate-2 mt-2">
                {uploadedImage ? "Your Image" : "Upload Image"}
              </p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            <Button 
              className="w-full mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200"
              onClick={triggerFileInput}
            >
              <Upload className="w-4 h-4 mr-2" /> Upload Image
            </Button>
          </div>

          <Dialog open={isPromptDialogOpen} onOpenChange={setIsPromptDialogOpen}>
            <DialogTrigger asChild>
              <div className="flex flex-col items-center justify-center cursor-pointer group">
                <div className="relative">
                  <div className="w-16 h-16 bg-animai-purple/20 rounded-full flex items-center justify-center animate-pulse-light group-hover:bg-animai-purple/40 transition-colors">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-animai-purple animate-float">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="absolute -top-8 -right-10 text-animai-pink -rotate-12 text-xl">✨</div>
                  <div className="absolute -bottom-8 -left-6 text-animai-purple rotate-12 text-xl">🌟</div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm font-medium text-animai-purple mt-3 max-w-[130px] text-center flex items-center gap-1">
                        View Prompts <Info className="h-3 w-3" />
                      </p>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-xs">Click to see animation and sound prompts</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl text-animai-navy">Animation Prompts</DialogTitle>
                <DialogDescription>
                  These prompts will be used to generate your video
                </DialogDescription>
              </DialogHeader>
              <div className="font-handwritten text-lg text-animai-navy space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold text-animai-purple mb-2">Animation prompt:</h3>
                  <p>{animationPrompt}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-animai-pink mb-2">Sound Effect prompt:</h3>
                  <p>{soundEffectPrompt}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex flex-col items-center">
            <div className="bg-white p-3 pb-12 rounded-md shadow-lg transform rotate-[2deg] transition-transform hover:rotate-0 duration-300">
              <div className="relative w-48 h-48 mb-1 overflow-hidden">
                <video 
                  ref={videoRef}
                  src={generatedVideoUrl} 
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
            <div className="w-full mt-4 flex flex-col gap-2">
              <Button 
                className="flex-grow bg-animai-purple hover:bg-animai-lightpurple text-white"
                onClick={generateVideo}
                disabled={isGenerating || !uploadedImage}
              >
                {isGenerating ? generationStatus : "Generate Video"}
              </Button>
              {generatedVideoUrl && !generatedVideoUrl.includes("demo-video.mp4") && (
                <Button 
                  className="bg-animai-pink hover:bg-animai-pink/80 text-white"
                  onClick={downloadVideo}
                >
                  <Download className="w-4 h-4 mr-2" /> Save
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>;
};

export default CreatorInterface;
