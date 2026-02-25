@echo off
REM ML Services Startup Script for Windows
REM Starts all three ML services in separate windows

setlocal

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 goto :python_missing

REM Get the script directory
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo.
echo ======= Cverra ML Services Startup =======
echo.

REM Install requirements if needed
echo [*] Ensuring Python dependencies...
python -m pip install -q -r requirements.txt
if errorlevel 1 goto :pip_failed

REM Train model if not exists
if not exist "role-prediction\model.pkl" goto :train_model
goto :start_services

:train_model
echo [*] Training role prediction model (first time only)...
python train_model.py
if errorlevel 1 goto :train_failed

:start_services

REM Start Role Prediction Service (Port 6000)
echo.
echo [*] Starting Role Prediction Service (Port 6000)...
start "Role Prediction Service" cmd /k "cd /d role-prediction ^&^& python app.py"
timeout /t 2 /nobreak >nul

REM Start Job Recommendation Service (Port 5002)
echo [*] Starting Job Recommendation Service (Port 5002)...
start "Job Recommendation Service" cmd /k "cd /d job-recommendation ^&^& flask run --port 5002"
timeout /t 2 /nobreak >nul

REM Start CV Ranking Service (Port 8002)
echo [*] Starting CV Ranking Service (Port 8002)...
start "CV Ranking Service" cmd /k "cd /d cv-ranking ^&^& python app.py"
timeout /t 2 /nobreak >nul

echo.
echo [OK] All ML services started!
echo.
echo Services running:
echo   - Role Prediction:     http://localhost:6000
echo   - Job Recommendation:  http://localhost:5002
echo   - CV Ranking:          http://localhost:8002
echo.
echo You can now run the backend and frontend.
echo Keep these windows open while the services are running.
echo.
pause
exit /b 0

:python_missing
echo [ERROR] Python is not installed or not in PATH
pause
exit /b 1

:pip_failed
echo [ERROR] Failed to install dependencies
pause
exit /b 1

:train_failed
echo [ERROR] Model training failed
pause
exit /b 1
