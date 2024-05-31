@echo off
REM Create virtual Python environment
python -m venv KnowYourHoodEnv

REM Activate environment
call KnowYourHoodEnv\Scripts\activate

REM Install necessary Python packages
pip install -r requirements.txt


REM Navigate to frontend directory
cd frontend

REM Install React app modules
npm install


REM Notify user setup is complete
echo Setup is complete. React app and Uvicorn server are running.
pause
