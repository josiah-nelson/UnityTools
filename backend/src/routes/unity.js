import express from 'express';
import unityApiService from '../services/unityApiService.js';
import unityAuth from '../auth/unityAuth.js';

const router = express.Router();

/**
 * Middleware to check authentication
 */
const requireAuth = (req, res, next) => {
  const session = req.session.unitySession;

  if (!session || !unityAuth.isSessionValid(session)) {
    return res.status(401).json({
      success: false,
      error: 'Not authenticated. Please login first.'
    });
  }

  req.unitySession = session;
  next();
};

// Apply auth middleware to all Unity API routes
router.use(requireAuth);

/**
 * GET /api/unity/cameras
 * Get list of all cameras
 */
router.get('/cameras', async (req, res) => {
  const result = await unityApiService.getCameras(req.unitySession);
  res.status(result.status || 200).json(result);
});

/**
 * GET /api/unity/camera/:id
 * Get specific camera details
 */
router.get('/camera/:id', async (req, res) => {
  const result = await unityApiService.getCamera(req.unitySession, req.params.id);
  res.status(result.status || 200).json(result);
});

/**
 * GET /api/unity/camera/:id/snapshot
 * Get camera snapshot
 */
router.get('/camera/:id/snapshot', async (req, res) => {
  const result = await unityApiService.getCameraSnapshot(req.unitySession, req.params.id);
  res.status(result.status || 200).json(result);
});

/**
 * GET /api/unity/alarms
 * Get active alarms
 */
router.get('/alarms', async (req, res) => {
  const result = await unityApiService.getAlarms(req.unitySession);
  res.status(result.status || 200).json(result);
});

/**
 * GET /api/unity/alarm-history
 * Get alarm history
 */
router.get('/alarm-history', async (req, res) => {
  const result = await unityApiService.getAlarmHistory(req.unitySession, req.query);
  res.status(result.status || 200).json(result);
});

/**
 * GET /api/unity/sites
 * Get sites
 */
router.get('/sites', async (req, res) => {
  const result = await unityApiService.getSites(req.unitySession);
  res.status(result.status || 200).json(result);
});

/**
 * POST /api/unity/events/search
 * Search events
 */
router.post('/events/search', async (req, res) => {
  const result = await unityApiService.searchEvents(req.unitySession, req.body);
  res.status(result.status || 200).json(result);
});

/**
 * GET /api/unity/webhooks
 * Get webhooks
 */
router.get('/webhooks', async (req, res) => {
  const result = await unityApiService.getWebhooks(req.unitySession);
  res.status(result.status || 200).json(result);
});

/**
 * POST /api/unity/webhook
 * Create webhook
 */
router.post('/webhook', async (req, res) => {
  const result = await unityApiService.createWebhook(req.unitySession, req.body);
  res.status(result.status || 200).json(result);
});

/**
 * DELETE /api/unity/webhook/:id
 * Delete webhook
 */
router.delete('/webhook/:id', async (req, res) => {
  const result = await unityApiService.deleteWebhook(req.unitySession, req.params.id);
  res.status(result.status || 200).json(result);
});

/**
 * POST /api/unity/proxy
 * Generic proxy endpoint for any Unity API call
 */
router.all('/proxy/*', async (req, res) => {
  try {
    const endpoint = '/' + req.params[0];
    const method = req.method;
    const data = ['POST', 'PUT', 'PATCH'].includes(method) ? req.body : null;
    const params = req.query;

    const result = await unityApiService.makeRequest(
      req.unitySession,
      method,
      endpoint,
      data,
      params
    );

    res.status(result.status || 200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
