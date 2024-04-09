import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/verification-failed`);
  }
  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/verification-failed`);
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
      return NextResponse.redirect(`${origin}${next}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.redirect(`${origin}/verification-failed`);
    }
  }
}
