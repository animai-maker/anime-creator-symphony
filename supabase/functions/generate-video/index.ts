
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fal.ai API settings
const FAL_API_URL = "https://api.fal.ai/v1";
const falApiKey = Deno.env.get("FAL_API_KEY");

// Get the Fal.ai API key from database
async function getFalApiKey(supabaseClient) {
  try {
    const { data, error } = await supabaseClient
      .from('app_settings')
      .select('value')
      .eq('key', 'fal_api_key')
      .single();
    
    if (error) {
      console.error("Error fetching API key:", error);
      return null;
    }
    
    return data?.value;
  } catch (error) {
    console.error("Error in getFalApiKey:", error);
    return null;
  }
}

serve(async (req) => {
  console.log("Edge function called with method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing video generation request");
    const requestBody = await req.json();
    console.log("Request body:", requestBody);
    
    const { prompt, imageUrl, aspectRatio, resolution, duration, loop } = requestBody;

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://guvekmyuzrcmplblidea.supabase.co';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    // Create Supabase client (we're in Deno, so we need to import it differently)
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.7.1');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get API key from environment or database
    let apiKey = falApiKey;
    if (!apiKey) {
      console.log("No API key in environment, fetching from database");
      apiKey = await getFalApiKey(supabase);
      if (!apiKey) {
        console.error("Fal.ai API key not found in either environment or database");
        return new Response(
          JSON.stringify({ error: "Fal.ai API key not found" }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log("Starting to submit job to Fal.ai");
    
    // Submit the image-to-video generation request
    const submitResponse = await fetch(`${FAL_API_URL}/queue/submit/fal-ai/luma-dream-machine/ray-2-flash/image-to-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${apiKey}`
      },
      body: JSON.stringify({
        input: {
          prompt,
          image_url: imageUrl,
          aspect_ratio: aspectRatio || "16:9",
          resolution: resolution || "540p",
          duration: duration || "5s",
          loop: loop || false,
        },
      }),
    });

    if (!submitResponse.ok) {
      const errorData = await submitResponse.json();
      console.error("Fal.ai submission error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to submit job to Fal.ai", details: errorData }),
        { status: submitResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { request_id } = await submitResponse.json();
    console.log("Job submitted to Fal.ai, request_id:", request_id);

    // Poll for status until complete
    let result = null;
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    let attempts = 0;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Checking status, attempt ${attempts}/${maxAttempts}`);
      
      const statusResponse = await fetch(`${FAL_API_URL}/queue/status/fal-ai/luma-dream-machine/ray-2-flash/image-to-video?request_id=${request_id}`, {
        headers: {
          'Authorization': `Key ${apiKey}`
        },
      });

      if (!statusResponse.ok) {
        const errorData = await statusResponse.json();
        console.error("Status check error:", errorData);
        return new Response(
          JSON.stringify({ error: "Failed to check job status", details: errorData }),
          { status: statusResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const status = await statusResponse.json();
      console.log("Status response:", status);

      if (status.status === "COMPLETED") {
        console.log("Job completed, fetching result");
        const resultResponse = await fetch(`${FAL_API_URL}/queue/result/fal-ai/luma-dream-machine/ray-2-flash/image-to-video?request_id=${request_id}`, {
          headers: {
            'Authorization': `Key ${apiKey}`
          },
        });

        if (!resultResponse.ok) {
          const errorData = await resultResponse.json();
          console.error("Result fetch error:", errorData);
          return new Response(
            JSON.stringify({ error: "Failed to fetch result", details: errorData }),
            { status: resultResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        result = await resultResponse.json();
        break;
      } else if (status.status === "FAILED" || status.status === "CANCELED") {
        const errorMessage = status.error?.message || "Unknown error";
        console.error("Job failed:", errorMessage);
        return new Response(
          JSON.stringify({ error: "Video generation failed", message: errorMessage }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Wait 5 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (!result) {
      console.error("Job timed out");
      return new Response(
        JSON.stringify({ error: "Video generation timed out" }),
        { status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Returning successful response with video URL");
    return new Response(
      JSON.stringify({ videoUrl: result.data.video.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred", message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
