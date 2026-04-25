# 🚀 Quick Start Guide - Get It Running in 5 Minutes

## Prerequisites Check

```powershell
# Check Node.js version (must be v18+)
node --version

# Check npm version (must be v9+)
npm --version

# If you don't have these, download from https://nodejs.org
```

---

## Step 1: Install All Dependencies (90 seconds)

### On Windows (Easiest):
```powershell
# Double-click the file:
install-deps.bat

# Or run in PowerShell:
.\install-deps.bat
```

### On Mac/Linux:
```bash
chmod +x install-deps.sh
./install-deps.sh
```

### Manual Installation:
```powershell
# From project root: d:\Scouting & Engagement Agent
npm install

# This installs all packages for:
# - Backend (packages/backend)
# - Frontend (packages/frontend)
# - Root workspace
```

**Output should show✅**:
```
added 500+ packages
```

---

## Step 2: Configure Backend (60 seconds)

### Create .env file:
```powershell
cd packages\backend
Copy-Item .env.example -Destination .env
```

### Edit the .env file:
```powershell
# Open with Notepad
notepad .env

# Add your OpenAI API key (get free one at https://platform.openai.com/api-keys):
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
PORT=3001
NODE_ENV=development
```

**What to add**:
```env
# Minimum required
OPENAI_API_KEY=sk-proj-abc123...
PORT=3001

# Optional
LOG_LEVEL=info
NODE_ENV=development
```

---

## Step 3: Start Both Servers (30 seconds)

### From Project Root:
```powershell
# Start both backend and frontend together
npm run dev

# You should see:
# 🚀 Server running at http://localhost:3001
# ➜  Local:   http://localhost:3000/
```

### Or start separately if needed:

**Terminal 1 - Backend:**
```powershell
npm run dev -w backend
# Wait for: 🚀 Server running notificationbefore opening frontend
```

**Terminal 2 - Frontend:**
```powershell
npm run dev -w frontend
# Open http://localhost:3000 in browser
```

---

## Step 4: Open in Browser (10 seconds)

Visit: **http://localhost:3000**

You should see:
- Purple gradient background
- Title: "🎯 Talent Scouting & Engagement Agent"
- Job description input area
- "Load Sample Job" button

---

## Step 5: Test It Works (60 seconds)

1. **Click "Load Sample Job"** button
   - Job description auto-fills
   
2. **Click "Find & Engage Candidates"** button
   - Watch progress bar move
   - See status: "Parsing JD...", "Finding Candidates...", "Engaging...", "Generating Shortlist..."
   
3. **Wait for completion** (30-60 seconds)
   - Progress bar reaches 100%
   - See ranked candidates appear
   - View Match/Interest/Combined scores

4. **Review Results:**
   - See top 10 candidates
   - Check their scores and skills
   - Click "Export to JSON" to download results

---

## 🎬 Quick Demo Flow

```
1. Load Sample → Auto-fills job description
2. Click "Find & Engage" → Processing starts
   ✅ Parsing JD (extract requirements)
   ✅ Finding Candidates (search pool)
   ✅ Engaging (conversation simulation)
   ✅ Generating Shortlist (rank results)
3. Results show → Ranked candidates with scores
4. Export → Save to JSON file
```

---

## ❌ Quick Troubleshooting

### Issue: "Port 3001 already in use"
```powershell
# Change in packages\backend\.env
PORT=3002
```

### Issue: "Cannot find module 'openai'"
```powershell
cd packages\backend
npm install openai uuid @types/node
```

### Issue: "OPENAI_API_KEY error"
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and paste exact key into .env file
4. Restart backend

### Issue: Frontend shows "Cannot reach API"
1. Check backend is running: `curl http://localhost:3001/api/health`
2. Check frontend points to correct backend URL
3. Restart both servers

---

## 📊 Expected Output Files

### Sample Results (auto-generated):

**shortlist-[timestamp].json**
```json
{
  "generated_at": "2026-04-24T10:00:00Z",
  "statistics": {
    "total": 8,
    "average_match_score": 72,
    "average_interest_score": 68,
    "high_interest_count": 3
  },
  "top_candidates": [
    {
      "name": "Sarah Chen",
      "title": "Senior Full Stack Engineer",
      "match_score": 90,
      "interest_score": 85,
      "combined_score": 87
    }
    ...
  ]
}
```

---

## 🎯 Success Checklist

- [ ] Node v18+ installed
- [ ] npm v9+ installed  
- [ ] Dependencies installed (`npm install`)
- [ ] .env file created with OPENAI_API_KEY
- [ ] Backend starts: `npm run dev -w backend`
- [ ] Frontend starts: `npm run dev -w frontend`
- [ ] Browser http://localhost:3000 loads
- [ ] "Load Sample Job" button works
- [ ] "Find & Engage" processes successfully
- [ ] Results display with rankings

---

## 🚀 Next Steps

### Try Different Job Descriptions

1. Clear the input area
2. Paste a different job description
3. Click "Find & Engage Candidates"
4. Compare with previous results

### Customize Candidates

Edit `packages/backend/src/mock-data.ts` to add your own candidates

### Deploy to Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for cloud deployment options

### Integrate with Real Data

- Connect to LinkedIn API for real candidates
- Integrate with ATS for job postings
- Add email service for outreach

---

## 📚 Documentation Tree

```
📄 README.md              ← Overview & features
📄 SETUP.md               ← Detailed setup guide  
📄 ARCHITECTURE.md        ← System design & flow
📄 DEPLOYMENT.md          ← Cloud deployment guide
📄 ERROR_REFERENCE.md     ← Error troubleshooting ← YOU ARE HERE
📄 QUICK_START.md         ← This file

código/
├── packages/
│   ├── backend/          ← Express API server
│   ├── frontend/         ← React UI app
│   └── shared/           ← TypeScript types
```

---

## 💡 Pro Tips

1. **Keep backend/frontend running**: Don't close terminals with npm run dev
2. **Check console logs**: Both browser DevTools (F12) and terminal show errors
3. **API endpoint**: Backend at `http://localhost:3001/api`
4. **Hot reload**: Changes to code auto-reload (no restart needed)
5. **Test API directly**: Use cURL or Postman to test endpoints

---

## ⏱️ Timing Expectations

| Step | Time |
|------|------|
| Install dependencies | 90s |
| Configure .env | 60s |
| Start servers | 30s |
| First test | 60s |
| **Total** | **~4 minutes** |

---

## 🔗 Useful Links

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/
- **OpenAI SDK**: https://github.com/openai/node-sdk
- **React Docs**: https://react.dev
- **Express Docs**: https://expressjs.com

---

**Ready? Run `npm run dev` and go to http://localhost:3000! 🎉**
