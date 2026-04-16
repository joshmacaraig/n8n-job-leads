// Batch create job leads — accepts an array and skips duplicates
query "job_leads/batch" verb=POST {
  api_group = "Job Leads"

  input {
    // Array of lead objects
    json leads
  }

  stack {
    var $saved {
      value = []
    }
  
    var $skipped {
      value = []
    }
  
    foreach ($input.leads) {
      each as $lead {
        db.get job_leads {
          field_name = "dedup_key"
          field_value = $lead.dedup_key
          output = ["id"]
        } as $existing
      
        conditional {
          if ($existing == null) {
            db.add job_leads {
              data = {
                title      : $lead.title
                source     : $lead.source
                url        : $lead.url
                description: $lead.description
                date_found : $lead.date_found
                company    : $lead.company
                dedup_key  : $lead.dedup_key
              }
            } as $new_lead
          
            array.push $saved {
              value = $new_lead.id
            }
          }
        
          else {
            array.push $skipped {
              value = $lead.dedup_key
            }
          }
        }
      }
    }
  }

  response = {
    saved_count  : $saved|length
    skipped_count: $skipped|length
    saved_ids    : $saved
  }
}