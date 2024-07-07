"use server";

import { db } from "@/lib/db";
import { sketch } from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { genericMessages } from "@/constants";
import { validateFile } from "@/lib/validations";
import { createClient } from "@/lib/supabase/server";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const supabase = createClient();
const bucket = process.env.CLOUDINARY_BUCKET;

export async function createSketch(sketchData: z.infer<typeof validateFile>) {
  // validate the form data
  const parsed = validateFile.safeParse(sketchData);

  if (!parsed.success) {
    return {
      type: "error",
      message: parsed.error.message,
    };
  }
  const { file, filename, originalName } = parsed.data;

  // check if user is logged in or not
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) {
    return {
      type: "error",
      message: authError.message,
    };
  }
  if (!user) {
    return {
      type: "error",
      message: genericMessages.NO_USER_FOUND,
    };
  }

  // if (!id && !edit) {
  // first check if existing sketch with same title exists or not
  // const result = await db.query.sketch.findFirst({
  //   columns : [sketch.filename, sketch.id],
  //   where : eq(sketch.filename, filename)
  // })

  const result = await db.query.sketch.findFirst({
    columns: { id: true, filename: true },
    where: (table, funcs) =>
      funcs.and(
        funcs.eq(sketch.authorId, user?.id),
        funcs.eq(sketch.filename, filename)
      ),
  });

  if (result) {
    return {
      type: "error",
      message: genericMessages.SKETCH_ALREADY_EXISTS,
    };
  }
  // upload image
  const { secure_url, public_id } = await cloudinary.uploader.upload(file, {
    folder: bucket,
    public_id: filename,
  });

  if (!secure_url) {
    return {
      type: "error",
      message: genericMessages.SKETCH_UPLOAD_FAILED,
    };
  }
  try {
    const savedSketch = await db
      .insert(sketch)
      .values({
        url: secure_url,
        authorId: user?.id,
        filename: filename,
        originalName: originalName,
      })
      .returning();

    const link = `${process.env.SERVER_URL}/sketch/${savedSketch[0].id}`;
    return {
      type: "success",
      message: genericMessages.CREATE_SKETCH_SUCCESS,
      link,
    };
  } catch (error) {
    // if db insertion fails, delete the image from cloudinary
    try {
      await cloudinary.uploader.destroy(public_id);
      console.log("Image rollback successful:", public_id);
    } catch (err) {
      console.error("Error during image rollback");
    }
    if (error instanceof Error) {
      console.error(error.message);
      return {
        type: "error",
        message: error.message,
      };
    }
    return {
      type: "error",
      message: genericMessages.CREATE_SKETCH_FAILED,
    };
  }
}

export async function deleteSketch(id: string) {
  // check if user is logged in or not
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

  // check if user has permission to delete the sketch
  const result = await db.query.sketch.findFirst({
    where: (table, funcs) => funcs.eq(sketch.id, id),
  });

  if (!result) throw new Error(genericMessages.SKETCH_NOT_FOUND);

  const deletedSketch = await cloudinary.uploader.destroy(
    process.env.CLOUDINARY_BUCKET + "/" + result?.filename
  );
  if (deletedSketch.result !== "ok") {
    throw new Error(genericMessages.DELETE_SKETCH_FAILED);
  }

  await db
    .delete(sketch)
    .where(and(eq(sketch.id, id), eq(sketch.authorId, user?.id)));
}

// export async function increaseViews(id: string, ipAddress: string) {
//   // check if the ip is already in the views array
//   const result = await db.query.sketch.findFirst({
//     where: (table, funcs) => funcs.eq(sketch.id, id),
//   });

//   if (!result) throw new Error(genericMessages.SKETCH_NOT_FOUND);

//   const views = result.views.filter((view) => view !== ipAddress);

//   // update the views array with unique ip addresses
//   // and return the count of views array after update
//   const updatedViewCount = await db
//     .update(sketch)
//     .set({
//       views: sql`${views} + ${[ipAddress]}`,
//     })
//     .where(eq(sketch.id, id))
//     .returning();
//   return updatedViewCount[0].views.length;
// }
