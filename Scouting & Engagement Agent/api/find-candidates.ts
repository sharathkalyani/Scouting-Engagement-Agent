import { VercelRequest, VercelResponse } from '@vercel/node';
import { matchCandidates } from '../packages/backend/src/candidate-matcher';
import { searchCandidatesBySkills, getAllMockCandidates } from '../packages/backend/src/mock-data';
import { APIResponse, FindCandidatesRequest } from '../packages/shared/types';

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
    const { parsed_jd, candidate_pool, limit } = req.body as FindCandidatesRequest;

    if (!parsed_jd) {
      return res.status(400).json({
        success: false,
        error: 'parsed_jd is required',
      } as APIResponse<null>);
    }

    const candidates = candidate_pool || (() => {
      const keywords = parsed_jd.keywords;
      const foundCandidates = searchCandidatesBySkills(keywords, 1);
      return foundCandidates.length > 0 ? foundCandidates : getAllMockCandidates();
    })();

    const matched = await matchCandidates(candidates, parsed_jd, limit || 20);

    res.status(200).json({
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
};
