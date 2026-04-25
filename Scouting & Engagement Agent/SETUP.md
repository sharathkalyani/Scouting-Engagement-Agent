# Setup Guide & Sample Usage

## 📋 Prerequisites

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** 9 or higher (comes with Node.js)
- **OpenAI API Key** ([Get one free](https://platform.openai.com/api-keys))
- **Git** (for cloning, optional)

### Check Prerequisites

```bash
# Check Node.js version
node --version   # Should be v18+

# Check npm version
npm --version    # Should be v9+
```

## 🚀 Installation Steps

### Step 1: Download the Project

```bash
# Navigate to the project directory
cd "d:\Scouting & Engagement Agent"
```

### Step 2: Install Dependencies

```bash
# Install all packages (root, backend, frontend)
npm install

# This runs:
# - Root dependencies (concurrently)
# - Backend dependencies (Express, OpenAI, etc.)
# - Frontend dependencies (React, Vite, etc.)
```

### Step 3: Configure Backend API Key

```bash
# Navigate to backend directory
cd packages/backend

# Copy the example environment file
cp .env.example .env

# Edit .env and add your OpenAI API key
# On Windows:
# type .env
# Add: OPENAI_API_KEY=sk-proj-your_key_here
# PORT=3001
```

### Step 4: Verify Installation

```bash
# From root directory
npm run type-check

# Both backend and frontend should compile successfully
```

## 🏃 Running the Application

### Option 1: Run Both Backend & Frontend (Recommended)

```bash
# From project root
npm run dev

# This launches:
# - Backend at http://localhost:3001
# - Frontend at http://localhost:3000
```

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev -w backend

# Output should show:
# 🚀 Server running at http://localhost:3001
# 📚 API docs available at http://localhost:3001/
```

**Terminal 2 - Frontend:**
```bash
npm run dev -w frontend

# Output should show:
# ➜  Local:   http://localhost:3000/
# ➜  press h to show help
```

### Step 5: Open in Browser

Navigate to: **http://localhost:3000**

You should see the Talent Scouting & Engagement Agent UI.

## 📚 Sample Usage Walkthrough

### Sample 1: Senior Full Stack Engineer

#### Input:
```
Job Title: Senior Full Stack Engineer

We are looking for an experienced Full Stack Engineer to lead our product development. 
You will work on our core platform serving millions of users, architect new features, 
and mentor junior engineers. This is a hands-on role.

Key Responsibilities:
- Design and implement scalable backend systems
- Build intuitive and performant user interfaces
- Lead code reviews and mentoring
- Collaborate with product and design teams
- Implement CI/CD pipelines and DevOps practices

Required Skills:
- 6+ years of software development experience
- Strong proficiency in React or Vue.js
- Backend development with Node.js or Python
- Database design (SQL and NoSQL)
- Cloud deployment (AWS/GCP/Azure)
- Understanding of system design and scalability

Nice to Have:
- Open source contributions
- Docker/Kubernetes knowledge
- GraphQL experience
- Team leadership experience

Salary: $150,000 - $250,000
Location: San Francisco, CA (Hybrid)
```

#### Process:
1. Click "Find & Engage Candidates"
2. Watch real-time progress:
   - ✅ Parsing job description (2-3 seconds)
   - ✅ Finding candidate matches (3-5 seconds)
   - ✅ Engaging candidates (10-15 seconds)
   - ✅ Generating ranked shortlist (2-3 seconds)

#### Expected Output (Top 3):

```
#1 | Sarah Chen
   Senior Full Stack Engineer at TechCorp
   Experience: 8 years
   Location: San Francisco, CA
   
   Match Score: 90/100
   ├─ Skills: 90%
   ├─ Experience: 85%
   ├─ Location: 100%
   └─ Seniority: 85%
   
   Interest Score: 85/100
   Combined Score: 87/100
   
   Matched Skills: React, Node.js, TypeScript, AWS, PostgreSQL, Docker
   Missing Skills: GraphQL
   
   Status: Very High Interest
   Fit: "Strong technical fit with excellent communication skills"

#2 | Alex Thompson
   Principal Engineer at TechGiant
   Experience: 15 years
   Location: Mountain View, CA
   
   Match Score: 88/100
   Interest Score: 72/100
   Combined Score: 80/100
   
   Status: High Interest
   Note: Potentially overqualified but excellent mentor

#3 | Marcus Johnson
   Backend Engineer at StartupXYZ
   Experience: 5 years
   Location: New York, NY
   
   Match Score: 78/100
   Interest Score: 68/100
   Combined Score: 73/100
   
   Status: Moderate Interest
   Note: Backend-strong; frontend skills developing
```

#### Recommendations:
```
→ Reach out to Sarah Chen immediately - strong interest signal (85/100)
✅ Sarah Chen is a strong technical fit - prioritize interview scheduling
📧 Send follow-up to Marcus Johnson with frontend role-specific details
```

### Sample 2: DevOps Engineer (Remote)

#### Input:
```
Job Title: DevOps Engineer

Join our infrastructure team to build and maintain the systems 
that power our platform. Remote position.

Key Responsibilities:
- Design and implement scalable infrastructure
- Build and manage Kubernetes clusters
- Develop CI/CD automation pipelines
- Ensure system reliability and security
- Optimize infrastructure costs and performance

Required:
- 4-6 years DevOps/SRE experience
- Expert in Kubernetes/Docker
- AWS or GCP experience
- Terraform or IaC knowledge
- Strong scripting skills (Python, Bash)

Location: Remote
Salary: $120,000 - $180,000
```

#### Expected Top Match:

```
#1 | David Park
   Senior DevOps Engineer at CloudServices Inc
   Experience: 10 years
   Location: Seattle, WA (Remote OK)
   
   Match Score: 92/100
   Interest Score: 88/100
   Combined Score: 90/100
   
   Matched Skills: Kubernetes, Docker, Terraform, AWS, GitLab CI, Python, Go
   
   Status: Very High Interest
   Fit: "Exceptional infrastructure expertise with strong automation background"
   
   Likelihood to Apply: 90%
```

### Sample 3: Frontend Engineer (Junior-focused)

#### Input:
```
Frontend Engineer - React Specialist

We're expanding our frontend team and looking for engineers 
at any experience level who are passionate about user experience.

Requirements:
- Strong React knowledge
- JavaScript/TypeScript
- CSS/Responsive Design
- Git version control

Nice to Have:
- Next.js experience
- Testing (Jest/React Testing Library)
- Open source work

Location: Los Angeles, CA
Remote: Yes
Salary: $80,000 - $140,000
```

#### Expected Top Match:

```
#1 | Jessica Lee
   Mid-Level Frontend Engineer at WebAgency
   Experience: 3 years
   Location: Los Angeles, CA
   
   Match Score: 94/100
   Interest Score: 90/100
   Combined Score: 92/100
   
   Matched Skills: React, TypeScript, CSS, Redux, Jest, Next.js
   
   Status: Very High Interest
   Fit: "Perfect fit - local candidate with excellent React skills and strong desire to grow"
   
   Likelihood to Apply: 95%

#2 | Lisa Wang
   Graduate Software Engineer at TechStartup
   Experience: 1 year
   Location: San Jose, CA
   
   Match Score: 72/100
   Interest Score: 88/100
   Combined Score: 80/100
   
   Status: High Interest
   Fit: "Enthusiastic junior developer looking for mentorship"
```

## 📊 API Testing

### Test via cURL

#### 1. Parse a Job Description

```bash
curl -X POST http://localhost:3001/api/parse-jd \
  -H "Content-Type: application/json" \
  -d '{
    "job_description": "Senior React Engineer with 6+ years experience needed in San Francisco"
  }'

# Response:
# {
#   "success": true,
#   "data": {
#     "required_skills": [
#       {"skill": "React", "importance": 0.95},
#       ...
#     ],
#     "technical_skills": ["React", "TypeScript", ...],
#     "keywords": ["react", "frontend", "ui", ...]
#   }
# }
```

#### 2. Full Pipeline

```bash
curl -X POST http://localhost:3001/api/full-pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "job_description": "Senior Full Stack Engineer with React and Node.js...",
    "limit": 5,
    "engagement_turns": 2,
    "match_weight": 0.5
  }'

