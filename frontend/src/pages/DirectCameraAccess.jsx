import React from 'react';
import { Box, Paper, Typography, Alert } from '@mui/material';
import { Construction as ConstructionIcon } from '@mui/icons-material';

function DirectCameraAccess() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Direct Camera Access
      </Typography>

      <Alert severity="info" icon={<ConstructionIcon />} sx={{ mb: 3 }}>
        This feature is under development
      </Alert>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1" paragraph>
          This section will provide direct camera access functionality, allowing you to:
        </Typography>
        <Box component="ul">
          <li>
            <Typography variant="body2">Connect directly to camera APIs</Typography>
          </li>
          <li>
            <Typography variant="body2">Retrieve camera-specific configurations</Typography>
          </li>
          <li>
            <Typography variant="body2">Access advanced camera features</Typography>
          </li>
          <li>
            <Typography variant="body2">
              Query parameters not available through Unity Web Endpoint
            </Typography>
          </li>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Currently, this is a stub page. The functionality will be implemented in future updates.
          For now, use the Unity Web Endpoint API through the API Designer or other sections.
        </Typography>
      </Paper>
    </Box>
  );
}

export default DirectCameraAccess;
