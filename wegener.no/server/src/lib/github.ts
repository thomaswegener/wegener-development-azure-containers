import { env } from '../env.js';

interface GitHubIssueResult {
  number: number;
  html_url: string;
}

export const createGitHubIssue = async (
  title: string,
  body: string,
  labels: string[]
): Promise<GitHubIssueResult> => {
  if (!env.githubToken || !env.githubOwner || !env.githubRepo) {
    throw new Error('GitHub integration not configured');
  }

  const res = await fetch(
    `https://api.github.com/repos/${env.githubOwner}/${env.githubRepo}/issues`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.githubToken}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, body, labels })
    }
  );

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${detail}`);
  }

  return res.json();
};

export const buildIssueLabels = (
  type: 'bug' | 'feature',
  companySlug: string
): string[] => {
  return [
    'customer-portal',
    `customer:${companySlug}`,
    type === 'bug' ? 'type:bug' : 'type:feature'
  ];
};

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
