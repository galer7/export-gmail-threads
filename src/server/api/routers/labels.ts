import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getLabelsList } from "../../../utils/googleApi";

export const labelsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return {
      data: await listLabels(ctx.session.user.id),
    };
  }),
});

async function listLabels(userId: string) {
  const {
    data: { labels },
  } = await getLabelsList(userId);

  if (!labels || labels.length === 0) {
    console.log("No labels found.");
    return;
  }
}
