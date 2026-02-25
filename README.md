# Cverra Job Recruitment Platform

A comprehensive job recruitment platform combining modern web technologies with ML-powered intelligent candidate matching and job recommendations.

## 🎉 Project Complete! 

**All components integrated, tested, and documented.**

→ [**📄 PROJECT_COMPLETE.md**](PROJECT_COMPLETE.md) - See full completion summary

## 🚀 Quick Start

**Get everything running in 5 minutes!**

→ [📖 QUICKSTART.md](QUICKSTART.md) - Fast setup guide

Or follow the complete setup with verification:

→ [✅ SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) - Step-by-step with checks

## 📚 Documentation

- [**PROJECT_COMPLETE.md**](PROJECT_COMPLETE.md) - Completion summary & what's included
- [**ENVIRONMENT_SETUP.md**](ENVIRONMENT_SETUP.md) - First-time setup (Node, Python, Firebase)
- [**QUICKSTART.md**](QUICKSTART.md) - 5-minute quick start
- [**SETUP_CHECKLIST.md**](SETUP_CHECKLIST.md) - Complete setup verification
- [**README_COMPLETE.md**](README_COMPLETE.md) - Full architecture & APIs
- [**ml-services/SETUP.md**](ml-services/SETUP.md) - ML services detailed guide

## Architecture

```
Frontend (React + Vite) → Backend (Express + Firestore) → ML Services (3 Flask APIs)
                                         ↓
                            Firebase Authentication
                                    ↓
                         Google Cloud Storage
```

## ✨ Key Features

- ✅ **Intelligent CV Processing** - Auto-extract skills & predict roles
- ✅ **ML-Powered Matching** - Smart job recommendations
- ✅ **Real-time Scoring** - Auto-rank candidates
- ✅ **Role-Based Access** - Admin, Employer, Job Seeker
- ✅ **Health Monitoring** - Check all services status

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | Google Firestore |
| ML Services | Python + Flask |
| Auth | Firebase + JWT |

## Prerequisites

- Node.js 16+
- Python 3.8+
- Google Firebase project
- ~30 minutes for full setup

## Quick Installation

### Windows
```bash
# Terminal 1: ML Services
cd ml-services && start-services.bat

# Terminal 2: Backend
cd backend && npm install && npm run dev

# Terminal 3: Frontend
cd frontend && npm install && npm run dev
```

### Mac/Linux
```bash
# Terminal 1: ML Services
cd ml-services && chmod +x start-services.sh && ./start-services.sh

# Terminal 2: Backend
cd backend && npm install && npm run dev

# Terminal 3: Frontend
cd frontend && npm install && npm run dev
```

**Then open:** `http://localhost:5173`

## Verify Setup

```bash
# Check all systems healthy
curl http://localhost:3000/health-check/full

# Test ML services
python3 ml-services/test-services.py
```

## Project Structure

```
Cverra-Job-Recruitment-Platform/
├── backend/              # Express.js API
├── frontend/             # React SPA
├── ml-services/          # Python ML (Role, Jobs, CV)
├── firebase/             # Firebase config
├── QUICKSTART.md         # Quick start guide
├── SETUP_CHECKLIST.md    # Setup verification
└── README_COMPLETE.md    # Full docs
```

## ML Services

| Service | Port | Purpose |
|---------|------|---------|
| Role Prediction | 6000 | CV → Predicted role + skills |
| Job Recommendation | 5002 | Profile → Recommended jobs |
| CV Ranking | 8002 | CV → Job match score |

## Troubleshooting

**ML Services won't start?**
- Ensure Python 3.8+ installed: `python3 --version`
- Check ports available: Windows: `netstat -ano | findstr :6000`, Mac/Linux: `lsof -i :6000`
- See [ml-services/SETUP.md](ml-services/SETUP.md#troubleshooting)

**Backend can't connect?**
- Verify ML services running: `python3 ml-services/test-services.py`
- Check backend `.env` has correct ML URLs
- See [QUICKSTART.md](QUICKSTART.md#troubleshooting)

**Frontend errors?**
- Clear cache: `rm -rf node_modules && npm install`
- Check browser console (F12) for errors
- Verify API_URL in `.env`

## Next Steps

1. [**Start the platform** →](QUICKSTART.md)
2. [**Follow setup checklist** →](SETUP_CHECKLIST.md)
3. [**Read full documentation** →](README_COMPLETE.md)
4. [**Configure ML services** →](ml-services/SETUP.md)

## API Endpoints

**Health Check:**
- `GET /health-check` - Backend status
- `GET /health-check/full` - Full system status (includes ML services)

**Auth:**
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

**Jobs:**
- `GET /api/jobs` - List jobs
- `GET /api/jobs/recommended` - ML-recommended jobs
- `POST /api/jobs` - Create (employer)

**Applications:**
- `GET /api/applications` - View applications
- `POST /api/applications/apply/:jobId` - Apply (auto-scored)

**Profile:**
- `GET /api/profile/me` - Current profile
- `PATCH /api/profile/update` - Update profile
- `POST /api/cv/upload` - Upload CV (auto-enhanced)

Full API docs in [README_COMPLETE.md](README_COMPLETE.md#api-endpoints)

## Key Configuration

Update `backend/.env`:
```env
PORT=3000
JWT_SECRET=your-secret-key
ML_ROLE_PREDICTION_URL=http://localhost:6000
ML_JOB_RECOMMEND_URL=http://localhost:5002
ML_CV_RANKING_URL=http://localhost:8002
FIREBASE_PROJECT_ID=your-project-id
```

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing`
5. Open Pull Request

## License

MIT License - see LICENSE file

## Support

1. Check [QUICKSTART.md](QUICKSTART.md#troubleshooting)
2. See [ml-services/SETUP.md](ml-services/SETUP.md#troubleshooting)
3. Read [README_COMPLETE.md](README_COMPLETE.md)
4. Open GitHub issue

---

**🚀 Ready? Start with [QUICKSTART.md](QUICKSTART.md)**
