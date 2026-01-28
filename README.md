# Unity Tools

A modern, intuitive web-based toolbox for Avigilon Unity Web Endpoint API. This application provides a comprehensive interface for interacting with Avigilon Unity systems, including camera management, alarm monitoring, event tracking, and webhook configuration.

## Features

- **Web-Based UI**: Modern, responsive interface built with React and Material-UI
- **Authentication**: Secure Nonce/Key-based authentication with session management
- **API Designer**: Generate API calls in multiple formats (cURL, PowerShell, CMD, JavaScript, Python)
- **Camera Management**: View and manage camera devices
- **Alarm Monitoring**: Track and manage system alarms
- **Event Search**: Query and analyze system events
- **Webhook Configuration**: Set up and manage event subscriptions
- **Configuration Storage**: Save and manage multiple server configurations
- **Docker Support**: Easy deployment with Docker and docker-compose

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React + Material-UI + Vite
- **Containerization**: Docker + Docker Compose
- **Platform**: Ubuntu Server 22.04 (compatible)

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Access to an Avigilon Unity Web Endpoint server
- User Nonce and User Key credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd UnityTools
```

2. Create environment file:
```bash
cp .env.example .env
# Edit .env and set SESSION_SECRET to a random value
```

3. Build and start the application:
```bash
docker-compose up -d
```

4. Access the application:
- Open your browser to `http://localhost` or `http://your-server-ip`

### First-Time Setup

1. Navigate to the login page
2. Enter your Avigilon Unity Web Endpoint details:
   - Server URL (e.g., `https://10.192.192.158:8443`)
   - User Nonce
   - User Key
3. Optionally save the configuration for future use
4. Click "Login"

## Manual Installation (Without Docker)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

The backend will start on port 3001.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on port 3000.

For production build:
```bash
npm run build
npm run preview
```

## Usage

### API Designer

The API Designer tool allows you to:
1. Browse available Unity Web Endpoint API endpoints by category
2. Select an endpoint and configure parameters
3. Generate code in multiple formats:
   - cURL (Linux/Mac)
   - PowerShell (Windows)
   - CMD (Windows)
   - JavaScript (Node.js)
   - Python
4. Copy the generated code to use in your own scripts

### Configuration Management

- Navigate to **Configuration** to manage multiple server profiles
- Add, edit, or delete server configurations
- Switch between different Unity servers easily

### Camera Operations

- View all connected cameras
- Check camera status and details
- Access camera information through the Unity Web Endpoint

### Alarm Monitoring

- View active alarms in real-time
- Monitor alarm severity and status
- Access alarm history and details

### Event Search

- Search for system events by time range and type
- Filter events by various criteria
- Export event data for analysis

### Webhooks

- Create webhook subscriptions for event notifications
- Manage existing webhooks
- Configure event types and destinations

## Authentication

Unity Tools uses the Avigilon Web Endpoint authentication mechanism:

1. The User Nonce and User Key are provided by the Unity administrator
2. Authentication hash is computed as: `SHA256(userNonce + SHA256(userKey))`
3. Session tokens are managed automatically
4. Credentials are stored securely (never in plain text)

## API Documentation

The application uses the Unity Web Endpoint API v1. The Swagger documentation is included in the repository (`ACCswagger 2.json`).

Base path: `/mt/api/rest/v1`

Key endpoints:
- `/cameras` - Camera management
- `/alarms` - Alarm monitoring
- `/events/search` - Event queries
- `/webhooks` - Webhook management
- And 90+ more endpoints

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Credentials**: Store User Keys securely, never commit them to version control
3. **Session Secret**: Use a strong, random SESSION_SECRET in production
4. **Network**: Run the application within a secure network
5. **SSL Certificates**: The application accepts self-signed certificates for Unity endpoints

## Troubleshooting

### Authentication Fails

- Verify User Nonce and User Key are correct
- Ensure server URL is accessible
- Check time synchronization (NTP) - Unity requires <5 minute drift
- Verify firewall rules allow connection to port 8443

### Docker Issues

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild containers
docker-compose down
docker-compose up -d --build
```

### Connection Refused

- Ensure Unity Web Endpoint is running
- Check network connectivity
- Verify port 8443 is accessible
- Confirm Unity Web Endpoint is enabled in Unity system

## Development

### Project Structure

```
UnityTools/
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication logic
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── server.js      # Express server
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API clients
│   │   └── App.jsx        # Main app
│   ├── package.json
│   └── Dockerfile
├── docs/                  # Additional documentation
├── docker-compose.yml
└── README.md
```

### Running in Development Mode

Backend:
```bash
cd backend
npm run dev  # Uses --watch flag for auto-reload
```

Frontend:
```bash
cd frontend
npm run dev  # Uses Vite dev server with HMR
```

## Contributing

This is a custom tool built for specific use cases. If you have suggestions or improvements, please submit issues or pull requests.

## License

MIT License - See LICENSE file for details

## Support

For issues related to:
- **Unity Web Endpoint API**: Contact Avigilon support
- **This application**: Submit an issue in the repository
- **Ubuntu deployment**: Refer to Ubuntu Server 22.04 documentation

## Roadmap

- [ ] Direct camera API access (bypassing Web Endpoint)
- [ ] Advanced reporting and analytics
- [ ] Multi-site management
- [ ] Role-based access control
- [ ] Export configurations and scripts
- [ ] Scheduled tasks and automation
- [ ] Support for additional vendor APIs

## Credits

Built from scratch as a modern replacement and enhancement for Unity API tools, focusing on user experience and extensibility.
