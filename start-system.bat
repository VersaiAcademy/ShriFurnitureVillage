@echo off
echo Starting Sri Furniture Village System...
echo.

echo [1/3] Starting Backend Server...
start "Backend Server" cmd /k "cd shrifurniturevillage-backend && npm run dev"

echo [2/3] Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo [3/3] Starting Frontend...
start "Frontend" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting!
echo.
echo 📱 Frontend: http://localhost:5173 (or 5174)
echo 🔧 Backend: http://localhost:5000
echo 👨‍💼 Admin Panel: http://localhost:5173/admin
echo.
echo Admin Login:
echo Email: admin@shrifurniture.com
echo Password: admin123
echo.
pause
