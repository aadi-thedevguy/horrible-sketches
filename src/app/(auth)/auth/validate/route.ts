import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/verification-failed`);
  }

  const supabase = await createClient();
  const {
    error,
    data: { user },
  } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !user) {
    return NextResponse.redirect(`${origin}/verification-failed`);
  }
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
      return NextResponse.redirect(`${origin}/${next}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      // return the user to an error page with some instructions
      return NextResponse.redirect(`${origin}/verification-failed`);
    }
  }
}
