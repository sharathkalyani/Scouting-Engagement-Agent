# Architecture

## System diagram

```text
React Frontend
  |
  v
Express API (/api/full-pipeline)
  |
  +--> JD Parser
  |     - extracts title, experience, skills, responsibilities
  |
  +--> Candidate Matcher
  |     - searches mock candidate pool
  |     - computes explainable match breakdown
  |
  +--> Engagement Engine
  |     - generates outreach
  |     - simulates candidate replies
  |     - infers interest score and concerns
  |
  +--> Ranking Engine
        - combines match + interest
        - returns shortlist, stats, recommendations
```

## Modules

- `packages/backend/src/jd-parser.ts`
  Parses free-text JDs into a structured `ParsedJD` object using rules and keyword extraction.
- `packages/backend/src/candidate-matcher.ts`
  Evaluates each candidate against the parsed JD and generates an explainable match summary.
- `packages/backend/src/engagement-engine.ts`
  Simulates a short recruiter-candidate conversation and converts the transcript into an interest assessment.
- `packages/backend/src/scoring.ts`
  Produces shortlist rankings, summary statistics, and recruiter recommendations.
- `packages/frontend/src/App.tsx`
  Orchestrates the UI flow from JD input to ranked shortlist output.

## Scoring

### Match Score

```text
0.45 * skills
+ 0.25 * experience
+ 0.20 * seniority
+ 0.10 * location
```

Why this works:

- skills carry the most weight because they drive immediate execution ability
- experience and seniority separate stretch candidates from ready-now candidates
- location matters, but should not overwhelm a strong profile

### Interest Score

Derived from:

- quick fit between profile and role
- positive conversational signals
- stated openness to continue
- explicit concerns such as location or skill mismatch

The engine does not claim to predict real application behavior perfectly. It is designed to simulate recruiter triage and surface who is both plausible and likely to engage.

## Output contract

The final payload includes:

- parsed JD summary
- number of candidates found and engaged
- ranked candidates
- top candidates
- statistics
- recommendations
- scoring explanation
