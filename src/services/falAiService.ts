
import { fal } from "@fal-ai/client";
import { toast } from "sonner";

// Configure fal.ai client - in a production app, this should be handled by a server
// For this demo, we'll configure it directly in the client
const configureFalClient = (apiKey: string) => {
  fal.config({
    credentials: apiKey,
  });
};

interface ImageToVideoOptions {
  prompt: string;
  imageUrl: string;
  aspectRatio?: "16:9" | "9:16" | "4:3" | "3:4" | "21:9" | "9:21";
  resolution?: "540p" | "720p" | "1080p";
  duration?: "5s";
  loop?: boolean;
}

export const generateVideoFromImage = async (
  options: ImageToVideoOptions,
  onStatusUpdate?: (status: string) => void
) => {
  try {
    const { prompt, imageUrl, aspectRatio = "16:9", resolution = "540p", duration = "5s", loop = false } = options;

    // Show toast notification
    toast.info("Starting video generation, this may take a few minutes...");
    
    if (onStatusUpdate) {
      onStatusUpdate("Generating video...");
    }

    // Submit the image-to-video generation request
    const { request_id } = await fal.queue.submit("fal-ai/luma-dream-machine/ray-2-flash/image-to-video", {
      input: {
        prompt,
        image_url: imageUrl,
        aspect_ratio: aspectRatio,
        resolution,
        duration,
        loop,
      },
    });

    if (onStatusUpdate) {
      onStatusUpdate("Video generation in progress...");
    }

    // Poll for status until complete
    let result = null;
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    let attempts = 0;

    while (attempts < maxAttempts) {
      attempts++;
      const status = await fal.queue.status("fal-ai/luma-dream-machine/ray-2-flash/image-to-video", {
        requestId: request_id,
        logs: true,
      });

      if (status.status === "COMPLETED") {
        result = await fal.queue.result("fal-ai/luma-dream-machine/ray-2-flash/image-to-video", {
          requestId: request_id,
        });
        break;
      } else if (status.status === "FAILED") {
        // Fixed: Using correct error property access pattern
        const errorMessage = status.error?.message || "Unknown error";
        throw new Error("Video generation failed: " + errorMessage);
      }

      // Wait 5 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (!result) {
      throw new Error("Video generation timed out");
    }

    if (onStatusUpdate) {
      onStatusUpdate("Video generation complete!");
    }

    return result.data.video.url;
  } catch (error) {
    console.error("Error generating video:", error);
    toast.error("Failed to generate video: " + (error.message || "Unknown error"));
    throw error;
  }
};

export { configureFalClient };
