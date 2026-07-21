import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL ?? "http://localhost:8000";

export async function refreshAccessToken(): Promise<void> {
  await axios.post(
    `${baseURL}/auth/refresh-token`,
    {},
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    },
  );
}
