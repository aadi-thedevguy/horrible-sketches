import ImageGrid from "@/components/ImageGrid";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getUserSketches } from "@/server/queries/sketch";
import Link from "next/link";
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
  const items = await getUserSketches(data.user?.id);
  if (items.length === 0) return null;

  return (
    <>
      <p className="text-xl text-center my-4">
        <Link href={"/sketch/create"}>
          <Button variant={"secondary"}>Create Sketch</Button>
        </Link>
      </p>
      <ImageGrid items={items} />
    </>
  );
}

export default Dashboard;
