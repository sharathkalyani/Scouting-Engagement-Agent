import { v4 as uuidv4 } from 'uuid';
import { Candidate, ConversationTurn, EngagementSession, InterestAssessment, ParsedJD } from './types';

function quickMatchScore(candidate: Candidate, parsedJD: ParsedJD): number {
  const candidateSkills = candidate.skills.map((skill) => skill.toLowerCase());
  const requiredSkills = parsedJD.required_skills.map((skill) => skill.skill.toLowerCase());
  const matchedSkills = requiredSkills.filter((requiredSkill) =>
    candidateSkills.some((candidateSkill) => candidateSkill.includes(requiredSkill) || requiredSkill.includes(candidateSkill))
  ).length;

  const skillScore = requiredSkills.length === 0 ? 100 : (matchedSkills / requiredSkills.length) * 100;
  const experienceScore =
    candidate.experience_years >= parsedJD.experience_years_min
      ? 100
      : Math.max(40, 100 - (parsedJD.experience_years_min - candidate.experience_years) * 15);

  return Math.round(skillScore * 0.65 + experienceScore * 0.35);
}

function inferCandidateMotivations(candidate: Candidate, parsedJD: ParsedJD): string[] {
  const motivations: string[] = [];
  const normalizedBio = candidate.bio.toLowerCase();

  if (normalizedBio.includes('mentor') || normalizedBio.includes('lead')) motivations.push('leadership scope');
  if (normalizedBio.includes('scalable') || normalizedBio.includes('platform')) motivations.push('systems impact');
  if (candidate.skills.some((skill) => parsedJD.technical_skills.includes(skill))) motivations.push('strong technical alignment');
  if (parsedJD.original.remote) motivations.push('remote flexibility');

  return motivations.length > 0 ? motivations : ['career growth'];
}

function inferCandidateConcerns(candidate: Candidate, parsedJD: ParsedJD, matchScore: number): string[] {
  const concerns: string[] = [];

  if (!parsedJD.original.remote && parsedJD.original.location && candidate.location && parsedJD.original.location !== candidate.location) {
    concerns.push('location alignment');
  }
  if (candidate.experience_years < parsedJD.experience_years_min) {
    concerns.push('experience bar');
  }
  if (matchScore < 70) {
    concerns.push('skill overlap depth');
  }

  return concerns;
}

function generateOutreachMessage(candidate: Candidate, jobTitle: string, parsedJD: ParsedJD): string {
  const matchedSkills = candidate.skills.filter((skill) =>
    parsedJD.technical_skills.some((requiredSkill) => skill.toLowerCase().includes(requiredSkill.toLowerCase()))
  );
  const skillHighlight = matchedSkills.slice(0, 2).join(' and ') || candidate.skills.slice(0, 2).join(' and ');

  return `${candidate.name}, your background in ${skillHighlight} stood out for a ${jobTitle} role I'm working on. The team is looking for someone who can contribute quickly on product delivery and architecture, and your profile looks like a strong fit. Open to a quick conversation about it?`;
}

export async function initiateEngagement(
  candidate: Candidate,
  jobTitle: string,
  parsedJD: ParsedJD
): Promise<EngagementSession> {
  const session: EngagementSession = {
    id: uuidv4(),
    candidate_id: candidate.id,
    job_id: parsedJD.original.id,
    conversation: [],
    engagement_status: 'initiated',
    created_at: Date.now(),
    updated_at: Date.now(),
  };

  session.conversation.push({
    role: 'agent',
    message: generateOutreachMessage(candidate, jobTitle, parsedJD),
    timestamp: Date.now(),
  });

  return session;
}

