// Stores LinkedIn profiles scraped via n8n workflow for custom software development outreach
table linkedin_leads {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // Full name of the LinkedIn profile
    text name
  
    // Direct URL to the LinkedIn profile
    text linkedin_url
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      type : "btree|unique"
      field: [{name: "linkedin_url", op: "asc"}]
    }
  ]
}