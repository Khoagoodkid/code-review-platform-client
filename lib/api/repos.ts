import { api } from "./axios";

export type RepositoryOwner = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
};

export type Repository = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: RepositoryOwner;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  archive_url: string;
  assignees_url: string;
  blobs_url: string;
  branches_url: string;
  collaborators_url: string;
  comments_url: string;
  commits_url: string;
  compare_url: string;
  contents_url: string;
  contributors_url: string;
  deployments_url: string;
  downloads_url: string;
  events_url: string;
  forks_url: string;
  git_commits_url: string;
  git_refs_url: string;
  git_tags_url: string;
  git_url: string;
  issue_comment_url: string;
  issue_events_url: string;
  issues_url: string;
  keys_url: string;
  labels_url: string;
  languages_url: string;
  merges_url: string;
  milestones_url: string;
  notifications_url: string;
  pulls_url: string;
  releases_url: string;
  ssh_url: string;
  stargazers_url: string;
  statuses_url: string;
  subscribers_url: string;
  subscription_url: string;
  tags_url: string;
  teams_url: string;
  trees_url: string;
  hooks_url: string;
};

export type AddedRepo = {
  repo_name: string;
  user_id: string;
};

export async function getRepos(): Promise<Repository[]> {
  const { data } = await api.get<Repository[]>("/repos");
  return data;
}

export async function getAddedRepos(): Promise<AddedRepo[]> {
  const { data } = await api.get<AddedRepo[]>("/added-repos");
  return data;
}

type WebhookConfigRequest = {
  repo_name: string;
};

export async function addRepoWebhookConfig(
  repoName: string,
): Promise<void> {
  const body: WebhookConfigRequest = { repo_name: repoName };
  await api.post("/repos/webhook-config", body);
}

export type RemoveAddedRepoParams = {
  repo_name: string;
};

export async function removeAddedRepo(repoName: string): Promise<void> {
  const params: RemoveAddedRepoParams = { repo_name: repoName };
  await api.delete("/added-repos", { params });
}
