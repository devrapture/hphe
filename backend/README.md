# HPHE Designer API

FastAPI service and pure-Python effectiveness-NTU calculation engine for the
HPHE Designer MVP. See the repository root README for full setup and formulas.

## Run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000` and its interactive docs at
`http://localhost:8000/docs`.

## Test

```bash
pytest
```
