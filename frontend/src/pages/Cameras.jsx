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

function Cameras() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    setLoading(true);
    try {
      const result = await unityService.getCameras();
      if (result.success && Array.isArray(result.data)) {
        setCameras(result.data);
      } else {
        setCameras([]);
        enqueueSnackbar('No cameras found', { variant: 'info' });
      }
    } catch (error) {
      enqueueSnackbar('Failed to load cameras', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Cameras</Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={loadCameras}
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
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Model</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cameras.map((camera) => (
                  <TableRow key={camera.id || Math.random()}>
                    <TableCell>{camera.id || 'N/A'}</TableCell>
                    <TableCell>{camera.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <Chip
                        label={camera.status || 'Unknown'}
                        color={camera.status === 'online' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{camera.model || 'N/A'}</TableCell>
                    <TableCell>{camera.location || 'N/A'}</TableCell>
                  </TableRow>
                ))}
                {cameras.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No cameras available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Note:</strong> Camera information is retrieved from the Unity Web Endpoint API.
          Use the API Designer to explore additional camera operations and controls.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Cameras;
