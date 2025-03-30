
import { createClient } from '@supabase/supabase-js';

// Provide fallback values for development/testing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjE2NDE0MCwiZXhwIjoxOTMxNzQwMTQwfQ.OQEbAaTfgDdLCCht_zzQOhh42D1Q6qxbxCpNB7WI0iU';

// Log a reminder message about setting up real credentials
console.warn('Using placeholder Supabase credentials. For production, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
