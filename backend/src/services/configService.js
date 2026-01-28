import fs from 'fs/promises';
import path from 'path';

/**
 * Configuration Service
 * Manages server configurations, credentials, and site lists
 */
class ConfigService {
  constructor() {
    this.dataDir = process.env.DATA_DIR || './data';
    this.configFile = path.join(this.dataDir, 'config.json');
    this.ensureDataDir();
  }

  async ensureDataDir() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      console.error('Error creating data directory:', error);
    }
  }

  /**
   * Load configuration from file
   */
  async loadConfig() {
    try {
      const data = await fs.readFile(this.configFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Return default config if file doesn't exist
      return {
        servers: [],
        activeServerId: null
      };
    }
  }

  /**
   * Save configuration to file
   */
  async saveConfig(config) {
    try {
      await this.ensureDataDir();
      await fs.writeFile(this.configFile, JSON.stringify(config, null, 2));
      return { success: true };
    } catch (error) {
      console.error('Error saving config:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add or update a server configuration
   */
  async addServer(serverConfig) {
    const config = await this.loadConfig();

    const server = {
      id: serverConfig.id || Date.now().toString(),
      name: serverConfig.name,
      url: serverConfig.url,
      userNonce: serverConfig.userNonce,
      userKey: serverConfig.userKey,
      createdAt: new Date().toISOString()
    };

    const existingIndex = config.servers.findIndex(s => s.id === server.id);
    if (existingIndex >= 0) {
      config.servers[existingIndex] = server;
    } else {
      config.servers.push(server);
    }

    // Set as active if it's the first server
    if (!config.activeServerId && config.servers.length === 1) {
      config.activeServerId = server.id;
    }

    await this.saveConfig(config);
    return { success: true, server };
  }

  /**
   * Get all server configurations
   */
  async getServers() {
    const config = await this.loadConfig();
    // Return servers without exposing userKey
    return config.servers.map(s => ({
      id: s.id,
      name: s.name,
      url: s.url,
      userNonce: s.userNonce,
      createdAt: s.createdAt
    }));
  }

  /**
   * Get a specific server configuration
   */
  async getServer(serverId) {
    const config = await this.loadConfig();
    const server = config.servers.find(s => s.id === serverId);
    return server || null;
  }

  /**
   * Delete a server configuration
   */
  async deleteServer(serverId) {
    const config = await this.loadConfig();
    config.servers = config.servers.filter(s => s.id !== serverId);

    if (config.activeServerId === serverId) {
      config.activeServerId = config.servers.length > 0 ? config.servers[0].id : null;
    }

    await this.saveConfig(config);
    return { success: true };
  }

  /**
   * Set active server
   */
  async setActiveServer(serverId) {
    const config = await this.loadConfig();
    const server = config.servers.find(s => s.id === serverId);

    if (!server) {
      return { success: false, error: 'Server not found' };
    }

    config.activeServerId = serverId;
    await this.saveConfig(config);
    return { success: true, server };
  }

  /**
   * Get active server configuration
   */
  async getActiveServer() {
    const config = await this.loadConfig();
    if (!config.activeServerId) {
      return null;
    }
    return config.servers.find(s => s.id === config.activeServerId) || null;
  }
}

export default new ConfigService();
