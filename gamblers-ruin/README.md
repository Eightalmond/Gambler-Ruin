# gamblers-ruin

## Run With Docker

From the project root:

```bash
docker compose up --build
```

Then open:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:8000/health`

To stop everything:

```bash
Ctrl+C
```

## Backend

1. Change into the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the FastAPI server:

```bash
uvicorn main:app --reload
```

## Frontend

1. Change into the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the Vite dev server:

```bash
npm run dev
```
