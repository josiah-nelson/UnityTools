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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { unityService } from '../services/unityService';
import { useSnackbar } from 'notistack';

function Webhooks() {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    eventType: '',
    name: '',
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    setLoading(true);
    try {
      const result = await unityService.getWebhooks();
      if (result.success && Array.isArray(result.data)) {
        setWebhooks(result.data);
      } else {
        setWebhooks([]);
      }
    } catch (error) {
      enqueueSnackbar('Failed to load webhooks', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddWebhook = async () => {
    try {
      const result = await unityService.createWebhook(formData);
      if (result.success) {
        enqueueSnackbar('Webhook created successfully', { variant: 'success' });
        setOpenDialog(false);
        setFormData({ url: '', eventType: '', name: '' });
        loadWebhooks();
      }
    } catch (error) {
      enqueueSnackbar('Failed to create webhook', { variant: 'error' });
    }
  };

  const handleDeleteWebhook = async (webhookId) => {
    try {
      const result = await unityService.deleteWebhook(webhookId);
      if (result.success) {
        enqueueSnackbar('Webhook deleted successfully', { variant: 'success' });
        loadWebhooks();
      }
    } catch (error) {
      enqueueSnackbar('Failed to delete webhook', { variant: 'error' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Webhooks</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadWebhooks}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add Webhook
          </Button>
        </Box>
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
                  <TableCell>URL</TableCell>
                  <TableCell>Event Type</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {webhooks.map((webhook, index) => (
                  <TableRow key={webhook.id || `webhook-${index}`}>
                    <TableCell>{webhook.id || 'N/A'}</TableCell>
                    <TableCell>{webhook.name || 'N/A'}</TableCell>
                    <TableCell>{webhook.url || 'N/A'}</TableCell>
                    <TableCell>{webhook.eventType || 'N/A'}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteWebhook(webhook.id)}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {webhooks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No webhooks configured
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Webhook</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Webhook URL"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://your-server.com/webhook"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Event Type"
            value={formData.eventType}
            onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
            placeholder="Motion, Alarm, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddWebhook} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Webhooks;
