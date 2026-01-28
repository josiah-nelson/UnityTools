import express from 'express';
import unityAuth from '../auth/unityAuth.js';
import configService from '../services/configService.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticate with Unity Web Endpoint
 */
router.post('/login', async (req, res) => {
  try {
    const { serverUrl, userNonce, userKey, saveConfig } = req.body;

    if (!serverUrl || !userNonce || !userKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: serverUrl, userNonce, userKey'
      });
    }

    // Authenticate with Unity
    const authResult = await unityAuth.authenticate(serverUrl, userNonce, userKey);

    if (!authResult.success) {
      return res.status(401).json(authResult);
    }

    // Store session
    req.session.unitySession = authResult.session;

    // Optionally save to config
    if (saveConfig) {
      await configService.addServer({
        name: req.body.serverName || serverUrl,
        url: serverUrl,
        userNonce: userNonce,
        userKey: userKey
      });
    }

    res.json({
      success: true,
      message: 'Authentication successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/auth/logout
 * Clear session
 */
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Failed to logout'
      });
    }
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

/**
 * GET /api/auth/status
 * Check authentication status
 */
router.get('/status', (req, res) => {
  const session = req.session.unitySession;

  if (!session || !unityAuth.isSessionValid(session)) {
    return res.json({
      authenticated: false
    });
  }

  res.json({
    authenticated: true,
    serverUrl: session.serverUrl
  });
});

export default router;
