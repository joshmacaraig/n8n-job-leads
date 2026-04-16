# n8n Workflow Generator

An app for generating n8n workflows, powered by a React frontend and Xano backend.

## Structure

```
n8n/
├── frontend/          # React app (Vite, componentized & modular)
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Route-level page components
│       ├── hooks/       # Custom React hooks
│       ├── services/    # Xano API clients & external integrations
│       └── utils/       # Pure helper functions
├── backend/           # Xano reference files (XanoScript, schemas, API specs)
│   ├── functions/     # XanoScript function snippets
│   ├── schemas/       # Database table/schema definitions
│   └── api/           # API endpoint specs & request/response examples
├── workflows/         # n8n workflow exports (.json)
└── docs/              # Documentation
    ├── architecture/  # System design & decisions
    ├── api/           # API documentation
    └── workflows/     # n8n workflow documentation & guides
```

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Xano (XanoScript)
- **Workflow Engine:** n8n
