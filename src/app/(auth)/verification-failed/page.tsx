import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { ArrowBigLeftDash } from "lucide-react";

export default function Failed() {
  return (
    <main className="max-w-3xl mx-auto bg-white mt-10">
      <header className="py-8 flex justify-center w-full">
        <Image
          width={180}
          height={32}
          src="https://firebasestorage.googleapis.com/v0/b/portfolio-52b82.appspot.com/o/Horrible%20Sketches.png?alt=media"
          alt="logo"
        />
      </header>
      <section className="h-48 bg-red-600 rounded-md w-full text-white flex items-center justify-center flex-col gap-5 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-[1px] bg-white"></div>
          <EmailIcon />
          <div className="w-10 h-[1px] bg-white"></div>
        </div>
        <div className="flex flex-col gap-3 px-4">
          <h3 className="text-center text-2xl tracking-widest font-bold">
            EMAIL VERIFICATION FAILED
          </h3>
          <h5 className="text-xl tracking-wider font-medium">
            Sorry, we could not verify your email due to some technical issues
          </h5>
        </div>
      </section>
      <Link href={"/sign-in"} className={buttonVariants()}>
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
