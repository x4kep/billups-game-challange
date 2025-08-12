@echo off
setlocal

REM Start backend in a new window
start "" cmd /k "cd /d %~dp0server && dotnet run"

REM Give backend a moment
timeout /t 1 /nobreak >nul

REM Open Swagger
start "" http://localhost:5209/swagger/index.html

REM Start Vite dev server in a new window
start "" cmd /k "cd /d %~dp0client && npm run dev"

REM Optional: wait a bit then open the app
timeout /t 2 /nobreak >nul
start "" http://localhost:5173/
