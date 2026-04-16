import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Link,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';
import { fetchLinkedInLeads, LinkedInLead, LinkedInLeadsResponse } from '../services/linkedinLeads';

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const PER_PAGE = 20;

export default function LinkedInLeadsPage() {
  const [data, setData] = useState<LinkedInLeadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const loadPage = useCallback(async (pageIndex: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLinkedInLeads(pageIndex + 1, PER_PAGE);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load LinkedIn leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(page);
  }, [loadPage, page]);

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const renderRow = (lead: LinkedInLead) => (
    <TableRow key={lead.id} hover>
      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {lead.name}
        </Typography>
      </TableCell>
      <TableCell>
        <Link
          href={lead.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ fontSize: '0.875rem', color: '#0a66c2' }}
        >
          {lead.linkedin_url}
        </Link>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {relativeTime(lead.created_at)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(lead.created_at).toLocaleDateString()}
        </Typography>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100', py: 4, px: 2 }}>
      <Stack spacing={3} sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Paper elevation={1} sx={{ p: { xs: 2, md: 3 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }} justifyContent="space-between">
            <div>
              <Typography variant="overline" color="primary" sx={{ letterSpacing: 2 }}>
                LinkedIn
              </Typography>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                LinkedIn Leads
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Scraped via n8n — potential clients for custom software development.
              </Typography>
            </div>
            {data && (
              <Box textAlign={{ xs: 'left', md: 'right' }}>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {data.itemsTotal.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  total leads tracked
                </Typography>
              </Box>
            )}
          </Stack>
        </Paper>

        <Paper elevation={1}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              All leads
            </Typography>
          </Toolbar>

          {error && (
            <Alert severity="error" sx={{ mx: 3, mb: 2 }}>
              {error}
            </Alert>
          )}

          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>LinkedIn URL</TableCell>
                  <TableCell align="right">Added</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell><Skeleton width="40%" /></TableCell>
                    <TableCell><Skeleton width="70%" /></TableCell>
                    <TableCell align="right"><Skeleton width="30%" sx={{ ml: 'auto' }} /></TableCell>
                  </TableRow>
                ))}

                {!loading && data?.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Box sx={{ py: 6, textAlign: 'center' }}>
                        <Typography variant="subtitle1" gutterBottom>
                          No LinkedIn leads yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Run the n8n workflow to start collecting leads.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}

                {!loading && data?.items.map(renderRow)}
              </TableBody>
            </Table>
          </TableContainer>

          {data && (
            <TablePagination
              component="div"
              count={data.itemsTotal}
              page={page}
              rowsPerPage={PER_PAGE}
              onPageChange={handlePageChange}
              rowsPerPageOptions={[PER_PAGE]}
            />
          )}
        </Paper>

        {loading && !data && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}
      </Stack>
    </Box>
  );
}
