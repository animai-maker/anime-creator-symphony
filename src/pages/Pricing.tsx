
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CircleDollarSign, Gift, Music, Mic, Image, Video, Sparkles, Star } from "lucide-react";
import { CreativePricing } from "@/components/ui/creative-pricing";

const CreditInfo = () => (
  <div>
    <h3 className="text-2xl font-bold mb-4 text-animai-navy">🧧 Credit System</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 flex-shrink-0 bg-animai-purple/10 rounded-full flex items-center justify-center">
          <Video className="w-5 h-5 text-animai-purple" />
        </div>
        <div>
          <p className="font-semibold">🎬 Video Generation</p>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">15 credits per video</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 flex-shrink-0 bg-animai-purple/10 rounded-full flex items-center justify-center">
          <Music className="w-5 h-5 text-animai-purple" />
        </div>
        <div>
          <p className="font-semibold">🎧 Sound Effect / Music Generation</p>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">5 credits per sound</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 flex-shrink-0 bg-animai-purple/10 rounded-full flex items-center justify-center">
          <Mic className="w-5 h-5 text-animai-purple" />
        </div>
        <div>
          <p className="font-semibold">🎙️ Voiceover / Dialogue Generation</p>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Free with video</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 flex-shrink-0 bg-animai-purple/10 rounded-full flex items-center justify-center">
          <Image className="w-5 h-5 text-animai-purple" />
        </div>
        <div>
          <p className="font-semibold">🖼️ Image Uploads</p>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Unlimited</p>
        </div>
      </div>
    </div>
  </div>
);

const pricingTiers = [
  {
    name: "Free",
    icon: <Gift className="w-6 h-6" />,
    price: 0,
    creditAmount: "40 credits",
    description: "to get started",
    color: "blue",
    features: [
      "Create starter anime videos",
      "Basic animation styles",
      "720p export quality",
      "Watermarked exports",
    ],
  },
  {
    name: "Starter",
    icon: <Star className="w-6 h-6" />,
    price: 10,
    creditAmount: "200 credits",
    description: "Great for personal projects and creative exploration",
    color: "blue",
    discount: "Save 20%",
    features: [
      "Create personal anime videos",
      "Standard animation styles",
      "720p export quality",
      "No watermarks",
      "Standard render priority",
    ],
  },
  {
    name: "Pro",
    icon: <Sparkles className="w-6 h-6" />,
    price: 25,
    creditAmount: "600 credits",
    bonusCredits: "+100 bonus credits",
    description: "For creators who publish regularly",
    color: "purple",
    popular: true,
    features: [
      "Standard animation styles",
      "Priority rendering",
      "HD export quality",
      "No watermarks",
      "Email support",
    ],
  },
  {
    name: "Studio",
    icon: <CircleDollarSign className="w-6 h-6" />,
    price: 60,
    creditAmount: "1600 credits",
    bonusCredits: "+400 bonus credits",
    description: "Team collaboration",
    color: "purple",
    features: [
      "Early access to new styles",
      "Team collaboration",
      "Custom voice packs",
      "Priority support",
      "4K export quality",
    ],
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-animai">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4">
          <CreativePricing 
            tiers={pricingTiers} 
            creditInfo={<CreditInfo />}
          />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Pricing;
