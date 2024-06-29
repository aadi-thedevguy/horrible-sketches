"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  SkullIcon,
  ImageIcon,
  Brush,
  AlertCircle,
  LoaderPinwheel,
} from "lucide-react";
import { SearchBar } from "./search-bar";
import { Button } from "../ui/button";
import { useInView } from "react-intersection-observer";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserSketches } from "@/server/queries/sketch";
import { FileCardActions } from "./file-actions";
import { ISketch } from "@/lib/db/schema";
import GridPlaceholder from "./CardPlaceholder";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <SkullIcon className="w-80 h-80" />
      <div className="text-2xl">You have no Sketches, Draw one now</div>
      <Link href="/sketch/create">
        <Button className="gap-1">
          <span>Let&apos; Draw</span>
          <Brush size={14} />
        </Button>
      </Link>
    </div>
  );
}

export function Gallery({
  user,
  sketches,
}: {
  user: User;
  sketches: ISketch[];
}) {
  const [query, setQuery] = useState("");

  const { ref, inView } = useInView();
  const {
    status,
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["sketches"],
    queryFn: async ({ pageParam }) => {
      return await getUserSketches({
        authorId: user.id,
        page: pageParam,
      });
    },
    initialData: { pages: [sketches], pageParams: [1] },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return lastPage.length > 0 ? lastPageParam + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <section className="max-w-screen-xl mx-auto p-6">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Your Sketches</h1>

        <SearchBar query={query} setQuery={setQuery} />

        <Link href="/sketch/create">
          <Button className="gap-1">
            <span>Let&apos; Draw</span>
            <Brush size={14} />
          </Button>
        </Link>
      </div>

      {status === "error" && (
        <Alert variant="destructive" className="my-4 max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{error.name}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {data?.pages.length === 0 && <Placeholder />}

      {isFetching && !isFetchingNextPage && <GridPlaceholder />}

      <div className="grid grid-cols-3 gap-4">
        {data?.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.map((file) => (
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
                <CardFooter className="flex justify-between">
                  <div className="text-xs text-gray-700">
                    Created on{" "}
                    {file.updatedAt.toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </React.Fragment>
        ))}
      </div>

      {hasNextPage && isFetchingNextPage ? (
        <div className="grid place-content-center my-10">
          <LoaderPinwheel className="animate-spin w-10 h-10 text-secondary" />
        </div>
      ) : null}

      <div ref={ref} className="mt-24" />
    </section>
  );
}
