import SketchForm from "@/components/SketchForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/sign-in");
  }
  return (
    <>
      <SketchForm user={data?.user} />
    </>
  );
}

export default page;
