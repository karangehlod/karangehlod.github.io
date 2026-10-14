---
# Public profile only. Keep private contact and birth information out of this file.

personal:
  name: Karan Gehlod
  title: Senior AI Engineer
  tagline: "Building intelligent systems at the intersection of agentic AI, RAG pipelines, and production ML. Turning research into reliable, scalable software."
  summary_tagline: "Senior AI Engineer specialising in production autonomous systems - multi-agent orchestration, RAG pipelines, and cloud-native AI platforms. Delivered $150K in realised AKS savings at Johnson Controls; automation impact is estimated separately."
  location: "Bengaluru, India"
  email: "karan.gehlod@gmail.com"

social:
  github: karangehlod
  linkedin: karangehlod
  twitter: theprodsde
  medium: theprodsde
  reddit: karangehlod
  orcid: "0000-0001-5909-1064"

support:
  paypal: karangehlod
  buy_me_a_coffee: theprodsde
  cal: karangehlod

featured_repos:
  - Agenticmemory_benchmark
  - a2a-client-service
  - chatbot-QA-RAG
  - FinancialEdApp

experience:
  - title: "Software Engineer II (R&D), AI and Agentic Platforms"
    company: "Johnson Controls"
    period: "Aug 2022 – Present"
    rolePeriod: "Mar 2025 – Present"
    previousRole: "Software Engineer · Aug 2022 – Mar 2025"
    location: "Bengaluru, India"
    color: "#6366f1"
    bullets:
      - "Promoted to Software Engineer II in March 2025 for driving AI-led platform modernisation across control, data, application, and ecosystem layers."
      - "Architected the enterprise A2A multi-agent platform with tenant-isolation and access guardrails, adopted by 3 business units."
      - "Led the LangGraph vs Semantic Kernel evaluation and ADR that made LangGraph the enterprise standard, now adopted by 3 teams."
      - "Built SmartRCA, an LLM ticket-intelligence platform: 50% faster resolution and an estimated $150K per year saved across 3 deployments."
      - "Architected ChatBotCompanion, a RAG-based GenAI assistant on a vector database: 95% accuracy and 40% faster query resolution."
      - "Cut cloud spend by $150K (15% of the earlier $1M annual spend) by re-architecting 10 AKS clusters, then applying right-sizing, autoscaling, and governance controls organisation-wide."
      - "Built the Developer Portal solo, then oversaw a team of 5; codified Claude-assisted development guidelines organisation-wide."
      - "Owned delivery of 10+ cross-functional projects; led a team of 5 across 3 projects, reviewed designs for 5 teams, consulted internal teams on design and deployment guidelines, and mentored 3 junior engineers."
      - "Leading the Monarch Classic replacement: 10 of 150 reports live, with about $50K per year in projected licensing savings on full rollout."

  - title: "Software Developer"
    company: "Capgemini India"
    period: "Feb 2021 – Aug 2022"
    location: "Gujarat, India"
    color: "#0ea5e9"
    bullets:
      - "Built serverless ETL pipelines on Azure Functions processing about 100 GB per day of medical-device data files at 99% accuracy, earning the Rising Star award within 5 months of joining."
      - "Led delivery of 4 production data science projects with a team of 6, turning ML requirements into cloud-native Azure workflows."

skills:
  - label: "GenAI & AI"
    color: "text-indigo-400"
    items: ["RAG","LLMs","Embeddings","Vector Databases","AI Agents","A2A","LangChain","LangGraph","AutoGen","Semantic Kernel","Tool Calling","Prompt Engineering","NLP","AI Guardrails","Closed-loop AI","Autonomous Orchestration"]
  - label: "Cloud & DevOps"
    color: "text-sky-400"
    items: ["Azure","AKS","Azure Functions","Azure AD","Synapse","AWS","Docker","Kubernetes","Terraform","CI/CD","ArgoCD","GitHub Actions"]
  - label: "Backend & APIs"
    color: "text-violet-400"
    items: ["Python","Java","JavaScript","C#","FastAPI","Next.js","REST","Swagger","OAuth2","OIDC","Micro-services","TDD","Pytest"]
  - label: "Data & Pipelines"
    color: "text-emerald-400"
    items: ["ETL","Data Lakes","Snowflake","Kafka","Apache Iceberg","Redpanda"]
  - label: "Databases"
    color: "text-amber-400"
    items: ["PostgreSQL","ClickHouse","TimescaleDB","MSSQL","MongoDB","Query Tuning"]
  - label: "Tools & Platforms"
    color: "text-rose-400"
    items: ["Git","Claude","GitHub Copilot","Postman","VS Code","Linux","Jira","Azure Monitor","Logz.io"]
  - label: "Engineering Practices"
    color: "text-indigo-400"
    items: ["System Design","Platform Architecture","Root Cause Analysis","Cost Optimisation","Agile"]

