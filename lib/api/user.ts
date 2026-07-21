import { api } from "./axios";

export type User = {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
  github_id: number;
};

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/me");
  return data;
}
