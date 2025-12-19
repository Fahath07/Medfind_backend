@echo off
echo ========================================
echo   MedFind Backend Server Startup
echo ========================================
echo.

echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    pause
    exit /b 1
)
echo.

echo Checking npm installation...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)
echo.

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    npm install
    echo.
)

echo Starting MedFind Backend Server...
echo Server will run on http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

npm start
