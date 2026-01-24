import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// Singleton browser client for client-side usage
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export const createClient = () => {
  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl!, supabaseKey!);
  }
  return browserClient;
};

// Reset client (useful for sign out)
export const resetBrowserClient = () => {
  browserClient = null;
};

// Export a singleton instance for convenience
export const supabase = createClient();

// Storage helper functions
export const uploadImage = async (
  file: File,
): Promise<{ path: string | null; error: string | null }> => {
  try {
    const client = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await client.storage
      .from("Images")
      .upload(filePath, file);

    if (uploadError) {
      return { path: null, error: uploadError.message };
    }

    return { path: filePath, error: null };
  } catch (err) {
    return {
      path: null,
      error: err instanceof Error ? err.message : "Upload failed",
    };
  }
};

export const getImageUrl = (path: string | null | undefined): string | null => {
  if (!path || path.trim() === "") return null;

  // If it's already a full URL, return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // If it's a local public path (e.g., /images/...), return as-is
  if (path.startsWith("/")) {
    return path;
  }

  // Otherwise, it's a Supabase Storage path - get public URL
  const client = createClient();
  const { data } = client.storage.from("Images").getPublicUrl(path);
  return data?.publicUrl || null;
};
