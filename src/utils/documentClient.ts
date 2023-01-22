import { DocumentClient } from "aws-sdk/clients/dynamodb";
import type { Credentials } from "google-auth-library";

import { env } from "../env/server.mjs";

export async function getAccountData(userId: string): Promise<Credentials> {
  const dynamoClient = new DocumentClient({
    region: env.NEXT_AUTH_AWS_REGION,
    credentials: {
      accessKeyId: env.NEXT_AUTH_AWS_ACCESS_KEY,
      secretAccessKey: env.NEXT_AUTH_AWS_SECRET_KEY,
    },
  });

  const queryConfig: DocumentClient.QueryInput = {
    TableName: "next-auth",
    KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames: { "#pk": "pk", "#sk": "sk" }, // optional names substitution
    ExpressionAttributeValues: {
      ":pk": `USER#${userId}`,
      ":sk": "ACCOUNT#",
    },
  };

  const { Count, Items } = await dynamoClient.query(queryConfig).promise();

  if (!Count) throw new Error("Account not found in table!");
  if (Count > 1) throw new Error("Multiple accounts feed that pattern!");

  const [foundAccount] = Items as [NextAuthStoredAccount];

  //   console.log(foundAccount);

  return {
    access_token: foundAccount.access_token,
    expiry_date: foundAccount.expires_at,
    id_token: foundAccount.id_token,
    token_type: foundAccount.token_type,
    refresh_token: foundAccount.id_token, // TODO: find real refresh_token
  };
}

type NextAuthStoredAccount = Omit<Credentials, "expiry_date"> & {
  expires_at: number;
};
