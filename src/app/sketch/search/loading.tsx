import GridPlaceholder from "@/components/dashboard/GridPlaceholder";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function loading() {
  return (
    <section className="max-w-screen-xl mx-auto p-6">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
        <Skeleton className="w-2/4 h-24 rounded-md" />
        <Skeleton className="w-1/4 h-24 rounded-md" />
        <Skeleton className="w-1/4 h-24 rounded-md" />
      </div>

      <GridPlaceholder />
    </section>
  );
}

export default loading;
