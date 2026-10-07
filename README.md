# HPHE Designer MVP

HPHE Designer is a small web application that demonstrates a real thermal
calculation for a heat pipe heat exchanger. A Next.js engineering dashboard
collects air-stream and geometry inputs, sends them to FastAPI, and displays
results from a pure-Python effectiveness-NTU model.

> **Engineering Demo / MVP:** This project demonstrates software architecture
> and basic thermal calculations. It is not a validated or certified commercial
> heat-exchanger design package.

## Architecture

```text
hphe/
├── backend/
│   ├── app/
│   │   ├── api/calculation.py       # POST /calculate
│   │   ├── engineering/hphe.py      # Pure thermal calculation
│   │   ├── main.py                  # FastAPI app and CORS
│   │   └── schemas.py               # Validated request/response models
│   └── tests/test_hphe.py
└── frontend/
    └── src/
        ├── app/                     # Next.js app router
        ├── components/              # Dashboard, chart, and schematic
        ├── lib/api.ts               # Typed API client
        └── types/hphe.ts            # Shared frontend data shapes
```

The browser calls a same-origin Next.js route, which forwards calculation
requests to FastAPI. This keeps the backend private in production while all
engineering equations remain in `backend/app/engineering/hphe.py`, separate
from HTTP and UI code.

## Engineering method

The model uses constant air specific heat:

```text
Cp = 1005 J/kg·K
```

The total external pipe area and heat-capacity rates are:

```text
D = diameter_mm / 1000
A = N π D L
C_hot = m_hot Cp
C_cold = m_cold Cp
C_min = min(C_hot, C_cold)
C_max = max(C_hot, C_cold)
Cr = C_min / C_max
NTU = U A / C_min
```

Counterflow effectiveness is calculated with:

```text
ε = [1 - exp(-NTU(1-Cr))] / [1 - Cr exp(-NTU(1-Cr))]
```

When `Cr` is approximately 1, the numerically stable limiting form is used:

```text
ε = NTU / (1 + NTU)
```

Heat duty and outlet temperatures are then:

```text
Q_max = C_min (T_hot,in - T_cold,in)
Q = ε Q_max
T_hot,out = T_hot,in - Q / C_hot
T_cold,out = T_cold,in + Q / C_cold
```

## Assumptions

- Steady-state operation
- Constant air specific heat of 1005 J/kg·K
- Constant overall heat-transfer coefficient
- No heat loss to the environment
- Uniform heat-pipe geometry
- Idealized counterflow effectiveness-NTU model
- No pressure-drop calculation
- No detailed heat-pipe operating-limit analysis
- No phase-change fluid-property model

## Run locally

### Backend

Python 3.9 or newer is required.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

FastAPI runs at [http://localhost:8000](http://localhost:8000). Run the backend
tests with `pytest` from the `backend` directory.

### Frontend

In another terminal:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Next.js runs at [http://localhost:3000](http://localhost:3000). The server-side
API proxy uses `HPHE_API_URL=http://localhost:8000` by default. Set it in
`.env.local` when the backend is hosted elsewhere. It is intentionally not a
`NEXT_PUBLIC_` variable because the backend address is never needed in browser
JavaScript.

## Containers

Each service has an independent production Dockerfile. The frontend image uses
Next.js standalone output and listens on port 3000. The backend image runs as a
non-root user and listens on `PORT`, defaulting to 8000.

Build the images from the repository root:

```bash
docker build -t hphe-api ./backend
docker build -t hphe-frontend ./frontend
```

Run them locally on one Docker network:

```bash
docker network create hphe-network
docker run --rm --name hphe-api --network hphe-network -p 8000:8000 hphe-api
docker run --rm --name hphe-frontend --network hphe-network \
  -e HPHE_API_URL=http://hphe-api:8000 -p 3000:3000 hphe-frontend
```

Open [http://localhost:3000](http://localhost:3000). Both images include health
checks and use unprivileged runtime users.

## Deploy to Vercel

The root `vercel.json` defines two independently built services:

- `frontend`: the public Next.js service, routed at `/(.*)`
- `backend`: an internal FastAPI service with no direct public rewrite

The frontend owns the public `/api/calculate` route. That server-side Next.js
route forwards requests to FastAPI through a Vercel service binding. Vercel
injects the backend URL into the frontend runtime as `HPHE_API_URL`; do not add
that variable manually in the Vercel dashboard. The browser never receives the
internal backend URL.

After importing the Git repository as a Vercel project, Vercel detects the root
manifest and builds both services. To run the same multi-service routing model
locally with the Vercel CLI, use:

```bash
vercel dev -L
```

The `HPHE_API_URL=http://localhost:8000` fallback remains available for the
two-terminal local workflow documented above.

## Deploy to StackShift

The root `stackshift.yaml` describes one StackShift application with:

- `frontend`: public Next.js web service, root directory `frontend`, port 3000
- `api`: private FastAPI web service, root directory `backend`, port 8000
- a service binding that supplies the API address to the frontend as
  `HPHE_API_URL`

Push the repository to GitHub, create an application in StackShift, and use its
Import tab to load `stackshift.yaml`. Preview the import, confirm the two service
root directories and ports, then deploy. StackShift will use each service's
Dockerfile in place of automatic framework detection. No database or persistent
storage is required.

## API example

```bash
curl --request POST http://localhost:8000/calculate \
  --header 'Content-Type: application/json' \
  --data '{
    "hot_inlet_temp": 120,
    "cold_inlet_temp": 30,
    "hot_mass_flow": 2.5,
    "cold_mass_flow": 3.0,
    "number_of_pipes": 40,
    "pipe_diameter_mm": 25,
    "pipe_length_m": 1.2,
    "u_value": 60
  }'
```

Invalid geometry, non-positive flow, or a hot inlet temperature that is not
above the cold inlet temperature receives a structured FastAPI validation
response without exposing a Python stack trace.

## Limitations

This deliberately narrow MVP does not model pressure drop, heat-pipe working
fluid, phase-change behavior, pipe material limits, capillary/sonic/boiling/
entrainment limits, fouling, transient behavior, or detailed exchanger
geometry. The chart is a linear interpolation between calculated inlet and
outlet values and is intended only as a visual aid.
