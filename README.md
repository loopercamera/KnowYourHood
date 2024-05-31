# KnowYourHood

## requirements

Create virtual Python Environment

```python
python -m venv KnowYourHoodEnv
```

Activate Environment

```python
source KnowYourHoodEnv/Scripts/activate
```

Install necessary packages

```python
pip install -r requirements.txt
```

## Create React App

Navigate to frontend

```bash
cd frontend
```

Install Moduls for the React App

```bash
npm install
```

Start React App

```npm
npm run start
```

Navigate to the uvicorn Server

```bash
cd backend/Server/
```

Start API

```b
uvicorn main:app --reload
```
