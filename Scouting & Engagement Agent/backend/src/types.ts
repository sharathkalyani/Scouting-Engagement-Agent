export interface JobDescription {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  experience_level: 'junior' | 'mid' | 'senior' | 'lead';
  salary_range?: { min: number; max: number };
  location?: string;
  remote?: boolean;
  department?: string;
}

export interface ParsedJD {
  original: JobDescription;
  key_responsibilities: string[];
  required_skills: Array<{ skill: string; importance: number }>;
  nice_to_have_skills: Array<{ skill: string; importance: number }>;
  experience_years_min: number;
  experience_years_max: number;
  technical_skills: string[];
  soft_skills: string[];
  keywords: string[];
}

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

export interface CandidateMatch {
  candidate: Candidate;
  match_score: number;
  match_breakdown: {
    skills_match: number;
    experience_match: number;
    location_match: number;
    seniority_match: number;
  };
  matched_skills: string[];
  missing_skills: string[];
  match_reasoning: string;
}

export interface ConversationTurn {
  role: 'agent' | 'candidate';
  message: string;
  timestamp: number;
}

export interface EngagementSession {
  id: string;
  candidate_id: string;
  job_id: string;
  conversation: ConversationTurn[];
  initial_interest_level?: number;
  final_interest_level?: number;
  interest_score?: number;
  interest_assessment?: InterestAssessment;
  engagement_status: 'initiated' | 'in_progress' | 'concluded';
  created_at: number;
  updated_at: number;
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
  match_breakdown: CandidateMatch['match_breakdown'];
  interest_assessment: InterestAssessment;
}

export interface ShortlistResult {
  job_id: string;
  job_title: string;
  total_candidates_evaluated: number;
  ranked_candidates: RankedCandidate[];
  top_candidates: RankedCandidate[];
  generated_at: number;
}

export interface ParseJDRequest {
  job_description: string | JobDescription;
}

export interface FindCandidatesRequest {
  job_id: string;
  parsed_jd: ParsedJD;
  candidate_pool?: Candidate[];
  limit?: number;
}

export interface EngageRequest {
  job_id: string;
  candidate: Candidate;
  parsed_jd: ParsedJD;
}

export interface GenerateShortlistRequest {
  job_id: string;
  matched_candidates: CandidateMatch[];
  engagement_sessions: EngagementSession[];
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
