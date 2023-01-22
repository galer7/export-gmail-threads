import type { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";
import GoogleProvider from "next-auth/providers/google";

import { env } from "../../../env/server.mjs";

const config: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: env.NEXT_AUTH_AWS_ACCESS_KEY,
    secretAccessKey: env.NEXT_AUTH_AWS_SECRET_KEY,
  },
  region: env.NEXT_AUTH_AWS_REGION,
};

const client = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
    // ...add more providers here
  ],
  adapter: DynamoDBAdapter(client),
};

export default NextAuth(authOptions);
