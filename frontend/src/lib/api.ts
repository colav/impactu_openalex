import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  timeout: 15000,
});

// ---- Database selection (global, injected into every request automatically)
export function setApiDb(db: string | undefined) {
  if (db) {
    api.defaults.params = { ...api.defaults.params, db };
  } else {
    const p = { ...(api.defaults.params || {}) };
    delete p.db;
    api.defaults.params = p;
  }
}

export interface DatabaseInfo {
  key: string;
  name: string;
}

export const databasesApi = {
  list: (): Promise<{ default: string; available: DatabaseInfo[] }> =>
    api.get("/databases").then((r) => r.data),
};

// ---- Generic list response
export interface ListResponse<T> {
  meta: { count: number; page: number; per_page: number };
  results: T[];
}

// ---- Works
export interface Work {
  _id: string;
  id: string;
  title: string;
  display_name: string;
  publication_year: number;
  publication_date: string;
  type: string;
  language: string;
  cited_by_count?: number;
  authors_count?: number;
  open_access?: { is_oa: boolean; oa_status: string; oa_url?: string };
  primary_location?: {
    source?: { display_name: string; type: string };
    landing_page_url?: string;
  };
  primary_topic?: {
    display_name: string;
    field?: { display_name: string };
    domain?: { display_name: string };
  };
  authorships?: Array<{
    author: { display_name: string; id: string };
    institutions: Array<{ display_name: string; country_code: string }>;
  }>;
  abstract?: string;
  keywords?: Array<{ display_name: string }>;
  topics?: Array<{ display_name: string; score: number }>;
  biblio?: { volume?: string; issue?: string; first_page?: string; last_page?: string };
}

// ---- Authors
export interface Author {
  _id: string;
  id: string;
  display_name: string;
  works_count: number;
  cited_by_count: number;
  summary_stats?: { h_index: number; i10_index: number; "2yr_mean_citedness": number };
  affiliations?: Array<{
    institution: { display_name: string; country_code: string; id: string };
  }>;
  last_known_institutions?: Array<{
    display_name: string;
    country_code: string;
    type: string;
  }>;
  ids?: { orcid?: string; openalex?: string };
  topics?: Array<{ display_name: string; count: number }>;
  x_concepts?: Array<{ display_name: string; score: number; level: number }>;
}

// ---- Institutions
export interface Institution {
  _id: string;
  id: string;
  display_name: string;
  country_code: string;
  type: string;
  works_count: number;
  cited_by_count: number;
  ror?: string;
  homepage_url?: string;
  image_url?: string;
  image_thumbnail_url?: string;
  summary_stats?: { h_index: number; i10_index: number };
  geo?: { city?: string; country?: string; latitude?: number; longitude?: number };
  topics?: Array<{ display_name: string; count: number }>;
}

// ---- Sources
export interface Source {
  _id: string;
  id: string;
  display_name: string;
  type: string;
  is_oa: boolean;
  is_in_doaj: boolean;
  works_count: number;
  cited_by_count: number;
  issn_l?: string;
  country_code?: string;
  host_organization_name?: string;
  summary_stats?: { h_index: number; "2yr_mean_citedness": number };
  apc_usd?: number;
}

// ---- Topics
export interface Topic {
  _id: string;
  id: string;
  display_name: string;
  works_count?: number;
  cited_by_count?: number;
  subfield?: { display_name: string };
  field?: { display_name: string };
  domain?: { display_name: string };
  description?: string;
  keywords?: string[];
}

// ---- Concepts
export interface Concept {
  _id: string;
  id: string;
  display_name: string;
  level: number;
  works_count: number;
  cited_by_count: number;
  description?: string;
  wikidata?: string;
  ancestors?: Array<{ display_name: string; level: number }>;
}

// ---- Stats
export interface Stats {
  works: number;
  authors: number;
  institutions: number;
  sources: number;
  topics: number;
  concepts: number;
  funders: number;
  publishers: number;
}

// ---- OpenAlex ID helpers
const OPENALEX_BASE = "https://openalex.org/";

/** Entity prefix → route segment */
const PREFIX_ROUTE: Record<string, string> = {
  W: "works",
  A: "authors",
  I: "institutions",
  S: "sources",
  T: "topics",
  C: "concepts",
};

/**
 * If `q` is an OpenAlex ID (URL like https://openalex.org/W123 or short
 * form like W123), return the frontend route to that entity's detail page.
 * Returns null if `q` is not an ID.
 */
export function resolveOpenAlexRoute(q: string): string | null {
  let shortId = q.trim();
  if (shortId.startsWith(OPENALEX_BASE)) {
    shortId = shortId.slice(OPENALEX_BASE.length);
  }
  const prefix = shortId[0]?.toUpperCase();
  const rest = shortId.slice(1);
  if (prefix && PREFIX_ROUTE[prefix] && rest && /^\d+$/.test(rest)) {
    return `/${PREFIX_ROUTE[prefix]}/${shortId.toUpperCase()}`;
  }
  return null;
}

// ---- API functions
export const worksApi = {
  list: (params?: Record<string, any>) =>
    api.get<ListResponse<Work>>("/works", { params }).then((r) => r.data),
  get: (id: string) =>
    api.get<Work>(`/works/${id}`).then((r) => r.data),
};

export const authorsApi = {
  list: (params?: Record<string, any>) =>
    api.get<ListResponse<Author>>("/authors", { params }).then((r) => r.data),
  get: (id: string) =>
    api.get<Author>(`/authors/${id}`).then((r) => r.data),
};

export const institutionsApi = {
  list: (params?: Record<string, any>) =>
    api.get<ListResponse<Institution>>("/institutions", { params }).then((r) => r.data),
  get: (id: string) =>
    api.get<Institution>(`/institutions/${id}`).then((r) => r.data),
};

export const sourcesApi = {
  list: (params?: Record<string, any>) =>
    api.get<ListResponse<Source>>("/sources", { params }).then((r) => r.data),
  get: (id: string) =>
    api.get<Source>(`/sources/${id}`).then((r) => r.data),
};

export const topicsApi = {
  list: (params?: Record<string, any>) =>
    api.get<ListResponse<Topic>>("/topics", { params }).then((r) => r.data),
  get: (id: string) =>
    api.get<Topic>(`/topics/${id}`).then((r) => r.data),
};

export const conceptsApi = {
  list: (params?: Record<string, any>) =>
    api.get<ListResponse<Concept>>("/concepts", { params }).then((r) => r.data),
  get: (id: string) =>
    api.get<Concept>(`/concepts/${id}`).then((r) => r.data),
};

export const statsApi = {
  get: (db?: string) =>
    api.get<Stats>("/stats", { params: db ? { db } : {} }).then((r) => r.data),
};

export default api;
