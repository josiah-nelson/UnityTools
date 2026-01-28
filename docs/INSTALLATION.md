# Installation Guide

Complete installation instructions for Unity Tools on Ubuntu Server 22.04.

## System Requirements

- **Operating System**: Ubuntu Server 22.04 LTS (or compatible)
- **CPU**: 2+ cores recommended
- **RAM**: 2GB minimum, 4GB recommended
- **Disk Space**: 5GB available space
- **Network**: Access to Avigilon Unity Web Endpoint server

## Installation Methods

### Method 1: Docker Installation (Recommended)

Docker provides the easiest and most reliable installation method.

#### Step 1: Install Docker

```bash
# Update package index
sudo apt update

# Install prerequisites
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
sudo docker --version
```

#### Step 2: Install Docker Compose

```bash
# Docker Compose v2 is included with Docker, verify:
sudo docker compose version

# Alternative: Install standalone docker-compose
sudo apt install -y docker-compose
```

#### Step 3: Clone and Configure Unity Tools

```bash
# Create application directory
sudo mkdir -p /opt/unity-tools
cd /opt/unity-tools

# Clone repository (replace with your repo URL)
git clone <repository-url> .

# Create environment file
cp .env.example .env

# Generate a random session secret
openssl rand -base64 32

# Edit .env file
sudo nano .env
# Set SESSION_SECRET to the generated value
```

#### Step 4: Build and Start

```bash
# Build and start containers
sudo docker-compose up -d

# Verify containers are running
sudo docker-compose ps

# View logs
sudo docker-compose logs -f
```

#### Step 5: Configure Firewall (if enabled)

```bash
# Allow HTTP traffic
sudo ufw allow 80/tcp

# Allow backend API (if accessing directly)
sudo ufw allow 3001/tcp

# Reload firewall
sudo ufw reload
```

#### Step 6: Access the Application

Open your browser and navigate to:
- `http://your-server-ip`
- Or `http://localhost` if accessing from the server

### Method 2: Manual Installation

For users who prefer not to use Docker.

#### Step 1: Install Node.js

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### Step 2: Install Nginx (for frontend)

```bash
sudo apt update
sudo apt install -y nginx
```

#### Step 3: Clone Repository

```bash
sudo mkdir -p /opt/unity-tools
cd /opt/unity-tools
git clone <repository-url> .
```

#### Step 4: Install and Configure Backend

```bash
cd /opt/unity-tools/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit configuration
nano .env
# Set PORT=3001
# Set SESSION_SECRET to a random value
# Set DATA_DIR=/opt/unity-tools/data

# Create data directory
mkdir -p /opt/unity-tools/data
```

#### Step 5: Install and Build Frontend

```bash
cd /opt/unity-tools/frontend

# Install dependencies
npm install

# Build for production
npm run build
```

#### Step 6: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/unity-tools
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-server-ip;

    root /opt/unity-tools/frontend/dist;
    index index.html;

    # API proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/unity-tools /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 7: Create Systemd Service for Backend

```bash
sudo nano /etc/systemd/system/unity-tools-backend.service
```

Add the following:

```ini
[Unit]
Description=Unity Tools Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/unity-tools/backend
Environment="NODE_ENV=production"
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable unity-tools-backend
sudo systemctl start unity-tools-backend
sudo systemctl status unity-tools-backend
```

## Post-Installation

### Verify Installation

1. **Check Docker containers** (Docker method):
```bash
sudo docker-compose ps
```

2. **Check services** (Manual method):
```bash
sudo systemctl status unity-tools-backend
sudo systemctl status nginx
```

3. **Test backend health**:
```bash
curl http://localhost:3001/health
```

4. **Test frontend**:
```bash
curl http://localhost
```

### Security Hardening

1. **Enable HTTPS** (recommended for production):

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

2. **Configure firewall**:

```bash
sudo ufw enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
```

3. **Restrict access** (optional):

Edit Nginx configuration to allow only specific IPs:

```nginx
location / {
    allow 192.168.1.0/24;
    deny all;
    try_files $uri $uri/ /index.html;
}
```

## Updates and Maintenance

### Docker Method

```bash
cd /opt/unity-tools

# Pull latest changes
git pull

# Rebuild and restart
sudo docker-compose down
sudo docker-compose up -d --build
```

### Manual Method

```bash
cd /opt/unity-tools

# Pull latest changes
git pull

# Update backend
cd backend
npm install
sudo systemctl restart unity-tools-backend

# Update frontend
cd ../frontend
npm install
npm run build
sudo systemctl restart nginx
```

## Backup and Recovery

### Backup Configuration

```bash
# Backup data directory
sudo tar -czf unity-tools-backup-$(date +%Y%m%d).tar.gz /opt/unity-tools/data

# Backup .env file
sudo cp /opt/unity-tools/.env /opt/unity-tools/.env.backup
```

### Restore Configuration

```bash
# Restore data
sudo tar -xzf unity-tools-backup-YYYYMMDD.tar.gz -C /

# Restore .env
sudo cp /opt/unity-tools/.env.backup /opt/unity-tools/.env
```

## Troubleshooting

### Docker Issues

```bash
# View logs
sudo docker-compose logs -f backend
sudo docker-compose logs -f frontend

# Restart specific service
sudo docker-compose restart backend

# Complete rebuild
sudo docker-compose down -v
sudo docker-compose up -d --build
```

### Manual Installation Issues

```bash
# Check backend logs
sudo journalctl -u unity-tools-backend -f

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Verify permissions
sudo chown -R www-data:www-data /opt/unity-tools/data
```

### Port Conflicts

If ports 80 or 3001 are already in use:

1. **Docker**: Edit `docker-compose.yml` and change port mappings
2. **Manual**: Edit `.env` for backend, and Nginx config for frontend

## Uninstallation

### Docker Method

```bash
cd /opt/unity-tools
sudo docker-compose down -v
sudo rm -rf /opt/unity-tools
```

### Manual Method

```bash
sudo systemctl stop unity-tools-backend
sudo systemctl disable unity-tools-backend
sudo rm /etc/systemd/system/unity-tools-backend.service
sudo rm /etc/nginx/sites-enabled/unity-tools
sudo rm /etc/nginx/sites-available/unity-tools
sudo systemctl restart nginx
sudo rm -rf /opt/unity-tools
```

## Support

For installation issues:
- Check logs for error messages
- Verify all prerequisites are installed
- Ensure network connectivity to Unity server
- Review Ubuntu Server documentation
