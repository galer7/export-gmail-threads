import { google } from "googleapis";
import type { gmail_v1 } from "googleapis/build/src/apis/gmail";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getGoogleOAuthClient } from "../../../utils/googleApi";

export const labelsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return {
      data: await listLabels(ctx.session.user.id),
    };
  }),
});

async function listLabels(userId: string) {
  const auth = await getGoogleOAuthClient(userId);

  const gmail = google.gmail({
    version: "v1",
    auth,
  });

  try {
    const res = await gmail.users.labels.list({
      userId: "me",
    });
    const labels = res.data.labels;
    if (!labels || labels.length === 0) {
      console.log("No labels found.");
      return;
    }
  } catch (error) {
    console.log(error);
    throw "aici";
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
