import Link from "next/link";
import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Icons } from "./Icons";
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

const Navbar = async ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();
  // if (error || !data?.user) {
  //   redirect('/')
  // }

  function createAvatar(fullName: string) {
    if (fullName.length <= 0) return "US";
    const nameArray = fullName.split(" ");
    const firstNameInitial = nameArray[0].charAt(0);
    const lastNameInitial = nameArray[1].charAt(0);
    const avatar = firstNameInitial + lastNameInitial;
    return avatar;
  }

  let avatar = "";

  if (data.user) {
    avatar = createAvatar(data.user?.user_metadata?.fullName || "");
  }

  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        {/* logo */}
        <Link href="/" className="flex gap-2 items-center">
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            ☠️👻
          </p>
        </Link>

        {/* actions */}
        {data.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={data.user?.user_metadata?.avatar_url ?? ""} />
                <AvatarFallback>{avatar}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="text-primary-foreground">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {" "}
                <Link href="/dashboard">
                  <Button variant="link">My Dashboard</Button>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                {" "}
                {children}
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
