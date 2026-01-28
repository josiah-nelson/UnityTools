import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  Videocam as VideocamIcon,
  NotificationsActive as NotificationsActiveIcon,
  Webhook as WebhookIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { unityService } from '../services/unityService';

function StatCard({ title, value, icon, loading }) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom>
              {title}
            </Typography>
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Typography variant="h4">{value}</Typography>
            )}
          </Box>
          <Box sx={{ color: 'primary.main', fontSize: 48 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({
    cameras: 0,
    alarms: 0,
    webhooks: 0,
    sites: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [camerasRes, alarmsRes, webhooksRes, sitesRes] = await Promise.all([
        unityService.getCameras().catch(() => ({ data: [] })),
        unityService.getAlarms().catch(() => ({ data: [] })),
        unityService.getWebhooks().catch(() => ({ data: [] })),
        unityService.getSites().catch(() => ({ data: [] })),
      ]);

      setStats({
        cameras: Array.isArray(camerasRes.data) ? camerasRes.data.length : 0,
        alarms: Array.isArray(alarmsRes.data) ? alarmsRes.data.length : 0,
        webhooks: Array.isArray(webhooksRes.data) ? webhooksRes.data.length : 0,
        sites: Array.isArray(sitesRes.data) ? sitesRes.data.length : 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Overview of your Avigilon Unity system
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Cameras"
            value={stats.cameras}
            icon={<VideocamIcon fontSize="inherit" />}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Alarms"
            value={stats.alarms}
            icon={<NotificationsActiveIcon fontSize="inherit" />}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Webhooks"
            value={stats.webhooks}
            icon={<WebhookIcon fontSize="inherit" />}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sites"
            value={stats.sites}
            icon={<CheckCircleIcon fontSize="inherit" />}
            loading={loading}
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Use the sidebar to navigate to different sections:
        </Typography>
        <Box component="ul" sx={{ mt: 2 }}>
          <li>
            <Typography variant="body2">
              <strong>API Designer:</strong> Generate code for common API operations
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Cameras:</strong> View and manage camera devices
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Alarms:</strong> Monitor and manage system alarms
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Events:</strong> Search and view system events
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Webhooks:</strong> Configure event subscriptions
            </Typography>
          </li>
        </Box>
      </Paper>
    </Box>
  );
}

export default Dashboard;
