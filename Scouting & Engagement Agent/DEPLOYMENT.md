# Deployment Guide

## 🌐 Deployment Options

### Option 1: Render.com (Recommended - Free Tier Available)

#### Deploy Backend to Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub account

2. **Connect Repository**
   - Push code to GitHub
   - In Render, click "New +" → "Web Service"
   - Connect your GitHub repo

3. **Configure Backend Service**
   ```
   Name: talent-scout-backend
   Root Directory: packages/backend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. **Add Environment Variables**
   ```
   OPENAI_API_KEY: [Your API Key]
   NODE_ENV: production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render auto-deploys whenever you push to main branch
   - Get your backend URL (e.g., https://talent-scout-backend.onrender.com)

#### Deploy Frontend to Render

1. **Create New Static Site**
   - "New +" → "Static Site"
   - Connect same GitHub repo

2. **Configure Frontend**
   ```
   Name: talent-scout-frontend
   Root Directory: packages/frontend
   Build Command: npm run build
   Publish Directory: dist
   ```

3. **Set Environment Variable**
   - Add `VITE_API_URL` if needed for custom backend URL

4. **Deploy**
   - Frontend automatically deploys to Render's CDN
   - Get your frontend URL (e.g., https://talent-scout-frontend.onrender.com)

### Option 2: Heroku (Classic - May Require Free Alternative)

#### Deploy Backend

1. **Install Heroku CLI**
   ```bash
   # On Windows
   choco install heroku-cli
   
   # On Mac
   brew tap heroku/brew && brew install heroku
   ```

2. **Login & Create App**
   ```bash
   heroku login
   heroku create talent-scout-backend
   cd packages/backend
   ```

3. **Add Procfile**
   ```
   web: npm start
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set OPENAI_API_KEY=sk-proj-...
   ```

5. **Deploy**
   ```bash
   git push heroku main  # Or your branch
   ```

### Option 3: Vercel (Best for Frontend)

#### Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select monorepo type

3. **Configure**
   ```
   Framework: Vite
   Root Directory: packages/frontend
   Build Command: npm run build
   Output Directory: dist
   ```

4. **Add Backend URL**
   - Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`

5. **Deploy**
   - Vercel auto-deploys on push
   - Get your URL: https://talent-scout-frontend-*.vercel.app

### Option 4: Local Docker Deployment

#### Build Docker Image

1. **Create Dockerfile**

```dockerfile
# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY packages/backend ./packages/backend
COPY packages/shared ./packages/shared

WORKDIR /app/packages/backend
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

2. **Build & Run**
```bash
docker build -t talent-scout-backend .
docker run -p 3001:3001 \
  -e OPENAI_API_KEY=sk-proj-... \
  talent-scout-backend
```

3. **Docker Compose**

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: packages/backend/Dockerfile
    ports:
      - "3001:3001"
    environment:
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      NODE_ENV: production
    restart: always

  frontend:
    build:
      context: .
      dockerfile: packages/frontend/Dockerfile
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://localhost:3001
    depends_on:
      - backend
    restart: always
```

Run with:
```bash
docker-compose up -d
```

## 🔗 Post-Deployment Configuration

### Update Frontend API URL

After deploying backend, update frontend to point to it:

**On Vercel/Netlify:**
1. Add environment variable: `VITE_API_URL=https://your-backend-url.com`
2. Redeploy frontend

**Locally (development):**
Update `frontend/vite.config.ts`:
```typescript
proxy: {
  '/api': {
    target: 'https://your-backend-url.com',
    changeOrigin: true,
  },
}
```

## ✅ Deployment Checklist

- [ ] OpenAI API key is stored securely (in env vars, not in code)
- [ ] Backend build completes without errors
- [ ] Frontend build completes without errors
- [ ] API proxy configured in frontend
- [ ] Environment variables set in hosting platform
- [ ] Test `/api/health` endpoint works
- [ ] Test full pipeline with sample job description
- [ ] Monitor logs for errors
- [ ] Set up SSL/HTTPS (usually automatic)
- [ ] Configure CDN if needed

## 📊 Monitoring & Logs

### Render.com
- View logs: Dashboard → Service → Logs
- Monitor performance: Analytics tab
- Set up alerts: Settings → Notifications

### Heroku
```bash
heroku logs --tail
heroku logs -a talent-scout-backend
```

### Vercel
- Logs available in: Deployments → Select deployment → Deployment logs
- Real-time monitoring: Analytics section

## 🔐 Security Best Practices

1. **Never commit API keys**
   - Use .env files (added to .gitignore)
   - Use environment variables in production

2. **Enable CORS carefully**
   - In production, set specific frontend URL
   - Don't use `*` for CORS origin

3. **Rate limiting**
   - Implement in production to prevent abuse
   - Consider reverse proxy like Cloudflare

4. **Monitoring**
   - Monitor API usage and costs
   - Set up alerts for API failures
   - Track OpenAI API usage

## 💰 Cost Estimation

### Monthly Costs
| Service | Free Tier | Pro Tier |
|---------|-----------|----------|
| **Render.com Backend** | ~$7-20 (shared CPU) | From $7/mo |
| **Vercel Frontend** | Free | $20+/mo |
| **OpenAI API** | Free trial | ~$0.01-$1/request* |
| **Total** | $7-20/mo | $27+/mo + API usage |

*Depends on job description complexity and number of candidates

## 🚀 Quick Deploy Checklist

### Deploy to Render (Fastest)

1. Push code to GitHub
2. Create GitHub OAuth app for Render
3. Connect repository to Render
4. Backend auto-deploys to `https://talent-scout-backend.onrender.com`
5. Frontend auto-deploys to `https://talent-scout-frontend.onrender.com`
6. Add OPENAI_API_KEY to backend environment variables
7. Done! ✅

## 🐛 Troubleshooting Deployments

### Issue: Build fails on Render

**Solution**: Check Node version
```
Node: 18.x
npm: 9.x
```

### Issue: Frontend can't reach backend API

**Solution**: Verify CORS headers
```bash
curl -H "Origin: https://frontend-url" \
  https://backend-url/api/health
```

### Issue: OpenAI API calls timeout

**Solution**: 
- Check API key is correct
- Check rate limits
- Add retry logic with exponential backoff

## 📈 Scaling Strategy

### Phase 1: MVP (Current)
- Single backend instance
- Static frontend on CDN
- In-memory candidate database

### Phase 2: Production
- Load balancer for backend
- Redis for caching
- PostgreSQL for persistence
- Job queue for async processing

### Phase 3: Enterprise
- Multi-region deployment
- Database replication
- Advanced analytics
- Custom model fine-tuning

---

**Ready for production! 🚀**