# Response contains:
# - parsed_jd
# - candidates_found
# - candidates_engaged
# - ranked_candidates
# - top_candidates
# - statistics
# - recommendations
```

## 🧪 Testing Scenarios

### Scenario 1: Perfect Match

**Job**: React Developer, 5 years exp, San Francisco
**Candidate**: Sarah Chen, 8 years React/Node, SF resident
**Expected**: Match 90%+, Interest 85%+, Combined 87%+

### Scenario 2: Skill Gaps

**Job**: Senior DevOps with Kubernetes
**Candidate**: Lisa Wang, 1 year exp (Junior)
**Expected**: Match 50-60%, Interest 70%+ (interest in learning)

### Scenario 3: Geographic Mismatch

**Job**: On-site in San Francisco
**Candidate**: David Park in Seattle
**Expected**: Match 70-80%, Interest depends on relocation interest

### Scenario 4: Experience Overqualification

**Job**: Mid-level Backend Engineer
**Candidate**: Alex Thompson, 15 years Principal Engineer
**Expected**: Match 85%+, Interest 60-70% (may find role beneath level)

## 💻 Common Commands

```bash
# Install all dependencies
npm install

# Run development servers (both backend & frontend)
npm run dev

# Run backend only
npm run dev -w backend

# Run frontend only
npm run dev -w frontend

# Build for production
npm run build

# Type checking
npm run type-check

# Check backend only
npm run type-check -w backend
```

## 🔧 Troubleshooting

### Issue: "Cannot find module 'openai'"

**Solution**:
```bash
cd packages/backend
npm install
# or
npm install openai
```

### Issue: "Port 3001 already in use"

**Solution**:
```bash
# Find and kill process on port 3001
# On Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :3001
kill -9 <PID>

# Or change PORT in .env
PORT=3002
```

### Issue: "OPENAI_API_KEY is not set"

**Solution**:
```bash
# Check .env file exists in packages/backend
cat packages/backend/.env

# Make sure it contains:
OPENAI_API_KEY=sk-proj-...

# If not, add it
echo "OPENAI_API_KEY=your_key_here" >> packages/backend/.env
```

### Issue: "Cannot GET / on frontend"

**Solution**: Make sure you're accessing http://localhost:3000 (not :3001)

### Issue: "Cannot POST /api/parse-jd (404)"

**Solution**: 
- Backend needs to be running on port 3001
- Check frontend is configured with correct API proxy
- Verify vite.config.ts has proxy setup

## 📈 Performance Tips

1. **Limit Candidates**: Set `limit: 5` for faster processing
2. **Reduce Engagement Turns**: Use `engagement_turns: 1` for quick tests
3. **Parallel Processing**: System automatically parallelizes top 5 candidates
4. **Cache Results**: Export JSON to avoid reprocessing

## 🚀 Next Steps

1. **Customize Candidates**: Edit `packages/backend/src/mock-data.ts` to add real candidates
2. **Integrate ATS**: Connect to your Applicant Tracking System
3. **Add Database**: Replace mock data with persistent Postgres/MongoDB
4. **Email Integration**: Add outreach via email service (Sendgrid, etc.)
5. **Deploy**: Push to production using Render, Vercel, or Heroku

---

**Ready to scout talent! 🎯**
