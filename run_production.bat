@echo off
setlocal enabledelayedexpansion
title BIS-SpecAI - Production Launcher

echo ==============================================================================
echo       BIS-SpecAI: Production Performance Mode
echo ==============================================================================
echo.

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"
cd /d "%ROOT_DIR%"

if not exist "%ROOT_DIR%\.venv\Scripts\python.exe" (
    echo [*] First-time setup detected. Running setup.bat...
    call "%ROOT_DIR%\setup.bat"
)

echo [*] Checking for orphaned background processes on ports 8000 and 3000...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8000, 3000 -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -gt 0 } | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" >nul 2>&1

:: 1. Start FastAPI Backend
echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8000 using .venv...
start "BIS-SpecAI Backend (FastAPI)" /D "%ROOT_DIR%" cmd /k "call ""%ROOT_DIR%\.venv\Scripts\activate.bat"" && uvicorn backend.main:app --host 127.0.0.1 --port 8000"

:: 2. Build and Start Next.js Frontend in Production Mode
echo [2/2] Building and Launching Next.js Frontend in PRODUCTION mode...
if exist "%ROOT_DIR%\.env" copy /y "%ROOT_DIR%\.env" "%ROOT_DIR%\frontend\.env" >nul
start "BIS-SpecAI Frontend (Production)" /D "%ROOT_DIR%\frontend" cmd /k "if exist .next rmdir /s /q .next & npm install && npm run build && npm start"

echo.
echo ==============================================================================
echo [SERVICES INITIALIZING IN PRODUCTION MODE]
echo ==============================================================================
echo.

:: Wait for backend
powershell -NoProfile -Command "$w=0; while ($w -lt 40) { try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/api/health' -TimeoutSec 2 -UseBasicParsing; if ($r.StatusCode -eq 200) { break } } catch {}; Start-Sleep -Seconds 1; $w++ }"

:: Wait a little longer for Next.js to finish building
echo [*] Waiting for Next.js production build to finish... This may take ~15 seconds on the first run.
ping 127.0.0.1 -n 15 >nul

start http://localhost:3000

echo Both services are actively running.
pause
