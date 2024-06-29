"use server";

import { constants } from "@/constants";
import { db } from "@/lib/db";
import { sketch } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getUserSketches({
  authorId,
  limit = constants.RESULTS_PER_PAGE,
  page = 1,
}: {
  authorId: string;
  page?: number;
  limit?: number;
}) {
  const data = await db.query.sketch.findMany({
    with: {
      author: true,
    },
    where: (table, funcs) => funcs.and(funcs.eq(sketch.authorId, authorId)),
    orderBy: desc(sketch.updatedAt),
    limit: limit,
    offset: (page - 1) * limit,
  });

  return data;
}
