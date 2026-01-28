# Usage Guide

Comprehensive guide for using Unity Tools.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Dashboard](#dashboard)
4. [API Designer](#api-designer)
5. [Camera Management](#camera-management)
6. [Alarm Monitoring](#alarm-monitoring)
7. [Event Search](#event-search)
8. [Webhook Configuration](#webhook-configuration)
9. [Configuration Management](#configuration-management)
10. [Best Practices](#best-practices)

## Getting Started

### Initial Login

1. Navigate to the application URL (e.g., `http://your-server-ip`)
2. You'll be presented with the login screen
3. Enter your Unity Web Endpoint credentials:
   - **Server URL**: The full URL of your Unity Web Endpoint (e.g., `https://10.192.192.158:8443`)
   - **User Nonce**: Provided by your Unity administrator
   - **User Key**: Provided by your Unity administrator
   - **Server Name**: (Optional) A friendly name for this configuration
4. Check "Save these credentials" to store for future use
5. Click "Login"

### Navigation

The application uses a sidebar navigation menu with the following sections:
- **Dashboard**: Overview and quick stats
- **API Designer**: Generate API code snippets
- **Cameras**: Camera management
- **Alarms**: Alarm monitoring
- **Events**: Event search and analysis
- **Webhooks**: Webhook configuration
- **Direct Camera Access**: (Coming soon) Direct camera API
- **Configuration**: Manage server configurations

## Authentication

### How Authentication Works

Unity Tools uses the Avigilon Web Endpoint authentication mechanism:

1. The application computes an authentication hash using your User Nonce and User Key
2. A session token is obtained from the Unity Web Endpoint
3. The session is maintained for 24 hours (or until you log out)
4. All subsequent API calls use this session token

### Managing Sessions

- Sessions are automatically maintained while you're using the application
- You can log out at any time using the "Logout" button in the sidebar
- If your session expires, you'll be automatically redirected to the login page

### Multiple Server Configurations

Unity Tools allows you to save and manage multiple Unity server configurations:

1. Login with different credentials
2. Check "Save these credentials" during login
3. Use the Configuration page to manage saved servers
4. Select a saved server from the dropdown on the login page

## Dashboard

The Dashboard provides an overview of your Unity system:

- **Camera Count**: Total number of cameras
- **Active Alarms**: Current alarm count
- **Webhooks**: Number of configured webhooks
- **Sites**: Number of sites in your system

The dashboard automatically refreshes statistics when you navigate to it.

## API Designer

The API Designer is a powerful tool for exploring and generating code for Unity Web Endpoint API calls.

### Using the API Designer

1. **Select a Category**: Choose from categories like Cameras, Alarms, Events, etc.
2. **Select an Endpoint**: Pick a specific API endpoint from the category
3. **Configure Request**:
   - For POST/PUT/PATCH requests, enter JSON request body
   - Review the endpoint description and parameters
4. **Choose Output Format**:
   - **cURL**: Linux/Mac command-line format
   - **PowerShell**: Windows PowerShell format
   - **CMD**: Windows Command Prompt format (using curl)
   - **JavaScript**: Node.js with axios
   - **Python**: Python with requests library
5. **Generate Code**: Click "Generate Code"
6. **Copy Code**: Click the copy icon to copy to clipboard

### Example: Getting Camera List

1. Select "Camera" category
2. Choose "GET /cameras"
3. Select "cURL" format
4. Click "Generate Code"
5. The generated code will include:
   - Full URL with base path
   - Authorization header with your session token
   - SSL certificate handling

### Using Generated Code

The generated code is ready to use in your scripts or command line. You can:
- Copy and paste directly into your terminal
- Save to a script file for automation
- Integrate into your existing applications
- Modify parameters as needed

## Camera Management

### Viewing Cameras

1. Navigate to **Cameras** from the sidebar
2. The application will display all cameras registered in your Unity system
3. Information shown includes:
   - Camera ID
   - Camera Name
   - Status (online/offline)
   - Model
   - Location

### Refreshing Camera List

- Click the "Refresh" button to update the camera list
- The list automatically loads when you navigate to the page

### Camera Operations

For advanced camera operations:
1. Use the **API Designer** to generate code for:
   - Getting camera snapshots
   - Controlling PTZ cameras
   - Triggering recordings
   - Adjusting camera settings

## Alarm Monitoring

### Viewing Active Alarms

1. Navigate to **Alarms** from the sidebar
2. All active alarms are displayed in a table
3. Information includes:
   - Alarm ID
   - Type
   - Severity (color-coded)
   - Source
   - Timestamp
   - Status

### Alarm Severity Levels

- **Critical**: Red - Requires immediate attention
- **High**: Orange - Important, needs prompt response
- **Medium**: Blue - Moderate priority
- **Low**: Default - Informational

### Managing Alarms

For alarm management operations:
1. Use the **API Designer** to generate code for:
   - Acknowledging alarms
   - Dismissing alarms
   - Getting alarm details
   - Searching alarm history

## Event Search

The Event Search feature allows you to query system events.

### Searching Events

1. Navigate to **Events** from the sidebar
2. Configure search parameters:
   - **Start Time**: Begin date/time for search
   - **End Time**: End date/time for search
   - **Event Type**: Filter by specific event types (Motion, Login, etc.)
3. Click "Search Events"
4. Results are displayed in a table

### Event Types

Common event types include:
- Motion detection
- User login/logout
- Camera connection changes
- Recording events
- System alerts
- Configuration changes

### Exporting Event Data

To export event data:
1. Use the **API Designer** to generate a search query
2. Modify the output format to suit your needs
3. Run the generated code to save results to a file

## Webhook Configuration

Webhooks allow Unity to send real-time event notifications to your external systems.

### Creating a Webhook

1. Navigate to **Webhooks** from the sidebar
2. Click "Add Webhook"
3. Enter webhook details:
   - **Name**: Friendly name for the webhook
   - **Webhook URL**: Your endpoint URL (must be accessible from Unity server)
   - **Event Type**: Type of events to subscribe to
4. Click "Add"

### Managing Webhooks

- **View**: All configured webhooks are listed in a table
- **Delete**: Click the delete icon to remove a webhook
- **Refresh**: Click "Refresh" to update the list

### Webhook Event Types

Configure webhooks for:
- Motion events
- Alarm events
- Camera status changes
- System events
- Custom event types

### Webhook Payload

Webhooks will receive HTTP POST requests with JSON payloads containing event details.

## Configuration Management

### Managing Saved Servers

1. Navigate to **Configuration** from the sidebar
2. All saved server configurations are displayed
3. Operations:
   - **Add**: Create new server configuration
   - **Activate**: Set a server as the active one
   - **Delete**: Remove a server configuration

### Adding a Server Configuration

1. Click "Add Server"
2. Enter details:
   - Server Name
   - Server URL
   - User Nonce
   - User Key (stored securely)
3. Click "Add"

### Security Notes

- User Keys are stored securely and never displayed
- Only User Nonce is shown in the configuration list
- Configurations are stored locally in the application's data directory
- Use appropriate file system permissions to protect the data directory

## Best Practices

### Security

1. **Use HTTPS**: Always access the application over HTTPS in production
2. **Secure Credentials**:
   - Never share your User Nonce and User Key
   - Use different credentials for different users
   - Rotate keys periodically
3. **Network Security**:
   - Run the application within a secure network
   - Use firewall rules to restrict access
   - Consider VPN access for remote users

### Performance

1. **Refresh Wisely**: Don't refresh data too frequently
2. **Event Searches**: Use specific time ranges for better performance
3. **API Designer**: Test generated code in a non-production environment first

### Workflow Tips

1. **Save Configurations**: Save server configurations to avoid re-entering credentials
2. **Use API Designer**: Before writing custom scripts, use the API Designer to test endpoints
3. **Bookmark URLs**: Bookmark the application URL for quick access
4. **Check Dashboard**: Review the dashboard regularly for system overview

### Automation

1. **Generate Scripts**: Use API Designer to create automation scripts
2. **Schedule Tasks**: Use cron jobs or Task Scheduler to run scripts periodically
3. **Webhook Integration**: Set up webhooks to trigger automated responses
4. **Monitor Alarms**: Create scripts to monitor alarms and send notifications

### Troubleshooting

If you encounter issues:

1. **Check Authentication**:
   - Verify credentials are correct
   - Ensure session hasn't expired
   - Check time synchronization (NTP)

2. **Check Connectivity**:
   - Verify Unity server is accessible
   - Check firewall rules
   - Confirm network connectivity

3. **Check Logs**:
   - Backend logs: `docker-compose logs backend`
   - Browser console: F12 Developer Tools
   - Unity server logs

4. **Test API Calls**:
   - Use API Designer to test individual endpoints
   - Verify API responses
   - Check for error messages

## Advanced Features

### Direct API Proxy

Unity Tools provides a generic proxy endpoint for any Unity API call:

- Endpoint: `/api/unity/proxy/*`
- Supports all HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Automatically includes authentication
- Example: `/api/unity/proxy/cameras` proxies to `/mt/api/rest/v1/cameras`

### Custom Scripts

You can create custom scripts using the generated code:

1. Generate code using API Designer
2. Save to a file (e.g., `get-cameras.sh`, `backup-config.ps1`)
3. Make executable (Linux): `chmod +x get-cameras.sh`
4. Run: `./get-cameras.sh`

### Integration

Unity Tools can be integrated with:
- Monitoring systems (Prometheus, Grafana)
- Automation platforms (Ansible, Terraform)
- Notification services (Slack, email)
- Custom applications

## Support and Resources

### Documentation

- **README.md**: Overview and quick start
- **INSTALLATION.md**: Detailed installation instructions
- **API.md**: API endpoint reference
- **Swagger Documentation**: Included in repository

### Getting Help

1. Check the documentation first
2. Review error messages and logs
3. Test with API Designer
4. Submit an issue if you find a bug

### Avigilon Resources

- Unity Web Endpoint API Documentation
- Avigilon Support Portal
- Unity Administrator Guide

## Appendix

### Keyboard Shortcuts

- **Ctrl/Cmd + K**: Focus search (when available)
- **Esc**: Close dialogs

### Browser Compatibility

Unity Tools is compatible with:
- Chrome/Edge (Chromium) - Recommended
- Firefox
- Safari

### Mobile Access

The interface is responsive and works on mobile devices, though a desktop browser is recommended for the best experience.
