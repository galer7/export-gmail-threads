import { OAuth2Client } from "google-auth-library";
import { env } from "../env/server.mjs";
import { getAccountData } from "./documentClient";

let OAuthClient: OAuth2Client | undefined;

export async function getGoogleOAuthClient(userId: string) {
  if (OAuthClient) return OAuthClient;

  const newOAuthClient = new OAuth2Client(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET
  );

  const account = await getAccountData(userId);
  newOAuthClient.setCredentials(account);

  return newOAuthClient;
}
