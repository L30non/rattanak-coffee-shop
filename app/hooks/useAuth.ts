"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient, resetBrowserClient } from "@/utils/supabase/client";
import type {
  User as SupabaseUser,
  AuthChangeEvent,
  Session,
} from "@supabase/supabase-js";
import { useStore, type User } from "@/app/store/useStore";

// Profile type from database
interface Profile {
  id: string;
  email: string;
  name: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const setUser = useStore((state) => state.setUser);
  const user = useStore((state) => state.user);
  const isMounted = useRef(true);

  const syncUserProfile = useCallback(
    async (supabaseUser: SupabaseUser) => {
      try {
        const supabase = createClient();
        // Fetch profile from database
        const { data: profile } = (await supabase
          .from("profiles")
          .select("*")
          .eq("id", supabaseUser.id)
          .single()) as { data: Profile | null };

        if (!isMounted.current) return;

        const appUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || "",
          name:
            profile?.name ||
            supabaseUser.user_metadata?.name ||
            supabaseUser.email?.split("@")[0] ||
            "",
          is_admin: profile?.is_admin === true,
          created_at: supabaseUser.created_at,
        };

        setUser(appUser);
      } catch (err) {
        // Silently handle abort errors
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        console.error("Profile sync error:", err);
      }
    },
    [setUser],
  );

  useEffect(() => {
    isMounted.current = true;

    // Get initial session
    const getSession = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (isMounted.current && session?.user) {
          setSupabaseUser(session.user);
          await syncUserProfile(session.user);
        }
      } catch (err) {
        if (!(err instanceof Error && err.name === "AbortError")) {
          console.error("Get session error:", err);
        }
      }
      if (isMounted.current) {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes - NOT async to avoid abort issues
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (!isMounted.current) return;

        if (session?.user) {
          setSupabaseUser(session.user);
          // Don't await - run in background
          syncUserProfile(session.user);
        } else {
          setSupabaseUser(null);
          setUser(null);
        }
        setLoading(false);
      },
    );

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, [setUser, syncUserProfile]);

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }

    setLoading(false);
    return { success: true, data };
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }

    setLoading(false);
    return { success: true, data };
  };

  const signOut = async () => {
    setLoading(true);

    // Clear user state first
    setUser(null);
    setSupabaseUser(null);

    // Clear persisted storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("coffee-shop-storage");
      // Clear Supabase auth tokens
      Object.keys(localStorage)
        .filter((k) => k.startsWith("sb-") || k === "supabase-auth")
        .forEach((k) => localStorage.removeItem(k));
    }

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      // Ignore abort errors
      if (!(err instanceof Error && err.name === "AbortError")) {
        console.error("Sign out error:", err);
      }
    }

    // Reset the browser client singleton
    resetBrowserClient();

    setLoading(false);
    return { success: true, error: undefined };
  };

  const updateProfile = async (name: string, email?: string) => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Update auth user email if provided
      if (email && email !== supabaseUser?.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email,
        });

        if (authError) {
          setLoading(false);
          return { success: false, error: authError.message };
        }
      }

      // Update profile in database
      if (supabaseUser) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ name, updated_at: new Date().toISOString() })
          .eq("id", supabaseUser.id);

        if (profileError) {
          setLoading(false);
          return { success: false, error: profileError.message };
        }

        // Sync updated profile
        await syncUserProfile(supabaseUser);
      }

      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update profile",
      };
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    setLoading(true);
    try {
      const supabase = createClient();

      // First, verify current password by attempting to re-authenticate
      if (supabaseUser?.email) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: supabaseUser.email,
          password: currentPassword,
        });

        if (authError) {
          setLoading(false);
          return { success: false, error: "Current password is incorrect" };
        }
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setLoading(false);
        return { success: false, error: updateError.message };
      }

      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to change password",
      };
    }
  };

  return {
    user,
    supabaseUser,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
  };
}
