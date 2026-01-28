import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { unityService } from '../services/unityService';
import { useSnackbar } from 'notistack';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    startTime: '',
    endTime: '',
    eventType: '',
  });
  const { enqueueSnackbar } = useSnackbar();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const result = await unityService.searchEvents(searchParams);
      if (result.success && Array.isArray(result.data)) {
        setEvents(result.data);
        enqueueSnackbar(`Found ${result.data.length} events`, { variant: 'success' });
      } else {
        setEvents([]);
        enqueueSnackbar('No events found', { variant: 'info' });
      }
    } catch (error) {
      enqueueSnackbar('Failed to search events', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Event Search
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Start Time"
              type="datetime-local"
              value={searchParams.startTime}
              onChange={(e) =>
                setSearchParams({ ...searchParams, startTime: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="End Time"
              type="datetime-local"
              value={searchParams.endTime}
              onChange={(e) =>
                setSearchParams({ ...searchParams, endTime: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Event Type"
              value={searchParams.eventType}
              onChange={(e) =>
                setSearchParams({ ...searchParams, eventType: e.target.value })
              }
              placeholder="Motion, Login, etc."
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={loading}
            >
              Search Events
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : events.length > 0 ? (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event, index) => (
                  <TableRow key={event.id || `event-${index}`}>
                    <TableCell>{event.id || 'N/A'}</TableCell>
                    <TableCell>{event.type || 'Unknown'}</TableCell>
                    <TableCell>{event.source || 'N/A'}</TableCell>
                    <TableCell>
                      {event.timestamp
                        ? new Date(event.timestamp).toLocaleString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{event.description || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary" align="center">
            Use the search form above to find events
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default Events;
