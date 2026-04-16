import { Box, Tab, Tabs, Typography } from '@mui/material';

export type Page = 'job-leads' | 'linkedin-leads';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const handleChange = (_: React.SyntheticEvent, value: Page) => {
    onNavigate(value);
  };

  return (
    <Box sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', px: 2 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', whiteSpace: 'nowrap', py: 1.5 }}>
          n8n Leads
        </Typography>
        <Tabs value={currentPage} onChange={handleChange} sx={{ minHeight: 48 }}>
          <Tab label="Job Leads" value="job-leads" sx={{ minHeight: 48, textTransform: 'none', fontWeight: 600 }} />
          <Tab label="LinkedIn Leads" value="linkedin-leads" sx={{ minHeight: 48, textTransform: 'none', fontWeight: 600 }} />
        </Tabs>
      </Box>
    </Box>
  );
}
