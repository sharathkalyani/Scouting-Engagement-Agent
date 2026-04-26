import { Candidate, CandidateMatch, ParsedJD } from './types';

const SKILL_ALIASES: Record<string, string[]> = {
  react: ['react', 'next.js', 'redux'],
  'node.js': ['node.js', 'node', 'express'],
  python: ['python'],
  typescript: ['typescript', 'javascript'],
  javascript: ['javascript', 'typescript'],
  aws: ['aws', 'cloud deployment', 'cloud'],
  kubernetes: ['kubernetes', 'docker', 'terraform'],
  postgresql: ['postgresql', 'sql', 'database'],
  graphql: ['graphql', 'rest', 'api'],
};

function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase();
}

function skillMatches(candidateSkill: string, requiredSkill: string): boolean {
  const candidate = normalizeSkill(candidateSkill);
  const required = normalizeSkill(requiredSkill);

  if (candidate.includes(required) || required.includes(candidate)) {
    return true;
  }

  const aliasValues = SKILL_ALIASES[required] ?? [];
  return aliasValues.some((alias) => candidate.includes(alias));
}

function calculateSkillMatch(candidateSkills: string[], requiredSkills: string[]): number {
  if (requiredSkills.length === 0) return 100;

  const matchedCount = requiredSkills.filter((requiredSkill) =>
    candidateSkills.some((candidateSkill) => skillMatches(candidateSkill, requiredSkill))
  ).length;

  return Math.round((matchedCount / requiredSkills.length) * 100);
}

function calculateExperienceMatch(candidateYears: number, minYears: number, maxYears: number): number {
  if (candidateYears >= minYears && candidateYears <= maxYears + 2) {
    return 100;
  }

  if (candidateYears < minYears) {
    return Math.max(35, 100 - (minYears - candidateYears) * 15);
  }

  return Math.max(60, 100 - (candidateYears - maxYears - 2) * 6);
}

function calculateSeniorityMatch(experienceYears: number, requiredLevel: string): number {
  const targetYears = {
    junior: 1,
    mid: 4,
    senior: 7,
    lead: 10,
  }[requiredLevel] ?? 4;

  const difference = Math.abs(experienceYears - targetYears);
  return Math.max(55, 100 - difference * 8);
}

function calculateLocationMatch(candidate: Candidate, parsedJD: ParsedJD): number {
  if (parsedJD.original.remote) return 100;
  if (!parsedJD.original.location || !candidate.location) return 75;

  return candidate.location.toLowerCase() === parsedJD.original.location.toLowerCase() ? 100 : 55;
}

function generateMatchReasoning(
  candidate: Candidate,
  parsedJD: ParsedJD,
  matchedSkills: string[],
  missingSkills: string[],
  matchScore: number
): string {
  const experienceSummary =
    candidate.experience_years >= parsedJD.experience_years_min
      ? `${candidate.experience_years} years of experience is aligned with the target range`
      : `${candidate.experience_years} years of experience is a bit below the requested range`;

  const skillSummary =
    matchedSkills.length > 0
      ? `Strong overlap on ${matchedSkills.slice(0, 3).join(', ')}`
      : 'Limited direct skill overlap';

  const gapSummary =
    missingSkills.length > 0 ? `main gap: ${missingSkills.slice(0, 2).join(', ')}` : 'no material skill gaps identified';

  return `${candidate.name} scores ${matchScore}/100. ${skillSummary}, and ${experienceSummary}; ${gapSummary}.`;
}

export async function matchCandidate(candidate: Candidate, parsedJD: ParsedJD): Promise<CandidateMatch> {
  const requiredSkills = parsedJD.required_skills.map((skill) => skill.skill);
  const skillsMatch = calculateSkillMatch(candidate.skills, requiredSkills);
  const experienceMatch = calculateExperienceMatch(
    candidate.experience_years,
    parsedJD.experience_years_min,
    parsedJD.experience_years_max
  );
  const locationMatch = calculateLocationMatch(candidate, parsedJD);
  const seniorityMatch = calculateSeniorityMatch(candidate.experience_years, parsedJD.original.experience_level);
  const matchScore = Math.round(skillsMatch * 0.45 + experienceMatch * 0.25 + locationMatch * 0.1 + seniorityMatch * 0.2);

  const matchedSkills = requiredSkills.filter((requiredSkill) =>
    candidate.skills.some((candidateSkill) => skillMatches(candidateSkill, requiredSkill))
  );
  const missingSkills = requiredSkills.filter(
    (requiredSkill) => !candidate.skills.some((candidateSkill) => skillMatches(candidateSkill, requiredSkill))
  );

  return {
    candidate,
    match_score: matchScore,
    match_breakdown: {
      skills_match: skillsMatch,
      experience_match: experienceMatch,
      location_match: locationMatch,
      seniority_match: seniorityMatch,
    },
    matched_skills: matchedSkills,
    missing_skills: missingSkills,
    match_reasoning: generateMatchReasoning(candidate, parsedJD, matchedSkills, missingSkills, matchScore),
  };
}

export async function matchCandidates(
  candidates: Candidate[],
  parsedJD: ParsedJD,
  limit = 20
): Promise<CandidateMatch[]> {
  const requiredSkills = parsedJD.required_skills.map((skill) => skill.skill);
  const prefiltered = candidates.filter((candidate) => calculateSkillMatch(candidate.skills, requiredSkills) >= 15);
  const pool = prefiltered.length > 0 ? prefiltered : candidates;
  const matched = await Promise.all(pool.map((candidate) => matchCandidate(candidate, parsedJD)));

  return matched.sort((a, b) => b.match_score - a.match_score).slice(0, limit);
}
