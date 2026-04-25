import { VercelRequest, VercelResponse } from '@vercel/node';
import { initiateEngagement, engageCandidate, assessInterest } from '../packages/backend/src/engagement-engine';
import { APIResponse } from '../packages/shared/types';

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
    const { candidate, parsed_jd } = req.body;

    if (!candidate || !parsed_jd) {
      return res.status(400).json({
        success: false,
        error: 'candidate and parsed_jd are required',
      } as APIResponse<null>);
    }

    let session = await initiateEngagement(candidate, parsed_jd.original.title, parsed_jd);
    session = await engageCandidate(session, candidate, parsed_jd, 2);
    const interestAssessment = await assessInterest(session, candidate, parsed_jd);
    session.final_interest_level = Math.round(interestAssessment.likelihood_to_apply / 10);

    res.status(200).json({
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
};
