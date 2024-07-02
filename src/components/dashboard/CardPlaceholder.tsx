import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "../ui/card";

function GridPlaceholder({ length = 3 }: { length?: number }) {
  return (
    <div className="grid grid-cols-3 gap-4 my-4">
      {new Array(length).fill(0).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="w-52 h-6 rounded-md" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-52 w-72 rounded-xl" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default GridPlaceholder;
