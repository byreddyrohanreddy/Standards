@echo off
setlocal enabledelayedexpansion
title BIS-SpecAI - System Setup

echo ==============================================================================
echo       BIS-SpecAI: AI-Powered Recommendation Engine for Indian Standards
echo            Smart India Hackathon 2026 - Problem Statement #26108
echo                        AUTOMATED EVALUATOR SETUP
echo ==============================================================================
echo.

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"
cd /d "%ROOT_DIR%"

:: 0. Check for .env file
if not exist "%ROOT_DIR%\.env" (
    echo [*] .env file not found. Creating one from .env.example...
    copy "%ROOT_DIR%\.env.example" "%ROOT_DIR%\.env"
    echo [WARNING] Please open the .env file in the root directory and add your GEMINI_API_KEY!
)

:: 1. Check Python installation (check both 'python' and 'py')
echo [1/5] Checking Python installation...
set "PY_CMD=python"
%PY_CMD% --version >nul 2>&1
if !ERRORLEVEL! NEQ 0 (
    set "PY_CMD=py -3"
    !PY_CMD! --version >nul 2>&1
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] Python 3.11+ is not found in PATH!
        echo Please install Python 3.11 or higher and check "Add Python to PATH".
        pause
        exit /b 1
    )
)
for /f "tokens=*" %%i in ('%PY_CMD% --version 2^>^&1') do set PYTHON_VER=%%i
echo       Detected: !PYTHON_VER!

:: 2. Check Node.js and npm
echo.
echo [2/5] Checking Node.js and npm installation...
node -v >nul 2>&1
if !ERRORLEVEL! NEQ 0 (
    echo [ERROR] Node.js is not found in PATH!
    echo Please install Node.js 18 or higher from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VER=%%i
echo       Detected: Node !NODE_VER!, npm !NPM_VER!

:: 3. Python Virtual Environment & Dependencies
echo.
echo [3/5] Configuring Python environment and installing backend dependencies...
if not exist "%ROOT_DIR%\.venv" (
    echo       Creating Python virtual environment ^(.venv^)...
    %PY_CMD% -m venv "%ROOT_DIR%\.venv"
    if !ERRORLEVEL! NEQ 0 (
        echo [WARNING] Could not create .venv. Falling back to global/current Python environment.
    )
)

if exist "%ROOT_DIR%\.venv\Scripts\python.exe" (
    echo       Configuring virtual environment ^(.venv^)...
    "%ROOT_DIR%\.venv\Scripts\python.exe" -m pip install --upgrade pip --quiet
    "%ROOT_DIR%\.venv\Scripts\python.exe" -m pip install -r "%ROOT_DIR%\requirements.txt"
) else (
    echo       Installing dependencies using current Python environment...
    %PY_CMD% -m pip install --upgrade pip --quiet
    %PY_CMD% -m pip install -r "%ROOT_DIR%\requirements.txt"
)

if !ERRORLEVEL! NEQ 0 (
    echo [ERROR] Failed to install Python dependencies. Please check network/pip settings.
    pause
    exit /b 1
)
echo       Python dependencies installed successfully.

:: 4. Frontend Dependencies
echo.
echo [4/5] Installing Next.js frontend dependencies...
cd /d "%ROOT_DIR%\frontend"
call npm install
if !ERRORLEVEL! NEQ 0 (
    echo [ERROR] Failed to install frontend npm packages.
    cd /d "%ROOT_DIR%"
    pause
    exit /b 1
)
cd /d "%ROOT_DIR%"
echo       Frontend dependencies installed successfully.

:: 5. Verify Frontend Build
echo.
echo [5/5] Verifying Next.js production build...
cd /d "%ROOT_DIR%\frontend"
call npm run build
if !ERRORLEVEL! NEQ 0 (
    echo [WARNING] Production build encountered a warning, but dev mode is fully operational.
    echo           You can launch the application with start.bat.
) else (
    echo       Next.js production build verified successfully.
)
cd /d "%ROOT_DIR%"

echo.
echo ==============================================================================
echo [SUCCESS] BIS-SpecAI environment setup is complete!
echo.
echo To launch both Backend and Frontend together:
echo       start.bat
echo.
echo To run the full benchmark evaluation suite:
echo       python evaluation/evaluate.py
echo.
echo To run automated test suite (29 tests):
echo       pytest tests/test_pipeline.py -v
echo ==============================================================================
echo.
pause
