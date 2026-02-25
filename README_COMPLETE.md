# Cverra Job Recruitment Platform

A comprehensive job recruitment platform combining modern web technologies with machine learning services for intelligent candidate matching and job recommendations.

## Architecture Overview

```
Frontend (React + Vite)
    ↓
Backend (Node.js + Express)
    ↓
┌─────────┬──────────────┬──────────┐
│         │              │          │
Firestore ML Services  Storage
    ↑     (3 Flask APIs)
    │     │    │    │
Role Prediction, Job Recommendation, CV Ranking
```

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: CSS3 with theme support
- **Authentication**: JWT + Firebase Auth
- **State Management**: React Context
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Google Firestore
- **Storage**: Google Cloud Storage
- **Authentication**: Firebase Admin SDK + JWT
- **PDF Processing**: pdf-parse for CV extraction

### ML Services
- **Runtime**: Python 3.8+
- **ML Framework**: scikit-learn
- **Web Framework**: Flask
- **Data Processing**: Pandas, NumPy, SciPy

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+ and pip
- Google Firebase project with credentials
- Git

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/Cverra-Job-Recruitment-Platform.git
cd Cverra-Job-Recruitment-Platform
```

### 2. Setup Firebase

1. Create Firebase project at [firebase.google.com](https://firebase.google.com)
2. Download service account key
3. Place at `firebase/serviceAccountKey.json`
4. Update frontend config in `frontend/src/firebase/firebaseConfig.js`

### 3. Setup ML Services

```bash
cd ml-services

# Windows
start-services.bat

# Mac/Linux
chmod +x start-services.sh
./start-services.sh
```

See [ML Services Setup Guide](ml-services/SETUP.md) for detailed instructions.

### 4. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

Backend runs on `http://localhost:3000`

### 5. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

### 6. Verify Everything is Running

```bash
# Check backend + ML services health
curl http://localhost:3000/health-check/full
```

You should see all services marked as "healthy".

## Project Structure

```
Cverra-Job-Recruitment-Platform/
├── backend/                          # Express.js backend
│   ├── src/
│   │   ├── app.js                   # Main app setup
│   │   ├── controllers/             # Route handlers
│   │   ├── models/                  # Data models
│   │   ├── routes/                  # API routes
│   │   ├── services/                # Business logic
│   │   │   ├── firestoreService.js
│   │   │   ├── mlJobRecommendService.js
│   │   │   ├── mlHealthCheck.js
│   │   │   ├── mlCVRankingService.js
│   │   │   └── storageService.js
│   │   ├── middlewares/             # Auth, error handling
│   │   ├── config/                  # Configuration
│   │   └── utils/                   # Utilities (PDF extraction)
│   ├── server.js
│   └── package.json
│
├── frontend/                         # React + Vite frontend
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── pages/                   # Page components
│   │   ├── context/                 # React Context
│   │   ├── services/                # API calls
│   │   ├── firebase/                # Firebase config
│   │   └── App.jsx
│   ├── vite.config.js
│   └── package.json
│
├── ml-services/                      # Python ML services
│   ├── role-prediction/             # Role prediction service (port 6000)
│   ├── job-recommendation/          # Job recommendation service (port 5002)
│   ├── cv-ranking/                  # CV ranking service (port 8002)
│   ├── train_model.py               # Model training script
│   ├── requirements.txt             # Python dependencies
│   ├── start-services.bat           # Windows startup
│   ├── start-services.sh            # Unix/Mac startup
│   ├── stop-services.bat            # Windows stop
│   ├── stop-services.sh             # Unix/Mac stop
│   └── SETUP.md                     # ML services documentation
│
└── firebase/
    └── serviceAccountKey.json       # Firebase credentials (git ignored)
```

## Key Features

### Role-Based Access Control
- **Admin**: Manage users, jobs, analytics
- **Employer**: Post jobs, view applicants, analytics
- **Job Seeker**: Search jobs, apply, manage profile

### Intelligent CV Processing
- Automatic text extraction from PDFs
- Skill detection from CV content
- Role prediction using ML
- Automatic profile enhancement

### ML-Powered Matching
- **Role Prediction**: Predict job roles from CV text
- **Job Recommendations**: Suggest jobs based on candidate profile
- **CV Ranking**: Rank candidates for specific jobs

### Real-time Features
- Live application tracking
- Instant job recommendations
- Auto-profile enhancement

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout

