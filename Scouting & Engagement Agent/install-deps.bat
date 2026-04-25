@echo off
echo.
echo ========================================
echo Installing Talent Scout Agent Dependencies
echo ========================================
echo.

cd /d "%~dp0"

echo.
echo [1/3] Installing backend dependencies...
cd packages\backend
call npm install openai uuid @types/node
call npm install

echo.
echo [2/3] Installing frontend dependencies...
cd ..\frontend
call npm install

echo.
echo [3/3] Installing root dependencies...
cd ..\..
call npm install

echo.
echo ========================================
echo ✅ Dependencies installed successfully!
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Configure backend environment:
echo    cd packages\backend
echo    copy .env.example .env
echo.
echo 2. Edit packages\backend\.env and add:
echo    OPENAI_API_KEY=your_key_here
echo    PORT=3001
echo.
echo 3. Start development servers:
echo    npm run dev
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo.
pause
