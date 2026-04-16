// Update whether a job lead is already applied
query "job_leads/mark_applied" verb=PATCH {
  api_group = "Job Leads"
  auth = "user"

  input {
    int id
    bool applied
  }

  stack {
    db.get job_leads {
      field_name = "id"
      field_value = $input.id
      output = ["id"]
    } as $lead
  
    precondition ($lead != null) {
      error_type = "inputerror"
      error = "Lead not found."
    }
  
    db.patch job_leads {
      field_name = "id"
      field_value = $input.id
      data = {applied: $input.applied}
    } as $updated_lead
  }

  response = $updated_lead
}