import { JobDescription, ParsedJD } from './types';

const TECH_SKILL_CATALOG = [
  'React',
  'Vue.js',
  'Angular',
  'Node.js',
  'Python',
  'Java',
  'TypeScript',
  'JavaScript',
  'Go',
  'Rust',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'GraphQL',
  'REST',
  'AWS',
  'GCP',
  'Azure',
  'Docker',
  'Kubernetes',
  'Terraform',
  'CI/CD',
  'Git',
  'Next.js',
  'Redux',
  'System Design',
  'Microservices',
];

const SOFT_SKILL_CATALOG = [
  'Communication',
  'Leadership',
  'Mentoring',
  'Collaboration',
  'Ownership',
  'Problem Solving',
  'Stakeholder Management',
];

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function extractSection(text: string, headings: string[]): string[] {
  const lines = text.split(/\r?\n/);
  const normalizedHeadings = headings.map((heading) => heading.toLowerCase());
  const extracted: string[] = [];
  let active = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const lowered = line.toLowerCase();

    if (normalizedHeadings.some((heading) => lowered.startsWith(heading))) {
      active = true;
      continue;
    }

    if (active && /^(responsibilities|requirements|required skills|nice to have|preferred|qualifications|compensation|location)/i.test(line)) {
      break;
    }

    if (active && /^[\-\*]/.test(line)) {
      extracted.push(line.replace(/^[\-\*]\s*/, '').trim());
    }
  }

  return extracted;
}

function detectSkills(text: string, catalog: string[]): string[] {
  const lowered = text.toLowerCase();
  return catalog.filter((skill) => lowered.includes(skill.toLowerCase()));
}

function parseExperienceRange(text: string): { min: number; max: number } {
  const explicitRange = text.match(/(\d+)\s*[-to]{1,3}\s*(\d+)\+?\s+years?/i);
  if (explicitRange) {
    return {
      min: Number(explicitRange[1]),
      max: Number(explicitRange[2]),
    };
  }

  const minOnly = text.match(/(\d+)\+?\s+years?/i);
  const min = minOnly ? Number(minOnly[1]) : 3;
  return { min, max: min + 6 };
}

function inferExperienceLevel(minYears: number): JobDescription['experience_level'] {
  if (minYears >= 10) return 'lead';
  if (minYears >= 6) return 'senior';
  if (minYears >= 3) return 'mid';
  return 'junior';
}

function inferLocation(text: string): { location?: string; remote?: boolean } {
  const remote = /\bremote\b|\bhybrid\b/i.test(text);
  const locationMatch = text.match(/location\s*:\s*([^\n]+)/i);

  if (locationMatch) {
    return {
      location: locationMatch[1].trim(),
      remote,
    };
  }

  const titleLine = text.split(/\r?\n/)[0] ?? '';
  const titleLocation = titleLine.split('-').slice(1).join('-').trim();
  return {
    location: titleLocation || undefined,
    remote,
  };
}

function buildOriginalJob(jd: string): JobDescription {
  const lines = jd.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const firstLine = lines[0] || 'Untitled Role';
  const { min } = parseExperienceRange(jd);
  const technicalSkills = detectSkills(jd, TECH_SKILL_CATALOG);
  const requirementBullets = extractSection(jd, ['requirements', 'required skills', 'qualifications']);
  const locationInfo = inferLocation(jd);

  return {
    id: `job-${Date.now()}`,
    title: firstLine.split('-')[0].trim(),
    description: jd,
    requirements: requirementBullets,
    skills: technicalSkills,
    experience_level: inferExperienceLevel(min),
    location: locationInfo.location,
    remote: locationInfo.remote,
  };
}

export async function parseJobDescription(jd: string | JobDescription): Promise<ParsedJD> {
  const original = typeof jd === 'string' ? buildOriginalJob(jd) : jd;
  const sourceText =
    typeof jd === 'string'
      ? jd
      : [jd.title, jd.description, ...jd.requirements, ...jd.skills].filter(Boolean).join('\n');

  const responsibilities = extractSection(sourceText, ['responsibilities', 'key responsibilities']);
  const requiredBullets = extractSection(sourceText, ['requirements', 'required skills', 'qualifications']);
  const niceToHaveBullets = extractSection(sourceText, ['nice to have', 'preferred']);
  const technicalSkills = detectSkills(sourceText, TECH_SKILL_CATALOG);
  const softSkills = detectSkills(sourceText, SOFT_SKILL_CATALOG);
  const experienceRange = parseExperienceRange(sourceText);

  const requiredSkills = technicalSkills.map((skill, index) => ({
    skill,
    importance: Math.max(0.55, Number((1 - index * 0.04).toFixed(2))),
  }));

  const niceToHaveSkills = detectSkills(niceToHaveBullets.join('\n'), TECH_SKILL_CATALOG).map((skill, index) => ({
    skill,
    importance: Math.max(0.3, Number((0.65 - index * 0.05).toFixed(2))),
  }));

  const keywordPool = new Set<string>([
    ...technicalSkills,
    ...softSkills,
    ...requiredBullets.flatMap((bullet) => bullet.split(/[,\-/]/).map((part) => part.trim())),
    original.title,
    original.experience_level,
  ]);

  const keywords = Array.from(keywordPool)
    .filter((value) => value && value.length > 2)
    .map((value) => toTitleCase(value));

  return {
    original,
    key_responsibilities: responsibilities,
    required_skills: requiredSkills,
    nice_to_have_skills: niceToHaveSkills,
    experience_years_min: experienceRange.min,
    experience_years_max: experienceRange.max,
    technical_skills: technicalSkills,
    soft_skills: softSkills,
    keywords,
  };
}

export function extractSearchKeywords(parsed: ParsedJD): string[] {
  const keywords = new Set<string>();

  parsed.technical_skills.forEach((skill) => keywords.add(skill.toLowerCase()));
  parsed.soft_skills.forEach((skill) => keywords.add(skill.toLowerCase()));
  parsed.required_skills.forEach(({ skill }) => keywords.add(skill.toLowerCase()));
  parsed.nice_to_have_skills.forEach(({ skill }) => keywords.add(skill.toLowerCase()));
  parsed.keywords.forEach((keyword) => keywords.add(keyword.toLowerCase()));
  keywords.add(parsed.original.title.toLowerCase());
  keywords.add(parsed.original.experience_level.toLowerCase());

  return Array.from(keywords);
}
