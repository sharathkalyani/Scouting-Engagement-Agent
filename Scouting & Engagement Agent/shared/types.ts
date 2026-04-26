// ===============================
// Job Description Types
// ===============================
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

// ===============================
// Candidate Types
// ===============================
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

// ===============================
// Engagement Types
// ===============================
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
  initial_interest_level?: number; // 1-10
  final_interest_level?: number; // 1-10
  interest_score?: number; // Detailed scoring
  engagement_status: 'initiated' | 'in_progress' | 'concluded';
  created_at: number;
  updated_at: number;
}

export interface InterestAssessment {
  interest_score: number; // 0-100
  engagement_level: 'very_high' | 'high' | 'moderate' | 'low' | 'not_interested';
  key_concerns?: string[];
  motivations?: string[];
  likelihood_to_apply: number; // 0-100
  fit_alignment_comments: string;
}

// ===============================
// Scoring Types
// ===============================
export interface RankedCandidate {
  candidate: Candidate;
  match_score: number; // 0-100
  interest_score: number; // 0-100
  combined_score: number; // Weighted average
  rank: number;
  match_breakdown: CandidateMatch['match_breakdown'];
  interest_assessment: InterestAssessment;
}

export interface ShortlistResult {
  job_id: string;
  job_title: string;
  total_candidates_evaluated: number;
  ranked_candidates: RankedCandidate[];
  top_candidates: RankedCandidate[]; // Top 5-10
  generated_at: number;
}

// ===============================
// API Request/Response Types
// ===============================
export interface ParseJDRequest {
  job_description: string | JobDescription;
}

export interface FindCandidatesRequest {
  job_id: string;
  parsed_jd: ParsedJD;
  candidate_pool?: Candidate[]; // Optional override
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

// ===============================
// UI State Types
// ===============================
export interface ProcessingState {
  step: 'idle' | 'parsing_jd' | 'finding_candidates' | 'engaging' | 'generating_shortlist' | 'complete' | 'error';
  progress: number; // 0-100
  current_action: string;
  error?: string;
}
