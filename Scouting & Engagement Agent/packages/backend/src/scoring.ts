import { CandidateMatch, EngagementSession, RankedCandidate } from './types';

export function calculateMatchScore(match: CandidateMatch): number {
  return match.match_score;
}

export function calculateInterestScore(engagement?: EngagementSession, assessment?: { interest_score?: number }): number {
  if (assessment?.interest_score !== undefined) {
    return assessment.interest_score;
  }

  if (!engagement) {
    return 45;
  }

  const transcript = engagement.conversation.map((turn) => turn.message.toLowerCase()).join(' ');
  let score = Math.min(100, engagement.conversation.length * 12);

  ['interested', 'open to', 'next steps', 'compelling'].forEach((keyword) => {
    if (transcript.includes(keyword)) score += 8;
  });
  ['not sure', 'not perfect', 'concern'].forEach((keyword) => {
    if (transcript.includes(keyword)) score -= 10;
  });

  return Math.max(0, Math.min(100, score));
}

export function calculateCombinedScore(matchScore: number, interestScore: number, matchWeight = 0.5): number {
  return Math.round(matchScore * matchWeight + interestScore * (1 - matchWeight));
}

export function rankCandidates(candidates: RankedCandidate[], matchWeight = 0.5): RankedCandidate[] {
  return candidates
    .map((candidate) => ({
      ...candidate,
      combined_score: calculateCombinedScore(candidate.match_score, candidate.interest_score, matchWeight),
    }))
    .sort((left, right) => right.combined_score - left.combined_score)
    .map((candidate, index) => ({
      ...candidate,
      rank: index + 1,
    }));
}

export function generateScoringExplanation(ranked: RankedCandidate[]): string {
  const summary = ranked
    .slice(0, 5)
    .map(
      (candidate) =>
        `#${candidate.rank} ${candidate.candidate.name}: combined ${candidate.combined_score}, match ${candidate.match_score}, interest ${candidate.interest_score}`
    )
    .join('\n');

  return [
    'Match score uses skills (45%), experience (25%), seniority (20%), and location (10%).',
    'Interest score is inferred from the simulated conversation, strength of response, and presence of concerns.',
    'Combined score defaults to a 50/50 weighted average.',
    summary,
  ].join('\n');
}

export function generateRecommendations(ranked: RankedCandidate[]): string[] {
  const recommendations: string[] = [];

  ranked.slice(0, 3).forEach((candidate) => {
    if (candidate.interest_score >= 75 && candidate.match_score >= 75) {
      recommendations.push(`Prioritize ${candidate.candidate.name} for a recruiter screen this week.`);
      return;
    }

    if (candidate.interest_score >= 60) {
      recommendations.push(`Follow up with ${candidate.candidate.name} and address ${candidate.interest_assessment.key_concerns?.[0] ?? 'their open questions'}.`);
      return;
    }

    recommendations.push(`Keep ${candidate.candidate.name} warm, but lead with more role context before requesting time.`);
  });

  return recommendations;
}

export function generateStatistics(candidates: RankedCandidate[]) {
  if (candidates.length === 0) {
    return {
      total: 0,
      average_match_score: 0,
      average_interest_score: 0,
      high_interest_count: 0,
      strong_fit_count: 0,
    };
  }

  return {
    total: candidates.length,
    average_match_score: Math.round(candidates.reduce((sum, candidate) => sum + candidate.match_score, 0) / candidates.length),
    average_interest_score: Math.round(candidates.reduce((sum, candidate) => sum + candidate.interest_score, 0) / candidates.length),
    high_interest_count: candidates.filter((candidate) => candidate.interest_score >= 75).length,
    strong_fit_count: candidates.filter((candidate) => candidate.match_score >= 80).length,
  };
}
