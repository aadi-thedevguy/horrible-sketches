import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { ArrowBigLeftDash } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Failed() {
  return (
    <main className="w-11/12 md:max-w-3xl mx-auto bg-white mt-10 h-screen">
      <header className="py-8 flex justify-center w-full">
        <Image width={200} height={180} src="/preview.png" alt="logo" />
      </header>
      <Alert
        variant="destructive"
        className="my-4 max-w-xl w-max mx-auto min-h-48 py-4 flex gap-4 flex-col"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-[1px] bg-red-500"></div>
          <EmailIcon />
          <div className="w-10 h-[1px] bg-red-500"></div>
        </div>
        <AlertTitle>EMAIL VERIFICATION FAILED</AlertTitle>
        <AlertDescription>
          Sorry, we could not verify your email due to some technical issues
        </AlertDescription>
      </Alert>
      <Link
        href={"/sign-in"}
        className={buttonVariants({
          variant: "ghost",
        })}
      >
        <ArrowBigLeftDash /> Try Again
      </Link>
    </main>
  );
}

const EmailIcon = () => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="none" d="M0 0h24v24H0V0z"></path>
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"></path>
    </svg>
  );
};
