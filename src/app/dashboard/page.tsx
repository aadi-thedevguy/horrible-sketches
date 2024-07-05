import { Gallery } from "@/components/dashboard/Gallery";
import Placeholder from "@/components/dashboard/Placeholder";
import { SearchBar } from "@/components/dashboard/search-bar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getUserSketches } from "@/server/queries/sketch";
import { Brush } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    redirect("/sign-in");
  }
  if (!data.user) {
    redirect("/sign-in");
  }
  const items = await getUserSketches({ authorId: data.user?.id });
  if (items.length === 0) return <Placeholder />;

  return (
    <section className="max-w-screen-xl mx-auto p-6">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Your Sketches</h1>
        <SearchBar />
        <Link href="/sketch/create">
          <Button className="gap-1">
            <span>Let&apos; Draw</span>
            <Brush size={14} />
          </Button>
        </Link>
      </div>
      <Gallery user={data.user} sketches={items} />
    </section>
  );
}
