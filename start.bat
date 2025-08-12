@echo off

REM Start backend server in new window
start cmd /k "cd server && dotnet run"

REM Wait a few seconds for backend to start
timeout /t 1 /nobreak >nul

REM Open Swagger UI in default browser
start http://localhost:5209/swagger/index.html

REM Start frontend in current window
cd client
npm start