# AI-Powered Talent Scouting & Engagement Agent

This monorepo contains a recruiter copilot prototype with a full frontend and backend implementation.

- `packages/backend`: Express + TypeScript API server
- `packages/frontend`: React + Vite single-page app
- `packages/shared`: shared TypeScript types used by both packages
- `render.yaml`: Render deployment configuration for backend and frontend

The app can:
- parse a job description into structured hiring signals
- discover matching candidates from a mock talent pool
- explain why each candidate matches
- simulate recruiter outreach and estimate interest
- rank a shortlist using `Match Score` and `Interest Score`

The implementation is demo-friendly and works locally without a live LLM key. The backend uses deterministic parsing, scoring, and conversation simulation so the full flow runs without OpenAI if needed.

## What is included

- React frontend for job description input and shortlist review
- Express backend with end-to-end API routes
- architecture write-up in [ARCHITECTURE.md](ARCHITECTURE.md)
- demo walkthrough script in [DEMO_SCRIPT.md](DEMO_SCRIPT.md)
- sample input/output files in `samples/`

## Local setup

Prerequisites:

- Node.js 18+
- npm 9+

Install and run:

```bash
npm install
npm run dev
```

Apps:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

Or run them separately:

```bash
npm run dev -w packages/backend
npm run dev -w packages/frontend
```

## API surface

- `POST /api/parse-jd`
- `POST /api/find-candidates`
- `POST /api/engage-candidate`
- `POST /api/generate-shortlist`
- `POST /api/full-pipeline`

Example request:

```json
{
  "job_description": "Senior Full Stack Engineer with 6+ years of experience in React, Node.js, TypeScript, AWS, and PostgreSQL. Hybrid in San Francisco.",
  "limit": 10,
  "engagement_turns": 2,
  "match_weight": 0.5
}
```

## Scoring logic

`Match Score`

- Skills match: 45%
- Experience alignment: 25%
- Seniority alignment: 20%
- Location fit: 10%

`Interest Score`

- Based on the simulated conversation
- boosted by positive signals such as "open to", "interested", and "next steps"
- reduced by concerns such as location mismatch, skill gaps, or uncertain replies

`Combined Score`

- Default formula: `50% match + 50% interest`

## Sample input and output

- Input: [samples/sample-job-description.txt](/d:/Scouting%20&%20Engagement%20Agent/samples/sample-job-description.txt)
- Output: [samples/sample-shortlist-output.json](/d:/Scouting%20&%20Engagement%20Agent/samples/sample-shortlist-output.json)

## Submission checklist

- Working prototype: local setup included above
- Source code: this repository
- Demo video: record using [DEMO_SCRIPT.md](/d:/Scouting%20&%20Engagement%20Agent/DEMO_SCRIPT.md)
- Architecture diagram and scoring description: [ARCHITECTURE.md](/d:/Scouting%20&%20Engagement%20Agent/ARCHITECTURE.md)
- Sample inputs and outputs: included in `samples/`
