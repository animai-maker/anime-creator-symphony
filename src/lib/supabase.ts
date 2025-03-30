
import { createClient } from '@supabase/supabase-js';

// Use the real project credentials
const supabaseUrl = 'https://guvekmyuzrcmplblidea.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1dmVrbXl1enJjbXBsYmxpZGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMDYzNDcsImV4cCI6MjA1ODg4MjM0N30.CeAKQu_klI55AEPHiEM4m46xxA7YmuLUGTuQM5u6NKs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

