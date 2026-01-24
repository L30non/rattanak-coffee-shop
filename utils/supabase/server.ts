import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = "https://amsvlqivarurifjhboef.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtc3ZscWl2YXJ1cmlmamhib2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5OTcyNDQsImV4cCI6MjA4MjU3MzI0NH0.8gUoh_l8MavbWlxQvyGkbWgSTCLq96_jvVdKgeD1jAE";

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};
