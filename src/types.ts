export interface GitHubProject {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  homepage: string;
  language: string;
  topics: string[];
  fork: boolean;
  archived: boolean;
  stars: number;
  updatedAt: string;
  pushedAt: string;
  featured: boolean;
  slug: string;
}

export interface ProjectDataset {
  generatedAt: string;
  owner: string;
  projects: GitHubProject[];
  featuredProjects: GitHubProject[];
  unavailableFeatured: string[];
  stats: {
    fetched: number;
    public: number;
    excluded: number;
    featuredPublic: number;
    featuredUnavailable: number;
  };
}

export interface PortfolioProject {
  id: string;
  title: string;
  company: string;
  period: string;
  shortDesc: string;
  bullets: string[];
  tags: string[];
  accentFrom: string;
  accentTo: string;
  icon: 'portal' | 'agents' | 'mobile' | 'benchmark' | 'rca' | 'chatbot';
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  location: string;
  bullets: string[];
  accentColor: string;
}

export interface SkillGroup {
  label: string;
  color: string;
  skills: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  url: string;
  gradFrom: string;
  gradTo: string;
}

export interface Award {
  title: string;
  org: string;
  period: string;
  desc: string;
  gradFrom: string;
  gradTo: string;
}
