import { notFound } from "next/navigation";
import { SearchBar } from "@/components/search-bar";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeftIcon, ImageIcon } from "lucide-react";
import { searchSketches } from "@/server/queries/sketch";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCardActions } from "@/components/dashboard/file-actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: Props) {
  const { query } = searchParams;

  if (!query || typeof query !== "string") {
    return notFound();
  }
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/sign-in");
  }
  const result = await searchSketches({
    query: query || "",
  });

  return (
    <>
      <section className="max-w-screen-xl mx-auto p-6">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-muted-foreground">
            Your Searched for{" "}
            <span className="text-secondary">
              {decodeURIComponent(query || "")}
            </span>
          </h1>

          <SearchBar query={query || ""} />

          <Link
            href={"/dashboard"}
            className={buttonVariants({
              variant: "secondary",
              className: "self-start md:self-center gap-2",
            })}
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span>Go Back</span>
          </Link>
        </div>

        {result && result.length <= 0 && (
          <div className="flex flex-col gap-6 w-full items-center mt-24">
            <Image src="/preview.png" width={200} height={180} alt="logo" />
            <h2 className="text-2xl font-bold">
              No Results Found for {decodeURIComponent(query || "")}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {result &&
            result.map((file) => (
              <Card key={file.id}>
                <CardHeader className="relative">
                  <CardTitle className="flex gap-2 text-base font-normal">
                    <div className="flex justify-center">
                      {" "}
                      <ImageIcon />
                    </div>{" "}
                    {file.originalName}
                  </CardTitle>
                  <div className="absolute top-2 right-2">
                    <FileCardActions file={file} query={query || ""} />
                  </div>
                </CardHeader>
                <CardContent className="h-[200px] flex justify-center items-center">
                  {file.url && (
                    <Image
                      alt={file.filename}
                      width="300"
                      height="200"
                      src={file.url}
                      className="w-full h-full aspect-video"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      </section>
    </>
  );
}
