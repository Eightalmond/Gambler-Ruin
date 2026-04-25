# gamblers-ruin

"a gambler who raises his bet to a fixed fraction of their bankroll when he wins, but does not reduce it when he loses, will inevitably go broke"

The "Question" :
what is the probability you go broke before reaching your goal?

## Key Terms

- **Bankroll (B)** :
Your current capital. You start with some amount, say $1000. Every bet either grows or shrinks it.

- **Target (T)** :
The goal you're trying to reach before going broke. Could be $2000 (double up), or just "survive 1000 trades."

- **Edge (p)** :
The probability your next bet wins

- **Ruin** :
You hit $0. Game over. In trading this means blowing up your account.

- **Bet Size (f)** :
The fraction of your bankroll you risk on each trade.


## Run With Docker

From the project root:

```bash
docker compose up --build
```

If you add a new frontend package later, restart the containers so Docker picks it up:

```bash
docker compose down
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
