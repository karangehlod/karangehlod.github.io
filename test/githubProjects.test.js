import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildProjectDataset, filterVisibleRepositories } from '../src/data/githubProjects.js';

const owner = 'karangehlod';
const config = {
  owner,
  featuredRepos: ['featured-public', 'featured-private', 'featured-deleted'],
  excludedRepos: [],
  includeForks: false,
  includeArchived: true,
};

function repo(name, overrides = {}) {
  return {
    id: name,
    name,
    full_name: `${owner}/${name}`,
    owner: { login: owner },
    visibility: 'public',
    html_url: `https://github.com/${owner}/${name}`,
    fork: false,
    archived: false,
    ...overrides,
  };
}

test('public repositories appear while private and deleted repositories do not', () => {
  const visible = filterVisibleRepositories([
    repo('public-project'),
    repo('private-project', { visibility: 'private' }),
    repo('deleted-project', { visibility: undefined }),
  ], config);

  assert.deepEqual(visible.map(({ name }) => name), ['public-project']);
});

test('featured private and deleted repositories do not create projects', () => {
  const dataset = buildProjectDataset([
    repo('featured-public'),
    repo('featured-private', { visibility: 'private' }),
  ], config);

  assert.deepEqual(dataset.featuredProjects.map(({ name }) => name), ['featured-public']);
  assert.equal(dataset.projects.some(({ name }) => name === 'featured-private'), false);
  assert.equal(dataset.projects.some(({ name }) => name === 'featured-deleted'), false);
});

test('new public repositories appear automatically when returned by GitHub', () => {
  const dataset = buildProjectDataset([repo('new-public-repository')], config);
  assert.deepEqual(dataset.projects.map(({ name }) => name), ['new-public-repository']);
});

test('public to private transition removes repository on rebuild', () => {
  assert.deepEqual(buildProjectDataset([repo('transition')], config).projects.map(({ name }) => name), ['transition']);
  assert.deepEqual(buildProjectDataset([repo('transition', { visibility: 'private' })], config).projects, []);
});

test('public to deleted transition removes repository on rebuild', () => {
  assert.deepEqual(buildProjectDataset([repo('transition')], config).projects.map(({ name }) => name), ['transition']);
  assert.deepEqual(buildProjectDataset([], config).projects, []);
});

test('forks are excluded by default unless explicitly configured otherwise', () => {
  assert.deepEqual(filterVisibleRepositories([repo('forked', { fork: true })], config), []);
  assert.deepEqual(filterVisibleRepositories([repo('forked', { fork: true })], { ...config, includeForks: true }).map(({ name }) => name), ['forked']);
});

test('only repositories owned by karangehlod are eligible', () => {
  const dataset = buildProjectDataset([repo('mine'), repo('theirs', { owner: { login: 'someone-else' } })], config);
  assert.deepEqual(dataset.projects.map(({ name }) => name), ['mine']);
});
