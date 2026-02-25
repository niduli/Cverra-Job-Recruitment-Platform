#!/bin/bash

# ML Services Startup Script for Unix/Mac
# Starts all three ML services in background

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo ""
echo "🚀 Cverra ML Services Startup"
echo "=============================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed"
    exit 1
fi

# Install requirements
echo "📦 Installing Python dependencies..."
pip3 install -q -r requirements.txt

# Train model if not exists
if [ ! -f "role-prediction/model.pkl" ]; then
    echo "🤖 Training role prediction model (first time only)..."
    python3 train_model.py
fi

# Create logs directory
mkdir -p logs

# Start services in background
echo ""
echo "🎯 Starting Role Prediction Service (Port 6000)..."
cd role-prediction
python3 app.py > ../logs/role-prediction.log 2>&1 &
ROLE_PRED_PID=$!
cd ..
sleep 1

echo "💼 Starting Job Recommendation Service (Port 5002)..."
cd job-recommendation
python3 app.py > ../logs/job-recommendation.log 2>&1 &
JOB_REC_PID=$!
cd ..
sleep 1

echo "📄 Starting CV Ranking Service (Port 8002)..."
cd cv-ranking
python3 app.py > ../logs/cv-ranking.log 2>&1 &
CV_RANK_PID=$!
cd ..
sleep 1

echo ""
echo "✅ All ML services started!"
echo ""
echo "📋 Services running:"
echo "   • Role Prediction:     http://localhost:6000 (PID: $ROLE_PRED_PID)"
echo "   • Job Recommendation:  http://localhost:5002 (PID: $JOB_REC_PID)"
echo "   • CV Ranking:          http://localhost:8002 (PID: $CV_RANK_PID)"
echo ""
echo "📝 Logs available in: logs/"
echo ""
echo "🛑 To stop services, run: stop-services.sh"
echo ""

# Save PIDs to file for stopping later
echo "$ROLE_PRED_PID" > .ml-pids
echo "$JOB_REC_PID" >> .ml-pids
echo "$CV_RANK_PID" >> .ml-pids

echo "✨ Services are ready! You can now run the backend and frontend."
