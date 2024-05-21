"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "./ui/use-toast";
import { genericMessages } from "@/constants";
import { Button, buttonVariants } from "./ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, createAvatar } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

const Navbar = () => {
  const client = new QueryClient();

  const { data, isError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await supabase.auth.getUser(),
  });

  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async () => await supabase.auth.signOut(),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["user"] });
      router.push("/sign-in");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || genericMessages.SIGNOUT_FAILED,
        variant: "destructive",
      });
      return;
    },
  });

  const user = data?.data.user;

  let avatar = createAvatar(
    user?.user_metadata?.username || user?.user_metadata.full_name
  );

  return (
    <div className="h-fit bg-zinc-100 border-b border-zinc-300 py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        {/* logo */}
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "link" }),
            "flex items-center"
          )}
        >
          <Image
            width={32}
            height={32}
            alt="logo"
            className="h-8 w-8 object-center rounded-md"
            src="/logo.png"
          />
          <span className="hidden md:block font-semibold text-lg text-primary ml-1 ">
            Horrible Sketches
          </span>
          {/* <Icons.logo className="h-8 w-8" /> */}
        </Link>

        {/* actions */}
        {!isError && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src={
                    user?.user_metadata?.avatar_url ??
                    // "https://api.dicebear.com/8.x/micah/svg?seed=Bear&backgroundColor=6100bd"
                    "https://api.dicebear.com/8.x/micah/svg?seed=Bear"
                  }
                />

                <AvatarFallback className="text-white bg-secondary">
                  {avatar}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel className="text-primary-foreground">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Link
                  href="/dashboard"
                  className={buttonVariants({ variant: "link" })}
                >
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button variant="link" onClick={() => mutate()}>
                  Sign Out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
