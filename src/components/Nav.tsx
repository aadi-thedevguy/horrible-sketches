import Link from "next/link";
import Image from "next/image";
import React from "react";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import AvatarMenu from "./AvatarMenu";

const Navbar = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  const user = data?.user;

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
          {/* <span className="hidden md:block font-semibold text-lg text-primary ml-1 ">
            Horrible Sketches
          </span> */}
          {/* <Icons.logo className="h-8 w-8" /> */}
        </Link>

        {/* user */}
        {!user ? (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        ) : (
          <AvatarMenu user={user} />
        )}
      </div>
    </div>
  );
};

export default Navbar;
