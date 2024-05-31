@echo off
start "" /D "frontend" cmd /c "npm run start"
start "" /D "backend\Server" cmd /c "uvicorn main:app --reload"
