export type Profile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
};

export type Document = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}; 