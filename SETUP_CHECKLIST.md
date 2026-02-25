# ✅ Complete Setup Checklist

Use this checklist to ensure all components are properly set up and running.

## Phase 1: Prerequisites Installation

- [ ] **Node.js 16+**
  - [ ] Downloaded from https://nodejs.org/
  - [ ] Verified: `node --version` (v16 or higher)
  - [ ] Verified: `npm --version` (npm 8+)

- [ ] **Python 3.8+**
  - [ ] Downloaded from https://www.python.org/
  - [ ] Added to PATH during installation
  - [ ] Verified: `python3 --version` (3.8 or higher)
  - [ ] Verified: `pip --version`

- [ ] **Git** (optional for version control)
  - [ ] Downloaded from https://git-scm.com/
  - [ ] Verified: `git --version`

## Phase 2: Project Setup

- [ ] **Clone or Download Project**
  - [ ] Project located in: `d:\Cverra\Cverra-Job-Recruitment-Platform\`
  - [ ] All directories present:
    - [ ] `backend/`
    - [ ] `frontend/`
    - [ ] `ml-services/`
    - [ ] `firebase/`

- [ ] **Firebase Configuration**
  - [ ] Firebase service account key obtained
  - [ ] Saved to: `firebase/serviceAccountKey.json`
  - [ ] File is NOT in .gitignore (protected from commits)

- [ ] **Environment Files**
  - [ ] Created: `backend/.env`
  - [ ] Created: `frontend/.env` (if needed)
  - [ ] Contains all required variables:
    - [ ] `JWT_SECRET`
    - [ ] `ML_ROLE_PREDICTION_URL=http://localhost:6000`
    - [ ] `ML_JOB_RECOMMEND_URL=http://localhost:5002`
    - [ ] `ML_CV_RANKING_URL=http://localhost:8002`

## Phase 3: ML Services Setup

### Installation
- [ ] Navigated to `ml-services/` directory
- [ ] **Windows Users:**
  - [ ] Confirmed Python is installed
  - [ ] Ran: `start-services.bat`
  - [ ] Verified 3 new command windows opened
- [ ] **Mac/Linux Users:**
  - [ ] Made script executable: `chmod +x start-services.sh`
  - [ ] Ran: `./start-services.sh`
  - [ ] Verified background process started

### Verification
- [ ] Model files created:
  - [ ] `ml-services/role-prediction/model.pkl` exists
  - [ ] `ml-services/role-prediction/vectorizer.pkl` exists
  - [ ] `ml-services/role-prediction/label_encoder.pkl` exists

- [ ] Services Running:
  - [ ] Role Prediction at `http://localhost:6000/health` → responds ✓
  - [ ] Job Recommendation at `http://localhost:5002/health` → responds ✓
  - [ ] CV Ranking at `http://localhost:8002/health` → responds ✓

- [ ] **Optional ML Services Test:**
  - [ ] Ran: `python3 test-services.py`
  - [ ] All 3 services reported "healthy"

- [ ] **Backups Ready (Optional):**
  - [ ] Noted ML services startup commands for quick restart
  - [ ] Created script to stop services

## Phase 4: Backend Setup

### Installation
- [ ] Navigated to `backend/` directory
- [ ] Ran: `npm install`
- [ ] All dependencies installed successfully ✓

### Configuration
- [ ] Verified `backend/.env` exists with:
  ```env
  PORT=3000
  NODE_ENV=development
  JWT_SECRET=<your-secret>
  ML_ROLE_PREDICTION_URL=http://localhost:6000
  ML_JOB_RECOMMEND_URL=http://localhost:5002
  ML_CV_RANKING_URL=http://localhost:8002
  FIREBASE_PROJECT_ID=<your-project-id>
  FIREBASE_PRIVATE_KEY=<your-private-key>
  FIREBASE_CLIENT_EMAIL=<your-client-email>
  ```

### Startup
- [ ] Ran: `npm run dev`
- [ ] Backend listening on `http://localhost:3000`
- [ ] Verified startup message:
  ```
  Server running on port 3000
  ```

### Health Check
- [ ] Tested: `curl http://localhost:3000/health-check`
- [ ] Response: `{ "status": "Backend running" }`
- [ ] Tested: `curl http://localhost:3000/health-check/full`
- [ ] Response includes all 3 ML services as "healthy"

## Phase 5: Frontend Setup

### Installation
- [ ] Navigated to `frontend/` directory
- [ ] Ran: `npm install`
- [ ] All dependencies installed successfully ✓

### Configuration
- [ ] Verified `frontend/.env` (if exists)
- [ ] Contains API URL: `VITE_API_URL=http://localhost:3000/api`
- [ ] Firebase config present in `frontend/src/firebase/firebaseConfig.js`

### Startup
- [ ] Ran: `npm run dev`
- [ ] Frontend dev server started
- [ ] Browser automatically opened to `http://localhost:5173`
- [ ] **OR** manually opened: `http://localhost:5173`

### Verification
- [ ] Page loads without errors
- [ ] Navigation bar visible
- [ ] "Login" and "Register" buttons visible
- [ ] No console errors (check browser DevTools: F12)

## Phase 6: Authentication Test

- [ ] **Test Registration:**
  - [ ] Clicked "Register"
  - [ ] Filled in form with:
    - Email: `test@example.com`
    - Password: `TestPassword123`
    - Role: Selected one (Job Seeker / Employer / Admin)
  - [ ] Successfully registered
  - [ ] Redirected to dashboard or login

