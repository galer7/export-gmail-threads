import axios from "axios";
import { getAccessToken } from "./documentClient";

export async function getLabelsList(userId: string) {
  return makeAuthorizedRequest<LabelsListResponse>(
    userId,
    "https://gmail.googleapis.com/gmail/v1/users/me/labels"
  );
}

export async function getThreadsList(userId: string) {
  return makeAuthorizedRequest<ThreadsListResponse>(
    userId,
    "https://gmail.googleapis.com/gmail/v1/users/me/threads"
  );
}

async function makeAuthorizedRequest<T>(userId: string, url: string) {
  const accessToken = await getAccessToken(userId);
  if (!accessToken) throw new Error("Nullish access_token!");

  return axios.get<T>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

interface LabelsListResponse {
  labels: Array<{ id: string; name: string; type: "user" | "system" }>;
}

interface ThreadsListResponse {
  threads: Array<{
    id: string;
    snippet: string;
    historyId: string;
    messages: Array<{ id: string; labelIds: string[] }>; // TODO:
  }>;
}
