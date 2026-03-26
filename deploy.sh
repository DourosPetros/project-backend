#!/bin/bash
# deploy.sh - Deployment script for Ticketing System Backend

echo "🚀 Starting Ticketing System Backend Deployment..."
echo ""

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
  echo "❌ Installation failed"
  exit 1
fi

# Step 2: Initialize database
echo "🗄️  Initializing database..."
npm run init-db
if [ $? -ne 0 ]; then
  echo "❌ Database initialization failed"
  exit 1
fi

# Step 3: Start server
echo ""
echo "✅ Deployment successful!"
echo "🚀 Starting server..."
npm start
