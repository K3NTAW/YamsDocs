"use server";

import { createClient } from '@/lib/supabase-server';

export async function updateDocument(id: string, content: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('documents')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
} 