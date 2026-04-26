import { Candidate, JobDescription } from './types';

export const mockCandidates: Candidate[] = [
  {
    id: 'cand_001',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '+1-415-555-0101',
    title: 'Senior Full Stack Engineer',
    company: 'TechCorp',
    bio: 'Passionate about building scalable web applications. 8 years experience with React, Node.js, and cloud deployment.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Docker', 'GraphQL'],
    experience_years: 8,
    location: 'San Francisco, CA',
    portfolio_url: 'https://sarahchen.dev',
    github_url: 'https://github.com/sarahchen',
    recent_projects: 'Led redesign of core platform resulting in 40% performance improvement',
  },
  {
    id: 'cand_002',
    name: 'Marcus Johnson',
    email: 'marcus.j@email.com',
    title: 'Backend Engineer',
    company: 'StartupXYZ',
    bio: 'Backend specialist with strong systems design background. Proficient in microservices architecture.',
    skills: ['Java', 'Spring Boot', 'Kubernetes', 'AWS', 'PostgreSQL', 'Redis', 'Python'],
    experience_years: 5,
    location: 'New York, NY',
    recent_projects: 'Designed and implemented event-driven microservices handling 1M+ daily events',
  },
  {
    id: 'cand_003',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    title: 'Full Stack Developer',
    company: 'DesignStudio',
    bio: 'Creative developer who loves UI/UX. Strong in both frontend and backend. Remote work enthusiast.',
    skills: ['React', 'Vue.js', 'JavaScript', 'Python', 'Firebase', 'CSS', 'MongoDB'],
    experience_years: 4,
    location: 'Austin, TX',
    portfolio_url: 'https://emilyrodriguez.design',
    recent_projects: 'Built data visualization dashboard used by 500K+ users',
  },
  {
    id: 'cand_004',
    name: 'David Park',
    email: 'david.park@email.com',
    title: 'Senior DevOps Engineer',
    company: 'CloudServices Inc',
    bio: 'Infrastructure and DevOps expert. Passionate about CI/CD pipelines and infrastructure-as-code.',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'GitLab CI', 'Python', 'Go'],
    experience_years: 10,
    location: 'Seattle, WA',
    recent_projects: 'Migrated legacy infrastructure to Kubernetes, reducing costs by 35%',
  },
  {
    id: 'cand_005',
    name: 'Jessica Lee',
    email: 'jessica.lee@email.com',
    title: 'Mid-Level Frontend Engineer',
    company: 'WebAgency',
    bio: 'Specialized in responsive design and performance optimization. Team player with strong mentoring skills.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'Jest', 'Next.js'],
    experience_years: 3,
    location: 'Los Angeles, CA',
    recent_projects:
      'Developed component library adopted by 15+ internal projects, standardizing design across organization',
  },
  {
    id: 'cand_006',
    name: 'Alex Thompson',
    email: 'alex.t@email.com',
    title: 'Principal Engineer',
    company: 'TechGiant',
    bio: 'Technical leader and architect. 15 years building production systems at scale.',
    skills: ['Go', 'Rust', 'JavaScript', 'AWS', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Python'],
    experience_years: 15,
    location: 'Mountain View, CA',
    recent_projects: 'Architected distributed tracing system processing 1B+ spans daily',
  },
  {
    id: 'cand_007',
    name: 'Lisa Wang',
    email: 'lisa.wang@email.com',
    title: 'Graduate Software Engineer',
    company: 'TechStartup',
    bio: 'Recent bootcamp graduate passionate about continuous learning. Quick learner with strong fundamentals.',
    skills: ['JavaScript', 'React', 'Python', 'SQL', 'Git', 'HTML/CSS'],
    experience_years: 1,
    location: 'San Jose, CA',
    recent_projects:
      'Built personal project: task management app with 500+ GitHub stars',
  },
  {
    id: 'cand_008',
    name: 'Robert Kim',
    email: 'robert.kim@email.com',
    title: 'Fullstack Engineer',
    company: 'FinTech Co',
    bio: 'Full stack developer with fintech experience. Strong in building secure, scalable financial systems.',
    skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'TypeScript', 'Stripe API'],
    experience_years: 7,
    location: 'Boston, MA',
    recent_projects:
      'Led development of payment processing system handling $100M+ in annual transactions',
  },
];

