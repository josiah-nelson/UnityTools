import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Divider,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ContentCopy as ContentCopyIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { designerService } from '../services/designerService';
import { useSnackbar } from 'notistack';

function ApiDesigner() {
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [parameters, setParameters] = useState({});
  const [requestBody, setRequestBody] = useState('{}');
  const [format, setFormat] = useState('curl');
  const [generatedCode, setGeneratedCode] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadEndpoints();
  }, []);

  const loadEndpoints = async () => {
    try {
      const result = await designerService.getEndpointCategories();
      if (result.success) {
        setCategories(result.categories);
      }
    } catch (error) {
      enqueueSnackbar('Failed to load API endpoints', { variant: 'error' });
    }
  };

  const handleEndpointSelect = (endpoint) => {
    setSelectedEndpoint(endpoint);
    setParameters({});
    setRequestBody('{}');
    setGeneratedCode('');
  };

  const handleGenerateCode = async () => {
    if (!selectedEndpoint) {
      enqueueSnackbar('Please select an endpoint first', { variant: 'warning' });
      return;
    }

    try {
      let body = null;
      if (['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method)) {
        try {
          body = JSON.parse(requestBody);
        } catch (e) {
          enqueueSnackbar('Invalid JSON in request body', { variant: 'error' });
          return;
        }
      }

      const result = await designerService.generateCode({
        endpoint: selectedEndpoint.path,
        method: selectedEndpoint.method,
        parameters: parameters,
        body: body,
        format: format,
      });

      if (result.success) {
        setGeneratedCode(result.code);
      }
    } catch (error) {
      enqueueSnackbar('Failed to generate code', { variant: 'error' });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    enqueueSnackbar('Code copied to clipboard', { variant: 'success' });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        API Designer
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Design and generate API calls for Unity Web Endpoint
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Endpoint
            </Typography>

            <TextField
              select
              fullWidth
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="">
                <em>Select a category</em>
              </MenuItem>
              {Object.keys(categories).map((category) => (
                <MenuItem key={category} value={category}>
                  {category} ({categories[category].length})
                </MenuItem>
              ))}
            </TextField>

            {selectedCategory && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Endpoints:
                </Typography>
                {categories[selectedCategory].map((endpoint, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 1,
                      mb: 1,
                      border: '1px solid',
                      borderColor: selectedEndpoint === endpoint ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': { borderColor: 'primary.light' },
                    }}
                    onClick={() => handleEndpointSelect(endpoint)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={endpoint.method} size="small" color="primary" />
                      <Typography variant="body2">{endpoint.path}</Typography>
                    </Box>
                    {endpoint.summary && (
                      <Typography variant="caption" color="text.secondary">
                        {endpoint.summary}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}

            {selectedEndpoint && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Configure Request
                </Typography>

                {['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && (
                  <TextField
                    fullWidth
                    label="Request Body (JSON)"
                    multiline
                    rows={6}
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                )}

                <TextField
                  select
                  fullWidth
                  label="Output Format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="curl">cURL</MenuItem>
                  <MenuItem value="powershell">PowerShell</MenuItem>
                  <MenuItem value="cmd">CMD</MenuItem>
                  <MenuItem value="javascript">JavaScript</MenuItem>
                  <MenuItem value="python">Python</MenuItem>
                </TextField>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<PlayArrowIcon />}
                  onClick={handleGenerateCode}
                >
                  Generate Code
                </Button>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Generated Code</Typography>
              {generatedCode && (
                <Tooltip title="Copy to clipboard">
                  <IconButton onClick={handleCopyCode} size="small">
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {generatedCode ? (
              <Box
                component="pre"
                sx={{
                  p: 2,
                  bgcolor: 'background.default',
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                }}
              >
                {generatedCode}
              </Box>
            ) : (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                Select an endpoint and click "Generate Code" to see the output
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ApiDesigner;
