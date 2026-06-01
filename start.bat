@echo off
echo ==========================================
echo       Starting AharSetu Application       
echo ==========================================
echo.

:: Launch the Backend Server in a new window
echo [1/2] Starting Express Backend Server...
start "AharSetu Backend" cmd /k "cd server && npm run dev"

:: Launch the Frontend Client in a new window
echo [2/2] Starting React Frontend Client...
start "AharSetu Frontend" cmd /k "cd client && npm run dev"

echo.
echo ==========================================
echo  Servers have been launched in separate 
echo  terminal windows! 
echo  - Backend: http://localhost:5000
echo  - Frontend: http://localhost:5173
echo ==========================================
pause
