import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Image = {
  url: string;
};
const items = Array.from({ length: 12 }, (_, i) => i);

function ImageGrid() {
  return (
    <section className="p-4 gap-5 sm:columns-2 sm:gap-8 md:columns-3 [&>article:not(:first-child)]:my-4">
      {items.map((i) => (
        <article key={i}>
          <Image
            width={300}
            height={200}
            className={cn("w-full rounded-md object-center aspect-square", {
              "aspect-video": i === 0 || i % 5 === 0,
            })}
            src="https://picsum.photos/id/18/2500/1667.jpg"
            alt="picture"
          />
        </article>
      ))}
    </section>
  );
}

export default ImageGrid;
