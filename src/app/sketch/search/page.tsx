import SearchResults from "@/components/search/SearchResults";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/sign-in");
  }
  return (
    <>
      <SearchResults />
    </>
  );
}

export default page;
