"use server";

import { constants, genericMessages } from "@/constants";
import { db } from "@/lib/db";
import { sketch } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { searchSchema, SearchType } from "@/lib/validations";
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
  const supabase = await createClient();

  const { data: user, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error(genericMessages.NO_USER_FOUND);
  }

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

export async function getSketchById(id: string, ipAddress: string) {
  if (!id) {
    throw new Error(genericMessages.SKETCH_NOT_FOUND);
  }
  const result = await db.query.sketch.findFirst({
    where: (table, funcs) => funcs.eq(sketch.id, id),
    columns: { authorId: false, filename: false, id: false },
    with: {
      author: true,
    },
  });

  if (!result) throw new Error(genericMessages.SKETCH_NOT_FOUND);

  // check if the ip is already in the ipaddresses array do nothing, else add the ip to the ipaddresses array
  const alreadyViewed = result.ipAddresses?.find((view) => view === ipAddress);
  if (alreadyViewed)
    return {
      data: result,
      views: result.ipAddresses?.length || 0,
    };
  const updated = result.ipAddresses
    ? [...result.ipAddresses, ipAddress]
    : [ipAddress];

  // update the ipaddresses array with unique ip addresses
  // and return the count of ipaddresses array after update
  const updatedViewCount = await db
    .update(sketch)
    .set({
      ipAddresses: updated,
    })
    .where(eq(sketch.id, id))
    .returning();
  return {
    data: result,
    views: updatedViewCount[0].ipAddresses?.length || 0,
  };
}

export async function searchSketches(obj: SearchType) {
  const parsed = searchSchema.safeParse(obj);

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }
  const { query, page } = parsed.data;
  // const limit = constants.RESULTS_PER_PAGE;
  const supabase = await createClient();

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
