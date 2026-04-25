import { VercelRequest, VercelResponse } from '@vercel/node';
import { getMockJob } from '../packages/backend/src/mock-data';
import { v4 as uuidv4 } from 'uuid';
import {
  calculateMatchScore,
  calculateInterestScore,
  rankCandidates,
  generateScoringExplanation,
  generateRecommendations,
  generateStatistics,
} from '../packages/backend/src/scoring';
import { APIResponse, RankedCandidate, ShortlistResult } from '../packages/shared/types';

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
    const { job_id, matched_candidates, engagement_sessions, match_weight } = req.body;

    if (!matched_candidates || !engagement_sessions) {
      return res.status(400).json({
        success: false,
        error: 'matched_candidates and engagement_sessions are required',
      } as APIResponse<null>);
    }

    const ranked: RankedCandidate[] = matched_candidates.map((match: any) => {
      const engagement = engagement_sessions.find((s: any) => s.candidate_id === match.candidate.id);
      const matchScore = calculateMatchScore(match);
      const interestScore = calculateInterestScore(engagement, engagement?.interest_assessment);

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
    const job = job_id ? getMockJob(job_id) : null;

    const shortlist: ShortlistResult = {
      job_id: job_id || uuidv4(),
      job_title: job?.title || 'Unspecified Role',
      total_candidates_evaluated: matched_candidates.length,
      ranked_candidates: finalRanked,
      top_candidates: finalRanked.slice(0, 10),
      generated_at: Date.now(),
    };

    const stats = generateStatistics(finalRanked);
    const recommendations = generateRecommendations(finalRanked);
    const explanation = generateScoringExplanation(finalRanked);

    res.status(200).json({
      success: true,
      data: {
        shortlist,
        statistics: stats,
        recommendations,
        scoring_explanation: explanation,
      },
    } as APIResponse<any>);
  } catch (error) {
    console.error('Error generating shortlist:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate shortlist',
    } as APIResponse<null>);
  }
};