export const mockJobDescriptions: JobDescription[] = [
  {
    id: 'job_001',
    title: 'Senior Full Stack Engineer',
    description: `We are looking for an experienced Full Stack Engineer to lead our product development. You will work on our core platform serving millions of users, architect new features, and mentor junior engineers. This is a hands-on role where you'll be involved in both strategic decisions and implementation.

Key Responsibilities:
- Design and implement scalable backend systems
- Build intuitive and performant user interfaces
- Lead code reviews and mentoring
- Collaborate with product and design teams
- Implement CI/CD pipelines and DevOps practices

Required Skills:
- 6+ years of software development experience
- Strong proficiency in React or Vue.js
- Backend development with Node.js or Python
- Database design (SQL and NoSQL)
- Cloud deployment (AWS/GCP/Azure)
- Understanding of system design and scalability`,
    requirements: [
      'BS in Computer Science or equivalent',
      '6+ years of software development',
      'Leadership experience',
      'Open source contributions a plus',
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'System Design', 'PostgreSQL', 'Docker'],
    experience_level: 'senior',
    salary_range: { min: 150000, max: 250000 },
    location: 'San Francisco, CA',
    remote: false,
    department: 'Engineering',
  },
  {
    id: 'job_002',
    title: 'DevOps Engineer',
    description: `Join our infrastructure team to build and maintain the systems that power our platform. You'll work on containerization, orchestration, CI/CD pipelines, and infrastructure automation.

Key Responsibilities:
- Design and implement scalable infrastructure
- Build and manage Kubernetes clusters
- Develop CI/CD automation
- Ensure system reliability and security
- Optimize infrastructure costs`,
    requirements: [
      '4+ years DevOps/SRE experience',
      'Expert in Kubernetes/Docker',
      'AWS or GCP experience',
      'Infrastructure-as-Code knowledge',
    ],
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'Python', 'Go'],
    experience_level: 'mid',
    salary_range: { min: 120000, max: 180000 },
    location: 'Remote',
    remote: true,
    department: 'Infrastructure',
  },
  {
    id: 'job_003',
    title: 'Frontend Engineer',
    description: `We're hiring a Frontend Engineer to help craft beautiful, performant user experiences. Work with React, TypeScript, and modern web technologies to build features that millions of users interact with daily.

Key Responsibilities:
- Build interactive user interfaces
- Optimize performance
- Implement responsive design
- Collaborate with designers and backend engineers
- Write clean, testable code`,
    requirements: [
      '3+ years of front-end development',
      'Strong React knowledge',
      'CSS/HTML expertise',
      'Performance optimization experience',
    ],
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Redux', 'Testing Libraries'],
    experience_level: 'mid',
    salary_range: { min: 100000, max: 160000 },
    location: 'San Francisco, CA',
    remote: true,
    department: 'Engineering',
  },
];

/**
 * Get a mock job description by ID
 */
export function getMockJob(jobId: string): JobDescription | undefined {
  return mockJobDescriptions.find((j) => j.id === jobId);
}

/**
 * Get all mock candidates
 */
export function getAllMockCandidates(): Candidate[] {
  return mockCandidates;
}

/**
 * Search candidates by skills
 */
export function searchCandidatesBySkills(skills: string[], minMatch: number = 2): Candidate[] {
  return mockCandidates.filter((candidate: Candidate) => {
    const matches = skills.filter((skill: string) =>
      candidate.skills.some((cs: string) => cs.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs.toLowerCase()))
    );
    return matches.length >= minMatch;
  });
}
