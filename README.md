# Unity Tools

A modern, intuitive web-based toolbox for Avigilon Unity Web Endpoint API. This application provides a comprehensive interface for interacting with Avigilon Unity systems, including camera management, alarm monitoring, event tracking, and webhook configuration.

## Features

- **Web-Based UI**: Modern, responsive interface built with React and Material-UI
- **Authentication**: Secure Nonce/Key-based authentication with encrypted credential storage
- **API Designer**: Generate API calls in multiple formats (cURL, PowerShell, CMD, JavaScript, Python)
- **Camera Management**: View and manage camera devices
- **Alarm Monitoring**: Track and manage system alarms
- **Event Search**: Query and analyze system events
- **Webhook Configuration**: Set up and manage event subscriptions
- **Configuration Storage**: Save and manage multiple server configurations with encrypted credentials
- **Docker Support**: Easy deployment with Docker and docker-compose

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React + Material-UI + Vite
- **Security**: AES-256-GCM credential encryption
- **Containerization**: Docker + Docker Compose
- **Platform**: Ubuntu Server 22.04 (compatible)

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Access to an Avigilon Unity Web Endpoint server
- User Nonce and User Key credentials

### Automated Setup (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd UnityTools
```

2. Run the setup script:
```bash
./setup.sh
```

This will automatically:
- Generate a secure SESSION_SECRET
- Create the .env file with proper configuration
- Provide next steps for launching the application

3. Start the application:
```bash
docker-compose up -d
```

4. Access the application:
- Open your browser to `http://localhost` or `http://your-server-ip`

### Manual Setup

If you prefer manual setup or the script doesn't work:

1. Clone the repository:
```bash
git clone <repository-url>
cd UnityTools
```

2. Generate a secure secret:
```bash
openssl rand -hex 32
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` and set the SESSION_SECRET to the generated value:
```bash
nano .env
# Set: SESSION_SECRET=<your-generated-secret-here>
```

5. Start the application:
```bash
docker-compose up -d
```

6. Access the application:
- Open your browser to `http://localhost` or `http://your-server-ip`

### First-Time Login

1. Navigate to the login page
2. Enter your Avigilon Unity Web Endpoint details:
   - Server URL (e.g., `https://10.192.192.158:8443`)
   - User Nonce
   - User Key
3. Optionally save the configuration for future use (credentials are encrypted before storage)
4. Click "Login"

## Manual Installation (Without Docker)

### Backend Setup

```bash
cd backend
npm install

# Create and configure .env
cp .env.example .env
# Generate SESSION_SECRET: openssl rand -hex 32
# Edit .env and set SESSION_SECRET

npm start
```

The backend will start on port 3001.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend development server will start on port 3000.

For production build:
```bash
npm run build
# Serve the dist/ folder with nginx or similar
```

## Usage

### API Designer

The API Designer tool allows you to:
1. Browse 95+ available Unity Web Endpoint API endpoints by category
2. Select an endpoint and configure parameters/request body
3. Generate code in multiple formats:
   - cURL (Linux/Mac)
   - PowerShell (Windows)
   - CMD (Windows)
   - JavaScript (ES Modules)
   - Python
4. Copy the generated code to use in your own scripts

### Configuration Management

- Navigate to **Configuration** to manage multiple server profiles
- Add, edit, or delete server configurations
- Switch between different Unity servers easily
- Credentials are encrypted at rest using AES-256-GCM

### Camera Operations

- View all connected cameras
- Check camera status and details
- Access camera information through the Unity Web Endpoint

### Alarm Monitoring

- View active alarms in real-time
- Monitor alarm severity (Critical, High, Medium) with color-coded indicators
- Check alarm status and source information

### Event Search

- Search for system events by time range and type
- Filter events by various criteria
- View detailed event information

### Webhooks

- Create webhook subscriptions for event notifications
- Manage existing webhooks
- Configure event types and destinations

### Direct Camera Access

- Coming soon: Direct camera API access for advanced features not available through Web Endpoint

## Authentication & Security

Unity Tools implements multiple layers of security:

### Authentication Flow
1. The User Nonce and User Key are provided by the Unity administrator
2. Authentication hash is computed as: `SHA256(userNonce + SHA256(userKey))`
3. Session tokens are managed automatically with 24-hour expiration
4. Sessions are stored server-side with secure cookies

### Credential Encryption
- User Keys are encrypted before storage using AES-256-GCM
- Encryption key is derived from SESSION_SECRET
- Credentials are automatically decrypted when needed
- Plaintext credentials never touch the filesystem

### Best Practices
1. **SESSION_SECRET**: Must be set to a cryptographically secure random value
2. **HTTPS**: Always use HTTPS in production (configure reverse proxy)
3. **Credentials**: Never commit .env files or credentials to version control
4. **Network**: Run the application within a secure, firewalled network
5. **Updates**: Keep dependencies updated for security patches

