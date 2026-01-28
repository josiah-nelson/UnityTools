import axios from 'axios';
import https from 'https';

/**
 * Unity API Service
 * Proxy service for making requests to Unity Web Endpoint API
 */
class UnityApiService {
  constructor() {
    this.httpsAgent = new https.Agent({
      rejectUnauthorized: false // Allow self-signed certificates
    });
  }

  /**
   * Make a request to Unity Web Endpoint API
   */
  async makeRequest(session, method, endpoint, data = null, params = null) {
    try {
      const url = `${session.serverUrl}/mt/api/rest/v1${endpoint}`;

      const config = {
        method: method,
        url: url,
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'Content-Type': 'application/json'
        },
        httpsAgent: this.httpsAgent
      };

      if (data) {
        config.data = data;
      }

      if (params) {
        config.params = params;
      }

      const response = await axios(config);
      return {
        success: true,
        data: response.data,
        status: response.status
      };

    } catch (error) {
      console.error(`API Request Error [${method} ${endpoint}]:`, error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status || 500
      };
    }
  }

  /**
   * Get list of cameras
   */
  async getCameras(session) {
    return this.makeRequest(session, 'GET', '/cameras');
  }

  /**
   * Get specific camera details
   */
  async getCamera(session, cameraId) {
    return this.makeRequest(session, 'GET', `/camera/${cameraId}`);
  }

  /**
   * Get camera snapshot
   */
  async getCameraSnapshot(session, cameraId) {
    return this.makeRequest(session, 'GET', `/camera/${cameraId}/snapshot`);
  }

  /**
   * Get alarms
   */
  async getAlarms(session) {
    return this.makeRequest(session, 'GET', '/alarms');
  }

  /**
   * Get alarm history
   */
  async getAlarmHistory(session, params) {
    return this.makeRequest(session, 'GET', '/alarm-history', null, params);
  }

  /**
   * Get sites
   */
  async getSites(session) {
    return this.makeRequest(session, 'GET', '/sites');
  }

  /**
   * Search events
   */
  async searchEvents(session, searchParams) {
    return this.makeRequest(session, 'POST', '/event/search', searchParams);
  }

  /**
   * Get webhooks
   */
  async getWebhooks(session) {
    return this.makeRequest(session, 'GET', '/webhooks');
  }

  /**
   * Create webhook
   */
  async createWebhook(session, webhookData) {
    return this.makeRequest(session, 'POST', '/webhook', webhookData);
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(session, webhookId) {
    return this.makeRequest(session, 'DELETE', `/webhook/${webhookId}`);
  }
}

export default new UnityApiService();
