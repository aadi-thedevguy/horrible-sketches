"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase/client";
import { toast } from "./ui/use-toast";
import { genericMessages } from "@/constants";

function SignOutButton() {

  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter()
  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message || genericMessages.SIGNOUT_FAILED,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(false);
    return router.push("/sign-in");
  };

  return (
    <Button
      variant="link"
      onClick={signOut}
      disabled={isLoading}
      className="disabled:opacity-70"
    >
      Sign Out
    </Button>
  );
}

export default SignOutButton;
