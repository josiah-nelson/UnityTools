import api from './api';

export const configService = {
  async getServers() {
    const response = await api.get('/config/servers');
    return response.data;
  },

  async addServer(serverData) {
    const response = await api.post('/config/servers', serverData);
    return response.data;
  },

  async deleteServer(serverId) {
    const response = await api.delete(`/config/servers/${serverId}`);
    return response.data;
  },

  async activateServer(serverId) {
    const response = await api.post(`/config/servers/${serverId}/activate`);
    return response.data;
  },

  async getActiveServer() {
    const response = await api.get('/config/active-server');
    return response.data;
  },
};
