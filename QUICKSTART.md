# 🚀 Cverra - Quick Start Guide (5 Minutes)

Get the entire Cverra Job Recruitment Platform running with ML services in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js
node --version    # Should be 16+

# Check Python
python3 --version # Should be 3.8+

# Check npm
npm --version     # Should be 6+
```

If any are missing, install them first.

## ⚡ Quick Start (Windows)

### Terminal 1: Start ML Services
```bash
cd ml-services
start-services.bat
```

This will automatically:
- Check Python installation ✓
- Install dependencies ✓
- Train the ML model (first time only) ✓
- Start all 3 ML services in separate windows ✓

**Wait 10 seconds for all services to start...**

### Terminal 2: Start Backend
```bash
cd backend
npm install      # First time only
npm run dev
```

Backend will start on `http://localhost:3000`

### Terminal 3: Start Frontend
```bash
cd frontend
npm install      # First time only
npm run dev
```

Frontend will open automatically on `http://localhost:5173`

---

## ⚡ Quick Start (Mac/Linux)

### Terminal 1: Start ML Services
```bash
cd ml-services
chmod +x start-services.sh    # First time only
./start-services.sh
```

This will automatically:
- Check Python installation ✓
- Install dependencies ✓
- Train the ML model (first time only) ✓
- Start all 3 ML services in background ✓

**Wait 10 seconds for all services to start...**

### Terminal 2: Start Backend
```bash
cd backend
npm install      # First time only
npm run dev
```

Backend will start on `http://localhost:3000`

### Terminal 3: Start Frontend
```bash
cd frontend
npm install      # First time only
npm run dev
```

Frontend will open automatically on `http://localhost:5173`

---

## ✅ Verification

### Option 1: Test ML Services Directly
```bash
# In ml-services directory
python3 test-services.py
```

You'll see:
```
SUMMARY
======
Services: 3/3 healthy

✓ All ML services are healthy and ready!
```

### Option 2: Check via Backend Health Endpoint
```bash
curl http://localhost:3000/health-check/full
```

You should see all services marked as "healthy".

---

## 🎯 Test End-to-End Flow

### 1. Register & Login
- Go to `http://localhost:5173`
- Click "Register" → Fill form → Register
- Login with your credentials

### 2. Test CV Upload (Auto-Profile Enhancement)
- Go to Dashboard
- Upload a PDF with text like:
  - "python machine learning tensorflow keras"
  - "5 years experience in AI/ML"
- ✓ Profile auto-updates with detected skills and role prediction

### 3. Test Job Recommendations
- Click "Recommended Jobs"
- See jobs ranked by ML algorithm
- ✓ ML matching works!

### 4. Test Application & Scoring
- Browse jobs
- Click "Apply"
- Select your CV
- ✓ Candidate automatically scored by role matching

---

## 📊 Status Codes

| Service | Port | Status | Expected |
|---------|------|--------|----------|
| Frontend | 5173 | ✓ Running | React dev server |
| Backend | 3000 | ✓ Running | Node.js API |
| Role Prediction | 6000 | ✓ Running | Python/Flask |
| Job Recommendation | 5002 | ✓ Running | Python/Flask |
| CV Ranking | 8002 | ✓ Running | Python/FastAPI |

---

## 🛠️ Troubleshooting

### "Python not found"
```bash
# Ensure Python 3 is installed
python3 --version

# If not installed:
# Windows: https://www.python.org/downloads/
# Mac: brew install python3
# Linux: apt-get install python3
```

### "Port already in use"
```bash
# Find what's using the port
# Windows: netstat -ano | findstr :6000
# Mac/Linux: lsof -i :6000

# Kill the process
# Windows: taskkill /PID <PID> /F
# Mac/Linux: kill -9 <PID>
```

### "Dependencies not found"
```bash
# Reinstall all requirements
pip install --upgrade -r ml-services/requirements.txt
```

### "ML services not connecting"
1. Verify all 3 services are running
2. Check no firewall is blocking ports 6000, 5002, 8002
3. Look at service logs in `ml-services/logs/`

---

## 📝 Environment Setup (Optional)

Create `backend/.env`:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
ML_ROLE_PREDICTION_URL=http://localhost:6000
ML_JOB_RECOMMEND_URL=http://localhost:5002
ML_CV_RANKING_URL=http://localhost:8002
```

---

## 🎓 What Happens Under the Hood

### CV Upload Flow
```
User uploads PDF
    ↓
Backend extracts text (pdf-parse)
    ↓
Text sent to Role Prediction ML service
    ↓
Service returns: role, skills, confidence
    ↓
Frontend updates profile in real-time
```

### Job Recommendation Flow
```
User clicks "Recommended Jobs"
    ↓
Backend fetches user profile
    ↓
Sends profile to Job Recommendation service
    ↓
Service returns ranked jobs (cosine similarity)
    ↓
Frontend displays ranked results
```

### Application Scoring Flow
```
User applies to job
    ↓
Backend gets user profile + job title
    ↓
Sends to Role Prediction service
    ↓
Service returns role match score
    ↓
Application stored with auto-generated rank score
```

---

## 🚀 Next Steps

1. **Explore Features:**
   - Admin Dashboard: Manage users, view analytics
   - Employer Dashboard: Post jobs, view applicants
   - Job Seeker Dashboard: Browse jobs, track applications

2. **Customize:**
   - Update model training data in `ml-services/train_model.py`
   - Modify frontend theme in CSS files
   - Add new API endpoints in backend

3. **Deploy:**
   - Frontend: Vercel, Netlify, GitHub Pages
   - Backend: Heroku, Railway, AWS EC2
   - ML Services: Docker, AWS Lambda, or local server

---

## 📚 Full Documentation

- Backend API: [backend/README.md](../backend/README.md)
- Frontend Guide: [frontend/README.md](../frontend/README.md)
- ML Services: [ml-services/SETUP.md](../ml-services/SETUP.md)
- Complete Setup: [README_COMPLETE.md](../README_COMPLETE.md)

---

## ✨ You're All Set!

Your Cverra platform is now fully operational with:
- ✓ Frontend (React)
- ✓ Backend (Node.js + Firestore)
- ✓ ML Services (Role Prediction, Job Recommendation, CV Ranking)
- ✓ Health Monitoring
- ✓ Auto-Profile Enhancement
- ✓ Intelligent Job Matching

**Enjoy building!** 🎉

---

## 💡 Pro Tips

- **Windows users**: Keep terminal windows visible to see service logs
- **Mac/Linux users**: Use `tail -f ml-services/logs/*.log` to monitor
- **All users**: Check health endpoint regularly: `curl http://localhost:3000/health-check/full`
- **Development**: Backend auto-reloads on file changes
- **Debugging**: Check `ml-services/logs/` for service errors

---

## 📞 Need Help?

1. Check Troubleshooting section above
2. Review service logs: `ml-services/logs/`
3. Test individual services: `python3 ml-services/test-services.py`
4. Check health status: `http://localhost:3000/health-check/full`

---

**Happy recruiting! 🎯**
