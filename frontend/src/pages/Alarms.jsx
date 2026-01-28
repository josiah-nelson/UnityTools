import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { unityService } from '../services/unityService';
import { useSnackbar } from 'notistack';

function Alarms() {
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadAlarms();
  }, []);

  const loadAlarms = async () => {
    setLoading(true);
    try {
      const result = await unityService.getAlarms();
      if (result.success && Array.isArray(result.data)) {
        setAlarms(result.data);
      } else {
        setAlarms([]);
      }
    } catch (error) {
      enqueueSnackbar('Failed to load alarms', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Alarms</Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={loadAlarms}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alarms.map((alarm, index) => (
                  <TableRow key={alarm.id || `alarm-${index}`}>
                    <TableCell>{alarm.id || 'N/A'}</TableCell>
                    <TableCell>{alarm.type || 'Unknown'}</TableCell>
                    <TableCell>
                      <Chip
                        label={alarm.severity || 'Unknown'}
                        color={getSeverityColor(alarm.severity)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{alarm.source || 'N/A'}</TableCell>
                    <TableCell>
                      {alarm.timestamp
                        ? new Date(alarm.timestamp).toLocaleString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alarm.status || 'Active'}
                        color={alarm.status === 'ACTIVE' ? 'error' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {alarms.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No active alarms
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}

export default Alarms;
