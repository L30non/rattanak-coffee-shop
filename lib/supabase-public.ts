import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

let publicClient: ReturnType<typeof createSupabaseClient> | null = null;

// Cookie-less client for public reads in Server Components — avoids
// opting pages into dynamic rendering just to read public product data.
export const createPublicClient = () => {
  if (!publicClient) {
    publicClient = createSupabaseClient(supabaseUrl!, supabaseKey!);
  }
  return publicClient;
};
