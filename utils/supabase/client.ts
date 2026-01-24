import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = "https://amsvlqivarurifjhboef.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtc3ZscWl2YXJ1cmlmamhib2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5OTcyNDQsImV4cCI6MjA4MjU3MzI0NH0.8gUoh_l8MavbWlxQvyGkbWgSTCLq96_jvVdKgeD1jAE";

// Simple client for API routes (server-side)
export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

interface CookieOptions {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

// Singleton browser client for auth
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export const createClient = () => {
  if (browserClient) return browserClient;

  browserClient = createBrowserClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        if (typeof document !== "undefined") {
          const value = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${name}=`))
            ?.split("=")[1];
          return value ? decodeURIComponent(value) : null;
        }
        return null;
      },
      set(name: string, value: string, options: CookieOptions) {
        if (typeof document !== "undefined") {
          let cookie = `${name}=${encodeURIComponent(value)}`;
          if (options?.maxAge) cookie += `; max-age=${options.maxAge}`;
          if (options?.path) cookie += `; path=${options.path}`;
          if (options?.domain) cookie += `; domain=${options.domain}`;
          if (options?.secure) cookie += "; secure";
          if (options?.sameSite) cookie += `; samesite=${options.sameSite}`;
          document.cookie = cookie;
        }
      },
      remove(name: string, options: CookieOptions) {
        if (typeof document !== "undefined") {
          let cookie = `${name}=; max-age=0`;
          if (options?.path) cookie += `; path=${options.path}`;
          if (options?.domain) cookie += `; domain=${options.domain}`;
          document.cookie = cookie;
        }
      },
    },
  });

  return browserClient;
};
