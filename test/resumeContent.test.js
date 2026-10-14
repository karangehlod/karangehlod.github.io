import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import matter from 'gray-matter';
import ts from 'typescript';

const profile = matter(readFileSync(new URL('../content/profile.md', import.meta.url), 'utf8'));

async function loadData(file) {
  const source = readFileSync(new URL(file, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}

const resume = await loadData('../src/data/resumeData.ts');
const portfolio = await loadData('../src/data/portfolioProjects.ts');

test('public profile omits private contact and birth fields', () => {
  assert(!('phone' in profile.data.personal));
  assert(!('dob' in profile.data.personal));
  assert.equal(profile.data.personal.location, 'Bengaluru, India');
});

test('experience content remains aligned across existing data sources', () => {
  assert.deepEqual(profile.data.experience.map(({ color, ...job }) => ({ ...job, accentColor: color })), resume.experience);
  assert.equal(resume.experience[0].rolePeriod, 'Mar 2025 – Present');
  assert.equal(resume.experience[0].previousRole, 'Software Engineer · Aug 2022 – Mar 2025');
});

test('professional project cards remain aligned with generated profile content', () => {
  assert.deepEqual(profile.data.portfolio, portfolio.portfolioProjects);
  assert.equal(portfolio.portfolioProjects.length, 7);
  assert(portfolio.portfolioProjects.find((project) => project.id === 'monarch-replacement'));
});

test('skills, certifications and awards remain aligned', () => {
  assert.deepEqual(profile.data.skills.map(({ items, ...group }) => ({ ...group, skills: items })), resume.skillGroups);
  assert.deepEqual(profile.data.certifications, resume.certifications);
  assert.deepEqual(profile.data.awards, resume.awards);
});

test('updated metrics distinguish realised, estimated and projected outcomes', () => {
  const content = JSON.stringify({ profile: profile.data, projects: portfolio.portfolioProjects });
  assert(content.includes('$150K'));
  assert(content.includes('estimated $150K per year'));
  assert(content.includes('$50K per year in projected'));
  for (const outdated of ['$250K+', '$100K annual savings', '90% accuracy', '23% lower memory']) {
    assert(!content.includes(outdated), `Outdated resume claim: ${outdated}`);
  }
});