export async function generateCandidateResponse(
  candidate: Candidate,
  parsedJD: ParsedJD,
  _agentMessage: string,
  conversationHistory: ConversationTurn[]
): Promise<string> {
  const matchScore = quickMatchScore(candidate, parsedJD);
  const concerns = inferCandidateConcerns(candidate, parsedJD, matchScore);
  const motivations = inferCandidateMotivations(candidate, parsedJD);
  const turnIndex = Math.floor(conversationHistory.length / 2);

  if (turnIndex === 0) {
    if (matchScore >= 80) {
      return `This looks relevant to my background, especially around ${motivations[0]}. I'm open to learning more about the team and current priorities.`;
    }
    if (matchScore >= 60) {
      return `Interesting role. I could be open to it, though I'd want more detail on ${concerns[0] ?? 'scope and expectations'}.`;
    }
    return `Thanks for reaching out. Some parts sound interesting, but I'm not sure the fit is perfect yet.`;
  }

  if (matchScore >= 75) {
    return `The scope sounds compelling. If the role truly owns ${motivations[0]}, I'd be interested in next steps.`;
  }

  if (concerns.length > 0) {
    return `Appreciate the detail. My main question is still around ${concerns[0]}, since that would influence whether I seriously pursue it.`;
  }

  return `Thanks, that helps. I'd consider moving forward if the team sees alignment on the core requirements.`;
}

function generateAgentFollowUp(
  _candidate: Candidate,
  jobTitle: string,
  parsedJD: ParsedJD,
  candidateResponse: string
): string {
  const lowerResponse = candidateResponse.toLowerCase();
  const highlight = parsedJD.key_responsibilities[0] ?? 'owning a meaningful product area';

  if (lowerResponse.includes('location')) {
    return `That makes sense. The team can be flexible depending on the candidate, and the role is centered on ${highlight}. Would that combination make it worth a deeper call?`;
  }

  if (lowerResponse.includes('scope') || lowerResponse.includes('expectations')) {
    return `Happy to add color there. This ${jobTitle} role is focused on ${highlight}, with a lot of visibility into roadmap decisions. Which part of the scope matters most to you?`;
  }

  return `Helpful to hear. The team especially values experience with ${parsedJD.technical_skills.slice(0, 2).join(' and ')} and someone who can help with ${highlight}. Would you be open to an intro call this week?`;
}

export async function engageCandidate(
  session: EngagementSession,
  candidate: Candidate,
  parsedJD: ParsedJD,
  turns = 2
): Promise<EngagementSession> {
  session.engagement_status = 'in_progress';

  for (let index = 0; index < turns; index += 1) {
    const lastMessage = session.conversation[session.conversation.length - 1];
    if (lastMessage?.role !== 'agent') {
      break;
    }

    const candidateResponse = await generateCandidateResponse(candidate, parsedJD, lastMessage.message, session.conversation);
    session.conversation.push({
      role: 'candidate',
      message: candidateResponse,
      timestamp: Date.now(),
    });

    const agentFollowUp = generateAgentFollowUp(candidate, parsedJD.original.title, parsedJD, candidateResponse);
    session.conversation.push({
      role: 'agent',
      message: agentFollowUp,
      timestamp: Date.now(),
    });
  }

  session.engagement_status = 'concluded';
  session.updated_at = Date.now();
  return session;
}

export async function assessInterest(
  session: EngagementSession,
  candidate: Candidate,
  parsedJD: ParsedJD
): Promise<InterestAssessment> {
  const matchScore = quickMatchScore(candidate, parsedJD);
  const transcript = session.conversation.map((turn) => turn.message.toLowerCase()).join(' ');
  const motivations = inferCandidateMotivations(candidate, parsedJD);
  const concerns = inferCandidateConcerns(candidate, parsedJD, matchScore);

  let score = 45 + Math.round(matchScore * 0.35);
  if (transcript.includes('open to')) score += 8;
  if (transcript.includes('interested')) score += 10;
  if (transcript.includes('next steps')) score += 10;
  if (transcript.includes('not sure')) score -= 12;
  if (transcript.includes('not perfect')) score -= 10;
  score -= concerns.length * 4;
  score = Math.max(20, Math.min(96, score));

  let engagementLevel: InterestAssessment['engagement_level'] = 'moderate';
  if (score >= 85) engagementLevel = 'very_high';
  else if (score >= 72) engagementLevel = 'high';
  else if (score < 40) engagementLevel = 'not_interested';
  else if (score < 55) engagementLevel = 'low';

  return {
    interest_score: score,
    engagement_level: engagementLevel,
    key_concerns: concerns,
    motivations,
    likelihood_to_apply: Math.max(20, Math.min(95, score + (matchScore >= 80 ? 4 : 0))),
    fit_alignment_comments:
      score >= 75
        ? 'Positive response pattern with enough specificity to justify recruiter follow-up.'
        : 'Interest is mixed; recruiter should address open questions before moving to interview.',
  };
}
