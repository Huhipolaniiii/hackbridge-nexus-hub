
@echo off
echo Starting HackBridge Desktop Application...

:: Check if running from a network drive (UNC path)
IF "%~d0"=="\\" (
  :: If running from UNC path, copy to local temp folder and run from there
  echo Network path detected, copying to local drive...
  MD "%TEMP%\HackBridge" 2>nul
  XCOPY "%~dp0*" "%TEMP%\HackBridge\" /E /I /Y
  cd /d "%TEMP%\HackBridge"
) ELSE (
  :: Running from local path
  cd /d "%~dp0"
)

:: Check if Node.js is installed
where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
  echo Node.js is not installed or not in PATH.
  echo Please install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

:: Install dependencies if node_modules doesn't exist
IF NOT EXIST node_modules (
  echo Installing dependencies...
  call npm install
)

:: Run the application
echo Starting application...
call npm run electron:dev

pause
