#!/bin/bash

# Unity Tools Setup Script
# This script helps you configure the application for first-time use

set -e

echo "======================================"
echo "Unity Tools - Initial Setup"
echo "======================================"
echo ""

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Generate SESSION_SECRET
echo "Generating secure SESSION_SECRET..."
SESSION_SECRET=$(openssl rand -hex 32)

if [ -z "$SESSION_SECRET" ]; then
    echo "❌ Failed to generate SESSION_SECRET"
    echo "Please install openssl or generate a random string manually"
    exit 1
fi

# Create .env file
cat > .env << ENVEOF
# Environment Variables for Unity Tools
# Generated on: $(date)

# Session secret for backend authentication and credential encryption
SESSION_SECRET=$SESSION_SECRET

# Optional: Specify custom ports
# BACKEND_PORT=3001
# FRONTEND_PORT=80
ENVEOF

echo "✅ .env file created successfully"
echo ""
echo "======================================"
echo "Next Steps:"
echo "======================================"
echo "1. Review and edit .env if needed"
echo "2. Start the application:"
echo "   - With Docker: docker-compose up -d"
echo "   - Manual: See docs/INSTALLATION.md"
echo "3. Access the web interface at http://localhost"
echo ""
echo "For more information, see docs/INSTALLATION.md"
echo ""
