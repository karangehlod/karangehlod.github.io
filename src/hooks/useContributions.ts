import { useState, useEffect } from 'react';

export interface Contribution {
  id: number;
  number: number;
  title: string;
  url: string;
  repo: string;
  repoUrl: string;
  mergedAt: string;
  labels: string[];
  stars: number;
  language: string;
  additions: number;
  deletions: number;
  changedFiles: number;
  commits: number;
  body: string;
}

export interface ContributionDataset {
  generatedAt: string;
  contributions: Contribution[];
  total: number;
}

type Status = 'loading' | 'ready' | 'error';

export function useContributions() {
  const [dataset, setDataset] = useState<ContributionDataset | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    fetch('./contributions.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<ContributionDataset>;
      })
      .then(data => { setDataset(data); setStatus('ready'); })
      .catch(err => {
        console.warn('[useContributions]', err);
        setStatus('error');
      });
  }, []);

  return { dataset, status };
}
