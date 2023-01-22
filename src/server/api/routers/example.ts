import { z } from "zod";
import { google } from "googleapis";
import type { gmail_v1 } from "googleapis/build/src/apis/gmail";
import { OAuth2Client } from "google-auth-library";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getLabels: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});

async function getLabels() {
  const gmail = google.gmail({ version: "v1", auth });
  const res = await gmail.users.labels.list({
    userId: "me",
  });

  const labels = res.data.labels;
  if (!labels || labels.length === 0) {
    console.log("No labels found.");
    return;
  }
}

async function getMsgsByLabels(labelIds: string[]) {
  const gmail = google.gmail({ version: "v1", auth });
  const threads = await gmail.users.threads.list({ labelIds });

  threads.data.threads?.forEach((thread) => {
    if (!thread.messages) return; // Thread with no emails?

    const msgsByLabels: Record<string, gmail_v1.Schema$Message[]> = {};

    thread.messages?.some((message, _index, msgs) => {
      if (message.labelIds?.length === 1) {
        const label = message.labelIds[0] as string;
        msgsByLabels[label] = msgs;

        return true;
      }

      return false;
    });
  });
}
