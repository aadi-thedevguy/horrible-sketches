"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="w-11/12 md:max-w-3xl flex items-center flex-col mx-auto my-10 h-screen">
      <Image width={200} height={180} src="/preview.png" alt="logo" />

      <Alert variant="destructive" className="my-4 max-w-xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{error.name}</AlertTitle>
        <AlertDescription>
          Uh Oh! Something went wrong. Please try again.
        </AlertDescription>
      </Alert>
      <div className="flex gap-4">
        <Button variant="ghost" className="mt-4 gap-1" onClick={() => reset()}>
          <RefreshCcw /> Try Again
        </Button>
      </div>
    </main>
  );
}
