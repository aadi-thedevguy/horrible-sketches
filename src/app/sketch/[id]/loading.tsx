import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function loading() {
  return (
    <div>
      <Skeleton className="w-80 h-9 mx-auto my-6 rounded-md" />
      <Skeleton className="min-h-80 w-96 mx-auto rounded-md" />
    </div>
  );
}

export default loading;
