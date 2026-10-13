@echo off
rem ============================================================
rem  Double-click to start the local server and open the site
rem  at http://localhost:8080  (full functionality, recommended).
rem
rem  Closing the small server window stops the server.
rem  Phone on the same Wi-Fi: http://<this-PC-IP>:8080
rem  (serve.py prints the exact address.)
rem ============================================================
setlocal
cd /d "%~dp0"

where python >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Python not found on PATH. Install Python 3 first.
  pause
  exit /b 1
)

rem If something is already serving this folder, just open the browser.
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:8080/' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } } catch { exit 1 }; exit 1" >nul 2>nul
if not errorlevel 1 (
  start "" "http://localhost:8080"
  exit /b 0
)

start "beyond-earth server" /min cmd /c "python serve.py"
timeout /t 2 /nobreak >nul
start "" "http://localhost:8080"
endlocal
