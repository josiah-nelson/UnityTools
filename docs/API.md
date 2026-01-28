# API Reference

Unity Tools Backend API documentation.

## Base URL

```
http://localhost:3001/api
```

## Authentication

Most endpoints require authentication. Authentication is handled through session cookies after successful login.

## Endpoints

### Authentication

#### POST /auth/login

Authenticate with Unity Web Endpoint and create a session.

**Request Body:**
```json
{
  "serverUrl": "https://10.192.192.158:8443",
  "userNonce": "your-user-nonce",
  "userKey": "your-user-key",
  "serverName": "Production Server",
  "saveConfig": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication successful"
}
```

#### POST /auth/logout

Clear session and logout.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /auth/status

Check current authentication status.

**Response:**
```json
{
  "authenticated": true,
  "serverUrl": "https://10.192.192.158:8443"
}
```

### Configuration

#### GET /config/servers

Get all saved server configurations.

**Response:**
```json
{
  "success": true,
  "servers": [
    {
      "id": "1640000000000",
      "name": "Production Server",
      "url": "https://10.192.192.158:8443",
      "userNonce": "your-nonce",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /config/servers

Add a new server configuration.

**Request Body:**
```json
{
  "name": "Production Server",
  "url": "https://10.192.192.158:8443",
  "userNonce": "your-nonce",
  "userKey": "your-key"
}
```

**Response:**
```json
{
  "success": true,
  "server": {
    "id": "1640000000000",
    "name": "Production Server",
    "url": "https://10.192.192.158:8443",
    "userNonce": "your-nonce",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### DELETE /config/servers/:id

Delete a server configuration.

**Response:**
```json
{
  "success": true
}
```

#### POST /config/servers/:id/activate

Set a server as the active configuration.

**Response:**
```json
{
  "success": true,
  "server": { /* server object */ }
}
```

#### GET /config/active-server

Get the currently active server configuration.

**Response:**
```json
{
  "success": true,
  "server": {
    "id": "1640000000000",
    "name": "Production Server",
    "url": "https://10.192.192.158:8443",
    "userNonce": "your-nonce"
  }
}
```

### Unity API Operations

All Unity endpoints require authentication.

#### GET /unity/cameras

Get list of all cameras.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "camera-1",
      "name": "Front Door",
      "status": "online",
      "model": "H4 Dome",
      "location": "Main Entrance"
    }
  ],
  "status": 200
}
```

#### GET /unity/camera/:id

Get specific camera details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "camera-1",
    "name": "Front Door",
    "status": "online",
    "model": "H4 Dome"
  },
  "status": 200
}
```

#### GET /unity/camera/:id/snapshot

Get camera snapshot.

**Response:**
```json
{
  "success": true,
  "data": "base64-encoded-image-data",
  "status": 200
}
```

#### GET /unity/alarms

Get active alarms.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "alarm-1",
      "type": "Motion",
      "severity": "High",
      "source": "Front Door",
      "timestamp": "2024-01-01T12:00:00Z",
      "status": "ACTIVE"
    }
  ],
  "status": 200
}
```

#### GET /unity/alarm-history

Get alarm history with optional query parameters.

**Query Parameters:**
- `startTime`: ISO 8601 timestamp
- `endTime`: ISO 8601 timestamp
- `severity`: Alarm severity level

**Response:**
```json
{
  "success": true,
  "data": [ /* alarm objects */ ],
  "status": 200
}
```

#### GET /unity/sites

Get list of sites.

**Response:**
```json
{
  "success": true,
  "data": [ /* site objects */ ],
  "status": 200
}
```

#### POST /unity/events/search

Search for events.

**Request Body:**
```json
{
  "startTime": "2024-01-01T00:00:00Z",
  "endTime": "2024-01-02T00:00:00Z",
  "eventType": "Motion"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "event-1",
      "type": "Motion",
      "source": "Front Door",
      "timestamp": "2024-01-01T12:00:00Z",
      "description": "Motion detected"
    }
  ],
  "status": 200
}
```

#### GET /unity/webhooks

Get all configured webhooks.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "webhook-1",
      "name": "Slack Notifications",
      "url": "https://hooks.slack.com/...",
      "eventType": "Alarm"
    }
  ],
  "status": 200
}
```

#### POST /unity/webhook

Create a new webhook.

**Request Body:**
```json
{
  "name": "Slack Notifications",
  "url": "https://hooks.slack.com/...",
  "eventType": "Alarm"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* webhook object */ },
  "status": 201
}
```

#### DELETE /unity/webhook/:id

Delete a webhook.

**Response:**
```json
{
  "success": true,
  "status": 200
}
```

#### ALL /unity/proxy/*

Generic proxy endpoint for any Unity API call.

**Methods:** GET, POST, PUT, DELETE, PATCH

**Example:** `/api/unity/proxy/cameras` proxies to `/mt/api/rest/v1/cameras`

**Response:**
```json
{
  "success": true,
  "data": { /* API response */ },
  "status": 200
}
```

### API Designer

#### GET /designer/endpoints

Get all available API endpoints from Swagger documentation.

**Response:**
```json
{
  "success": true,
  "endpoints": [
    {
      "path": "/cameras",
      "method": "GET",
      "summary": "Get list of cameras",
      "description": "Returns all cameras in the system",
      "operationId": "getCameras",
      "parameters": [],
      "tags": ["Camera"]
    }
  ],
  "basePath": "/mt/api/rest/v1",
  "host": "10.192.192.158:8443"
}
```

#### GET /designer/endpoint-categories

Get endpoints grouped by category.

**Response:**
```json
{
  "success": true,
  "categories": {
    "Camera": [
      {
        "path": "/cameras",
        "method": "GET",
        "summary": "Get list of cameras",
        "operationId": "getCameras"
      }
    ],
    "Alarm": [ /* alarm endpoints */ ]
  }
}
```

#### POST /designer/generate-code

Generate code snippet for an API call.

**Request Body:**
```json
{
  "endpoint": "/cameras",
  "method": "GET",
  "parameters": {},
  "body": null,
  "format": "curl",
  "serverUrl": "https://10.192.192.158:8443",
  "token": "session-token-here"
}
```

**Supported formats:**
- `curl` - cURL command
- `powershell` - PowerShell script
- `cmd` - Windows CMD with curl
- `javascript` - Node.js with axios
- `python` - Python with requests

**Response:**
```json
{
  "success": true,
  "code": "curl -X GET \"https://10.192.192.158:8443/mt/api/rest/v1/cameras\" \\\n  -H \"Authorization: Bearer token\" \\\n  -H \"Content-Type: application/json\" \\\n  -k"
}
```

## Error Responses

All endpoints may return error responses:

```json
{
  "success": false,
  "error": "Error message here",
  "status": 400
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (not authenticated)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

There is no rate limiting implemented in Unity Tools. However, the Unity Web Endpoint may have its own rate limits.

## CORS

CORS is configured to allow requests from:
- `http://localhost:3000` (development)
- Configured frontend URL

Credentials (cookies) are allowed.

## Session Management

- Sessions are stored in memory (Express session)
- Session duration: 24 hours
- Sessions are cleared on logout
- Session cookie is HTTP-only and secure (in production)
