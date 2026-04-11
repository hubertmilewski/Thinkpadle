"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    getInitialSession();

    const lastUserIdRef = { current: undefined as string | undefined };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        const currentUserId = session?.user?.id;
        const prevUserId = lastUserIdRef.current;
        
        if (currentUserId !== prevUserId) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (prevUserId !== undefined) {
             if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
               if (event === "SIGNED_OUT") {
                 const { clearGameState } = require("@/lib/storage");
                 clearGameState();
               }
               if (!(window as any).__SKIP_AUTH_RELOAD) {
                 window.location.reload();
               }
             }
          }
        }
        
        setIsLoading(false);
        lastUserIdRef.current = currentUserId;
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
