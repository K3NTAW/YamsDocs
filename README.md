# YamsDocs

A modern documentation platform built with Next.js, Supabase, and Tailwind CSS.

## Features

- 📝 Create and manage documentation
- 🔒 User authentication with Supabase
- 👥 User profiles with avatars
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

## Prerequisites

- Node.js 18.17.1 or later
- npm 9.6.7 or later
- A Supabase account and project

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/yams-docs.git
cd yams-docs
```

2. Install dependencies:

```bash
npm install
```

3. Set up your Supabase project:
   - Create a new project at https://supabase.com
   - Create the following tables in your Supabase database:

```sql
-- Create a table for user profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  avatar_url text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for documents
create table documents (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text,
  published boolean default false,
  author_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up row level security
alter table profiles enable row level security;
alter table documents enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

create policy "Anyone can view published documents"
  on documents for select
  using ( published = true or auth.uid() = author_id );

create policy "Authenticated users can create documents"
  on documents for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update own documents"
  on documents for update
  using ( auth.uid() = author_id );

create policy "Users can delete own documents"
  on documents for delete
  using ( auth.uid() = author_id );
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   │   ├── signin/        # Sign in page
│   │   ├── signup/        # Sign up page
│   │   └── verify-email/  # Email verification page
│   ├── docs/             # Document pages
│   │   ├── [id]/         # Individual document page
│   │   └── new/          # New document page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── Navbar.tsx       # Navigation bar
│   └── SessionProvider.tsx # Auth session provider
└── lib/                 # Utility functions
    ├── supabase-client.ts # Client-side Supabase client
    └── supabase-server.ts # Server-side Supabase client
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
# YamsDocs
