@echo off
title VisitIran - Development Server
echo ========================================
echo    VisitIran Tourism Platform
echo ========================================
echo.

cd /d "%~dp0frontend"

if not exist node_modules (
    echo [INFO] Installing dependencies...
    call npm install
)

echo [INFO] Starting server at http://localhost:3000
echo.
call npm run dev
pause
