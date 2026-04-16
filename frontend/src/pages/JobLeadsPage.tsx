import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
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
  Tooltip,
  Typography,
} from '@mui/material';
import { fetchJobLeads, JobLead, JobLeadsResponse, updateJobLeadApplied } from '../services/jobLeads';

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

function stripHtml(str: string): string {
  return str
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const SOURCE_META: Record<string, { label: string; color: string; bg: string }> = {
  OnlineJobsPH: { label: 'OnlineJobs.ph', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  WeWorkRemotely: { label: 'We Work Remotely', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
};

function getSourceMeta(source: string) {
  return SOURCE_META[source] ?? { label: source, color: '#64748b', bg: 'rgba(148,163,184,0.2)' };
}

const ALL_SOURCES = Object.keys(SOURCE_META);
const PER_PAGE = 20;

export default function JobLeadsPage() {
  const [data, setData] = useState<JobLeadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [updatingLeadIds, setUpdatingLeadIds] = useState<Set<number>>(new Set());

  const loadPage = useCallback(async (pageIndex: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchJobLeads(pageIndex + 1, PER_PAGE);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(page);
  }, [loadPage, page]);

  const filteredItems = useMemo(() => {
    if (!data) return [];
    if (sourceFilter === 'ALL') return data.items;
    return data.items.filter((item) => item.source === sourceFilter);
  }, [data, sourceFilter]);

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setSourceFilter(event.target.value);
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (_event: ChangeEvent<HTMLInputElement>) => {
    // Rows per page is fixed to 20 (API limit)
  };

  const handleAppliedToggle = async (lead: JobLead) => {
    const nextApplied = !Boolean(lead.applied);

    setUpdatingLeadIds((prev) => {
      const copy = new Set(prev);
      copy.add(lead.id);
      return copy;
    });

    try {
      const updatedLead = await updateJobLeadApplied(lead.id, nextApplied);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.id === lead.id ? { ...item, ...updatedLead } : item
          ),
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lead');
    } finally {
      setUpdatingLeadIds((prev) => {
        const copy = new Set(prev);
        copy.delete(lead.id);
        return copy;
      });
    }
  };

  const renderDescription = (lead: JobLead) => {
    if (!lead.description) return '-';
    const clean = stripHtml(lead.description);
    return clean.length > 160 ? `${clean.slice(0, 160)}...` : clean;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100', py: 4, px: 2 }}>
      <Stack spacing={3} sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Paper elevation={1} sx={{ p: { xs: 2, md: 3 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }} justifyContent="space-between">
            <div>
              <Typography variant="overline" color="primary" sx={{ letterSpacing: 2 }}>
                Live feed
              </Typography>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                Job Leads
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Scraped daily from OnlineJobs.ph & We Work Remotely.
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
          <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Latest entries
            </Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="source-filter-label">Source</InputLabel>
              <Select
                labelId="source-filter-label"
                label="Source"
                value={sourceFilter}
                onChange={handleFilterChange}
              >
                <MenuItem value="ALL">All sources</MenuItem>
                {ALL_SOURCES.map((src) => (
                  <MenuItem key={src} value={src}>
                    {getSourceMeta(src).label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                  <TableCell>Role</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell width="40%">Summary</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Posted</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && Array.from({ length: 6 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><Skeleton width="80%" /></TableCell>
                    <TableCell><Skeleton width="60%" /></TableCell>
                    <TableCell><Skeleton width="50%" /></TableCell>
                    <TableCell>
                      <Skeleton width="90%" />
                      <Skeleton width="70%" />
                    </TableCell>
                    <TableCell><Skeleton width="70%" /></TableCell>
                    <TableCell align="right"><Skeleton width="40%" sx={{ ml: 'auto' }} /></TableCell>
                  </TableRow>
                ))}

                {!loading && filteredItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box sx={{ py: 6, textAlign: 'center' }}>
                        <Typography variant="subtitle1" gutterBottom>
                          No job leads found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {sourceFilter === 'ALL'
                            ? 'Check back soon for new leads.'
                            : 'No leads for this source yet. Try switching back to "All sources".'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}

                {!loading && filteredItems.map((lead) => {
                  const meta = getSourceMeta(lead.source);
                  return (
                    <TableRow key={lead.id} hover>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Link href={lead.url} target="_blank" rel="noopener noreferrer" underline="hover" sx={{ fontWeight: 600 }}>
                            {lead.title}
                          </Link>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {lead.company ? (
                          <Typography variant="body2">{lead.company}</Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={meta.label}
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: meta.color,
                            color: meta.color,
                            backgroundColor: meta.bg,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {renderDescription(lead)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={lead.applied ? 'Mark as not applied' : 'Mark as applied'}>
                          <Checkbox
                            checked={Boolean(lead.applied)}
                            disabled={updatingLeadIds.has(lead.id)}
                            onChange={() => void handleAppliedToggle(lead)}
                            color="success"
                            size="small"
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {relativeTime(lead.date_found)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(lead.date_found).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {data && (
            <TablePagination
              component="div"
              count={data.itemsTotal}
              page={page}
              rowsPerPage={PER_PAGE}
              onRowsPerPageChange={handleRowsPerPageChange}
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
