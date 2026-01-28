import crypto from 'crypto';
import axios from 'axios';

/**
 * Unity Web Endpoint Authentication Service
 * Handles Nonce/Key-based authentication for Avigilon Unity systems
 */
class UnityAuthService {
  constructor() {
    this.sessions = new Map();
  }

  /**
   * Generate SHA256 hash from input string
   */
  sha256Hash(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  /**
   * Compute authentication hash using userNonce and userKey
   * Formula: SHA256(userNonce + SHA256(userKey))
   */
  computeAuthHash(userNonce, userKey) {
    const keyHash = this.sha256Hash(userKey);
    const combined = userNonce + keyHash;
    return this.sha256Hash(combined);
  }

  /**
   * Authenticate with Unity Web Endpoint and obtain session token
   */
  async authenticate(serverUrl, userNonce, userKey) {
    try {
      // Compute the authentication hash
      const authHash = this.computeAuthHash(userNonce, userKey);

      // Make authentication request to Unity Web Endpoint
      const authUrl = `${serverUrl}/mt/api/rest/v1/authentication`;

      const response = await axios.post(authUrl, {
        userNonce: userNonce,
        computedHash: authHash
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        httpsAgent: new (await import('https')).Agent({
          rejectUnauthorized: false // Allow self-signed certificates
        })
      });

      if (response.data && response.data.token) {
        const sessionData = {
          token: response.data.token,
          serverUrl: serverUrl,
          userNonce: userNonce,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
          authenticated: true
        };

        return {
          success: true,
          session: sessionData
        };
      }

      return {
        success: false,
        error: 'Authentication failed: No token received'
      };

    } catch (error) {
      console.error('Authentication error:', error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Validate if session is still active
   */
  isSessionValid(session) {
    if (!session || !session.token) {
      return false;
    }

    if (Date.now() > session.expiresAt) {
      return false;
    }

    return true;
  }

  /**
   * Create axios instance with authentication headers
   */
  createAuthenticatedClient(session) {
    return axios.create({
      baseURL: session.serverUrl,
      headers: {
        'Authorization': `Bearer ${session.token}`,
        'Content-Type': 'application/json'
      },
      httpsAgent: new (await import('https')).Agent({
        rejectUnauthorized: false
      })
    });
  }
}

export default new UnityAuthService();
