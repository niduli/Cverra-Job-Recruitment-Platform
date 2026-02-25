# ML Services Setup Guide

This guide explains how to set up and run the ML services for the Cverra Job Recruitment Platform.

## Overview

The Cverra platform includes three ML services:

1. **Role Prediction Service** (Port 6000)
   - Uses TF-IDF vectorization + Random Forest classifier
   - Predicts job roles from CV text and skills
   - Powers automatic profile enhancement and candidate scoring

2. **Job Recommendation Service** (Port 5002)
   - Recommends jobs to candidates based on their profile
   - Uses collaborative filtering and content-based recommendations

3. **CV Ranking Service** (Port 8002)
   - Ranks CVs for job postings
   - Scores candidates based on role match and experience

## Prerequisites

### Required
- Python 3.8 or higher
- pip package manager

### Optional
- Virtual environment (recommended for development)

## Quick Start

### For Windows Users

1. **Navigate to ml-services directory**:
   ```bash
   cd ml-services
   ```

2. **Run the startup script**:
   ```bash
   start-services.bat
   ```

   This will:
   - Check Python installation
   - Install Python dependencies
   - Train the role prediction model (if first time)
   - Start all three services in separate windows
   - Display service URLs and instructions

3. **Services should now be running**:
   - Role Prediction: `http://localhost:6000`
   - Job Recommendation: `http://localhost:5002`
   - CV Ranking: `http://localhost:8002`

4. **To stop services**:
   ```bash
   stop-services.bat
   ```

### For Mac/Linux Users

1. **Navigate to ml-services directory**:
   ```bash
   cd ml-services
   ```

2. **Make scripts executable** (first time only):
   ```bash
   chmod +x start-services.sh stop-services.sh
   ```

3. **Run the startup script**:
   ```bash
   ./start-services.sh
   ```

   This will:
   - Check Python installation
   - Install Python dependencies
   - Train the role prediction model (if first time)
   - Start all three services in background
   - Save logs to `logs/` directory

4. **Services should now be running**:
   - Role Prediction: `http://localhost:6000`
   - Job Recommendation: `http://localhost:5002`
   - CV Ranking: `http://localhost:8002`

5. **View logs**:
   ```bash
   tail -f logs/role-prediction.log
   tail -f logs/job-recommendation.log
   tail -f logs/cv-ranking.log
   ```

6. **To stop services**:
   ```bash
   ./stop-services.sh
   ```

## Manual Setup (For Development)

If you prefer manual setup or want to run services individually:

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

Or with Python 3:
```bash
pip3 install -r requirements.txt
```

### 2. Train the Model

This creates the machine learning model files needed for role prediction:

```bash
python3 train_model.py
```

You should see output:
```
Training Role Prediction Model...
Model trained with 20 samples
Saved: role-prediction/model.pkl (14.2 KB)
Saved: role-prediction/vectorizer.pkl (8.5 KB)
Saved: role-prediction/label_encoder.pkl (1.2 KB)

Test Prediction:
Input: "python javascript react machine learning"
Top Predictions:
  1. Software Engineer (92% confidence)
  2. ML Engineer (87% confidence)
  3. Full Stack Developer (79% confidence)
```

### 3. Start Individual Services

**Role Prediction Service**:
```bash
cd role-prediction
python3 app.py
```

**Job Recommendation Service** (new terminal):
```bash
cd job-recommendation
flask run --port 5002
```

**CV Ranking Service** (new terminal):
```bash
cd cv-ranking
python3 app.py
```

## Verification

### Check if Services are Running

**From Backend**:
```bash
# Check all services
curl http://localhost:3000/health-check/full

# Expected response:
{
  "timestamp": "2024-01-15T10:30:45Z",
  "backend": {
    "status": "healthy",
    "message": "Backend is running"
  },
  "ml": {
    "timestamp": "2024-01-15T10:30:45Z",
    "allHealthy": true,
    "services": {
      "rolePrediction": {
        "name": "Role Prediction Service",
        "port": 6000,
        "status": "healthy"
      },
      "jobRecommendation": {
        "name": "Job Recommendation Service",
        "port": 5002,
        "status": "healthy"
      },
      "cvRanking": {
        "name": "CV Ranking Service",
        "port": 8002,
        "status": "healthy"
      }
    }
  },
  "overall": "healthy"
}
```

