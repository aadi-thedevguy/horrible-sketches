import React from "react";
import Image from "next/image";
import type { sketch } from "@/lib/db/schema";

async function ImageGrid({ items }: { items: (typeof sketch)[] }) {
  return (
    // src={`https://picsum.photos/id/${i + 11}/2500/1667.jpg`}
    // <section className="p-4 gap-5 sm:columns-2 sm:gap-8 md:columns-3 [&>article:not(:first-child)]:my-4">
    <section className="p-4 grid gap-5 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
      {items.map((i, idx) => (
        <article key={idx}>
          <Image
            width={300}
            height={300}
            // @ts-ignore
            src={i.url}
            className={"w-full h-full object-cover rounded-lg shadow-lg"}
            alt="picture"
          />
        </article>
      ))}
    </section>
  );
}

export default ImageGrid;
