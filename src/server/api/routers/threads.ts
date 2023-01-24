import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getThreadsList } from "../../../utils/googleApi";

export const threadsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ labelIds: z.array(z.string()) }))
    .query(async ({ ctx, input: { labelIds } }) => {
      return {
        data: await getMsgsByLabels(ctx.session.user.id, labelIds),
      };
    }),
});

async function getMsgsByLabels(userId: string, labelIds: string[]) {
  const {
    data: { threads },
  } = await getThreadsList(userId);

  threads.forEach((thread) => {
    if (!thread.messages) return; // Thread with no emails?

    const msgsByLabels: Record<string, unknown[]> = {};

    thread.messages.some((message, _index, msgs) => {
      if (message.labelIds?.length === 1) {
        const label = message.labelIds[0] as string;
        msgsByLabels[label] = msgs;

        return true;
      }

      return false;
    });
  });
}