**Directly Test a Service**:
```bash
# Test Role Prediction Service
curl -X POST http://localhost:6000/predict \
  -H "Content-Type: application/json" \
  -d '{"text":"python machine learning"}'

# Expected response:
{
  "predicted_role": "ML Engineer",
  "top_roles": [
    {"role": "ML Engineer", "probability": 0.95},
    {"role": "Software Engineer", "probability": 0.87}
  ]
}
```

## Troubleshooting

### Python Not Found

**Error**: `python: command not found` or `'python' is not recognized`

**Solution**:
- Ensure Python 3.8+ is installed
- Check PATH environment variable
- Use `python3` instead of `python` if only Python 3 is installed
- On Windows, during Python installation, ensure "Add Python to PATH" is checked

### Port Already in Use

**Error**: `Address already in use` or `Port 6000 is already in use`

**Solution**:
1. Check what's using the port:
   - Windows: `netstat -ano | findstr :6000`
   - Mac/Linux: `lsof -i :6000`

2. Kill the process if it's a stray service:
   - Windows: `taskkill /PID <PID> /F`
   - Mac/Linux: `kill -9 <PID>`

3. Or use different ports by updating environment variables

### Dependencies Not Found

**Error**: `ModuleNotFoundError: No module named 'flask'`

**Solution**:
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt

# Or use pip3
pip3 install --upgrade -r requirements.txt
```

### Model Files Missing

**Error**: `FileNotFoundError: model.pkl not found`

**Solution**:
```bash
# Train the model
python3 train_model.py
```

OR run the startup script which auto-trains if needed:
- Windows: `start-services.bat`
- Mac/Linux: `./start-services.sh`

### Services Start But Backend Can't Connect

**Error**: Service responds with "ML services unavailable"

**Solution**:
1. Verify services are running:
   - Windows: Check for open "Role Prediction Service", "Job Recommendation Service" windows
   - Mac/Linux: `ps aux | grep python`

2. Check service logs:
   - Windows: Check the service windows for error messages
   - Mac/Linux: `tail -f logs/*.log`

3. Verify environment variables in backend `.env`:
   ```
   ML_ROLE_PREDICTION_URL=http://localhost:6000
   ML_JOB_RECOMMEND_URL=http://localhost:5002
   ML_CV_RANKING_URL=http://localhost:8002
   ```

4. Test service connectivity:
   ```bash
   curl http://localhost:6000/health
   curl http://localhost:5002/health
   curl http://localhost:8002/health
   ```

## Environment Variables

Create a `.env` file in the ml-services directory:

```env
# ML Service Ports (optional, uses defaults below if not set)
ROLE_PREDICTION_PORT=6000
JOB_RECOMMEND_PORT=5002
CV_RANKING_PORT=8002

# Disable specific services (optional)
# DISABLE_ROLE_PREDICTION=false
# DISABLE_JOB_RECOMMENDATION=false
# DISABLE_CV_RANKING=false
```

## Integration with Backend

The backend automatically uses ML services:

1. **Profile Updates**:
   - When user uploads CV → automatic skill detection + role prediction
   - Profile enhanced with predicted role and skills

2. **Job Recommendations**:
   - GET `/api/jobs/recommended` → uses Job Recommendation service

3. **Application Scoring**:
   - When candidate applies → Role Prediction scores based on profile match

4. **Health Monitoring**:
   - GET `/health-check/full` → monitors all ML services

## Development Tips

### Testing Individual Services

```python
# Python test script (test_ml_services.py)
import requests
import json

BASE_URL = "http://localhost:6000"

# Test role prediction
response = requests.post(
    f"{BASE_URL}/predict",
    json={"text": "python machine learning tensorflow keras"}
)
print(json.dumps(response.json(), indent=2))
```

### Adding New Models

1. Train a new model in `train_model.py`
2. Save model artifacts to service directories
3. Update service app.py to load the new model
4. Restart service: `python3 app.py`

### Performance Tuning

- **Batch Predictions**: Send multiple items per request for efficiency
- **Model Caching**: Services cache loaded models in memory
- **Async Processing**: For large jobs, consider async training

## Next Steps

1. **Run the startup script** to get all services running
2. **Verify health check** via `http://localhost:3000/health-check/full`
3. **Test end-to-end**: Upload CV → Check profile → Apply to job
4. **Monitor logs** for any issues

## Support

For issues or questions:
- Check troubleshooting section above
- Review service logs in `logs/` (Mac/Linux)
- Verify Python and dependencies are installed
- Ensure ports 6000, 5002, 8002 are available
