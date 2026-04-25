import { VercelRequest, VercelResponse } from '@vercel/node';
import { parseJobDescription, extractSearchKeywords } from '../packages/backend/src/jd-parser';
import { matchCandidates } from '../packages/backend/src/candidate-matcher';
import { initiateEngagement, engageCandidate, assessInterest } from '../packages/backend/src/engagement-engine';
import { searchCandidatesBySkills } from '../packages/backend/src/mock-data';
import {
  calculateMatchScore,
  calculateInterestScore,
  rankCandidates,
  generateScoringExplanation,
  generateRecommendations,
  generateStatistics,
} from '../packages/backend/src/scoring';
import { APIResponse, EngagementSession, CandidateMatch, RankedCandidate } from '../packages/shared/types';

export default async (req: VercelRequest, res: VercelResponse) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { job_description, limit, engagement_turns, match_weight } = req.body;

    if (!job_description) {
      return res.status(400).json({
        success: false,
        error: 'job_description is required',
      } as APIResponse<null>);
    }

    console.log('Step 1: Parsing job description...');
    const parsed = await parseJobDescription(job_description);

    console.log('Step 2: Finding matching candidates...');
    const keywords = extractSearchKeywords(parsed);
    const candidates = searchCandidatesBySkills(keywords, 1);
    const matched = await matchCandidates(candidates, parsed, limit || 10);

    console.log(`Step 3: Engaging ${matched.length} candidates...`);
    const engagementSessions: EngagementSession[] = [];
    for (const match of matched.slice(0, 5)) {
      try {
        let session = await initiateEngagement(match.candidate, parsed.original.title, parsed);
        session = await engageCandidate(session, match.candidate, parsed, engagement_turns || 2);
        const assessment = await assessInterest(session, match.candidate, parsed);
        session.final_interest_level = Math.round(assessment.likelihood_to_apply / 10);
        engagementSessions.push({ ...session, interest_assessment: assessment } as any);
      } catch (error: any) {
        console.error(`Failed to engage ${match.candidate.name}:`, error);
      }
    }

    console.log('Step 4: Generating ranked shortlist...');
    const ranked: RankedCandidate[] = matched.map((match: CandidateMatch) => {
      const engagement = engagementSessions.find((s: any) => s.candidate_id === match.candidate.id);
      const matchScore = calculateMatchScore(match);
      const interestScore = engagement
        ? calculateInterestScore(engagement, engagement.interest_assessment)
        : 50;

      return {
        candidate: match.candidate,
        match_score: matchScore,
        interest_score: interestScore,
        combined_score: 0,
        rank: 0,
        match_breakdown: match.match_breakdown,
        interest_assessment: engagement?.interest_assessment || {
          interest_score: interestScore,
          engagement_level: 'moderate' as const,
          likelihood_to_apply: interestScore,
          fit_alignment_comments: 'Not directly engaged',
        },
      };
    });

    const finalRanked = rankCandidates(ranked, match_weight || 0.5);
    const stats = generateStatistics(finalRanked);
    const recommendations = generateRecommendations(finalRanked);

    res.status(200).json({
      success: true,
      data: {
        parsed_jd: parsed,
        candidates_found: matched.length,
        candidates_engaged: engagementSessions.length,
        scoring_explanation: generateScoringExplanation(finalRanked),
        ranked_candidates: finalRanked,
        top_candidates: finalRanked.slice(0, 5),
        statistics: stats,
        recommendations,
      },
    } as APIResponse<any>);
  } catch (error) {
    console.error('Error in full pipeline:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Pipeline failed',
    } as APIResponse<null>);
  }
};
