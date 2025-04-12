
-- Create table for tracking user credits
CREATE TABLE IF NOT EXISTS public.user_credits (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL DEFAULT 40,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create table for tracking payment history
CREATE TABLE IF NOT EXISTS public.payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  credits INTEGER NOT NULL,
  plan_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own credits
CREATE POLICY "Users can view their own credits" 
  ON public.user_credits
  FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to view their own payment history
CREATE POLICY "Users can view their own payment history" 
  ON public.payment_history
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create a trigger to add credits when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_credits (id, credits)
  VALUES (NEW.id, 40);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_credits();
