"use client";

import { useState, useEffect } from 'react';
import { updateDocument } from '@/app/actions/document';

interface DocumentEditorProps {
  document: {
    id: string;
    title: string;
    content: string;
  };
}

export default function DocumentEditor({ document }: DocumentEditorProps) {
  const [content, setContent] = useState(document.content);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (content !== document.content) {
        setIsSaving(true);
        setError(null);
        try {
          await updateDocument(document.id, content);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to save document');
        } finally {
          setIsSaving(false);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [content, document.id]);

  return (
    <div className="p-6">
      <div className="mb-4">
        {isSaving && <p className="text-sm text-gray-500">Saving...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <textarea
        className="w-full h-[calc(100vh-300px)] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing your document..."
      />
    </div>
  );
} 