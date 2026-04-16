import { getToken } from './auth';

const BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:quJrPncv';

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface JobLead {
  id: number;
  title: string;
  source: string;
  url: string;
  description: string | null;
  date_found: string;
  company: string | null;
  dedup_key: string;
  applied?: boolean;
}

export interface JobLeadsResponse {
  items: JobLead[];
  itemsTotal: number;
  curPage: number;
  pageTotal: number;
  perPage: number;
  itemsReceived: number;
  nextPage: number | null;
  prevPage: number | null;
  offset: number;
}

export async function fetchJobLeads(page = 1, perPage = 20): Promise<JobLeadsResponse> {
  const res = await fetch(
    `${BASE_URL}/job_leads?page=${page}&per_page=${perPage}`,
    { headers: authHeaders() }
  );
  if (!res.ok) throw new Error(`Failed to fetch job leads: ${res.status}`);
  return res.json();
}

export async function updateJobLeadApplied(id: number, applied: boolean): Promise<JobLead> {
  const res = await fetch(`${BASE_URL}/job_leads/mark_applied`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ id, applied }),
  });
  if (!res.ok) throw new Error(`Failed to update job lead: ${res.status}`);
  return res.json();
}
