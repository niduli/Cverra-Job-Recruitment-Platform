# 🔧 First-Time Environment Setup

This guide helps you set up your development environment from scratch.

## Table of Contents

1. [Install Node.js](#install-nodejs)
2. [Install Python 3](#install-python-3)
3. [Install Git (Optional)](#install-git-optional)
4. [Configure Firebase](#configure-firebase)
5. [Verify Installation](#verify-installation)
6. [Ready to Go!](#ready-to-go)

---

## Install Node.js

Node.js includes npm, the package manager for JavaScript.

### Windows

1. Go to https://nodejs.org/
2. Download **LTS version** (Long-Term Support)
3. Run the installer
4. During installation:
   - ✓ Keep "Add to PATH" **checked**
   - ✓ Keep all other defaults
5. Click "Install"

**Verify installation:**
```bash
node --version      # Should show v16+ or higher
npm --version       # Should show 8+
```

### Mac

**Option 1: Using Homebrew (Recommended)**
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

**Option 2: Direct Download**
1. Go to https://nodejs.org/
2. Download **LTS version** for Mac
3. Run the installer

**Verify installation:**
```bash
node --version      # Should show v16+ or higher
npm --version       # Should show 8+
```

### Linux (Ubuntu/Debian)

```bash
# Update package manager
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify
node --version      # Should show v16+
npm --version       # Should show 8+
```

---

## Install Python 3

Python is required for the ML services.

### Windows

1. Go to https://www.python.org/downloads/
2. Download **Python 3.8 or higher**
3. Run the installer
4. **IMPORTANT:** During installation:
   - ✓ Check "Add Python to PATH" (at bottom!)
   - ✓ Check "Install pip"
5. Click "Install Now"

**Verify installation:**
```bash
python --version    # Should show Python 3.8+
pip --version       # Should show pip 20+
```

If you get "command not found", try:
```bash
python3 --version
pip3 --version
```

### Mac

**Option 1: Using Homebrew (Recommended)**
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python 3
brew install python3
```

**Option 2: Direct Download**
1. Go to https://www.python.org/downloads/
2. Download **macOS installer** (Python 3.8+)
3. Run the installer

**Verify installation:**
```bash
python3 --version   # Should show Python 3.8+
pip3 --version      # Should show pip 20+
```

### Linux (Ubuntu/Debian)

```bash
# Update package manager
sudo apt update

# Install Python 3 and pip
sudo apt install python3 python3-pip

# Verify
python3 --version   # Should show Python 3.8+
pip3 --version      # Should show pip 20+
```

---

## Install Git (Optional)

Git is optional but recommended for version control and updates.

### Windows

1. Go to https://git-scm.com/download/win
2. Download the installer
3. Run it and accept defaults
4. During installation:
   - ✓ Keep "Add Git to PATH" **checked**

**Verify:**
```bash
git --version       # Should show git version
```

### Mac

**Option 1: Using Homebrew**
```bash
brew install git
```

**Option 2: Xcode Command Line Tools**
```bash
xcode-select --install
```

**Verify:**
```bash
git --version
```

### Linux

```bash
# Debian/Ubuntu
sudo apt install git

# Verify
git --version
```

---

## Configure Firebase

### Get Firebase Project

1. Go to https://firebase.google.com
2. Click "Go to console" (top right)
3. Sign in with Google account
4. Click "Create a project"
5. Follow the wizard:
   - Project name: "Cverra" (or your choice)
   - Accept terms
   - Click "Create project"
   - Wait for project to be created (1-2 minutes)

### Get Service Account Key

1. In Firebase console, click the gear icon (⚙️) → "Project Settings"
2. Click "Service Accounts" tab
3. Click "Generate New Private Key"
4. Save the JSON file somewhere safe
5. **Never commit this file to Git!**

### Add Firebase Config to Project

1. Copy the downloaded JSON file
2. Navigate to your project: `Cverra-Job-Recruitment-Platform/firebase/`
3. Paste the file here as: `serviceAccountKey.json`

The file structure should look like:
```
Cverra-Job-Recruitment-Platform/
├── firebase/
│   └── serviceAccountKey.json    ← Place it here
├── backend/
├── frontend/
└── ml-services/
```

### Get Frontend Firebase Config

1. Back in Firebase console (Project Settings)
2. Scroll to "Your apps" section
3. Click "Web" icon (</> icon)
4. Register app with name "cverra-web"
5. Copy the config object that looks like:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```
6. Update `frontend/src/firebase/firebaseConfig.js` with this config

### Initialize Firestore Database

1. Firebase console → left menu → "Firestore Database"
2. Click "Create Database"
3. Choose "Start in test mode" for development
4. Click "Next"
5. Keep default location
6. Click "Create"

### Set Up Firestore Collections (Optional)

Collections are created automatically when data is first added, but you can create them manually:

```
Firestore Collections:
├── users
├── jobs
├── applications
├── cvs
└── profiles
```

---

## Verify Installation

### Check All Requirements

Run these commands to verify everything is installed:

```bash
# Check Node.js
node --version      # Example: v18.12.0
npm --version       # Example: 8.19.2

# Check Python
python3 --version   # Example: Python 3.11.1
pip3 --version      # Example: pip 22.3.1

# Check Git (optional)
git --version       # Example: git version 2.39.0
```

All should output version numbers. If any show "command not found", see troubleshooting below.

### Test Dependencies

```bash
# Check if npm can install packages
npm cache verify    # Should say "OK"

# Check if pip can install packages
pip3 install --upgrade pip
```

---

## Configure Backend Environment

1. Open `backend/` folder
2. Create a file named `.env` (note the dot at start)
3. Add this content:

```env
# Server
PORT=3000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=cverra-secret-key-change-this-in-production
JWT_EXPIRE=7d

# Firebase
FIREBASE_PROJECT_ID=your-project-id-here
FIREBASE_PRIVATE_KEY=your-private-key-here
FIREBASE_CLIENT_EMAIL=your-email@project.iam.gserviceaccount.com

# ML Services URLs
ML_ROLE_PREDICTION_URL=http://localhost:6000
ML_JOB_RECOMMEND_URL=http://localhost:5002
ML_CV_RANKING_URL=http://localhost:8002

# Google Cloud Storage
GCS_BUCKET_NAME=your-bucket.appspot.com
```

Replace values from your `firebase/serviceAccountKey.json`:
- Copy `project_id` → `FIREBASE_PROJECT_ID`
- Copy `private_key` → `FIREBASE_PRIVATE_KEY`
- Copy `client_email` → `FIREBASE_CLIENT_EMAIL`

---

## Troubleshooting Setup

### "node command not found"

**Windows:**
- Uninstall Node.js
- Download again from nodejs.org
- **Make sure "Add to PATH" is checked** during installation
- Restart computer
- Try `node --version` again

**Mac/Linux:**
- Verify installation: `brew list node` or `which node`
- If missing: `brew install node`

### "python3 not found" or "pip3 not found"

**Windows:**
- Go to Settings → System → Environment Variables
- Find "Path" in System variables
- Click "Edit"
- Make sure Python directory is listed:
  - Usually: `C:\Users\YourName\AppData\Local\Programs\Python\Python311`
- Click OK and restart terminal

**Mac/Linux:**
- Try: `python --version` and `pip --version`
- If Python 2, install Python 3: `brew install python3`

### "Port already in use"

```bash
# Windows: Find what's using port 3000
netstat -ano | findstr :3000

# Mac/Linux: Find what's using port 3000
lsof -i :3000

# Kill the process
# Windows: taskkill /PID <PID> /F
# Mac/Linux: kill -9 <PID>
```

### "Firebase serviceAccountKey.json not found"

1. Go to Firebase console
2. Project Settings → Service Accounts
3. Click "Generate New Private Key"
4. Save to `firebase/serviceAccountKey.json`
5. Never share or commit this file!

### "npm install fails with permission error"

```bash
# Fix npm permissions on Mac/Linux
sudo chown -R $(whoami) ~/.npm

# Or use this workaround
npm install --legacy-peer-deps
```

---

## Validate Complete Setup

Run this final check:

```bash
# 1. Check Node.js
node --version && npm --version

# 2. Check Python
python3 --version && pip3 --version

# 3. Check Git (optional)
git --version

# 4. Check Firebase config
cat firebase/serviceAccountKey.json  # Should show JSON content

# 5. Check backend .env
cat backend/.env                    # Should show environment variables
```

All should output without errors! ✓

---

## Environment Setup Summary

| Component | Status | Command |
|-----------|--------|---------|
| Node.js | ✓ | `node --version` |
| npm | ✓ | `npm --version` |
| Python 3 | ✓ | `python3 --version` |
| pip | ✓ | `pip3 --version` |
| Git | ✓ | `git --version` |
| Firebase Config | ✓ | Check `firebase/serviceAccountKey.json` |
| Backend `.env` | ✓ | Check `backend/.env` |

Once all are checked, you're ready to proceed! ✓

---

## Next Steps

1. ✅ Completed all setup above
2. → [Follow QUICKSTART.md](QUICKSTART.md) to start the platform
3. → [Use SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) to verify everything

---

## 📞 Still Having Issues?

1. **Check this guide** - Scroll up to Troubleshooting section
2. **Check QUICKSTART.md** - Has quick solutions
3. **Check README_COMPLETE.md** - Detailed docs
4. **Check ml-services/SETUP.md** - ML-specific help

---

**You're all set! Ready to run Cverra? → [QUICKSTART.md](QUICKSTART.md)** 🚀
