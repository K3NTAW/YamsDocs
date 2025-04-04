"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { Document } from "@/types/supabase";
import DocumentEditor from "@/components/DocumentEditor";

export default function DocumentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDocument() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/auth/signin");
          return;
        }

        const { data, error } = await supabase
          .from("documents")
          .select("*, profiles(name, avatar_url)")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        setDocument(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load document");
      } finally {
        setLoading(false);
      }
    }

    loadDocument();
  }, [params.id]);

  const handleSave = async (content: string) => {
    try {
      const { error } = await supabase
        .from("documents")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", params.id);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save document");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || "Document not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DocumentEditor document={document} onSave={handleSave} />
    </div>
  );
} 