import { Gallery } from "@/components/dashboard/Gallery";
import { createClient } from "@/lib/supabase/server";
import { getUserSketches } from "@/server/queries/sketch";
import { redirect } from "next/navigation";
import React from "react";

async function Dashboard() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    redirect("/sign-in");
  }
  if (!data.user) {
    redirect("/sign-in");
  }
  const items = await getUserSketches({ authorId: data.user?.id });
  if (items.length === 0) return null;

  return (
    <>
      <Gallery user={data.user} sketches={items} />
    </>
  );
}

export default Dashboard;