portfolio:
  - id: monarch-replacement
    title: "Monarch Classic Replacement Engine"
    company: "Johnson Controls"
    period: "Sep 2026 – Present"
    shortDesc: "Deterministic report-conversion engine replacing legacy Monarch workflows - 10 of 150 reports live, with phased parity validation."
    bullets:
      - "Reverse-engineered extraction and transformation logic from 150 legacy report formats into static, declarative rule definitions, using AI assistance to speed up rule discovery."
      - "The rules run deterministically with no AI, making yearly conversion repeatable."
      - "Built the engine and platform with Python/FastAPI, PostgreSQL, and a Next.js frontend; migrating in phases and validating each report against legacy output for full parity before release."
      - "10 of 150 reports are live. About $50K per year in licensing savings is projected on full rollout, not yet realised."
    tags: ["Python","FastAPI","PostgreSQL","Next.js","Deterministic Rules"]
    accentFrom: "#6366f1"
    accentTo: "#38bdf8"
    icon: portal

  - id: developer-portal
    title: "Developer Portal"
    company: "Johnson Controls"
    period: "Jan 2026 – Present"
    shortDesc: "Shipped the first Developer Portal release solo using AI-assisted engineering, then oversaw a team of 5 extending the platform."
    bullets:
      - "Owned the architecture end to end: RESTful APIs, authentication layer, frontend, and CI/CD across all environments; shipped the first release solo using AI-assisted engineering."
      - "Recorded delivery outcomes from the Claude-assisted workflow and turned the patterns into organisation-wide engineering guidelines."
      - "A team of 5 now extends and maintains the portal."
    tags: ["Full-Stack","CI/CD","RESTful APIs","AI-assisted Dev","Authentication"]
    accentFrom: "#6366f1"
    accentTo: "#38bdf8"
    icon: portal

  - id: a2a-orchestration
    title: "Enterprise A2A Agentic Orchestration"
    company: "Johnson Controls"
    period: "Dec 2025 – Jan 2026"
    shortDesc: "Enterprise multi-agent platform with tenant-isolation and access guardrails, adopted by 3 business units."
    bullets:
      - "Defined the contract between business-unit agents and a central orchestration layer: system boundaries, interface definitions, and authentication."
      - "Enabled agents to plug in across domains and sites for multi-site dispatching without coupling to each business unit."
      - "Validated subscription models, token authentication, and multi-tenant isolation through benchmarked tests; used the results to set safe AI deployment principles."
    tags: ["A2A Protocol","LangGraph","Multi-Agent","Auth Frameworks","Kubernetes"]
    accentFrom: "#7c3aed"
    accentTo: "#a78bfa"
    icon: agents

  - id: fmsystem
    title: "FMSystem Modernisation & Mobile Enablement"
    company: "Johnson Controls"
    period: "May 2025 – Nov 2025"
    shortDesc: "Added OIDC with PKCE and policy-based authorisation to a legacy application, separating authentication from resource access."
    bullets:
      - "Added OIDC (Authorization Code Flow with PKCE) to a legacy application."
      - "Enforced policy-based authorisation from Azure AD group claims with centralised token validation, keeping authentication and resource access in separate layers."
      - "Built Swagger-integrated OAuth2 testing workflows."
    tags: ["OIDC","PKCE","Azure AD","OAuth2","Zero-trust","Mobile"]
    accentFrom: "#0ea5e9"
    accentTo: "#38bdf8"
    icon: mobile

  - id: ai-framework-eval
    title: "AI Framework Evaluation: LangGraph vs Semantic Kernel"
    company: "Johnson Controls"
    period: "May 2025 – Sep 2025"
    shortDesc: "Led end-to-end technical evaluation of LangGraph+LangChain vs. Semantic Kernel for production-grade agentic workflows. LangGraph scored 37/40 vs 27/40."
    bullets:
      - "Led end-to-end technical evaluation of LangGraph+LangChain vs. Semantic Kernel - designing a containerised benchmark suite on a real-world smart building dataset (BDG2) with 9 performance runs per framework under identical resource constraints (1 CPU, 1 GB RAM)."
      - "Found comparable latency (12.51s vs 12.83s), about 19% lower memory, and 29% lower CPU across multi-agent orchestration, tool calling, parallel execution, and state management."
      - "Scored 37/40 vs 27/40 across 8 dimensions; recommended LangGraph through an ADR that set the enterprise standard, now adopted by 3 teams."
      - "Integrated framework validation into the SSDLC pipeline via automated security scanning (ArmorCode) for continuous dependency monitoring in production."
    tags: ["LangGraph","LangChain","Benchmarking","Docker","Kubernetes","Agentic AI"]
    accentFrom: "#10b981"
    accentTo: "#34d399"
    icon: benchmark

  - id: rca-platform
    title: "Root Cause Analysis (SmartRCA)"
    company: "Johnson Controls"
    period: "Dec 2024 – Present"
    shortDesc: "LLM ticket-intelligence platform with closed-loop feedback: 50% faster resolution and an estimated $150K per year across 3 deployments."
    bullets:
      - "Built an AI-native ticket intelligence platform with closed-loop feedback: data ingestion → LLM classification → resolution recommendation → outcome tracking → model refinement."
      - "Added smart routing and real-time SLA dashboards, with 50% faster ticket resolution."
      - "Savings are estimated from developer effort and SLA performance at $50K per year per deployment, or $150K per year across 3 deployments."
      - "The platform expanded to Sensormatic and Hitachi in 2026."
    tags: ["LLM Classification","RAG","Closed-loop AI","SLA Analytics","Python"]
    accentFrom: "#f59e0b"
    accentTo: "#fbbf24"
    icon: rca

  - id: chatbot-companion
    title: "ChatBotCompanion"
    company: "Johnson Controls"
    period: "Nov 2024 – May 2025"
    shortDesc: "RAG-based GenAI assistant for indoor navigation, combining LLM reasoning, vector search, and SQL: 95% accuracy and 40% faster query resolution."
    bullets:
      - "Unified LLM reasoning, vector search, and SQL behind one control layer for indoor-navigation queries across large buildings, achieving 95% accuracy."
      - "Defined end-to-end system boundaries: ingestion pipeline, embedding/retrieval API, and conversational interface, cutting query resolution time by 40%."
      - "Improved user satisfaction scores by 25% through context-aware, real-time location query handling across large-scale building environments."
    tags: ["LLMs","Vector DB","RAG","NLP","SQL","Embeddings"]
    accentFrom: "#f43f5e"
    accentTo: "#fb7185"
    icon: chatbot

