import { useState, useEffect } from 'react';
import type { ProjectDataset } from '../types';

type Status = 'loading' | 'ready' | 'error';

export function useProjects() {
  const [dataset, setDataset] = useState<ProjectDataset | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    fetch('./projects.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<ProjectDataset>;
      })
      .then(data => {
        setDataset(data);
        setStatus('ready');
      })
      .catch(err => {
        console.error('[useProjects]', err);
        setStatus('error');
      });
  }, []);

  return { dataset, status };
}
