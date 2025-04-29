
@echo off
echo Building HackBridge Executable...

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

:: Install dependencies if needed
IF NOT EXIST node_modules (
  echo Installing dependencies...
  call npm install
)

:: Build the application
echo Building application...
call npm run build

:: Build the executable
echo Creating executable...
call npm run electron:build

echo The executable has been created in the release folder.
explorer "release"
pause
