"use server";

import { constants } from "@/constants";
import { db } from "@/lib/db";
import { sketch } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getUserSketches(
  authorId: string,
  limit: number = constants.RESULTS_PER_PAGE,
  page: number = 1
) {
  const data = await db
    .select()
    .from(sketch)
    .where(eq(sketch.authorId, authorId))
    .orderBy(desc(sketch.updatedAt)) // order by is mandatory
    .limit(limit) // the number of rows to return
    .offset((page - 1) * limit); // the number of rows to skip

  return data;
}
