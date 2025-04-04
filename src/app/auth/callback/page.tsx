"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        router.push("/auth/signin");
        return;
      }

      if (session?.user) {
        // Check if profile exists
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (!profile) {
          // Create profile if it doesn't exist
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: session.user.id,
                name: session.user.user_metadata.name || session.user.email?.split("@")[0],
                email: session.user.email,
              },
            ]);

          if (profileError) {
            console.error("Error creating profile:", profileError);
          }
        }

        router.push("/docs");
      }
    };

    handleCallback();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Signing you in...</h1>
        <p className="mt-2 text-gray-600">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
} 