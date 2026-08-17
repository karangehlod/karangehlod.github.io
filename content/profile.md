---
# ─────────────────────────────────────────────────────────────────
#  PERSONAL INFO
#  Edit this file to update everything on the portfolio.
#  Running `npm run build` regenerates content.json from this file.
# ─────────────────────────────────────────────────────────────────

personal:
  name:     Karan Gehlod
  title:    Senior AI Engineer
  tagline:  "Building intelligent systems at the intersection of agentic AI, RAG pipelines, and production ML. Turning research into reliable, scalable software."
  summary_tagline: "Senior AI Engineer specialising in production autonomous systems — multi-agent orchestration, RAG pipelines, and cloud-native AI platforms. Delivered $250K+ impact at Johnson Controls."
  location: "Indore, India"
  email:    "karan.gehlod@gmail.com"
  phone:    "+919669921911"
  dob:      "May 1998"

social:
  github:   karangehlod
  linkedin: karangehlod
  twitter:  theprodsde          # Twitter / X handle (without @)
  medium:   theprodsde          # Medium handle (without @)
  reddit:   karangehlod         # Reddit username
  orcid:    "0000-0001-5909-1064"  # https://orcid.org/0000-0001-5909-1064

support:
  paypal:   karangehlod           # paypal.me/karangehlod  (use @karangehlod on PayPal)
  cal:      karangehlod           # cal.com/karangehlod  (free, open-source — sign up at cal.com)

featured_repos:
  - Agenticmemory_benchmark
  - a2a-client-service
  - chatbot-QA-RAG
  - FinancialEdApp

experience:
  - title:    "Software Engineer II (R&D)"
    company:  "Johnson Controls"
    period:   "Aug 2022 – Present"
    location: "Bengaluru, India"
    color:    "#6366f1"
    bullets:
      - "Promoted to SDE-II for driving AI-led platform modernisation; defined end-to-end architecture across control, data, application, and ecosystem layers — establishing system boundaries, API contracts, and closed-loop AI feedback for autonomous decision workflows at enterprise scale."
      - "Led architecture and performance optimisation across distributed systems, improving throughput by <strong class=\"text-slate-100\">12%</strong> and reducing development costs by <strong class=\"text-slate-100\">20%</strong> through modular design, automation, and scalable Python/Java backend services."
      - "Achieved <strong class=\"text-slate-100\">$150K annual cost savings</strong> by re-architecting AKS workloads with right-sizing, autoscaling strategies, and infrastructure governance controls."
      - "Integrated generative AI solutions into core product workflows, enhancing automation, decision intelligence, and operational efficiency across multiple product portfolios."
      - "Owned end-to-end delivery of 10+ cross-functional projects partnering with Product, DevOps, and Business teams — <strong class=\"text-slate-100\">95%+ stakeholder satisfaction</strong>."

  - title:    "Software Developer"
    company:  "Capgemini India"
    period:   "Feb 2021 – Aug 2022"
    location: "Gujarat, India"
    color:    "#0ea5e9"
    bullets:
      - "Designed and deployed serverless data automation solutions on Azure Functions, building scalable ETL pipelines that processed enterprise datasets with <strong class=\"text-slate-100\">99% accuracy</strong> — earning the <strong class=\"text-slate-100\">Rising Star award</strong> within 5 months of joining."
      - "Owned full lifecycle delivery of four production projects end-to-end with a team of six, translating data science requirements into reliable cloud-native workflows from architecture through deployment."

skills:
  - label: "GenAI & AI"
    color: "text-indigo-400"
    items: ["RAG","LLMs","Embeddings","AI Agents","LangChain","LangGraph","AutoGen","Prompt Engineering","NLP","Closed-loop AI","Autonomous Orchestration"]
  - label: "Cloud & DevOps"
    color: "text-sky-400"
    items: ["Azure","AKS","AWS","Docker","Kubernetes","Terraform","CI/CD","ArgoCD","GitHub Actions"]
  - label: "Backend & APIs"
    color: "text-violet-400"
    items: ["Python","Java","JavaScript","C#","FastAPI","REST","OAuth2","OIDC","Micro-services","TDD"]
  - label: "Data & Pipelines"
    color: "text-emerald-400"
    items: ["ETL","Data Lakes","Snowflake","Kafka","Apache Iceberg","Redpanda"]
  - label: "Databases"
    color: "text-amber-400"
    items: ["PostgreSQL","ClickHouse","TimescaleDB","MSSQL","MongoDB","Query Tuning"]
  - label: "Tools & Platforms"
    color: "text-rose-400"
    items: ["Git","GitHub Copilot","Postman","VS Code","Linux","Jira","Azure Monitor","Logz.io"]

