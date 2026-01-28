import api from './api';

export const unityService = {
  async getCameras() {
    const response = await api.get('/unity/cameras');
    return response.data;
  },

  async getCamera(cameraId) {
    const response = await api.get(`/unity/camera/${cameraId}`);
    return response.data;
  },

  async getCameraSnapshot(cameraId) {
    const response = await api.get(`/unity/camera/${cameraId}/snapshot`);
    return response.data;
  },

  async getAlarms() {
    const response = await api.get('/unity/alarms');
    return response.data;
  },

  async getAlarmHistory(params) {
    const response = await api.get('/unity/alarm-history', { params });
    return response.data;
  },

  async getSites() {
    const response = await api.get('/unity/sites');
    return response.data;
  },

  async searchEvents(searchParams) {
    const response = await api.post('/unity/events/search', searchParams);
    return response.data;
  },

  async getWebhooks() {
    const response = await api.get('/unity/webhooks');
    return response.data;
  },

  async createWebhook(webhookData) {
    const response = await api.post('/unity/webhook', webhookData);
    return response.data;
  },

  async deleteWebhook(webhookId) {
    const response = await api.delete(`/unity/webhook/${webhookId}`);
    return response.data;
  },

  async proxyRequest(endpoint, method = 'GET', data = null, params = null) {
    const config = {
      method: method,
      url: `/unity/proxy${endpoint}`,
    };

    if (data) {
      config.data = data;
    }

    if (params) {
      config.params = params;
    }

    const response = await api(config);
    return response.data;
  },
};
