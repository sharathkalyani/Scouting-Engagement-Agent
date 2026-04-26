# Deploying to Vercel (Frontend + Backend)

This guide shows how to deploy both the frontend and backend on Vercel using serverless functions.

## Prerequisites

- GitHub account with the repository pushed
- Vercel account (free at [vercel.com](https://vercel.com))

## Deployment Steps

### 1. Install Vercel Dependencies

```bash
npm install @vercel/node uuid
```

### 2. Push Code to GitHub

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Add Vercel serverless API configuration"
git push origin master
```

### 3. Deploy to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. **Import your GitHub repository**
4. **Configure Project Settings:**
   - **Framework Preset:** Other (since we have both frontend and API)
   - **Root Directory:** `./` (leave blank, use default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `frontend/dist`
   - **Install Command:** `npm install`

5. **Environment Variables** (optional for now, can be added later):
   - You can add custom environment variables if needed

6. Click **Deploy**

Vercel will automatically:
- Build the frontend from `frontend/`
- Create serverless functions from files in `/api` folder
- Deploy everything to a single URL

### 4. Access Your Deployment

After deployment completes, you'll get a URL like:
- Frontend: `https://your-project.vercel.app`
- API endpoints: `https://your-project.vercel.app/api/parse-jd`, etc.

### 5. Test the Deployment

Test with a curl command:

```bash
curl -X POST https://your-project.vercel.app/api/health
```

Or test the full pipeline:

```bash
curl -X POST https://your-project.vercel.app/api/full-pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "job_description": "Senior Full Stack Engineer with 6+ years experience"
  }'
```

## Troubleshooting

### Build Failures

If the build fails:
1. Check the **Vercel Build Logs** in the dashboard
2. Ensure all dependencies are in `package.json` or `backend/package.json` and `frontend/package.json`
3. Make sure TypeScript compiles (`npm run type-check`)

### API Not Working

If API endpoints return 404:
1. Check the file structure in `/api` folder - each file becomes an endpoint
2. Verify file extensions are `.ts`
3. Check Vercel Function Logs for runtime errors

### CORS Issues

The API already has CORS enabled for all origins. If you get CORS errors:
1. Update the `Access-Control-Allow-Origin` header in `/api/*.ts` files
2. Change from `'*'` to your specific frontend domain if needed

## File Structure

```
/
├── api/                          # Serverless functions
│   ├── health.ts                # GET /api/health
│   ├── parse-jd.ts              # POST /api/parse-jd
│   ├── find-candidates.ts       # POST /api/find-candidates
│   ├── engage-candidate.ts      # POST /api/engage-candidate
│   ├── generate-shortlist.ts    # POST /api/generate-shortlist
│   └── full-pipeline.ts         # POST /api/full-pipeline
├── frontend/                # React + Vite app
│   └── dist/                # Built output (deployed to /)
├── backend/                 # Business logic (imported by /api)
│   └── shared/                  # Shared types
├── vercel.json                  # Vercel configuration
└── package.json                 # Dependencies
```

## Adding Environment Variables

To add secrets or configuration:

1. In Vercel Dashboard → **Project Settings** → **Environment Variables**
2. Add your variables (e.g., API keys)
3. Each redeploy will use the updated variables

Access them in your serverless functions via:
```typescript
const apiKey = process.env.YOUR_VAR_NAME;
```

## Redeployment

Push changes to GitHub and Vercel automatically redeploys:

```bash
git add .
git commit -m "Update deployment"
git push origin master
```

Or manually redeploy from the Vercel dashboard: **Project** → **Deployments** → **Redeploy**

## Performance Notes

- First cold start may take 5-10 seconds
- Subsequent requests are very fast
- Vercel caches dependencies between deployments
- Check **Function Logs** for performance metrics

## Next Steps

- Customize domain: Settings → **Domains**
- Enable Git Integration: Settings → **Git**
- Monitor usage: Analytics tab

