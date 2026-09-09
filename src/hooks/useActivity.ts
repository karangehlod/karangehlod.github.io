import { useState, useEffect } from 'react';

export interface ActivityDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ActivityWeek {
  firstDay: string;
  days: ActivityDay[];
}

export interface ActivityDataset {
  generatedAt: string;
  totalContributions: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  longestStreak: number;
  currentStreak: number;
  weeks: ActivityWeek[];
}

type Status = 'loading' | 'ready' | 'error';

export function useActivity() {
  const [dataset, setDataset] = useState<ActivityDataset | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    fetch('./activity.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<ActivityDataset>;
      })
      .then(data => { setDataset(data); setStatus('ready'); })
      .catch(err => {
        console.warn('[useActivity]', err);
        setStatus('error');
      });
  }, []);

  return { dataset, status };
}
