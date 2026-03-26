@echo off
REM deploy.bat - Deployment script for Ticketing System Backend (Windows)

echo.
echo 🚀 Starting Ticketing System Backend Deployment...
echo.

REM Step 1: Install dependencies
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Installation failed
    exit /b 1
)

REM Step 2: Initialize database
echo.
echo 🗄️  Initializing database...
call npm run init-db
if errorlevel 1 (
    echo ❌ Database initialization failed
    exit /b 1
)

REM Step 3: Start server
echo.
echo ✅ Deployment successful!
echo 🚀 Starting server...
echo.
call npm start