## API Documentation

The application uses the Unity Web Endpoint API v1. The Swagger documentation is included in the repository (`ACCswagger 2.json`).

Base path: `/mt/api/rest/v1`

Key endpoint categories:
- Cameras (list, details, snapshots)
- Alarms (active, history, management)
- Events (search, types)
- Webhooks (CRUD operations)
- Sites and system information
- And 90+ more endpoints

For complete API documentation, see: https://docs.avigilon.com/bundle/web-endpoint-api/page/wep-routes.htm

## Troubleshooting

### Application Won't Start

```bash
# Check if SESSION_SECRET is set
docker-compose config

# View detailed logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild if needed
docker-compose down
docker-compose up -d --build
```

### Authentication Fails

- Verify User Nonce and User Key are correct
- Ensure server URL is accessible and includes protocol (https://)
- Check time synchronization (NTP) - Unity requires <5 minute time drift
- Verify firewall rules allow connection to port 8443
- Confirm credentials have appropriate permissions in Unity

### Docker Issues

```bash
# Check container status
docker-compose ps

# View backend logs
docker-compose logs backend

# View frontend logs
docker-compose logs frontend

# Restart specific service
docker-compose restart backend

# Complete rebuild
docker-compose down -v
docker-compose up -d --build
```

### Connection Refused / Network Errors

- Ensure Unity Web Endpoint is running and accessible
- Test connectivity: `curl -k https://your-unity-server:8443/mt/api/rest/v1`
- Check network connectivity and routing
- Verify port 8443 is not blocked by firewall
- Confirm Unity Web Endpoint is enabled in Unity system settings

### Credential Decryption Errors

If you see errors about decryption:
- Ensure SESSION_SECRET in .env matches the secret used when credentials were encrypted
- If you changed SESSION_SECRET, you must re-save all server configurations
- Delete `data/config.json` and re-add servers through the UI

## Development

### Project Structure

```
UnityTools/
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication & session management
│   │   ├── routes/        # Express API routes
│   │   ├── services/      # Business logic & Unity API client
│   │   └── server.js      # Express server entry point
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API clients & service layer
│   │   ├── App.jsx        # Main application component
│   │   └── main.jsx       # React entry point
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docs/                  # Additional documentation
│   ├── INSTALLATION.md
│   ├── USAGE.md
│   └── API.md
├── data/                  # Runtime data (gitignored)
├── docker-compose.yml
├── setup.sh              # Automated setup script
└── README.md
```

### Running in Development Mode

Backend (with auto-reload):
```bash
cd backend
npm install
cp .env.example .env
# Set SESSION_SECRET in .env
npm run dev
```

Frontend (with HMR):
```bash
cd frontend
npm install
npm run dev
```

### Adding New Features

1. Backend routes: Add to `backend/src/routes/`
2. Frontend pages: Add to `frontend/src/pages/`
3. API services: Extend `unityService.js` or create new service
4. Update navigation: Modify `frontend/src/components/Layout.jsx`

## Documentation

- [Installation Guide](docs/INSTALLATION.md) - Detailed installation instructions
- [Usage Guide](docs/USAGE.md) - Comprehensive usage documentation
- [API Reference](docs/API.md) - Backend API endpoints
- [Avigilon WEP API Docs](https://docs.avigilon.com/bundle/web-endpoint-api/)

## Contributing

This is a custom tool built for specific use cases. Contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commit messages
4. Submit a pull request

Please ensure:
- Code follows existing style and patterns
- Security best practices are maintained
- No credentials or secrets are committed

## License

MIT License - See LICENSE file for details

## Support

For issues related to:
- **Unity Web Endpoint API**: Contact Avigilon support or consult official documentation
- **This application**: Submit an issue in the GitHub repository
- **Ubuntu deployment**: Refer to Ubuntu Server 22.04 documentation
- **Docker**: Refer to Docker documentation

## Roadmap

- [ ] Direct camera API access (bypassing Web Endpoint)
- [ ] Advanced reporting and analytics dashboard
- [ ] Multi-site management interface
- [ ] Role-based access control (RBAC)
- [ ] Bulk operations and batch processing
- [ ] Scheduled tasks and automation framework
- [ ] Export configurations and generated scripts
- [ ] Support for additional vendor APIs (Genetec, Milestone)
- [ ] Real-time event streaming via WebSockets
- [ ] Mobile-responsive improvements

## Credits

Built from scratch as a modern, web-based toolbox for Avigilon Unity Web Endpoint API, with focus on:
- Security (encrypted credential storage, secure session management)
- User Experience (intuitive UI, code generation, multi-format support)
- Extensibility (modular architecture, comprehensive API coverage)
- Reliability (error handling, session management, health checks)

All code written specifically for this project with no reused components from previous implementations.
