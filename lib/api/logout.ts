import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL ?? "http://localhost:8000";

export async function logoutRequest(): Promise<void> {
  await axios.post(
    `${baseURL}/logout`,
    {},
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    },
  );
}
