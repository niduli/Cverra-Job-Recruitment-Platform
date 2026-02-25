#!/bin/bash

# Stop ML Services
# Kills background ML service processes

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "🛑 Stopping ML Services..."
echo ""

if [ -f ".ml-pids" ]; then
    while IFS= read -r pid; do
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null && echo "✓ Service (PID: $pid) stopped" || echo "✗ Failed to stop PID: $pid"
        else
            echo "✓ Service (PID: $pid) already stopped"
        fi
    done < ".ml-pids"
    rm ".ml-pids"
else
    echo "ℹ️  No PID file found. Services may not be running."
fi

echo ""
echo "✅ All services stopped!"
