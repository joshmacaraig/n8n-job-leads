import { getToken } from './auth';

const BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:quJrPncv';

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface LinkedInLead {
  id: number;
  name: string;
  linkedin_url: string;
  created_at: string;
}

export interface LinkedInLeadsResponse {
  items: LinkedInLead[];
  itemsTotal: number;
  curPage: number;
  pageTotal: number;
  perPage: number;
  itemsReceived: number;
  nextPage: number | null;
  prevPage: number | null;
  offset: number;
}

export async function fetchLinkedInLeads(page = 1, perPage = 20): Promise<LinkedInLeadsResponse> {
  const res = await fetch(
    `${BASE_URL}/linkedin_leads?page=${page}&per_page=${perPage}`,
    { headers: authHeaders() }
  );
  if (!res.ok) throw new Error(`Failed to fetch LinkedIn leads: ${res.status}`);
  return res.json();
}
