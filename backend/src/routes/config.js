import express from 'express';
import configService from '../services/configService.js';

const router = express.Router();

/**
 * GET /api/config/servers
 * Get all saved server configurations
 */
router.get('/servers', async (req, res) => {
  try {
    const servers = await configService.getServers();
    res.json({
      success: true,
      servers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/config/servers
 * Add a new server configuration
 */
router.post('/servers', async (req, res) => {
  try {
    const result = await configService.addServer(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/config/servers/:id
 * Delete a server configuration
 */
router.delete('/servers/:id', async (req, res) => {
  try {
    const result = await configService.deleteServer(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/config/servers/:id/activate
 * Set active server
 */
router.post('/servers/:id/activate', async (req, res) => {
  try {
    const result = await configService.setActiveServer(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/config/active-server
 * Get active server configuration
 */
router.get('/active-server', async (req, res) => {
  try {
    const server = await configService.getActiveServer();
    if (!server) {
      return res.json({
        success: true,
        server: null
      });
    }

    res.json({
      success: true,
      server: {
        id: server.id,
        name: server.name,
        url: server.url,
        userNonce: server.userNonce
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
