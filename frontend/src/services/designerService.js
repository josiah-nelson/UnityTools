import api from './api';

export const designerService = {
  async getEndpoints() {
    const response = await api.get('/designer/endpoints');
    return response.data;
  },

  async getEndpointCategories() {
    const response = await api.get('/designer/endpoint-categories');
    return response.data;
  },

  async generateCode(codeRequest) {
    const response = await api.post('/designer/generate-code', codeRequest);
    return response.data;
  },
};
