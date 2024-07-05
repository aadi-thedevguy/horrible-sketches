"use server";

import { constants, genericMessages } from "@/constants";
import { db } from "@/lib/db";
import { sketch } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { searchSchema } from "@/lib/validations";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

const supabase = createClient();

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

export async function getSketchById(id: string) {
  if (!id) {
    throw new Error("No id provided");
  }
  const data = await db.query.sketch.findFirst({
    where: (table, funcs) => funcs.eq(sketch.id, id),
    with: {
      author: true,
    },
  });

  return data;
}

export async function searchSketches(obj: z.infer<typeof searchSchema>) {
  const parsed = searchSchema.safeParse(obj);

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }
  const { query, page } = parsed.data;
  // const limit = constants.RESULTS_PER_PAGE;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) {
    throw new Error(authError.message);
  }
  if (!user) {
    throw new Error(genericMessages.NO_USER_FOUND);
  }

  return await db.query.sketch.findMany({
    with: {
      author: true,
    },
    where: (table, funcs) =>
      funcs.and(
        funcs.ilike(sketch.filename, `%${query}%`),
        funcs.eq(sketch.authorId, user?.id)
      ),
    orderBy: desc(sketch.updatedAt),
    // limit: limit,
    // offset: (page - 1) * limit,
  });
}
