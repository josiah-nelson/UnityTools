import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert,
  MenuItem,
} from '@mui/material';
import { authService } from '../services/authService';
import { configService } from '../services/configService';
import { useSnackbar } from 'notistack';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    serverUrl: '',
    userNonce: '',
    userKey: '',
    serverName: '',
    saveConfig: false,
  });
  const [savedServers, setSavedServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadSavedServers();
  }, []);

  const loadSavedServers = async () => {
    try {
      const result = await configService.getServers();
      if (result.success) {
        setSavedServers(result.servers);
      }
    } catch (error) {
      console.error('Error loading servers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'saveConfig' ? checked : value,
    }));
  };

  const handleServerSelect = (e) => {
    const serverId = e.target.value;
    setSelectedServer(serverId);

    if (serverId) {
      const server = savedServers.find((s) => s.id === serverId);
      if (server) {
        setFormData((prev) => ({
          ...prev,
          serverUrl: server.url,
          userNonce: server.userNonce,
          serverName: server.name,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.login(formData);

      if (result.success) {
        enqueueSnackbar('Login successful', { variant: 'success' });
        onLogin();
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a2027 0%, #0a1929 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Unity Tools
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Avigilon Unity Web Endpoint Interface
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {savedServers.length > 0 && (
              <TextField
                select
                fullWidth
                label="Use Saved Server"
                value={selectedServer}
                onChange={handleServerSelect}
                sx={{ mb: 2 }}
              >
                <MenuItem value="">
                  <em>Enter manually</em>
                </MenuItem>
                {savedServers.map((server) => (
                  <MenuItem key={server.id} value={server.id}>
                    {server.name} - {server.url}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              fullWidth
              label="Server URL"
              name="serverUrl"
              value={formData.serverUrl}
              onChange={handleChange}
              placeholder="https://10.192.192.158:8443"
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="User Nonce"
              name="userNonce"
              value={formData.userNonce}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="User Key"
              name="userKey"
              type="password"
              value={formData.userKey}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Server Name (optional)"
              name="serverName"
              value={formData.serverName}
              onChange={handleChange}
              placeholder="Production Server"
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="saveConfig"
                  checked={formData.saveConfig}
                  onChange={handleChange}
                />
              }
              label="Save these credentials"
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Authenticating...' : 'Login'}
            </Button>
          </form>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
            Credentials are stored securely and never transmitted to third parties.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
