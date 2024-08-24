"use server";

import { supabase } from "@/lib/supabase/client";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { FormState, genericMessages } from "@/constants";
import { signinSchema, signupSchema } from "@/lib/validations";
import { ratelimit } from "@/lib/redis";

export async function signUp(prevState: FormState,
  data: FormData
): Promise<FormState> {
  // validate the form data
  const formData = Object.fromEntries(data);
  const parsed = signupSchema.safeParse(formData);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }
    return {
      message: genericMessages.SIGN_UP_FAILED,
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  const { email, name } = parsed.data;

  try {
    // allow 3 logins every 5 minutes
    // await ratelimit(email, 3, 60 * 5);
    await ratelimit(email, 1, 30);
  } catch (error) {
    if (error instanceof Error) {
      return {
        fields: parsed.data,
        message: error.message,
      };
    }
  }

  // first check if the user exists or not
  const result = await db
    .select()
    .from(profile)
    .where(eq(profile.email, email));

  if (result.length > 0) {
    return {
      fields: parsed.data,
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
      fields: parsed.data,
      message: error.message,
    };
  }

  return {
    success: true,
    message: genericMessages.SIGN_IN_MAIL_SENT,
  };
}

export async function signIn(prevState: FormState,
  data: FormData
): Promise<FormState> {
  // validate the form data
  const formData = Object.fromEntries(data);
  const parsed = signinSchema.safeParse(formData);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }
    return {
      message: genericMessages.SIGN_IN_FAILED,
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }
  const { email } = parsed.data;


  try {
    // allow 3 logins every 5 minutes
    await ratelimit(email, 3, 60 * 5);

    // first check if the username exists or not
    const result = await db
      .select()
      .from(profile)
      .where(eq(profile.email, email));

    if (result.length <= 0) {
      return {
        fields: parsed.data,
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
        fields: parsed.data,
        message: error.message,
      };
    }

    return {
      success: true,
      message: genericMessages.SIGN_IN_MAIL_SENT,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        fields: parsed.data,
        message: error.message,
      };
    }
    return {
      fields: parsed.data,
      message: genericMessages.SIGN_IN_FAILED,
    };
  }
}
