import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon, ChevronLeftSquare, HomeIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] mt-6 flex flex-col items-center justify-items-center gap-7">
      <Image
        src={"/images/error-404.png"}
        alt="error street sign"
        height={250}
        width={250}
        className="mt-10"
      />
      <h1 className="text-5xl">Page Not Found</h1>
      <p className="text-2xl mb-10">
        Sorry, we could not find the page you were looking for.
      </p>
      <Link
        href={"/sign-in"}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "flex items-center gap-2"
        )}
      >
        <ChevronLeftIcon className="w-4 h-4" />
        <span>Go Back</span>
      </Link>
    </main>
  );
}
