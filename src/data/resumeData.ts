import type { Experience, SkillGroup, Certification, Award } from '../types';

export const experience: Experience[] = [
  {
    title: 'Software Engineer II (R&D)',
    company: 'Johnson Controls',
    period: 'Aug 2022 – Present',
    location: 'Bengaluru, India',
    accentColor: '#6366f1',
    bullets: [
      'Promoted to SDE-II for driving AI-led platform modernisation; defined end-to-end architecture across control, data, application, and ecosystem layers — establishing system boundaries, API contracts, and closed-loop AI feedback for autonomous decision workflows at enterprise scale.',
      'Led architecture and performance optimisation across distributed systems, improving throughput by 12% and reducing development costs by 20% through modular design, automation, and scalable Python/Java backend services.',
      'Achieved $150K annual cost savings by re-architecting AKS workloads with right-sizing, autoscaling strategies, and infrastructure governance controls.',
      'Integrated generative AI solutions into core product workflows, enhancing automation, decision intelligence, and operational efficiency across multiple product portfolios.',
      'Owned end-to-end delivery of 10+ cross-functional projects partnering with Product, DevOps, and Business teams — 95%+ stakeholder satisfaction.',
    ],
  },
  {
    title: 'Software Developer',
    company: 'Capgemini India',
    period: 'Feb 2021 – Aug 2022',
    location: 'Gujarat, India',
    accentColor: '#0ea5e9',
    bullets: [
      'Designed and deployed serverless data automation solutions on Azure Functions, building scalable ETL pipelines that processed enterprise datasets with 99% accuracy — earning the Rising Star award within 5 months of joining.',
      'Owned full lifecycle delivery of four production projects end-to-end with a team of six, translating data science requirements into reliable cloud-native workflows from architecture through deployment.',
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    label: 'GenAI & AI',
    color: 'text-indigo-400',
    skills: ['RAG', 'LLMs', 'Embeddings', 'AI Agents', 'LangChain', 'LangGraph', 'AutoGen', 'Prompt Engineering', 'NLP', 'Closed-loop AI', 'Autonomous Orchestration'],
  },
  {
    label: 'Cloud & DevOps',
    color: 'text-sky-400',
    skills: ['Azure', 'AKS', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'ArgoCD', 'GitHub Actions'],
  },
  {
    label: 'Backend & APIs',
    color: 'text-violet-400',
    skills: ['Python', 'Java', 'JavaScript', 'C#', 'FastAPI', 'REST', 'OAuth2', 'OIDC', 'Micro-services', 'TDD'],
  },
  {
    label: 'Data & Pipelines',
    color: 'text-emerald-400',
    skills: ['ETL', 'Data Lakes', 'Snowflake', 'Kafka', 'Apache Iceberg', 'Redpanda'],
  },
  {
    label: 'Databases',
    color: 'text-amber-400',
    skills: ['PostgreSQL', 'ClickHouse', 'TimescaleDB', 'MSSQL', 'MongoDB', 'Query Tuning'],
  },
  {
    label: 'Tools & Platforms',
    color: 'text-rose-400',
    skills: ['Git', 'GitHub Copilot', 'Postman', 'VS Code', 'Linux', 'Jira', 'Azure Monitor', 'Logz.io'],
  },
];

export const certifications: Certification[] = [
  {
    name: 'AI-102 Azure AI Engineer Associate',
    issuer: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/',
    gradFrom: '#6366f1',
    gradTo: '#818cf8',
  },
  {
    name: 'Az-900 Azure Fundamentals',
    issuer: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
    gradFrom: '#0ea5e9',
    gradTo: '#38bdf8',
  },
  {
    name: 'AI Agentic Design Patterns with AutoGen',
    issuer: 'DeepLearning.AI',
    url: 'https://learn.deeplearning.ai/courses/ai-agentic-design-patterns-with-autogen',
    gradFrom: '#7c3aed',
    gradTo: '#a78bfa',
  },
  {
    name: 'Databricks Lakehouse Fundamentals',
    issuer: 'Databricks',
    url: 'https://www.databricks.com/learn/certification/data-lakehouse-fundamentals',
    gradFrom: '#10b981',
    gradTo: '#34d399',
  },
  {
    name: 'Oracle Cloud Infrastructure 2024 Generative AI',
    issuer: 'Oracle',
    url: 'https://education.oracle.com/oracle-cloud-infrastructure-2024-generative-ai-professional/pexam_1Z0-1127-24',
    gradFrom: '#f59e0b',
    gradTo: '#fbbf24',
  },
];

export const awards: Award[] = [
  {
    title: 'TechChallenge — Semi-Finalist',
    org: 'Johnson Controls',
    period: 'June 2025',
    desc: 'Recognition for understanding problem statement and driving business value with AI enablement in solution.',
    gradFrom: '#f59e0b',
    gradTo: '#f97316',
  },
  {
    title: 'Rising Star',
    org: 'Capgemini India',
    period: 'June 2021',
    desc: 'Recognition for outstanding performance on a client project within 5 months of joining.',
    gradFrom: '#0ea5e9',
    gradTo: '#3b82f6',
  },
];
