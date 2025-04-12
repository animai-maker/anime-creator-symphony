import { Button } from "@/components/ui/button";
import { Check, CircleDollarSign, Gift, Music, Mic, Image, Video, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export interface PricingTier {
    name: string;
    icon: React.ReactNode;
    price: number;
    creditAmount: string;
    description: string;
    bonusCredits?: string;
    features: string[];
    popular?: boolean;
    color: string;
    discount?: string;
    planId?: string;
}

function CreativePricing({
    tag = "🌸 Animai Pricing",
    title = "Create cinematic anime videos",
    description = "with flexible, affordable plans. Only pay for what you create.",
    tiers,
    creditInfo,
    signupFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdMBgOyP2toCDKGPRZ0Dl0iVkb-eeZJ3hnkxnqI71UPzzWoTQ/viewform?usp=sharing"
}: {
    tag?: string;
    title?: string;
    description?: string;
    tiers: PricingTier[];
    creditInfo?: React.ReactNode;
    signupFormUrl?: string;
}) {
    const { initiateCheckout, isLoading } = useStripeCheckout();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await supabase.auth.getSession();
            setIsAuthenticated(!!data.session);
        };
        
        checkAuth();
        
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setIsAuthenticated(!!session);
            }
        );
        
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleGetStarted = (tier: PricingTier) => {
        if (tier.planId) {
            if (!isAuthenticated) {
                toast.error("Please sign in to purchase credits");
                return;
            }
            
            initiateCheckout(tier.planId);
        } else {
            window.open(signupFormUrl, "_blank");
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-16">
            <div className="text-center space-y-6 mb-12">
                <div className="font-bold text-xl text-animai-purple">
                    {tag}
                </div>
                <div className="relative">
                    <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white">
                        {title}
                        <div className="absolute -right-12 top-0 text-amber-500 rotate-12">
                            ✨
                        </div>
                        <div className="absolute -left-8 bottom-0 text-animai-pink -rotate-12">
                            ⭐️
                        </div>
                    </h2>
                    <div
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-44 h-3 bg-animai-purple/20 
                        rotate-[-1deg] rounded-full blur-sm"
                    />
                </div>
                <p className="text-xl text-zinc-600 dark:text-zinc-400">
                    {description}
                </p>
            </div>

            {creditInfo && (
                <div className="mb-16 max-w-3xl mx-auto bg-white/80 dark:bg-zinc-800/80 rounded-xl p-6 border-2 border-animai-purple/30 shadow-lg">
                    {creditInfo}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {tiers.map((tier, index) => (
                    <div
                        key={tier.name}
                        className={cn(
                            "relative group transition-all duration-300",
                            index === 0 && "md:col-span-1 rotate-[-1deg]",
                            index === 1 && "md:col-span-1 rotate-[1deg]",
                            index === 2 && "md:col-span-1 rotate-[-2deg]",
                            index === 3 && "md:col-span-1 rotate-[2deg]"
                        )}
                    >
                        <div
                            className={cn(
                                "absolute inset-0 bg-white dark:bg-zinc-900",
                                "border-2",
                                tier.popular 
                                    ? "border-animai-pink dark:border-animai-pink" 
                                    : "border-animai-purple/70 dark:border-animai-purple/70",
                                "rounded-lg shadow-[4px_4px_0px_0px]",
                                tier.popular 
                                    ? "shadow-animai-pink dark:shadow-animai-pink" 
                                    : "shadow-animai-purple/70 dark:shadow-animai-purple/70",
                                "transition-all duration-300",
                                "group-hover:shadow-[8px_8px_0px_0px]",
                                "group-hover:translate-x-[-4px]",
                                "group-hover:translate-y-[-4px]"
                            )}
                        />

                        <div className="relative p-6">
                            {tier.popular && (
                                <div
                                    className="absolute -top-2 -right-2 bg-animai-pink text-white 
                                    px-3 py-1 rounded-full rotate-12 text-sm font-semibold border-2 border-white"
                                >
                                    Most Popular!
                                </div>
                            )}

                            {tier.discount && (
                                <div
                                    className="absolute -top-2 -left-2 bg-animai-purple text-white 
                                    px-3 py-1 rounded-full -rotate-12 text-sm font-semibold border-2 border-white"
                                >
                                    {tier.discount}
                                </div>
                            )}

                            <div className="mb-6">
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-full mb-4",
                                        "flex items-center justify-center",
                                        "border-2",
                                        tier.popular 
                                            ? "border-animai-pink text-animai-pink" 
                                            : "border-animai-purple text-animai-purple"
                                    )}
                                >
                                    {tier.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                                    {tier.name}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 h-12">
                                    {tier.description}
                                </p>
                            </div>

                            <div className="mb-2">
                                <div className="flex items-end">
                                    <span className="text-4xl font-bold text-zinc-900 dark:text-white">
                                        ${tier.price}
                                    </span>
                                </div>
                                <div className="text-lg font-semibold text-animai-purple">
                                    💠 {tier.creditAmount}
                                </div>
                                {tier.bonusCredits && (
                                    <div className="text-sm text-animai-pink">
                                        🎁 {tier.bonusCredits}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 mb-6 min-h-[180px]">
                                {tier.features.map((feature) => (
                                    <div
                                        key={feature}
                                        className="flex items-start gap-3"
                                    >
                                        <div
                                            className={cn(
                                                "w-5 h-5 mt-1 rounded-full flex items-center justify-center",
                                                tier.popular 
                                                    ? "bg-animai-pink text-white" 
                                                    : "bg-animai-purple text-white"
                                            )}
                                        >
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="text-sm text-zinc-900 dark:text-white">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                onClick={() => handleGetStarted(tier)}
                                disabled={isLoading && tier.planId !== undefined}
                                className={cn(
                                    "w-full h-12 text-lg font-semibold relative",
                                    "border-2",
                                    "transition-all duration-300",
                                    "shadow-[4px_4px_0px_0px]",
                                    "hover:shadow-[6px_6px_0px_0px]",
                                    "hover:translate-x-[-2px] hover:translate-y-[-2px]",
                                    tier.popular
                                        ? [
                                              "border-animai-pink shadow-animai-pink",
                                              "bg-animai-pink text-white",
                                              "hover:bg-animai-pink/90",
                                              "active:bg-animai-pink",
                                          ]
                                        : [
                                              "border-animai-purple shadow-animai-purple",
                                              "bg-animai-purple text-white",
                                              "hover:bg-animai-purple/90",
                                              "active:bg-animai-purple",
                                          ]
                                )}
                            >
                                {isLoading && tier.planId ? (
                                    <span className="flex items-center justify-center">
                                        <span className="animate-spin mr-2">
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </span>
                                        Processing...
                                    </span>
                                ) : (
                                    'Get Started'
                                )}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-16 text-center">
                <h3 className="text-2xl font-bold mb-4">✨ Need More?</h3>
                <p className="text-lg mb-6 max-w-2xl mx-auto">
                    Custom enterprise packages available for studios, educators, and game devs.
                </p>
                <a 
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdMBgOyP2toCDKGPRZ0Dl0iVkb-eeZJ3hnkxnqI71UPzzWoTQ/viewform?usp=sharing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    <Button 
                        variant="outline" 
                        className="border-2 border-animai-purple text-animai-purple hover:text-white hover:bg-animai-purple"
                    >
                        Contact Us for a tailored plan
                    </Button>
                </a>
            </div>
        </div>
    );
}

export { CreativePricing };
