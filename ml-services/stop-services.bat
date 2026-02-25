@echo off
REM Stop ML Services

echo.
echo [*] Stopping ML Services...
echo.

REM Kill all Python processes (be specific to avoid killing unrelated processes)
taskkill /FI "WINDOWTITLE eq Role Prediction Service*" /T /F >nul 2>&1 && echo [OK] Role Prediction Service stopped || echo [ERROR] Failed to stop Role Prediction
taskkill /FI "WINDOWTITLE eq Job Recommendation Service*" /T /F >nul 2>&1 && echo [OK] Job Recommendation Service stopped || echo [ERROR] Failed to stop Job Recommendation
taskkill /FI "WINDOWTITLE eq CV Ranking Service*" /T /F >nul 2>&1 && echo [OK] CV Ranking Service stopped || echo [ERROR] Failed to stop CV Ranking

echo.
echo [OK] All services stopped!
echo.
pause
