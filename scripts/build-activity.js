import { mkdir, writeFile } from 'node:fs/promises';

const OWNER = 'karangehlod';
const GITHUB_GRAPHQL = 'https://api.github.com/graphql';
const token = process.env.GH_PAT || process.env.GITHUB_TOKEN;
const outputPath = new URL('../public/activity.json', import.meta.url);

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'User-Agent': `${OWNER}-portfolio`,
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

const QUERY = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          firstDay
          contributionDays {
            date
            contributionCount
            color
          }
        }
      }
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
      restrictedContributionsCount
    }
  }
}
`;

function toLevel(count) {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

function computeStreaks(weeks) {
  const today = new Date().toISOString().split('T')[0];
  const days = weeks
    .flatMap(w => w.contributionDays)
    .filter(d => d.date <= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  let longestStreak = 0;
  let currentStreak = 0;
  let run = 0;

  for (const day of days) {
    if (day.contributionCount > 0) {
      run++;
      if (run > longestStreak) longestStreak = run;
    } else {
      run = 0;
    }
  }

  // Current streak: walk backwards from today
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  return { longestStreak, currentStreak };
}

const fallback = {
  generatedAt: new Date().toISOString(),
  totalContributions: 0,
  totalCommits: 0,
  totalPRs: 0,
  totalIssues: 0,
  longestStreak: 0,
  currentStreak: 0,
  weeks: [],
};

try {
  if (!token) throw new Error('No token available (set GH_PAT or GITHUB_TOKEN)');

  const res = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: QUERY, variables: { login: OWNER } }),
  });

  if (!res.ok) throw new Error(`GraphQL request failed: ${res.status} ${res.statusText}`);

  const { data, errors } = await res.json();
  if (errors?.length) throw new Error(`GraphQL errors: ${errors.map(e => e.message).join(', ')}`);

  const coll = data.user.contributionsCollection;
  const cal = coll.contributionCalendar;
  const { longestStreak, currentStreak } = computeStreaks(cal.weeks);

  const dataset = {
    generatedAt: new Date().toISOString(),
    totalContributions: cal.totalContributions,
    totalCommits: coll.totalCommitContributions,
    totalPRs: coll.totalPullRequestContributions,
    totalIssues: coll.totalIssueContributions,
    longestStreak,
    currentStreak,
    weeks: cal.weeks.map(week => ({
      firstDay: week.firstDay,
      days: week.contributionDays.map(d => ({
        date: d.date,
        count: d.contributionCount,
        level: toLevel(d.contributionCount),
      })),
    })),
  };

  await mkdir(new URL('../public/', import.meta.url), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(dataset, null, 2)}\n`);
  console.log(
    `Saved activity: ${dataset.totalContributions} contributions, ` +
    `current streak ${currentStreak}d, longest ${longestStreak}d.`
  );
} catch (err) {
  console.warn('[build-activity] Failed:', err.message);
  console.warn('Writing empty fallback activity.json');
  await mkdir(new URL('../public/', import.meta.url), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(fallback, null, 2)}\n`);
}