- [ ] **Test Login:**
  - [ ] Clicked "Login"
  - [ ] Entered credentials
  - [ ] Successfully logged in
  - [ ] Redirected to dashboard

## Phase 7: Feature Tests

### Test 1: Profile Update
- [ ] Navigated to Profile
- [ ] Updated profile information
- [ ] Saved changes successfully
- [ ] Changes persisted after refresh

### Test 2: CV Upload & Auto-Enhancement (Job Seeker)
- [ ] Went to Dashboard
- [ ] Uploaded a PDF CV with text:
  ```
  python machine learning tensorflow keras
  5 years experience in AI/ML development
  ```
- [ ] ✓ **Verify:** Profile auto-updated with:
  - Detected skills
  - Predicted role
  - ML service processed the CV

### Test 3: Job Recommendations
- [ ] Went to "Recommended Jobs" section
- [ ] ✓ **Verify:** Jobs displayed from ML service
- [ ] ✓ **Verify:** Jobs ranked by compatibility

### Test 4: Job Application
- [ ] Clicked on a job posting
- [ ] Filled any required information
- [ ] Selected a CV to submit
- [ ] Clicked "Apply"
- [ ] ✓ **Verify:** Application created
- [ ] ✓ **Verify:** Auto-scored based on profile match

### Test 5: Employer/Admin Views (if applicable)
- [ ] Login as Employer account
  - [ ] Can view "Post Job" option
  - [ ] Can create new job posting
  - [ ] Can view applicants
  - [ ] Can view analytics
- [ ] Login as Admin account (if available)
  - [ ] Can access Admin Dashboard
  - [ ] Can view all users
  - [ ] Can view statistics

## Phase 8: Troubleshooting & Recovery

### If ML Services Won't Start
- [ ] [ ] Checked Python installation: `python3 --version`
- [ ] [ ] Verified ports available:
  - Windows: `netstat -ano | findstr :6000`
  - Mac/Linux: `lsof -i :6000`
- [ ] [ ] Ran requirements install: `pip install -r requirements.txt`
- [ ] [ ] Checked model files exist
- [ ] [ ] Restarted startup script

### If Backend Won't Connect
- [ ] [ ] Verified backend `.env` has correct ML service URLs
- [ ] [ ] Backend restarted: `npm run dev`
- [ ] [ ] Tested health endpoint: `curl http://localhost:3000/health-check/full`
- [ ] [ ] Checked backend logs for errors

### If Frontend Won't Load
- [ ] [ ] Cleared cache: `npm run dev` (fresh start)
- [ ] [ ] Cleared browser cache (Ctrl+Shift+Delete)
- [ ] [ ] Checked frontend `.env` is correct
- [ ] [ ] Verified API_URL points to `http://localhost:3000/api`
- [ ] [ ] Browser console (F12) shows no errors

### If Services Keep Crashing
- [ ] [ ] Checked all ports are not in use
- [ ] [ ] Checked firewall not blocking ports
- [ ] [ ] Looked at service logs:
  - Windows: Check command window output
  - Mac/Linux: `tail -f ml-services/logs/*.log`

## Phase 9: Production Considerations

- [ ] **Security Review:**
  - [ ] Changed default JWT_SECRET
  - [ ] Updated Firebase project settings
  - [ ] Reviewed CORS settings in backend
  - [ ] Set node_modules in .gitignore

- [ ] **Performance:**
  - [ ] Frontend build size acceptable (~340KB gzipped)
  - [ ] Backend response times acceptable (<1s for most endpoints)
  - [ ] ML service predictions responsive (<3s)

- [ ] **Monitoring:**
  - [ ] Health check endpoint accessible
  - [ ] Error logging configured
  - [ ] ML service fallbacks working (graceful degradation)

## Phase 10: Documentation & Handoff

- [ ] [ ] Read [QUICKSTART.md](../QUICKSTART.md) for quick reference
- [ ] [ ] Read [README_COMPLETE.md](../README_COMPLETE.md) for detailed architecture
- [ ] [ ] Read [ml-services/SETUP.md](../ml-services/SETUP.md) for ML details
- [ ] [ ] Created startup script shortcuts for easy restart
- [ ] [ ] Documented any custom changes made
- [ ] [ ] Shared project access/credentials with team (if applicable)

## ✅ Final Checks

Run this final verification:

```bash
# Terminal 1: Check ML Services
cd ml-services
python3 test-services.py
# Expected: All 3 services healthy

# Terminal 2: Check Backend
curl http://localhost:3000/health-check/full
# Expected: Overall status "healthy"

# Terminal 3: Check Frontend
# Open http://localhost:5173
# Expected: Page loads without errors
```

---

## 🎉 You're Ready!

All checks passed? Congratulations! Your Cverra platform is fully operational.

### Quick Commands for Future Use

**Start Everything (Windows):**
```bash
cd ml-services && start-services.bat
cd backend && npm run dev
cd frontend && npm run dev
```

**Start Everything (Mac/Linux):**
```bash
cd ml-services && ./start-services.sh
cd backend && npm run dev
cd frontend && npm run dev
```

**Stop ML Services:**
- Windows: Run `stop-services.bat` in ml-services directory
- Mac/Linux: Run `./stop-services.sh` in ml-services directory

### Useful URLs

| Component | URL |
|-----------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api |
| Backend Health | http://localhost:3000/health-check |
| ML Health | http://localhost:3000/health-check/full |
| Role Prediction | http://localhost:6000 |
| Job Recommendation | http://localhost:5002 |
| CV Ranking | http://localhost:8002 |

---

**Happy recruiting! 🚀**

*Last Updated: 2024*
