
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
  Type, 
  Music, 
  Video,
  CreditCard
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const CreateProject = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(40);
  const [loadingCredits, setLoadingCredits] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

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
      
      if (error) throw error;
      
      if (data) {
        setCredits(data.credits);
      }
    } catch (error: any) {
      console.error('Error fetching user credits:', error);
      toast.error('Could not fetch your credits. Please refresh the page.');
    } finally {
      setLoadingCredits(false);
    }
  };

  const projectOptions = [
    {
      id: 'video',
      title: 'Video Animation',
      icon: <Video className="h-10 w-10 text-animai-purple" />,
      description: 'Generate a full anime-style animated video',
      credits: 15
    },
    {
      id: 'character',
      title: 'Character Design',
      icon: <Type className="h-10 w-10 text-animai-pink" />,
      description: 'Create a custom anime character with detailed features',
      credits: 5
    },
    {
      id: 'music',
      title: 'Music Generation',
      icon: <Music className="h-10 w-10 text-animai-purple" />,
      description: 'Generate custom background music for your anime',
      credits: 5
    },
    {
      id: 'assets',
      title: 'Scene Assets',
      icon: <Upload className="h-10 w-10 text-animai-pink" />,
      description: 'Create backgrounds and environment elements',
      credits: 8
    }
  ];

  const handleCreateProject = (type: string) => {
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }
    
    // Get the credits required for this project type
    const projectType = projectOptions.find(option => option.id === type);
    const requiredCredits = projectType?.credits || 0;
    
    if (credits < requiredCredits) {
      toast.error(`Not enough credits! You need ${requiredCredits} credits for this project.`);
      return;
    }
    
    toast.success(`Started new ${projectType?.title} project: ${projectName}`);
    // In a real app, you would create the project in the database and deduct credits
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
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-animai-navy">Create New Project</h1>
              <p className="text-gray-600">Choose a project type to get started</p>
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

          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8">
            <div className="mb-6">
              <Label htmlFor="project-name">Project Name</Label>
              <Input 
                id="project-name" 
                placeholder="Enter your project name" 
                className="mt-1"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            
            <div className="mb-6">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                placeholder="Describe your project" 
                className="mt-1"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {projectOptions.map(option => (
              <Card key={option.id} className="overflow-hidden border-2 border-transparent hover:border-animai-purple/30 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-gray-100 rounded-md">
                      {option.icon}
                    </div>
                    <div className="flex items-center px-3 py-1 bg-animai-purple/10 rounded-full">
                      <CreditCard className="h-4 w-4 text-animai-purple mr-1" />
                      <span className="text-sm font-semibold text-animai-purple">{option.credits} credits</span>
                    </div>
                  </div>
                  <CardTitle className="mt-2">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500 space-y-2">
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-animai-purple/20 flex items-center justify-center text-animai-purple mr-2 mt-0.5">✓</div>
                      <span>High-quality output</span>
                    </div>
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-animai-purple/20 flex items-center justify-center text-animai-purple mr-2 mt-0.5">✓</div>
                      <span>Full customization</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleCreateProject(option.id)}
                    className="w-full bg-animai-purple hover:bg-animai-lightpurple"
                    disabled={credits < option.credits}
                  >
                    {credits < option.credits ? 'Not Enough Credits' : 'Start Project'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">Need more credits to create your project?</p>
            <Button 
              onClick={() => navigate('/pricing')} 
              variant="outline" 
              className="border-2 border-animai-purple text-animai-purple hover:bg-animai-purple hover:text-white"
            >
              Get More Credits
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateProject;
