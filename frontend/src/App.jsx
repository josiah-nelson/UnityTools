import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Configuration from './pages/Configuration';
import ApiDesigner from './pages/ApiDesigner';
import Cameras from './pages/Cameras';
import Alarms from './pages/Alarms';
import Events from './pages/Events';
import Webhooks from './pages/Webhooks';
import DirectCameraAccess from './pages/DirectCameraAccess';
import { authService } from './services/authService';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#0a1929',
      paper: '#1a2027',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const status = await authService.checkStatus();
      setAuthenticated(status.authenticated);
    } catch (error) {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          Loading...
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Routes>
        <Route
          path="/login"
          element={
            authenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={() => setAuthenticated(true)} />
            )
          }
        />
        <Route
          path="/"
          element={
            authenticated ? (
              <Layout onLogout={() => setAuthenticated(false)} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="config" element={<Configuration />} />
          <Route path="designer" element={<ApiDesigner />} />
          <Route path="cameras" element={<Cameras />} />
          <Route path="alarms" element={<Alarms />} />
          <Route path="events" element={<Events />} />
          <Route path="webhooks" element={<Webhooks />} />
          <Route path="direct-camera" element={<DirectCameraAccess />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
