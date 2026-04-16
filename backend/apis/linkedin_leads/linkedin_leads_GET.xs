// List all LinkedIn leads with pagination
query linkedin_leads verb=GET {
  api_group = "Job Leads"
  auth = "user"

  input {
    int page?=1 filters=min:1
    int per_page?=20 filters=min:1|max:500
  }

  stack {
    db.query linkedin_leads {
      sort = {linkedin_leads.created_at: "desc"}
      return = {
        type  : "list"
        paging: {
          page    : $input.page
          per_page: $input.per_page
          totals  : true
        }
      }
    } as $result
  }

  response = $result
}