portfolio:
  - id:        developer-portal
    title:     "Developer Portal"
    company:   "Johnson Controls"
    period:    "Jan 2026 – Present"
    shortDesc: "Sole architect for a production Developer Portal — UI, backend, CI/CD, and all-environment deployment using AI-assisted coding throughout."
    bullets:
      - "Sole architect — owned UI, backend, CI/CD, and all-environment deployment with one developer using AI-assisted coding throughout."
      - "Codified Claude-assisted development patterns into org-wide engineering guidelines, driving enterprise AI adoption based on measured delivery outcomes."
      - "Defined full-stack system boundaries: RESTful APIs, authentication layer, frontend, and deployment pipeline from architecture to production."
    tags: ["Full-Stack","CI/CD","RESTful APIs","AI-assisted Dev","Authentication"]
    accentFrom: "#6366f1"
    accentTo:   "#38bdf8"
    icon:       portal

  - id:        a2a-orchestration
    title:     "Enterprise A2A Agentic Orchestration"
    company:   "Johnson Controls"
    period:    "Dec 2025 – Jan 2026"
    shortDesc: "Standardised A2A protocol architecture across business units, enabling pluggable cross-domain autonomous multi-agent workflows at enterprise scale."
    bullets:
      - "Standardised A2A protocol architecture across business units — defining system boundaries, interface contracts, and authentication frameworks for production-grade autonomous multi-agent workflows."
      - "Designed a centralised orchestration layer decoupling agentic execution from business units, enabling pluggable cross-domain coordination and scalable multi-site dispatching."
      - "Established safe AI deployment principles — validating subscription models, token auth, and multi-tenant isolation — influencing org-wide platform direction through benchmarked architectural validation."
    tags: ["A2A Protocol","LangGraph","Multi-Agent","Auth Frameworks","Kubernetes"]
    accentFrom: "#7c3aed"
    accentTo:   "#a78bfa"
    icon:       agents

  - id:        fmsystem
    title:     "FMSystem Modernisation & Mobile Enablement"
    company:   "Johnson Controls"
    period:    "May 2025 – Nov 2025"
    shortDesc: "Integrated OIDC (Auth Code Flow + PKCE) into a legacy application establishing a zero-trust boundary between mobile clients, identity provider, and API layer."
    bullets:
      - "Integrated OIDC (Authorization Code Flow + PKCE) into a legacy application — establishing a zero-trust boundary between mobile clients, identity provider, and API layer."
      - "Designed policy-based authorization using Azure AD group claims with centralised token validation and clean separation of auth and resource access layers."
      - "Accelerated delivery with GitHub Copilot; built Swagger-integrated OAuth2 testing workflows improving integration coverage."
    tags: ["OIDC","PKCE","Azure AD","OAuth2","Zero-trust","Mobile"]
    accentFrom: "#0ea5e9"
    accentTo:   "#38bdf8"
    icon:       mobile

  - id:        ai-framework-eval
    title:     "AI Framework Evaluation: LangGraph vs Semantic Kernel"
    company:   "Johnson Controls"
    period:    "May 2025 – Sep 2025"
    shortDesc: "Led end-to-end technical evaluation of LangGraph+LangChain vs. Semantic Kernel for production-grade agentic workflows. LangGraph scored 37/40 vs 27/40."
    bullets:
      - "Led end-to-end technical evaluation — designing a containerised benchmark suite on a real-world smart building dataset (BDG2) with 9 performance runs per framework under identical resource constraints."
      - "Demonstrated measurable superiority of LangGraph: 2.5% lower avg latency (12.51s vs 12.83s), 23% lower memory footprint (103 MiB vs 127 MiB), and 29% lower CPU utilisation."
      - "Produced a scored evaluation matrix (37/40 vs 27/40) across 8 dimensions — recommending LangGraph+LangChain as the org-wide standard and influencing platform direction."
      - "Integrated framework validation into the SSDLC pipeline via automated security scanning (ArmorCode) for continuous dependency monitoring."
    tags: ["LangGraph","LangChain","Benchmarking","Docker","Kubernetes","Agentic AI"]
    accentFrom: "#10b981"
    accentTo:   "#34d399"
    icon:       benchmark

  - id:        rca-platform
    title:     "Root Cause Analysis Platform"
    company:   "Johnson Controls"
    period:    "Dec 2024 – Apr 2025"
    shortDesc: "AI-native ticket intelligence platform with closed-loop feedback. Reduced resolution time by 25% and delivered $100K annual savings."
    bullets:
      - "Built an AI-native ticket intelligence platform with closed-loop feedback: data ingestion → LLM classification → resolution recommendation → outcome tracking → model refinement."
      - "Reduced ticket resolution time by 25% and delivered $100K annual savings through automated triaging, smart routing, and real-time SLA analytics dashboards."
      - "Established feedback loops between resolution outcomes and system behaviour, enabling autonomous performance improvement over time."
    tags: ["LLM Classification","RAG","Closed-loop AI","SLA Analytics","Python"]
    accentFrom: "#f59e0b"
    accentTo:   "#fbbf24"
    icon:       rca

  - id:        chatbot-companion
    title:     "ChatBotCompanion"
    company:   "Johnson Controls"
    period:    "Nov 2024 – May 2025"
    shortDesc: "AI-native indoor navigation platform — LLMs, vector databases, and SQL in a unified control architecture. 90% accuracy across 100K+ unstructured inputs."
    bullets:
      - "Architected an AI-native indoor navigation platform — LLMs, vector databases, and SQL in a unified control architecture — achieving 90% accuracy across 100K+ unstructured inputs."
      - "Defined end-to-end system boundaries: ingestion pipeline, embedding/retrieval API, and conversational interface, cutting query resolution time by 40%."
      - "Improved user satisfaction scores by 25% through context-aware, real-time location query handling across large-scale building environments."
    tags: ["LLMs","Vector DB","RAG","NLP","SQL","Embeddings"]
    accentFrom: "#f43f5e"
    accentTo:   "#fb7185"
    icon:       chatbot

