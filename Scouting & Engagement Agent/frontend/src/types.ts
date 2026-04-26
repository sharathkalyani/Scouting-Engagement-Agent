export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  title: string;
  company?: string;
  bio: string;
  skills: string[];
  experience_years: number;
  location?: string;
  portfolio_url?: string;
  github_url?: string;
  linkedin_url?: string;
  recent_projects?: string;
}

export interface CandidateMatchBreakdown {
  skills_match: number;
  experience_match: number;
  location_match: number;
  seniority_match: number;
}

export interface InterestAssessment {
  interest_score: number;
  engagement_level: 'very_high' | 'high' | 'moderate' | 'low' | 'not_interested';
  key_concerns?: string[];
  motivations?: string[];
  likelihood_to_apply: number;
  fit_alignment_comments: string;
}

export interface RankedCandidate {
  candidate: Candidate;
  match_score: number;
  interest_score: number;
  combined_score: number;
  rank: number;
  match_breakdown: CandidateMatchBreakdown;
  interest_assessment: InterestAssessment;
}

export interface ProcessingState {
  step: 'idle' | 'parsing_jd' | 'finding_candidates' | 'engaging' | 'generating_shortlist' | 'complete' | 'error';
  progress: number;
  current_action: string;
  error?: string;
}

export interface PipelineResult {
  parsed_jd?: {
    technical_skills?: string[];
    key_responsibilities?: string[];
  };
  ranked_candidates?: RankedCandidate[];
  top_candidates?: RankedCandidate[];
  statistics?: {
    total: number;
    average_match_score: number;
    average_interest_score: number;
    high_interest_count: number;
    strong_fit_count: number;
  };
  recommendations?: string[];
  scoring_explanation?: string;
}
