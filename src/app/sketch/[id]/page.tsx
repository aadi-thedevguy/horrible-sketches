import { Eye, Paintbrush, TabletSmartphone } from "lucide-react";
import { getSketchById } from "@/server/queries/sketch";
import SketchView from "@/components/SketchView";
import Image from "next/image";
import { headers as getHeaders } from "next/headers";
import { notFound } from "next/navigation";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const FALLBACK_IP_ADDRESS = "0.0.0.0";

  const getIpAddress = async () => {
    const headers = await getHeaders();
    const ip = headers.get("x-real-ip");
    const forwardedFor = headers.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
    }

    return ip ?? FALLBACK_IP_ADDRESS;
  };

  const ip = await getIpAddress();
  const { id } = await params
  const { data, views } = await getSketchById(id, ip);
  if (!data) {
    return notFound();
  }
  return (
    <section className="max-w-xl mx-auto">
      <h1 className="hidden md:flex gap-2 items-center justify-center mb-8 text-3xl font-semibold ">
        <Paintbrush className="text-primary mr-1 w-8 h-8" />
        {data?.originalName}
      </h1>
      <div className="flex justify-between px-6 my-6">
        <h3 className="font-medium text-muted-foreground">
          Created on {data?.updatedAt.toLocaleDateString()}
        </h3>
        <div className="flex gap-2 text-secondary">
          <Eye />
          <h3 className="font-semibold ">{views} views</h3>
        </div>
        <h3 className="font-semibold">
          Made by{" "}
          <span className="text-primary underline italic">
            {data?.author.username}
          </span>
        </h3>
      </div>
      {/* For Mobile Screens */}
      <div className="sm:hidden w-full p-8">
        <header className="flex justify-center w-full mb-20">
          <Image width={180} height={32} src="/preview.png" alt="logo" />
        </header>
        <h1 className="flex justify-center gap-1 my-4 text-2xl font-semibold ">
          <span>Sorry, Screen is Too small</span>
          <TabletSmartphone className="text-primary mr-1 w-8 h-8" />
        </h1>
        <h2 className="text-xl font-medium mb-4">
          Switch to a bigger device or rotate your phone to view this sketch
        </h2>
      </div>
      {data && <SketchView data={data} />}
    </section>
  );
}

export default page;
