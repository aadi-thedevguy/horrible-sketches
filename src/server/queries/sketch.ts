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

export async function searchSketches(obj: z.infer<typeof searchSchema>) {
  const parsed = searchSchema.safeParse(obj);

  if (!parsed.success) {
    return {
      type: "error",
      message: parsed.error.message,
      result: [],
    };
  }
  const { query, page } = parsed.data;
  // const limit = constants.RESULTS_PER_PAGE;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) {
    return {
      type: "error",
      message: authError.message,
      result: [],
    };
  }
  if (!user) {
    return {
      type: "error",
      message: genericMessages.NO_USER_FOUND,
      result: [],
    };
  }

  try {
    const data = await db.query.sketch.findMany({
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

    return {
      type: "success",
      message: "Successfully Fetched Sketches",
      result: data,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        type: "error",
        message: error.message,
        result: [],
      };
    }
  }
}
