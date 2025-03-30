
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { 
  Loader2, 
  Upload, 
  Music, 
  Video,
  CreditCard,
  Image,
  Play,
  FilmIcon
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

const CreateProject = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(40);
  const [loadingCredits, setLoadingCredits] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [animationPrompt, setAnimationPrompt] = useState("");
  const [soundPrompt, setSoundPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Example animation prompts
  const animationPrompts = [
    "The character looks at the sky and smiles",
    "The character turns their head and blinks",
    "The character's hair flows in the wind gently",
    "The character laughs heartily",
    "The character looks surprised and takes a step back"
  ];

  // Example sound prompts
  const soundPrompts = [
    "Soft piano melody with birds chirping",
    "Light orchestral music with wind sounds",
    "Dramatic orchestral build-up with violins",
    "Gentle acoustic guitar with rainfall",
    "Cheerful upbeat tune with bell sounds"
  ];

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log("User in create project:", session.user);
        setUser(session.user);
        fetchUserCredits(session.user.id);
      } else {
        navigate('/');
        toast.error("Please sign in to create a project");
      }
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setUser(session.user);
          fetchUserCredits(session.user.id);
        } else {
          setUser(null);
          navigate('/');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserCredits = async (userId: string) => {
    try {
      setLoadingCredits(true);
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user credits:', error);
        // Don't throw error, just continue with default credits
      }
      
      if (data) {
        setCredits(data.credits);
      }
    } catch (error: any) {
      console.error('Error fetching user credits:', error);
      // Don't show toast error, just continue with default credits
    } finally {
      setLoadingCredits(false);
    }
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnimationPromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnimationPrompt(e.target.value);
  };

  const handleSoundPromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSoundPrompt(e.target.value);
  };

  const handleAnimationPromptSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Animation prompt submitted:", animationPrompt);
  };

  const handleSoundPromptSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Sound prompt submitted:", soundPrompt);
  };

  const handleGenerate = () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }
    
    if (!animationPrompt) {
      toast.error("Please enter an animation prompt");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Animation generated successfully!");
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-animai">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-animai-purple" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-animai">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-animai-navy">Create New Animation</h1>
              <p className="text-gray-600">Turn your images into animated videos</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-5 py-3 flex items-center shadow-md">
              <CreditCard className="h-5 w-5 text-animai-purple mr-2" />
              <div>
                <span className="text-sm text-gray-600">Your Credits</span>
                <div className="font-bold text-xl text-animai-purple">
                  {loadingCredits ? (
                    <Loader2 className="h-4 w-4 animate-spin inline ml-2" />
                  ) : (
                    credits
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Upload Section */}
            <Card className="bg-white/90 backdrop-blur-sm overflow-hidden border-2 border-transparent">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-gray-100 rounded-md">
                    <Image className="h-6 w-6 text-animai-purple" />
                  </div>
                </div>
                <CardTitle>Upload Image</CardTitle>
                <CardDescription>Upload an image to animate</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  {uploadedImage ? (
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    onChange={handleUploadImage}
                    accept="image/*"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline"
                  className="w-full border-2 border-animai-purple text-animai-purple hover:bg-animai-purple hover:text-white"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadedImage ? 'Change Image' : 'Upload Image'}
                </Button>
                <input 
                  id="image-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleUploadImage}
                  accept="image/*"
                />
              </CardFooter>
            </Card>

            {/* Animate Section */}
            <Card className="bg-white/90 backdrop-blur-sm overflow-hidden border-2 border-transparent">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-gray-100 rounded-md">
                    <FilmIcon className="h-6 w-6 text-animai-pink" />
                  </div>
                </div>
                <CardTitle>Animation Prompt</CardTitle>
                <CardDescription>Describe how you want your image to be animated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="mt-2">
                    <PlaceholdersAndVanishInput
                      placeholders={animationPrompts}
                      onChange={handleAnimationPromptChange}
                      onSubmit={handleAnimationPromptSubmit}
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="mb-2 text-sm font-medium">Sound Effect</p>
                  <div className="mt-2">
                    <PlaceholdersAndVanishInput
                      placeholders={soundPrompts}
                      onChange={handleSoundPromptChange}
                      onSubmit={handleSoundPromptSubmit}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleGenerate}
                  className="w-full bg-animai-purple hover:bg-animai-lightpurple text-white"
                  disabled={!uploadedImage || !animationPrompt || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Generate Animation
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Preview Section */}
            <Card className="bg-white/90 backdrop-blur-sm overflow-hidden border-2 border-transparent">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-gray-100 rounded-md">
                    <Video className="h-6 w-6 text-animai-purple" />
                  </div>
                </div>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Preview your animated creation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full aspect-square rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                  <div className="text-center p-4">
                    <Play className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Your animation will appear here</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="border-animai-purple text-animai-purple"
                  disabled={true}
                >
                  <Music className="h-4 w-4 mr-2" />
                  Add Sound
                </Button>
                <Button 
                  variant="outline" 
                  className="border-animai-purple text-animai-purple"
                  disabled={true}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateProject;
