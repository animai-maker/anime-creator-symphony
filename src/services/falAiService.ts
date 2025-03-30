
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ImageToVideoOptions {
  prompt: string;
  imageUrl: string;
  aspectRatio?: "16:9" | "9:16" | "4:3" | "3:4" | "21:9" | "9:21";
  resolution?: "540p" | "720p" | "1080p";
  duration?: "5s";
  loop?: boolean;
}

// Define a proper type for the status response
type QueueStatus = "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "CANCELED";

interface QueueStatusResponse {
  status: QueueStatus;
  error?: {
    message: string;
  };
}

export const generateVideoFromImage = async (
  options: ImageToVideoOptions,
  onStatusUpdate?: (status: string) => void
) => {
  try {
    // Show toast notification
    toast.info("Starting video generation, this may take a few minutes...");
    
    if (onStatusUpdate) {
      onStatusUpdate("Generating video...");
    }

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-video', {
      body: options
    });

    if (error) {
      console.error("Error calling edge function:", error);
      toast.error("Failed to generate video: " + (error.message || "Unknown error"));
      throw error;
    }

    if (onStatusUpdate) {
      onStatusUpdate("Video generation complete!");
    }

    return data.videoUrl;
  } catch (error: any) {
    console.error("Error generating video:", error);
    toast.error("Failed to generate video: " + (error.message || "Unknown error"));
    throw error;
  }
};
