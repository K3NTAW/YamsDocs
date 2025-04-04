import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to YamsDocs
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          A simple and powerful documentation platform where you can create, edit,
          and share your documentation with your team.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/docs"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            View Documents
          </Link>
          <Link
            href="/docs/new"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Create New Document <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900">For Viewers</h2>
          <p className="mt-2 text-gray-600">
            Browse through documentation, search for specific topics, and stay
            up-to-date with the latest changes.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900">For Editors</h2>
          <p className="mt-2 text-gray-600">
            Create and edit documentation using Markdown, manage document versions,
            and collaborate with your team.
          </p>
        </div>
      </div>
    </div>
  );
}