certifications:
  - name: "AI-102 Azure AI Engineer Associate"
    issuer: "Microsoft"
    url: "https://learn.microsoft.com/api/credentials/share/en-us/KaranGehlod-9113/A1C427D0B417BA2A?sharingId=E9E4C26FC21918C4"
    gradFrom: "#6366f1"
    gradTo: "#818cf8"
  - name: "Az-900 Azure Fundamentals"
    issuer: "Microsoft"
    url: "https://learn.microsoft.com/api/credentials/share/en-us/KaranGehlod-9113/932EABE63C17C88E?sharingId=E9E4C26FC21918C4"
    gradFrom: "#0ea5e9"
    gradTo: "#38bdf8"
  - name: "AI Agentic Design Patterns with AutoGen"
    issuer: "DeepLearning.AI"
    url: "https://learn.deeplearning.ai/courses/ai-agentic-design-patterns-with-autogen"
    gradFrom: "#7c3aed"
    gradTo: "#a78bfa"
  - name: "Databricks Lakehouse Fundamentals"
    issuer: "Databricks"
    url: "https://www.databricks.com/learn/certification/data-lakehouse-fundamentals"
    gradFrom: "#10b981"
    gradTo: "#34d399"
  - name: "Oracle Cloud Infrastructure 2024 Generative AI Certified Professional"
    issuer: "Oracle"
    url: "https://education.oracle.com/oracle-cloud-infrastructure-2024-generative-ai-professional/pexam_1Z0-1127-24"
    gradFrom: "#f59e0b"
    gradTo: "#fbbf24"

awards:
  - title: "TechChallenge - Semi-Finalist"
    org: "Johnson Controls"
    period: "June 2026 and June 2025"
    desc: "Recognition for understanding problem statement and driving business value with AI enablement in solution."
    gradFrom: "#f59e0b"
    gradTo: "#f97316"
  - title: "Rising Star"
    org: "Capgemini India"
    period: "June 2021"
    desc: "Recognition for outstanding performance on a client project within 5 months of joining."
    gradFrom: "#0ea5e9"
    gradTo: "#3b82f6"

education:
  degree: "Bachelor of Engineering"
  school: "Shri G S Institute of Technology and Science"
  period: "July 2016 – May 2020"
  location: "Indore, India"
---

## Summary

Senior AI Engineer with 5+ years of experience designing and shipping production Agentic AI and GenAI systems on Azure and Kubernetes. Architected the enterprise multi-agent (**A2A**) orchestration platform with tenant-isolation and access guardrails, led the **LangGraph vs Semantic Kernel** evaluation and ADR that set the organisation standard, and built a RAG-based GenAI assistant and an LLM ticket-intelligence platform (**SmartRCA**).

Delivered **$150K in realised AKS cost savings** and an **estimated $150K per year in automation impact**, with about **$50K per year projected** from the Monarch replacement on full rollout. Led a team of 5, reviewed designs for 5 teams, and mentored 3 engineers.
