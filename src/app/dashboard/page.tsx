import ImageGrid from "@/components/ImageGrid";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

async function Dashboard() {
  
  const supabase = createClient()
  // const {data,error} = await supabase.auth.getUser()

  // if (error || !data.user) {
  //   redirect("/sign-in")
  // }


  return (
    <>
      <p className="text-xl text-center my-4">
        <Link href={"/sketch/create"}>
          <Button variant={"secondary"}>Create Sketch</Button>
        </Link>
      </p>
      <ImageGrid />
    </>
  );
}

export default Dashboard;
