import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local demo user state helper
const DEMO_USER_KEY = 'ai_scam_guardian_demo_user';

export function getLocalDemoUser() {
  try {
    const raw = localStorage.getItem(DEMO_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function setLocalDemoUser(user: { id: string; email: string; fullName: string }) {
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
}

export function clearLocalDemoUser() {
  localStorage.removeItem(DEMO_USER_KEY);
}
