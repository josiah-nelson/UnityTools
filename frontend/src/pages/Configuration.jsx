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
} from '@mui/material';
import { Delete as DeleteIcon, CheckCircle as CheckCircleIcon, Add as AddIcon } from '@mui/icons-material';
import { configService } from '../services/configService';
import { useSnackbar } from 'notistack';

function Configuration() {
  const [servers, setServers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    userNonce: '',
    userKey: '',
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    try {
      const result = await configService.getServers();
      if (result.success) {
        setServers(result.servers);
      }
    } catch (error) {
      enqueueSnackbar('Failed to load servers', { variant: 'error' });
    }
  };

  const handleAddServer = async () => {
    try {
      const result = await configService.addServer(formData);
      if (result.success) {
        enqueueSnackbar('Server added successfully', { variant: 'success' });
        setOpenDialog(false);
        setFormData({ name: '', url: '', userNonce: '', userKey: '' });
        loadServers();
      }
    } catch (error) {
      enqueueSnackbar('Failed to add server', { variant: 'error' });
    }
  };

  const handleDeleteServer = async (serverId) => {
    try {
      const result = await configService.deleteServer(serverId);
      if (result.success) {
        enqueueSnackbar('Server deleted successfully', { variant: 'success' });
        loadServers();
      }
    } catch (error) {
      enqueueSnackbar('Failed to delete server', { variant: 'error' });
    }
  };

  const handleActivateServer = async (serverId) => {
    try {
      const result = await configService.activateServer(serverId);
      if (result.success) {
        enqueueSnackbar('Server activated successfully', { variant: 'success' });
        loadServers();
      }
    } catch (error) {
      enqueueSnackbar('Failed to activate server', { variant: 'error' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Configuration</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Server
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>User Nonce</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servers.map((server) => (
                <TableRow key={server.id}>
                  <TableCell>{server.name}</TableCell>
                  <TableCell>{server.url}</TableCell>
                  <TableCell>{server.userNonce}</TableCell>
                  <TableCell>{new Date(server.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleActivateServer(server.id)}
                      title="Set as active"
                    >
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteServer(server.id)}
                      title="Delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {servers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No servers configured
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Server</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Server Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Server URL"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://10.192.192.158:8443"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="User Nonce"
            value={formData.userNonce}
            onChange={(e) => setFormData({ ...formData, userNonce: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="User Key"
            type="password"
            value={formData.userKey}
            onChange={(e) => setFormData({ ...formData, userKey: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddServer} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Configuration;
