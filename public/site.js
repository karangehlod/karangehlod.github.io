const fallbackMessage = 'No public repositories were available in the generated project dataset.';

function createProjectCard(project) {
  const article = document.createElement('article');
  article.className = 'project-card';

  const title = document.createElement('h3');
  const link = document.createElement('a');
  link.href = project.url;
  link.textContent = project.name;
  link.rel = 'noopener noreferrer';
  title.append(link);

  const description = document.createElement('p');
  description.textContent = project.description || 'Public GitHub repository.';

  const meta = document.createElement('div');
  meta.className = 'meta';
  for (const value of [project.language, `${project.stars} stars`, project.archived ? 'Archived' : undefined].filter(Boolean)) {
    const item = document.createElement('span');
    item.textContent = value;
    meta.append(item);
  }

  article.append(title, description, meta);
  return article;
}

function renderProjects(container, projects) {
  container.replaceChildren();

  if (!projects.length) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = fallbackMessage;
    container.append(empty);
    return;
  }

  container.append(...projects.map(createProjectCard));
}

async function loadProjects() {
  const response = await fetch('./projects.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Unable to load generated project data: ${response.status}`);
  }
  return response.json();
}

try {
  const dataset = await loadProjects();
  renderProjects(document.querySelector('#featured-projects'), dataset.featuredProjects ?? []);
  renderProjects(document.querySelector('#all-projects'), dataset.projects ?? []);
} catch (error) {
  console.error(error);
  renderProjects(document.querySelector('#featured-projects'), []);
  renderProjects(document.querySelector('#all-projects'), []);
}
