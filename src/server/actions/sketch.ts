"use server";

import { db } from "@/lib/db";
import { sketch } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { genericMessages } from "@/constants";
import { validateFile } from "@/lib/validations";
import { createClient } from "@/lib/supabase/server";
import { v2 as cloudinary } from "cloudinary";
import { generateRandomString } from "@/lib/utils";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const supabase = createClient();
const bucket = process.env.CLOUDINARY_BUCKET;

export async function createSketch(formData: FormData) {
  // validate the form data
  const canvas = formData.get("canvas");
  let canvasObj = undefined;
  if (typeof canvas === "string") {
    canvasObj = JSON.parse(canvas);
  }
  const file = formData.get("file");
  const filename = formData.get("filename");

  const parsedFile = validateFile.safeParse(file);
  if (!parsedFile.success) {
    return {
      type: "error",
      message: parsedFile.error.message,
    };
  }

  const parsedFilename = validateFile.safeParse(filename);
  if (!parsedFilename.success) {
    return {
      type: "error",
      message: parsedFilename.error.message,
    };
  }
  const parsedCanvasData = validateFile.safeParse(canvasObj);
  if (!parsedCanvasData.success) {
    return {
      type: "error",
      message: parsedCanvasData.error.message,
    };
  }

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

  const sharableAuthorId = generateRandomString(7);

  const result = await db.query.sketch.findFirst({
    columns: { id: true, filename: true },
    where: (table, funcs) =>
      funcs.and(
        funcs.eq(sketch.authorId, user?.id),
        funcs.eq(sketch.filename, parsedFilename.data.filename)
      ),
  });

  if (result) {
    return {
      type: "error",
      message: genericMessages.SKETCH_ALREADY_EXISTS,
    };
  }
  // upload image
  try {
    const result = await cloudinary.uploader.upload(parsedFile.data.file, {
      folder: bucket,
      public_id: parsedFilename.data.filename,
    });

    const savedSketch = await db
      .insert(sketch)
      .values({
        url: result.secure_url,
        authorId: user?.id,
        filename: parsedFilename.data.filename,
        sharableAuthorId,
        canvasPath: parsedCanvasData.data.canvasPath,
      })
      .returning();

    const link = `${process.env.SERVER_URL}/author/${savedSketch[0].sharableAuthorId}/${savedSketch[0].id}`;
    return {
      type: "success",
      message: genericMessages.CREATE_SKETCH_SUCCESS,
      link,
    };
  } catch (error) {
    if (error instanceof Error) {
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

  try {
    // check if user has permission to delete the sketch
    const result = await db
      .select({ id: sketch.id })
      .from(sketch)
      .where(and(eq(sketch.id, id), eq(sketch.authorId, user?.id)));

    await cloudinary.uploader.destroy(result[0]?.id);
    await db
      .delete(sketch)
      .where(and(eq(sketch.id, id), eq(sketch.authorId, user?.id)));
    return {
      type: "success",
      message: genericMessages.DELETE_SKETCH_SUCCESS,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        type: "error",
        message: error.message,
      };
    }
    return {
      type: "error",
      message: genericMessages.DELETE_SKETCH_FAILED,
    };
  }
}
