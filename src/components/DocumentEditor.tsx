"use client";

import { useState, useRef, useEffect } from "react";
import { Document } from "@/types/supabase";

interface DocumentEditorProps {
  document: Document;
  onSave: (content: string) => Promise<void>;
}

export default function DocumentEditor({ document: doc, onSave }: DocumentEditorProps) {
  const [content, setContent] = useState(doc.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashPosition, setSlashPosition] = useState({ x: 0, y: 0 });
  const editorRef = useRef<HTMLDivElement>(null);

  const slashCommands = [
    { command: "/h1", label: "Heading 1", action: () => insertMarkdown("# ") },
    { command: "/h2", label: "Heading 2", action: () => insertMarkdown("## ") },
    { command: "/h3", label: "Heading 3", action: () => insertMarkdown("### ") },
    { command: "/bullet", label: "Bullet List", action: () => insertMarkdown("- ") },
    { command: "/number", label: "Numbered List", action: () => insertMarkdown("1. ") },
    { command: "/quote", label: "Quote", action: () => insertMarkdown("> ") },
    { command: "/code", label: "Code Block", action: () => insertMarkdown("```\n\n```") },
    { command: "/divider", label: "Divider", action: () => insertMarkdown("---\n") },
  ];

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setContent(target.innerText);
    
    // Check for slash command
    const text = target.innerText;
    const lastChar = text[text.length - 1];
    
    if (lastChar === "/") {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSlashPosition({ x: rect.left, y: rect.bottom });
        setShowSlashMenu(true);
      }
    } else {
      setShowSlashMenu(false);
    }
  };

  const insertMarkdown = (markdown: string) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(markdown);
        range.insertNode(textNode);
        setContent(editorRef.current.innerText);
        setShowSlashMenu(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && showSlashMenu) {
      e.preventDefault();
      const selectedCommand = slashCommands[0]; // You can implement command selection
      selectedCommand.action();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(content);
    } catch (error) {
      console.error("Failed to save document:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save after 2 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== doc.content) {
        handleSave();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [content]);

  return (
    <div className="relative min-h-screen p-8">
      <div
        ref={editorRef}
        contentEditable
        className="prose prose-lg max-w-none focus:outline-none"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {showSlashMenu && (
        <div
          className="absolute bg-white shadow-lg rounded-lg border border-gray-200 py-1 z-50"
          style={{ top: slashPosition.y, left: slashPosition.x }}
        >
          {slashCommands.map((cmd) => (
            <button
              key={cmd.command}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => cmd.action()}
            >
              {cmd.label}
            </button>
          ))}
        </div>
      )}

      <div className="fixed bottom-4 right-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
} 