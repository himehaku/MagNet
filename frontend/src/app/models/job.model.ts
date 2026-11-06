export interface Job {
  id: number;
  externalId: string;
  title: string;
  company: string;
  description: string;
  location: string | null;
  remote: boolean | null;
  category: string | null;
  source: string;
  sourceUrl: string;
  publishedAt: string | null;
  fetchedAt: string;
  createdAt: string;
  updatedAt: string;
}