# ⚠️ Error Reference & Troubleshooting Guide

## Common Errors & Solutions

### ❌ Module Resolution Errors

#### Error: `Cannot find module 'openai' or its corresponding type declarations`

**Cause**: OpenAI package not installed

**Fix**:
```bash
cd backend
npm install openai
```

#### Error: `Cannot find module '../shared/types' or its corresponding type declarations`

**Cause**: Module resolution path issue or shared module not built

**Fix**:
```bash
# From project root
npm install
npm run type-check
```

#### Error: `Cannot find module 'express'` or `Cannot find module 'uuid'`

**Cause**: Dependencies not installed

**Fix**:
```bash
cd backend
npm install
```

---

### ❌ TypeScript Configuration Errors

#### Error: `Cannot find name 'process'`

**Cause**: TypeScript doesn't have Node type definitions

**Fix**: Already fixed in updated `tsconfig.json` with:
```json
"types": ["node"],
"lib": ["ES2020"],
"module": "CommonJS"
```

#### Error: `Cannot find name 'console'`

**Cause**: Type definitions missing for Node.js globals

**Fix**: Install @types/node:
```bash
npm install --save-dev @types/node
```

#### Error: `Parameter 's' implicitly has an 'any' type`

**Cause**: Missing type annotations on arrow function parameters

**Fix**: Already fixed - all parameters now have explicit types

---

### ⚠️ Type Annotation Errors

#### Error: `Variable 'X' implicitly has type 'any[]'`

**Cause**: Array variable declared without type annotation

**Example Problem**:
```typescript
const engagementSessions = [];  // ❌ any[]
```

**Solution**:
```typescript
const engagementSessions: EngagementSession[] = [];  // ✅ Properly typed
```

---

### 🔴 Runtime Errors (After Fixing Compilation)

#### Error: `ENOENT: no such file or directory, open '.env'`

**Cause**: Environment file not created

**Fix**:
```bash
cd backend
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

#### Error: `401 Unauthorized` when calling OpenAI API

**Cause**: Invalid or missing OPENAI_API_KEY

**Fix**:
```bash
# Check your API key in backend/.env
OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY_HERE

# Get a valid key from https://platform.openai.com/api-keys
# Make sure the key has "Secret key" prefix (sk-proj-...)
```

#### Error: `ECONNREFUSED` when frontend tries to reach backend

**Cause**: Backend not running or frontend has wrong API URL

**Fix**:
```bash
# Terminal 1: Start backend
npm run dev -w backend

# Terminal 2: Start frontend
npm run dev -w frontend

# Verify backend is running at http://localhost:3001
curl http://localhost:3001/api/health
```

#### Error: `403 Forbidden` - Invalid API key for OpenAI

**Cause**: API key invalid or revoked

**Fix**:
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Update .env file
4. Restart backend

---

## 📋 Error Categories

### Compilation Errors (Fixed ✅)

| Error | File | Fix |
|-------|------|-----|
| Cannot find module 'openai' | backend/*.ts | npm install openai |
| Cannot find module '../shared/types' | backend/*.ts | Module resolution fixed |
| Cannot find name 'process' | backend/*.ts | tsconfig updated |
| Parameter 's' implicitly has 'any' type | backend/*.ts | Type annotations added |
| Cannot find module 'express' | backend/routes.ts | npm install |

### Configuration Errors (May appear)

| Error | Cause | Fix |
|-------|-------|-----|
| ENOENT: no such file .env | Missing env file | cp .env.example .env |
| Missing OPENAI_API_KEY | Not set in .env | Add valid key |
| Port 3001 already in use | Another process using port | Change PORT in .env |
| Cannot resolve proxy /api | Frontend config issue | Check vite.config.ts |

### Runtime Errors (Production)

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Invalid API key | Update API key |
| 429 Too Many Requests | Rate limited | Add retry logic |
| 500 Internal Server Error | Backend crash | Check console logs |
| Network timeout | API call too slow | Increase timeout |

---

## 🔍 How to Verify Everything is Fixed

### Step 1: Check Compilation
```bash
cd backend
npm run type-check

# Expected output:
# No errors! ✅
```

### Step 2: Check Linting
```bash
npm run type-check -w frontend
npm run type-check -w backend

# Should have 0 errors
```

### Step 3: Start Backend
```bash
npm run dev -w backend

# Expected output:
# 🚀 Server running at http://localhost:3001
# 📚 API docs available at http://localhost:3001/
```

### Step 4: Test API Health
```bash
# In another terminal
curl http://localhost:3001/api/health

# Expected output:
# {"status":"ok","timestamp":"2026-04-24T..."}
```

### Step 5: Start Frontend
```bash
npm run dev -w frontend

# Expected output:
# ➜  Local:   http://localhost:3000/
```

### Step 6: Test in Browser
Open http://localhost:3000 and:
1. Sample job loads successfully
2. Click "Load Sample Job"
3. Click "Find & Engage Candidates"
4. Wait for processing to complete
5. See ranked candidates displayed

---

## 🛠️ Debugging Tips

### Enable Verbose Logging

**Backend**:
```typescript
// Add to index.ts
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Check Network Requests

**Frontend - Open DevTools (F12)**:
1. Go to Network tab
2. Click "Find & Engage Candidates"
3. Watch API requests
4. Check response status codes
5. Look for error messages

### Check Backend Logs

```bash
# Watch real-time logs
npm run dev -w backend

# Logs will show:
# Step 1: Parsing job description...
# Step 2: Finding matching candidates...
# etc.
```

### Test API Manually

```bash
# Test parsing JD
curl -X POST http://localhost:3001/api/parse-jd \
  -H "Content-Type: application/json" \
  -d '{"job_description":"Senior React Engineer with 6+ years"}'

# Should return parsed job data (not error)
```

---

## 📋 Pre-Deployment Checklist

- [ ] All TypeScript files compile without errors
- [ ] `npm run type-check` passes for both backend/frontend
- [ ] Backend starts without errors
- [ ] Frontend connects to backend successfully
- [ ] Test endpoint `/api/health` returns 200
- [ ] Test full pipeline with sample job
- [ ] OPENAI_API_KEY is set in .env
- [ ] No console errors in browser DevTools
- [ ] No error messages in backend logs

---

## 🆘 Still Having Issues?

1. **Check file paths**: Use absolute paths in TypeScript imports
2. **Check Node version**: Must be v18+
3. **Clear cache**: `rm -rf node_modules package-lock.json` then `npm install`
4. **Restart servers**: Kill and restart npm run dev terminals
5. **Check firewall**: Make sure ports 3000/3001 aren't blocked

---

## 📞 Error Reporting

If errors persist, check:

1. **Node & npm versions**
   ```bash
   node --version   # Should be v18+
   npm --version    # Should be v9+
   ```

2. **Dependencies installed**
   ```bash
   ls backend/node_modules | grep -E "openai|uuid|express"
   ```

3. **Files exist**
   ```bash
   ls -la backend/src/
   ls -la frontend/src/
   ```

4. **Environment configured**
   ```bash
   cat backend/.env
   # Should have OPENAI_API_KEY set
   ```

---

**Last Updated**: April 24, 2026

