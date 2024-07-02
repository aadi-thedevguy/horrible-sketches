"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { SearchBar } from "@/components/dashboard/search-bar";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { AlertCircle, ChevronLeftIcon, ImageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchSketches } from "@/server/queries/sketch";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import GridPlaceholder from "@/components/dashboard/CardPlaceholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCardActions } from "@/components/dashboard/file-actions";

function Search() {
  const router = useRouter();

  const getUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      router.push("/login");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const query = useSearchParams().get("query");

  const { isPending, isError, error, data } = useQuery({
    queryKey: ["search-sketch", query],
    queryFn: async () => {
      return await searchSketches({
        query: query || "",
      });
    },
  });

  return (
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

      {data?.type === "error" && (
        <Alert variant="destructive" className="my-4 max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{data?.type.toUpperCase()}</AlertTitle>
          <AlertDescription>{data?.message}</AlertDescription>
        </Alert>
      )}
      {isError && (
        <Alert variant="destructive" className="my-4 max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{error.name}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {isPending && <GridPlaceholder />}
      {!isPending && data?.result && data.result.length <= 0 && (
        <div className="flex flex-col gap-6 w-full items-center mt-24">
          <Image src="/preview.png" width={200} height={180} alt="logo" />
          <h2 className="text-2xl font-bold">
            No Results Found for {decodeURIComponent(query || "")}
          </h2>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {data?.result &&
          data.result.map((file) => (
            <Card key={file.id}>
              <CardHeader className="relative">
                <CardTitle className="flex gap-2 text-base font-normal">
                  <div className="flex justify-center">
                    {" "}
                    <ImageIcon />
                  </div>{" "}
                  {file.filename}
                </CardTitle>
                <div className="absolute top-2 right-2">
                  <FileCardActions file={file} />
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
  );
}

export default Search;
