import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { env } from "../env/server.mjs";

export async function getAccessToken(userId: string) {
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

  const [foundAccount] = Items as [{ access_token?: string }];

  return foundAccount.access_token?.trim();
}
