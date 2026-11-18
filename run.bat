@echo off
title DigiGram - Gram Panchayat Galan Budruk Portal
color 0A

echo.
echo  =========================================================
echo   DigiGram - Gram Panchayat Galan Budruk Digital Portal
echo   ग्रामपंचायत गाळण बुद्रुक - डिजिटल प्रशासन पोर्टल
echo  =========================================================
echo.
echo  Starting servers... / सर्व्हर सुरू होत आहेत...
echo.

:: Start Backend Server in a new window
start "DigiGram Backend (Port 5000)" cmd /k "cd /d "%~dp0backend" && echo [Backend] Installing dependencies... && npm install --silent && echo. && echo [Backend] Server starting on http://localhost:5000 && node server.js"

:: Wait 3 seconds for backend to initialize before frontend starts
timeout /t 3 /nobreak >nul

:: Start Frontend Dev Server in a new window
start "DigiGram Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && echo [Frontend] Installing dependencies... && npm install --silent && echo. && echo [Frontend] Dev server starting on http://localhost:5173 && npm run dev"

:: Wait 4 more seconds then open browser
timeout /t 4 /nobreak >nul

echo.
echo  ✅ Both servers are starting up!
echo.
echo  🌐 Frontend : http://localhost:5173
echo  🔧 Backend  : http://localhost:5000
echo.
echo  📋 Default Credentials:
echo     Admin   : admin@grampanchayat.gov.in / Admin@123
echo     Citizen : citizen@example.com / Citizen@123
echo.
echo  Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul

start "" "http://localhost:5173"

echo.
echo  Close this window whenever you want.
echo  To stop servers, close their respective CMD windows.
echo.
pause
