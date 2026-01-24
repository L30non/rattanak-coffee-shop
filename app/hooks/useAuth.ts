"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import type {
  User as SupabaseUser,
  AuthChangeEvent,
  Session,
} from "@supabase/supabase-js";
import { useStore, type User } from "@/app/store/useStore";

const supabase = createClient();

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const setUser = useStore((state) => state.setUser);
  const user = useStore((state) => state.user);

  const syncUserProfile = useCallback(
    async (supabaseUser: SupabaseUser) => {
      // Fetch profile from database
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();

      const appUser: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        name:
          profile?.name ||
          supabaseUser.user_metadata?.name ||
          supabaseUser.email?.split("@")[0] ||
          "",
        is_admin: profile?.is_admin || false,
        created_at: supabaseUser.created_at,
      };

      setUser(appUser);
    },
    [setUser],
  );

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setSupabaseUser(session.user);
        await syncUserProfile(session.user);
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          setSupabaseUser(session.user);
          await syncUserProfile(session.user);
        } else {
          setSupabaseUser(null);
          setUser(null);
        }
        setLoading(false);
      },
    );

    return () => subscription.unsubscribe();
  }, [setUser, syncUserProfile]);

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
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
    const { error } = await supabase.auth.signOut();

    // Clear user state regardless of Supabase error
    setUser(null);
    setSupabaseUser(null);

    // Clear persisted storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("coffee-shop-storage");
    }

    setLoading(false);
    return { success: !error, error: error?.message };
  };

  return {
    user,
    supabaseUser,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
}
