"use client";

import Link from "next/link";
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
import { createAvatar } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

function AvatarMenu({ user }: { user: User }) {
  let avatar = createAvatar(
    user?.user_metadata?.username || user?.user_metadata.full_name
  );

  const client = new QueryClient();
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: async () => await supabase.auth.signOut(),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["user"] });
      router.refresh();
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
  return (
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
  );
}

export default AvatarMenu;
