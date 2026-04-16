---
name: Claude Code Job Scraper Workflow
description: Details of the job-lead scraping workflow built for the user — sources, dedup approach, Xano output schema
type: project
---

A complete n8n workflow (`workflows/claude-code-job-scraper.json`) scrapes multiple sources daily for "Claude Code" job/freelance leads and POSTs new records to Xano.

**Sources scraped (all free/no API key):**
- Remotive (REST API: remotive.com/api/remote-jobs?search=Claude+Code)
- RemoteOK (REST API: remoteok.com/api)
- Reddit (JSON API: reddit.com/search.json — no OAuth needed for public search)
- HackerNews (Firebase REST: hacker-news.firebaseio.com/v0/jobstories.json, fetches top 20 items individually)
- Upwork RSS feed (upwork.com/search/jobs/rss/ — XML parsed with regex in Code node)

**Dedup approach:** Each lead gets a `dedup_key` = `{source}_{id}` (e.g. `remotive_12345`). On each run the workflow GETs existing records from Xano (/job_leads?per_page=500), builds a Set of known keys, and filters new leads before POSTing.

**Xano output schema (POST /job_leads):**
- title (string)
- source (string)
- url (string)
- description (string, max 500 chars, HTML stripped)
- date_found (ISO timestamp)
- company (string | null)
- dedup_key (string, unique index recommended in Xano)

**Env vars required in n8n:**
- `XANO_BASE_URL` — e.g. https://x8ki-letl-twmt.n7.xano.io/api:XXXXX
- `XANO_API_KEY` — Xano API token (Bearer)

**Why:** User is building a lead-generation tool to find clients/companies hiring for Claude Code skills.
**How to apply:** When user asks about extending this workflow, reference these sources and schema. Suggest LinkedIn RSS or Twitter/X search API as next sources if they want more volume.
