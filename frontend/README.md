# Frontend (React + Vite)

## Backend Integration Setup

1. Create a `.env` file in `frontend/`.
2. Add:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

You can copy from `.env.example`.

## Run

- Start backend first (`backend/`):
	- `npm install`
	- `npm run dev`
- Start frontend (`frontend/`):
	- `npm install`
	- `npm run dev`

Frontend now calls backend APIs for:
- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Jobs list: `GET /api/jobs`
- Post job (employer): `POST /api/jobs`
