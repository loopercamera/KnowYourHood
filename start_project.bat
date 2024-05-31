@REM @echo off

REM Start the frontend
start "" /D "frontend" cmd /c "npm run start"

REM Activate the virtual environment and start the backend
call  KnowYourHoodEnv\Scripts\activate
cd backend\Server
start "" uvicorn main:app --reload