### Jobs
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/:jobId` - Get job details
- `GET /api/jobs/recommended` - Get recommended jobs
- `POST /api/jobs` - Create job (employer)
- `PUT /api/jobs/:jobId` - Update job
- `DELETE /api/jobs/:jobId` - Delete job

### Applications
- `GET /api/applications` - Get user applications
- `POST /api/applications/apply/:jobId` - Apply to job
- `PUT /api/applications/:appId/status` - Update application status

### Profile
- `GET /api/profile/me` - Get current user profile
- `GET /api/profile/:userId` - Get user profile
- `PATCH /api/profile/update` - Update profile
- `POST /api/cv/upload` - Upload CV

### Health Check
- `GET /health-check` - Backend health
- `GET /health-check/full` - Backend + ML services health

## ML Services

### Role Prediction Service (Port 6000)
Predicts job roles from CV text using TF-IDF vectorization and Random Forest classifier.

**Endpoint**: `POST http://localhost:6000/predict`

### Job Recommendation Service (Port 5002)
Recommends jobs based on candidate profile.

**Endpoint**: `POST http://localhost:5002/recommend`

### CV Ranking Service (Port 8002)
Ranks CVs for job postings.

**Endpoint**: `POST http://localhost:8002/rank`

See [ML Services Setup Guide](ml-services/SETUP.md) for detailed ML documentation.

## Environment Variables

### Backend (.env)
```env
PORT=3000
NODE_ENV=development

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-email@project.iam.gserviceaccount.com

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d

# ML Services URLs
ML_ROLE_PREDICTION_URL=http://localhost:6000
ML_JOB_RECOMMEND_URL=http://localhost:5002
ML_CV_RANKING_URL=http://localhost:8002

# Storage
GCS_BUCKET_NAME=your-bucket-name
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_CONFIG=your-config
```

## Development Workflow

### Terminal 1: ML Services
```bash
cd ml-services
./start-services.sh  # or start-services.bat on Windows
```

### Terminal 2: Backend
```bash
cd backend
npm run dev
```

### Terminal 3: Frontend
```bash
cd frontend
npm run dev
```

Then open http://localhost:5173 in your browser.

## Building for Production

### Frontend
```bash
cd frontend
npm run build
# Output in dist/
```

### Backend
```bash
cd backend
npm install --production
# Use process manager (PM2) for production
pm2 start server.js --name cverra
```

### ML Services
```bash
cd ml-services
# Use systemd, Docker, or supervisor for production
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### ML Services Tests
```bash
cd ml-services
python -m pytest
```

## Troubleshooting

### ML Services won't start
- Ensure Python 3.8+ is installed
- Check ports 6000, 5002, 8002 are available
- See [ML Services Troubleshooting](ml-services/SETUP.md#troubleshooting)

### Backend can't connect to ML services
- Verify ML services are running: `curl http://localhost:6000/health`
- Check environment variables in backend/.env
- Check firewall/network settings

### Firebase connection issues
- Verify credentials at firebase/serviceAccountKey.json
- Check Firestore database is initialized
- Verify Google Cloud project settings

### Frontend build errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear vite cache: `rm -rf .vite`
- Check Node version: `node --version` (should be 16+)

## Performance Optimization

- Frontend: Vite ensures fast development builds (~340KB)
- Backend: Firestore provides real-time database
- ML Services: Models cached in memory, vectorization optimized
- Caching: JWT tokens, CV text extraction results cached

## Security

- JWT authentication on all protected routes
- Role-based access control (RBAC)
- Firebase Admin SDK for backend auth
- Environment variables for sensitive data
- PDF validation and virus scanning ready

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check [ML Services Documentation](ml-services/SETUP.md)
2. Review API documentation
3. Check existing issues on GitHub
4. Create new issue with detailed description

## Roadmap

- [ ] Advanced filtering and search
- [ ] Video interview integration
- [ ] Team collaboration features
- [ ] Advanced analytics dashboards
- [ ] Mobile app (React Native)
- [ ] Kubernetes deployment
- [ ] GraphQL API
- [ ] Real-time notifications (Socket.io)

## Contributors

- Your Name (@yourprofile)

## Changelog

### Version 1.0.0
- Initial release
- Complete backend/frontend alignment
- ML services integration
- Full RBAC implementation
- CV processing with ML enhancement
