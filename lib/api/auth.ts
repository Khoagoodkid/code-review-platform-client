import { api } from "./axios";

type LoginResponse = {
  url: string;
};

export async function getGitHubLoginUrl(): Promise<string> {
  const { data } = await api.get<LoginResponse | string>("/login");

  if (typeof data === "string") {
    return data;
  }

  return data.url;
}
