@echo off
rem ============================================================
rem  Double-click to open index.html DIRECTLY (file:// protocol).
rem
rem  Browsers block ES modules on file:// by default (that is the
rem  red "OPEN VIA A LOCAL SERVER" message). This launcher starts
rem  Edge/Chrome with --allow-file-access-from-files so the page
rem  can load its modules from the local folder.
rem
rem  A dedicated browser profile is used so the flag is honored
rem  even when your normal browser is already running.
rem ============================================================
setlocal
set "BASE=%~dp0"
set "BROWSER="

if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" set "BROWSER=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not defined BROWSER if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" set "BROWSER=C:\Program Files\Microsoft\Edge\Application\msedge.exe"
if not defined BROWSER if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" set "BROWSER=C:\Program Files\Google\Chrome\Application\chrome.exe"
if not defined BROWSER if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" set "BROWSER=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

if not defined BROWSER (
  echo [ERROR] No Edge/Chrome installation found.
  pause
  exit /b 1
)

start "" "%BROWSER%" --allow-file-access-from-files --no-first-run --user-data-dir="%TEMP%\beyond-earth-file-profile" "%BASE%index.html"
endlocal
