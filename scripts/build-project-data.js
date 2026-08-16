import { mkdir, writeFile } from 'node:fs/promises';
import { projectConfig } from '../src/data/projectConfig.js';
import { buildProjectDataset, fetchPublicRepositories, logDiscoverySummary } from '../src/data/githubProjects.js';

const outputPath = new URL('../public/projects.json', import.meta.url);

const repositories = await fetchPublicRepositories(projectConfig.owner);
const dataset = buildProjectDataset(repositories, projectConfig);
logDiscoverySummary(dataset);

await mkdir(new URL('../public/', import.meta.url), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(dataset, null, 2)}\n`);
