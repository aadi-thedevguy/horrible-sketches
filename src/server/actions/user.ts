"use server";

import { supabase } from "@/lib/supabase/client";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { genericMessages } from "@/constants";
import { signinSchema, signupSchema } from "@/lib/validations";

export async function signUp(formData: FormData) {
  // validate the form data
  const obj = Object.fromEntries(formData);
  const parsed = signupSchema.safeParse(obj);

  if (!parsed.success) {
    return {
      type: "error",
      message: parsed.error.message,
    };
  }
  const { email, name } = parsed.data;

  // first check if the username exists or not
  const result = await db
    .select()
    .from(profile)
    .where(eq(profile.email, email));

  if (result.length > 0) {
    return {
      type: "error",
      message: genericMessages.ACCOUNT_ALREADY_EXISTS,
    };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      // shouldCreateUser: false,
      emailRedirectTo: `${process.env.SERVER_URL}/auth/callback`,
      data: {
        username: name,
      },
    },
  });

  if (error) {
    return {
      type: "error",
      message: error.message,
    };
  }

  return {
    type: "success",
    message: genericMessages.SIGN_IN_MAIL_SENT,
  };
}
export async function signIn(formData: FormData) {
  // validate the form data
  const obj = Object.fromEntries(formData);
  const parsed = signinSchema.safeParse(obj);

  if (!parsed.success) {
    return {
      type: "error",
      message: parsed.error.message,
    };
  }
  const { email } = parsed.data;

  try {
    // first check if the username exists or not
    const result = await db
      .select()
      .from(profile)
      .where(eq(profile.email, email));

    if (result.length <= 0) {
      return {
        type: "error",
        message: genericMessages.USER_NOT_FOUND,
      };
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${process.env.SERVER_URL}/auth/callback`,
      },
    });

    if (error) {
      return {
        type: "error",
        message: error.message,
      };
    }

    return {
      type: "success",
      message: genericMessages.SIGN_IN_MAIL_SENT,
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
      message: genericMessages.SIGN_IN_FAILED,
    };
  }
}
