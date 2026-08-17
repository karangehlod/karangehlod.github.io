import { useState, useEffect } from 'react';

export interface Publication {
  title: string;
  year: string | null;
  journal: string;
  type: string;
  doi: string | null;
  url: string;
  orcidWorkId: number | null;
}

interface PublicationData {
  works: Publication[];
  fetchedAt: string;
  error?: string;
}

export function usePublications() {
  const [data, setData]     = useState<PublicationData | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'none'>('loading');

  useEffect(() => {
    fetch('./publications.json', { cache: 'no-store' })
      .then(r => r.ok ? r.json() as Promise<PublicationData> : Promise.reject())
      .then(d => {
        setData(d);
        setStatus(d.works.length > 0 ? 'ready' : 'none');
      })
      .catch(() => setStatus('none'));
  }, []);

  return { publications: data?.works ?? [], status };
}
