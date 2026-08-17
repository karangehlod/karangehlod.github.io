# Karan Gehlod — Portfolio

Personal portfolio built with **Vite + React + TypeScript + Tailwind CSS**, deployed to GitHub Pages.

## Quick start (local dev)

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server  (builds live data first, then Vite HMR)
npm run dev
```

Open **http://localhost:5173**

> `npm run dev` automatically runs `build:data` (GitHub API) and `build:content` (profile.md) before starting Vite.
> The GitHub API is rate-limited to 60 req/hour without a token. To raise this:
> ```bash
> GITHUB_TOKEN=ghp_yourtoken npm run dev
> ```

---

## Updating your profile

All content lives in **one file**:

```
content/profile.md
```

Edit it — bio, experience, skills, certifications, portfolio projects, social links — then rebuild:

```bash
npm run build:content   # regenerates public/content.json
npm run dev             # or just refresh; Vite picks up the new JSON
```

To update your ORCID publications, re-run:

```bash
npm run build:content   # fetches live from ORCID API
```

---

## Run with Docker (local preview of production build)

### Prerequisites
- Docker + Docker Compose

### Build and run

```bash
# Build and start (serves on http://localhost:3000)
docker compose up --build

# With your GitHub token (higher API rate limit during build)
GITHUB_TOKEN=ghp_yourtoken docker compose up --build

# Stop
docker compose down
```

Or build manually:

```bash
docker build --build-arg GITHUB_TOKEN=ghp_yourtoken -t karan-portfolio .
docker run -p 3000:80 karan-portfolio
```

Open **http://localhost:3000**

---

## Project structure

```
.
├── content/
│   └── profile.md          ← edit this to update the entire site
├── scripts/
│   ├── build-project-data.js   ← fetches GitHub repos → public/projects.json
│   └── build-content.js        ← parses profile.md + ORCID → public/content.json
├── src/
│   ├── components/             ← Nav, Footer, ProjectCard, ProjectModal, …
│   ├── contexts/               ← ThemeContext (dark/light)
│   ├── hooks/                  ← useProjects, useContent, usePublications
│   ├── pages/                  ← Home, About, Projects, Publications
│   └── index.css               ← Tailwind source + CSS variables
├── public/
│   └── profile_image.png       ← your photo
│   (projects.json, content.json, publications.json are gitignored build artifacts)
├── index.html                  ← Vite entry point
├── tailwind.config.js
├── vite.config.ts
└── .github/workflows/pages.yml ← CI/CD pipeline
```

---

## Deploy to GitHub Pages

### One-time setup

Go to **Settings → Pages** in your GitHub repository and set:
```
Source → GitHub Actions
```

### Every deployment

```bash
git add -A
git commit -m "your message"
git push origin main
```

GitHub Actions will automatically:
1. `npm ci` — install dependencies
2. `npm test` — run tests
3. `npm run build:data` — fetch live GitHub repos
4. `npm run build:content` — parse profile.md + fetch ORCID publications
5. `tsc -b && vite build` — TypeScript check + production build
6. Deploy `dist/` to GitHub Pages

---

## Features

| Feature | Details |
|---|---|
| Dark / Light theme | System default, toggleable (☀/🌙), persisted to localStorage |
| Search | ⌘K across repos, portfolio projects, and pages |
| Project modals | README fetched live from GitHub raw content |
| GitHub repos | Discovered live from GitHub API at each build |
| ORCID publications | Fetched at build time from ORCID public API |
| Portfolio projects | 6 Johnson Controls projects with full bullet-point modals |
| Social links | GitHub, LinkedIn, Twitter/X, Medium, Reddit, ORCID |
| Schedule a Call | Cal.com (free) — sign up at cal.com with your GitHub account |
| Buy Me Coffee | PayPal.me link |

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Build data + content, then start Vite HMR dev server |
| `npm run build` | Full production build (data + content + TypeScript + Vite) |
| `npm run build:data` | Fetch GitHub repos → `public/projects.json` |
| `npm run build:content` | Parse `content/profile.md` + fetch ORCID → `public/content.json` + `public/publications.json` |
| `npm run preview` | Serve the production `dist/` build locally |
| `npm test` | Run the data-pipeline unit tests |
