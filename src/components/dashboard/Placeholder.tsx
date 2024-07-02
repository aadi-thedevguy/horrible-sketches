import { Brush } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import Image from "next/image";

export default function Placeholder() {
  return (
    <div className="flex flex-col gap-6 w-full items-center mt-24">
      <Image src="/preview.png" width={200} height={180} alt="logo" />
      <div>
        <h2 className="text-2xl font-bold">
          Looks like you have no Sketches yet
        </h2>
        <h4 className="text-base font-medium text-muted-foreground">
          Draw Your first Sketch now and start sharing it with the world
        </h4>
      </div>
      <Link
        className={buttonVariants({ className: "gap-2" })}
        href="/sketch/create"
      >
        <span>Create a Sketch</span>
        <Brush size={14} />
      </Link>
    </div>
  );
}
