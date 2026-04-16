// Create a new LinkedIn lead — called by the n8n scraper workflow
query linkedin_leads verb=POST {
  api_group = "Job Leads"

  input {
    text name
    text linkedin_url
  }

  stack {
    // Skip if this linkedin_url already exists
    db.get linkedin_leads {
      field_name  = "linkedin_url"
      field_value = $input.linkedin_url
      output      = ["id"]
    } as $existing

    precondition ($existing == null) {
      error_type = "inputerror"
      error = "Lead already exists."
    }

    db.add linkedin_leads {
      data = {
        name        : $input.name
        linkedin_url: $input.linkedin_url
      }
    } as $new_lead
  }

  response = $new_lead
}
