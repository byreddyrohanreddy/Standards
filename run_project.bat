@echo off
setlocal enabledelayedexpansion
title BIS-SpecAI - Launcher

echo ==============================================================================
echo       BIS-SpecAI: AI-Powered Recommendation Engine for Indian Standards
echo ==============================================================================
echo.

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"
cd /d "%ROOT_DIR%"

if not exist "%ROOT_DIR%\.venv\Scripts\python.exe" (
    echo [*] First-time setup detected. Running setup.bat...
    call "%ROOT_DIR%\setup.bat"
)

:: Clean up any stale/orphaned processes holding port 8000 or 3000
echo [*] Checking for orphaned background processes on ports 8000 and 3000...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8000, 3000 -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -gt 0 } | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" >nul 2>&1
ping 127.0.0.1 -n 2 >nul

:: 1. Start FastAPI Backend in a separate dedicated window using standard .venv
echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8000 using .venv...
start "BIS-SpecAI Backend (FastAPI)" /D "%ROOT_DIR%" cmd /k "call ""%ROOT_DIR%\.venv\Scripts\activate.bat"" && uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

:: 2. Start Next.js Frontend in a separate dedicated window
echo [2/2] Launching Next.js Frontend on http://localhost:3000 ...
if exist "%ROOT_DIR%\.env" copy /y "%ROOT_DIR%\.env" "%ROOT_DIR%\frontend\.env" >nul
start "BIS-SpecAI Frontend (Next.js)" /D "%ROOT_DIR%\frontend" cmd /k "npm install && npm run dev"

echo.
echo ==============================================================================
echo [SERVICES INITIALIZING]
echo.
echo   - Web Application:       http://localhost:3000
echo   - Backend REST API:      http://127.0.0.1:8000
echo   - Interactive API Docs:  http://127.0.0.1:8000/docs
echo   - Health Check:          http://127.0.0.1:8000/api/health
echo.
echo Initializing AI models ^& dense embeddings (sentence-transformers)...
echo ==============================================================================

:: Wait for the backend health check to return HTTP 200 before launching browser
powershell -NoProfile -Command "$w=0; while ($w -lt 40) { try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/api/health' -TimeoutSec 2 -UseBasicParsing; if ($r.StatusCode -eq 200) { Write-Host '       [OK] Backend AI Engine is online and verified.'; break } } catch {}; Start-Sleep -Seconds 1; $w++ }; if ($w -ge 40) { Write-Host '       [INFO] Starting browser...' }"

:: Wait 2 seconds for Next.js compile readiness
ping 127.0.0.1 -n 3 >nul

echo.
echo [READY] Launching web interface in your default browser...
start http://localhost:3000

echo.
echo Both services are actively running in their respective command windows.
echo To stop the application, simply close the Backend and Frontend windows.
echo.
pause
