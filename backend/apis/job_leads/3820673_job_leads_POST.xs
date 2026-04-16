// Create a new job lead — called by the n8n scraper workflow
query job_leads verb=POST {
  api_group = "Job Leads"

  input {
    text title
    text source
    text url
    text? description
    text date_found
    text? company
    text dedup_key
  }

  stack {
    // Skip if this dedup_key already exists
    db.get job_leads {
      field_name = "dedup_key"
      field_value = $input.dedup_key
      output = ["id"]
    } as $existing
  
    precondition ($existing == null) {
      error_type = "inputerror"
      error = "Lead already exists."
    }
  
    db.add job_leads {
      data = {
        title      : $input.title
        source     : $input.source
        url        : $input.url
        description: $input.description
        date_found : $input.date_found
        company    : $input.company
        dedup_key  : $input.dedup_key
      }
    } as $new_lead
  }

  response = $new_lead
}