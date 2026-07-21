import { create } from "zustand";
import {
  addRepoWebhookConfig,
  getAddedRepos,
  getRepos,
  removeAddedRepo,
  type AddedRepo,
  type Repository,
} from "@/lib/api/repos";
import { getMe, type User } from "@/lib/api/user";

type AppState = {
  user: User | null;
  repos: Repository[];
  addedRepos: AddedRepo[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  refreshAddedRepos: () => Promise<void>;
  addRepo: (repoName: string) => Promise<void>;
  removeRepo: (repoName: string) => Promise<void>;
  isRepoAdded: (repoName: string) => boolean;
  logout: () => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  repos: [],
  addedRepos: [],
  loading: true,
  error: null,

  isRepoAdded: (repoName) =>
    get().addedRepos.some((added) => added.repo_name === repoName),

  fetchAll: async () => {
    set({ loading: true, error: null });

    try {
      const [user, repos, addedRepos] = await Promise.all([
        getMe(),
        getRepos(),
        getAddedRepos(),
      ]);

      set({ user, repos, addedRepos, loading: false });
    } catch {
      set({
        error: "Failed to load your data. Please try again.",
        loading: false,
      });
    }
  },

  refreshAddedRepos: async () => {
    const addedRepos = await getAddedRepos();
    set({ addedRepos });
  },

  addRepo: async (repoName) => {
    await addRepoWebhookConfig(repoName);
    await get().refreshAddedRepos();
  },

  removeRepo: async (repoName) => {
    await removeAddedRepo(repoName);
    await get().refreshAddedRepos();
  },

  logout: () => {
    set({
      user: null,
      repos: [],
      addedRepos: [],
      loading: false,
      error: null,
    });
  },
}));
