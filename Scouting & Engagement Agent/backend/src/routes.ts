import express, { Request, Response } from 'express';
import { parseJobDescription, extractSearchKeywords } from './jd-parser';
import { matchCandidates } from './candidate-matcher';
import { initiateEngagement, engageCandidate, assessInterest } from './engagement-engine';
import {
  calculateMatchScore,
  calculateInterestScore,
  rankCandidates,
  generateScoringExplanation,
  generateRecommendations,
  generateStatistics,
} from './scoring';
import {
  ParseJDRequest,
  FindCandidatesRequest,
  ShortlistResult,
  RankedCandidate,
  APIResponse,
  CandidateMatch,
  EngagementSession,
} from './types';
import { getMockJob, getAllMockCandidates, searchCandidatesBySkills } from './mock-data';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Parse Job Description
 * POST /api/parse-jd
 */
router.post('/parse-jd', async (req: Request, res: Response) => {
  try {
    const { job_description } = req.body as ParseJDRequest;

    if (!job_description) {
      return res.status(400).json({
        success: false,
        error: 'job_description is required',
      } as APIResponse<null>);
    }

    const parsed = await parseJobDescription(job_description);
    const keywords = extractSearchKeywords(parsed);

    res.json({
      success: true,
      data: {
        ...parsed,
        search_keywords: keywords,
      },
    } as APIResponse<any>);
  } catch (error) {
    console.error('Error parsing JD:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse job description',
    } as APIResponse<null>);
  }
});

/**
 * Find Candidates
 * POST /api/find-candidates
 */
router.post('/find-candidates', async (req: Request, res: Response) => {
  try {
    const { parsed_jd, candidate_pool, limit } = req.body as FindCandidatesRequest;

    if (!parsed_jd) {
      return res.status(400).json({
        success: false,
        error: 'parsed_jd is required',
      } as APIResponse<null>);
    }

    // Use provided candidate pool or fetch from mock data
    const candidates = candidate_pool || (() => {
      const keywords = parsed_jd.keywords;
      const foundCandidates = searchCandidatesBySkills(keywords, 1);
      return foundCandidates.length > 0 ? foundCandidates : getAllMockCandidates();
    })();

    const matched = await matchCandidates(candidates, parsed_jd, limit || 20);

    res.json({
      success: true,
      data: {
        matched_candidates: matched,
        total_evaluated: candidates.length,
        matches_found: matched.length,
      },
    } as APIResponse<any>);
  } catch (error) {
    console.error('Error finding candidates:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to find candidates',
    } as APIResponse<null>);
  }
});

/**
 * Engage Candidate
 * POST /api/engage-candidate
 */
router.post('/engage-candidate', async (req: Request, res: Response) => {
  try {
    const { candidate, parsed_jd } = req.body;

    if (!candidate || !parsed_jd) {
      return res.status(400).json({
        success: false,
        error: 'candidate and parsed_jd are required',
      } as APIResponse<null>);
    }

    // Initiate engagement
    let session = await initiateEngagement(candidate, parsed_jd.original.title, parsed_jd);

    // Engage with multi-turn conversation
    session = await engageCandidate(session, candidate, parsed_jd, 2);

    // Assess interest
    const interestAssessment = await assessInterest(session, candidate, parsed_jd);
    session.final_interest_level = Math.round(interestAssessment.likelihood_to_apply / 10);

    res.json({
      success: true,
      data: {
        session,
        interest_assessment: interestAssessment,
      },
    } as APIResponse<any>);
  } catch (error) {
    console.error('Error engaging candidate:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to engage candidate',
    } as APIResponse<null>);
  }
});

/**
 * Generate Shortlist
 * POST /api/generate-shortlist
 */
router.post('/generate-shortlist', async (req: Request, res: Response) => {
  try {
    const { job_id, matched_candidates, engagement_sessions, match_weight } = req.body;

    if (!matched_candidates || !engagement_sessions) {
      return res.status(400).json({
        success: false,
        error: 'matched_candidates and engagement_sessions are required',
      } as APIResponse<null>);
    }

    // Build ranked candidates
    const ranked: RankedCandidate[] = matched_candidates.map((match: any) => {
      const engagement = engagement_sessions.find((s: any) => s.candidate_id === match.candidate.id);
      const matchScore = calculateMatchScore(match);
      const interestScore = calculateInterestScore(engagement, engagement?.interest_assessment);

      return {
        candidate: match.candidate,
        match_score: matchScore,
        interest_score: interestScore,
        combined_score: 0, // Will be calculated
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

    // Rank candidates
    const finalRanked = rankCandidates(ranked, match_weight || 0.5);

    // Get job details
    const job = job_id ? getMockJob(job_id) : null;

    const shortlist: ShortlistResult = {
      job_id: job_id || uuidv4(),
      job_title: job?.title || 'Unspecified Role',
      total_candidates_evaluated: matched_candidates.length,
      ranked_candidates: finalRanked,
      top_candidates: finalRanked.slice(0, 10),
      generated_at: Date.now(),
    };

    // Generate insights
    const stats = generateStatistics(finalRanked);
    const recommendations = generateRecommendations(finalRanked);
    const explanation = generateScoringExplanation(finalRanked);

    res.json({
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
});

/**
 * Full Pipeline: Parse JD -> Find Candidates -> Engage -> Generate Shortlist
 * POST /api/full-pipeline
 */
router.post('/full-pipeline', async (req: Request, res: Response) => {
  try {
    const { job_description, limit, engagement_turns, match_weight } = req.body;

    if (!job_description) {
      return res.status(400).json({
        success: false,
        error: 'job_description is required',
      } as APIResponse<null>);
    }

    // Step 1: Parse JD
    console.log('Step 1: Parsing job description...');
    const parsed = await parseJobDescription(job_description);

    // Step 2: Find candidates
    console.log('Step 2: Finding matching candidates...');
    const keywords = extractSearchKeywords(parsed);
    const candidates = searchCandidatesBySkills(keywords, 1);
    const matched = await matchCandidates(candidates, parsed, limit || 10);

    // Step 3: Engage candidates
    console.log(`Step 3: Engaging ${matched.length} candidates...`);
    const engagementSessions: EngagementSession[] = [];
    for (const match of matched.slice(0, 5)) {
      // Limit to 5 for speed
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

    // Step 4: Generate shortlist
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

    res.json({
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
});

export default router;
