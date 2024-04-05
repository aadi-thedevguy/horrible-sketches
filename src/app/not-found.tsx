import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] mt-6 flex flex-col items-center justify-items-center gap-7">
      <Image
        src={"/images/error-404.png"}
        alt="verification-failed"
        height={250}
        width={250}
        className="mt-10"
      />
      <h1 className="text-5xl">Page Not Found</h1>
      <p className="text-2xl mb-10">
        Sorry, we could not find the page you were looking for.
      </p>
      <Link
        href="/"
        className="inline-block border border-secondary hover:bg-secondary/70 hover:text-white transition-colors duration-500 text-textPrimary rounded-3xl px-4 py-2 mt-8"
      >
        Back To Home
      </Link>
    </main>
  );
}
