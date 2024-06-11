"use server";

import { db } from "@/lib/db";
import { sketch } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { genericMessages } from "@/constants";
import { validateFile } from "@/lib/validations";
import { createClient } from "@/lib/supabase/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const supabase = createClient();

export async function createSketch(formData: FormData) {
  // validate the form data
  const obj = Object.fromEntries(formData);
  const parsed = validateFile.safeParse(obj);

  if (!parsed.success) {
    return {
      type: "error",
      message: parsed.error.message,
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

  const { filename, file } = parsed.data;

  // if (!id && !edit) {
  // first check if existing sketch with same title exists or not
  const result = await db
    .select()
    .from(sketch)
    .where(eq(sketch.filename, filename));

  if (result.length > 0) {
    return {
      type: "error",
      message: genericMessages.SKETCH_ALREADY_EXISTS,
    };
  }
  // upload image
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "sketches",
      public_id: filename,
    });

    // create sketch in database
    await db.insert(sketch).values({
      url: result.secure_url,
      filename,
      authorId: user?.id,
    });
    return {
      type: "success",
      message: genericMessages.CREATE_SKETCH_SUCCESS,
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
