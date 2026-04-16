// Stores scraped job leads for Claude Code positions found via n8n workflow
table job_leads {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // Job post title
    text title
  
    // Source platform (Remotive, RemoteOK, Reddit, HackerNews, Upwork)
    text source
  
    // Direct URL to the job post
    text url
  
    // Truncated job description (max 500 chars)
    text? description
  
    // ISO timestamp when the lead was scraped
    text date_found
  
    // Company name if available
    text? company
  
    // Unique key used for deduplication (e.g. remotive_12345)
    text dedup_key
  
    // Whether we've already applied to this lead
    bool applied?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      type : "btree|unique"
      field: [{name: "dedup_key", op: "asc"}]
    }
    {type: "btree", field: [{name: "source", op: "asc"}]}
  ]
}