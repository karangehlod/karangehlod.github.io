import { useState, useEffect } from 'react';

/* TypeScript shape of content.json (mirrors profile.md frontmatter) */
export interface Personal {
  name: string;
  title: string;
  tagline: string;
  summary_tagline: string;
  location: string;
  email: string;
  phone?: string;
  dob?: string;
}

export interface Social {
  github: string;
  linkedin: string;
  twitter: string;
  medium: string;
  reddit: string;
  orcid: string;
}

export interface Support {
  paypal: string;
  buy_me_a_coffee?: string;
  cal: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  location: string;
  color: string;
  bullets: string[];
}

export interface SkillGroup {
  label: string;
  color: string;
  items: string[];
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

export interface Education {
  degree: string;
  school: string;
  period: string;
  location: string;
}

export interface SiteContent {
  personal: Personal;
  social: Social;
  support: Support;
  featured_repos: string[];
  experience: ExperienceItem[];
  skills: SkillGroup[];
  portfolio: PortfolioProject[];
  certifications: Certification[];
  awards: Award[];
  education: Education;
  summaryMarkdown: string;
  generatedAt: string;
}

type Status = 'loading' | 'ready' | 'error';

export function useContent() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus]   = useState<Status>('loading');

  useEffect(() => {
    fetch('./content.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<SiteContent>;
      })
      .then(data => { setContent(data); setStatus('ready'); })
      .catch(err => {
        console.error('[useContent]', err);
        setStatus('error');
      });
  }, []);

  return { content, status };
}
