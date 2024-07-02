import GridPlaceholder from "@/components/dashboard/CardPlaceholder";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function Spinner() {
  return (
    <section className="max-w-screen-xl mx-auto p-6">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Your Sketches</h1>

        <Skeleton className="w-16 h-6 rounded-md" />
        <Skeleton className="w-10 h-6 rounded-md" />
      </div>
      <GridPlaceholder length={6} />
    </section>
  );
}

export default Spinner;
