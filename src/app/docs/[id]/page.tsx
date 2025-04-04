import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import DocumentEditor from '@/components/DocumentEditor';

export default async function DocumentPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  const { data: document, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-red-600 text-xl font-semibold mb-4">Error Loading Document</h1>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-gray-900 text-xl font-semibold mb-4">Document Not Found</h1>
            <p className="text-gray-600">The document you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{document.title}</h1>
          <div className="bg-white rounded-lg shadow">
            <DocumentEditor document={document} />
          </div>
        </div>
      </div>
    </div>
  );
} 