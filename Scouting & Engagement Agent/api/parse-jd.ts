import { VercelRequest, VercelResponse } from '@vercel/node';
import { parseJobDescription, extractSearchKeywords } from '../backend/src/jd-parser';
import { APIResponse } from '../shared/types';

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
    const { job_description } = req.body;

    if (!job_description) {
      return res.status(400).json({
        success: false,
        error: 'job_description is required',
      } as APIResponse<null>);
    }

    const parsed = await parseJobDescription(job_description);
    const keywords = extractSearchKeywords(parsed);

    res.status(200).json({
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
};

