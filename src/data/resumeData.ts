import type { Experience, SkillGroup, Certification, Award } from '../types';

export const professionalSummary =
  'Senior AI Engineer with 5+ years of experience designing and shipping production Agentic AI and GenAI systems on Azure and Kubernetes. Architected an enterprise multi-agent (A2A) orchestration platform with tenant-isolation and access guardrails, led the LangGraph vs Semantic Kernel evaluation and ADR that set the organisation standard, and built a RAG-based GenAI assistant and an LLM ticket-intelligence platform (SmartRCA).';

export const leadershipSummary =
  'Led a team of 5, reviewed designs for 5 teams, and mentored 3 engineers.';

export const experience: Experience[] = [
  {
    title: 'Software Engineer II (R&D), AI and Agentic Platforms',
    company: 'Johnson Controls',
    period: 'Aug 2022 – Present',
    rolePeriod: 'Mar 2025 – Present',
    previousRole: 'Software Engineer · Aug 2022 – Mar 2025',
    location: 'Bengaluru, India',
    accentColor: '#6366f1',
    bullets: [
      'Promoted to Software Engineer II in March 2025 for driving AI-led platform modernisation across control, data, application, and ecosystem layers.',
      'Architected the enterprise A2A multi-agent platform with tenant-isolation and access guardrails, adopted by 3 business units.',
      'Led the LangGraph vs Semantic Kernel evaluation and ADR that made LangGraph the enterprise standard, now adopted by 3 teams.',
      'Built SmartRCA, an LLM ticket-intelligence platform: 50% faster resolution and an estimated $150K per year saved across 3 deployments.',
      'Architected ChatBotCompanion, a RAG-based GenAI assistant on a vector database: 95% accuracy and 40% faster query resolution.',
      'Cut cloud spend by $150K (15% of the earlier $1M annual spend) by re-architecting 10 AKS clusters, then applying right-sizing, autoscaling, and governance controls organisation-wide.',
      'Built the Developer Portal solo, then oversaw a team of 5; codified Claude-assisted development guidelines organisation-wide.',
      'Owned delivery of 10+ cross-functional projects; led a team of 5 across 3 projects, reviewed designs for 5 teams, consulted internal teams on design and deployment guidelines, and mentored 3 junior engineers.',
      'Leading the Monarch Classic replacement: 10 of 150 reports live, with about $50K per year in projected licensing savings on full rollout.',
    ],
  },
  {
    title: 'Software Developer',
    company: 'Capgemini India',
    period: 'Feb 2021 – Aug 2022',
    location: 'Gujarat, India',
    accentColor: '#0ea5e9',
    bullets: [
      'Built serverless ETL pipelines on Azure Functions processing about 100 GB per day of medical-device data files at 99% accuracy, earning the Rising Star award within 5 months of joining.',
      'Led delivery of 4 production data science projects with a team of 6, turning ML requirements into cloud-native Azure workflows.',
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    label: 'GenAI & AI',
    color: 'text-indigo-400',
    skills: ['RAG', 'LLMs', 'Embeddings', 'Vector Databases', 'AI Agents', 'A2A', 'LangChain', 'LangGraph', 'AutoGen', 'Semantic Kernel', 'Tool Calling', 'Prompt Engineering', 'NLP', 'AI Guardrails', 'Closed-loop AI', 'Autonomous Orchestration'],
  },
  {
    label: 'Cloud & DevOps',
    color: 'text-sky-400',
    skills: ['Azure', 'AKS', 'Azure Functions', 'Azure AD', 'Synapse', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'ArgoCD', 'GitHub Actions'],
  },
  {
    label: 'Backend & APIs',
    color: 'text-violet-400',
    skills: ['Python', 'Java', 'JavaScript', 'C#', 'FastAPI', 'Next.js', 'REST', 'Swagger', 'OAuth2', 'OIDC', 'Micro-services', 'TDD', 'Pytest'],
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
    skills: ['Git', 'Claude', 'GitHub Copilot', 'Postman', 'VS Code', 'Linux', 'Jira', 'Azure Monitor', 'Logz.io'],
  },
  {
    label: 'Engineering Practices',
    color: 'text-indigo-400',
    skills: ['System Design', 'Platform Architecture', 'Root Cause Analysis', 'Cost Optimisation', 'Agile'],
  },
];

export const certifications: Certification[] = [
  {
    name: 'AI-102 Azure AI Engineer Associate',
    issuer: 'Microsoft',
    url: 'https://learn.microsoft.com/api/credentials/share/en-us/KaranGehlod-9113/A1C427D0B417BA2A?sharingId=E9E4C26FC21918C4',
    gradFrom: '#6366f1',
    gradTo: '#818cf8',
  },
  {
    name: 'Az-900 Azure Fundamentals',
    issuer: 'Microsoft',
    url: 'https://learn.microsoft.com/api/credentials/share/en-us/KaranGehlod-9113/932EABE63C17C88E?sharingId=E9E4C26FC21918C4',
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
    name: 'Oracle Cloud Infrastructure 2024 Generative AI Certified Professional',
    issuer: 'Oracle',
    url: 'https://education.oracle.com/oracle-cloud-infrastructure-2024-generative-ai-professional/pexam_1Z0-1127-24',
    gradFrom: '#f59e0b',
    gradTo: '#fbbf24',
  },
];

export const awards: Award[] = [
  {
    title: 'TechChallenge - Semi-Finalist',
    org: 'Johnson Controls',
    period: 'June 2026 and June 2025',
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
