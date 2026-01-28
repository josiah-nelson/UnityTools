import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

/**
 * Load and parse Swagger documentation
 */
let swaggerCache = null;

async function loadSwaggerDoc() {
  if (swaggerCache) {
    return swaggerCache;
  }

  try {
    const swaggerPath = path.join(process.cwd(), '../ACCswagger 2.json');
    const data = await fs.readFile(swaggerPath, 'utf-8');
    swaggerCache = JSON.parse(data);
    return swaggerCache;
  } catch (error) {
    console.error('Error loading Swagger doc:', error);
    return null;
  }
}

/**
 * GET /api/designer/endpoints
 * Get all API endpoints from Swagger documentation
 */
router.get('/endpoints', async (req, res) => {
  try {
    const swagger = await loadSwaggerDoc();

    if (!swagger) {
      return res.status(404).json({
        success: false,
        error: 'Swagger documentation not found'
      });
    }

    const endpoints = [];

    // Parse Swagger paths
    for (const [path, methods] of Object.entries(swagger.paths || {})) {
      for (const [method, details] of Object.entries(methods)) {
        if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
          endpoints.push({
            path: path,
            method: method.toUpperCase(),
            summary: details.summary || '',
            description: details.description || '',
            operationId: details.operationId || '',
            parameters: details.parameters || [],
            requestBody: details.requestBody || null,
            responses: details.responses || {},
            tags: details.tags || []
          });
        }
      }
    }

    res.json({
      success: true,
      endpoints: endpoints,
      basePath: swagger.basePath || '/mt/api/rest/v1',
      host: swagger.host || ''
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/designer/endpoint-categories
 * Get endpoints grouped by category/tag
 */
router.get('/endpoint-categories', async (req, res) => {
  try {
    const swagger = await loadSwaggerDoc();

    if (!swagger) {
      return res.status(404).json({
        success: false,
        error: 'Swagger documentation not found'
      });
    }

    const categories = {};

    for (const [path, methods] of Object.entries(swagger.paths || {})) {
      for (const [method, details] of Object.entries(methods)) {
        if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
          const tags = details.tags || ['Other'];

          tags.forEach(tag => {
            if (!categories[tag]) {
              categories[tag] = [];
            }

            categories[tag].push({
              path: path,
              method: method.toUpperCase(),
              summary: details.summary || '',
              operationId: details.operationId || ''
            });
          });
        }
      }
    }

    res.json({
      success: true,
      categories: categories
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/designer/generate-code
 * Generate code snippet for API call
 */
router.post('/generate-code', async (req, res) => {
  try {
    const { endpoint, method, parameters, body, format, serverUrl, token } = req.body;

    if (!endpoint || !method || !format) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: endpoint, method, format'
      });
    }

    const baseUrl = serverUrl || 'https://your-server:8443';
    const fullUrl = `${baseUrl}/mt/api/rest/v1${endpoint}`;
    const authToken = token || 'YOUR_AUTH_TOKEN';

    let code = '';

    switch (format.toLowerCase()) {
      case 'curl':
        code = generateCurl(fullUrl, method, parameters, body, authToken);
        break;
      case 'powershell':
        code = generatePowerShell(fullUrl, method, parameters, body, authToken);
        break;
      case 'cmd':
        code = generateCmd(fullUrl, method, parameters, body, authToken);
        break;
      case 'javascript':
        code = generateJavaScript(fullUrl, method, parameters, body, authToken);
        break;
      case 'python':
        code = generatePython(fullUrl, method, parameters, body, authToken);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Unsupported format. Use: curl, powershell, cmd, javascript, or python'
        });
    }

    res.json({
      success: true,
      code: code
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Code generation functions
 */

function generateCurl(url, method, params, body, token) {
  let cmd = `curl -X ${method} "${url}"`;

  if (params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    cmd = `curl -X ${method} "${url}?${queryString}"`;
  }

  cmd += ` \\\n  -H "Authorization: Bearer ${token}"`;
  cmd += ` \\\n  -H "Content-Type: application/json"`;

  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    const bodyStr = JSON.stringify(body, null, 2).replace(/\n/g, '\n    ');
    cmd += ` \\\n  -d '${bodyStr}'`;
  }

  cmd += ` \\\n  -k`;

  return cmd;
}

function generatePowerShell(url, method, params, body, token) {
  let code = `$headers = @{\n    "Authorization" = "Bearer ${token}"\n    "Content-Type" = "application/json"\n}\n\n`;

  if (params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    url = `${url}?${queryString}`;
  }

  code += `$uri = "${url}"\n\n`;

  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    code += `$body = @'\n${JSON.stringify(body, null, 2)}\n'@\n\n`;
    code += `Invoke-RestMethod -Uri $uri -Method ${method} -Headers $headers -Body $body -SkipCertificateCheck`;
  } else {
    code += `Invoke-RestMethod -Uri $uri -Method ${method} -Headers $headers -SkipCertificateCheck`;
  }

  return code;
}

function generateCmd(url, method, params, body, token) {
  // CMD/Windows version using curl (available in Windows 10+)
  let cmd = `curl -X ${method} "${url}"`;

  if (params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    cmd = `curl -X ${method} "${url}?${queryString}"`;
  }

  cmd += ` ^\n  -H "Authorization: Bearer ${token}"`;
  cmd += ` ^\n  -H "Content-Type: application/json"`;

  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    const bodyStr = JSON.stringify(body).replace(/"/g, '\\"');
    cmd += ` ^\n  -d "${bodyStr}"`;
  }

  cmd += ` ^\n  -k`;

  return cmd;
}

function generateJavaScript(url, method, params, body, token) {
  let code = `const axios = require('axios');\nconst https = require('https');\n\n`;

  if (params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    url = `${url}?${queryString}`;
  }

  code += `const config = {\n`;
  code += `  method: '${method.toLowerCase()}',\n`;
  code += `  url: '${url}',\n`;
  code += `  headers: {\n`;
  code += `    'Authorization': 'Bearer ${token}',\n`;
  code += `    'Content-Type': 'application/json'\n`;
  code += `  },\n`;

  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    code += `  data: ${JSON.stringify(body, null, 2).replace(/\n/g, '\n  ')},\n`;
  }

  code += `  httpsAgent: new https.Agent({ rejectUnauthorized: false })\n`;
  code += `};\n\n`;
  code += `axios(config)\n`;
  code += `  .then(response => console.log(response.data))\n`;
  code += `  .catch(error => console.error(error));`;

  return code;
}

function generatePython(url, method, params, body, token) {
  let code = `import requests\nimport json\n\n`;

  code += `url = "${url}"\n\n`;

  code += `headers = {\n`;
  code += `    "Authorization": "Bearer ${token}",\n`;
  code += `    "Content-Type": "application/json"\n`;
  code += `}\n\n`;

  if (params && Object.keys(params).length > 0) {
    code += `params = ${JSON.stringify(params, null, 2).replace(/\n/g, '\n')}\n\n`;
  }

  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    code += `data = ${JSON.stringify(body, null, 2).replace(/\n/g, '\n')}\n\n`;
    code += `response = requests.${method.toLowerCase()}(url, headers=headers, json=data, verify=False)\n`;
  } else if (params) {
    code += `response = requests.${method.toLowerCase()}(url, headers=headers, params=params, verify=False)\n`;
  } else {
    code += `response = requests.${method.toLowerCase()}(url, headers=headers, verify=False)\n`;
  }

  code += `print(response.json())`;

  return code;
}

export default router;
