import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";
import { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  if (!token_hash || !type) {
    return NextResponse.redirect(redirectTo);
  }

  const supabase = await createClient();
  const {
    error: verifyError,
    data: { user },
  } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  });
  if (verifyError) {
    redirectTo.pathname = "/verification-failed";
    return NextResponse.redirect(redirectTo);
  }

  // const {
  //   data: { user },
  //   error,
  // } = await supabase.auth.getUser();
  // console.log(user);
  // if (error || !user) {
  //   redirectTo.pathname = "/verification-failed";
  //   return NextResponse.redirect(redirectTo);
  // }

  try {
    if (user?.id && user?.email) {
      await db
        .insert(profile)
        .values({
          id: user.id,
          email: user.email,
          username:
            user.user_metadata.username || user.user_metadata.full_name || "",
        })
        .onConflictDoNothing({ target: profile.id });

      redirectTo.searchParams.delete("next");
      redirectTo.searchParams.delete("code");
      return NextResponse.redirect(redirectTo);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      // return the user to an error page with some instructions
      redirectTo.pathname = "/verification-failed";
      return NextResponse.redirect(redirectTo);
    }
  }
}