certifications:
  - name:     "AI-102 Azure AI Engineer Associate"
    issuer:   "Microsoft"
    url:      "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/"
    gradFrom: "#6366f1"
    gradTo:   "#818cf8"
  - name:     "Az-900 Azure Fundamentals"
    issuer:   "Microsoft"
    url:      "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/"
    gradFrom: "#0ea5e9"
    gradTo:   "#38bdf8"
  - name:     "AI Agentic Design Patterns with AutoGen"
    issuer:   "DeepLearning.AI"
    url:      "https://learn.deeplearning.ai/courses/ai-agentic-design-patterns-with-autogen"
    gradFrom: "#7c3aed"
    gradTo:   "#a78bfa"
  - name:     "Databricks Lakehouse Fundamentals"
    issuer:   "Databricks"
    url:      "https://www.databricks.com/learn/certification/data-lakehouse-fundamentals"
    gradFrom: "#10b981"
    gradTo:   "#34d399"
  - name:     "Oracle Cloud Infrastructure 2024 Generative AI"
    issuer:   "Oracle"
    url:      "https://education.oracle.com/oracle-cloud-infrastructure-2024-generative-ai-professional/pexam_1Z0-1127-24"
    gradFrom: "#f59e0b"
    gradTo:   "#fbbf24"

awards:
  - title:    "TechChallenge — Semi-Finalist"
    org:      "Johnson Controls"
    period:   "June 2025"
    desc:     "Recognition for understanding problem statement and driving business value with AI enablement in solution."
    gradFrom: "#f59e0b"
    gradTo:   "#f97316"
  - title:    "Rising Star"
    org:      "Capgemini India"
    period:   "June 2021"
    desc:     "Recognition for outstanding performance on a client project within 5 months of joining."
    gradFrom: "#0ea5e9"
    gradTo:   "#3b82f6"

education:
  degree:   "Bachelor of Engineering"
  school:   "Shri G S Institute of Technology and Science"
  period:   "July 2016 – May 2020"
  location: "Indore, India"
---

## Summary

Senior AI Software Engineer specialising in production autonomous systems — multi-agent orchestration (**A2A, LangGraph**), real-time control architectures, and cloud-native platforms (**AKS, Kubernetes**). Specialises in end-to-end platform design: system boundaries, API contracts, and closed-loop feedback (data → model → decision → control). Delivered **$250K+ impact** at Johnson Controls; drove org-wide AI adoption from prototype to production.
